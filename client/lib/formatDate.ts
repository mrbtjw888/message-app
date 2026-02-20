export function formatDate(createdAt: string) {
  const now = Date.now();
  const created = new Date(createdAt).getTime();

  const diffMs = now - created;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Less than 1 minute
  if (diffMinutes < 1) {
    return "just now";
  }

  // Less than 1 hour show minutes
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
  }

  // Less than 24 hours show hours
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  }

  // Less than or equal to 3 days show days
  if (diffDays <= 3) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  // Otherwise full date
  return new Date(createdAt).toLocaleDateString("en-US");
}
