import React from "react";
import type { FilterState } from "../hooks/useEmailFilters";
import { PREDEFINED_FOLDERS, CATEGORIES } from "../constants/filterOptions";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (filterType: keyof FilterState) => void;
}

// Component to display and manage active filters with remove functionality
export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
}) => {
  const hasActiveFilters = !!(
    filters.selectedAccount ||
    filters.selectedFolder ||
    filters.selectedCategory
  );

  if (!hasActiveFilters) return null;

  // Generate filter chip component with remove button
  const getFilterChip = (
    type: keyof FilterState,
    value: string,
    icon: string,
    colorClass: string,
    displayValue?: string
  ) => (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${colorClass}`}
    >
      {icon} {displayValue || value}
      <button
        onClick={() => onRemoveFilter(type)}
        className="ml-1 hover:bg-black/10 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
      >
        ✕
      </button>
    </span>
  );

  return (
    <div className="flex gap-2 flex-wrap bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/50">
      <span className="text-sm text-gray-600 font-medium mr-2">
        Active filters:
      </span>

      {filters.selectedAccount &&
        getFilterChip(
          "selectedAccount",
          filters.selectedAccount,
          "👤",
          "bg-indigo-100 text-indigo-800"
        )}

      {filters.selectedFolder &&
        getFilterChip(
          "selectedFolder",
          filters.selectedFolder,
          "📁",
          "bg-purple-100 text-purple-800",
          PREDEFINED_FOLDERS.find((f) => f.value === filters.selectedFolder)
            ?.display
        )}

      {filters.selectedCategory &&
        getFilterChip(
          "selectedCategory",
          filters.selectedCategory,
          CATEGORIES.find((c) => c.value === filters.selectedCategory)?.icon ||
            "🏷️",
          (() => {
            const category = CATEGORIES.find(
              (c) => c.value === filters.selectedCategory
            );
            switch (category?.color) {
              case "emerald":
                return "bg-emerald-100 text-emerald-800";
              case "blue":
                return "bg-blue-100 text-blue-800";
              case "red":
                return "bg-red-100 text-red-800";
              case "amber":
                return "bg-amber-100 text-amber-800";
              default:
                return "bg-gray-100 text-gray-800";
            }
          })()
        )}
    </div>
  );
};
