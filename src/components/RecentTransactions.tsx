import { ChevronRight, FileSearch } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Adjust path as needed

const RecentTransactions = () => {
  const { isDark } = useTheme(); // Get theme from context

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-6 rounded-lg border ${
      isDark 
        ? 'bg-[#181a20] text-white border-[#2b3139]' 
        : 'bg-white text-black border-[#eaecef]'
    }`} style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl font-medium">Recent Transactions</h2>
        <button className="flex items-center gap-2 text-sm font-medium group">
          <span>More</span>
          <ChevronRight 
            size={16} 
            className={`transition-colors duration-200 ${
              isDark 
                ? 'text-gray-400 group-hover:text-white' 
                : 'text-gray-600 group-hover:text-black'
            }`}
          />
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className={`mb-4 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <FileSearch size={48} />
        </div>
        <p className={`text-sm ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          No records
        </p>
      </div>
    </div>
  );
};

export default RecentTransactions;