// set the dimensions and margins of the graph
const marginC = {
    top: 0,
    right: 350,
    bottom: 100,
    left: 0,
  },
  widthC = 1500 - marginC.left - marginC.right,
  heightC = 800 - marginC.top - marginC.bottom;
  const choroDiv = d3.select('.choropleth')
  // append the svgC object to the body of the page
  const svgC = choroDiv
  .select('#cloSvg')
  .append('svg')
  .attr('width', widthC + marginC.left + marginC.right)
  .attr('height', heightC + marginC.top + marginC.bottom)
  .append('g')
  .attr(
    'transform',
    `translate(${marginC.left},${marginC.top})`,
  );
  
  let dataC;
  let xColumnC = 'GDP';
  
  // drop-down list clicked
  const onXColumnClickedC = column => {
    xColumnC = column;
    console.log(xColumnC);
    svgC.selectAll("*").remove();
    Choropleth(geoDat);
  };
  
  // graph title
  svgC
  .append('text')
  .attr('x', widthC / 2)
  .attr('y', -90)
  .attr('text-anchor', 'middle')
  .text('Global Country Information Choropleth')
  .style('font-size', '25px');
  

const projection = d3.geoNaturalEarth1();
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();
let geoDat;
  // render
  const Choropleth = (geoDat) => {    
      // drop-down list
      choroDiv.select('#x-axisMenuC')
        .call(dropDownMenu, {
        options: numCol,
        onOptionClicked: onXColumnClickedC,
        selectedOption: xColumnC
        });

        console.log(geoDat.features)
        function valuePerCountry(country) {
            let value = 'No Data';
            if(country.name == 'Antarctica')return value;
            dataC.forEach((d) => {
              if ((d.Country == country.name)){
                value = d[xColumnC];
              }
            });
            return value;
          }
        var colorScale = d3.scaleLinear()
        .domain(d3.extent(dataC, d=>d[xColumnC]))
        .range(['#fff33b', '#e93e3a']);

        const mapGroup = svgC
        .append('g')
        .attr('transform', `translate(20, 70) scale(${1.3})`)

      mapGroup
        .selectAll('path.graticule')
        .data([null])
        .join('path')
        .attr('d', path(graticule()))
        .attr('fill', 'none')
        .attr('stroke', '#BBB')
        .attr('stroke-width', 0.5);

      mapGroup
        .selectAll('path.outline')
        .data([null])
        .join('path')
        .attr('d', path(graticule.outline()))
        .attr('fill', '#c0b8b8')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

      let tooltip = choroDiv.select(".tooltip");

      mapGroup
        .selectAll('path.country')
        .data(geoDat.features)
        .join('path')
        .attr('d', path)
        .attr('stroke', 'black')
        .attr('fill', (d) => {
          var temp =valuePerCountry(d.properties);
          if(!isNaN(temp))
          return colorScale(temp)
          else return '#ebe1d2'})

        .attr('stroke-width', 0.5)
        .on('mouseover', function (e, d) {
          let count = valuePerCountry(d.properties);
          if (count != 'No Data') {
            count = count ;
          }
          tooltip
            .html(`${d.properties.name}: ${count}`)
            .style('visibility', 'visible');
        })
        .on('mousemove', function () {
          tooltip
            .style('top', event.pageY - 10 + 'px')
            .style('left', event.pageX + 10 + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('visibility', 'hidden');
        });

        let ColorPS = d3.scaleLinear()
        .range([heightC - marginC.bottom/2, marginC.top ])
        .domain(d3.extent(dataC, d=>d[xColumnC]));

        let ColorPStext = d3.axisRight()
        .scale(ColorPS)
        .tickPadding(8);

        let ColorPG = svgC.append("g")
        .call(ColorPStext)
        .attr("transform", "translate(" + 1320 + " ,"+70+")");
      ColorPG.selectAll(".tick line").remove();

        let ma = d3.max(dataC,d => d[xColumnC]);
        let mi = d3.min(dataC,d => d[xColumnC]);
        console.log(ma,mi)
        let ColorIr = d3.range(mi,ma,(ma-mi)/100);

        let h = 700 / ColorIr.length;
        ColorIr.forEach(function(d){
            ColorPG.append('rect')
              .style('fill',colorScale(d))
              .style('stroke-width', 0)
              .style('stroke', 'none')
              .attr('height', h)
              .attr('width', 10)
              .attr('x', 0)
              .attr('y', ColorPS(d))
          });
  };
  
  // load and read the dataC
  d3.csv('data.csv').then((loadedData) => {
    // parse dataC
    const columns = loadedData.columns;
    loadedData.forEach((d) => {
      columns.forEach((col) => {
        if (col == 'Continent') d[col] = d[col].slice(1);
        if (col == 'Latitude' || col == 'Longitude') {
          var temp = d[col].split('.');
          d[col] = temp[0] + '.' + temp[1] + temp[2];
          return;
        }
  
        d[col] = d[col].replaceAll(',', '');
  
        if (d[col] == '') d[col] = '0';
        if (!isNaN(+d[col])) {
          d[col] = +d[col];
        } else if (d[col].includes('%')) {
          d[col] = +d[col].slice(0, -1);
        } else if (d[col].includes('\u0024')) {
          d[col] = +d[col].slice(1, -1);
        }
      });
    });
    dataC = loadedData;
    fetch('https://unpkg.com/visionscarto-world-atlas@0.1.0/world/50m.json')
    .then((response) => response.json())
    .then((topoJSONData) => {
        geoDat = topojson.feature(
        topoJSONData,
        'countries',
      );
      Choropleth(geoDat);
    });
  });