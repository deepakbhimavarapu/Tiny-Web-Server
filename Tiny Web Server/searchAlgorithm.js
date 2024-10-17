// searchAlgorithm.js

// Import the necessary functions from the search index module
const { getPagesForKeyword } = require('./searchIndex');

// Function to process the query and return relevant pages
function search(index, query) {
  // Step 1: Process the query
  // Convert the query to lowercase and split it into individual keywords or phrases
  const keywords = query.toLowerCase().split(/[^a-z0-9]+/);

  // Step 2: Retrieve pages for each keyword
  let results = [];
  keywords.forEach(keyword => {
    if (keyword) {
      const pages = getPagesForKeyword(index, keyword);
      results.push(...pages); // Add the pages for the keyword to the result list
    }
  });

  // Step 3: Remove duplicate URLs
  const uniqueResults = [...new Set(results)]; // Use a Set to remove duplicates

  // Step 4: Return the list of unique relevant URLs
  return uniqueResults;
}

// Export the search function for use in other files
module.exports = { search };
