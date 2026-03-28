export const percentageCalculator = (
  percentageRate: number | string,
  totalAmount: number | string
) => {
  const calculate = (+percentageRate / 100) * +totalAmount;
  return +calculate;
};
