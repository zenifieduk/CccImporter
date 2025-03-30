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
          return JSON.parse(fileContent);
        } catch (error) {
          console.error(`Error reading event JSON file: ${file}`, error);
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
  
  // Convert map back to array
  return Array.from(eventsMap.values());
};