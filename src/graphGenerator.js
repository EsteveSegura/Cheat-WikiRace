function generateGraphHTML(nodes, edges, path) {
    const nodesArray = Array.from(nodes).map(url => ({
      id: url,
      label: url.split('/').pop(),
      shape: 'dot',
      size: 10,
      color: path.includes(url) ? '#ff0000' : '#97c2fc'
    }));
  
    const edgesArray = Array.from(edges).map(edge => {
      const { from, to } = JSON.parse(edge);
      return { 
        from, 
        to, 
        arrows: 'to',
        color: {
          color: path.includes(from) && path.includes(to) ? '#ff0000' : '#848484'
        },
        width: path.includes(from) && path.includes(to) ? 2 : 1
      };
    });
  
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>WikiRace Graph</title>
      <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
      <style type="text/css">
        #graph {
          width: 100%;
          height: 100vh;
          border: 1px solid lightgray;
        }
      </style>
    </head>
    <body>
      <div id="graph"></div>
      <script type="text/javascript">
        const nodes = new vis.DataSet(${JSON.stringify(nodesArray)});
        const edges = new vis.DataSet(${JSON.stringify(edgesArray)});
        const container = document.getElementById('graph');
        const data = {
          nodes: nodes,
          edges: edges
        };
        const options = {
          nodes: {
            font: {
              size: 12
            }
          },
          physics: {
            stabilization: false,
            barnesHut: {
              gravitationalConstant: -1500,
              springConstant: 0.100,
              springLength: 200
            }
          },
          layout: {
            improvedLayout: true
          }
        };
        const network = new vis.Network(container, data, options);
      </script>
    </body>
    </html>
    `;
  
    return htmlContent;
  }
  
  module.exports = { generateGraphHTML };