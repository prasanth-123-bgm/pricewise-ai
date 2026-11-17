
const { normalizeProduct } = require("../utils/normalizeProduct");

async function searchFlipkart(product) {
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!rapidApiKey) {
    return {
      items: [],
      error: "Missing RAPIDAPI_KEY on server",
    };
  }

  const host = "flipkart-api-by-api-sh.p.rapidapi.com";
  const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 15000);

  const url = new URL(`https://${host}/flipkart/v1/search`);

  url.searchParams.set("raw", "0");
  url.searchParams.set("sort", "relevance");
  url.searchParams.set("rating_min", "3");
  url.searchParams.set("output", "json");
  url.searchParams.set("assured", "true");
  url.searchParams.set("in_stock", "true");
  url.searchParams.set("fresh", "1");
  url.searchParams.set("q", product.trim());

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": host,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const statusErrors = {
        401: "RapidAPI authentication failed. Check your API key.",
        403: "Flipkart API access denied. Check your subscription.",
        404: "Flipkart API endpoint not found.",
        429: "RapidAPI request limit or quota exceeded.",
      };

      return {
        items: [],
        error:
          statusErrors[response.status] ||
          `Flipkart request failed with status ${response.status}`,
      };
    }

    const payload = await response.json();

    const rawItems = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.products)
        ? payload.products
        : Array.isArray(payload?.data?.products)
          ? payload.data.products
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

    const items = rawItems
      .slice(0, 5)
      .map((item) => normalizeProduct("flipkart", item))
      .filter((item) => item.title);

    return {
      items,
      error: items.length > 0 ? null : "No Flipkart products found",
    };
  } catch (error) {
    return {
      items: [],
      error:
        error.name === "AbortError"
          ? "Flipkart request timed out"
          : "Unable to retrieve Flipkart products",
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  searchFlipkart,
};
