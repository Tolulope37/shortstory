/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: NGN)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  // Use Naira symbol for NGN currency
  if (currency === 'NGN') {
    // Ensure amount is a number before formatting
    const numAmount = typeof amount === 'number' ? amount : Number(amount);
    // Format with commas as thousands separators
    return `₦${numAmount.toLocaleString('en-NG')}`;
  }
  
  // For other currencies, use the financial symbol ₮ instead of $
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Replace the $ symbol with ₮
  return formatted.replace('$', '₮');
};

/**
 * Formats a date string into a readable format
 * @param {string} dateString - The date string to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Date(dateString).toLocaleDateString('en-US', mergedOptions);
};

/**
 * Calculates the number of nights between two dates
 * @param {string} checkInDate - Check-in date string
 * @param {string} checkOutDate - Check-out date string
 * @returns {number} Number of nights
 */
export const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  // Calculate the difference in days
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}; 