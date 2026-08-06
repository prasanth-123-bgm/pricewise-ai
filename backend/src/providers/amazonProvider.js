const { runRapidApiSearch } = require("./baseProvider");

async function searchAmazon(product) {
  const query = encodeURIComponent(product);
  const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${query}&country=IN&language=en_IN&page=1`;

  return runRapidApiSearch({
    providerName: "amazon",
    host: "real-time-amazon-data.p.rapidapi.com",
    url,
    itemSelector: (payload) => payload?.data?.products || payload?.data || [],
  });
}

module.exports = {
  searchAmazon,
};
