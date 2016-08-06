//very much indebted to http://bl.ocks.org/syntagmatic/3543186 for the spiral path-making tricks

var width = window.innerWidth,
height = window.innerHeight
start = 0
end = 33;
var theta = function(r) {
  return -2*Math.PI*r;
};

d3.json('tlds-by-year.json', function(data){

types = ["infrastructure","country-code", "sponsored", "generic"]

var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var arc = d3.svg.arc()
  .startAngle(0)
  .endAngle(2*Math.PI);

var radius = d3.scale.linear()
  .domain([start, end])
  .range([0, height*.75]);

nav = d3. select("#flex").append("div")
  .attr("id", "nav")
  .attr('class','nav')

dates = nav.append('div')
.attr('id','dates')
.html('<h1>Filter By Year</h1>')
.selectAll('li')
.data(Object.keys(data))
.enter().append('li')
  .style('color',function(key){ return color(key*.1)})
  .html(function(key){return key+" "})
  .on('click',function(key){makeSpiralbyDate(key,text)})

categories = nav.append('div').attr('id','types').html('<h1>Filter By Type</h1>')
.selectAll('li')
.data(types)
.enter().append('li')
.html(function(t){return t+" "})
.on('click',function(t){
  if ( t != "generic"){
    makeSpiralbyType(t,text)
  } else {
    genericSpiral()
  }
})

hover = d3.select("#flex").append("div")
.attr("class", "hover")
.style("display","none")

var svg = d3.select("#flex").append("svg")
    .attr("width", width)
    .attr("height", height*1.75)
    .append("g")
    .attr('id','omg')
    .attr("transform", "translate(" + width/2 + "," + ((height*1.75)/2) +")");

// function makeSpiral(start,end){

// }

var pieces = d3.range(start, end+0.001, (end-start)/5500);

var spiral = d3.svg.line.radial()
  .interpolate("cardinal")
  .angle(theta)
  .radius(radius);

svg.selectAll(".spiral")
  .data([pieces])
  .enter().append("path")
    .attr("class", "spiral")
    .attr("id","spiral")
    .attr("d", spiral)
    .attr("transform", function(d) { return "rotate(" + 90 + ")" })

var text = svg.append("text")
.append("textPath") 
.attr("xlink:href", "#spiral")
.attr("startOffset", ".1%")
.style("text-anchor","start")
.attr("id","textpath")  
.attr('textLength', function(){
      p = document.querySelector('.spiral').getTotalLength()
      return p;
        })

Object.keys(data).forEach(function(key) {
     data[key].forEach(function(d){
      text.append('tspan')
      .attr('class','arc-text')
      .style('fill', color(key*.1))
      .text(d.name+" ")
      .on("mouseover", function(){
        d3.select(this).style("fill", "orange")
      })
      .on("click", function(){
        hover.style("display", null)
        .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p>")
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      });   
    })
})     

function makeSpiralbyDate(d, text){
  text.html('')
  .attr('textLength',null)
  hover.style("display","none")
  Object.keys(data).forEach(function(key) {
  if (key == d){
     data[key].forEach(function(d){
      text.append('tspan')
      .attr('class','arc-text')
      .style('fill', color(key*.1))
      .text(d.name+" ")
      .on("mouseover", function(){
        d3.select(this).style("fill", "orange")
      })
      .on("click", function(){
        hover.style("display", null)
        .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p>")
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      });
    })
  }
})
pathw = text[0][0].getBBox().width + 15
pathh = text[0][0].getBBox().height +15

d3.select('svg').transition().attr('width', pathw).attr('height', pathh)
d3.select('g').attr('transform','translate('+pathw/2+','+pathh/2+')')

}

function makeSpiralbyType(t, text){
  text.html('')
  .attr('textLength', null)
  d3.select('svg').transition().attr('height', height)
  //d3.select('.spiral').transition().attr("transform", "translate(0," + (height * 1.5)/5 +")");
 
  hover.style("display","none")
  Object.keys(data).forEach(function(key) {
     data[key].forEach(function(d){
      if (d.type == t){
      text.append('tspan')
      .attr('class','arc-text')
      .style('fill', color(key*.1))
      .text(d.name+" ")
      .on("mouseover", function(){
        d3.select(this).style("fill", "orange")
      })
      .on("click", function(){
        hover.style("display", null)
        .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p>")
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      });
      }   
    })
})
pathw = text[0][0].getBBox().width + 15
pathh = text[0][0].getBBox().height +15

d3.select('svg').transition().attr('width', pathw).attr('height', pathh)
d3.select('g').attr('transform','translate('+pathw/2+','+pathh/2+')')

}

function genericSpiral(){
  text.html('')
  .attr('textLength', function(){
     p = document.querySelector('.spiral').getTotalLength()
    return p;
  })
  start = 0;
  end = 27;
  d3.select('svg').transition().attr('height', height * 1.5).attr('width',width)
  //d3.select('.spiral').transition().attr("transform", "translate(" +width/2+","+ (height*1.5)/2 +")");
  hover.style("display","none")
  Object.keys(data).forEach(function(key) {
     data[key].forEach(function(d){
      if (d.type == "generic"){
       text.append('tspan')
      .attr('class','arc-text')
      // .style('font-size','12px')
      .style('fill', color(key*.1))
      .text(d.name+" ")
      .on("mouseover", function(){
        d3.select(this).style("fill", "orange")
      })
      .on("click", function(){
        hover.style("display", null)
        .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p>")
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      });
      }   
    })
}) 
pathw = text[0][0].getBBox().width + 15
pathh = text[0][0].getBBox().height +15

d3.select('svg').transition().attr('width', pathw).attr('height', pathh)
d3.select('g').attr('transform','translate('+pathw/2+','+pathh/2+')')

}


});




