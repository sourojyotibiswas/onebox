import { useState, useEffect, useCallback } from "react";
import type { Email } from "../types/email";
import { emailService } from "../services/emailService";

// Custom hook for managing email data fetching and state
export const useEmailData = () => {
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch emails with optional search query
  const fetchEmails = useCallback(async (searchQuery?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const emails = await emailService.fetchEmails(searchQuery);
      setAllEmails(emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch emails");
      console.error("Failed to fetch emails:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return {
    allEmails,
    isLoading,
    error,
    fetchEmails,
  };
};
