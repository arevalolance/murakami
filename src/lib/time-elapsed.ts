export function getTimeElapsed(date_created_str) {
  const now = new Date();
  const date_created = new Date(Date.parse(date_created_str));
  const diffMs: number = now.getTime() - date_created.getTime();

  // Calculate the time difference in various units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Return the appropriate string based on the time difference
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  } else {
    return `${diffSeconds}s ago`;
  }
}
