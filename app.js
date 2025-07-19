const width = 800, height = 400, cellSize = 40;

let data;

d3.json("data/attention_example.json").then(json => {
  data = json;
  const layers = Object.keys(data);
  populateSelect("layerSelect", layers);

  d3.select("#layerSelect").on("change", updateHeadOptions);
  d3.select("#headSelect").on("change", drawMatrix);

  updateHeadOptions();
});

function populateSelect(id, items) {
  const select = d3.select(`#${id}`);
  select.selectAll("option").remove();
  select.selectAll("option")
    .data(items)
    .enter().append("option")
    .text(d => d);
}

function updateHeadOptions() {
  const selectedLayer = d3.select("#layerSelect").property("value");
  const heads = Object.keys(data[selectedLayer]);
  populateSelect("headSelect", heads);
  drawMatrix();
}

function drawMatrix() {
  const layer = d3.select("#layerSelect").property("value");
  const head = d3.select("#headSelect").property("value");
  const attention = data[layer][head];

  const svg = d3.select("#attentionMap");
  svg.selectAll("*").remove();

  const tokens = attention.tokens;
  const matrix = attention.matrix;

  svg.selectAll(".rowLabel")
    .data(tokens)
    .enter().append("text")
    .attr("x", 0)
    .attr("y", (_, i) => i * cellSize + cellSize)
    .text(d => d);

  svg.selectAll(".colLabel")
    .data(tokens)
    .enter().append("text")
    .attr("x", (_, i) => i * cellSize + cellSize)
    .attr("y", 15)
    .text(d => d);

  svg.selectAll("rect")
    .data(matrix.flatMap((row, i) => row.map((val, j) => ({ x: j, y: i, val }))))
    .enter().append("rect")
    .attr("x", d => d.x * cellSize + cellSize)
    .attr("y", d => d.y * cellSize + cellSize)
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", d => d3.interpolateBlues(d.val))
    .append("title")
    .text(d => `Attention: ${d.val.toFixed(2)}`);
}