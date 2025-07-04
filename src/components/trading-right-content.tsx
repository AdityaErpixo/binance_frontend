import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Ticker from './trading/Ticker';

interface CryptoPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  leverage?: string;
  lastPrice: number;
  change24h: number;
  isFavorite?: boolean;
  volume: string;
}

const CryptoTradingPanel: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('USDT');
  const [pairs, setPairs] = useState<CryptoPair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVolume, setShowVolume] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [showArrows, setShowArrows] = useState({ left: false, right: true });

  // Theme-based styles
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-foreground' : 'text-gray-900';
  const borderColor = isDark ? 'border-[#374151]' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-[#2b3139]' : 'hover:bg-gray-100';
  const leverageBg = isDark ? 'bg-[#2b3139]' : 'bg-gray-100';
  const mutedText = isDark ? 'text-muted-foreground' : 'text-gray-500';

  useEffect(() => {
    const fetchAllPairs = async () => {
      try {
        // 1. First fetch margin pairs
        const marginResponse = await fetch('https://www.binance.com/bapi/margin/v1/public/isolated-margin/pair/listed');
        const marginData = await marginResponse.json();
        
        // 2. Then fetch 24hr ticker data for all pairs
        const tickerResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const tickerData = await tickerResponse.json();
        
        // Create a map of symbol to ticker data for quick lookup
        const tickerMap = new Map();
        tickerData.forEach((ticker: any) => {
          tickerMap.set(ticker.symbol, {
            lastPrice: parseFloat(ticker.lastPrice),
            priceChangePercent: parseFloat(ticker.priceChangePercent),
            volume: parseFloat(ticker.volume)
          });
        });

        // Process the margin pairs with real data
        const marginPairs = marginData.data?.map((pair: any) => {
          const quoteAssets = ['USDT', 'BTC', 'BNB', 'ETH', 'USDC', 'FDUSD'];
          const quoteAsset = quoteAssets.find(asset => pair.symbol.endsWith(asset)) || pair.symbol.slice(-4);
          const baseAsset = pair.symbol.replace(quoteAsset, '');
          
          const tickerInfo = tickerMap.get(pair.symbol) || {
            lastPrice: 0,
            priceChangePercent: 0,
            volume: 0
          };

          return {
            id: `pair-${pair.symbol}`,
            symbol: pair.symbol,
            baseAsset,
            quoteAsset,
            leverage: pair.leverage ? `${pair.leverage}x` : undefined,
            lastPrice: tickerInfo.lastPrice,
            change24h: tickerInfo.priceChangePercent,
            isFavorite: false,
            volume: tickerInfo.volume > 1000 
              ? `${(tickerInfo.volume / 1000).toFixed(1)}K` 
              : tickerInfo.volume.toFixed(0)
          };
        }) || [];

        setPairs(marginPairs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching pairs:', error);
        setIsLoading(false);
      }
    };

    fetchAllPairs();
  }, []);

  const handleTickerUpdate = (symbol: string, price: number, percent: number) => {
    setPairs(prevPairs => 
      prevPairs.map(pair => 
        pair.symbol === symbol 
          ? { 
              ...pair, 
              lastPrice: price, 
              change24h: percent,
              volume: `${(price * (10000 + Math.random() * 5000)).toFixed(0)}K`
            } 
          : pair
      )
    );
  };

  const checkScroll = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    setShowArrows({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth - 1
    });
  };

  const scrollTabs = (dir: 'left' | 'right') => {
    tabsRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const centerTab = () => {
    const tab = tabRefs.current[activeTab];
    const container = tabsRef.current;
    if (tab && container) {
      container.scrollTo({
        left: tab.offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2),
        behavior: 'smooth'
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setPairs(pairs.map(pair => 
      pair.id === id ? { ...pair, isFavorite: !pair.isFavorite } : pair
    ));
  };

  useEffect(() => centerTab(), [activeTab]);
  useEffect(() => {
    const container = tabsRef.current;
    container?.addEventListener('scroll', checkScroll);
    return () => container?.removeEventListener('scroll', checkScroll);
  }, []);

  const tabs = ['New','USDT', 'BTC', 'ETH', 'USDC', 'FDUSD', 'ALTS', 'FIAT', 'Margin'];
  const rowHeight = 28;
  const maxVisibleRows = 12;
  const panelHeight = `${rowHeight * maxVisibleRows + 150}px`;

  const filteredPairs = pairs
    .filter(pair => 
      pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === 'All' || pair.quoteAsset === activeTab)
    )
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return (
    <div className={`${bgColor} ${textColor} max-w-md mx-auto rounded-lg borde overflow-hidden`} style={{ height: panelHeight }}>
      {/* Hidden tickers that power the data */}
{/* Hidden tickers that power the data */}
<div className="hidden">
  {pairs.map(pair => (
    <Ticker 
      key={pair.id}
      symbol={pair.symbol}
      onUpdate={(data) => handleTickerUpdate(pair.symbol, data.price, data.percent)}
    />
  ))}
</div>

      <div className="pb-4 p-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg className={`w-4 h-4 ${mutedText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${bgColor} pl-10 pr-4 py-2 rounded-lg border ${borderColor} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          />
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center px-4 pb-1">
          {showArrows.left && (
            <button onClick={() => scrollTabs('left')} className={`${mutedText} hover:${textColor} mr-1 z-20`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div ref={tabsRef} className="flex-1 flex overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth" onScroll={checkScroll}>
            <div className="flex items-center flex-shrink-0">
              <svg className={`w-4 h-4 ${mutedText} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            {tabs.map(tab => (
              <button
                key={tab}
                ref={el => { tabRefs.current[tab] = el; }}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-medium whitespace-nowrap mr-4 flex-shrink-0 ${
                  activeTab === tab ? textColor : `${mutedText} hover:${textColor}`
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-[1px] left-2 right-2 h-[3px] bg-yellow-500 z-10"></div>}
              </button>
            ))}
          </div>

          {showArrows.right && (
            <button onClick={() => scrollTabs('right')} className={`${mutedText} hover:${textColor} ml-1 z-20`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className={`flex items-center justify-between py-2 ${bgColor} text-xs ${mutedText} font-medium`}>
        <div className="flex items-center">
          <span>Pair</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center">
          <span>{showVolume ? 'Last Price/Vol' : 'Last Price/24h Change'}</span>
          <button 
            className={`${mutedText} hover:${isDark ? 'text-white' : 'text-gray-700'} cursor-pointer transition-colors duration-200 ml-1`}
            onClick={() => setShowVolume(!showVolume)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M21.456 9h-15v3h-3V6h12V3l6 6zm-18 6h15v-3h3v6h-12v3l-6-6z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: `${rowHeight * maxVisibleRows}px` }}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          filteredPairs.map(pair => (
            <div key={pair.id} className={`flex items-center justify-between py-1 ${hoverBg}`}>
              <div className="flex items-center">
                <button 
                  className={`mr-1 ${mutedText} hover:text-yellow-500`}
                  onClick={() => toggleFavorite(pair.id)}
                >
                  <svg className="w-4 h-4" fill={pair.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <div className="flex items-center ml-1">
                  <span className={`${textColor} font-medium text-xs`}>{pair.symbol}</span>
                  {pair.leverage && <span className={`ml-1 px-1.5 ${leverageBg} ${isDark ? 'text-white' : 'text-gray-800'} text-xs rounded`}>{pair.leverage}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className={`${textColor} text-xs font-normal`}>{pair.lastPrice.toFixed(6)}</span>
                <span className={`text-xs font-normal ${
                  showVolume ? 'text-[#848e9c]' : pair.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {showVolume ? pair.volume : `${pair.change24h >= 0 ? '+' : ''}${pair.change24h.toFixed(2)}%`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CryptoTradingPanel;