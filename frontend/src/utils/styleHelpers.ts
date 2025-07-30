// Generate color classes for filter buttons based on selection state
export const getColorClasses = (color: string, isSelected: boolean): string => {
  const colors = {
    emerald: isSelected
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
      : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200",
    blue: isSelected
      ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
      : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
    red: isSelected
      ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
      : "hover:bg-red-50 hover:text-red-700 hover:border-red-200",
    gray: isSelected
      ? "bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
      : "hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200",
    amber: isSelected
      ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
      : "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200",
  };
  return colors[color as keyof typeof colors] || colors.gray;
};

// Get badge classes for email category display
export const getCategoryBadgeClasses = (category: string): string => {
  const base =
    "inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm";
  switch (category) {
    case "Interested":
      return `${base} bg-emerald-100 text-emerald-700 border border-emerald-200`;
    case "Meeting Booked":
      return `${base} bg-blue-100 text-blue-700 border border-blue-200`;
    case "Not Interested":
      return `${base} bg-red-100 text-red-700 border border-red-200`;
    case "Out of Office":
      return `${base} bg-amber-100 text-amber-700 border border-amber-200`;
    case "Spam":
      return `${base} bg-gray-100 text-gray-600 border border-gray-200`;
    default:
      return `${base} bg-gray-50 text-gray-500 border border-gray-200`;
  }
};

// Get emoji icon for email category
export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "Interested":
      return "💚";
    case "Meeting Booked":
      return "📅";
    case "Not Interested":
      return "❌";
    case "Out of Office":
      return "🏖️";
    case "Spam":
      return "🚫";
    default:
      return "🏷️";
  }
};

// Extract initials from email address for avatar display
export const getInitials = (email: string): string => {
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
};

// Format date for relative display (Today, Yesterday, etc.)
export const formatDate = (date: string): string => {
  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: dateObj.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return date || "Invalid date";
  }
};

// Format email 'to' field for display (handles arrays and strings)
export const formatToField = (to: string[] | string): string => {
  if (!to) return "N/A";
  return Array.isArray(to) ? to.join(", ") : String(to);
};
