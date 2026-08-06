const { searchAmazon } = require("../providers/amazonProvider");
const { searchFlipkart } = require("../providers/flipkartProvider");
const { getCache, setCache } = require("../utils/cache");

function shouldCacheResponse(response) {
  const errors = Object.values(response.errors || {}).filter(Boolean);
  return errors.every((error) => !String(error).includes("request failed"));
}

async function searchAllProviders(product) {
  const cacheKey = `search:${product.toLowerCase()}`;
  const cachedResult = getCache(cacheKey);

  if (cachedResult) {
    return {
      ...cachedResult,
      meta: {
        ...cachedResult.meta,
        cache: "hit",
      },
    };
  }

  const [amazonResult, flipkartResult] = await Promise.allSettled([
    searchAmazon(product),
    searchFlipkart(product),
  ]);

  const response = {
    query: product,
    results: {
      amazon: amazonResult.status === "fulfilled" ? amazonResult.value.items : [],
      flipkart: flipkartResult.status === "fulfilled" ? flipkartResult.value.items : [],
    },
    errors: {
      amazon:
        amazonResult.status === "fulfilled" ? amazonResult.value.error : "Provider request failed",
      flipkart:
        flipkartResult.status === "fulfilled" ? flipkartResult.value.error : "Provider request failed",
    },
    meta: {
      cache: "miss",
      generatedAt: new Date().toISOString(),
    },
  };

  if (shouldCacheResponse(response)) {
    setCache(cacheKey, response);
  }

  return response;
}

module.exports = {
  searchAllProviders,
};
