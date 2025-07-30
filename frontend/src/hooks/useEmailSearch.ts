import { useState, useCallback, useEffect } from "react";
import { emailService } from "../services/emailService";

// Custom hook for managing search functionality with debouncing
export const useEmailSearch = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchEmails = useCallback(async () => {
    if (!debouncedQuery.trim()) return [];

    setIsSearching(true);
    try {
      const results = await emailService.searchEmails(debouncedQuery);
      return results;
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    debouncedQuery,
    searchEmails,
    isSearching,
  };
};
