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
  
  // Make sure we're comparing with strings
  const currentSlug = String(currentClub.slug);
  const currentCategory = currentClub.category;
  
  // Ensure currentSlug is valid
  if (!currentSlug) {
    console.log('Warning: Current club has no slug');
    return [];
  }
  
  // Filter out the current club by exact slug match
  const otherClubs = clubs.filter(club => {
    const clubSlug = String(club.slug || '');
    return clubSlug !== '' && clubSlug !== currentSlug;
  });
  
  // Debugging
  console.log(`Current club: ${currentSlug}`);
  console.log(`Category: ${currentCategory}`);
  console.log(`Other clubs count: ${otherClubs.length}`);
  
  // If we have a category, try to find related clubs
  let relatedClubs = [];
  if (currentCategory) {
    relatedClubs = otherClubs
      .filter(club => club.category === currentCategory)
      .slice(0, count);
    
    console.log(`Found ${relatedClubs.length} related clubs by category`);
  }
  
  // If we don't have enough related clubs by category, 
  // add random clubs to reach the requested count
  if (relatedClubs.length < count) {
    // Shuffle the remaining clubs
    const remainingClubs = otherClubs
      .filter(club => {
        // Make sure we're not including any clubs already in relatedClubs
        return !relatedClubs.some(relatedClub => 
          String(relatedClub.slug) === String(club.slug)
        );
      })
      .sort(() => Math.random() - 0.5);
    
    // Add random clubs until we reach the count
    const neededCount = count - relatedClubs.length;
    const randomSelection = remainingClubs.slice(0, neededCount);
    relatedClubs = [...relatedClubs, ...randomSelection];
    
    console.log(`Added ${randomSelection.length} random clubs to reach count`);
  }
  
  console.log(`Returning ${relatedClubs.length} clubs total`);
  // Make sure we're not returning the current club
  return relatedClubs.filter(club => String(club.slug) !== currentSlug);
}

module.exports = {
  getRelatedClubs
};