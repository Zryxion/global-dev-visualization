let size = 200;
const padding = 50;
let selectedColumn,selectedCont,parsedData;
function crossCol(col1, col2) {
  var cross = [];
  col1.forEach((a,i) => {
    col2.forEach((b,j) => {
      cross.push({x: a, i: i, y: b, j: j});
      });
  });
  return cross;
}

// function mapColor(d){
//   switch(d){
//     case 'Asia': return '#FF7E7E';
//     case 'Africa': return '#98CE79';
//     case 'Europe': return '#7FAFF5';
//     case 'North America': return '#B7A998';
//     case 'South America': return '#FFEB7F';
//     case 'Oceania': return '#FFD58C';
//   }
// }

function render(data, columns) {
  const n = columns.length;
  const marginB = 4;
  size = 800/n;
  let xOuter = d3.scaleLinear()
      .range([padding / 2, size - padding / 2]).nice();
  let yOuter = d3.scaleLinear()
      .range([size - padding / 2, padding / 2]).nice();

  let xAxis = d3.axisBottom(xOuter).ticks(6);
  let yAxis = d3.axisLeft(yOuter).ticks(6);
  const svg = d3.select("#svgScatter")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding + marginB);
  
  const height = +svg.attr('height');
  const width = +svg.attr('width');
  
  xAxis.tickSize(-size * n + padding * 0.75);
  yAxis.tickSize(-size * n + padding * 0.75);

  let colDomain = {};
  columns.forEach(function(column) {
    colDomain[column] = d3.extent(data,d => d[column]);
  });
  
  const g = svg
    .append('g')
    .attr('transform',`translate(${padding},${-20})`);
  
  g.selectAll(".xAxis")
        .data(columns)
        .enter().append("g")
          .attr("class", "xAxis")
          .attr("transform", function(d, i) { 
            return `translate(${(n - i - 1) * size - padding/2 }, ${height - marginB - padding})`; 
          })
          .each(function(d) {
            xOuter.domain(colDomain[d]); 
            d3.select(this).call(xAxis); 
          });

  g.selectAll(".yAxis")
        .data(columns)
        .enter().append("g")
          .attr("class", "yAxis")
          .attr("transform", function(d, i) { 
            return `translate(0,${i * size + padding/2})`; 
          })
          .each(function(d) {
            yOuter.domain(colDomain[d]); 
            d3.select(this).call(yAxis); 
          });
  g.selectAll(".xAxis").selectAll(".tick text").remove();
  g.selectAll(".yAxis").selectAll(".tick text").remove();
  let boxPlot = g.selectAll(".plot").data(crossCol(columns, columns))
      .enter().append("g")
      .attr("class", "plot")
      .attr("id", d => `L${selectedColumn.indexOf(d.x)}-${selectedColumn.indexOf(d.y)}`)
      .attr("transform", function(d) { 
        return `translate(${(n - d.i - 1) * size},${d.j * size})`; 
      })
      .each(d => plot(d,data));
  
  boxPlot.call(brush,colDomain);

  boxPlot.each(function(d) {
      if(d.i === d.j){
      const plotG = d3.select(this);
      plotG.append("text")
          .text(d.x)
          .attr('class', 'label')
          .attr("transform", function(d) { 
            return `translate(${size/2 - padding},${padding*1.5 - 13})`; 
          });
      }
  });

  svg.selectAll('.tick').select('text').text(function(d){
    let hun = this.textContent.length-4;
    let mil = this.textContent.length-8;
    let bil = this.textContent.length-12;
    let til = this.textContent.length-16;
    let text = this.textContent;
    if(text[til] == ","){
      return text.slice(0,til) + 'T';
    }
    if(text[bil] == ","){
      return text.slice(0,bil) + 'B';
    }
    if(text[mil] == ","){
      return text.slice(0,mil) + 'M';
    }
    if(text[hun] == ","){
      return text.slice(0,hun) + 'K';
    }
    return text;
  });

  d3.selectAll("#Features").selectAll("input").on("change", function() {
      
    if(selectedColumn.includes(this.id)){
      selectedColumn = selectedColumn.filter(d => d != this.id);
      d3.select('#svgScatter').selectAll("*").remove();
      render(data,selectedColumn);
    }
    else {
      selectedColumn.push(this.id);
      d3.select('#svgScatter').selectAll("*").remove();
      render(data,selectedColumn);
    }
  });

  d3.selectAll("#Continent").selectAll("input").on("change", function() {
      
    if(selectedCont.includes(this.id)){
      selectedCont = selectedCont.filter(d => d != this.id);
      d3.select('#svgScatter').selectAll("*").remove();
    }
    else {
      selectedCont.push(this.id);
      d3.select('#svgScatter').selectAll("*").remove();
    }

    let datafiltered = parsedData.filter(d => {
      let included = false;
      selectedCont.forEach(c => {
        if(d.Continent == c)included = true;
      })
      return included;
    })
    render(datafiltered,selectedColumn);
  });
  // const labelG = svg
  // .append('g')
  // .style('font-size','1.5em')
  // .attr('transform',`translate(${0},${height - marginB/2 - 5})`);

  // labelG.append('text').text("Iris-setosa")
  //   .attr('fill','#E3BA22')
  //   .attr('transform',`translate(${size - padding/2},${0})`);
  
  // labelG.append('text').text("Iris-versicolor")
  //   .attr('fill','#E6842A')
  //   .attr('transform',`translate(${size*2 - padding/2},${0})`);
  
  // labelG.append('text').text("Iris-virginica")
  //   .attr('fill','#137B80')
  //   .attr('transform',`translate(${size*3 - padding/2},${0})`);
}

function plot(p,data) {
  let plotG = d3.select(`#L${selectedColumn.indexOf(p.x)}-${selectedColumn.indexOf(p.y)}`);
  
  if(p.x!=p.y){
      let xPlot = d3.scaleLinear()
        .domain(d3.extent(data,d => d[p.x]))
        .range([0, size - padding]);
      let yPlot = d3.scaleLinear()
        .domain(d3.extent(data,d => d[p.y]))
        .range([size,padding]);
      
      let xAxis = d3.axisBottom(xPlot).ticks(6);
      let yAxis = d3.axisLeft(yPlot).ticks(6);
      
      plotG.append("g").call(xAxis).attr('transform',`translate(${0},${size})`);
      plotG.append("g").call(yAxis);
    
      plotG.selectAll("circle").data(data)
        .enter().append("circle")
        .transition()
        .duration(1000)
          .attr("cx", d => xPlot(d[p.x]))
          .attr("cy", d => yPlot(d[p.y]))
          .attr("r", 4)
          .style("fill", d => myColor(d.Continent));
  }
  else {
      let xPlot = d3.scaleLinear()
        .domain(d3.extent(data,d => d[p.x]))
        .range([0, size - padding]);
      let histogram = d3.histogram()
          .value(d => d[p.x])
          .domain(xPlot.domain())
          .thresholds(xPlot.ticks(15));
      let bins = histogram(data);
      let yPlot = d3.scaleLinear()
        .domain([0, d3.max(bins,d => d.length)])
        .range([size, padding]);
      let xAxis = d3.axisBottom(xPlot).ticks(6);
      let yAxis = d3.axisLeft(yPlot).ticks(6);
      plotG.append("g").call(xAxis).attr('transform',`translate(${0},${size})`);
      plotG.append("g").call(yAxis);
      plotG.append('g')
          .selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
            .attr("transform", d => `translate(${xPlot(d.x0)},${yPlot(d.length)})`)
            .attr("width", d => xPlot(d.x1) - xPlot(d.x0))
            .attr("height", d => size  - yPlot(d.length))
            .style("fill", "#C1BAA9")
            .style("stroke", "white")
            .style("stroke-width", "0.5");
      
              
  }
  plotG.append("rect")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("y", padding)
      .attr("width", size - padding)
      .attr("height", size - padding);
}
function brush(plots, colDomain){
  let brush = d3.brush()
    .on("start", brushstart)
    .on("brush", brushing)
    .on("end", brushend)
    .extent([[0,padding],[size - padding,size]]);
  
  var brushCell;
  plots.call(brush);

  function brushstart(selected,p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.move, null);
      brushCell = this;
      console.log(brushCell);
    }

  }

    function brushing(sel,p) {
      var e = d3.brushSelection(this);
      
      let x = d3.scaleLinear()
        .domain(colDomain[p.x])
        .range([0, size - padding]).nice();
      let y = d3.scaleLinear()
        .domain(colDomain[p.y])
        .range([size,padding]).nice();
      
      d3.select("#svgScatter").selectAll("circle").classed("hidden", function(d) {
        if(!e){
          return false;
        }
        else if(p.x==p.y){
            return false;
          }
        else {
          if (
          e[0][0] > x(d[p.x]) || x(d[p.x]) > e[1][0]
          || e[0][1] > y(d[p.y]) || y(d[p.y]) > e[1][1]
          ){
            return true;
          } 
          return false;
        }
      });
    }

  function brushend() {
    var e = d3.brushSelection(this);
    if (e === null) d3.select("svg").selectAll(".hidden").classed("hidden", false);
  }
  
  return
}
var numCol = []
d3.csv('data.csv').then((data) => {
  var cont = [];
  const columns = data.columns;

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

    if(!cont.includes(d['Continent']))cont.push(d['Continent']);
  });
  console.log(data);
  columns.forEach(c => {
    if(typeof data[1][c] == "number")numCol.push(c);
  });

  const featMenu = d3.select('#Features').select('#inputBox');
  selectedColumn = numCol.slice(0, 3);

  featMenu.selectAll("input").data(numCol)
    .enter()
    .append('input')
      .attr('type','checkbox')
      .attr('id',d => {return d})

  featMenu.selectAll("input").filter(d => {return selectedColumn.includes(d)}).attr('checked',true);

  const textMenu = d3.select('#Features').select('#textBox');
  textMenu.selectAll("text").data(numCol)
    .enter()
    .append('text')
    .attr('class', 'label')
    .text(d => {return d});

  const featMenu2 = d3.select('#Continent').select('#inputBox');

  featMenu2.selectAll("input").data(cont)
    .enter()
    .append('input')
      .attr('type','checkbox')
      .attr('id',d => {return d})
      .attr('checked',true)

  const textMenu2 = d3.select('#Continent').select('#textBox');
  textMenu2.selectAll("text").data(cont)
    .enter()
    .append('text')
    .attr('class','label')
    .style('color', d => {return myColor(d)})
    .text(d => {return d});

  selectedCont = cont;
  parsedData = data;
  // console.log(data.columns);
  // const columns = data.columns.slice(0, 4);
  // data = data.filter(
  //   (d) => d['sepal length'] != 0
  // );

  render(data, selectedColumn);
});
