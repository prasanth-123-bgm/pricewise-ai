const searchForm = document.getElementById("searchForm");
const productInput = document.getElementById("productInput");
const searchButton = document.getElementById("searchButton");
const statusElement = document.getElementById("status");
const resultsSection = document.getElementById("resultsSection");
const resultsTitle = document.getElementById("resultsTitle");
const cacheBadge = document.getElementById("cacheBadge");
const amazonResults = document.getElementById("amazonResults");
const flipkartResults = document.getElementById("flipkartResults");
const amazonError = document.getElementById("amazonError");
const flipkartError = document.getElementById("flipkartError");

function formatCurrency(amount, fallbackText) {
  if (typeof amount !== "number") {
    return fallbackText || "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function createProductCard(item) {
  const image = item.image
    ? `<img src="${item.image}" alt="${item.title}" loading="lazy" />`
    : `<div class="empty-state">No image</div>`;

  const ratingText =
    item.rating || item.reviews
      ? `Rating: ${item.rating || "N/A"} | Reviews: ${item.reviews || "N/A"}`
      : "Ratings unavailable";

  return `
    <article class="product-card">
      ${image}
      <div>
        <h4 class="product-title">${item.title}</h4>
        <div class="price-row">
          <p class="price">${formatCurrency(item.price, item.priceText)}</p>
          ${
            item.originalPrice
              ? `<span class="original-price">${formatCurrency(item.originalPrice, item.originalPriceText)}</span>`
              : ""
          }
        </div>
        <p class="meta">${ratingText}</p>
        ${
          item.url
            ? `<a class="product-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Open product</a>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderColumn(container, items) {
  if (!items || items.length === 0) {
    container.innerHTML = `<div class="empty-state">No products found for this marketplace.</div>`;
    return;
  }

  container.innerHTML = items.map(createProductCard).join("");
}

async function handleSearch(event) {
  event.preventDefault();

  const product = productInput.value.trim();
  if (!product) {
    statusElement.textContent = "Enter a product name to compare prices.";
    return;
  }

  searchButton.disabled = true;
  statusElement.textContent = "Searching Amazon and Flipkart...";

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    const data = await response.json();

    if (!response.ok) {
      statusElement.textContent = data.error || "Search failed.";
      resultsSection.classList.add("hidden");
      return;
    }

    resultsTitle.textContent = `Marketplace Comparison for "${data.query}"`;
    cacheBadge.textContent = data.meta?.cache === "hit" ? "Cache hit" : "Fresh fetch";
    amazonError.textContent = data.errors?.amazon || "";
    flipkartError.textContent = data.errors?.flipkart || "";

    renderColumn(amazonResults, data.results?.amazon || []);
    renderColumn(flipkartResults, data.results?.flipkart || []);

    resultsSection.classList.remove("hidden");
    statusElement.textContent = `Search completed at ${new Date(data.meta.generatedAt).toLocaleTimeString()}.`;
  } catch (error) {
    statusElement.textContent = "Server connection failed. Check that the backend is running.";
    resultsSection.classList.add("hidden");
  } finally {
    searchButton.disabled = false;
  }
}

searchForm.addEventListener("submit", handleSearch);
