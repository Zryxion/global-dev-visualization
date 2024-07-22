// set the dimensions and margins of the graph
const marginBub = {
  top: 70,
  right: 100,
  bottom: 180,
  left: 80,
},
widthB = 1200 - marginBub.left - marginBub.right,
heightB = 600 - marginBub.top - marginBub.bottom;
const divBub = d3.select('.bubbleChart')
// append the svgB object to the body of the page
const svgB = d3
.select('#bubble_chart')
.append('svg')
.attr('width', widthB + marginBub.left + marginBub.right)
.attr('height', heightB + marginBub.top + marginBub.bottom)
.append('g')
.attr(
  'transform',
  `translate(${marginBub.left},${marginBub.top})`,
);

let originalData, dataB;
let xColumn = 'GDP';
let yColumn = 'Life expectancy';

// drop-down list clicked
const onXColumnClicked = column => {
  xColumn = column;
  console.log(xColumn);
  svgB.selectAll("*").remove();
  renderBub();
};

const onYColumnClicked = column => {
  yColumn = column;
  svgB.selectAll("*").remove();
  renderBub();
};

// add a scale for bubble color
const myColor = d3
.scaleOrdinal()
.domain([
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Africa',
])
.range(d3.schemeSet1);

// renderBub
const renderBub = () => {
  console.log(originalData);
    // drop-down list
    divBub.select('#x-axisMenu')
      .call(dropDownMenu, {
      options: numCol,
      onOptionClicked: onXColumnClicked,
      selectedOption: xColumn
      });

      divBub.select('#y-axisMenu')
      .call(dropDownMenu, {
      options: numCol,
      onOptionClicked: onYColumnClicked,
      selectedOption: yColumn
      }); 

    // add x axis
    const x = d3
    .scaleLinear()
    .domain(d3.extent(dataB, d => d[xColumn]))
    .range([0, widthB]);

    // visualize x axis
    svgB
    .append('g')
    .attr('transform', `translate(0, ${heightB})`)
    .call(d3.axisBottom(x));

    // add x axis label
    svgB
    .append('text')
    .attr('class', 'x label')
    .attr('text-anchor', 'middle')
    .attr('x', widthB / 2)
    .attr('y', heightB + 50)
    .style('font-size', '20px')
    .text(xColumn);

    // add y axis
    const y = d3
    .scaleLinear()
    .domain(d3.extent(dataB, d => d[yColumn])) // life expectancy [drop-down]
    .range([heightB, 0]);

    // visualize y axis
    svgB.append('g').call(d3.axisLeft(y));

    // add y axis label
    svgB
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', -heightB / 2)
    .attr('y', -45)
    .text(yColumn)
    .style('font-size', '20px')
    .attr('transform', 'rotate(-90)');

    // add a scale for bubble size
    const z = d3
    .scaleLinear()
    .domain([0, d3.max(dataB.map(d => d['Population']))]) // population size
    .range([0,100]);

    // add bubbles
    svgB
    .append('g')
    .selectAll('dot')
    .data(dataB)
    .join('circle')
    .transition()
    .duration(1000)
    .attr('class', 'bubbles')
    .attr('cx', (d) => x(d[xColumn])) // x-axis: GDP
    .attr('cy', (d) => y(d[yColumn])) // y-axis: Life expectancy
    .attr('r', (d) => z(d['Population']))
    .style('fill', (d) => myColor(d['Continent']))
    .style('opacity', '0.6');

    // bubble color legend
    const size = 20;
    const newgroups = [
    'Asia',
    'Europe',
    'North America',
    'South America',
    'Oceania',
    'Africa',
    ];
    const myLabelColor = d3
    .scaleOrdinal()
    .domain([
      'Asia',
      'Europe',
      'North America',
      'South America',
      'Oceania',
      'Africa',
    ])
    .range(d3.schemeSet1);

    // add colored dots for legend
    svgB
    .selectAll('myrect')
    .data(newgroups)
    .join('circle')
    .attr('cx', 920)
    .attr('cy', (d, i) => 200 + i * (size + 7))
    .attr('r', 7)
    .style('fill', (d) => myLabelColor(d))
    .style('opacity', '0.6');

    // add labels beside colored dots
    svgB
    .selectAll('mylabels')
    .data(newgroups)
    .enter()
    .append('text')
    .attr('x', 950)
    .attr('y', (d, i) => 200 + i * (size + 7))
    .style('fill', (d) => myLabelColor(d))
    .text((d) => d)
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle');

    //color legend title
    svgB
    .append('text')
    .attr('x', 950)
    .attr('y', 180)
    .text('Continents:')
    .style('font-size', 18)
    .attr('text-anchor', 'middle');

    let temp = document.querySelector('#bubble_chart')
    d3.select('#menus')
      .style('left',`${temp.offsetLeft + 250}px`)
      .style('top',`${temp.offsetTop - 30}px`)

    svgB.selectAll(".tick").select('text').each(function(d){
      // if(this.text){
      let temp = this.textContent;
      if(temp[temp.length-16]==','){
        this.textContent = temp.slice(0,(temp.length-16)) + 'T';
      }       
      // }
    })

    // tooltip
    let tooltipb = d3.select('.bubbleChart').select(".tooltip");
    console.log(svgB.selectAll('circle'))
    svgB.selectAll('circle').filter(function(d,i){return((typeof this.__data__) != "string")})
      .on('mousemove',function(e){
        console.log(e)
        var d = this.__data__
        tooltipb
        .style('left',`${x(d[xColumn])+temp.offsetLeft}px `)
        .style('top',`${y(d[yColumn])+temp.offsetTop-70}px`)
        .style('visibility','visible');
        tooltipb.html(`
        <text><b>${this.__data__['Country']}</b> (${this.__data__['Continent']})</text><br><br>
        ${xColumn}: ${this.__data__[xColumn]} <br>
        ${yColumn}: ${this.__data__[yColumn]} <br>`) 
        ;
      })
      .on('mouseout', function(e){
        tooltipb
          .style('visibility','hidden');      
      })
};

// load and read the dataB
d3.csv('data.csv').then((loadedData) => {
  originalData = JSON.parse(JSON.stringify(loadedData));
  
  // parse dataB
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
  dataB = loadedData;
  renderBub();
});