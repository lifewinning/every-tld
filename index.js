//very much indebted to http://bl.ocks.org/syntagmatic/3543186 for the spiral path-making tricks

var width = window.innerWidth,
height = window.innerHeight
start = 0
end = 39;
var theta = function(r) {
  return -2*Math.PI*r;
};

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

d3.json('tlds-by-year-with-cc.json', function(data){
selected = []
types = ["infrastructure","country-code", "sponsored", "generic","test"]

var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var radius = d3.scale.linear()
  .domain([start, end])
  .range([0, height*.75]);

nav = d3.select("#nav")

info = nav.append('div')
.attr('id','about')
.html('<h1>Every Top Level Domain</h1>')

dates = nav.append('div')
.attr('id','dates')
.html('<h1>Filter By Year</h1>')
// .append('li').html('All Years').on('click',function(){ makeSpiral() })

dates.selectAll('li')
.data(Object.keys(data))
.enter().append('li').attr('id',function(d){return 'date'+d})
.append('a')
  .style('color',function(key){ return color(key*.1)})
  .html(function(key){return key+" "})
  .on('click',function(key){
      filterSpiral('date',key)
    })

dates.append('li').html('All Years').on('click', function(){allYears()})

categories = nav.append('div').attr('id','types').html('<h1>Filter By Type</h1>')
.selectAll('li')
.data(types)
.enter().append('li').attr('id', function(d){return d})
.html(function(t){return t+" "})
.on('click',function(t){
  if ( t != "generic"){
    filterSpiral('type',t)
  } else {
    filterSpiral('generic',t)
  }
})

list = d3.select('#flex').append('div').attr('id','list').style('display','none')

hover = d3.select("#flex").append("div")
.attr("class", "hover")
.style("display","none")

//detect mobile, eventually

var svg = d3.select("#flex").append("svg")
    .attr("width", width).attr("height", height*1.75)
    .append("g")
    .attr('id','omg')
    .attr("transform", "translate(" + width/2 + "," + ((height*1.75)/2) +")")

unravel = nav.append('div').attr('id','viewunravel')
unravelh1 = unravel.append('h1').html('View As List')
.on('click',function(){
  var svgactive = svg.active ? false : true
  var seelist = svgactive ? null: 'none'
  var svgdisplay = svgactive ?  0 : 1
  var option = svgactive ? 'View as Spiral' : 'View As List'
  d3.select('.hover').style('display','none')
  d3.select('#omg').transition().attr('width',width).attr('height',height)  
  unravelh1.html(option)
  d3.select('svg').style('opacity',svgdisplay) 
  list.style('display',seelist)
  svg.active = svgactive
})

if (isChrome || isSafari){
  webkith1 = unravel.append('h1').html("What's Up With The Broken Arabic?")
  .on('click', function(){
    hov = d3.select('.hover').style('display',null).style('text-align','left').style('width',null).html('')
    hov.append('h1').style('margin','15px') 
    .html("You may have noticed that the Arabic characters in the spiral display are broken. This is because deep within the Webkit SVG rendering engine, someone made the decision to make text on a path do something really fucking stupid that makes calligraphic languages break. This is a documented problem that other people have run into before. No one is going to fix it because Webkit is a gnarly code monster and not enough people who deal with non-English languages care enough to bother to make this extremely small thing work. Viewing this in Firefox is slower, but the Arabic renders correctly there. Sorry!")
    hov.append('h2').style('margin','15px').style('background-color','cyan').html('Close this message').on('click', function(){
      hov.html('').style('display','none').style('width','100%').style('text-align','center')
    })
  })
}

function makeList(){
  list.html('')
  list.selectAll('div')
  .data(selected).enter()
  .append('div')
  .html(function(s){return "<h3>"+s.name+"</h3>"})
  .style('color', function(s){ 
    y = s.registered.split('-')
    return color(y[0]*.1)})
   .on("click", function(s){
    h3 = d3.selectAll('h3').style('opacity',.5)
    d3.select(this).select('h3').style('opacity', 1)
    div = d3.select('#'+s.name.replace('.',''))
    hide = d3.selectAll('.listspan').style('display','none')
    console.log(div)
    div.style("display", null)
  })
  .append('div').attr('class','listspan').attr('id', function(s){return s.name.replace('.','')}).style('display','none')
  .html(function(s){ 
    if (!s.country_name){
     return "Registered on: "+s.registered+"<br>Sponsored by: "+s.spons+"<br>Type: "+s.type+"<br>More Information at <a href="+s.iana_url+">IANA</a>";
    } else {
      return "Registered on: "+s.registered+"<br>Sponsored by: "+s.spons+"<br>Type: "+s.type+" ("+s.country_name+")<br>More Information at <a href="+s.iana_url+">IANA</a>"
    }
  })
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
.attr("startOffset", ".08%")
.style("text-anchor","start")
.attr("id","textpath") 
// .attr('textLength', function(){
//     p = document.querySelector('.spiral').getTotalLength()
//     return p;
// })
}

function pushkeys(key,d){
  text.append('tspan')
  .attr('class','arc-text')
  .style('fill', color(key*.1))
  .text(d.name+" ")
  // .on("mouseover", function(){
  //   d3.select(this).style("fill", "orange")
  // })
  .on("click", function(){
    // d3.select(this).style('fill','orange')
    hover.style("display", null).style('width','100%').style('text-align','center')
    if (!d.country_name){
    hover.html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p><p>More Information at <a href="+d.iana_url+">IANA</a>")
    } else {
    hover.html("<h2>"+d.name+"</h2><p>("+d.country_name+")</p><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p><p>More Information at <a href="+d.iana_url+">IANA entry</a>") 
    }
    d3.select('svg').style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
  });
  // .on("mouseout", function(){
  //   d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
    // hover.style("display","none")
  // }; 
  selected.push(d)  
}

function allYears(){
selected = []
text = d3.select('textPath')
text.html('')
.attr('textLength', function(){ 
  p = d3.select('path')
  return p.node().getTotalLength()
})
alsotext = d3.select('text')
.attr('textLength', function(){ 
  p = d3.select('path')
  return p.node().getTotalLength()
})
d3.select('.hover').style('display','none')
d3.select('svg').transition().attr("width", width).attr("height", height*1.85).style('padding-bottom',null)
d3.select('g').transition().attr("transform", "translate(" + width/2 + "," + ((height*1.85)/2) +")")
Object.keys(data).forEach(function(key){
  data[key].forEach(function(d){
    pushkeys(key,d)
  })
})
makeList()     
}

makeSpiral()
allYears()

if (width < 481){
  hidesvg = d3.select('svg').style('display','none')
  hidediv = d3.select('#viewunravel').style('display','none')
  list.style('display',null)
}

function filterSpiral(method,d){
  selected = []
  hover.style('display','none')
  svg = d3.select('svg').style('padding-bottom',null)
  text = d3.select('textPath') 
  text.html('')
  .attr('textLength',null)
  alsotext = d3.select('text')
  .attr('textLength', null)
  if (method == "date"){
    window.location.hash = method+"-"+d
    Object.keys(data).forEach(function(key){
    if (key == d){
      data[key].forEach(function(k){
      pushkeys(key,k)
    })
    }
  })
  }
  if (method == "type"){
   window.location.hash = method+"-"+d
    Object.keys(data).forEach(function(key){
     data[key].forEach(function(k){
      if (k.type == d){
      pushkeys(key,k)
      } 
    })
  })
  }
  if (method == "generic"){
  window.location.hash = 'type-generic'
  // .attr('textLength', function(){ 
  // p = d3.select('path')
  // return p.node().getTotalLength()
  // })
  d3.select('svg').transition().attr('height', height * 1.5).attr('width',width)
  Object.keys(data).forEach(function(key){
     data[key].forEach(function(d){
      if (d.type == "generic"){
        pushkeys(key,d)
      }})})}
  pathw = document.querySelector('text').getBBox().width + 15
  pathh = document.querySelector('text').getBBox().height +15
  d3.select('svg').transition().attr('width', pathw).attr('height', pathh)
  d3.select('g').attr('transform','translate('+pathw/2+','+pathh/2+')')
  makeList() 
}
});
