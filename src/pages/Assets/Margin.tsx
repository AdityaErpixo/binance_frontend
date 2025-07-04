import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Settings, MoreVertical } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import CrossTable from "../../components/funds";

const DashedUnderline = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block">
    {children}
    <span className="absolute left-0 -bottom-0.5 w-full h-[1px] bg-gradient-to-r from-current to-transparent bg-[length:4px_1px]" />
  </span>
);

const currencies = ["BTC", "ETH", "BNB", "USDT"];

const Margin = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("Cross Margin");
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [showDropdown, setShowDropdown] = useState(false);

  const renderBalance = (value: string, className = "") => (
    <span className={className}>{hideBalance ? "********" : value}</span>
  );

  const renderTabContent = () => {
    const commonClasses = {
      bg: isDark ? "bg-[#181a20]" : "bg-white",
      border: isDark ? "border-[#2b3139]" : "border-gray-200",
      text: isDark ? "text-white" : "text-gray-900",
      textSecondary: isDark ? "text-gray-400" : "text-gray-500",
      hover: isDark ? "hover:bg-[#2b3139]" : "hover:bg-gray-100",
    };

    if (activeTab === "Cross Margin") {
      return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Balance Column */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">Total balance</h3>
                <EyeToggle {...{ hideBalance, setHideBalance }} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                {renderBalance("0.00000000", "text-xl md:text-2xl font-bold")}
                <CurrencyDropdown {...{ selectedCurrency, showDropdown, setShowDropdown, setSelectedCurrency, hideBalance }} />
              </div>
              <div className="text-sm font-normal">
                {renderBalance("≈ $0.00")}
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="font-normal">Today's PNL</span>
                {renderBalance("$0.00(0.00%)", "font-medium")}
                <span>›</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <BalanceItem label="Collateral Value(USDT)" value={hideBalance ? "********" : "-"} dashed />
              <BalanceItem label="Total Debt(ETH)" value={hideBalance ? "********" : "0.00000000"} large withConversion hideBalance={hideBalance} />
            </div>
          </div>

          {/* Margin Level Column */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <div className="text-lg mb-2 font-bold">
                <DashedUnderline>Margin Level</DashedUnderline>
              </div>
              {hideBalance ? (
                renderBalance("********", "text-xl md:text-2xl font-bold")
              ) : (
                <div className="flex items-center gap-2">
                  <MarginLevelIcon />
                  <span className="text-xl md:text-2xl font-bold text-green-500">999.00</span>
                </div>
              )}
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="mt-16 md:mt-[85px]">
                <BalanceItem label="Collateral Margin Level:" value={hideBalance ? "********" : "-"} dashed />
              </div>
              <BalanceItem label="Account Equity(ETH)" value={hideBalance ? "********" : "0.00000000"} large withConversion hideBalance={hideBalance} dashed />
            </div>
          </div>

          {/* Settings Column */}
          <div className="flex justify-start md:justify-end items-start">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#fcd535] font-semibold">Cross 5x</span>
              <Settings size={14} className={commonClasses.textSecondary} />
            </div>
          </div>
        </div>
    
        </>
        
      );
    } else {
      return (
        <div className="relative -mt-2">
          <Settings size={20} className={`absolute top-0 right-0 ${commonClasses.textSecondary} hover:${commonClasses.text} cursor-pointer`} />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium">Total balance</h3>
              <EyeToggle {...{ hideBalance, setHideBalance }} size={16} />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {renderBalance("0.00000000", "text-2xl md:text-3xl font-bold")}
              <CurrencyDropdown {...{ selectedCurrency, showDropdown, setShowDropdown, setSelectedCurrency, large: true, hideBalance }} />
            </div>
            
            <div className="text-sm md:text-base mb-3">
              {renderBalance("≈ $0.00")}
            </div>
            
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span>Today's PNL</span>
              {renderBalance("$0.00(0.00%)", "font-medium")}
              <ChevronDown size={14} className="rotate-270" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mt-4">
            <BalanceItem label="Total Debt(ETH)" value={hideBalance ? "********" : "0.00000000"} large withConversion hideBalance={hideBalance} />
            <BalanceItem label="Account Equity(ETH)" value={hideBalance ? "********" : "0.00000000"} large withConversion dashed hideBalance={hideBalance} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`w-full min-h-screen px-4 sm:px-6 py-6 font-sans ${isDark ? "bg-[#181a20]" : "bg-white"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 w-full sm:w-auto">
          {["Cross Margin", "Isolated Margin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-2 whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? `${isDark ? "text-white" : "text-gray-900"} border-[#fcd535]`
                  : `${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} border-transparent`
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <ActionButton color="yellow">Borrow</ActionButton>
          <ActionButton>Repay</ActionButton>
          <ActionButton>Transfer</ActionButton>
          <MoreVertical size={20} className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} cursor-pointer`} />
        </div>
      </div>

      <div className={`w-full px-4 sm:px-6 py-6 rounded-lg border ${isDark ? "bg-[#181a20] border-[#2b3139]" : "bg-white border-gray-200"}`}>
        {renderTabContent()}
      </div>
       {activeTab === "Cross Margin" && (
      <div className={`w-full mt-5 px-4 sm:px-6 py-6 rounded-lg border ${isDark ? "bg-[#181a20] border-[#2b3139]" : "bg-white border-gray-200"}`}>
        <CrossTable />
      </div>
    )}
    </div>
  );
};

// Extracted components
const EyeToggle = ({ hideBalance, setHideBalance, size = 14 }: { hideBalance: boolean, setHideBalance: (val: boolean) => void, size?: number }) => {
  const { isDark } = useTheme();
  return (
    <div onClick={() => setHideBalance(!hideBalance)} className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}>
      {hideBalance ? <EyeOff size={size} /> : <Eye size={size} />}
    </div>
  );
};

const CurrencyDropdown = ({ selectedCurrency, showDropdown, setShowDropdown, setSelectedCurrency, large = false, hideBalance = false }: any) => {
  const { isDark } = useTheme();
  const commonClasses = {
    bg: isDark ? "bg-[#181a20]" : "bg-white",
    border: isDark ? "border-[#2b3139]" : "border-gray-200",
    text: isDark ? "text-white" : "text-gray-900",
    hover: isDark ? "hover:bg-[#2b3139]" : "hover:bg-gray-100",
  };

  return (
    <div className="relative">
      {hideBalance ? (
        <div className="flex items-center gap-1">
          <span className={`font-semibold ${large ? "text-base md:text-lg" : "text-sm"}`}></span>
        </div>
      ) : (
        <>
          <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1 cursor-pointer">
            <span className={`font-semibold ${large ? "text-base md:text-lg" : "text-sm"}`}>{selectedCurrency}</span>
            <ChevronDown size={large ? 16 : 14} className={isDark ? "text-gray-400" : "text-gray-500"} />
          </div>
          
          {showDropdown && (
            <div className={`absolute top-full left-0 mt-1 rounded-md shadow-lg z-10 min-w-[80px] ${commonClasses.bg} ${commonClasses.border}`}>
              {currencies.map((currency) => (
                <div
                  key={currency}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setShowDropdown(false);
                  }}
                  className={`px-3 py-2 text-sm font-medium cursor-pointer ${commonClasses.hover}`}
                >
                  {currency}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const BalanceItem = ({ label, value, large = false, dashed = false, withConversion = false, hideBalance = false }: any) => {
  const { isDark } = useTheme();
  return (
    <div>
      <div className={`${large ? "text-sm" : "text-xs sm:text-sm"} ${isDark ? "text-gray-400" : "text-gray-500"} mb-1`}>
        {dashed ? <DashedUnderline>{label}</DashedUnderline> : label}
      </div>
      <div className={`${large ? "text-lg sm:text-xl" : "text-base sm:text-lg"} ${isDark ? "text-white" : "text-gray-900"} mb-1`}>
        {value}
      </div>
      {withConversion && !hideBalance && (
        <div className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"} font-normal`}>≈ $0.00</div>
      )}
    </div>
  );
};

const ActionButton = ({ children, color = "gray" }: any) => {
  const { isDark } = useTheme();
  return (
    <button className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded transition-colors ${
      color === "yellow" 
        ? "bg-[#fcd535] text-black font-semibold" 
        : `${isDark ? "bg-[#2b3139] text-gray-300" : "bg-gray-100 text-gray-700"}`
    }`}>
      {children}
    </button>
  );
};

const MarginLevelIcon = () => {
  const { isDark } = useTheme();
  const needleColor = isDark ? "white" : "black";
  
  return (
    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.42407 8.99628C9.04452 8.37583 9.42828 7.51869 9.42828 6.57191C9.42828 5.62514 9.04452 4.76799 8.42407 4.14754L9.63625 2.93536C10.5669 3.86604 11.1426 5.15175 11.1426 6.57191C11.1426 7.99207 10.5669 9.27779 9.63625 10.2085L8.42407 8.99628Z" fill="#ef4444"/>
      <path d="M5.99959 3.14294C5.05281 3.14294 4.19567 3.52669 3.57522 4.14714L2.36304 2.93496C3.29371 2.00429 4.57943 1.42865 5.99959 1.42865C7.41975 1.42865 8.70546 2.00428 9.63613 2.93496L8.42395 4.14714C7.8035 3.52669 6.94636 3.14294 5.99959 3.14294Z" fill="#fcd535"/>
      <path d="M2.57146 6.57191C2.57146 7.51869 2.95522 8.37583 3.57567 8.99628L2.36349 10.2085C1.43281 9.27778 0.857178 7.99207 0.857178 6.57191C0.857178 5.15175 1.43281 3.86604 2.36349 2.93536L3.57567 4.14754C2.95522 4.76799 2.57146 5.62513 2.57146 6.57191Z" fill="#10b981"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00004 6.57135C8.00004 7.67592 7.1046 8.57135 6.00004 8.57135C5.14712 8.57135 4.41891 8.03746 4.13136 7.28564H0.906387C0.873947 7.05219 0.857178 6.81371 0.857178 6.57132C0.857178 6.32895 0.873945 6.0905 0.906379 5.85706H4.13136C4.41891 5.10524 5.14712 4.57135 6.00004 4.57135C7.1046 4.57135 8.00004 5.46678 8.00004 6.57135ZM6.57146 6.57135C6.57146 6.88694 6.31563 7.14278 6.00004 7.14278C5.68444 7.14278 5.42861 6.88694 5.42861 6.57135C5.42861 6.25576 5.68444 5.99992 6.00004 5.99992C6.31563 5.99992 6.57146 6.25576 6.57146 6.57135Z" fill={needleColor}/>
    </svg>
  );
};

export default Margin;