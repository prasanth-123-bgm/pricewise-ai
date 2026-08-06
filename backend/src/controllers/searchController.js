const { searchAllProviders } = require("../services/searchService");

function getRequestedProduct(req) {
  if (typeof req.body?.product === "string") {
    return req.body.product;
  }

  if (typeof req.query?.product === "string") {
    return req.query.product;
  }

  return "";
}

async function searchController(req, res) {
  const product = getRequestedProduct(req);

  if (typeof product !== "string" || product.trim().length < 2) {
    return res.status(400).json({
      error: "Please provide a product name with at least 2 characters.",
    });
  }

  try {
    const result = await searchAllProviders(product.trim());
    return res.json(result);
  } catch (error) {
    console.error("Search controller error:", error);
    return res.status(500).json({
      error: "Unexpected server error. Please try again later.",
    });
  }
}

module.exports = {
  searchController,
};
