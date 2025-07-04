import React, { useEffect } from "react";

interface TickerData {
  symbol: string;
  price: number;
  percent: number;
}

interface TickerProps {
  symbol: string;
  onUpdate: (data: TickerData) => void;
}

const Ticker: React.FC<TickerProps> = ({ symbol, onUpdate }) => {
  useEffect(() => {
    // Only setup WebSocket for real-time updates
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
    );
    
    ws.onmessage = ev => {
      const d = JSON.parse(ev.data);
      onUpdate({
        symbol,
        price: parseFloat(d.c), 
        percent: parseFloat(d.P)
      });
    };

    return () => ws.close();
  }, [symbol, onUpdate]);

  return null;
};

export default Ticker;