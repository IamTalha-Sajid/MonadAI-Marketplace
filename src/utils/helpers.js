/**
 * Shortens an Ethereum address for display
 * @param {string} address - The address to shorten
 * @returns {string} Shortened address (e.g. 0x1234...5678)
 */
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format a number with commas
 * @param {number|string} num - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Handle errors from web3 calls
 * @param {Error} error - The error object
 * @returns {string} Human readable error message
 */
export const formatError = (error) => {
  if (error?.code === 4001) {
    return 'Transaction rejected by user';
  }
  
  if (error?.message) {
    // Try to extract error message from nested error object
    if (error.message.includes('execution reverted:')) {
      const revertReason = error.message.split('execution reverted:')[1]?.trim();
      return revertReason || 'Transaction failed';
    }
    
    return error.message;
  }
  
  return 'An unknown error occurred';
};