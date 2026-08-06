function extractPriceValue(input) {
  if (input === null || input === undefined) {
    return null;
  }

  const raw = String(input).replace(/,/g, "");
  const match = raw.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function normalizeProduct(source, item) {
  const title =
    item?.product_title ||
    item?.title ||
    item?.name ||
    item?.product_name ||
    "";

  const url =
    item?.product_url ||
    item?.url ||
    item?.product_link ||
    item?.link ||
    item?.productUrl ||
    "";

  const image =
    item?.product_photo ||
    item?.image ||
    item?.thumbnail ||
    item?.product_image ||
    item?.image_url ||
    "";

  const priceText =
    item?.product_price ||
    item?.sale_price ||
    item?.price ||
    item?.discounted_price ||
    "";

  const originalPriceText =
    item?.product_original_price ||
    item?.mrp ||
    item?.original_price ||
    "";

  const rating =
    item?.product_star_rating ||
    item?.rating?.average ||
    item?.rating ||
    null;

  const reviews =
    item?.product_num_ratings ||
    item?.ratings_count ||
    item?.rating?.count ||
    item?.rating_count ||
    null;

  return {
    source,
    title,
    price: extractPriceValue(priceText),
    priceText: priceText ? `Rs. ${priceText}` : "Price unavailable",
    originalPrice: extractPriceValue(originalPriceText),
    originalPriceText: originalPriceText ? `Rs. ${originalPriceText}` : null,
    currency: "INR",
    image,
    url,
    rating,
    reviews,
    availability: title ? "available" : "not_available",
  };
}

module.exports = {
  normalizeProduct,
};
