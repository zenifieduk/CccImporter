const clubs = require('./src/_data/clubs.js');

const slugCounts = {};

// Check for duplicate slugs
clubs.forEach((club, index) => {
  const slug = club.slug || 'undefined';
  
  if (!slugCounts[slug]) {
    slugCounts[slug] = [];
  }
  
  slugCounts[slug].push({
    index: index + 1,
    title: club.title
  });
});

// Output duplicate slugs
console.log('=== Duplicate Slugs ===');
Object.entries(slugCounts)
  .filter(([slug, occurrences]) => occurrences.length > 1)
  .forEach(([slug, occurrences]) => {
    console.log(`\nSlug "${slug}" appears ${occurrences.length} times:`);
    occurrences.forEach(occurrence => {
      console.log(`- Index ${occurrence.index}: "${occurrence.title}"`);
    });
  });

// Check for undefined slugs
console.log('\n=== Undefined Slugs ===');
const undefinedSlugs = clubs.filter(club => !club.slug);
if (undefinedSlugs.length) {
  console.log(`Found ${undefinedSlugs.length} clubs with undefined slugs:`);
  undefinedSlugs.forEach((club, index) => {
    console.log(`- Index ${index + 1}: "${club.title}"`);
  });
} else {
  console.log('No undefined slugs found');
}

// Output clubs with empty slugs (different from undefined)
const emptySlugs = clubs.filter(club => club.slug === '');
if (emptySlugs.length) {
  console.log('\n=== Empty Slugs ===');
  console.log(`Found ${emptySlugs.length} clubs with empty slugs:`);
  emptySlugs.forEach((club, index) => {
    console.log(`- Index ${index + 1}: "${club.title}"`);
  });
}