const {
    createIndex,
    addPageToIndex,
    updatePageInIndex,
    removePageFromIndex,
    getPagesForKeyword
  } = require('../searchIndex'); // Adjust path if necessary
  
  describe('Search Index', () => {
    let index;
  
    // Initialize a new index before each test
    beforeEach(() => {
      index = createIndex();
    });
  
    // Scenario 1: Adding a new page
    it('should add a new page to the index', () => {
      addPageToIndex(index, 'https://www.example.com', 'This is a sample web page about dogs');
      expect(getPagesForKeyword(index, 'dogs')).toContain('https://www.example.com');
    });
  
    // Scenario 2: Updating a page
    it('should update a page in the index', () => {
      addPageToIndex(index, 'https://www.example.com', 'This is a sample web page about dogs');
      updatePageInIndex(index, 'https://www.example.com', 'This is a sample web page about cats');
      expect(getPagesForKeyword(index, 'dogs')).not.toContain('https://www.example.com');
      expect(getPagesForKeyword(index, 'cats')).toContain('https://www.example.com');
    });
  
    // Scenario 3: Removing a page
    it('should remove a page from the index', () => {
      addPageToIndex(index, 'https://www.example.com', 'This is a sample web page about cats');
      removePageFromIndex(index, 'https://www.example.com');
      expect(getPagesForKeyword(index, 'cats')).not.toContain('https://www.example.com');
    });
  
    // Scenario 4: Searching for a keyword
    it('should return relevant pages for a keyword', () => {
      addPageToIndex(index, 'https://www.example.com', 'This is a sample web page about cats');
      expect(getPagesForKeyword(index, 'cats')).toContain('https://www.example.com');
    });
  
    // Edge case 1: Handling multiple pages with the same keyword
    it('should handle multiple pages with the same keyword', () => {
      addPageToIndex(index, 'https://www.example.com/page1', 'This page is about cats');
      addPageToIndex(index, 'https://www.example.com/page2', 'Another page about cats');
      
      const results = getPagesForKeyword(index, 'cats');
      expect(results).toContain('https://www.example.com/page1');
      expect(results).toContain('https://www.example.com/page2');
    });
  
    // Edge case 2: Handling case sensitivity in keyword matching
    it('should handle case insensitivity in keyword matching', () => {
      addPageToIndex(index, 'https://www.example.com', 'This is a page about CATS');
      
      const results = getPagesForKeyword(index, 'cats'); // Searching in lowercase
      expect(results).toContain('https://www.example.com');
    });
  
    // Edge case 3: Handling empty page content
    it('should handle empty page content gracefully', () => {
      addPageToIndex(index, 'https://www.example.com/empty', ''); // Adding empty content
      
      const results = getPagesForKeyword(index, ''); // Should return an empty array for an empty keyword
      expect(results).toEqual([]);
    });
  
    // Edge case 4: Handling invalid URLs
    it('should not add invalid URLs to the index', () => {
      addPageToIndex(index, '', 'This is a page about cats'); // Adding with an invalid URL
  
      const results = getPagesForKeyword(index, 'cats');
      expect(results).not.toContain(''); // URL should not be included
    });
  
    // Edge case 5: Removing non-existing page
    it('should handle removing a non-existing page gracefully', () => {
      addPageToIndex(index, 'https://www.example.com/cats', 'This is a page about cats');
      removePageFromIndex(index, 'https://www.example.com/doesnotexist'); // Removing non-existing page
      
      const results = getPagesForKeyword(index, 'cats');
      expect(results).toContain('https://www.example.com/cats'); // Should still contain the existing page
    });
  
    // Edge case 6: Adding the same page multiple times
    it('should avoid adding the same page multiple times for a keyword', () => {
      addPageToIndex(index, 'https://www.example.com', 'This is a page about cats');
      addPageToIndex(index, 'https://www.example.com', 'This is a page about cats'); // Adding the same page again
      
      const results = getPagesForKeyword(index, 'cats');
      expect(results.length).toBe(1); // Should only contain the URL once
    });
  
    // Edge case 7: Handling search for non-existing keyword
    it('should return an empty array when searching for a non-existing keyword', () => {
      const results = getPagesForKeyword(index, 'nonexistent');
      expect(results).toEqual([]); // No results should be returned
    });
  });
  