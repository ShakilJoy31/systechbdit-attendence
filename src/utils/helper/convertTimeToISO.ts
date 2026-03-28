export const convertTimeStringToISO = (timeString: string): Date | null => {
  // Match "HH:MM:SS", "HH:MM", or "HH:MM AM/PM"
  const timePattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)?$/i;
  const timeParts = timeString.match(timePattern);
  if (!timeParts) {
    console.error("Invalid time string format:", timeString);
    return null;
  }

  let hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);
  const seconds = timeParts[3] ? parseInt(timeParts[3], 10) : 0;
  const period = timeParts[4]?.toUpperCase();

  // Adjust hours for AM/PM format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // Create date in local time (no date parts as they’re irrelevant here)
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date;
};
