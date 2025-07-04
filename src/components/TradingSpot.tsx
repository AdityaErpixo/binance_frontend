// TradingSpot.tsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import BuySellModal from "./BuySellModal";

const TradingSpot: React.FC = () => {
  const { isDark } = useTheme();
  const [buyOrderType, setBuyOrderType] = useState("Limit");
  const [sellOrderType, setSellOrderType] = useState("Limit");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"buy" | "sell">("buy");
  
  // Buy form state
  const [buyAmount, setBuyAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("0");
  const [buyTotal, setBuyTotal] = useState("");
  
  // Sell form state
  const [sellAmount, setSellAmount] = useState("");
  const [sellPrice, setSellPrice] = useState("0");
  const [sellTotal, setSellTotal] = useState("");

  // Calculate totals
  React.useEffect(() => {
    if (buyAmount && buyPrice) {
      const calculatedTotal = parseFloat(buyAmount) * parseFloat(buyPrice);
      setBuyTotal(isNaN(calculatedTotal) ? "" : calculatedTotal.toFixed(2));
    } else {
      setBuyTotal("");
    }
  }, [buyAmount, buyPrice]);

  React.useEffect(() => {
    if (sellAmount && sellPrice) {
      const calculatedTotal = parseFloat(sellAmount) * parseFloat(sellPrice);
      setSellTotal(isNaN(calculatedTotal) ? "" : calculatedTotal.toFixed(2));
    } else {
      setSellTotal("");
    }
  }, [sellAmount, sellPrice]);

  const handleBuyClick = () => {
    setModalAction("buy");
    setModalOpen(true);
  };

  const handleSellClick = () => {
    setModalAction("sell");
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Buy BTC Form */}
        <div className={`rounded-lg p-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-green-500 font-semibold">Buy BTC</h4>
            <div className="flex space-x-2">
              {["Limit", "Market", "Stop Limit"].map((type) => (
                <button
                  key={type}
                  onClick={() => setBuyOrderType(type)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    buyOrderType === type
                      ? "bg-green-500 text-white"
                      : `${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Price (USDT)</label>
              <div className="relative">
                <input
                  type="text"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  USDT
                </span>
              </div>
            </div>

            <div>
              <label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Amount (BTC)</label>
              <div className="relative">
                <input
                  type="text"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0"
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  BTC
                </span>
              </div>
            </div>

            <div>
              <label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total (USDT)</label>
              <div className="relative">
                <input
                  type="text"
                  value={buyTotal}
                  readOnly
                  placeholder="0"
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  USDT
                </span>
              </div>
            </div>

            <button 
              onClick={handleBuyClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold transition-colors"
            >
              Buy BTC
            </button>
          </div>
        </div>

        {/* Sell USDT Form */}
        <div className={`rounded-lg p-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-red-500 font-semibold">Sell USDT</h4>
            <div className="flex space-x-2">
              {["Limit", "Market", "Stop Limit"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSellOrderType(type)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    sellOrderType === type
                      ? "bg-red-500 text-white"
                      : `${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Price (BTC)</label>
              <div className="relative">
                <input
                  type="text"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  BTC
                </span>
              </div>
            </div>

            <div>
              <label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Amount (USDT)</label>
              <div className="relative">
                <input
                  type="text"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="0"
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  USDT
                </span>
              </div>
            </div>

            <div>
              <label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total (BTC)</label>
              <div className="relative">
                <input
                  type="text"
                  value={sellTotal}
                  readOnly
                  placeholder="0"
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  BTC
                </span>
              </div>
            </div>

            <button 
              onClick={handleSellClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold transition-colors"
            >
              Sell USDT
            </button>
          </div>
        </div>
      </div>
    
      <BuySellModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        action={modalAction}
        orderType={modalAction === 'buy' ? buyOrderType : sellOrderType}
        amount={modalAction === 'buy' ? buyAmount : sellAmount}
        price={modalAction === 'buy' ? buyPrice : sellPrice}
        total={modalAction === 'buy' ? buyTotal : sellTotal}
      />
    </>
  );
};

export default TradingSpot;