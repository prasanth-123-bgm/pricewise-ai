export type Product = {
  source: string;
  title: string;
  price: number | null;
  priceText: string;
  originalPrice: number | null;
  originalPriceText: string | null;
  currency: string;
  image: string;
  url: string;
  rating: string | number | null;
  reviews: string | number | null;
  availability: string;
};

export type SearchResponse = {
  query: string;
  results: {
    amazon: Product[];
    flipkart: Product[];
  };
  errors: {
    amazon: string | null;
    flipkart: string | null;
  };
  meta: {
    cache: string;
    generatedAt: string;
  };
};

export type HealthResponse = {
  status: string;
  timestamp: string;
  service: string;
};
