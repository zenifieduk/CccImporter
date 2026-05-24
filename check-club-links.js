const getAllClubs = require('./src/_data/clubs.js');
// Node.js v18+ has built-in fetch
const https = require('https');

// Agent to ignore self-signed certificate errors (use with caution)
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Function to check a single URL
async function checkUrl(club) {
  if (!club.website || typeof club.website !== 'string' || !club.website.trim().startsWith('http')) {
    // console.log(`Skipping invalid or missing URL for "${club.title}": ${club.website}`);
    return null; // Skip if no valid website URL
  }

  const url = club.website.trim();
  const MAX_RETRIES = 2;
  let attempts = 0;

  while (attempts <= MAX_RETRIES) {
    attempts++;
    try {
      // Use HEAD request for efficiency, add timeout, handle redirects manually
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(15000), // 15 second timeout
        redirect: 'manual', // We want to see the original status
        agent: url.startsWith('https:') ? agent : undefined // Use agent only for HTTPS to ignore cert errors
      });

      // Consider 2xx success, 3xx redirection as OK for link existence check
      if (response.status >= 200 && response.status < 400) {
        // console.log(`OK (${response.status}): ${url}`);
        return null; // URL is likely valid
      } else {
        console.warn(`Problem detected for "${club.title}": ${url} - Status: ${response.status}`);
        return { title: club.title, url: url, status: response.status, error: null };
      }
    } catch (error) {
      // Handle specific errors
      if (error.name === 'TimeoutError') {
        if (attempts > MAX_RETRIES) {
          console.error(`Timeout for "${club.title}": ${url} after ${MAX_RETRIES + 1} attempts`);
          return { title: club.title, url: url, status: null, error: 'Timeout' };
        }
        // console.log(`Timeout for ${url}, retrying (${attempts}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
      } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
         console.error(`DNS/Network Error for "${club.title}": ${url} - ${error.code}`);
         return { title: club.title, url: url, status: null, error: `DNS/Network Error (${error.code})` };
      } else if (error.code === 'ERR_INVALID_URL') {
          console.error(`Invalid URL format for "${club.title}": ${url}`);
          return { title: club.title, url: url, status: null, error: 'Invalid URL format' };
      } else if (error.message.includes('certificate') || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
          // This should be handled by rejectUnauthorized: false, but log if it still occurs
          console.warn(`SSL Certificate Error (ignored) for "${club.title}": ${url}`);
          return null; // Treat as potentially OK if we ignore SSL errors
      }
       else {
        if (attempts > MAX_RETRIES) {
          console.error(`Fetch Error for "${club.title}": ${url} - ${error.name}: ${error.message}`);
          return { title: club.title, url: url, status: null, error: error.message };
        }
        // console.log(`Fetch error for ${url}, retrying (${attempts}/${MAX_RETRIES})...`);
         await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
      }
    }
  }
   // Should not be reached if retries work, but as a fallback
   return { title: club.title, url: url, status: null, error: 'Max retries exceeded' };
}

// Main function to run the checks
async function checkAllClubLinks() {
  console.log("Loading club data...");
  const allClubs = await getAllClubs(); // Assuming getAllClubs is async or returns a promise if data loading is async
  // If getAllClubs is sync, remove await: const allClubs = getAllClubs();
  console.log(`Found ${allClubs.length} clubs. Checking website links...`);

  const problematicLinks = [];
  const CONCURRENCY_LIMIT = 10;
  const promises = [];

  for (let i = 0; i < allClubs.length; i++) {
      const club = allClubs[i];
      // Add promise to the list
      promises.push(checkUrl(club));

      // When concurrency limit is reached, or it's the last item, wait for promises to settle
      if (promises.length >= CONCURRENCY_LIMIT || i === allClubs.length - 1) {
          const results = await Promise.allSettled(promises);
          results.forEach(result => {
              if (result.status === 'fulfilled' && result.value) {
                  problematicLinks.push(result.value);
              } else if (result.status === 'rejected') {
                  // This shouldn't happen often with try/catch inside checkUrl, but log if it does
                  console.error("An unexpected error occurred during check:", result.reason);
              }
          });
          promises.length = 0; // Clear the promises array for the next batch
          // Optional: Add a small delay between batches
          // await new Promise(resolve => setTimeout(resolve, 500));
      }
  }


  console.log("\n--- Link Check Complete ---");
  if (problematicLinks.length > 0) {
    console.log(`Found ${problematicLinks.length} potential issues:`);
    problematicLinks.forEach(link => {
      if (link.error) {
        console.log(`- ${link.title} (${link.url}): Error - ${link.error}`);
      } else {
        console.log(`- ${link.title} (${link.url}): Status ${link.status}`);
      }
    });
  } else {
    console.log("All checked website links seem OK.");
  }
}

// Run the main function
checkAllClubLinks();