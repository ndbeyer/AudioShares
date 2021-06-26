export const getSuffix = (number): string => {
  const length = number?.toString()?.length;
  return length <= 3 ? "" : length <= 6 ? "K" : length <= 9 ? "M" : "?";
};

const outputThreeNumbers = (number, quotient): number => {
  // (1.212, 1000) => 1.21
  // (12.120, 1000) => 12.1
  return Number(
    (number / quotient).toFixed(
      Math.max(3 - Math.round(number / quotient).toString().length, 0)
    )
  );
};

export const getNumberWithSuffix = (number): string => {
  const length = number?.toString()?.length;
  return length <= 3
    ? String(number)
    : length <= 6
    ? outputThreeNumbers(number, 1000) + "K"
    : length <= 9
    ? outputThreeNumbers(number, 1000 * 1000) + "M"
    : "?";
};

export const correctNumberForSuffix = (number, suffix): number => {
  return {
    "": number,
    K: outputThreeNumbers(number, 1000),
    M: outputThreeNumbers(number, 1000 * 1000),
    "?": number,
  }[suffix];
};
