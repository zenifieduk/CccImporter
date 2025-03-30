const { DateTime } = require("luxon");
const filters = require('./src/_data/filters');
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Copy assets directory
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy public directory
  eleventyConfig.addPassthroughCopy({ "public": "/" });
  
  // Copy admin directory for Decap CMS - only use the root level one
  // eleventyConfig.addPassthroughCopy("src/admin");
  
  // Copy root admin directory for Netlify CMS/Decap CMS
  eleventyConfig.addPassthroughCopy({ "admin": "/" });
  
  // Add JSON feed endpoints for data
  eleventyConfig.addPassthroughCopy({ "src/clubs.json.njk": "clubs.json" });
  eleventyConfig.addPassthroughCopy({ "src/events.json.njk": "events.json" });
  
  // Register custom filters
  Object.keys(filters).forEach(filterName => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });
  
  // Configure Markdown rendering
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  eleventyConfig.addFilter("markdown", function(content) {
    if (!content) return '';
    return md.render(content);
  });
  
  // Add toLocaleString filter for numbers
  eleventyConfig.addFilter("toLocaleString", function(number) {
    if (typeof number !== 'number') return number;
    return number.toLocaleString();
  });
  
  // Add JSON filter
  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });
  
  // Add a filter to format dates (legacy - prefer the custom filters.formatDate)
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });
  
  // Add a filter to format time
  eleventyConfig.addFilter("formatTime", function(dateObj) {
    return DateTime.fromJSDate(dateObj).toFormat("HH:mm");
  });
  
  // Add split filter for strings
  eleventyConfig.addFilter("split", function(str, separator = " ") {
    if (!str || typeof str !== "string") return [];
    return str.split(separator);
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
