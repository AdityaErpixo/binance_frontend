import React, { useState } from "react";
import { FileSearch, ChevronDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const PaymentHistory: React.FC = () => {
  const { isDark } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const typeOptions = ["All", "Paid", "Receive", "Pre-Authorization"];
  const dateRanges = ["7 Days", "30 Days", "90 Days"];

  const handleTypeSelect = (option: string) => {
    setSelectedType(option);
    setIsDropdownOpen(false);
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const isSameDay = (a: Date, b: Date) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const isInRange = (date: Date) => rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd;
  const isRangeEdge = (date: Date) => (rangeStart && isSameDay(date, rangeStart)) || (rangeEnd && isSameDay(date, rangeEnd));

  const handleDateRangeSelect = (range: string) => {
    const days = parseInt(range);
    if (isNaN(days)) return;
    
    const today = new Date();
    const start = new Date(today.getTime() - days * 86400000);
    
    setSelectedRange(range);
    setRangeStart(start);
    setRangeEnd(today);
    setStartDate(formatDate(start));
    setEndDate(formatDate(today));
  };

  const handleDateClick = (date: Date) => {
    if (!isSelecting) {
      setRangeStart(date);
      setRangeEnd(null);
      setIsSelecting(true);
    } else if (rangeStart) {
      const [start, end] = date >= rangeStart ? [rangeStart, date] : [date, rangeStart];
      setRangeStart(start);
      setRangeEnd(end);
      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
      setIsSelecting(false);
    }
  };

  const generateCalendarDays = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    return Array.from({ length: 42 }, (_, i) => new Date(startDate.setDate(startDate.getDate() + (i > 0 ? 1 : 0))))
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const renderCalendarDay = (day: Date, currentMonthIndex: number) => {
    const isCurrentMonth = day.getMonth() === currentMonthIndex;
    const isToday = isSameDay(day, new Date());
    const dayClasses = `py-2 cursor-pointer transition-colors ${
      !isCurrentMonth ? (isDark ? "text-gray-600" : "text-gray-400") : (isDark ? "text-white" : "text-black")
    } ${isToday && isCurrentMonth && (isDark ? "bg-[#2b3139]" : "bg-gray-200")} ${
      isInRange(day) && isCurrentMonth && "bg-[#f0b90b] bg-opacity-20"
    } ${isRangeEdge(day) && isCurrentMonth && "bg-[#f0b90b] text-black font-medium"}`;

    return (
      <div key={day.toString()} className={dayClasses} onClick={() => isCurrentMonth && handleDateClick(day)}>
        {day.getDate()}
      </div>
    );
  };

  const renderCalendar = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const commonBtnClass = `p-1 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`;

    return (
      <div className={`absolute top-full left-0 mt-1 z-20 ${isDark ? 'bg-[#1e2329]' : 'bg-white'} border ${isDark ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-6 w-[700px]`}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigateMonth('prev')} className={commonBtnClass}><ChevronLeft size={20} /></button>
          <div className="flex gap-6">
            {dateRanges.map(range => (
              <button key={range} className={`${commonBtnClass} px-3 py-1 rounded`} onClick={() => handleDateRangeSelect(range)}>
                {range}
              </button>
            ))}
          </div>
          <button onClick={() => navigateMonth('next')} className={commonBtnClass}><ChevronRight size={20} /></button>
        </div>

        <div className="flex gap-8">
          {[currentMonth, nextMonth].map((month, i) => (
            <div key={i} className="flex-1">
              <div className={`text-center ${isDark ? 'text-white' : 'text-black'} font-medium mb-4`}>
                {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              <div className={`grid grid-cols-7 gap-1 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="py-1">{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {generateCalendarDays(month).map(day => renderCalendarDay(day, month.getMonth()))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {rangeStart && rangeEnd ? `Selected: ${formatDate(rangeStart)} → ${formatDate(rangeEnd)}`
            : isSelecting && rangeStart ? `Start: ${formatDate(rangeStart)} | Click end date`
            : "Click to select start date"}
          </div>
          <div className="flex gap-2">
            <button className={`px-4 py-2 ${commonBtnClass} rounded`} onClick={() => {
              setRangeStart(null); setRangeEnd(null);
              setStartDate(""); setEndDate("");
              setSelectedRange(""); setIsSelecting(false);
            }}>Reset</button>
            <button className="px-4 py-2 bg-[#f0b90b] text-black rounded font-medium hover:bg-[#d9a441]" onClick={() => setIsCalendarOpen(false)}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const inputClasses = `bg-transparent border-0 outline-none w-24 ${isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-500'}`;
  const buttonBaseClasses = `px-4 py-2 text-sm rounded-lg`;
  const dropdownAndCalendarBtnClasses = `flex items-center gap-2 ${isDark ? 'bg-[#181a20] border-gray-600 text-white' : 'bg-white border-gray-200 text-black'} border hover:border-[#f0b90b]`;

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${isDark ? 'bg-[#181a20]' : 'bg-gray-50'} min-h-screen`}>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative">
          <button 
            className={`${dropdownAndCalendarBtnClasses} ${buttonBaseClasses}`}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className={isDark ? "text-gray-400" : "text-gray-500"}>Type</span>
            <span>{selectedType}</span>
            <ChevronDown size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
          </button>
          
          {isDropdownOpen && (
            <div 
              className={`absolute top-full left-0 mt-1 w-full rounded-lg border ${isDark ? 'border-gray-600 bg-[#1e2329]' : 'border-gray-200 bg-white'} z-10`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {typeOptions.map(option => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer ${selectedType === option ? 'text-[#f0b90b]' : isDark ? 'text-[#eaecef]' : 'text-gray-700'} hover:${isDark ? 'bg-[#2b3139]' : 'bg-gray-100'}`}
                  onClick={() => handleTypeSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div className={`${dropdownAndCalendarBtnClasses} ${buttonBaseClasses}`}>
            <input type="text" placeholder="YYYY-MM-DD" className={inputClasses} value={startDate} onChange={e => setStartDate(e.target.value)}/>
            <span className={isDark ? "text-gray-400" : "text-gray-500"}>→</span>
            <input type="text" placeholder="YYYY-MM-DD" className={inputClasses} value={endDate} onChange={e => setEndDate(e.target.value)}/>
            <button className={`ml-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`} onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
              <Calendar size={16} />
            </button>
          </div>
          {isCalendarOpen && renderCalendar()}
        </div>

        <button className={`${buttonBaseClasses} ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} hover:${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
          Reset
        </button>

        <button className={`${buttonBaseClasses} bg-yellow-500 text-black font-medium hover:bg-yellow-400 px-6`}>
          Search
        </button>
      </div>

      <div className={`grid grid-cols-7 gap-4 px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
        {["Date", "Type", "To/From", "Amount", "Currency", "Status", "Action"].map(heading => (
          <div key={heading}>{heading}</div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <FileSearch size={48} className={isDark ? "text-gray-500" : "text-gray-400"} />
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg mb-2`}>No payment history found</p>
        <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Try adjusting your search criteria</p>
      </div>
    </div>
  );
};

export default PaymentHistory;