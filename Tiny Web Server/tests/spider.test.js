const { createIndex, getPagesForKeyword } = require('../searchIndex');
const { crawl } = require('../spider');
const nock = require('nock'); // Mock HTTP requests for testing

describe('Spider Component', () => {
  let index;

  // Initialize a new index before each test
  beforeEach(() => {
    index = createIndex();
  });

  // Test 1: Crawl a single page and add its content to the index
  it('should crawl a single page and add it to the index', async () => {
    // Mock the HTML response for the page
    nock('https://www.example.com')
      .get('/')
      .reply(200, '<html><body>This is a page about cats and dogs.</body></html>');

    await crawl('https://www.example.com', index);

    const results = getPagesForKeyword(index, 'cats');
    expect(results).toContain('https://www.example.com');
  });

  // Test 2: Follow links and crawl multiple pages
  it('should follow links and crawl multiple pages', async () => {
    // Mock the HTML responses for two pages
    nock('https://www.example.com')
      .get('/')
      .reply(200, '<html><body>This is the homepage. <a href="/about">About</a></body></html>');

    nock('https://www.example.com')
      .get('/about')
      .reply(200, '<html><body>This is the about page about cats.</body></html>');

    await crawl('https://www.example.com', index);

    const homeResults = getPagesForKeyword(index, 'homepage');
    const aboutResults = getPagesForKeyword(index, 'about');

    expect(homeResults).toContain('https://www.example.com');
    expect(aboutResults).toContain('https://www.example.com/about');
  });

      // Test 3: Respect robots.txt and avoid disallowed paths
  it('should respect robots.txt and avoid disallowed paths', async () => {
    // Mock the robots.txt and HTML response for the homepage
    nock('https://www.example.com')
      .get('/robots.txt')
      .reply(200, 'User-agent: *\nDisallow: /private');

    nock('https://www.example.com')
      .get('/')
      .reply(200, '<html><body>This is the homepage. <a href="/private">Private</a></body></html>');

    nock('https://www.example.com')
      .get('/private')
      .reply(200, '<html><body>This is the private page.</body></html>');

    await crawl('https://www.example.com', index);

    const homeResults = getPagesForKeyword(index, 'homepage');
    const allResults = getPagesForKeyword(index, 'private');

    // Expect the homepage to be indexed
    expect(homeResults).toContain('https://www.example.com');

    // Ensure that the /private page is not indexed, but don't expect the entire result to be empty
    expect(allResults).not.toContain('https://www.example.com/private');
  });

    
});
