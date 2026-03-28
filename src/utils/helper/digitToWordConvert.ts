export const digitToWordConverter = (number: number) => {
  const ones = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  let words = "";

  // CONVERT BILLIONS
  if (number >= 1000000000) {
    words +=
      digitToWordConverter(Math.floor(number / 1000000000)) + " Billion ";
    number %= 1000000000;
  }

  // CONVERT MILLIONS
  if (number >= 1000000) {
    words += digitToWordConverter(Math.floor(number / 1000000)) + " Million ";
    number %= 1000000;
  }

  // CONVERT THOUSANDS
  if (number >= 1000) {
    words += digitToWordConverter(Math.floor(number / 1000)) + " Thousand ";
    number %= 1000;
  }

  // CONVERT HUNDREDS
  if (number >= 100) {
    words += digitToWordConverter(Math.floor(number / 100)) + " Hundred ";
    number %= 100;
  }

  if (number >= 20) {
    words += tens[Math.floor(number / 10)] + " ";
    number %= 10;
  } else if (number >= 10) {
    words += teens[number - 10];
    number = 0;
  }

  if (number > 0) {
    words += ones[number];
  }

  return words.trim();
};
