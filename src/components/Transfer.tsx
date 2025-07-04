import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { getWalletBalance, transferFunds } from '../wallet-services/api';
import {MdOutlineSwapVert} from 'react-icons/md';

export type WalletType = 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
export type CurrencyType = 'USDT' | 'BTC';

export interface TransferInput {
  fromType: WalletType;
  toType: WalletType;
  currency: CurrencyType;
  amount: number;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onTransfer: (data: TransferInput) => Promise<void>;
}

const walletTypes = [
  { value: 'Spot', label: 'Spot' },
  { value: 'Margin', label: 'Margin Wallet' },
  { value: 'Futures', label: 'Futures Wallet' },
  { value: 'Funding', label: 'Funding' },
  { value: 'ThirdParty', label: 'Third Party' },
];

const cryptoOptions = [
  { id: 'usdt', name: 'TETHER', symbol: 'USDT' },
  { id: 'btc', name: 'BITCOIN', symbol: 'BTC' }
];

const TransferModal: React.FC<TransferModalProps> = ({ 
  isOpen, 
  onClose, 
  isDark, 
  onTransfer 
}) => {
  const [amount, setAmount] = useState('');
  const [fromType, setFromType] = useState<WalletType>('Funding');
  const [toType, setToType] = useState<WalletType>('Spot');
  const [currency, setCurrency] = useState<CurrencyType>('USDT');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBalance();
    }
  }, [isOpen, fromType, currency]);

const fetchBalance = async () => {
  setLoading(true);
  setError('');
  try {
    const balance = await getWalletBalance(fromType, currency);
    setBalance(balance);
  } catch (err) {
    console.error('Balance fetch error:', err);
    setError(err instanceof Error ? err.message : 'Failed to load balance. Please try again.');
    setBalance(0);
  } finally {
    setLoading(false);
  }
}

const handleTransfer = async () => {
  if (!amount || isNaN(Number(amount))) {
    setError('Please enter a valid amount');
    return;
  }

  if (Number(amount) <= 0) {
    setError('Amount must be greater than 0');
    return;
  }

  if (fromType === toType) {
    setError('Cannot transfer between same wallets');
    return;
  }

  if (Number(amount) > balance) {
    setError(`Insufficient balance. Max: ${balance.toFixed(8)} ${currency}`);
    return;
  }

  try {
    await transferFunds({
      fromType,
      toType,
      currency,
      amount: Number(amount),
    });
    await fetchBalance();
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Transfer failed');
  }
};

  const toggleCurrency = () => {
    setShowCryptoDropdown(!showCryptoDropdown);
  };

  const selectCurrency = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    setShowCryptoDropdown(false);
    setAmount('');
    setError('');
  };

  const handleFromWalletChange = (value: WalletType) => {
    setFromType(value);
    setShowFromDropdown(false);
    setError('');
  };

  const handleToWalletChange = (value: WalletType) => {
    setToType(value);
    setShowToDropdown(false);
    setError('');
  };

  const handleMaxAmount = () => {
    setAmount(balance.toString());
    setError('');
  };

  const swapWallets = () => {
    const temp = fromType;
    setFromType(toType);
    setToType(temp);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose} 
      />
      
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl z-50 overflow-hidden`}
      >
        <div
          className={`p-4 border-b flex justify-between items-center ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Transfer {currency}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
          >
            <FiX className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
              isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
            }`}>
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                From
              </label>
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setShowFromDropdown(!showFromDropdown);
                  setShowToDropdown(false);
                  setShowCryptoDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                disabled={loading}
              >
                <span>{walletTypes.find((w) => w.value === fromType)?.label}</span>
                <FiChevronDown
                  className={`transition-transform ${showFromDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {showFromDropdown && (
                <div
                  className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {walletTypes.map((wallet) => (
                    <div
                      key={wallet.value}
                      onClick={() => handleFromWalletChange(wallet.value as WalletType)}
                      className={`px-4 py-2 cursor-pointer ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      {wallet.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              To
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowToDropdown(!showToDropdown);
                  setShowFromDropdown(false);
                  setShowCryptoDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                disabled={loading}
              >
                <span>{walletTypes.find((w) => w.value === toType)?.label}</span>
                <FiChevronDown
                  className={`transition-transform ${showToDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {showToDropdown && (
                <div
                  className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {walletTypes.filter(w => w.value !== fromType).map((wallet) => (
                    <div
                      key={wallet.value}
                      onClick={() => handleToWalletChange(wallet.value as WalletType)}
                      className={`px-4 py-2 cursor-pointer ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      {wallet.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 flex justify-center">
            <button
              onClick={swapWallets}
              className={`p-2 rounded-full ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              disabled={loading}
            >
              <MdOutlineSwapVert/>
            </button>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Coin
            </label>
            <div className="relative">
              <button
                onClick={toggleCurrency}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                disabled={loading}
              >
                <span>{currency}</span>
                <FiChevronDown
                  className={`transition-transform ${showCryptoDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {showCryptoDropdown && (
                <div
                  className={`absolute z-10 w-full mt-1 rounded-lg border shadow-lg ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {cryptoOptions.map((crypto) => (
                    <div
                      key={crypto.id}
                      onClick={() => selectCurrency(crypto.symbol as CurrencyType)}
                      className={`px-4 py-2 cursor-pointer ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      {crypto.symbol} - {crypto.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={loading}
              />
            </div>
            <div
              className={`flex justify-between mt-2 text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <span>
                {loading ? 'Loading...' : `Available: ${balance.toFixed(8)} ${currency}`}
              </span>
              <button
                onClick={handleMaxAmount}
                className="text-yellow-500 hover:text-yellow-400"
                disabled={loading}
              >
                Max
              </button>
            </div>
          </div>

          <button
            className={`w-full py-3 rounded-lg font-medium ${
              amount && !loading
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!amount || loading}
            onClick={handleTransfer}
          >
            {loading ? 'Loading...' : 'Confirm Transfer'}
          </button>
        </div>
      </div>
    </>
  );
};

export default TransferModal;