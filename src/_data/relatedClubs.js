/**
 * This module provides functions to get related clubs
 */

/**
 * Handle the clubs parameter which might be a function or an array
 * @param {Function|Array} clubs - The clubs data (either a function or an array)
 * @returns {Array} - The clubs data as an array
 */
function getClubsArray(clubs) {
  if (typeof clubs === 'function') {
    return clubs();
  }
  return Array.isArray(clubs) ? clubs : [];
}

/**
 * Get related clubs by category or random clubs if no matching categories
 * @param {Function|Array} clubs - All clubs data (either function or array)
 * @param {Object} currentClub - The current club being viewed
 * @param {Number} count - Number of related clubs to return
 * @returns {Array} - Array of related clubs
 */
function getRelatedClubs(clubs, currentClub, count = 3) {
  // Convert the clubs parameter to an array if it's a function
  const clubsArray = getClubsArray(clubs);
  
  // Basic validation
  if (!currentClub || !clubsArray.length) {
    return [];
  }
  
  // Make sure we're comparing with strings
  const currentSlug = String(currentClub.slug || '');
  const currentCategory = currentClub.category;
  
  // Ensure currentSlug is valid
  if (!currentSlug) {
    return [];
  }
  
  // Get the current club's full details
  const fullCurrentClub = clubsArray.find(club => 
    String(club.slug || '') === currentSlug
  );
  
  // Get the Rolls-Royce club by its unique slug
  const paulerspuryClub = clubsArray.find(club => 
    club.slug === 'rolls-royce-enthusiasts-club-paulerspury'
  );
  
  // Ensure we don't show duplicate clubs
  const uniqueSlugs = new Set();
  uniqueSlugs.add(currentSlug);
  
  // Find clubs with the same category directly
  let sameCategory = [];
  if (currentCategory) {
    sameCategory = clubsArray.filter(club => {
      const slug = String(club.slug || '');
      // Ensure it's a different club and we haven't seen this slug before
      if (slug !== currentSlug && !uniqueSlugs.has(slug) && club.category === currentCategory) {
        uniqueSlugs.add(slug);
        return true;
      }
      return false;
    }).slice(0, count);
  }
  
  // If we don't have enough clubs by category, fill with random ones
  const randomClubs = [];
  if (sameCategory.length < count) {
    // Randomize all clubs
    const shuffled = [...clubsArray].sort(() => 0.5 - Math.random());
    
    // Take clubs until we have enough or run out
    for (const club of shuffled) {
      if (randomClubs.length + sameCategory.length >= count) break;
      
      const slug = String(club.slug || '');
      if (slug !== currentSlug && !uniqueSlugs.has(slug)) {
        uniqueSlugs.add(slug);
        randomClubs.push(club);
      }
    }
  }
  
  // Combine both lists and make sure we have no more than requested count
  return [...sameCategory, ...randomClubs].slice(0, count);
}

module.exports = {
  getRelatedClubs
};