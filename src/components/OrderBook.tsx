import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import TradingOrderBook from "./trading/OrderBook";

interface FormattedOrder {
  price: string;
  amount: string;
  total: string;
}

interface OrderBookProps {
  symbol?: string;
}

const OrderBook: React.FC<OrderBookProps> = ({
  symbol = "BTCUSDT",
}) => {
  const { isDark } = useTheme();
  const [asks, setAsks] = useState<FormattedOrder[]>([]);
  const [bids, setBids] = useState<FormattedOrder[]>([]);
  const [currentPrice, setCurrentPrice] = useState("0.00");
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(null);
  const previousPriceRef = useRef<number>(0);
  const visibleRows = 20;

  const formatOrders = (orders: { price: number; qty: number }[]): FormattedOrder[] => {
    return orders.slice(0, visibleRows).map(order => ({
      price: order.price.toFixed(2),
      amount: order.qty.toFixed(5),
      total: (order.price * order.qty).toFixed(2),
    }));
  };

  const handleOrderUpdate = (
    newBids: { price: number; qty: number }[],
    newAsks: { price: number; qty: number }[]
  ) => {
    setBids(formatOrders(newBids));
    setAsks(formatOrders(newAsks));

    if (newAsks[0] && newBids[0]) {
      const midPrice = (newAsks[0].price + newBids[0].price) / 2;
      const newPrice = parseFloat(midPrice.toFixed(2));
      const previousPrice = previousPriceRef.current;

      if (previousPrice !== 0) {
        if (newPrice > previousPrice) {
          setPriceDirection("up");
        } else if (newPrice < previousPrice) {
          setPriceDirection("down");
        }
        // If unchanged, do nothing
      }

      previousPriceRef.current = newPrice;
      setCurrentPrice(newPrice.toFixed(2));
    }
  };

  const priceColorClass =
    priceDirection === "up"
      ? "text-green-500"
      : priceDirection === "down"
      ? "text-red-500"
      : isDark
      ? "text-white"
      : "text-gray-900";

  const arrowIcon =
    priceDirection === "up" ? "▲" : priceDirection === "down" ? "▼" : "";

  return (
    <div
      className={`w-full lg:w-80 border-r transition-colors ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="hidden">
        <TradingOrderBook
          symbol={symbol}
          limit={visibleRows * 2}
          onUpdate={handleOrderUpdate}
        />
      </div>

      <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Order Book
        </h3>
      </div>

      <div className="flex h-full flex-col">
        <div
          className={`grid grid-cols-3 gap-4 px-4 py-2 text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-600"
          } border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div>Price (USDT)</div>
          <div className="text-right">Amount (BTC)</div>
          <div className="text-right">Total</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {asks.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 px-4 py-1 text-xs hover:bg-red-500/10 transition-colors"
            >
              <div className="text-red-500 font-mono">{order.price}</div>
              <div
                className={`text-right font-mono ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {order.amount}
              </div>
              <div
                className={`text-right font-mono ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {order.total}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`px-4 py-3 border-y ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`text-lg font-bold font-mono flex items-center gap-2 ${priceColorClass}`}>
              {currentPrice}
              {arrowIcon && <span className="text-xs">{arrowIcon}</span>}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {bids.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 px-4 py-1 text-xs hover:bg-green-500/10 transition-colors"
            >
              <div className="text-green-500 font-mono">{order.price}</div>
              <div
                className={`text-right font-mono ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {order.amount}
              </div>
              <div
                className={`text-right font-mono ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {order.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
