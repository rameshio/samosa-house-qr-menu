const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

export const formatPriceCents = (cents) => {
  if (cents === null || cents === undefined) return 'Price unavailable';
  if (typeof cents !== 'number' || cents < 0) return 'Price unavailable';
  return usdFormatter.format(cents / 100);
};