import React, { useState } from 'react';
import { Search, MoreVertical, ChevronDown, FileSearch } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Spott = () => {
  const { isDark } = useTheme();
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideAssets, setHideAssets] = useState(false);

  const spotAssets = [
    { 
      id: 1, 
      icon: '₿', 
      name: 'BTC', 
      fullName: 'Bitcoin', 
      amount: '0.00', 
      usdValue: '$00.00', 
      available: '0.00',
      iconColor: 'bg-orange-500' 
    },
    { 
      id: 2, 
      icon: '♦', 
      name: 'ETH', 
      fullName: 'Ethereum', 
      amount: '0.00', 
      usdValue: '$00.00', 
      available: '0.00',
      iconColor: 'bg-blue-500' 
    },
    { 
      id: 3, 
      icon: '⚡', 
      name: 'BNB', 
      fullName: 'BNB', 
      amount: '0.00', 
      usdValue: '$00.00', 
      available: '0.00',
      iconColor: 'bg-yellow-500' 
    },
    { 
      id: 4, 
      icon: '◉', 
      name: 'USDT', 
      fullName: 'TetherUS', 
      amount: '0.00', 
      usdValue: '$00.00', 
      available: '0.00',
      iconColor: 'bg-green-500' 
    }
  ];

  const renderCheckbox = (id) => (
    <div className="flex items-center gap-2">
      <input 
        type="checkbox" 
        id={id} 
        checked={hideAssets} 
        onChange={() => setHideAssets(!hideAssets)}
        className={`w-3.5 h-3.5 appearance-none border rounded ${
          isDark 
            ? 'border-gray-600 checked:bg-yellow-500' 
            : 'border-gray-300 checked:bg-yellow-400'
        } relative checked:after:content-[''] checked:after:block checked:after:w-1.5 checked:after:h-2.5 checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-2/3 checked:after:rotate-45`}
      />
      <label htmlFor={id} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Hide assets &lt;1 USD
      </label>
    </div>
  );

  const renderAssetRow = (asset) => (
    <div 
      key={asset.id} 
      className={`grid grid-cols-4 gap-4 py-3 px-2 rounded-md transition-colors ${
        isDark ? 'hover:bg-[#0b0e11]' : 'hover:bg-gray-50'
      }`}
    >
      {/* Coin Column */}
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${asset.iconColor}`}>
          {asset.icon}
        </div>
        <div>
          <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
            {asset.name}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {asset.fullName}
          </div>
        </div>
      </div>

      {/* Amount Column */}
      <div className="text-center">
        <div className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
          {asset.amount}
        </div>
        <div className={`text-sm ${isDark ? 'text-[#848e9c]' : 'text-[#8485e9c]'}`}>
          {asset.usdValue}
        </div>
      </div>

      {/* Available Column */}
      <div className={`text-center font-medium ${isDark ? 'text-white' : 'text-black'}`}>
        {asset.available}
      </div>

      {/* Action Column */}
      <div className="text-right flex items-center justify-end gap-3">
        <button className={`text-sm font-medium underline ${
          isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'
        }`}>
          Convert
        </button>
        <button className={`text-sm font-medium underline ${
          isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'
        }`}>
          Earn
        </button>
        <button className={`transition-colors ${
          isDark ? 'text-gray-400 hover:text-[#fcd535]' : 'text-gray-500 hover:text-yellow-500'
        }`}>
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`w-full px-6 py-6 rounded-lg border ${
      isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-black'}`}>
          Spot
        </h1>
        <div className="flex items-center gap-4">
          {/* Updated Search Bar */}
          <div className={`relative flex items-center justify-center transition-all duration-300 ${isSearchHovered || searchQuery ? 'w-40' : 'w-8'}`}
            onMouseEnter={() => setIsSearchHovered(true)} 
            onMouseLeave={() => !searchQuery && setIsSearchHovered(false)}>
            <Search size={16} className={`absolute ${isSearchHovered || searchQuery ? 'left-2' : 'left-1/2 -translate-x-1/2'} top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}/>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-2 py-1.5 border rounded-md text-sm w-full ${isDark ? 'bg-[#181a20] border-[#2b3139] text-white' : 'bg-white border-gray-300 text-black'}`}
              placeholder={isSearchHovered || searchQuery ? "Search" : ""}
            />
          </div>
          
          {/* Convert Small Balance Button */}
          <button className={`flex items-center gap-2 text-sm font-medium ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            <span>Convert Small Balance to BNB</span>
            <svg width="16" height="16" viewBox="0 0 16 16" className={isDark ? 'text-white' : 'text-black'}>
              <path d="M3 8L13 8M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Hide Assets Checkbox */}
          {renderCheckbox('hideSpotAssets')}
        </div>
      </div>

      {/* Table Header */}
      <div className={`grid grid-cols-4 gap-4 pb-4 text-sm font-medium ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center gap-1">
          Coin
          <ChevronDown size={12} />
        </div>
        <div className="flex items-center justify-center gap-1">
          Amount
          <ChevronDown size={12} />
        </div>
        <div className="flex items-center justify-center gap-1">
          Available
          <ChevronDown size={12} />
        </div>
        <div className="text-right">Action</div>
      </div>

      {/* Asset Rows */}
      <div className="mt-4 space-y-1">
        {hideAssets ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileSearch size={48} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <p className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No assets to display
            </p>
          </div>
        ) : 
          spotAssets.map(asset => renderAssetRow(asset))
        }
      </div>
    </div>
  );
};

export default Spott;