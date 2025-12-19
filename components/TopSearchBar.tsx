
import React from 'react';
import { Search, Menu, UserCircle } from 'lucide-react';

interface TopSearchBarProps {
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TopSearchBar: React.FC<TopSearchBarProps> = ({ isFocused, onFocus, onBlur, value, onChange }) => {
  return (
    <div className={`
      flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
      ${isFocused ? 'bg-white shadow-lg ring-1 ring-gray-200' : 'bg-[#f3edf7]'}
    `}>
      <Menu className="w-5 h-5 text-gray-600 cursor-pointer" />
      <input 
        type="text" 
        placeholder="Search in Files" 
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500 font-medium"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-600" />
        <UserCircle className="w-8 h-8 text-[#004a77] bg-[#d3e3fd] rounded-full p-0.5" />
      </div>
    </div>
  );
};

export default TopSearchBar;
