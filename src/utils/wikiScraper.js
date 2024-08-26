const axios = require('axios');
const cheerio = require('cheerio');

async function getLinks(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);
    const links = new Set();

    $('#mw-content-text a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.startsWith('/wiki/') && !href.includes(':') && !href.includes('#')) {
        links.add(`https://en.wikipedia.org${href}`);
      }
    });

    return Array.from(links).slice(0, 50);
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return [];
  }
}

module.exports = { getLinks };