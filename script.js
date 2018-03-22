var height = 500, width = 1000,
    margin = {
      left: 120, right: 20, top: 20, bottom: 70
    },
    url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
    color = ["#ef5350","#EC407A","#AB47BC","#7E57C2","#5C6BC0","#42A5F5","#26C6DA","#26A69A","#D4E157","#FFEE58","#FFA726"];

var canvas = d3.select('svg').attr({
  height: height + margin.top + margin.bottom,
  width: width + margin.left + margin.right
});

var group = canvas.append('g').attr({
  transform: "translate(" + margin.left + "," + margin.top + ")"
});

var div = d3.select('.tooltip');
var xScale = d3.time.scale().range([0,width]);
var yScale = d3.scale.ordinal().domain(months).rangeBands([0,height]);
var colorScale = d3.scale.quantize().range(color);


//call the json with the url and a function
d3.json(url,function(data){
  data = data.monthlyVariance;
  //map the data
  data.map(function(d){
    d.month = months[d.month-1];
    d.year = d3.time.format("%Y").parse(d.year.toString());
  })
  
  //declair the function xScale
  xScale.domain(d3.extent(data,function(data){
    return data.year;
  }));
  //scale the colors
  colorScale.domain(d3.extent(data,function(d){
    return d.variance;
  }));
  
  var barWidth = width / (data.length / 12)
  var barHeight = height / 12;
  //scale the axis and set orientation
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(12);
  
  //add a g element that provides a reference point for adding the axes.
  //append the axis according to the size and the position that we have set up with our width, height and margin’s.
  group.append('g').attr({
    class: "xAxis",
    transform: "translate(0," + (height) + ")"
  }).call(xAxis);
  group.append('g').attr({
    class: "yAxis",
    transform: "translate(0,0)",
  }).call(yAxis);
  group.selectAll('g').data(data).enter().append('g').attr({
    transform: function(data){
      return "translate(" + xScale(data.year) + "," + yScale(data.month) +  ")";
    }
    }).append('rect').attr({ //append the rectangulars and scale them in the graph
    width: barWidth,
    height: yScale.rangeBand()
  }).style({ //scale the colors
    fill: function(data){
     return colorScale(data.variance);
    }
  }).on("mouseover",function(d){
    //make the tooltip to follow the mouse
    div.transition().duration(10).style("opacity",0.8).style({
      left: d3.event.pageX + "px",
      top: d3.event.pageY + "px"
    });
    
    //appear/disappear the tooltip on mouse hover
    //8.66 is a standard value
    div.html("<p>Year: " + d3.time.format("%Y")(d.year) + "</p></p>Value = " + (8.66 + d.variance).toFixed(2) + "</p><p>Month: " + d.month + "</p>" );
  }).on("mouseout",function(d){
    div.transition().duration(100).style("opacity",0);
  });

});