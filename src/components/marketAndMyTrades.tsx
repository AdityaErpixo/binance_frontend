import React, { useState, FC } from 'react';
import { FileSearch } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import TradeList from './trading/TradeList';

const MarketAndMyTrades: FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'market' | 'my'>('market');
  const [symbol] = useState('BTCUSDT'); // Default symbol

  return (
    <div className={`w-full max-w-md mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between border-b border-gray-600">
        <div className="flex space-x-6">
          {(['market', 'my'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-sm font-medium pb-3 ${
                isDark 
                  ? activeTab === tab 
                    ? 'text-gray-300' 
                    : 'text-gray-400 hover:text-gray-300'
                  : activeTab === tab
                    ? 'text-gray-800'
                    : 'text-gray-400 hover:text-gray-800'
              }`}
            >
              {tab === 'market' ? 'Market Trades' : 'My Trades'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-yellow-400" />
              )}
            </button>
          ))}
        </div>
        <button className="text-gray-400 hover:text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs text-gray-400 font-medium">
        <div className="text-left">Price (USDT)</div>
        <div className="text-right">Amount (BTC)</div>
        <div className="text-right">Time</div>
      </div>

      <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {activeTab === 'market' ? (
          <TradeList symbol={symbol} isDark={isDark} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileSearch size={48} className="text-gray-500 mb-4" />
            <span className="text-gray-400 text-sm">No Data</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketAndMyTrades;