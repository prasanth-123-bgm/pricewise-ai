const { runRapidApiSearch } = require("./baseProvider");

async function searchFlipkart(product) {
  const query = encodeURIComponent(product);
  const url = `https://real-time-flipkart.p.rapidapi.com/search.php?query=${query}&page=1&sort=relevance`;

  return runRapidApiSearch({
    providerName: "flipkart",
    host: "real-time-flipkart.p.rapidapi.com",
    url,
    itemSelector: (payload) => {
      if (Array.isArray(payload)) {
        return payload;
      }

      return payload?.data?.products || payload?.products || payload?.data || [];
    },
  });
}

module.exports = {
  searchFlipkart,
};
