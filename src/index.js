const width = 800,
  height = 500,
  padding = 50;

const svgContainer = d3
  .select(".visHolder")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select(".visHolder").append("div").attr("id", "tooltip");

const timeFormat = d3.timeFormat("%M:%S");

const strokeColor = (toggle) => {
  if (toggle) {
    return "3";
  } else {
    return "1";
  }
};

const countries = [
  ["WHITE", "No Doping Allegations"],
  ["WHITE", "Doping Allegations"],
  ["ITA", "Italy"],
  ["USA", "United States of America"],
  ["ESP", "Spain"],
  ["FRA", "France"],
  ["GER", "Germany"],
  ["COL", "Colombia"],
  ["DEN", "Denmark"],
  ["RUS", "Russia"],
  ["SUI", "Switzerland"],
  ["POR", "Portugal"],
  ["UKR", "Urkaine"],
];

const legendStroke = (text) => {
  if (text === "No Doping Allegations") {
    return "var(--mainDark)";
  } else if (text === "Doping Allegations") {
    return "var(--mainDark)";
  } else {
    return "none";
  }
};

const legendStrokeWidth = (text) => {
  if (text === "No Doping Allegations") {
    return 3;
  } else if (text === "Doping Allegations") {
    return 1;
  } else {
    return "none";
  }
};

const dotColor = (Nationality) => {
  return "var(--" + Nationality + ")";
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
      .style("stroke", "var(--mainDark)")
      .style("stroke-width", (d, i) => strokeColor(d.Doping === ""));

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

    const legendContainer = svgContainer.append("g").attr("id", "legend");

    const legend = legendContainer
      .selectAll(".legend")
      .data(countries)
      .enter()
      .append("g")
      .attr("class", "legendEntries");

    legend
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("y", (d, i) => height / 6 + i * 20)
      .attr("x", width - 200)
      .style("fill", (d) => "var(--" + d[0] + ")")
      .style("stroke", (d) => legendStroke(d[1]))
      .style("stroke-width", (d) => legendStrokeWidth(d[1]));

    legend
      .append("text")
      .attr("x", width - 180)
      .attr("y", (d, i) => height / 6 + i * 20)
      .attr("dy", ".75em")
      .text((d) => d[1])
      .style("font-size", "10px");

    legend
      .append("text")
      .attr("id", "legendTitle")
      .attr("x", width - 200)
      .attr("y", height / 6 - 20)
      .text("Legend");
  });
