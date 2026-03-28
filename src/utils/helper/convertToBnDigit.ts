export const convertToBnDigit = (input: string | number): string => {
  const digitMapping: { [key: string]: string } = {
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

  return (
    input
      ?.toString()
      ?.split("")
      ?.map((char) => digitMapping[char] || char)
      ?.join("") || "0"
  );
};
