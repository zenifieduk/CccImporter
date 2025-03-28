// Custom collections for 11ty to use in templates

module.exports = function(collection) {
  // Get all clubs
  const clubs = collection.getFilteredByTag("clubs");
  
  // Get all events
  const events = collection.getFilteredByTag("events");
  
  // Featured clubs (limited to 4)
  const featuredClubs = clubs
    .filter(club => club.data.featured)
    .slice(0, 4);
  
  // Featured events
  const featuredEvents = events
    .filter(event => event.data.eventFeatured)
    .slice(0, 3);
  
  // Upcoming events (sorted by date)
  const upcomingEvents = events
    .filter(event => {
      if (!event.data.eventStartDateTime) return false;
      
      try {
        const day = event.data.eventStartDateTime.substring(0, 2);
        const month = event.data.eventStartDateTime.substring(2, 4);
        const year = event.data.eventStartDateTime.substring(4, 8);
        const time = event.data.eventStartDateTime.substring(9);
        
        const eventDate = new Date(`${year}-${month}-${day}T${time}`);
        return eventDate >= new Date();
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      const dateA = new Date(
        `${a.data.eventStartDateTime.substring(4, 8)}-${a.data.eventStartDateTime.substring(2, 4)}-${a.data.eventStartDateTime.substring(0, 2)}T${a.data.eventStartDateTime.substring(9)}`
      );
      const dateB = new Date(
        `${b.data.eventStartDateTime.substring(4, 8)}-${b.data.eventStartDateTime.substring(2, 4)}-${b.data.eventStartDateTime.substring(0, 2)}T${b.data.eventStartDateTime.substring(9)}`
      );
      return dateA - dateB;
    });
  
  // Extract unique club categories
  const clubCategories = [...new Set(
    clubs.map(club => club.data.category).filter(Boolean)
  )].sort();
  
  // Extract unique event categories (flattening arrays)
  const eventCategories = [...new Set(
    events.flatMap(event => {
      if (Array.isArray(event.data.eventCategory)) {
        return event.data.eventCategory;
      } else if (event.data.eventCategory) {
        return [event.data.eventCategory];
      }
      return [];
    })
  )].sort();
  
  // Filter clubs by category
  const filterByCategory = (items, category) => {
    if (!category) return items;
    
    return items.filter(item => {
      const itemCategory = item.data.category || item.data.eventCategory || '';
      
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
        const slug = item.data.slug || item.data.eventSlug;
        return slug !== excludeSlug;
      })
      .slice(0, limit);
  };
  
  return {
    clubs,
    events,
    featuredClubs,
    featuredEvents,
    upcomingEvents,
    clubCategories,
    eventCategories,
    filterByCategory,
    limitWithout
  };
};
