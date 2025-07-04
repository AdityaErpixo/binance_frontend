import React, { useState } from 'react';
import { FileSearch, ChevronDown, Search, Lock, X, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string;
  setSelected: (option: string) => void;
  width?: string;
  onCustomizedClick?: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, setSelected, width = 'w-48', onCustomizedClick }) => {
  const { isDark } = useTheme();
  const bg = isDark ? 'bg-[#181a20]' : 'bg-white';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const border = isDark ? 'border-gray-600' : 'border-gray-300';
  
  return (
    <div className="relative group">
      <div className={`${bg} ${text} px-4 py-2 rounded-lg border ${border} group-hover:border-[#f0b90b] cursor-pointer min-w-[120px] flex items-center justify-between`}>
        <span>{selected}</span>
        <ChevronDown size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
      </div>
      <span className={`absolute left-3 -top-2 px-1 text-xs ${isDark ? 'text-[#848e9c] bg-[#181a20]' : 'text-[#848e9c] bg-white'}`}>{label}</span>
      
      <div className={`absolute top-full left-0 mt-1 ${width} ${isDark ? 'bg-[#1e2329]' : 'bg-white'} rounded-lg shadow-lg border ${border} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
        {options.map((option, i) => (
          <div key={option} onClick={() => option === 'Customized' && onCustomizedClick ? onCustomizedClick() : setSelected(option)}
            className={`px-4 py-3 cursor-pointer ${option === selected ? (isDark ? 'text-yellow-400' : 'text-yellow-600') : (isDark ? 'text-gray-300' : 'text-gray-700')} ${isDark ? 'hover:bg-[#2b3139] hover:text-white' : 'hover:bg-gray-100'} ${!i ? 'rounded-t-lg' : ''} ${i === options.length - 1 ? 'rounded-b-lg' : ''}`}>
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

const DateRangeModal: React.FC<{ isOpen: boolean, onClose: () => void, onContinue: (s: string, e: string) => void }> = ({ isOpen, onClose, onContinue }) => {
  const { isDark } = useTheme();
  const [dates, setDates] = useState({ start: '2025-03-03', end: '2025-06-03' });

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className={`${isDark ? 'bg-[#1e2329] text-white' : 'bg-white text-gray-900'} rounded-lg p-6 w-96 max-w-[90vw]`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Select a Time Range</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-6`}>Select your time range within 12 months.</p>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start time</label>
            <div className="relative">
              <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})}
                className={`w-full ${isDark ? 'bg-[#1e2329]' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'} px-3 py-2 rounded border ${isDark ? 'border-gray-600' : 'border-gray-300'} focus:border-[#f0b90b] focus:outline-none text-sm`} />
              <Calendar size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="pt-5"><span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>to</span></div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">End time</label>
            <div className="relative">
              <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})}
                className={`w-full ${isDark ? 'bg-[#1e2329]' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'} px-3 py-2 rounded border ${isDark ? 'border-gray-600' : 'border-gray-300'} focus:border-[#f0b90b] focus:outline-none text-sm`} />
              <Calendar size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <button onClick={() => { onContinue(dates.start, dates.end); onClose(); }}
          className="w-full bg-[#fcd535] text-black font-medium py-3 rounded mt-6 hover:bg-[#f0b90b] transition-colors">
          Continue
        </button>
      </div>
    </div>
  ) : null;
};

const TransactionHistory: React.FC = () => {
  const { isDark } = useTheme();
  const [state, setState] = useState({
    selectedType: 'Deposit',
    selectedTime: 'Past 30 days',
    selectedStatus: 'All',
    activeNavItem: 'Crypto',
    isDateModalOpen: false
  });

  const options = {
    type: ['Deposit', 'Withdraw', 'Auto deduction', 'Auto funding', 'Arrears repayment', 'Auto convert', 'Partners Transfer'],
    time: ['Past 7 days', 'Past 30 days', 'Past 90 days', 'Customized'],
    status: ['All', 'Completed', 'Pending'],
    nav: ['Transfer', 'Distribution', 'BNB Convert', 'Loan', 'Funding Wallet', 'Referral']
  };

  return (
    <div className={`min-h-screen ${isDark ? 'text-white bg-[#181a20]' : 'text-gray-900 bg-white'}`}>
      <div className="px-6 py-4">
        <div className="flex items-center">
          <nav className="flex space-x-8">
            {['Crypto', ...options.nav].map(item => (
              <button key={item} onClick={() => setState({...state, activeNavItem: item})}
                className={`font-medium relative ${state.activeNavItem === item ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-600')} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                {item}
                {state.activeNavItem === item && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#fcd535]"></div>}
              </button>
            ))}
          </nav>
          <Lock size={20} className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <FilterDropdown label="Type" options={options.type} selected={state.selectedType} setSelected={s => setState({...state, selectedType: s})} />
          <FilterDropdown label="Time" options={options.time} selected={state.selectedTime} setSelected={s => setState({...state, selectedTime: s})} 
            width="w-40" onCustomizedClick={() => setState({...state, isDateModalOpen: true})} />
          
          <div className="relative group">
            <select className={`${isDark ? 'bg-[#181a20] text-white' : 'bg-white text-gray-900'} px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'} group-hover:border-[#f0b90b] appearance-none pr-10 min-w-[100px]`}>
              <option>All</option>
            </select>
            <span className={`absolute left-3 -top-2 px-1 text-xs ${isDark ? 'text-[#848e9c] bg-[#181a20]' : 'text-[#848e9c] bg-white'}`}>Coin</span>
            <ChevronDown size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`} />
          </div>

          <FilterDropdown label="Status" options={options.status} selected={state.selectedStatus} setSelected={s => setState({...state, selectedStatus: s})} width="w-32" />

          <div className="relative flex-1 max-w-md">
            <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input type="text" placeholder="Enter TxID"
              className={`w-full ${isDark ? 'bg-[#181a20] text-white' : 'bg-white text-gray-900'} pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'} placeholder-gray-400 focus:outline-none focus:border-gray-500`} />
          </div>

          <button className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-4 py-2`}>Reset</button>
        </div>

        <div className="mb-6">
          <a href="#" className="text-yellow-400 hover:text-yellow-300 underline text-sm">Deposit hasn't arrived?</a>
        </div>

        <div className={`grid grid-cols-8 gap-4 px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {['Time', 'Type', 'Deposit wallet', 'Coin', 'Amount', 'Destination', 'TxID', 'Status'].map(h => <div key={h}>{h}</div>)}
        </div>
        
        <div className={`h-px w-full ${isDark ? 'bg-[#2b3139]' : 'bg-[#eaecef]'}`} />

        <div className="flex flex-col items-center justify-center py-20">
          <FileSearch size={48} className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg`}>No records</p>
        </div>
      </div>

      <DateRangeModal isOpen={state.isDateModalOpen} onClose={() => setState({...state, isDateModalOpen: false})} 
        onContinue={(s, e) => setState({...state, selectedTime: `${s} to ${e}`, isDateModalOpen: false})} />
    </div>
  );
};

export default TransactionHistory;