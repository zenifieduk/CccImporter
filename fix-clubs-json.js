const fs = require("fs");
const clubs = require("./src/_data/clubs.js");
// Write the clubs array to a JSON file
fs.writeFileSync("_site/clubs.json", JSON.stringify(clubs));
console.log(`Written ${clubs.length} clubs to _site/clubs.json`);
