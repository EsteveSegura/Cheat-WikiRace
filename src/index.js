const CheatWikiRace = require('./CheatWikiRace');
const { generateGraphHTML } = require('./graphGenerator');
const fs = require('fs').promises;

async function main() {
  const [,, sourceUrl, targetUrl] = process.argv;

  if (!sourceUrl || !targetUrl) {
    console.error('Usage: node src/index.js <source_url> <target_url>');
    console.error('Example: node src/index.js https://en.wikipedia.org/wiki/Web_browser https://en.wikipedia.org/wiki/Telnet');
    process.exit(1);
  }

  console.log(`Starting search from ${sourceUrl} to ${targetUrl}`);
  const wikiRace = new CheatWikiRace(sourceUrl, targetUrl);
  const result = await wikiRace.findPath();

  console.log(JSON.stringify(result, null, 2));

  // Generate and save the graph HTML
  const graphHTML = generateGraphHTML(wikiRace.nodes, wikiRace.edges, result.success ? result.path : []);
  await fs.writeFile('wikirace_graph.html', graphHTML);
  console.log('Graph visualization saved to wikirace_graph.html');
}

main().catch(console.error);