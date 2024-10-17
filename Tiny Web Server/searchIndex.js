// searchIndex.js

// 1. createIndex()
// Initializes an empty object to store the search index.
function createIndex() {
    return {}; // An empty object or Map to store keywords and URLs
  }
  
  // 2. addPageToIndex(index, url, pageContent)
  // Adds the page content to the search index by associating the keywords with the URL.
  function addPageToIndex(index, url, pageContent) {
    // Check for invalid or empty URLs
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return; // Don't add the page if the URL is invalid
    }
  
    // Extract keywords from the page content
    const keywords = extractKeywords(pageContent);
  
    // Add the URL to the index for each extracted keyword
    keywords.forEach(keyword => {
      if (!index[keyword]) {
        index[keyword] = []; // Create an empty array if keyword is not in index
      }
      // Add the URL to the keyword's list only if it's not already present
      if (!index[keyword].includes(url)) {
        index[keyword].push(url);
      }
    });
  }
  
  
  // 3. updatePageInIndex(index, url, newPageContent)
  // Updates the page content in the index by removing old content and re-adding the new content.
  function updatePageInIndex(index, url, newPageContent) {
    removePageFromIndex(index, url); // Remove the old page content
    addPageToIndex(index, url, newPageContent); // Add the new content
  }
  
  // 4. removePageFromIndex(index, url)
  // Removes a URL from all keywords it's associated with.
  function removePageFromIndex(index, url) {
    Object.keys(index).forEach(keyword => {
      index[keyword] = index[keyword].filter(pageUrl => pageUrl !== url);
      // Remove the keyword from the index if no URLs are left
      if (index[keyword].length === 0) {
        delete index[keyword];
      }
    });
  }
  
  // 5. getPagesForKeyword(index, keyword)
  // Returns the list of URLs associated with the keyword or an empty array if not found.
  function getPagesForKeyword(index, keyword) {
    return index[keyword] || [];
  }
  
  // 6. extractKeywords(pageContent)
  // Helper function to extract keywords from page content.
  function extractKeywords(pageContent) {
    // Tokenize the content by splitting words and converting to lowercase
    let words = pageContent.toLowerCase().split(/[^a-z0-9]+/);
  
    // List of stop words to remove
    const stopWords = ['the', 'is', 'and', 'a', 'an', 'in', 'on', 'at', 'by'];
  
    // Filter out stop words and empty strings
    return words.filter(word => word.length > 1 && !stopWords.includes(word));
  }
  
  // Export the functions for use in other files
  module.exports = {
    createIndex,
    addPageToIndex,
    updatePageInIndex,
    removePageFromIndex,
    getPagesForKeyword
  };
  