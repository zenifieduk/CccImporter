/**
 * Custom filters for the Eleventy templates
 * These will be available in all template files
 */

module.exports = {
  /**
   * Get featured items from a collection
   * @param {Array} items - Array of items to filter
   * @param {Number} limit - Maximum number of items to return
   * @return {Array} - Array of featured items 
   */
  getFeatured: function(items, limit = 3) {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    // First get all featured items
    const featured = items.filter(item => item.featured === true);
    
    // If we don't have enough featured items, add non-featured ones
    if (featured.length < limit) {
      const nonFeatured = items.filter(item => !item.featured).slice(0, limit - featured.length);
      return [...featured, ...nonFeatured];
    }
    
    // If we have more featured items than the limit, return only up to the limit
    return featured.slice(0, limit);
  },
  
  /**
   * Get similar clubs based on categories
   * @param {Array} clubs - Array of clubs
   * @param {Object} currentClub - The current club to find similar ones for
   * @param {Number} limit - Maximum number of clubs to return
   * @return {Array} - Array of similar clubs
   */
  getSimilarClubs: function(clubs, currentClub, limit = 3) {
    if (!clubs || !Array.isArray(clubs) || !currentClub) {
      return [];
    }
    
    // Don't include the current club
    const otherClubs = clubs.filter(club => club.slug !== currentClub.slug);
    
    // If there are no categories, just return random clubs
    if (!currentClub.categories || !currentClub.categories.length) {
      return otherClubs.slice(0, limit);
    }
    
    // Score each club by how many matching categories it has
    const scoredClubs = otherClubs.map(club => {
      let score = 0;
      
      // If the club has categories, check for matches
      if (club.categories && Array.isArray(club.categories)) {
        currentClub.categories.forEach(category => {
          if (club.categories.includes(category)) {
            score += 1;
          }
        });
      }
      
      return { club, score };
    });
    
    // Sort by score (highest first)
    scoredClubs.sort((a, b) => b.score - a.score);
    
    // Return the clubs with the highest scores
    return scoredClubs.slice(0, limit).map(item => item.club);
  },
  
  /**
   * Get a specific event by its slug
   * @param {Array} events - Array of events
   * @param {String} slug - Event slug to find
   * @return {Object|null} - The found event or null
   */
  getEvent: function(events, slug) {
    if (!events || !Array.isArray(events) || !slug) {
      return null;
    }
    
    return events.find(event => event.slug === slug) || null;
  },
  
  /**
   * Format a date in a readable way
   * @param {String} dateString - ISO date string
   * @param {String} format - Format to use (short, medium, long)
   * @return {String} - Formatted date
   */
  formatDate: function(dateString, format = 'medium') {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      case 'long':
        return date.toLocaleDateString('en-GB', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric'
        });
      case 'time':
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      case 'datetime':
        return `${date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric'
        })} at ${date.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit'
        })}`;
      case 'medium':
      default:
        return date.toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric'
        });
    }
  },
  
  /**
   * Truncate a string to a certain length
   * @param {String} str - String to truncate
   * @param {Number} limit - Maximum length
   * @return {String} - Truncated string
   */
  truncate: function(str, limit = 100) {
    if (!str || typeof str !== 'string') return '';
    
    if (str.length <= limit) return str;
    
    return str.slice(0, limit) + '...';
  }
};