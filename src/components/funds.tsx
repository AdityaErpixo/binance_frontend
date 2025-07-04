import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; // Make sure the path is correct

const FundsTable = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showDivider, setShowDivider] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainer;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
      setShowDivider(!isAtEnd);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const bgColor = isDark ? 'bg-[#181a20]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#252a32]' : 'border-gray-300';
  const dividerColor = showDivider ? `border-l ${borderColor}` : '';

  return (
    <div className={`${bgColor} ${textColor}`}>
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="flex gap-6">
          <span className="text-yellow-500 border-b-2 border-yellow-500 pb-2 font-medium">Funds</span>
          <span className={`${subTextColor} pb-2`}>Positions</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className={subTextColor}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <label className={`flex items-center gap-2 ${subTextColor} text-sm`}>
            <input type="checkbox" className="rounded" />
            Hide small accounts
          </label>
          <label className={`flex items-center gap-2 ${subTextColor} text-sm`}>
            <input type="checkbox" className="rounded" />
            Only show debts
          </label>
        </div>
      </div>

      {/* Table Container with Fixed Action Column */}
      <div className="relative flex">
        {/* Scrollable part */}
        <div className="flex-1 overflow-x-auto" ref={scrollContainerRef}>
          <div className="min-w-max">
            {/* Table Header */}
            <div className="flex">
              {[
                ['Coin', 'w-80'],
                ['Total balance', 'w-60'],
                ['Available Balance', 'w-64'],
                ['Borrowed', 'w-56'],
                ['Interest', 'w-44'],
                ['Equity value(BTC)', 'w-52'],
              ].map(([label, width], idx) => (
                <div key={idx} className={`${width} p-4 ${subTextColor} text-sm font-medium flex items-center gap-1`}>
                  {label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {[
              ['🐱', '1000CAT'],
              ['🎁', '1000CHEEMS'],
            ].map(([emoji, label], idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-80 p-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: idx === 0 ? '#ef4444' : '#f97316' }}>
                    {emoji}
                  </div>
                  <span className={`font-medium ${textColor}`}>{label}</span>
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${['w-60', 'w-64', 'w-56', 'w-44', 'w-52'][i]} p-4 ${subTextColor}`}>0.00000000</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Action column with conditional vertical divider */}
        <div className={`flex-shrink-0 ${dividerColor} ${bgColor}`}>
          <div className={`w-56 p-4 ${subTextColor} text-sm font-medium`}>
            Action
          </div>
          {[0, 1].map(idx => (
            <div key={idx} className="w-56 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="text-yellow-500 text-sm font-medium">Transfer</button>
                <button className="text-yellow-500 text-sm font-medium">Borrow/Repay</button>
              </div>
              <button className={subTextColor}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-end gap-2 p-4">
        <button className="w-8 h-8 bg-gray-600 rounded text-white text-sm font-medium">1</button>
        {[2, 3, 4, 5].map(num => (
          <button key={num} className={`w-8 h-8 text-sm ${subTextColor} hover:${textColor}`}>{num}</button>
        ))}
        <span className={`${subTextColor} text-sm`}>...</span>
        <button className={`w-8 h-8 text-sm ${subTextColor} hover:${textColor}`}>20</button>
        <button className={`w-8 h-8 text-sm ${subTextColor} hover:${textColor}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FundsTable;
