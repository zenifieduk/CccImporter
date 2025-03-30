/**
 * Helper functions for use in templates
 */

module.exports = {
  /**
   * Get the current year
   * @return {number} - Current year
   */
  currentYear() {
    return new Date().getFullYear();
  },
  
  /**
   * Check if a URL is the current page 
   * @param {string} pageUrl - The URL of the current page
   * @param {string} itemUrl - The URL to check against
   * @return {boolean} - True if the URLs match 
   */
  isCurrentPage(pageUrl, itemUrl) {
    return pageUrl === itemUrl;
  },
  
  /**
   * Format a date for display
   * @param {string|Date} date - The date to format
   * @param {string} format - The format to use (short, medium, long)
   * @return {string} - Formatted date
   */
  formatDate(date, format = 'medium') {
    if (!date) return '';
    
    const d = new Date(date);
    
    const options = {
      short: { day: 'numeric', month: 'short', year: 'numeric' },
      medium: { day: 'numeric', month: 'long', year: 'numeric' },
      long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }
    };
    
    return d.toLocaleDateString('en-GB', options[format] || options.medium);
  },
  
  /**
   * Create a readable file size
   * @param {number} size - Size in bytes
   * @return {string} - Formatted size
   */
  formatFileSize(size) {
    if (!size) return '0 B';
    
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  },
  
  /**
   * Safely get a nested property from an object
   * @param {object} obj - The object to access
   * @param {string} path - The property path, e.g. 'user.address.city'
   * @param {*} defaultValue - Value to return if the property doesn't exist
   * @return {*} - The property value or default
   */
  getProperty(obj, path, defaultValue = '') {
    if (!obj) return defaultValue;
    
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || typeof current !== 'object' || !(part in current)) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return current === undefined ? defaultValue : current;
  }
};