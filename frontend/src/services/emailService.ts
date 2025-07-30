import type { Email, EmailApiResponse } from "../types/email";

// Service class for handling email API communication
class EmailService {
  private baseUrl = "/api";

  // Fetch emails from API with optional search functionality
  async fetchEmails(searchQuery?: string): Promise<Email[]> {
    const params = new URLSearchParams();
    if (searchQuery?.trim()) {
      params.append("q", searchQuery);
    }

    const response = await fetch(`${this.baseUrl}/emails?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EmailApiResponse = await response.json();
    return this.flattenEmailResponse(data);
  }

  // Search emails using the fetch method
  async searchEmails(query: string): Promise<Email[]> {
    return this.fetchEmails(query);
  }

  // Convert nested API response structure to flat email array
  private flattenEmailResponse(data: EmailApiResponse): Email[] {
    const flattened: Email[] = [];
    const emailsObj = data.emails;

    for (const emailGroup of Object.values(emailsObj)) {
      for (const folderName in emailGroup) {
        const folderEmails = emailGroup[folderName];
        for (const email of folderEmails) {
          const emailWithFolder = { ...email, folder: folderName };
          flattened.push(emailWithFolder);
        }
      }
    }

    return flattened;
  }
}

export const emailService = new EmailService();
