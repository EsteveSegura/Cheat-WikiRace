const { getLinks } = require('./utils/wikiScraper');

class CheatWikiRace {
  constructor(sourceUrl, targetUrl) {
    this.sourceUrl = sourceUrl;
    this.targetUrl = targetUrl;
    this.visited = new Set();
    this.queue = [];
    this.maxDepth = 6;
    this.minDepth = 2;
    this.nodes = new Set();
    this.edges = new Set();
  }

  async findPath() {
    this.queue.push({ url: this.sourceUrl, path: [this.sourceUrl], depth: 0 });
    this.visited.add(this.sourceUrl);
    this.nodes.add(this.sourceUrl);

    while (this.queue.length > 0) {
      const { url, path, depth } = this.queue.shift();

      console.log(`Processing: ${url} at depth ${depth}`);

      if (url === this.targetUrl && depth >= this.minDepth) {
        console.log("Target found!");
        return { success: true, path };
      }

      if (depth >= this.maxDepth) continue;

      try {
        const links = await getLinks(url);
        for (const link of links) {
          if (!this.visited.has(link)) {
            this.visited.add(link);
            this.queue.push({ 
              url: link, 
              path: [...path, link],
              depth: depth + 1
            });

            // Add node and edge to the graph
            this.nodes.add(link);
            this.edges.add(JSON.stringify({from: url, to: link}));

            // Early check for target
            if (link === this.targetUrl && depth + 1 >= this.minDepth) {
              console.log("Target found!");
              return { success: true, path: [...path, link] };
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${url}: ${error.message}`);
      }
    }

    console.log("Path not found or depth limit reached");
    return { success: false, message: 'Path not found or depth limit reached' };
  }
}

module.exports = CheatWikiRace;