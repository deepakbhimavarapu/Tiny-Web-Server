// __tests__/rankingAlgorithm.test.js

const { createIndex, addPageToIndex } = require('../searchIndex');
const { search } = require('../searchAlgorithm');
const { rankSearchResults } = require('../rankingAlgorithm');

describe('Ranking Algorithm', () => {
  let index;

  // Initialize a new index before each test
  beforeEach(() => {
    index = createIndex();
    // Populate the index with some sample data
    addPageToIndex(index, 'https://www.example.com/cats', 'This is a page about cats');
    addPageToIndex(index, 'https://www.example.com/dogs', 'This is a page about dogs and training');
    addPageToIndex(index, 'https://www.example.com/cats-and-dogs', 'This is a page about both cats and dogs');
    addPageToIndex(index, 'https://www.example.com/ml', 'This is a page about machine learning');
  });

  // Test 1: Rank results by keyword frequency
  it('should rank results based on keyword frequency', () => {
    const searchResults = search(index, 'cats');
    const rankedResults = rankSearchResults(index, 'cats', searchResults);

    expect(rankedResults[0]).toBe('https://www.example.com/cats'); // Page with more "cats" content
    expect(rankedResults[1]).toBe('https://www.example.com/cats-and-dogs');
  });

  // Test 2: Rank results by multiple keyword matches
  it('should rank pages with more keyword matches higher', () => {
    const searchResults = search(index, 'cats dogs');
    const rankedResults = rankSearchResults(index, 'cats dogs', searchResults);

    expect(rankedResults[0]).toBe('https://www.example.com/cats-and-dogs'); // Page about both cats and dogs
    expect(rankedResults[1]).toBe('https://www.example.com/cats');
    expect(rankedResults[2]).toBe('https://www.example.com/dogs');
  });

  // Test 3: Handle cases with no matches
  it('should return an empty array if there are no matches', () => {
    const searchResults = search(index, 'birds');
    const rankedResults = rankSearchResults(index, 'birds', searchResults);

    expect(rankedResults).toEqual([]); // No matches for 'birds'
  });

  // Test 4: Handle ties in ranking
  it('should handle ties in ranking', () => {
    const searchResults = search(index, 'machine learning');
    const rankedResults = rankSearchResults(index, 'machine learning', searchResults);

    expect(rankedResults.length).toBe(1);
    expect(rankedResults[0]).toBe('https://www.example.com/ml'); // Only one result, so no tie in this case
  });
});
