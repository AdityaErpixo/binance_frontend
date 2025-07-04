import React, { useState } from 'react';
import { ChevronRight, Search, MoreVertical, FileSearch } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MyAssets = () => {
  const { isDark } = useTheme();
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('coin');
  const [hideAssets, setHideAssets] = useState(false);

  const assets = [
    { id: 1, icon: '⚡', name: 'BNB', fullName: 'BNB', amount: '0.00', usdValue: '$0.00', price: '$653.53', iconColor: 'bg-yellow-500' },
    { id: 2, icon: '₿', name: 'BTC', fullName: 'Bitcoin', amount: '0.00', usdValue: '$0.00', price: '$103,687.52', iconColor: 'bg-orange-500' },
    { id: 3, icon: '♦', name: 'ETH', fullName: 'Ethereum', amount: '0.00', usdValue: '$0.00', price: '$2,519.99', iconColor: 'bg-blue-500' },
    { id: 4, icon: '◉', name: 'USDT', fullName: 'TetherUS', amount: '0.00', usdValue: '$0.00', price: '$1.00', iconColor: 'bg-green-500' }
  ];

  const accounts = [1, 2, 3, 4].map(id => ({
    id,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {id === 1 && <path fillRule="evenodd" clipRule="evenodd" d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z" fill="currentColor"/>}
        {id === 2 && <><path d="M20.018 5.768L20 5.786V12l-3.107-3.107L5.768 20.018 4 18.25 15.125 7.125 12 4h8v1.75l.018.018z" fill="currentColor"/><path d="M5.768 4l4.827 4.827-1.768 1.768L4 5.768 5.768 4zM13.423 15.19l1.768-1.767 4.827 4.827-1.768 1.768-4.827-4.827z" fill="currentColor"/></>}
        {id === 3 && <path fillRule="evenodd" clipRule="evenodd" d="M7.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0-5.031L5.969 7.5 7.5 9.031l1.531-1.53L7.5 5.968zM20 4h-8l3.125 3.125L4.061 18.19l1.768 1.768L16.893 8.893 20 12V4zm0 12.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" fill="currentColor"/>}
        {id === 4 && <path fillRule="evenodd" clipRule="evenodd" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-4l4 4-4 4-4-4 4-4z" fill="currentColor"/>}
      </svg>
    ),
    name: ['Spot', 'Cross Margin', 'Isolated Margin', 'Funding'][id-1],
    amount: '--', 
    usdValue: '$0.00', 
    ratio: '-' 
  }));

  const renderTab = (view, label) => (
    <button onClick={() => setActiveView(view)} className={`relative pb-2 font-medium ${activeView === view ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
      {label}
      {activeView === view && <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1.5 ${isDark ? 'bg-yellow-500' : 'bg-yellow-400'}`}></div>}
    </button>
  );

  const renderCheckbox = (id) => (
    <div className="flex items-center gap-2">
      <input type="checkbox" id={id} checked={hideAssets} onChange={() => setHideAssets(!hideAssets)}
        className={`w-3.5 h-3.5 appearance-none border rounded ${isDark ? 'border-gray-600 checked:bg-yellow-500' : 'border-gray-300 checked:bg-yellow-400'} relative checked:after:content-[''] checked:after:block checked:after:w-1.5 checked:after:h-2.5 checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-2/3 checked:after:rotate-45`}
      />
      <label htmlFor={id} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Hide assets &lt;1 USD</label>
    </div>
  );

  const renderRow = (item, isAsset) => (
    <div key={item.id} className={`grid grid-cols-4 gap-4 py-3 px-2 rounded-md transition-colors ${isDark ? 'hover:bg-[#0b0e11]' : 'hover:bg-gray-50'}`}>
      <div className="flex items-center gap-3">
        {isAsset ? (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${item.iconColor}`}>{item.icon}</div>
        ) : <div className={isDark ? 'text-white' : 'text-black'}>{item.icon}</div>}
        <div>
          <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</div>
          {isAsset && <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.fullName}</div>}
        </div>
      </div>
      <div className="text-center">
        <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{item.amount}</div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.usdValue}</div>
      </div>
      <div className={`text-center font-medium ${isDark ? 'text-white' : 'text-black'}`}>{isAsset ? item.price : item.ratio}</div>
      <div className="text-right">
        {isAsset ? (
          <button className={`text-sm font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}>Cash In</button>
        ) : (
          <button className={`transition-colors ${isDark ? 'text-gray-400 hover:text-[#fcd535]' : 'text-gray-500 hover:text-yellow-500'}`}><MoreVertical size={16} /></button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-6 rounded-lg border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl sm:text-2xl font-medium ${isDark ? 'text-white' : 'text-black'}`}>My Assets</h2>
        <button className="flex items-center gap-2 text-sm font-medium">
          <span className={isDark ? 'text-white' : 'text-black'}>View All 350+ Coins</span>
          <ChevronRight size={16} className={isDark ? 'text-white' : 'text-black'}/>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-8">
          {renderTab('coin', 'Coin View')}
          {renderTab('account', 'Account View')}
        </div>
        {activeView === 'coin' ? (
          <div className="flex items-center gap-4">
            <div className={`relative flex items-center justify-center transition-all duration-300 ${isSearchHovered ? 'w-40' : 'w-8'}`}
              onMouseEnter={() => setIsSearchHovered(true)} onMouseLeave={() => !searchQuery && setIsSearchHovered(false)}>
              <Search size={16} className={`absolute ${isSearchHovered ? 'left-2' : 'left-1/2 -translate-x-1/2'} top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}/>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-8 pr-2 py-1.5 border rounded-md text-sm w-full ${isDark ? 'bg-[#1e2329] border-[#2b3139] text-white' : 'bg-white border-gray-300 text-black'}`}
                placeholder={isSearchHovered ? "Search" : ""}/>
            </div>
            {renderCheckbox('hideAssets')}
          </div>
        ) : renderCheckbox('hideAccountAssets')}
      </div>

      {hideAssets ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FileSearch size={48} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No records</p>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-4 gap-4 pb-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center gap-1">{activeView === 'coin' ? 'Coin' : 'Account'}{activeView === 'coin' && <ChevronRight size={12} className="rotate-90 inline-block"/>}</div>
            <div className="flex items-center justify-center gap-1">Amount<ChevronRight size={12} className="rotate-90 inline-block"/></div>
            <div className="flex items-center justify-center gap-1">{activeView === 'coin' ? 'Coin Price' : 'Ratio'}<ChevronRight size={12} className="rotate-90 inline-block"/></div>
            <div className="text-right">Action</div>
          </div>
          <div className="space-y-2">
            {(activeView === 'coin' ? assets : accounts).map(item => renderRow(item, activeView === 'coin'))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyAssets;