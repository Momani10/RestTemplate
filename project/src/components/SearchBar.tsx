import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      {/* Search Icon */}
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6" />

      {/* Input Field */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-14 pr-4 py-3 w-full rounded-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all hover:shadow-md"
      />
    </div>
  );
}
