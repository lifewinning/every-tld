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
.html('<h1>Every Single Top-Level Domain</h1>')

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

var svg = d3.select("#flex").append("svg")
    .attr("width", width)
    .attr("height", height*1.75)
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
    hov = d3.select('.hover').style('display',null).style('text-align','left').style('width',null) .html('')
    hov.append('h1').style('margin','15px') 
    .html("You may have noticed that the Arabic characters in the spiral display are broken. This is because deep within the Webkit SVG rendering engine, someone made the decision to make text on a path do something really fucking stupid that makes calligraphic languages break. This is a documented problem that other people have run into before. No one is going to fix it because Webkit is a gnarly code monster and not enough people who deal with non-English languages care enough to bother to make this extremely small thing work. Viewing this in Firefox is slower, but the Arabic renders correctly there. Sorry!")
    hov.append('h2').style('margin','15px').html('Close this message').on('click', function(){
      hov.html('').style('display','none').style('width','100%').style('text-align','center')
    })
  })
}

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
    hover.style("display", null).style('width','100%').style('text-align','center')
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
text.html('').attr('textLength', function(){ 
  p = d3.select('path')
  return p.node().getTotalLength()
})
d3.select('.hover').style('display','none')
d3.select('svg').transition().attr("width", width).attr("height", height*1.85).style('padding-bottom',null)
d3.select('g').transition().attr("transform", "translate(" + width/2 + "," + ((height*1.85)/2) +")")
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
        hover.style("display", null).style('width','100%').style('text-align','center')
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

function filterSpiral(method,d){
  selected = []
  hover.style('display','none')
  svg = d3.select('svg').style('padding-bottom',null)
  text = d3.select('textPath') 
  text.html('')
  .attr('textLength',null)
  if (method == "date"){
    // window.location.hash = method+d
    Object.keys(data).forEach(function(key){
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
          hover.style("display", null).style('width','100%').style('text-align','center')
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
  }
  if (method == "type"){
   // window.location.hash = method+d
    Object.keys(data).forEach(function(key){
     data[key].forEach(function(k){
      if (k.type == d){
      selected.push(k)
      text.append('tspan')
      .attr('class','arc-text')
      .style('fill', color(key*.1))
      .text(k.name+" ")
      .on("mouseover", function(){
        d3.select(this).style("fill", "orange")
      })
      .on("click", function(){
        hover.style("display", null).style('width','100%').style('text-align','center')
        .html("<h2>"+k.name+"</h2><p>Registered on: "+k.registered+"</p><p>Sponsored by: "+k.spons+"</p><p>Type: "+k.type+"</p>")
        svg.style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      });
      }   
    })
  })
  }
  if (method == "generic"){
  //window.location.hash = 'generic'
  d3.select('svg').transition().attr('height', height * 1.5).attr('width',width)
  Object.keys(data).forEach(function(key){
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
        hover.style("display", null).style('width','100%').style('text-align','center')
        .html("<h2>"+d.name+"</h2><p>Registered on: "+d.registered+"</p><p>Sponsored by: "+d.spons+"</p><p>Type: "+d.type+"</p>")
        svg.style('padding-bottom',function(){ h = document.querySelector('.hover'); return h.clientHeight +'px'})
      })
      .on("mouseout", function(){
        d3.select(this).style("fill",color(key*.1)).style("font-weight",100);
        // hover.style("display","none")
      });
  }})})}
  pathw = text[0][0].getBBox().width + 15
  pathh = text[0][0].getBBox().height +15
  d3.select('svg').transition().attr('width', pathw).attr('height', pathh)
  d3.select('g').attr('transform','translate('+pathw/2+','+pathh/2+')')
  makeList() 
}
});
