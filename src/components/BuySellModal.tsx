// BuySellModal.tsx
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

interface TradeData {
  userId: number;
  orderType: string;
  orderPair: string;
  priceType: string;
  price: number;
  amount: number;
  walletType: string;
}

interface BuySellModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "buy" | "sell";
  orderType: string;
  amount: string;
  price: string;
  total: string;
}

const executeTrade = async (tradeData: TradeData) => {
  const response = await axios.post(
    'https://keyword-countries-womens-pam.trycloudflare.com/api/order.add',
    tradeData
  );
  return response.data;
};

const BuySellModal = ({ isOpen, onClose, action, orderType, amount, price, total }: BuySellModalProps) => {
  const [showMore, setShowMore] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const tradeMutation = useMutation({
    mutationFn: (data: Omit<TradeData, 'userId'>) => {
      // In a real app, get userId from auth context
      const userId = +JSON.parse(localStorage.getItem('user') || '{}').id; // Replace with actual user ID
      return executeTrade({ ...data, userId });
    },
    onSuccess: () => {
      toast.success(`${action === 'buy' ? 'BTC purchase' : 'USDT sale'} executed successfully!`);
      onClose();
      setShowConfirmation(false);
    },
    onError: (error: any) => {
      toast.error(`Trade failed: ${error.message}`);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
        setShowConfirmation(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleBuyBTCClick = () => {
    window.open('/buy-sell-crypto', '_blank');
    onClose();
  };

  const handleTradeConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleTradeExecution = () => {
    const tradeData = {
      orderType: action.toUpperCase(),
      orderPair: action === 'buy' ? "BTCUSDT" : "USDTBTC",
      priceType: orderType.toUpperCase().replace(' ', '_'),
      price: parseFloat(price) || 1,
      amount: parseFloat(amount) || 0,
      walletType: "Spot"
    };

    tradeMutation.mutate(tradeData);
  };

  if (!isOpen) return null;

  // Theme colors
  const bgColor = isDark ? "bg-[#1e2329]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-gray-400" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const itemBgColor = isDark ? "bg-[#1e2329]" : "bg-gray-50";
  const itemHoverBgColor = isDark ? "hover:bg-gray-750" : "hover:bg-gray-100";
  const itemBorderColor = isDark ? "border-[#2b3139]" : "border-gray-300";
  const itemHoverBorderColor = isDark ? "hover:border-white" : "hover:border-gray-400";
  const actionColor = action === 'buy' ? 'green' : 'red';
  const actionTextColor = `text-${actionColor}-500`;
  const actionBgColor = `bg-${actionColor}-500 hover:bg-${actionColor}-600`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className={`${bgColor} rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto`}
        style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <h2 className={`${textColor} text-xl font-semibold`}>
            {showConfirmation 
              ? `Confirm ${action === 'buy' ? 'BTC Purchase' : 'USDT Sale'}` 
              : action === 'buy' ? 'Buy BTC Options' : 'Sell USDT Options'}
          </h2>
          <button
            onClick={() => {
              onClose();
              setShowConfirmation(false);
            }}
            className={`${secondaryTextColor} hover:text-gray-900 dark:hover:text-white transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {showConfirmation ? (
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className={`${secondaryTextColor}`}>Order Type:</span>
                <span className={`${textColor} font-medium`}>{orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${secondaryTextColor}`}>Action:</span>
                <span className={`${textColor} font-medium ${actionTextColor}`}>
                  {action === 'buy' ? 'Buy BTC' : 'Sell USDT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${secondaryTextColor}`}>Amount:</span>
                <span className={`${textColor} font-medium`}>
                  {amount} {action === 'buy' ? 'BTC' : 'USDT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${secondaryTextColor}`}>Price:</span>
                <span className={`${textColor} font-medium`}>
                  {price} {action === 'buy' ? 'USDT' : 'BTC'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${secondaryTextColor}`}>Total:</span>
                <span className={`${textColor} font-medium`}>
                  {total} {action === 'buy' ? 'USDT' : 'BTC'}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={tradeMutation.isPending}
                className={`px-4 py-2 rounded border ${borderColor} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleTradeExecution}
                disabled={tradeMutation.isPending}
                className={`px-4 py-2 rounded text-white ${actionBgColor} transition-colors disabled:opacity-50`}
              >
                {tradeMutation.isPending ? 'Processing...' : `Confirm ${action === 'buy' ? 'Buy' : 'Sell'}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className={`${secondaryTextColor} text-sm mb-6 leading-relaxed`}>
              {action === 'buy' 
                ? "Choose how you want to buy BTC or proceed with your order." 
                : "Choose how you want to sell USDT or proceed with your order."}
            </p>

            <div className="space-y-4">
              {/* P2P Option */}
              <div className={`flex items-center border ${itemBorderColor} p-4 ${itemBgColor} rounded-lg ${itemHoverBgColor} ${itemHoverBorderColor} transition-colors cursor-pointer group`}>
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-full mr-4 flex-shrink-0">
                  <div className="flex">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`${textColor} font-medium mb-1`}>
                    {action === 'buy' ? 'Buy with INR (P2P)' : 'Sell for INR (P2P)'}
                  </h3>
                  <p className={`${secondaryTextColor} text-sm`}>
                    {action === 'buy' 
                      ? 'Buy BTC directly from users with competitive pricing.' 
                      : 'Sell USDT directly to users with competitive pricing.'}
                  </p>
                </div>
              </div>

              {/* Deposit/Withdraw Option */}
              <div className={`flex items-center border ${itemBorderColor} p-4 ${itemBgColor} rounded-lg ${itemHoverBgColor} ${itemHoverBorderColor} transition-colors cursor-pointer group`}>
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-full mr-4 flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className={`${textColor} font-medium mb-1`}>
                    {action === 'buy' ? 'Deposit USDT' : 'Withdraw BTC'}
                  </h3>
                  <p className={`${secondaryTextColor} text-sm`}>
                    {action === 'buy' 
                      ? 'Deposit USDT to your account to buy BTC.' 
                      : 'Withdraw your BTC to an external wallet.'}
                  </p>
                </div>
              </div>

              {/* Direct Trade Option */}
              <div 
                className={`flex items-center border ${itemBorderColor} p-4 ${itemBgColor} rounded-lg ${itemHoverBgColor} ${itemHoverBorderColor} transition-colors cursor-pointer group`}
                onClick={handleTradeConfirmation}
              >           
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-full mr-4 flex-shrink-0">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`${textColor} font-medium mb-1`}>
                    {action === 'buy' ? 'Buy BTC Now' : 'Sell USDT Now'}
                  </h3>
                  <p className={`${secondaryTextColor} text-sm`}>
                    {action === 'buy' 
                      ? 'Proceed with your BTC buy order using your USDT balance.' 
                      : 'Proceed with your USDT sell order to get BTC.'}
                  </p>
                </div>
              </div>

              {/* Additional option shown when "View More" is clicked */}
              {showMore && (
                <div className={`flex items-center border ${itemBorderColor} p-4 ${itemBgColor} rounded-lg ${itemHoverBgColor} ${itemHoverBorderColor} transition-colors cursor-pointer group`}>
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-full mr-4 flex-shrink-0">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`${textColor} font-medium mb-1`}>
                      {action === 'buy' ? 'Other Payment Methods' : 'Other Withdrawal Methods'}
                    </h3>
                    <p className={`${secondaryTextColor} text-sm`}>
                      {action === 'buy' 
                        ? 'Explore additional ways to buy BTC.' 
                        : 'Explore additional ways to sell USDT.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowMore(!showMore)}
                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
              >
                {showMore ? "View Less" : "View More"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySellModal;