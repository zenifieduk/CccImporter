const fs = require('fs');
const path = require('path');
const staticClubs = require('./clubs.js');

module.exports = function() {
  // Get the static clubs data
  const staticClubsData = staticClubs();
  
  // Path to the JSON clubs directory
  const clubsJsonDir = path.join(__dirname, 'clubs-json');
  
  let jsonClubs = [];
  
  // Check if the directory exists
  if (fs.existsSync(clubsJsonDir)) {
    // Read all files in the directory
    const files = fs.readdirSync(clubsJsonDir);
    
    // Process each JSON file
    jsonClubs = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          const filePath = path.join(clubsJsonDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(fileContent);
        } catch (error) {
          console.error(`Error reading club JSON file: ${file}`, error);
          return null;
        }
      })
      .filter(club => club !== null);
  }
  
  // Merge both sources, with JSON clubs taking precedence (for updates)
  // Use a Map to prevent duplicates based on title
  const clubsMap = new Map();
  
  // Add static clubs to the map
  staticClubsData.forEach(club => {
    clubsMap.set(club.title.toLowerCase(), club);
  });
  
  // Add or update with JSON clubs
  jsonClubs.forEach(club => {
    clubsMap.set(club.title.toLowerCase(), club);
  });
  
  // Convert map back to array
  return Array.from(clubsMap.values());
};