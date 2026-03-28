export function convertTimeToBengali(time: string | null | undefined): string {
  // Handle null/undefined or empty string cases
  if (!time) {
    return "সময় পাওয়া যায়নি"; 
  }

  const bengaliDigits: { [key: string]: string } = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };

  const convertToBengali = (str: string): string => {
    return str
      .split("")
      .map((char) => bengaliDigits[char] || char)
      .join("");
  };

  const convertPeriod = (hours: number, period: string): string => {
    if (period === "AM") {
      return hours < 6 ? "রাত" : "সকাল";
    } else if (period === "PM") {
      if (hours < 4) {
        return "দুপুর";
      } else if (hours < 6) {
        return "বিকাল";
      } else if (hours < 8) {
        return "সন্ধ্যা";
      } else {
        return "রাত";
      }
    }
    return "";
  };

  try {
    const [timePart, period] = time.split(" ");
    const [hourStr, minuteStr] = timePart.split(/[.,:-]+/);
    
    // Validate we got the expected parts
    if (!hourStr || !minuteStr || !period) {
      throw new Error("Invalid time format");
    }

    const hour = parseInt(hourStr, 10);
    const bengaliTimePart = convertToBengali(`${hourStr}.${minuteStr}`);
    const bengaliPeriod = convertPeriod(hour, period);

    return `${bengaliTimePart} ${bengaliPeriod}`;
  } catch (error) {
    console.error("Error converting time to Bengali:", error);
    return "সময় অকার্যকর"; // "Invalid time" in Bengali
  }
}