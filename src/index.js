const width = 800,
  height = 500,
  padding = 50;

const svgContainer = d3
  .select(".visHolder")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const legend = d3.select(".visHolder").append("div").attr("id", "legend");
const tooltip = d3.select(".visHolder").append("div").attr("id", "tooltip");

const timeFormat = d3.timeFormat("%M:%S");

const dotColor = (Nationality) => {
  switch (Nationality) {
    case "ITA":
      return "var(--ITA)";
    case "USA":
      return "var(--USA)";
    case "ESP":
      return "var(--ESP)";
    case "FRA":
      return "var(--FRA)";
    case "GER":
      return "var(--GER)";
    case "COL":
      return "var(--COL)";
    case "DEN":
      return "var(--DEN)";
    case "RUS":
      return "var(--RUS)";
    case "SUI":
      return "var(--SUI)";
    case "POR":
      return "var(--POR)";
    default:
      return "black";
  }
};

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((dataset) => {
    const parsedTime = dataset.map((d) => d.Time.split(":"));
    const timeArray = parsedTime.map(
      (d) => new Date(1970, 0, 1, 0, d[0], d[1])
    );
    const yearArray = dataset.map((d) => d.Year);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(timeArray), d3.max(timeArray)])
      .range([padding, height - padding]);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(yearArray) - 1, d3.max(yearArray) + 1])
      .range([padding, width - padding]);

    svgContainer
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(yearArray[i]))
      .attr("cy", (d, i) => yScale(timeArray[i]))
      .attr("r", (d) => 5)
      .attr("class", "dot")
      .attr("data-xvalue", (d, i) => yearArray[i])
      .attr("data-yvalue", (d, i) => timeArray[i])
      .style("fill", (d, i) => dotColor(d.Nationality))
      .style("stroke", "blue");

    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svgContainer
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);

    svgContainer
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

    legend;
  });
