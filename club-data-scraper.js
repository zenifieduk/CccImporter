const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');

/**
 * Required fields for clubs.js based on the Spirit Motor Club example:
 * - title: Club name
 * - website: URL of the club website
 * - address: Physical address
 * - phone: Contact phone number
 * - email: Contact email
 * - city: City location
 * - postalCode: Postal/ZIP code
 * - countryCode: 2-letter country code (GB, US, etc.)
 * - imageUrl: Path to club image
 * - category: Category of the club (Car Club, Classic Vehicle Club, etc.)
 * - state: County/State/Province
 * - slug: URL-friendly name (automatically generated)
 * - featured: Boolean - if the club should be featured
 * - showcase: Boolean - if the club should have a showcase page
 * - description: HTML description of the club
 * - marque: Car marque/make if applicable
 * - membership: Membership fee info
 * - facebook: Facebook URL
 * - instagram: Instagram URL
 * - linkedin: LinkedIn URL
 * 
 * Additional fields for showcase clubs:
 * - showcaseBanner: Banner image for showcase page
 * - showcaseLogo: Logo image for showcase page
 * - showcaseBadge: Badge image for showcase page
 * - quickFacts: Object with members, founded, notableMember, location
 * - aboutExpanded: Longer HTML description
 * - clubEthos: HTML description of club ethos
 * - curatedEvents: Array of event objects {title, date, location, description}
 * - mediaGallery: Array of image URLs
 * - map: Object with hq, hqLat, hqLng, venues array
 * - ctas: Array of call-to-action objects {label, url}
 */

// Configuration for the scraper
const CONFIG = {
  // Common patterns to look for on club websites
  patterns: {
    email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
    phone: /(\+?[\d\s\(\)]{10,20})/g,
    location: /((?:[A-Z][a-z]+\s?)+,\s*(?:[A-Z]{2}))/g,
    postcode: /([A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2})/g, // UK postcode
    zipcode: /(\d{5}(?:[-\s]\d{4})?)/g // US ZIP code
  },
  
  // Elements to look for on a club website
  selectors: {
    title: ['h1', '.site-title', '.logo', '.club-name', '.org-name'],
    about: ['.about', '#about', 'section.about', '.about-us', '#about-us'],
    contact: ['.contact', '#contact', 'section.contact', '.contact-us', '#contact-us'],
    events: ['.events', '#events', 'section.events', '.upcoming-events', '#upcoming-events'],
    gallery: ['.gallery', '#gallery', 'section.gallery', '.photos', '#photos'],
    social: ['.social', '.social-links', '.social-media', 'footer .social'],
    footer: ['footer', '.footer', '#footer']
  },
  
  // Common social media patterns
  socialPatterns: {
    facebook: /facebook\.com\/([^\/\?"']+)/i,
    instagram: /instagram\.com\/([^\/\?"']+)/i,
    linkedin: /linkedin\.com\/([^\/\?"']+)/i,
    twitter: /twitter\.com\/([^\/\?"']+)/i
  }
};

/**
 * Main function to scrape a club website and extract relevant information
 * @param {string} url - URL of the club website to scrape
 * @param {object} options - Additional options for scraping
 * @returns {object} - Club data object formatted for clubs.js
 */
async function scrapeClubWebsite(url, options = {}) {
  try {
    console.log(`Scraping website: ${url}`);
    
    // Fetch the website HTML
    const response = await axios.get(url);
    const html = response.data;
    
    // Parse HTML with cheerio
    const $ = cheerio.load(html);
    
    // Initialize club data object
    const clubData = {
      title: '',
      website: url,
      address: '',
      phone: '',
      email: '',
      city: '',
      postalCode: '',
      countryCode: options.countryCode || 'GB', // Default to GB
      imageUrl: '',
      category: options.category || 'Car Club', // Default category
      state: '',
      slug: '',
      featured: options.featured || false,
      showcase: options.showcase || false,
      description: '',
      marque: options.marque || '',
      membership: '',
      facebook: '',
      instagram: '',
      linkedin: ''
    };
    
    // Extract club title
    for (const selector of CONFIG.selectors.title) {
      if ($(selector).length > 0) {
        clubData.title = $(selector).first().text().trim();
        break;
      }
    }
    
    // If no title found, try getting it from the page title
    if (!clubData.title) {
      clubData.title = $('title').text().replace(/\s*\|.*$/, '').trim();
    }
    
    // Extract contact information
    let contactText = '';
    
    // Try to find a contact section first
    for (const selector of CONFIG.selectors.contact) {
      if ($(selector).length > 0) {
        contactText += $(selector).text() + ' ';
      }
    }
    
    // Also check the footer for contact info
    for (const selector of CONFIG.selectors.footer) {
      if ($(selector).length > 0) {
        contactText += $(selector).text() + ' ';
      }
    }
    
    // Extract email addresses
    const emailMatches = contactText.match(CONFIG.patterns.email);
    if (emailMatches && emailMatches.length > 0) {
      clubData.email = emailMatches[0].trim();
    }
    
    // Extract phone numbers
    const phoneMatches = contactText.match(CONFIG.patterns.phone);
    if (phoneMatches && phoneMatches.length > 0) {
      clubData.phone = phoneMatches[0].trim();
    }
    
    // Extract postal/ZIP codes
    const postcodeMatches = contactText.match(CONFIG.patterns.postcode) || contactText.match(CONFIG.patterns.zipcode);
    if (postcodeMatches && postcodeMatches.length > 0) {
      clubData.postalCode = postcodeMatches[0].trim();
    }
    
    // Extract address from contact text
    // This is more complex and often requires manual review
    // Here we'll do a basic extraction of text near postal codes
    if (clubData.postalCode) {
      const addressContext = contactText.split(clubData.postalCode)[0];
      const addressLines = addressContext.split('\n').filter(line => line.trim().length > 0);
      if (addressLines.length > 0) {
        // Take the last few lines before the postal code as the address
        clubData.address = addressLines.slice(-2).join(', ').trim();
      }
    }
    
    // Extract description/about text
    let descriptionText = '';
    for (const selector of CONFIG.selectors.about) {
      if ($(selector).length > 0) {
        descriptionText += $(selector).html();
        break;
      }
    }
    
    if (descriptionText) {
      clubData.description = descriptionText.trim();
    } else {
      // If no specific about section, take a sample of paragraphs from the main content
      const mainContent = $('main, .content, #content, article').first();
      if (mainContent.length > 0) {
        const paragraphs = mainContent.find('p').slice(0, 2);
        if (paragraphs.length > 0) {
          clubData.description = paragraphs.map((i, el) => $(el).html()).get().join('');
        }
      }
    }
    
    // Extract social media links
    $('a').each((i, link) => {
      const href = $(link).attr('href');
      if (!href) return;
      
      // Check for Facebook
      if (href.includes('facebook.com') && !clubData.facebook) {
        clubData.facebook = href;
      }
      
      // Check for Instagram
      if (href.includes('instagram.com') && !clubData.instagram) {
        clubData.instagram = href;
      }
      
      // Check for LinkedIn
      if (href.includes('linkedin.com') && !clubData.linkedin) {
        clubData.linkedin = href;
      }
    });
    
    // Extract club name for slug if not already set
    if (!clubData.slug && clubData.title) {
      clubData.slug = clubData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    
    // Get first image as potential club image
    const firstLargeImage = $('img[src*="logo"], img[src*="header"], img[width][height]').filter((i, img) => {
      const width = $(img).attr('width');
      const height = $(img).attr('height');
      return (!width || parseInt(width) > 200) && (!height || parseInt(height) > 100);
    }).first();
    
    if (firstLargeImage.length > 0) {
      let imgSrc = $(firstLargeImage).attr('src');
      // Convert relative URL to absolute
      if (imgSrc && !imgSrc.startsWith('http')) {
        const urlObj = new URL(url);
        if (imgSrc.startsWith('/')) {
          imgSrc = `${urlObj.protocol}//${urlObj.host}${imgSrc}`;
        } else {
          imgSrc = `${urlObj.protocol}//${urlObj.host}/${imgSrc}`;
        }
      }
      clubData.imageUrl = imgSrc;
    }
    
    // For showcase clubs, collect additional data
    if (options.showcase) {
      // Initialize showcase-specific fields
      clubData.quickFacts = {
        members: '',
        founded: '',
        notableMember: '',
        location: ''
      };
      
      // Try to extract foundation year
      const foundedMatch = html.match(/(?:founded|established|since)[^\d]*(\d{4})/i);
      if (foundedMatch && foundedMatch[1]) {
        clubData.quickFacts.founded = foundedMatch[1];
      }
      
      // Try to extract location
      const locationMatch = contactText.match(/(?:based in|located in|headquartered in)[^,.]*([\w\s]+)(?:,|\.)/i);
      if (locationMatch && locationMatch[1]) {
        clubData.quickFacts.location = locationMatch[1].trim();
        // Try to extract city from location
        const cityMatch = clubData.quickFacts.location.match(/^([\w\s]+?)(?:,|$)/);
        if (cityMatch && cityMatch[1]) {
          clubData.city = cityMatch[1].trim();
        }
      }
      
      // Extract events if available
      const events = [];
      for (const selector of CONFIG.selectors.events) {
        if ($(selector).length > 0) {
          const eventContainer = $(selector);
          eventContainer.find('article, .event, .event-item').each((i, eventEl) => {
            const event = {
              title: $(eventEl).find('h2, h3, h4, .title').first().text().trim(),
              date: '',
              location: '',
              description: $(eventEl).find('p, .description').first().text().trim()
            };
            
            // Look for dates
            const dateMatch = $(eventEl).text().match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);
            if (dateMatch && dateMatch[1]) {
              event.date = dateMatch[1];
            }
            
            // Look for location
            const locationMatch = $(eventEl).text().match(/(?:at|in|venue)[:\s]*([\w\s,]+)/i);
            if (locationMatch && locationMatch[1]) {
              event.location = locationMatch[1].trim();
            }
            
            if (event.title && (event.date || event.description)) {
              events.push(event);
            }
          });
          
          if (events.length > 0) {
            clubData.curatedEvents = events.slice(0, 4); // Limit to 4 events
            break;
          }
        }
      }
      
      // Extract images for media gallery
      const galleryImages = [];
      for (const selector of CONFIG.selectors.gallery) {
        if ($(selector).length > 0) {
          $(selector).find('img').each((i, img) => {
            let imgSrc = $(img).attr('src');
            
            // Convert relative URL to absolute
            if (imgSrc && !imgSrc.startsWith('http')) {
              const urlObj = new URL(url);
              if (imgSrc.startsWith('/')) {
                imgSrc = `${urlObj.protocol}//${urlObj.host}${imgSrc}`;
              } else {
                imgSrc = `${urlObj.protocol}//${urlObj.host}/${imgSrc}`;
              }
            }
            
            if (imgSrc) {
              galleryImages.push(imgSrc);
            }
          });
          
          if (galleryImages.length > 0) {
            clubData.mediaGallery = galleryImages.slice(0, 5); // Limit to 5 images
            break;
          }
        }
      }
      
      // Extract membership info
      const membershipMatch = html.match(/(?:membership|join)[^\d£$€]*([£$€]?\d+(?:\.\d{2})?)/i);
      if (membershipMatch && membershipMatch[1]) {
        clubData.membership = membershipMatch[1];
      }
    }
    
    console.log(`Scraped data for: ${clubData.title}`);
    return clubData;
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    throw error;
  }
}

/**
 * Save the extracted club data to clubs.js
 * @param {object} clubData - The extracted club data
 * @param {string} outputPath - Path to save the output
 */
function saveClubData(clubData, outputPath = 'club-data-output.json') {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(clubData, null, 2));
    console.log(`Club data saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error saving club data:`, error.message);
  }
}

/**
 * Main function to run the scraper
 */
async function main() {
  // Check for command line arguments
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node club-data-scraper.js <club-website-url> [options]');
    console.log('Options:');
    console.log('  --showcase     Set the club as a showcase club');
    console.log('  --featured     Set the club as a featured club');
    console.log('  --category=    Specify the club category');
    console.log('  --marque=      Specify the marque/make');
    console.log('  --country=     Specify the country code (default: GB)');
    console.log('  --output=      Specify the output file path');
    return;
  }
  
  const url = args[0];
  const options = {
    showcase: args.includes('--showcase'),
    featured: args.includes('--featured') || args.includes('--showcase')
  };
  
  // Parse other options
  for (const arg of args) {
    if (arg.startsWith('--category=')) {
      options.category = arg.replace('--category=', '');
    } else if (arg.startsWith('--marque=')) {
      options.marque = arg.replace('--marque=', '');
    } else if (arg.startsWith('--country=')) {
      options.countryCode = arg.replace('--country=', '');
    } else if (arg.startsWith('--output=')) {
      options.outputPath = arg.replace('--output=', '');
    }
  }
  
  try {
    const clubData = await scrapeClubWebsite(url, options);
    saveClubData(clubData, options.outputPath || 'club-data-output.json');
    
    // Display a formatted version for clubs.js
    console.log('\nFormatted data for clubs.js:');
    console.log('----------------------------');
    console.log(formatForClubsJs(clubData));
    
  } catch (error) {
    console.error('Scraping failed:', error.message);
  }
}

/**
 * Format the club data for insertion into clubs.js
 * @param {object} clubData - The extracted club data
 * @returns {string} - Formatted JavaScript code
 */
function formatForClubsJs(clubData) {
  const output = [];
  output.push('{');
  
  // Basic fields
  output.push(`  title: "${clubData.title}",`);
  output.push(`  website: "${clubData.website}",`);
  output.push(`  address: "${clubData.address}",`);
  output.push(`  phone: "${clubData.phone}",`);
  output.push(`  email: "${clubData.email}",`);
  output.push(`  city: "${clubData.city}",`);
  output.push(`  postalCode: "${clubData.postalCode}",`);
  output.push(`  countryCode: "${clubData.countryCode}",`);
  output.push(`  imageUrl: "${clubData.imageUrl}",`);
  output.push(`  category: "${clubData.category}",`);
  output.push(`  state: "${clubData.state}",`);
  output.push(`  slug: "${clubData.slug}",`);
  output.push(`  featured: ${clubData.featured},`);
  output.push(`  showcase: ${clubData.showcase},`);
  
  // Description and other fields
  output.push(`  description: \`${clubData.description}\`,`);
  output.push(`  marque: "${clubData.marque}",`);
  output.push(`  membership: "${clubData.membership}",`);
  
  // Social media links
  if (clubData.facebook) output.push(`  facebook: "${clubData.facebook}",`);
  if (clubData.instagram) output.push(`  instagram: "${clubData.instagram}",`);
  if (clubData.linkedin) output.push(`  linkedin: "${clubData.linkedin}",`);
  
  // Showcase-specific fields
  if (clubData.showcase) {
    if (clubData.showcaseBanner) output.push(`  showcaseBanner: "${clubData.showcaseBanner}",`);
    if (clubData.showcaseLogo) output.push(`  showcaseLogo: "${clubData.showcaseLogo}",`);
    if (clubData.showcaseBadge) output.push(`  showcaseBadge: "${clubData.showcaseBadge}",`);
    
    // Quick facts
    if (clubData.quickFacts) {
      output.push(`  quickFacts: {`);
      if (clubData.quickFacts.members) output.push(`    members: "${clubData.quickFacts.members}",`);
      if (clubData.quickFacts.founded) output.push(`    founded: "${clubData.quickFacts.founded}",`);
      if (clubData.quickFacts.notableMember) output.push(`    notableMember: '${clubData.quickFacts.notableMember}',`);
      if (clubData.quickFacts.location) output.push(`    location: "${clubData.quickFacts.location}"`);
      output.push(`  },`);
    }
    
    // About expanded
    if (clubData.aboutExpanded) {
      output.push(`  aboutExpanded: \`${clubData.aboutExpanded}\`,`);
    }
    
    // Club ethos
    if (clubData.clubEthos) {
      output.push(`  clubEthos: \`${clubData.clubEthos}\`,`);
    }
    
    // Curated events
    if (clubData.curatedEvents && clubData.curatedEvents.length > 0) {
      output.push(`  curatedEvents: [`);
      clubData.curatedEvents.forEach(event => {
        output.push(`    { title: "${event.title}", date: "${event.date}", location: "${event.location}", description: "${event.description}" },`);
      });
      output.push(`  ],`);
    }
    
    // Media gallery
    if (clubData.mediaGallery && clubData.mediaGallery.length > 0) {
      output.push(`  mediaGallery: [`);
      clubData.mediaGallery.forEach(img => {
        output.push(`    "${img}",`);
      });
      output.push(`  ],`);
    }
    
    // Map
    if (clubData.map) {
      output.push(`  map: {`);
      output.push(`    hq: "${clubData.map.hq}",`);
      if (clubData.map.hqLat) output.push(`    hqLat: ${clubData.map.hqLat},`);
      if (clubData.map.hqLng) output.push(`    hqLng: ${clubData.map.hqLng},`);
      
      if (clubData.map.venues && clubData.map.venues.length > 0) {
        output.push(`    venues: [`);
        clubData.map.venues.forEach(venue => {
          output.push(`      { name: "${venue.name}", lat: ${venue.lat}, lng: ${venue.lng} },`);
        });
        output.push(`    ]`);
      }
      
      output.push(`  },`);
    }
    
    // CTAs
    if (clubData.ctas && clubData.ctas.length > 0) {
      output.push(`  ctas: [`);
      clubData.ctas.forEach(cta => {
        output.push(`    { label: "${cta.label}", url: "${cta.url}" },`);
      });
      output.push(`  ],`);
    }
  }
  
  output.push('},');
  
  return output.join('\n');
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  scrapeClubWebsite,
  saveClubData,
  formatForClubsJs
}; 