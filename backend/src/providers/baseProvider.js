const { normalizeProduct } = require("../utils/normalizeProduct");

async function runRapidApiSearch({ providerName, host, url, itemSelector }) {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 8000);

  if (!rapidApiKey) {
    return {
      items: [],
      error: "Missing RAPIDAPI_KEY on server",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": host,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        items: [],
        error: `${providerName} request failed with status ${response.status}`,
      };
    }

    const payload = await response.json();
    const rawItems = itemSelector(payload);

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return {
        items: [],
        error: "Not Available",
      };
    }

    const items = rawItems
      .slice(0, 5)
      .map((item) => normalizeProduct(providerName, item))
      .filter((item) => item.title);

    return {
      items,
      error: items.length > 0 ? null : "Not Available",
    };
  } catch (error) {
    const message =
      error.name === "AbortError"
        ? `${providerName} request timed out`
        : `${providerName} request error`;

    return {
      items: [],
      error: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  runRapidApiSearch,
};
