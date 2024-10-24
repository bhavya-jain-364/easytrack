"use client";
import { useState } from "react";

export default function TestPage() {
  const [stockPrice, setStockPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchStockPrice(stockSymbol: string) {
    try {
      const response = await fetch(`/api/stock?symbol=${stockSymbol}`);
      if (response.ok) {
        const data = await response.json();
        setStockPrice(`Current price of ${data.symbol}: ${data.price}`);
        setError(null); // Clear any previous error
      } else {
        setError("Failed to fetch stock price.");
        setStockPrice(null);
      }
    } catch (err) {
      setError("An error occurred while fetching the stock price.");
      setStockPrice(null);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Stock Price Fetcher</h1>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() => fetchStockPrice("AAPL")}
      >
        Fetch Apple (AAPL) Stock Price
      </button>

      <div className="mt-4">
        {stockPrice && <p>{stockPrice}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
