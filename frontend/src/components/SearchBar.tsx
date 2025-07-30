import React from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  isSearching?: boolean;
}

// Search input component with Enter key support and loading state
export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  isSearching = false,
}) => {
  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        🔍 Search
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search emails..."
          className="border border-gray-200 px-4 py-2.5 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-gray-50/50 text-sm transition-all duration-200"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        <button
          onClick={onSearch}
          disabled={isSearching}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </div>
    </div>
  );
};
