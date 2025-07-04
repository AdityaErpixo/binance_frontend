import React, { useEffect, useState } from "react";

interface Trade {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

interface TradeListProps {
  symbol: string;
  isDark?: boolean;
}

const TradeList: React.FC<TradeListProps> = ({ symbol, isDark }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
    );
    ws.onmessage = ev => {
      const data = JSON.parse(ev.data);
      setTrades(t => [
        {
          id: data.t,
          price: +data.p,
          qty: +data.q,
          time: data.T,
          isBuyerMaker: data.m,
        },
        ...t.slice(0, 29), // Keep only 30 trades
      ]);
    };
    return () => ws.close();
  }, [symbol]);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatAmount = (amount: number): string => {
    return amount.toFixed(6);
  };

  return (
    <>
      {trades.map((trade) => (
        <div key={trade.id} className="grid grid-cols-3 gap-4 py-1 text-xs">
          <div className={`text-left font-mono ${
            trade.isBuyerMaker ? 'text-red-400' : 'text-green-400'
          }`}>
            {formatPrice(trade.price)}
          </div>
          <div className={`text-right font-mono ${
            isDark ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {formatAmount(trade.qty)}
          </div>
          <div className={`text-right font-mono ${
            isDark ? 'text-gray-400' : 'text-gray-800'
          }`}>
            {formatTime(trade.time)}
          </div>
        </div>
      ))}
    </>
  );
};

export default TradeList;