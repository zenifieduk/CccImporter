#!/usr/bin/env node

/**
 * Script to check auction dates and identify expired auctions
 * Can be run manually or via GitHub Actions
 */

const fs = require('fs');
const path = require('path');

// Helper function to parse auction date
function parseAuctionDate(dateStr) {
  if (!dateStr) return null;
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4, 8);
  const time = dateStr.substring(9);
  return new Date(`${year}-${month}-${day}T${time}`);
}

// Read the auctions data file
const auctionsPath = path.join(__dirname, '../src/_data/auctions.js');

// Simple check for expired auctions
function checkAuctionDates() {
  const now = new Date();
  let expiredCount = 0;
  let upcomingCount = 0;
  
  // This is a simplified version - in practice you'd need to evaluate the JS file
  const content = fs.readFileSync(auctionsPath, 'utf8');
  
  // Extract auction dates using regex (simplified approach)
  const dateMatches = content.match(/auctionStartDateTime:\s*"([^"]+)"/g);
  
  if (dateMatches) {
    dateMatches.forEach(match => {
      const dateStr = match.match(/"([^"]+)"/)[1];
      const auctionDate = parseAuctionDate(dateStr);
      
      if (auctionDate) {
        if (auctionDate < now) {
          expiredCount++;
          console.log(`⚠️  Expired auction found: ${dateStr} (${auctionDate.toLocaleDateString()})`);
        } else {
          upcomingCount++;
        }
      }
    });
  }
  
  console.log(`\n📊 Auction Status Summary:`);
  console.log(`   Upcoming auctions: ${upcomingCount}`);
  console.log(`   Expired auctions: ${expiredCount}`);
  
  if (expiredCount > 0) {
    console.log(`\n🔔 Recommendation: Update auction data to remove ${expiredCount} expired auction(s)`);
    console.log(`   The site's filtering will hide these automatically, but removing them`);
    console.log(`   from the source data will improve performance and maintainability.`);
  } else {
    console.log(`\n✅ All auction dates are current!`);
  }
  
  return {
    expired: expiredCount,
    upcoming: upcomingCount
  };
}

// Run the check
if (require.main === module) {
  console.log('🔍 Checking auction dates...\n');
  const results = checkAuctionDates();
  
  // Exit with error code if there are expired auctions (for CI/CD)
  process.exit(results.expired > 5 ? 1 : 0); // Allow some tolerance
}

module.exports = { checkAuctionDates, parseAuctionDate }; 