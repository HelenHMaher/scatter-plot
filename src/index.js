const width = 700,
  height = 400,
  inPadding = 75,
  outPadding = 25;

const svgContainer = d3
  .select(".visHolder")
  .append("svg")
  .attr("width", width + inPadding + outPadding)
  .attr("height", height + inPadding + outPadding);
