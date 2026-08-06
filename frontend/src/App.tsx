import { FormEvent, useEffect, useMemo, useState } from "react";
import { getHealth, searchProductsGet, searchProductsPost } from "./api";
import type { HealthResponse, Product, SearchResponse } from "./types";

const suggestions = ["iPhone 15", "Bluetooth Speaker", "Gaming Laptop", "Smart Watch"];

function formatCurrency(amount: number | null, fallback: string) {
  if (typeof amount !== "number") {
    return fallback || "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    const nextText = isDeleting
      ? currentWord.slice(0, Math.max(text.length - 1, 0))
      : currentWord.slice(0, text.length + 1);

    const timeout = window.setTimeout(() => {
      setText(nextText);

      if (!isDeleting && nextText === currentWord) {
        window.setTimeout(() => setIsDeleting(true), 900);
        return;
      }

      if (isDeleting && nextText.length === 0) {
        setIsDeleting(false);
        setWordIndex((value) => (value + 1) % words.length);
      }
    }, isDeleting ? 55 : 110);

    return () => window.clearTimeout(timeout);
  }, [isDeleting, text, wordIndex, words]);

  return text;
}

function ProductCard({ item, accent }: { item: Product; accent: string }) {
  const ratingLabel =
    item.rating || item.reviews
      ? `${item.rating || "N/A"} stars | ${item.reviews || "N/A"} reviews`
      : "Ratings unavailable";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_22px_70px_rgba(9,4,24,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/25">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="grid gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[22px] bg-white/8">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-28 w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-28 items-center justify-center text-xs uppercase tracking-[0.4em] text-white/60">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.45em] text-white/45">{item.source}</p>
          <h3 className="line-clamp-2 text-lg font-semibold text-white">{item.title}</h3>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <p className="text-2xl font-bold text-white">{formatCurrency(item.price, item.priceText)}</p>
            {item.originalPrice ? (
              <span className="text-sm text-white/45 line-through">
                {formatCurrency(item.originalPrice, item.originalPriceText || "")}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-white/65">{ratingLabel}</p>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Open product
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function MarketplaceColumn({
  title,
  subtitle,
  items,
  error,
  accent,
}: {
  title: string;
  subtitle: string;
  items: Product[];
  error: string | null;
  accent: string;
}) {
  return (
    <section className="rounded-[32px] border border-white/14 bg-white/10 p-5 shadow-[0_28px_90px_rgba(10,5,26,0.36)] backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">{subtitle}</p>
          <h2 className="mt-2 font-display text-2xl text-white">{title}</h2>
        </div>
        <span
          className={`rounded-full border border-white/15 bg-gradient-to-r px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white ${accent}`}
        >
          Live
        </span>
      </div>

      {error ? <p className="mb-4 text-sm text-rose-200/90">{error}</p> : null}

      <div className="grid gap-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <ProductCard key={`${title}-${item.title}-${index}`} item={item} accent={accent} />
          ))
        ) : (
          <div className="rounded-[26px] border border-dashed border-white/15 bg-black/10 p-10 text-center text-sm text-white/55">
            No products found for {title} yet.
          </div>
        )}
      </div>
    </section>
  );
}

function GlobeNetwork() {
  const points = useMemo(
    () => [
      { top: "12%", left: "48%" },
      { top: "24%", left: "68%" },
      { top: "46%", left: "77%" },
      { top: "68%", left: "64%" },
      { top: "79%", left: "47%" },
      { top: "64%", left: "27%" },
      { top: "42%", left: "18%" },
      { top: "22%", left: "32%" },
    ],
    [],
  );

  return (
    <div className="globe-shell">
      <div className="globe-grid" />
      <div className="globe-ring globe-ring-one" />
      <div className="globe-ring globe-ring-two" />
      <div className="globe-ring globe-ring-three" />
      {points.map((point, index) => (
        <span
          key={index}
          className="globe-point"
          style={{ top: point.top, left: point.left, animationDelay: `${index * 0.4}s` }}
        />
      ))}
      <span className="globe-orbit-dot" />
    </div>
  );
}

function FloatingIcons() {
  const items = ["USD", "INR", "SALE", "TECH", "BAG", "COIN", "SHOP", "MOB", "STYLE", "CART"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="floating-symbol"
          style={{
            left: `${8 + index * 9}%`,
            animationDelay: `${index * 0.7}s`,
            animationDuration: `${10 + (index % 4)}s`,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const typedWord = useTypewriter(["gadgets", "fashion finds", "smart deals", "future carts"]);
  const [searchTerm, setSearchTerm] = useState("iPhone 15");
  const [statusMessage, setStatusMessage] = useState("Ready to compare the next big buy.");
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    getHealth()
      .then((data) => setHealth(data))
      .catch(() => {
        setHealth(null);
      });
  }, []);

  async function runSearch(product: string, mode: "POST" | "GET") {
    const cleanValue = product.trim();
    if (!cleanValue) {
      setStatusMessage("Type a product name to unlock both marketplaces.");
      return;
    }

    setIsSearching(true);
    setStatusMessage(`Searching with ${mode} for "${cleanValue}"...`);

    try {
      const data = mode === "POST" ? await searchProductsPost(cleanValue) : await searchProductsGet(cleanValue);
      setSearchData(data);
      setStatusMessage(
        `Comparison ready. ${data.meta.cache === "hit" ? "Loaded from cache." : "Fetched fresh from backend."}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Search failed";
      setStatusMessage(message);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(searchTerm, "POST");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05010f] text-white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,#5a2ea6_0%,#180625_35%,#05010f_70%)]" />
      <div className="fixed inset-0 -z-10 opacity-80">
        <div className="hero-aurora hero-aurora-one" />
        <div className="hero-aurora hero-aurora-two" />
        <div className="hero-aurora hero-aurora-three" />
        <div className="wave-field" />
      </div>

      <header className="sticky top-0 z-30 mx-auto flex w-[min(1180px,92vw)] items-center justify-between rounded-b-[28px] border-x border-b border-white/10 bg-white/8 px-5 py-4 shadow-[0_20px_60px_rgba(7,3,20,0.35)] backdrop-blur-2xl md:px-8">
        <div>
          <p className="font-display text-lg tracking-[0.35em] text-white">PRICEWISE AI</p>
          <p className="text-xs uppercase tracking-[0.32em] text-white/45">compare with style</p>
        </div>
        <nav className="hidden items-center gap-3 text-sm text-white/75 md:flex">
          <a href="#home" className="rounded-full px-4 py-2 transition hover:bg-white/10">Home</a>
          <a href="#compare" className="rounded-full px-4 py-2 transition hover:bg-white/10">Compare</a>
          <a href="#how" className="rounded-full px-4 py-2 transition hover:bg-white/10">How It Works</a>
        </nav>
      </header>

      <main className="mx-auto w-[min(1180px,92vw)] pb-24">
        <section id="home" className="relative grid min-h-[92vh] items-center gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.4em] text-white/70 backdrop-blur-xl">
              Search once. Scan both stores. Save smarter.
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.45em] text-orange-200/80">Welcome to your royal shopping radar</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] text-white md:text-7xl">
                Discover premium prices for
                <span className="block bg-gradient-to-r from-violet-200 via-white to-orange-200 bg-clip-text text-transparent">
                  {typedWord}
                  <span className="animate-pulse text-white">|</span>
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/72">
                A futuristic comparison lounge for gadgets, streetwear, accessories, and everything worth tracking. Float through live prices, elegant cards, and a premium experience crafted to feel rare.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#compare"
                className="rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-violet-600 px-7 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_40px_rgba(201,74,56,0.35)] transition hover:-translate-y-0.5"
              >
                Let's Explore
              </a>
              <button
                type="button"
                onClick={() => void runSearch("iPhone 15", "GET")}
                className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur-xl transition hover:bg-white/15"
              >
                Demo with GET
              </button>
            </div>
            <div className="grid gap-4 text-sm text-white/65 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">API status: {health?.status === "ok" ? "Connected" : "Waiting"}</div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">Method mix: POST search + GET search/health</div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">Cache mode: {searchData?.meta.cache || "standby"}</div>
            </div>
          </div>

          <div className="relative flex min-h-[520px] items-center justify-center">
            <div className="device-orbit device-orbit-one" />
            <div className="device-orbit device-orbit-two" />
            <div className="hero-device-card">
              <div className="hero-device-inner">
                <p className="text-xs uppercase tracking-[0.45em] text-white/40">Price Signal</p>
                <p className="mt-4 text-3xl font-semibold text-white">Find standout deals</p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-white/60">
                  Premium visuals outside, reliable API aggregation underneath.
                </p>
              </div>
            </div>
            <GlobeNetwork />
          </div>
        </section>

        <section id="compare" className="relative overflow-hidden rounded-[40px] border border-white/10 bg-black/20 px-5 py-10 shadow-[0_40px_120px_rgba(3,1,12,0.45)] backdrop-blur-xl md:px-8">
          <FloatingIcons />
          <div className="relative z-10">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-violet-200/75">Main comparison arena</p>
                <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Search, compare, and decide in a single sweep</h2>
                <p className="mt-3 max-w-2xl text-white/65">
                  Enter any product and compare Amazon and Flipkart side by side in a richer, cleaner layout.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/65 backdrop-blur-xl">
                {statusMessage}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 rounded-[34px] border border-white/14 bg-white/10 p-4 shadow-[0_20px_60px_rgba(9,5,24,0.28)] backdrop-blur-2xl lg:grid-cols-[1fr_auto_auto]">
              <label className="sr-only" htmlFor="product-search">Product name</label>
              <input
                id="product-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search gadgets, sneakers, speakers, watches..."
                className="rounded-[24px] border border-white/10 bg-black/25 px-6 py-5 text-lg text-white outline-none placeholder:text-white/30 focus:border-orange-300/60"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="rounded-[24px] bg-gradient-to-r from-violet-600 via-indigo-500 to-red-500 px-6 py-5 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
              >
                {isSearching ? "Searching" : "Search"}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSearchTerm(item)}
                  className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/14"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-2">
              <MarketplaceColumn
                title="Amazon"
                subtitle="Marketplace One"
                items={searchData?.results.amazon || []}
                error={searchData?.errors.amazon || null}
                accent="from-orange-400 via-red-500 to-violet-500"
              />
              <MarketplaceColumn
                title="Flipkart"
                subtitle="Marketplace Two"
                items={searchData?.results.flipkart || []}
                error={searchData?.errors.flipkart || null}
                accent="from-indigo-400 via-violet-500 to-orange-400"
              />
            </div>
          </div>
        </section>

        <section id="how" className="grid gap-6 py-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[34px] border border-white/10 bg-white/8 p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.45em] text-orange-200/70">How it works</p>
            <h2 className="mt-4 font-display text-4xl text-white">Simple flow, premium feel</h2>
            <p className="mt-4 max-w-xl leading-8 text-white/65">
              Start from the welcome page, send your product name to the backend, and compare curated marketplace responses in a clean dual-grid layout.
            </p>
          </div>

          <div className="grid gap-5">
            {[
              {
                step: "Step 1",
                title: "Enter a product you want to track",
                text: "Use the glassmorphism search bar to send the product name to the backend.",
              },
              {
                step: "Step 2",
                title: "Backend fetches Amazon and Flipkart",
                text: "The API aggregates, normalizes, and caches marketplace data before sending it back.",
              },
              {
                step: "Step 3",
                title: "Compare results and open the best match",
                text: "Read the cards, scan price and ratings, then jump straight to the marketplace listing.",
              },
            ].map((item) => (
              <article key={item.step} className="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.45em] text-violet-200/75">{item.step}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-white/62">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={() => setChatOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-orange-400 px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_18px_50px_rgba(85,44,165,0.4)]"
      >
        {chatOpen ? "Close Support" : "Chat Support"}
      </button>

      {chatOpen ? (
        <aside className="fixed bottom-24 right-6 z-40 w-[min(360px,calc(100vw-2rem))] rounded-[30px] border border-white/12 bg-black/45 p-5 shadow-[0_30px_90px_rgba(5,1,16,0.55)] backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.45em] text-orange-200/70">Support</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Need help choosing?</h3>
          <p className="mt-3 text-sm leading-7 text-white/65">
            Start with a product name, compare both cards, and watch the status badge for fresh fetch or cache-hit feedback. The backend also exposes GET health and GET search.
          </p>
          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/8 p-4 text-sm text-white/70">
            Tip: try a gadget keyword first for the fastest visible result set.
          </div>
        </aside>
      ) : null}
    </div>
  );
}
