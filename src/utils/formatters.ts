// Utility functions for number formatting

export const formatNumberWithCommas = (value: string | number): string => {
  const numStr = value.toString().replace(/[^\d]/g, '');
  if (!numStr) return '';
  
  const num = parseInt(numStr, 10);
  return num.toLocaleString('en-US');
};

export const parseFormattedNumber = (value: string): number => {
  const numStr = value.replace(/[^\d]/g, '');
  return numStr ? parseInt(numStr, 10) : 0;
};

export const formatCurrencyInput = (value: string): string => {
  const numStr = value.replace(/[^\d]/g, '');
  if (!numStr) return '';
  
  const num = parseInt(numStr, 10);
  return num.toLocaleString('en-US');
};

export const formatToMillions = (amount: number): string => {
  if (amount === 0) return '$0.00M';
  const millions = amount / 1000000;
  if (millions >= 1000) {
    return `$${(millions / 1000).toFixed(2)}B`;
  }
  return `$${millions.toFixed(2)}M`;
};