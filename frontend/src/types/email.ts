export interface Email {
  subject: string;
  from: string;
  to: string[] | string;
  date: string;
  body: string;
  folder: string;
  account: string;
  category?: string;
}

export interface EmailApiResponse {
  emails: Record<string, Record<string, Email[]>>;
}
