const { DateTime } = require("luxon");
const apiRoutes = require('./src/api');

module.exports = function(eleventyConfig) {
  // Use server middlewares for API routes
  eleventyConfig.setServerOptions({
    middleware: {
      // Add middleware function for API routes
      middleware: function(req, res, next) {
        // Handle API routes
        if (req.url.startsWith('/api/')) {
          return apiRoutes(req, res, next);
        }
        next();
      }
    }
  });
  // Copy assets directory
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy public directory
  eleventyConfig.addPassthroughCopy({ "public": "/" });
  
  // Add JSON filter
  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });
  
  // Add a filter to format dates
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });
  
  // Add a filter to format time
  eleventyConfig.addFilter("formatTime", function(dateObj) {
    return DateTime.fromJSDate(dateObj).toFormat("HH:mm");
  });

  // Add a filter for limit
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  
  // Add filter for getting featured items
  eleventyConfig.addFilter("filter", function(array, property) {
    return array.filter(item => item[property]);
  });
  
  // Add unique filter for arrays
  eleventyConfig.addFilter("unique", function(array, property) {
    if (!array || !Array.isArray(array)) return [];
    
    const propertyValues = array.map(item => item[property]);
    return [...new Set(propertyValues)];
  });
  
  // Add map filter for arrays
  eleventyConfig.addFilter("map", function(array, property) {
    if (!array || !Array.isArray(array)) return [];
    
    return array.map(item => item[property]);
  });
  
  // Add isArray filter
  eleventyConfig.addFilter("isArray", function(value) {
    return Array.isArray(value);
  });
  
  // Add a filter to convert string to date
  eleventyConfig.addFilter("parseDate", function(dateString) {
    // Format: DDMMYYYY:HH:MM:SS
    if (!dateString) return null;
    
    try {
      const day = dateString.substring(0, 2);
      const month = dateString.substring(2, 4);
      const year = dateString.substring(4, 8);
      const time = dateString.substring(9);
      
      return new Date(`${year}-${month}-${day}T${time}`);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  });
  
  // Add a filter to get event month
  eleventyConfig.addFilter("eventMonth", function(dateString) {
    const date = eleventyConfig.getFilter("parseDate")(dateString);
    if (!date) return "";
    
    return DateTime.fromJSDate(date).toFormat("LLL");
  });
  
  // Add a filter to make a slug
  eleventyConfig.addFilter("slug", function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });
  
  // Add shortcode for environment variables
  eleventyConfig.addShortcode("env", function(name, fallback = "") {
    return process.env[name] || fallback;
  });
  
  // Add filter for absolute URLs
  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    return new URL(url, base || 'https://classiccars.club/').href;
  });
  
  // Add date filter
  eleventyConfig.addFilter("date", function(date, format) {
    return DateTime.fromJSDate(new Date(date)).toFormat(format);
  });
  
  // Add substring filter
  eleventyConfig.addFilter("substring", function(str, start, end) {
    if (!str) return '';
    return str.substring(start, end);
  });
  
  // Add shuffle filter for arrays
  eleventyConfig.addFilter("shuffle", function(array) {
    if (!array || !Array.isArray(array)) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  
  // Add includes filter to check if a value is in an array
  eleventyConfig.addFilter("includes", function(array, value) {
    if (!array || !Array.isArray(array)) return false;
    return array.includes(value);
  });
  
  // Add concat filter to combine arrays
  eleventyConfig.addFilter("concat", function(array1, array2) {
    if (!array1 || !Array.isArray(array1)) return array2 || [];
    if (!array2 || !Array.isArray(array2)) return array1 || [];
    return [...array1, ...array2];
  });
  
  // Configure directory structure
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
