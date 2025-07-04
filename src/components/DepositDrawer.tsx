import React, { useState } from "react";
import { FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const DepositDrawer = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showCurrencySearch, setShowCurrencySearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState({ 
    code: "INR", 
    name: "Indian Rupee", 
    symbol: "₹",
    flag: "🇮🇳" 
  });

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
    { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
    { code: "MXN", name: "Mexican Peso", symbol: "MX$", flag: "🇲🇽" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
    { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
    { code: "BTC", name: "Bitcoin", symbol: "₿", flag: "🟡" },
    { code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "🔷" },
    { code: "USDT", name: "Tether", symbol: "₮", flag: "💵" },
    { code: "BNB", name: "Binance Coin", symbol: "🅱️", flag: "🅱️" },
    { code: "XRP", name: "Ripple", symbol: "✕", flag: "✕" },
    { code: "SOL", name: "Solana", symbol: "◎", flag: "◎" },
    { code: "DOGE", name: "Dogecoin", symbol: "Ð", flag: "🐕" },
    { code: "DOT", name: "Polkadot", symbol: "●", flag: "●" },
    { code: "SHIB", name: "Shiba Inu", symbol: "🦊", flag: "🦊" },
  ];

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setShowCurrencySearch(false);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  const cardClass = `${isDark ? 'bg-[#1d2328] border border-[#2b3139] hover:border-[#474d57]' : 'bg-white border border-[#eaecef] hover:border-[#d8dce1]'} rounded-lg p-4 cursor-pointer transition-colors`;
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const descClass = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}/>
      <div className={`fixed top-0 right-0 h-full w-[28rem] ${isDark ? 'bg-[#1d2328]' : 'bg-white'} shadow-2xl z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
        <div className="flex items-center justify-between p-4">
          <div 
            className={`flex items-center space-x-2 cursor-pointer border rounded-lg px-3 py-2 ${isDark ? 'border-[#2b3139] hover:border-[#474d57]' : 'border-[#eaecef] hover:border-[#d8dce1]'} transition-colors`}
            onClick={() => setShowCurrencySearch(!showCurrencySearch)}
          >
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">{selectedCurrency.symbol}</span>
            </div>
            <span className={`text-lg font-medium ${textClass}`}>{selectedCurrency.code}</span>
            <FiChevronDown className={`w-4 h-4 ${textClass} transition-transform ${showCurrencySearch ? 'rotate-180' : ''}`} />
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
            <FiX className="w-5 h-5"/>
          </button>
        </div>

        {showCurrencySearch && (
          <div className={`absolute left-0 right-0 top-16 mx-4 ${isDark ? 'bg-[#1d2328] border border-[#2b3139]' : 'bg-white border border-[#eaecef]'} rounded-lg shadow-lg max-h-[calc(100%-5rem)] overflow-hidden z-10`}>
            <div className="p-3 sticky top-0 z-10">
              <div className={`relative flex items-center ${isDark ? 'bg-[#2b3139]' : 'bg-gray-50'} rounded-lg`}>
                <FiSearch className={`w-4 h-4 ml-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 bg-transparent border-none outline-none ${textClass} placeholder-gray-500`}
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[20rem] overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className={`flex items-center space-x-3 p-3 cursor-pointer ${isDark ? 'hover:bg-[#2b3139]' : 'hover:bg-gray-50'} transition-colors`}
                  onClick={() => handleCurrencySelect(currency)}
                >
                  <span className="text-xl">{currency.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${textClass}`}>{currency.code}</span>
                      <span className={`text-sm ${descClass}`}>{currency.symbol}</span>
                    </div>
                    <div className={`text-xs ${descClass}`}>{currency.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`h-full overflow-y-auto ${showCurrencySearch ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="p-6">
            <div className="mb-8">
              <h2 className={`text-lg font-medium mb-4 ${textClass}`}>I don't have crypto assets</h2>
              <div className="space-y-4">
                <div className={`${cardClass} flex justify-between items-start`}>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full"/>
                      <div className="w-4 h-4 bg-yellow-600 rounded-full absolute -bottom-1 -right-1"/>
                    </div>
                    <div>
                      <h3 className={`font-medium ${textClass}`}>P2P Trading</h3>
                      <p className={`text-sm ${descClass}`}>Buy directly from users. Competitive pricing. Local payments.</p>
                    </div>
                  </div>
                  <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium underline">Tutorial</button>
                </div>

                {/* 🔥 BUY WITH [CURRENCY] - Navigation added here */}
                <div 
                  className={`${cardClass} flex justify-between items-start`}
                  onClick={() => {
                    navigate('/buy-sell-crypto');
                    onClose();
                  }}

                >
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm font-bold">{selectedCurrency.symbol}</span>
                    </div>
                    <div>
                      <h3 className={`font-medium ${textClass}`}>Buy with {selectedCurrency.code}</h3>
                      <p className={`text-sm ${descClass}`}>Buy crypto easily via bank transfer, card, and more.</p>
                    </div>
                  </div>
                  <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium underline">Tutorial</button>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-lg font-medium mb-4 ${textClass}`}>I have crypto assets</h2>
              <div className={`${cardClass} flex justify-between items-start`}>
                <div className="flex space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full"/>
                    <div className="w-4 h-4 bg-orange-500 rounded-full absolute -bottom-1 -right-1"/>
                  </div>
                  <div>
                    <h3 className={`font-medium ${textClass}`}>Deposit Crypto</h3>
                    <p className={`text-sm ${descClass}`}>Send crypto to your Binance Account</p>
                  </div>
                </div>
                <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium underline">Tutorial</button>
              </div>
            </div>

            <div className="mt-8 pt-6 text-center">
              <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium underline">Beginner Deposit Tutorial</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositDrawer;
