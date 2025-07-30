import React from "react";
import { SearchBar } from "./SearchBar";
import { FilterSection } from "./FilterSection";
import type { FilterState } from "../hooks/useEmailFilters";
import { PREDEFINED_FOLDERS, CATEGORIES } from "../constants/filterOptions";
import { getColorClasses } from "../utils/styleHelpers";

interface SidebarProps {
  // Search props
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  isSearching?: boolean;

  // Filter props
  filters: FilterState;
  availableAccounts: string[];
  onFilterChange: (filterType: keyof FilterState, value: string) => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
}

// Sidebar component containing search and filter controls
export const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  filters,
  availableAccounts,
  onFilterChange,
  onClearAllFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="w-80 h-full bg-white/90 backdrop-blur-sm shadow-xl border-r border-gray-200/50 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Filters</h2>
          <p className="text-xs text-gray-500">Refine your email search</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
        <SearchBar
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
          onSearch={onSearch}
          isSearching={isSearching}
        />

        <FilterSection
          title="Accounts"
          titleIcon="👤"
          options={availableAccounts.map((account) => ({
            value: account,
            display: account,
            icon: "📧",
          }))}
          selectedValue={filters.selectedAccount}
          onFilterChange={(value) => onFilterChange("selectedAccount", value)}
          maxHeight="max-h-32"
        />

        <FilterSection
          title="Folders"
          titleIcon="📁"
          options={PREDEFINED_FOLDERS}
          selectedValue={filters.selectedFolder}
          onFilterChange={(value) => onFilterChange("selectedFolder", value)}
          getButtonClasses={(_, isSelected) =>
            `w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border ${
              isSelected
                ? "bg-purple-50 text-purple-700 border-purple-200 shadow-sm"
                : "bg-gray-50/50 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border-gray-200"
            }`
          }
        />

        <FilterSection
          title="Categories"
          titleIcon="🏷️"
          options={CATEGORIES}
          selectedValue={filters.selectedCategory}
          onFilterChange={(value) => onFilterChange("selectedCategory", value)}
          getButtonClasses={(option, isSelected) => {
            const category = CATEGORIES.find((c) => c.value === option.value);
            const colorClass = category
              ? getColorClasses(category.color, isSelected)
              : "";
            return `w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border ${
              isSelected
                ? colorClass
                : `bg-gray-50/50 text-gray-700 border-gray-200 ${colorClass}`
            }`;
          }}
        />

        {hasActiveFilters && (
          <button
            onClick={onClearAllFilters}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 text-sm font-medium border border-gray-200"
          >
            ✨ Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};
