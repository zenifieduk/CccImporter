/**
 * Utility functions for Classic Car Clubs website
 */

// Format date for display (from DDMMYYYY:HH:MM:SS format)
function formatDate(dateString) {
  if (!dateString) return 'Date TBD';
  
  try {
    // Parse the date string (format: DDMMYYYY:HH:MM:SS)
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);
    const time = dateString.substring(9);
    
    // Create a date object
    const date = new Date(`${year}-${month}-${day}T${time}`);
    
    // Format the date
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-GB', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date TBD';
  }
}

// Format short date (for event cards)
function formatShortDate(dateString) {
  if (!dateString) return 'TBD';
  
  try {
    // Parse the date string (format: DDMMYYYY:HH:MM:SS)
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);
    
    // Create a date object
    const date = new Date(`${year}-${month}-${day}`);
    
    // Format the date
    const options = { 
      day: 'numeric', 
      month: 'short'
    };
    
    return date.toLocaleDateString('en-GB', options);
  } catch (error) {
    console.error('Error formatting short date:', error);
    return 'TBD';
  }
}

// Extract month from date string
function extractMonth(dateString) {
  if (!dateString) return '';
  
  try {
    const month = dateString.substring(2, 4);
    const date = new Date(2000, parseInt(month) - 1, 1);
    return date.toLocaleString('en-US', { month: 'short' });
  } catch (error) {
    return '';
  }
}

// Extract year from date string
function extractYear(dateString) {
  if (!dateString) return '';
  
  try {
    const year = dateString.substring(4, 8);
    return year;
  } catch (error) {
    return '';
  }
}

// Format date for calendar links
function formatCalendarDate(dateTimeString) {
  if (!dateTimeString) return '';
  
  try {
    // Parse the date string (format: DDMMYYYY:HH:MM:SS)
    const day = dateTimeString.substring(0, 2);
    const month = dateTimeString.substring(2, 4);
    const year = dateTimeString.substring(4, 8);
    const time = dateTimeString.substring(9).replace(/:/g, '');
    
    // Format for calendar APIs (YYYYMMDDTHHMMSS)
    return `${year}${month}${day}T${time}`;
  } catch (error) {
    console.error('Error formatting calendar date:', error);
    return '';
  }
}

// Debounce function for search inputs
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Filter function for A-Z filtering
function filterByLetter(items, letter) {
  if (letter === 'all') return items;
  
  return items.filter(item => {
    const title = item.title || item.eventTitle || '';
    return title.toLowerCase().startsWith(letter.toLowerCase());
  });
}

// URL parameter helper
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Make functions globally available if needed
if (typeof window !== 'undefined') {
  window.ccUtils = {
    formatDate,
    formatShortDate,
    extractMonth,
    extractYear,
    formatCalendarDate,
    debounce,
    filterByLetter,
    getUrlParam
  };
}
