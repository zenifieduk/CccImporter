const fs = require('fs');
const path = require('path');
const staticEvents = require('./events.js');

module.exports = function() {
  // Get the static events data
  const staticEventsData = staticEvents();
  
  // Path to the JSON events directory
  const eventsJsonDir = path.join(__dirname, 'events-json');
  
  let jsonEvents = [];
  
  // Check if the directory exists
  if (fs.existsSync(eventsJsonDir)) {
    // Read all files in the directory
    const files = fs.readdirSync(eventsJsonDir);
    
    // Process each JSON file
    jsonEvents = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          const filePath = path.join(eventsJsonDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // Check if the file starts with HTML doctype (common error)
          if (fileContent.trim().toLowerCase().startsWith('<!doctype')) {
            console.error(`Error: File ${file} contains HTML instead of JSON`);
            return null;
          }
          
          // Try to parse the JSON content
          const parsedContent = JSON.parse(fileContent);
          
          // Validate that it contains required fields for an event
          if (!parsedContent.eventTitle) {
            console.error(`Error: File ${file} is missing required 'eventTitle' field`);
            return null;
          }
          
          return parsedContent;
        } catch (error) {
          console.error(`Error reading event JSON file: ${file}`, error.message);
          return null;
        }
      })
      .filter(event => event !== null);
  }
  
  // Merge both sources, with JSON events taking precedence (for updates)
  // Use a Map to prevent duplicates based on event title
  const eventsMap = new Map();
  
  // Add static events to the map
  staticEventsData.forEach(event => {
    eventsMap.set(event.eventTitle.toLowerCase(), event);
  });
  
  // Add or update with JSON events
  jsonEvents.forEach(event => {
    eventsMap.set(event.eventTitle.toLowerCase(), event);
  });
  
  // Convert map back to array and sort by upcoming dates
  const allEvents = Array.from(eventsMap.values());
  
  // Sort events by date (upcoming first)
  allEvents.sort((a, b) => {
    // Extract dates from the format "08062025:10:00:00"
    const dateA = a.eventStartDateTime ? a.eventStartDateTime.substring(0, 8) : '99999999';
    const dateB = b.eventStartDateTime ? b.eventStartDateTime.substring(0, 8) : '99999999';
    return dateA.localeCompare(dateB);
  });
  
  return allEvents;
};