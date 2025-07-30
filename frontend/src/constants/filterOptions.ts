import type { FolderOption, CategoryOption } from "../types/filters";

export const PREDEFINED_FOLDERS: FolderOption[] = [
  { value: "INBOX", display: "Inbox", icon: "📥" },
  { value: "[Gmail]/All Mail", display: "All Mail", icon: "📧" },
  { value: "[Gmail]/Important", display: "Important", icon: "⭐" },
  { value: "[Gmail]/Spam", display: "Spam", icon: "🚫" },
  { value: "[Gmail]/Sent Mail", display: "Sent Mail", icon: "📤" },
];

export const CATEGORIES: CategoryOption[] = [
  { value: "Interested", display: "Interested", icon: "💚", color: "emerald" },
  {
    value: "Meeting Booked",
    display: "Meeting Booked",
    icon: "📅",
    color: "blue",
  },
  {
    value: "Not Interested",
    display: "Not Interested",
    icon: "❌",
    color: "red",
  },
  { value: "Spam", display: "Spam", icon: "🚫", color: "gray" },
  {
    value: "Out of Office",
    display: "Out of Office",
    icon: "🏖️",
    color: "amber",
  },
];
