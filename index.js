//very much indebted to http://bl.ocks.org/syntagmatic/3543186 for the spiral path-making tricks

var width = window.innerWidth,
height = window.innerHeight
start = 0
end = 16;
var theta = function(r) {
  return -3*Math.PI*r;
};

dates =[
 [1985,1999],
 [2000,2008],
 [2009,2013],
 [2014,2014],
 [2015,2016]
]

function makeSpirals(a,b){

}
var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var arc = d3.svg.arc()
  .startAngle(0)
  .endAngle(2*Math.PI);

var radius = d3.scale.linear()
  .domain([start, end])
  .range([0, height/2-5]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + (height/2) +")");

var pieces = d3.range(start, end+0.001, (end-start)/1500);

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
    .attr("transform", function(d) { return "rotate(" + 90 + ")" });

var text = svg.append("text")
    .append("textPath") 
    .attr("xlink:href", "#spiral")
     .attr("startOffset", ".2%")
    .style("text-anchor","start")
    .attr("id","textpath")  

hover = d3.select("body").append("div")
.attr("class", "hover")
.style("display","none")

d3.json('tlds-by-year.json', function(data){
    Object.keys(data).forEach(function(key) {
        data[key].forEach(function(d){
        text.append('tspan')
        .attr('class','arc-text')
        .style('fill', color(key*.1))
        .text(d.name+" ")
        .on("mouseover", function(){
          d3.select(this).style("fill", "orange").style("font-weight",800) 
        })
        .on("click", function(){
          hover.style("display", null)
          .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p>")
        })
        .on("mouseout", function(){
          d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
          // hover.style("display","none")
        });
      })
    })
});




