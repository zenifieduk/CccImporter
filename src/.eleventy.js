const Image = require("@11ty/eleventy-img");
const path = require("path");

// Image shortcode
async function imageShortcode(src, alt, sizes = "100vw", classes = "") {
  if (!src) {
    return `<div class="image-placeholder ${classes}">Image not available</div>`;
  }

  // Handle both local and external images
  const isExternal = src.startsWith('http');
  const imageSrc = isExternal ? src : './src' + src;
  
  let metadata;
  try {
    metadata = await Image(imageSrc, {
      widths: [300, 600, 900],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
      filenameFormat: function(id, src, width, format) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    });
  } catch (error) {
    console.error(`Error processing image: ${src}`, error);
    return `<div class="image-placeholder ${classes}">Image not available</div>`;
  }

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    class: classes
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/svg");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  
  // Add shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  
  // Add custom collections
  eleventyConfig.addCollection("featuredClubs", collection => {
    return collection.getFilteredByTag("clubs")
      .filter(club => club.data.featured)
      .slice(0, 4);
  });
  
  eleventyConfig.addCollection("featuredEvents", collection => {
    return collection.getFilteredByTag("events")
      .filter(event => event.data.eventFeatured)
      .slice(0, 3);
  });
  
  eleventyConfig.addCollection("upcomingEvents", collection => {
    const now = new Date();
    return collection.getFilteredByTag("events")
      .filter(event => {
        if (!event.data.eventStartDateTime) return false;
        
        try {
          const day = event.data.eventStartDateTime.substring(0, 2);
          const month = event.data.eventStartDateTime.substring(2, 4);
          const year = event.data.eventStartDateTime.substring(4, 8);
          const time = event.data.eventStartDateTime.substring(9);
          
          const eventDate = new Date(`${year}-${month}-${day}T${time}`);
          return eventDate >= now;
        } catch (error) {
          return false;
        }
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.data.eventStartDateTime.substring(4, 8)}-${a.data.eventStartDateTime.substring(2, 4)}-${a.data.eventStartDateTime.substring(0, 2)}T${a.data.eventStartDateTime.substring(9)}`);
        const dateB = new Date(`${b.data.eventStartDateTime.substring(4, 8)}-${b.data.eventStartDateTime.substring(2, 4)}-${b.data.eventStartDateTime.substring(0, 2)}T${b.data.eventStartDateTime.substring(9)}`);
        return dateA - dateB;
      });
  });
  
  eleventyConfig.addCollection("clubCategories", collection => {
    const categories = new Set();
    collection.getFilteredByTag("clubs").forEach(club => {
      if (club.data.category) {
        categories.add(club.data.category);
      }
    });
    return Array.from(categories).sort();
  });
  
  eleventyConfig.addCollection("eventCategories", collection => {
    const categories = new Set();
    collection.getFilteredByTag("events").forEach(event => {
      if (Array.isArray(event.data.eventCategory)) {
        event.data.eventCategory.forEach(cat => categories.add(cat));
      } else if (event.data.eventCategory) {
        categories.add(event.data.eventCategory);
      }
    });
    return Array.from(categories).sort();
  });
  
  // Add filters
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  
  eleventyConfig.addFilter("filterByCategory", function(array, category) {
    if (!category) return array;
    
    return array.filter(item => {
      const itemCategory = item.data.category || item.data.eventCategory || '';
      
      if (Array.isArray(itemCategory)) {
        return itemCategory.some(cat => cat.toLowerCase() === category.toLowerCase());
      } else {
        return itemCategory.toLowerCase() === category.toLowerCase();
      }
    });
  });
  
  eleventyConfig.addFilter("limitWithout", function(array, limit, excludeSlug) {
    if (!excludeSlug) return array.slice(0, limit);
    
    return array
      .filter(item => {
        const slug = item.data.slug || item.data.eventSlug;
        return slug !== excludeSlug;
      })
      .slice(0, limit);
  });
  
  eleventyConfig.addFilter("formatDate", function(dateString) {
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
  });
  
  eleventyConfig.addFilter("shortDate", function(dateString) {
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
  });
  
  eleventyConfig.addFilter("extractMonth", function(dateString) {
    if (!dateString) return '';
    
    try {
      const month = dateString.substring(2, 4);
      const date = new Date(2000, parseInt(month) - 1, 1);
      return date.toLocaleString('en-US', { month: 'short' });
    } catch (error) {
      return '';
    }
  });
  
  eleventyConfig.addFilter("extractYear", function(dateString) {
    if (!dateString) return '';
    
    try {
      const year = dateString.substring(4, 8);
      return year;
    } catch (error) {
      return '';
    }
  });
  
  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });
  
  eleventyConfig.addFilter("urlencode", function(value) {
    return encodeURIComponent(value);
  });
  
  // Configure eleventy
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
