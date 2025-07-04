import React, { useEffect, useState } from "react";

interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

interface Props {
  quoteFilter?: string;
  onSelect?: (symbol: string) => void;
}

/**
 * Market search box fetching data from trading-service exchangeInfo GraphQL
 * query. Allows filtering by quote asset (e.g. USDT pairs).
 */
const MarketSearch: React.FC<Props> = ({ quoteFilter, onSelect }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    const fetchMarkets = async () => {
      const res = await fetch("http://localhost:5003/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "{ exchangeInfo }" }),
      });
      const json = await res.json();
      const symbols = json.data.exchangeInfo.symbols as any[];
      setMarkets(
        symbols.map(s => ({
          symbol: s.symbol,
          baseAsset: s.baseAsset,
          quoteAsset: s.quoteAsset,
        }))
      );
    };
    fetchMarkets();
  }, []);

  const filtered = markets.filter(m => {
    return (
      (!quoteFilter || m.quoteAsset === quoteFilter) &&
      m.symbol.toLowerCase().includes(term.toLowerCase())
    );
  });

  return (
    <div>
      <input
        className="border p-1 text-xs"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Search"
      />
      <div className="max-h-40 overflow-y-auto text-xs mt-1">
        {filtered.map(m => (
          <div
            key={m.symbol}
            onClick={() => onSelect && onSelect(m.symbol)}
            className="cursor-pointer hover:bg-gray-100 px-2"
          >
            {m.symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSearch;
