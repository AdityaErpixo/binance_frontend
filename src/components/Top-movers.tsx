import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Adjust the import path as needed

const FILTERS = ['All', 'Change', 'New High/Low', 'Fluctuation', 'Volume'];

const TopMovers = () => {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className={`${isDark ? 'bg-[#1f2937]' : 'bg-white'} text-${isDark ? 'white' : 'gray-800'} p-4 max-w-4xl rounded-lg`} 
         style={{ height: '250px' }}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold">Top Movers</h1>
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs underline cursor-pointer`}>FAQ</span>
          </div>
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            ⌂
          </div>
        </div>
        <div className={`border-b ${isDark ? 'border-gray-600' : 'border-gray-300'} mt-2 mx-2`}></div>
      </div>

      {/* Filter Tabs */}
      <div 
        className="flex gap-1 mb-3 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowX: 'auto',
        }}
      >
        <style>
          {`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              px-3 py-1 rounded text-xs whitespace-nowrap transition-colors
              ${activeFilter === filter
                ? `${isDark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'}`
                : `${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-${isDark ? 'white' : 'gray-800'}`
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Trading Pairs - Scrollable Container */}
      <div className="overflow-y-auto" style={{ 
        height: 'calc(100% - 80px)',
        scrollbarWidth: 'thin',
        scrollbarColor: `${isDark ? '#4B5563 #1F2937' : '#D1D5DB #F3F4F6'}`,
      }}>
        <div className="space-y-2 pr-2">
          {/* Static Example Entries - You can later filter these by activeFilter if needed */}
          {[
            { pair: 'WCT/USDT', time: '09:09:12', change: '-6.45%', status: 'New 24hr Low' },
            { pair: 'SCRT/BTC', time: '09:09:10', change: '-31.80%', status: 'New 30day Low' },
            { pair: 'ETH/USDT', time: '09:08:45', change: '+2.34%', status: 'New 24hr High' },
            { pair: 'SOL/BTC', time: '09:08:30', change: '-1.56%', status: 'Fluctuating' },
            { pair: 'ADA/USDT', time: '09:08:15', change: '+5.67%', status: 'Volume Spike' },
            { pair: 'DOT/ETH', time: '09:08:00', change: '-3.21%', status: 'New 7day Low' },
            { pair: 'AVAX/USDC', time: '09:07:45', change: '+8.90%', status: 'New All-time High' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <div className="text-xs font-medium">{item.pair}</div>
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{item.time}</div>
              </div>
              <div className="text-center">
                <div className={`${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} text-xs font-medium`}>
                  {item.change}
                </div>
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{item.status}</div>
              </div>
              <button className={`${item.change.startsWith('+') ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white px-2 py-1 rounded text-xs font-bold transition-colors`}>
                {item.change.startsWith('+') ? '—^—' : '—v—'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;
