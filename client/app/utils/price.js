/**
 *
 * price.js
 * Price calculation utilities
 */

/**
 * Calculate discounted price based on original price and discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} - The discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!discountPercent || discountPercent <= 0) return originalPrice;
  if (discountPercent > 100) discountPercent = 100;
  
  const discountAmount = (originalPrice * discountPercent) / 100;
  return originalPrice - discountAmount;
};

/**
 * Calculate discount amount based on original price and discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} - The discount amount
 */
export const calculateDiscountAmount = (originalPrice, discountPercent) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!discountPercent || discountPercent <= 0) return 0;
  if (discountPercent > 100) discountPercent = 100;
  
  return (originalPrice * discountPercent) / 100;
};

/**
 * Format price for display
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '₹') => {
  if (!price || price <= 0) return `${currency}0.00`;
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Validate discount percentage
 * @param {number} discount - Discount percentage to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDiscount = (discount) => {
  return discount >= 0 && discount <= 100;
};

/**
 * Get discount validation error message
 * @param {number} discount - Discount percentage to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getDiscountValidationError = (discount) => {
  if (discount < 0) return 'Discount cannot be negative';
  if (discount > 100) return 'Discount cannot exceed 100%';
  return null;
};
