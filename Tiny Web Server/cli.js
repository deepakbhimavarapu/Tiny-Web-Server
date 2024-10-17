const readline = require('readline');
const { createIndex, addPageToIndex, getPagesForKeyword } = require('./searchIndex');
const { search } = require('./searchAlgorithm');
const { rankSearchResults } = require('./rankingAlgorithm');

// Initialize the search index
let index = createIndex();

// Mocked data or you can populate the index with the spider component
function populateIndexWithMockData() {
  // Add mock pages to the index for testing
  addPageToIndex(index, 'https://www.example.com/cats', 'This is a page about cats.');
  addPageToIndex(index, 'https://www.example.com/dogs', 'This is a page about dogs.');
  addPageToIndex(index, 'https://www.example.com/birds', 'This is a page about birds.');
}

// Populate the index (replace this with real spider data or mock data)
populateIndexWithMockData();

// Create the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',  // This will show the prompt symbol
});

// Welcome message
console.log('Welcome to Tiny Web Search Engine!');
console.log('You can search for pages by typing keywords. Type "exit" to quit.');

// Function to process user queries
function handleUserQuery(query) {
  if (query.toLowerCase() === 'exit') {
    console.log('Exiting the search engine. Goodbye!');
    rl.close(); // Close the CLI gracefully
    return;
  }

  // Run the search algorithm
  const searchResults = search(index, query);

  // Rank the search results using the ranking algorithm
  const rankedResults = rankSearchResults(index, query, searchResults);

  // Display the results
  if (rankedResults.length > 0) {
    console.log('Search Results:');
    rankedResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result}`);
    });
  } else {
    console.log('No results found for your query.');
  }

  // Prompt for the next input
  rl.prompt();
}

// Start the command line interface and handle user input
rl.prompt(); // Start showing the prompt symbol
rl.on('line', (input) => {
  handleUserQuery(input.trim()); // Process user input and remove any extra spaces
});
