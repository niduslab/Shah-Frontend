export function formatCurrency(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  const safeValue = Number.isFinite(value) ? value : 0;
  return `৳${safeValue.toFixed(2)}`;
}
