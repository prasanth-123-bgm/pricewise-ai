import type { HealthResponse, SearchResponse } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function searchProductsPost(product: string): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product }),
  });

  return parseJson<SearchResponse>(response);
}

export async function searchProductsGet(product: string): Promise<SearchResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/search?product=${encodeURIComponent(product)}`,
  );

  return parseJson<SearchResponse>(response);
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return parseJson<HealthResponse>(response);
}
