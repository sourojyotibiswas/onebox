import React from "react";

interface FilterOption {
  value: string;
  display: string;
  icon?: string;
}

interface FilterSectionProps {
  title: string;
  titleIcon: string;
  options: FilterOption[];
  selectedValue: string;
  onFilterChange: (value: string) => void;
  maxHeight?: string;
  getButtonClasses?: (option: FilterOption, isSelected: boolean) => string;
}

// Reusable component for rendering filter sections with customizable styling
export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  titleIcon,
  options,
  selectedValue,
  onFilterChange,
  maxHeight = "auto",
  getButtonClasses,
}) => {
  // Default button styling function
  const defaultButtonClasses = (isSelected: boolean) =>
    `w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 border ${
      isSelected
        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
        : "bg-gray-50/50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border-gray-200"
    }`;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {titleIcon} {title}
      </h3>
      <div
        className={`space-y-2 ${
          maxHeight !== "auto" ? `${maxHeight} overflow-y-auto` : ""
        }`}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const buttonClasses = getButtonClasses
            ? getButtonClasses(option, isSelected)
            : defaultButtonClasses(isSelected);

          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={buttonClasses}
            >
              <span className="flex items-center gap-2">
                {option.icon && option.icon}
                <span className="truncate">{option.display}</span>
              </span>
            </button>
          );
        })}
        {options.length === 0 && (
          <p className="text-sm text-gray-400 italic text-center py-2">
            No {title.toLowerCase()} found
          </p>
        )}
      </div>
    </div>
  );
};
