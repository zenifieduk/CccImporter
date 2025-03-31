const clubs = require('./src/_data/clubs.js');

// Check if clubs is an array
if (!Array.isArray(clubs)) {
  console.log(`Unexpected: clubs is not an array, it's a ${typeof clubs}`);
  if (typeof clubs === 'function') {
    console.log('clubs is a function. Let\'s try calling it...');
    const clubsData = clubs();
    console.log(`Result of calling clubs() is a ${typeof clubsData}`);
    if (Array.isArray(clubsData)) {
      console.log(`After calling, got an array with ${clubsData.length} items`);
      console.log('First few items:');
      clubsData.slice(0, 3).forEach((club, i) => {
        console.log(`Club ${i+1}: ${club.title}, Slug: ${club.slug}`);
      });
    }
  }
  process.exit(1);
}

console.log(`Total clubs: ${clubs.length}`);

// Output first few clubs to verify their structure
console.log('\nSample clubs:');
clubs.slice(0, 5).forEach((club, index) => {
  console.log(`Club ${index + 1}: ${club.title}`);
  console.log(`  ID: ${club.id}`);
  console.log(`  Slug: ${club.slug}`);
  console.log(`  Type of slug: ${typeof club.slug}`);
});

// Go through all clubs and find ones with no slug or undefined slug
const problematicClubs = clubs.filter(club => !club.slug);

console.log(`\nFound ${problematicClubs.length} clubs with no slug:`);
if (problematicClubs.length > 0) {
  problematicClubs.forEach(club => {
    console.log(`Title: ${club.title}, ID: ${club.id}, Slug: ${club.slug}`);
  });
}