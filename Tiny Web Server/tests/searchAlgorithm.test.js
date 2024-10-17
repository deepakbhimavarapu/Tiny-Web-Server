// __tests__/searchAlgorithm.test.js

const { createIndex, addPageToIndex } = require('../searchIndex');
const { search } = require('../searchAlgorithm');

describe('Search Algorithm', () => {
  let index;

  // Initialize a new index before each test
  beforeEach(() => {
    index = createIndex();
    // Populate the index with some sample data
    addPageToIndex(index, 'https://www.example.com/cats', 'This is a page about cats');
    addPageToIndex(index, 'https://www.example.com/dogs', 'This is a page about dogs and training');
    addPageToIndex(index, 'https://www.training.com', 'This is a general training website');
    addPageToIndex(index, 'https://www.example.com/ml', 'This is a page about machine learning');
  });

  // Test 1: Single keyword search
  it('should return relevant pages for a single keyword search', () => {
    const results = search(index, 'cats');
    expect(results).toContain('https://www.example.com/cats');
  });

  // Test 2: Multiple keyword search
  it('should return relevant pages for multiple keywords', () => {
    const results = search(index, 'dogs training');
    expect(results).toContain('https://www.example.com/dogs');
    expect(results).toContain('https://www.training.com');
  });

  // Test 3: Phrase search
  it('should return relevant pages for a phrase search', () => {
    const results = search(index, 'machine learning');
    expect(results).toContain('https://www.example.com/ml');
  });

  // Test 4: Case insensitivity in search query
  it('should return relevant pages regardless of case sensitivity', () => {
    const results = search(index, 'CATS');
    expect(results).toContain('https://www.example.com/cats');
  });

  // Test 5: No matching results
  it('should return an empty array if no matching results are found', () => {
    const results = search(index, 'birds');
    expect(results).toEqual([]); // No results for 'birds'
  });

  // Test 6: Search with multiple keywords resulting in duplicate URLs
  it('should handle duplicate URLs from multiple keywords and return unique results', () => {
    addPageToIndex(index, 'https://www.example.com', 'This page is about dogs and cats');
    const results = search(index, 'dogs cats');
    expect(results).toContain('https://www.example.com');
    expect(new Set(results).size).toBe(results.length); // Ensure there are no duplicates
  });
});
