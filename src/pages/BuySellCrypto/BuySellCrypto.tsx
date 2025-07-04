import React, { useState, useEffect } from 'react';
import { ChevronDown, BarChart2, HelpCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMutation } from '@tanstack/react-query';
import { depositFunds } from '../../wallet-services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DepositResponse {
  currency: string;
  balance: number;
  locked: number;
}

interface ExchangeRates {
  USDT: number;
  BTC: number;
}

const BuySellCrypto: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [inrAmount, setInrAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'BTC'>('USDT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ USDT: 83.0, BTC: 5000000 });
  const [loadingRates, setLoadingRates] = useState(false);

  const fetchExchangeRates = async () => {
    setLoadingRates(true);
    try {
      // Using CoinGecko API for real-time rates
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=inr');
      setExchangeRates({
        USDT: response.data.tether.inr,
        BTC: response.data.bitcoin.inr
      });
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      // Fallback to default rates if API fails
      setExchangeRates({ USDT: 83.0, BTC: 5000000 });
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const depositMutation = useMutation<DepositResponse, Error, { currency: string; amount: number }>({
    mutationFn: depositFunds,
    onSuccess: (data) => {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard'); 
      }, 2000);
    },
    onError: (err) => {
      setError(err.message || 'Deposit failed. Please try again.');
    }
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, isInr: boolean) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (isInr) {
        setInrAmount(value);
        setCryptoAmount(value ? (parseFloat(value) / exchangeRates[selectedCrypto]).toFixed(8) : '');
      } else {
        setCryptoAmount(value);
        setInrAmount(value ? (parseFloat(value) * exchangeRates[selectedCrypto]).toFixed(2) : '');
      }
    }
  };

  const handleBuy = () => {
    setError(null);
    setSuccess(false);
    
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const minAmounts = {
      USDT: 10,
      BTC: 0.0001
    };

    if (parseFloat(cryptoAmount) < minAmounts[selectedCrypto]) {
      setError(`Minimum deposit amount is ${minAmounts[selectedCrypto]} ${selectedCrypto}`);
      return;
    }

    depositMutation.mutate({
      currency: selectedCrypto,
      amount: parseFloat(cryptoAmount)
    });
  };

  const handleCryptoSelect = (crypto: 'USDT' | 'BTC') => {
    setSelectedCrypto(crypto);
    setShowCryptoDropdown(false);
    // Recalculate amounts when crypto changes
    if (inrAmount) {
      setCryptoAmount((parseFloat(inrAmount) / exchangeRates[crypto]).toFixed(8));
    } else if (cryptoAmount) {
      setInrAmount((parseFloat(cryptoAmount) * exchangeRates[crypto]).toFixed(2));
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const cryptos = [
    { name: 'BNB', price: '$ 645.57', change: '+ 0.87 %', changeColor: 'text-green-500', icon: 'https://placehold.co/24x24/f0b90b/ffffff?text=B' },
    { name: 'BTC', price: `$ ${(exchangeRates.BTC / 83).toFixed(2)}`, change: '- 0.00 %', changeColor: 'text-red-500', icon: 'https://placehold.co/24x24/f7931a/ffffff?text=B' },
    { name: 'ETH', price: '$ 2,495.59', change: '- 0.05 %', changeColor: 'text-red-500', icon: 'https://placehold.co/24x24/627eea/ffffff?text=E' },
    { name: 'XRP', price: '$ 2.13', change: '- 0.77 %', changeColor: 'text-red-500', icon: 'https://placehold.co/24x24/000000/ffffff?text=X' },
    { name: 'TRX', price: '$ 0.2738', change: '+ 0.04 %', changeColor: 'text-green-500', icon: 'https://placehold.co/24x24/eb012a/ffffff?text=T' },
  ];

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-[#181a20] text-gray-100' : 'bg-white text-gray-900'}`}
      style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
    >
      <div className="mx-auto max-w-[2800px] px-4 sm:px-8 md:px-16 lg:px-32">
        <nav className={`flex items-center justify-between py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4 md:space-x-8 text-sm">
            <a href="#" className="font-semibold text-yellow-400 border-b-2 border-yellow-400 pb-2">Buy & Sell</a>
            <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Limit Buy <span className="ml-1 px-1 py-0.5 text-xs bg-red-500 text-white rounded">New</span></a>
            <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Recurring Buy</a>
            <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Deposit</a>
            <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Withdraw</a>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8 text-sm">
            <a href="#" className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><BarChart2 size={16} className="mr-1" /> Orders</a>
            <a href="#" className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><HelpCircle size={16} className="mr-1" /> FAQ</a>
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-[2800px] px-4 sm:px-8 md:px-16 lg:px-32 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          <div className="flex-1 space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-4xl font-semibold">Buy {selectedCrypto} with INR</h1>
            <div className="flex items-center space-x-4 md:space-x-8">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Supported</span>
              {['VISA', 'MC', 'SIMPLEX'].map((item) => (
                <img key={item} src={`https://placehold.co/60x25/ffffff/000000?text=${item}`} alt={item} className="h-5 md:h-6" />
              ))}
            </div>

            <div className={`${isDark ? 'bg-[#24262d]' : 'bg-gray-50'} p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md`}>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg font-semibold">Hot Cryptos</h2>
                {loadingRates && <Loader2 className="animate-spin size-5" />}
              </div>
              <ul className="space-y-4 md:space-y-6">
                {cryptos.map((crypto) => (
                  <li key={crypto.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <img src={crypto.icon} alt={crypto.name} className="w-7 h-7 md:w-8 md:h-8 rounded-full" />
                      <span className={`${isDark ? 'font-medium text-white' : 'font-medium text-gray-800'}`}>{crypto.name}</span>
                    </div>
                    <div className="flex items-baseline space-x-3 md:space-x-4">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{crypto.price}</span>
                      <span className={`text-sm ${crypto.changeColor}`}>{crypto.change}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`w-full lg:w-[32rem] border ${isDark ? 'border-[#24262d]' : 'border-gray-300'} p-6 md:p-8 rounded-xl shadow-lg space-y-6 md:space-y-8`}>
            <div className={`flex rounded-md overflow-hidden ${isDark ? 'bg-[#181a20]' : 'bg-gray-100'}`}>
              {['buy', 'sell'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 md:py-3 text-center text-sm font-medium rounded-md transition-colors duration-200
                    ${activeTab === tab
                      ? 'bg-yellow-500 text-black'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-700/50'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  onClick={() => setActiveTab(tab as 'buy' | 'sell')}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2 md:space-y-3">
              <label htmlFor="spend" className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Spend</label>
              <div className={`flex items-center rounded-md px-4 py-3 md:px-5 md:py-4 border ${isDark ? 'bg-[#1e2026] border-gray-700' : 'bg-white border-gray-300'}`}>
                <input
                  type="text"
                  id="spend"
                  className={`flex-1 bg-transparent outline-none text-lg md:text-xl font-semibold ${
                    isDark
                      ? 'text-white placeholder-gray-500'
                      : 'text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="200-2,315,219"
                  value={inrAmount}
                  onChange={(e) => handleAmountChange(e, true)}
                />
                <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>INR</span>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label htmlFor="receive" className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Receive</label>
              <div className={`flex items-center rounded-md px-4 py-3 md:px-5 md:py-4 border ${isDark ? 'bg-[#1e2026] border-gray-700' : 'bg-white border-gray-300'}`}>
                <input
                  type="text"
                  id="receive"
                  className={`flex-1 bg-transparent outline-none text-lg md:text-xl font-semibold ${
                    isDark
                      ? 'text-white placeholder-gray-500'
                      : 'text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="0"
                  value={cryptoAmount}
                  onChange={(e) => handleAmountChange(e, false)}
                />
                <div className="relative">
                  <button 
                    className={`flex items-center font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                  >
                    <span className="mr-1 md:mr-2">{selectedCrypto}</span>
                    <ChevronDown size={16} className="md:size-[18px]" />
                  </button>
                  {showCryptoDropdown && (
                    <div className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg z-10 ${isDark ? 'bg-[#24262d] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="py-1">
                        {['USDT', 'BTC'].map((crypto) => (
                          <button
                            key={crypto}
                            className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'hover:bg-[#2d3036]' : 'hover:bg-gray-100'} ${
                              selectedCrypto === crypto ? (isDark ? 'bg-[#2d3036]' : 'bg-gray-100') : ''
                            }`}
                            onClick={() => handleCryptoSelect(crypto as 'USDT' | 'BTC')}
                          >
                            {crypto}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                1 {selectedCrypto} ≈ ₹{exchangeRates[selectedCrypto].toLocaleString()}
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Payment Method</label>
              <div className={`flex items-center justify-between rounded-md px-4 py-3 md:px-5 md:py-4 border cursor-pointer ${isDark ? 'bg-[#1e2026] border-gray-700' : 'bg-white border-gray-300'}`}>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <img src="https://placehold.co/28x28/3b82f6/ffffff?text=⚡" alt="Lightning UPI" className="w-6 h-6 md:w-7 md:h-7 rounded" />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Lightning UPI P2P</span>
                </div>
                <ChevronDown size={16} className={`rotate-[-90deg] ${isDark ? 'text-gray-400' : 'text-gray-600'} md:size-[18px]`} />
              </div>
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
                {error}
              </div>
            )}

            {success && (
              <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                Deposit successful! Redirecting to wallet...
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={depositMutation.isPending || success || loadingRates}
              className={`w-full bg-yellow-500 text-black font-semibold py-3 md:py-4 rounded-md shadow-lg hover:bg-yellow-600 transition-colors duration-200 text-base md:text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                success ? 'bg-green-500 hover:bg-green-500' : ''
              }`}
            >
              {depositMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin size-5 md:size-6" />
                  Processing...
                </>
              ) : loadingRates ? (
                <>
                  <Loader2 className="animate-spin size-5 md:size-6" />
                  Loading rates...
                </>
              ) : success ? (
                'Success!'
              ) : (
                `Buy ${selectedCrypto}`
              )}
            </button>

            <div className={`text-xs md:text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'} text-center`}>
              By clicking "Buy {selectedCrypto}", you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySellCrypto;