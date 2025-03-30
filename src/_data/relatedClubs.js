/**
 * This module provides functions to get related clubs
 */

/**
 * Get related clubs by category or random clubs if no matching categories
 * @param {Array} clubs - All clubs data
 * @param {Object} currentClub - The current club being viewed
 * @param {Number} count - Number of related clubs to return
 * @returns {Array} - Array of related clubs
 */
function getRelatedClubs(clubs, currentClub, count = 3) {
  if (!currentClub || !clubs || !clubs.length) return [];
  
  const currentSlug = currentClub.slug;
  const currentCategory = currentClub.category;
  
  // Filter out the current club
  const otherClubs = clubs.filter(club => club.slug !== currentSlug);
  
  // If we have a category, try to find related clubs
  let relatedClubs = [];
  if (currentCategory) {
    relatedClubs = otherClubs
      .filter(club => club.category === currentCategory)
      .slice(0, count);
  }
  
  // If we don't have enough related clubs by category, 
  // add random clubs to reach the requested count
  if (relatedClubs.length < count) {
    // Shuffle the remaining clubs
    const remainingClubs = otherClubs
      .filter(club => !relatedClubs.includes(club))
      .sort(() => Math.random() - 0.5);
    
    // Add random clubs until we reach the count
    while (relatedClubs.length < count && remainingClubs.length > 0) {
      relatedClubs.push(remainingClubs.pop());
    }
  }
  
  return relatedClubs;
}

module.exports = {
  getRelatedClubs
};