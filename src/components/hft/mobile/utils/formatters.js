/**
 * Format a numeric value as currency
 * @param {number|string} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '$0.00';
  return `$${Number(value).toFixed(2)}`;
};

/**
 * Get color based on confidence level
 * @param {number} confidence - Confidence percentage (0-100)
 * @returns {string} Hex color code
 */
export const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return '#28a745';
  if (confidence >= 60) return '#ffc107';
  return '#dc3545';
};

/**
 * Get color based on strength level
 * @param {string} strength - Strength description
 * @returns {string} Hex color code
 */
export const getStrengthColor = (strength) => {
  const strengthLower = strength?.toLowerCase() || '';
  if (strengthLower.includes('strong') || strengthLower.includes('extreme')) return '#28a745';
  if (strengthLower.includes('medium')) return '#ffc107';
  return '#6c757d';
};

