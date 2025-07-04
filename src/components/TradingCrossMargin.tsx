import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const TradingCrossMargin: React.FC = () => {
  const { isDark } = useTheme();
  const [orderType, setOrderType] = useState("Stop Limit");

  const MLIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.42407 8.99628C9.04452 8.37583 9.42828 7.51869 9.42828 6.57191C9.42828 5.62514 9.04452 4.76799 8.42407 4.14754L9.63625 2.93536C10.5669 3.86604 11.1426 5.15175 11.1426 6.57191C11.1426 7.99207 10.5669 9.27779 9.63625 10.2085L8.42407 8.99628Z" fill="#ef4444"/>
      <path d="M5.99959 3.14294C5.05281 3.14294 4.19567 3.52669 3.57522 4.14714L2.36304 2.93496C3.29371 2.00429 4.57943 1.42865 5.99959 1.42865C7.41975 1.42865 8.70546 2.00428 9.63613 2.93496L8.42395 4.14714C7.8035 3.52669 6.94636 3.14294 5.99959 3.14294Z" fill="#fcd535"/>
      <path d="M2.57146 6.57191C2.57146 7.51869 2.95522 8.37583 3.57567 8.99628L2.36349 10.2085C1.43281 9.27778 0.857178 7.99207 0.857178 6.57191C0.857178 5.15175 1.43281 3.86604 2.36349 2.93536L3.57567 4.14754C2.95522 4.76799 2.57146 5.62513 2.57146 6.57191Z" fill="#10b981"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00004 6.57135C8.00004 7.67592 7.1046 8.57135 6.00004 8.57135C5.14712 8.57135 4.41891 8.03746 4.13136 7.28564H0.906387C0.873947 7.05219 0.857178 6.81371 0.857178 6.57132C0.857178 6.32895 0.873945 6.0905 0.906379 5.85706H4.13136C4.41891 5.10524 5.14712 4.57135 6.00004 4.57135C7.1046 4.57135 8.00004 5.46678 8.00004 6.57135ZM6.57146 6.57135C6.57146 6.88694 6.31563 7.14278 6.00004 7.14278C5.68444 7.14278 5.42861 6.88694 5.42861 6.57135C5.42861 6.25576 5.68444 5.99992 6.00004 5.99992C6.31563 5.99992 6.57146 6.25576 6.57146 6.57135Z" fill="#10b981"/>
    </svg>
  );

  // Function to handle numeric input
  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) || 
        // Allow: Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) || 
        // Allow: Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) || 
        // Allow: Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it's a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-4`}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-6">
          {["Limit", "Market", "Stop Limit"].map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`text-sm font-medium ${
                orderType === type
                  ? `${isDark ? "text-white" : "text-gray-900"} border-b-2 ${isDark ? "border-white" : "border-gray-900"} pb-1`
                  : `${isDark ? "text-gray-400" : "text-gray-600"}`
              }`}
            >
              {type}
            </button>
          ))}
          <div className={`w-4 h-4 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-300"} flex items-center justify-center`}>
            <span className="text-xs">!</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MLIcon />
            <span className="text-green-400 text-sm font-medium">ML 999.00</span>
          </div>
          <span className={`${isDark ? "bg-gray-700" : "bg-gray-100"} px-2 py-1 rounded text-xs`}>5x</span>
          <span className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>Borrow/Repay</span>
          <span className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>Transfer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buy Form */}
        <div>
          <div className="flex space-x-4 mb-4">
            {["Normal", "Borrow", "Repay"].map((mode, idx) => (
              <button
                key={mode}
                className={`text-sm ${
                  idx === 0
                    ? `${isDark ? "text-white" : "text-gray-900"} border-b ${isDark ? "border-gray-500" : "border-gray-300"} pb-1`
                    : `${isDark ? "text-gray-400" : "text-gray-600"}`
                }`}
              >
                {mode}
              </button>
            ))}
            <div className={`w-4 h-4 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-300"} flex items-center justify-center ml-2`}>
              <span className="text-xs">!</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Stop</div>
              <input
                type="text"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">USDT</span>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Limit</div>
              <input
                type="text"
                defaultValue="106930.18"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">USDT</span>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Amount</div>
              <input
                type="text"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">BTC</span>
            </div>

            <div className="flex justify-between">
              <div className="flex space-x-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    className={`w-8 h-6 text-xs rounded ${isDark ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-600"} border`}
                  >
                    {percent === 100 ? "MAX" : `${percent}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Total</div>
              <input
                type="text"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-1 text-xs text-gray-400">Minimum 5</span>
              <span className="absolute right-3 bottom-1 text-xs text-gray-400">USDT</span>
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>Avbl</span>
              <span>0.00000000 USDT 💰</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Est. Fee</span>
            </div>

            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-medium">
              Buy BTC
            </button>
          </div>
        </div>

        {/* Sell Form */}
        <div>
          <div className="flex space-x-4 mb-4">
            {["Normal", "Borrow", "Repay"].map((mode, idx) => (
              <button
                key={mode}
                className={`text-sm ${
                  idx === 0
                    ? `${isDark ? "text-white" : "text-gray-900"} border-b ${isDark ? "border-gray-500" : "border-gray-300"} pb-1`
                    : `${isDark ? "text-gray-400" : "text-gray-600"}`
                }`}
              >
                {mode}
              </button>
            ))}
            <div className={`w-4 h-4 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-300"} flex items-center justify-center ml-2`}>
              <span className="text-xs">!</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Stop</div>
              <input
                type="text"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">USDT</span>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Limit</div>
              <input
                type="text"
                defaultValue="106930.18"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">USDT</span>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Amount</div>
              <input
                type="text"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">BTC</span>
            </div>

            <div className="flex justify-between">
              <div className="flex space-x-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    className={`w-8 h-6 text-xs rounded ${isDark ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-600"} border`}
                  >
                    {percent === 100 ? "MAX" : `${percent}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-xs text-gray-400">Total</div>
              <input
                type="text"
                onKeyDown={handleNumericInput}
                className={`w-full px-3 py-3 rounded ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border text-sm pl-16`}
              />
              <span className="absolute right-3 top-1 text-xs text-gray-400">Minimum 5</span>
              <span className="absolute right-3 bottom-1 text-xs text-gray-400">USDT</span>
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>Avbl</span>
              <span>0.00000000 BTC 💰</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Est. Fee</span>
            </div>

            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded font-medium">
              Sell BTC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingCrossMargin;