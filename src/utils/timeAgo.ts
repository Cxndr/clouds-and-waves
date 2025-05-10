export default function timeAgo(timestamp: Date) {

  console.log('Incoming timestamp:', timestamp);

  const now = new Date().getTime();
  const past = timestamp.getTime();
  if (isNaN(past)) {
    console.error('Invalid date:', timestamp); // Added for debugging
    return 'Invalid date';
  }
  const secondsAgo = Math.floor((now - past) / 1000);

  if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
  }
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
  return `${minutesAgo} minutes ago`;
  }
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
  }
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) {
      return `${daysAgo} days ago`;
  }
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
      return `${monthsAgo} months ago`;
  }
  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} years ago`;
}