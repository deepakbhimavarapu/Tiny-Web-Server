// rankingAlgorithm.js

// Function to rank search results based on relevance to the query
function rankSearchResults(index, query, searchResults) {
    // Step 1: Process the query and split it into keywords
    const keywords = query.toLowerCase().split(/[^a-z0-9]+/);
  
    // Step 2: Calculate relevance score for each search result (URL)
    const scores = searchResults.map(url => {
      const relevanceScore = calculateRelevanceScore(index, url, keywords);
      return { url, score: relevanceScore };
    });
  
    // Step 3: Sort results by relevance score in descending order
    scores.sort((a, b) => b.score - a.score);
  
    // Step 4: Return the ranked URLs
    return scores.map(result => result.url);
  }
  
  // Function to calculate the relevance score for a URL based on the query keywords
  function calculateRelevanceScore(index, url, keywords) {
    let score = 0;
  
    keywords.forEach(keyword => {
      const pages = getPagesForKeyword(index, keyword);
      if (pages.includes(url)) {
        // Calculate keyword frequency on the page (for simplicity, let's assume frequency = 1 for now)
        score += 1;
      }
      // You can extend this function to consider more advanced factors like keyword location, proximity, etc.
    });
  
    return score;
  }
  
  // Import the necessary function from searchIndex.js
  const { getPagesForKeyword } = require('./searchIndex');
  
  // Export the ranking function
  module.exports = { rankSearchResults };
  