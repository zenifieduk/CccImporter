// Utility functions for working with club and event data

module.exports = function() {
  // Helper functions for templates
  
  // Filter clubs by category
  const filterByCategory = (items, category) => {
    if (!category) return items;
    
    return items.filter(item => {
      const itemCategory = item.category || item.eventCategory || '';
      
      if (Array.isArray(itemCategory)) {
        return itemCategory.some(cat => cat.toLowerCase() === category.toLowerCase());
      } else {
        return itemCategory.toLowerCase() === category.toLowerCase();
      }
    });
  };
  
  // Limit collection but exclude an item by slug
  const limitWithout = (items, limit, excludeSlug) => {
    if (!excludeSlug) return items.slice(0, limit);
    
    return items
      .filter(item => {
        const slug = item.slug || item.eventSlug;
        return slug !== excludeSlug;
      })
      .slice(0, limit);
  };
  
  // Filter items that have a specific property marked as true
  const filterFeatured = (items) => {
    return items.filter(item => {
      return item.featured || item.eventFeatured;
    });
  };
  
  // Get unique categories from clubs or events
  const getUniqueCategories = (items) => {
    const categories = items.flatMap(item => {
      const cat = item.category || item.eventCategory;
      if (Array.isArray(cat)) {
        return cat;
      } else if (cat) {
        return [cat];
      }
      return [];
    });
    
    return [...new Set(categories)].sort();
  };
  
  return {
    filterByCategory,
    limitWithout,
    filterFeatured,
    getUniqueCategories
  };
};