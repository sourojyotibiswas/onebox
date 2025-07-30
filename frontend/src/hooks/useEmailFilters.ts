import { useState, useCallback, useMemo } from "react";
import type { Email } from "../types/email";

export interface FilterState {
  selectedAccount: string;
  selectedFolder: string;
  selectedCategory: string;
}

// Custom hook for managing email filtering logic and state
export const useEmailFilters = (emails: Email[]) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedAccount: "",
    selectedFolder: "",
    selectedCategory: "",
  });

  // Extract unique accounts from emails for filter options
  const availableAccounts = useMemo(() => {
    const accounts = new Set<string>();
    emails.forEach((email) => {
      if (email.account) accounts.add(email.account);
    });
    return Array.from(accounts);
  }, [emails]);

  // Filter emails based on active filter criteria
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchAccount = filters.selectedAccount
        ? email.account === filters.selectedAccount
        : true;
      const matchFolder = filters.selectedFolder
        ? email.folder === filters.selectedFolder
        : true;
      const matchCategory = filters.selectedCategory
        ? email.category === filters.selectedCategory
        : true;
      return matchAccount && matchFolder && matchCategory;
    });
  }, [emails, filters]);

  const updateFilter = useCallback(
    (filterType: keyof FilterState, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType] === value ? "" : value,
      }));
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      selectedAccount: "",
      selectedFolder: "",
      selectedCategory: "",
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.selectedAccount ||
      filters.selectedFolder ||
      filters.selectedCategory
    );
  }, [filters]);

  return {
    filters,
    filteredEmails,
    availableAccounts,
    updateFilter,
    clearAllFilters,
    hasActiveFilters,
  };
};
