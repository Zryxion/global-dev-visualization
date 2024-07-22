let data;
const div = d3.select('.barPlot');
const svg = d3.select('.barPlot').select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('data.csv').then((loadedData) => {
  data = loadedData;
  const columns = data.columns;
  var regions = [];
  data.forEach((d) => {
    columns.forEach((col) => {
      if(col == 'Continent')d[col] = d[col].slice(1)
      if((col =='Latitude') || (col == 'Longitude')){
        var temp = d[col].split('.');
        d[col] = temp[0]+'.'+temp[1]+temp[2];
        return;
      }

      d[col] = d[col].replaceAll(',','')

      if(d[col] == "")d[col] = "0";
      if(!isNaN(+d[col])){
        d[col] = +d[col];
      } 
      else if(d[col].includes('%')){
        d[col] = +(d[col].slice(0,-1));
      }
      else if(d[col].includes('$')){
        d[col] = +(d[col].slice(1,-1));
      }
    })

    if(!regions.includes(d['Continent']))regions.push(d['Continent']);
  });

    div.select("#regionDropdown")
      .selectAll("option")
      .data(regions)
      .enter()
      .append("option")
      .text(function(d) { return d; });

    var values = ["Population", "Agricultural Land( %)", "Land Area(Km2)", "Armed Forces size", "Birth Rate", "Co2-Emissions", "CPI", "Fertility Rate", "Forested Area (%)", "Gross primary education enrollment (%)", "Gross tertiary education enrollment (%)","Gasoline Price", "GDP", "Infant mortality", "Life expectancy", "Maternal mortality ratio", "Out of pocket health expenditure", "Physicians per thousand", "Population: Labor force participation (%)", "Tax revenue (%)", "Total tax rate", "Unemployment rate", "Urban_population" ];
    div.select("#valueDropdown")
      .selectAll("option")
      .data(values)
      .enter()
      .append("option")
      .text(function(d) { return d; });
    
    // Set up initial chart
    if (data.length > 0) {
      const regions = d3.map(data, d => d.Continent);
      const values = ["Population", "Agricultural Land( %)", "Land Area(Km2)", "Armed Forces size", "Birth Rate", "Co2-Emissions", "CPI", "Fertility Rate", "Forested Area (%)", "Gross primary education enrollment (%)", "Gross tertiary education enrollment (%)", "Gasoline Price", "GDP", "Infant mortality", "Life expectancy", "Maternal mortality ratio", "Out of pocket health expenditure", "Physicians per thousand", "Population: Labor force participation (%)", "Tax revenue (%)", "Total tax rate", "Unemployment rate", "Urban_population" ];     
      updateChart(regions[0], values[0]);
    }

    // Event listeners for the dropdowns
    div.select("#regionDropdown").on("change", function(d) {
      var selectedRegion = d3.select(this).property("value");
      var selectedValue = d3.select("#valueDropdown").property("value");
      updateChart(selectedRegion, selectedValue);
    });

    div.select("#valueDropdown").on("change", function(d) {
      var selectedValue = d3.select(this).property("value");
      var selectedRegion = d3.select("#regionDropdown").property("value");
      updateChart(selectedRegion, selectedValue);
    });

    div.select('#asc').on('click', function() {
      sortDataAndUpdateChart('ascending');
    });
    
    div.select('#desc').on('click', function() {
      sortDataAndUpdateChart('descending');
    });
});

function sortDataAndUpdateChart(order) {
  const selectedRegion = div.select("#regionDropdown").property("value");
  const selectedValue = div.select("#valueDropdown").property("value");
  let sortedData = data.filter(d => d.Continent === selectedRegion);
  
  sortedData.sort((a, b) => {
    if (order === 'ascending') {
      return d3.ascending(a[selectedValue], b[selectedValue]);
    } else {
      return d3.descending(a[selectedValue], b[selectedValue]);
    }
  });
  
  updateChart(selectedRegion, selectedValue, sortedData);
}

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
var margin = {
  left: 100,
  top: 10,
  bottom: 100,
  right: 10,
};

const x = d3.scaleBand().range([margin.left, width - margin.right,]);

var xAx = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',0)');

const y = d3.scaleLinear().range([height - margin.bottom, margin.top,]);

var yAx = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',0)');

function updateChart(selectedRegion, selectedValue, sortedData = null) {
  // Filter data based on selected region
  var filteredData = sortedData ? sortedData : data.filter(function(d) {
    return d.Continent === selectedRegion;
  });

  // Update x-axis domain with countries from filtered data
  x.domain(filteredData.map((d) => d.Country));
  xAx
    .call(d3.axisBottom(x))
    .attr('transform','translate(0,' + (height - margin.bottom) + ')',)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-1em')
    .attr('dy', '-0.5em')
    .attr('transform', 'rotate(-60)');

  // Update y-axis domain based on the selected value
  y.domain([0,d3.max(filteredData, (d) => +d[selectedValue]),]);
  yAx.call(d3.axisLeft(y).tickSize(-width));

  // Update the bars
  var bars = svg.selectAll('rect').data(filteredData, function(d) { return d.Country; });

  bars
    .enter()
    .append('rect')
    .merge(bars)
    .transition()
    .duration(1000)
    .attr('fill', (d, i) => colorScale(i))
    .attr('x', (d) => x(d.Country))
    .attr('y', (d) => y(+d[selectedValue]))
    .attr('width', x.bandwidth())
    .attr('height', (d) => y(0) - y(+d[selectedValue])); // Correct height calculation

  // Remove any excess bars
  bars.exit().remove();

  // Update the scatter plot
  var circles = svg.selectAll('circle').data(filteredData);

  circles
    .enter()
    .append('circle')
    .merge(circles)
    .transition()
    .duration(500)
    .attr('r', '3')
    .style('fill', 'blue')
    .attr('stroke', 'black')
    .attr('cx', (d) => x(d.Country) + x.bandwidth() / 2)
    .attr('cy', (d) => y(+d[selectedValue]));

  // Remove any excess circles
  circles.exit().remove();
}