import React, { useEffect, useState } from "react";

interface Order {
  price: number;
  qty: number;
}

interface OrderBookProps {
  symbol: string;
  limit?: number;
  onUpdate?: (bids: Order[], asks: Order[]) => void;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol, limit = 10, onUpdate }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    const fetchDepth = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`
        );
        if (!res.ok) throw new Error("depth fetch failed");
        const data = await res.json();
        const newBids = data.bids.map((b: any) => ({ price: +b[0], qty: +b[1] }));
        const newAsks = data.asks.map((a: any) => ({ price: +a[0], qty: +a[1] }));
        
        setBids(newBids);
        setAsks(newAsks);
        onUpdate?.(newBids, newAsks);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchDepth();

    ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );
    ws.onmessage = ev => {
      try {
        const payload = JSON.parse(ev.data);
        let newBids = bids;
        let newAsks = asks;

        if (payload.b) {
          newBids = payload.b.map((b: any) => ({ price: +b[0], qty: +b[1] }));
          setBids(newBids);
        }
        if (payload.a) {
          newAsks = payload.a.map((a: any) => ({ price: +a[0], qty: +a[1] }));
          setAsks(newAsks);
        }
        
        onUpdate?.(newBids, newAsks);
      } catch (e) {
        setError("ws decode error");
      }
    };
    ws.onerror = () => setError("ws error");
    return () => ws.close();
  }, [symbol, limit]);

  if (error) return <div>Error: {error}</div>;
  if (!bids.length && !asks.length) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <h4 className="font-semibold mb-1">Bids</h4>
        {bids.slice(0, limit).map(b => (
          <div key={`${b.price}-b`} className="flex justify-between">
            <span className="text-green-500">{b.price.toFixed(2)}</span>
            <span>{b.qty.toFixed(6)}</span>
          </div>
        ))}
      </div>
      <div>
        <h4 className="font-semibold mb-1">Asks</h4>
        {asks.slice(0, limit).map(a => (
          <div key={`${a.price}-a`} className="flex justify-between">
            <span className="text-red-500">{a.price.toFixed(2)}</span>
            <span>{a.qty.toFixed(6)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;