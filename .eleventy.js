require('dotenv').config();

const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Configure Markdown with anchors
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "",
    permalinkSpace: false,
    permalinkBefore: true,
    slugify: (s) => {
      return String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace all non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, '')     // Remove leading/trailing hyphens
        .replace(/-+/g, '-');        // Replace multiple hyphens with single hyphen
    }
  });

  // Override the markdown renderer's link_open rule to add security attributes
  const defaultRender = markdownLibrary.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLibrary.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const aIndex = tokens[idx].attrIndex('href');
    
    if (aIndex >= 0) {
      const href = tokens[idx].attrs[aIndex][1];
      
      if (href && href.indexOf('://') > 0) {
        // Convert http:// to https:// for external links
        if (href.startsWith('http://')) {
          tokens[idx].attrs[aIndex][1] = href.replace('http://', 'https://');
        }
        
        // External link - add target and rel attributes
        tokens[idx].attrPush(['target', '_blank']);
        tokens[idx].attrPush(['rel', 'noopener noreferrer']);
      }
    }
    
    return defaultRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", markdownLibrary);

  // Add a global data variable for the current date
  eleventyConfig.addGlobalData("currentDate", () => {
    return DateTime.now().toFormat("dd LLL yyyy");
  });

  eleventyConfig.addGlobalData("showcaseClubs", () => {
    const clubsData = require('./src/_data/clubs.js')();
    return clubsData.filter(club => club.showcase);
  });

  // Copy assets directory (includes CSS, JS, images, etc.)
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copy public directory
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  // Copy top-level discovery files (robots.txt, llms.txt) to the site root.
  // Without these explicit entries Eleventy ignores them and they 404 in production.
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "/llms.txt" });
  
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

  // Blog date formatting filter
  eleventyConfig.addFilter("blogDate", function(dateObj) {
    return DateTime.fromJSDate(new Date(dateObj)).toFormat("dd LLLL yyyy");
  });

  // Chronicle date formatting filter
  eleventyConfig.addFilter("chronicleDate", function(dateObj) {
    return DateTime.fromJSDate(new Date(dateObj)).toFormat("dd LLLL yyyy");
  });

  // Reading time filter
  eleventyConfig.addFilter("readingTime", function(text) {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  // Add a filter for limit
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });
  
  // Add filter for getting featured items
  eleventyConfig.addFilter("filter", function(array, property) {
    return array.filter(item => item[property]);
  });
  
  // Add filter to exclude the current item by slug
  eleventyConfig.addFilter("filterOutCurrent", function(array, currentSlug) {
    if (!array || !Array.isArray(array) || !currentSlug) return array;
    return array.filter(item => item.data.slug !== currentSlug);
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
    if (!str) return "";
    
    return String(str)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });
  
  // Add shortcode for environment variables
  eleventyConfig.addShortcode("env", function(name, fallback = "") {
    return process.env[name] || fallback;
  });
  
  // Fix for XML sitemap files missing XML declaration
  eleventyConfig.addTransform("fixXmlDeclaration", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".xml")) {
      // Check if XML declaration is missing
      if (!content.trim().startsWith("<?xml")) {
        // Add XML declaration
        return `<?xml version="1.0" encoding="UTF-8"?>\n${content}`;
      }
    }
    return content;
  });
  
  // Handle XML Feed Content Types
  eleventyConfig.addTransform("xmlContentType", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".xml")) {
      // If content contains HTML doctype or html tags, it indicates the XML is being incorrectly wrapped
      if (content.includes("<!DOCTYPE html>") || content.includes("<html") || content.includes("<body")) {
        // Extract just the XML content
        const xmlMatch = content.match(/<\?xml.*?<\/feed>/s);
        if (xmlMatch) {
          return xmlMatch[0];
        }
      }
    }
    return content;
  });
  
  // Add filter for absolute URLs
  eleventyConfig.addFilter("absoluteUrl", function(url, base) {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    return new URL(url, base || 'https://classiccars.club/').href;
  });
  
  // Add date filter
  eleventyConfig.addFilter("date", function(date, format = "yyyy-MM-dd") {
    if (!date) {
      return DateTime.now().toFormat(format);
    }
    try {
      return DateTime.fromJSDate(new Date(date)).toFormat(format);
    } catch (e) {
      console.error("Date error:", e);
      return DateTime.now().toFormat(format);
    }
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
  
  eleventyConfig.addCollection("clubs", function(collectionApi) {
    const clubsData = require('./src/_data/clubs.js')(); // Require the data file
    return clubsData; // Return the array of clubs
  });

  // Chronicle Collections
  eleventyConfig.addCollection("chronicle", function(collectionApi) {
    // Get all markdown files in chronicle directory, exclude index and tag templates
    return collectionApi.getFilteredByGlob("src/chronicle/**/*.md")
      .filter(item => !item.inputPath.endsWith("index.njk") && !item.inputPath.endsWith("tags.njk"))
      .sort((a, b) => {
        return b.date - a.date; // Sort by date in descending order (newest first)
      });
  });

  // Get chronicle posts with specific tags
  eleventyConfig.addCollection("chronicleTagList", function(collectionApi) {
    const tagSet = new Set();
    
    // Debug: Collect raw tags before normalization
    const rawTags = [];
    
    collectionApi.getAll().forEach(item => {
      if ("tags" in item.data) {
        const tags = item.data.tags;
        if (Array.isArray(tags)) {
          // Debug: collect raw tags
          tags.filter(tag => tag !== "chronicle").forEach(tag => rawTags.push(tag));
          
          tags
            .filter(tag => tag !== "chronicle")
            .map(tag => tag.toLowerCase()) // Normalize tags to lowercase
            .forEach(tag => tagSet.add(tag));
        }
      }
    });
    
    // Debug: Log original vs normalized tags
    console.log('--- DEBUG: Raw tags vs. normalized tags ---');
    console.log('Raw tags:', [...new Set(rawTags)]);
    console.log('Normalized tags:', [...tagSet]);
    
    return [...tagSet].sort();
  });

  // Featured chronicle posts collection
  eleventyConfig.addCollection("featuredChronicle", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/chronicle/**/*.md")
      .filter(post => post.data.featured)
      .sort((a, b) => b.date - a.date)
      .slice(0, 3); // Get top 3 featured posts
  });

  // Recent chronicle posts collection
  eleventyConfig.addCollection("recentChronicle", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/chronicle/**/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 5); // Get 5 most recent posts
  });

  // Add excerpt filter for blog posts
  eleventyConfig.addFilter("excerpt", function(content) {
    if (!content) return '';
    
    // Strip HTML tags
    const text = content.replace(/<\/?[^>]+(>|$)/g, "");
    
    // Get the first 150 characters and add ellipsis if needed
    const excerpt = text.substring(0, 150);
    return excerpt.length < text.length ? excerpt + "..." : excerpt;
  });

  // Add filter to get only tagged posts from a specific collection
  eleventyConfig.addFilter("getTaggedItems", function(collection, tag) {
    if (!collection || !tag) return [];
    
    // Convert tag to lowercase for case-insensitive comparison
    const normalizedTag = tag.toLowerCase();
    
    return collection.filter(item => {
      return item.data.tags && 
        Array.isArray(item.data.tags) && 
        item.data.tags.some(itemTag => itemTag.toLowerCase() === normalizedTag);
    });
  });

  // Add filter to exclude featured posts
  eleventyConfig.addFilter("filterFeatured", function(collection) {
    if (!collection) return [];
    return collection.filter(item => !item.data.featured);
  });

  // Add a helper filter for safe external links
  eleventyConfig.addFilter("safeExternalLink", function(url, text) {
    if (!url) return "";
    
    // Default text to URL if not provided
    const displayText = text || url;
    
    // Ensure https for external URLs
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    
    // Check if it's an external URL
    if (url.startsWith('http')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
    } else {
      return `<a href="${url}">${displayText}</a>`;
    }
  });

  // Add a shortcode for safe external links in markdown files
  eleventyConfig.addShortcode("extlink", function(url, text) {
    // Ensure https for external URLs
    if (url && url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text || url}</a>`;
  });

  // Add fallback dateToRfc3339 filter
  eleventyConfig.addFilter("dateToRfc3339", function(date) {
    if (!date) {
      return new Date().toISOString();
    }
    return new Date(date).toISOString();
  });

  // Add transform to ensure external links have proper security attributes
  eleventyConfig.addTransform("externalLinks", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    // First, convert all http:// links to https://
    content = content.replace(
      /(<a\s+)(?:[^>]*?\s+)?href=(['"])http:\/\/([^'"]+)\2/gi,
      function(match, start, quote, url) {
        return `${start}href=${quote}https://${url}${quote}`;
      }
    );

    // Then add security attributes
    return content.replace(
      /(<a\s+)(?:[^>]*?\s+)?href=(['"])(?:http|https):\/\/[^'"]+\2([^>]*?>)/gi,
      function(match, start, quote, end) {
        // Check if target attribute already exists
        if (!/\starget\s*=\s*(['"])_blank\1/i.test(match)) {
          // Add target="_blank" if it doesn't exist
          match = match.replace(/>$/, ' target="_blank">');
        }
        
        // Check if rel attribute already exists
        if (!/\srel\s*=\s*(['"])[^'"]*\1/i.test(match)) {
          // Add rel="noopener noreferrer" if it doesn't exist
          match = match.replace(/>$/, ' rel="noopener noreferrer">');
        } else if (!/\srel\s*=\s*(['"])[^'"]*(?:noopener|noreferrer)[^'"]*\1/i.test(match)) {
          // If rel exists but doesn't contain noopener or noreferrer, add them
          match = match.replace(/(\srel\s*=\s*(['"])[^'"]*)\2/i, '$1 noopener noreferrer$2');
        }
        
        return match;
      }
    );
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
