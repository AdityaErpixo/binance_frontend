import React, { useState } from "react";
import {   FiSearch, FiSun, FiMoon, FiMenu, FiChevronDown, FiChevronUp,  FiDollarSign, FiUsers, FiRepeat, FiCpu, FiCopy, FiCode, FiAward, FiUser } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsDownload, BsCurrencyExchange, BsRobot, BsCurrencyBitcoin } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import DepositDrawer from "./DepositDrawer";

interface HeaderProps { onMenuClick: () => void; }

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showTradeDropdown, setShowTradeDropdown] = useState(false);
  const [showFuturesDropdown, setShowFuturesDropdown] = useState(false);
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const tradeItems = {
    basic: [
      { icon: <BsCurrencyBitcoin size={20} />, title: "Spot", path: "/trading", description: "Buy and sell on the Spot market with advanced tools" },
      { icon: <FiDollarSign size={20} />, title: "Margin", path: "/trading/margin", description: "Increase your profits with leverage" },
      { icon: <FiUsers size={20} />, title: "P2P", description: "Buy & sell cryptocurrencies using bank transfer and 800+ options" },
      { icon: <BsCurrencyExchange size={20} />, title: "Convert & Block Trade", description: "The easiest way to trade at all sizes" }
    ],
    advanced: [
      { icon: <FiAward size={20} />, title: "Alpha", badge: "new", description: "Quick access to Web3 via Alpha Trading" },
      { icon: <BsRobot size={20} />, title: "Trading Bots", description: "Trade smarter with our various automated strategies - easy, fast and reliable" },
      { icon: <FiCopy size={20} />, title: "Copy Trading", description: "Follow the most popular traders" },
      { icon: <FiCode size={20} />, title: "APIs", description: "Unlimited opportunities with one key" }
    ]
  };

  const futuresItems = [
    { icon: <FiDollarSign size={20} />, title: "USD⊖-M Futures", description: "Contracts settled in USDT and USDC" },
    { icon: <FiRepeat size={20} />, title: "COIN-M Futures", description: "Contracts settled in cryptocurrency" },
    { icon: <FiCpu size={20} />, title: "Options", description: "USDT Options with limited downside and affordable entry" }
  ];

  const renderDropdownItem = (item: any, index: number, isFutures = false) => (
    <div 
      key={index} 
      className={`flex items-start space-x-3 p-2 rounded-lg hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} cursor-pointer transition-colors`}
      onClick={() => !isFutures && item.path && navigate(item.path)}
    >
      <div className={`mt-1 text-[#f0b90b]`}>{item.icon}</div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className={`${isDark ? 'text-white' : 'text-gray-800'} font-medium text-sm`}>{item.title}</span>
          {item.badge && <span className="bg-[#f0b90b] text-black text-xs px-2 py-0.5 rounded font-medium">{item.badge}</span>}
        </div>
        <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1 leading-relaxed`}>{item.description}</div>
      </div>
    </div>
  );

  const renderDropdown = (items: any, isFutures = false) => (
    <div className={`absolute top-full left-0 shadow-lg rounded-lg z-50 ${isDark ? 'bg-[#1e2329]' : 'bg-white border border-gray-200'} ${
      isFutures ? 'w-[280px]' : 'w-[600px]'
    }`} style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {isFutures ? (
        <div className="p-3 space-y-2">{items.map((item: any, i: number) => renderDropdownItem(item, i, true))}</div>
      ) : (
        <div className="grid grid-cols-2 gap-0">
          {['basic', 'advanced'].map((type) => (
            <div key={type} className="p-4">
              <h3 className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium mb-4`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              <div className="space-y-3">
                {items[type].map((item: any, i: number) => renderDropdownItem(item, i))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const navLinks = ['Buy Crypto', 'Markets', 'Earn', 'Square', 'More'];

  const handleDepositClick = () => {
    setIsDepositDrawerOpen(true);
  };

  const handleCloseDepositDrawer = () => {
    setIsDepositDrawerOpen(false);
  };

  return (
    <>
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3 relative`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiMenu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-6">
              <img src="https://cdn.cookielaw.org/logos/99f99939-5a0d-4feb-aef3-ba45f16b6907/5bfb9945-c83c-46f9-8bd7-55e8fd1975b5/02e50907-93f6-477d-a8a2-d581dace49c2/binance-h.png" 
                   alt="Binance Logo" className="h-8 aspect-auto object-contain" />

              <nav className="hidden md:flex space-x-6 text-sm" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                {navLinks.slice(0, 2).map((link) => (
                  <a key={link} href="#" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-[#f0b90b] transition-colors`}>{link}</a>
                ))}
                
                {['Trade', 'Futures'].map((item) => {
                  const showState = item === 'Trade' ? showTradeDropdown : showFuturesDropdown;
                  const setShowState = item === 'Trade' ? setShowTradeDropdown : setShowFuturesDropdown;
                  return (
                    <div 
                      key={item} 
                      className="relative"
                      onMouseEnter={() => setShowState(true)} 
                      onMouseLeave={() => setShowState(false)}
                    >
                      <button 
                        className={`flex items-center space-x-1 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-[#f0b90b] transition-colors`}
                      >
                        <span>{item}</span>
                        {showState ? <FiChevronUp className="w-3 h-3 text-[#f0b90b]" /> : <FiChevronDown className="w-3 h-3" />}
                      </button>
                      {showState && renderDropdown(item === 'Trade' ? tradeItems : futuresItems, item === 'Futures')}
                    </div>
                  );
                })}

                {navLinks.slice(2).map((link) => (
                  <a key={link} href="#" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-[#f0b90b] transition-colors`}>{link}</a>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {[<FiSearch />, <BsDownload />, <IoNotificationsOutline />].map((icon, i) => (
              <button key={i} className={`p-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors`}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
              </button>
            ))}
            <button 
              onClick={handleDepositClick}
              className="bg-[#f0b90b] hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Deposit
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className={`p-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors`}
            >
              <FiUser className="w-5 h-5" />
            </button>
            <button onClick={toggleTheme} className={`p-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors`}>
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Deposit Drawer */}
      <DepositDrawer 
        isOpen={isDepositDrawerOpen} 
        onClose={handleCloseDepositDrawer} 
      />
    </>
  );
};

export default Header;