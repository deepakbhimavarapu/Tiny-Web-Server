const axios = require('axios');
const cheerio = require('cheerio');
const { addPageToIndex } = require('./searchIndex');
const { URL } = require('url');

// Crawl a given URL and add its content to the search index
async function crawl(startingUrl, index, visited = new Set(), robotsTxt = {}) {
  if (visited.has(startingUrl)) return; // Prevent infinite loops

  // Mark the URL as visited
  visited.add(startingUrl);

  // Parse and enforce robots.txt rules before crawling
  const parsedUrl = new URL(startingUrl);
  if (!robotsTxt[parsedUrl.origin]) {
    robotsTxt[parsedUrl.origin] = await fetchRobotsTxt(parsedUrl.origin);
  }
  if (!isAllowedByRobotsTxt(robotsTxt[parsedUrl.origin], parsedUrl.pathname)) {
    console.log(`Disallowed by robots.txt: ${startingUrl}`);
    return; // Skip crawling this URL
  }

  try {
    console.log(`Crawling: ${startingUrl}`);

    // Fetch the page content
    const response = await axios.get(startingUrl);
    const htmlContent = response.data;

    // Use cheerio to load the HTML content
    const $ = cheerio.load(htmlContent);

    // Extract the page text and add it to the index
    const pageText = $('body').text();
    addPageToIndex(index, startingUrl, pageText);

    // Extract links from the page
    const links = getLinksFromPage($, startingUrl);

    // Crawl each of the links recursively
    for (const link of links) {
      if (isValidUrl(link)) {
        await crawl(link, index, visited, robotsTxt);
      }
    }
  } catch (error) {
    console.error(`Failed to crawl ${startingUrl}:`, error.message);
  }
}

// Fetch and parse robots.txt
async function fetchRobotsTxt(baseUrl) {
  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const response = await axios.get(robotsUrl);
    const lines = response.data.split('\n');
    const rules = {};

    let currentUserAgent = '*';
    for (const line of lines) {
      const cleanLine = line.trim().toLowerCase();
      if (cleanLine.startsWith('user-agent')) {
        currentUserAgent = cleanLine.split(':')[1].trim();
      } else if (cleanLine.startsWith('disallow') && currentUserAgent === '*') {
        const path = cleanLine.split(':')[1].trim();
        rules[path] = true;
      }
    }
    return rules;
  } catch (error) {
    return {}; // If robots.txt can't be fetched, assume no restrictions
  }
}

// Check if a path is allowed by robots.txt
function isAllowedByRobotsTxt(rules, path) {
  return !rules[path]; // Returns true if the path is not disallowed
}

// Extract all valid links from a page and resolve relative URLs
function getLinksFromPage($, baseUrl) {
  const links = [];
  $('a').each((index, element) => {
    let link = $(element).attr('href');
    if (link && link.startsWith('/')) {
      link = new URL(link, baseUrl).href;
    }
    if (link && link.startsWith('http')) {
      links.push(link); // Collect valid URLs
    }
  });
  return links;
}

// Validate URLs
function isValidUrl(url) {
  return url.startsWith('http') && !url.includes('mailto:');
}

module.exports = { crawl };
