//very much indebted to http://bl.ocks.org/syntagmatic/3543186 for the spiral path-making tricks

var width = window.innerWidth,
height = window.innerHeight
start = 0
end = 33;
var theta = function(r) {
  return -2*Math.PI*r;
};

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

if (isChrome || isSafari){
  console.log('broken Arabic 4 u')
}

d3.json('tlds-by-year.json', function(data){
selected = []
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

nav = d3.select("#nav")

info = nav.append('div')
.attr('id','about')
.html('<h1>Maybe you should put information about what the heck this is here, IDK')

dates = nav.append('div')
.attr('id','dates')
.html('<h1>Filter By Year</h1>')
// .append('li').html('All Years').on('click',function(){ makeSpiral() })

dates.selectAll('li')
.data(Object.keys(data))
.enter().append('li').append('a')
  .style('color',function(key){ return color(key*.1)})
  .html(function(key){return key+" "})
  .on('click',function(key){
      makeSpiralbyDate(key)
    })

dates.append('li').html('All Years').on('click', function(){allYears()})

categories = nav.append('div').attr('id','types').html('<h1>Filter By Type</h1>')
.selectAll('li')
.data(types)
.enter().append('li')
.html(function(t){return t+" "})
.on('click',function(t){
  if ( t != "generic"){
    makeSpiralbyType(t)
  } else {
    genericSpiral()
  }
})

list = d3.select('#flex').append('div').attr('id','list').style('display','none')

hover = d3.select("#flex").append("div")
.attr("class", "hover")
.style("display","none")

var svg = d3.select("#flex").append("svg")
    .attr("width", width)
    .attr("height", height*1.75)
    .append("g")
    .attr('id','omg')
    .attr("transform", "translate(" + width/2 + "," + ((height*1.75)/2) +")")

unravel = nav.append('div').attr('id','viewunravel').html('<h1>View As List</h1>')
.on('click',function(){
  var svgactive = svg.active ? false : true
  var seelist = svgactive ? null: 'none'
  var svgdisplay = svgactive ?  0 : 1
  var option = svgactive ? '<h1>View as Spiral</h1>' : '<h1>View As List</h1>'
  d3.select('.hover').style('display','none')
  d3.select('#omg').transition().attr('width',width).attr('height',height)  
  unravel.html(option)
  d3.select('svg').style('opacity',svgdisplay) 
  list.style('display',seelist)
  svg.active = svgactive
})

function makeList(){
  list.html('')
  .selectAll('h3')
  .data(selected).enter()
  .append('h3')
  .html(function(s){return s.name+" "})
  .style('color', function(s){ 
    y = s.registered.split('-')
    return color(y[0]*.1)
  })
  .on("mouseover", function(s){
    d3.select(this).style("color", "orange")
  })
  .on("click", function(s){
    hover.style("display", null)
    .html("<h2>"+s.name+"</h2><p>Registered on: "+s.registered+"</p><p>Sponsored by: "+s.spons+"</p><p>Type: "+s.type+"</p>")
  })
  .on("mouseout", function(){
    d3.select(this).style("color",function(s){
      year = s.registered.split('-')
      return color(year[0]*.1)
    })
    });
}

function makeSpiral(){
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
}

function allYears(){
selected = []
text = d3.select('textPath')
text.html('')
d3.select('.hover').style('display','none')
d3.select('svg').transition().attr("width", width).attr("height", height*1.75).style('padding-bottom',null)
d3.select('g').transition().attr("transform", "translate(" + width/2 + "," + ((height*1.75)/2) +")")

Object.keys(data).forEach(function(key) {
     data[key].forEach(function(d){
      text.append('tspan')
      .attr('class','arc-text')
      .style('fill', color(key*.1))
      .text(d.name+" ")
      .on("mouseover", function(){
        d3.select(this).style("color", "orange")
      })
      .on("click", function(){
        hover.style("display", null)
        .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p>")
        d3.select('svg').style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      }); 
      selected.push(d)  
    })
})
makeList()     
}

makeSpiral()
allYears()

function makeSpiralbyDate(d){
  selected = []
  svg = d3.select('svg').style('padding-bottom',null)
  text = d3.select('textPath') 
  text.html('')
  .attr('textLength',null)
  hover.style("display","none")
  Object.keys(data).forEach(function(key) {
  if (key == d){
     data[key].forEach(function(d){
      selected.push(d)
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
        svg.style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
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
makeList() 
}

function makeSpiralbyType(t){
  selected = []
  svg = d3.select('svg').style('padding-bottom',null)
  text = d3.select('textPath')
  text.html('')
  .attr('textLength', null)
  d3.select('svg').transition().attr('height', height)
  //d3.select('.spiral').transition().attr("transform", "translate(0," + (height * 1.5)/5 +")");
 
  hover.style("display","none")
  Object.keys(data).forEach(function(key) {
     data[key].forEach(function(d){
      if (d.type == t){
      selected.push(d)
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
        svg.style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
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
makeList() 
}

function genericSpiral(){
  selected = []
  svg = d3.select('svg').style('padding-bottom',null)
  text = d3.select('textPath')
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
      selected.push(d)
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
        svg.style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
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
makeList() 
}

});




