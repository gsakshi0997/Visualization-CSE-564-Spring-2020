function hist(da,str,num_bins)
{
d3.selectAll(".svgid").remove();
console.log(num_bins);

    var margin = {top: 50, right: 10, bottom: 90, left: 250},
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var xmax=d3.max(da);
    var xmin=d3.min(da);


    var x = d3.scaleLinear().domain([xmin,xmax]).range([0, width]);


    var ymax=d3.max(da,function(d){return d.length});
    var ymin=d3.min(da,function(d){return d.length});
    var y = d3.scaleLinear().range([height, 0]);

    var hist=d3.histogram().value(function(d) { return d; }).domain(x.domain()).thresholds(x.ticks(num_bins));

    var bin = hist(da);

    y.domain([0, d3.max(bin, function(d) { return d.length; })]);

    var svg = d3.select("body")
        .append("svg")
        .attr("class", "svgid")
        .attr("width", width + margin.left + margin.right+150)
        .attr("height", height + margin.top + margin.bottom+80)
      	.append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


    var tooltip = d3.tip().attr('class', 'tip').offset([0, 0]);
    svg.call(tooltip);


    var bars=svg.selectAll(".bar")
          .data(bin)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", d => x(d.x0) + 1)
          .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
          .attr("y", d => y(d.length))
          .attr("height", d => y(0) - y(d.length))
       //.attr("fill", "#5e64c1")
    //   .attr("x", 1)
    //   .attr("transform", function(d) {
		  // return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    //   .attr("y",function(d){
    //     return d.length;
    //   })
    //   .attr("width", function(d) { return x(d.x1) - x(d.x0)  ; })
    //   .attr("height", function(d) { return height - y(d.length); })
          .on('mouseover', function(d){
            d3.select(this).attr('class', 'bar2');
                d3.select(this)
                .attr('class','val')
                .attr("y", parseInt(d3.select(this).attr("y")) - 10)         
                .attr("width", width / bin.length + 10)
                .attr("height",parseInt(d3.select(this).attr("height")) + 10);
                
                tooltip.html("<b> <span style='color:black'>" + d.length + "</span></b>");
                tooltip.show();
          })
          .on('mouseout', function(){
            d3.select(this).attr('class', 'bar1');

                d3.select(this) 
                //.attr("x",(width / bins.length))         
                .attr("y",parseInt(d3.select(this).attr("y")) + 10)            
                .attr("width", width / bin.length)
                .attr("height",parseInt(d3.select(this).attr("height")) - 10)  

                tooltip.hide();

          });

    svg.append("g")
          .attr("transform", "translate(0," + (height) + ")")
          .call(d3.axisBottom(x));


    svg.append("text")             
          .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top +18 ) + ")")
          .style("text-anchor", "middle")
          .text(str);

    svg.append("g")
          .call(d3.axisLeft(y));


    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left+200)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Value");   


    changeBins(da,str);

}
// function onMouseOver(da, i) {

//   var margin = {top: 50, right: 10, bottom: 90, left: 350},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

//     var xmax=d3.max(da);
//     var xmin=d3.min(da);
//     var x = d3.scaleLinear()
//         .domain([xmin,xmax])
//           .range([0, width]);


//     var ymax=d3.max(da,function(d){return d.length});
//     var ymin=d3.min(da,function(d){return d.length});
//   var y = d3.scaleLinear()
//           .range([height, 0]);

//     var histogram=d3.histogram()
//     .value(function(d) { return d; })
//     .domain(x.domain())
//     .thresholds(x.ticks(num_bins));

//     var bins = histogram(da);
//             d3.select(this).attr('class', 'highlight');
//             d3.select(this)
//             .attr('class','val')
//             .attr("y", parseInt(d3.select(this).attr("y")) - 10)         
//             .attr("width", width / bins.length + 10)
//             .attr("height",parseInt(d3.select(this).attr("height")) + 10);
            
//             tip.html("<b> <span style='color:black'>" + d.length + "</span></b>");
//             tip.show();
//       //   d3.select(this).attr('class', 'highlight');
//       //   d3.select(this)
//       //             //.attr("x",function(d){return x(d.x0);})

//       //     .attr('width', width+7)
//       //     .attr("y", function(d) { return y(d.length) -7; })
//       //     .attr("height", function(d) { return height - y(d.length) +7; });

//       //   svg.append("text")
//       //   //.attr("x", 1)
//       // .attr("transform", function(d) {
//       // return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//       //    // .attr('class', 'val') 
//       //    // .attr('x', function() {
//       //    //     return d;
//       //    // })
//       //    // .attr('y', function() {
//       //    //     return y(d.length);
//       //    // })
//       //    .text(d.length);
//       //        // .style("text-anchor", "middle");
//     }

//     //mouseout event handler function
// function onMouseOut(da,, i) {
//   var margin = {top: 50, right: 10, bottom: 90, left: 350},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

//     var xmax=d3.max(da);
//     var xmin=d3.min(da);
//     var x = d3.scaleLinear()
//         .domain([xmin,xmax])
//           .range([0, width]);


//     var ymax=d3.max(da,function(d){return d.length});
//     var ymin=d3.min(da,function(d){return d.length});
//   var y = d3.scaleLinear()
//           .range([height, 0]);

//     var histogram=d3.histogram()
//     .value(function(d) { return d; })
//     .domain(x.domain())
//     .thresholds(x.ticks(num_bins));

//     var bins = histogram(da);
//             d3.select(this).attr('class', 'bar1');

//             d3.select(this)   
//             // .transition().duration(500)
//             //.attr("x",(width / bins.length))         
//             .attr("y",parseInt(d3.select(this).attr("y")) + 10)            
//             .attr("width", width / bins.length)
//             .attr("height",parseInt(d3.select(this).attr("height")) - 10)  

//             tip.hide();

//             // d3.selectAll('.val')
//             // .remove()

//         // use the text label class to remove label on mouseout
//         // d3.select(this).attr('class', 'bar1');
//         // d3.select(this)
//         //   //.attr("x",function(d){return x(d.x0);})
//         //   .attr("width", width })
//         //   .attr("y", function(d) { return y(d.length);  })
//         //   .attr("height", function(d) { return height - y(d.length); });

//         // d3.selectAll('.val')
//         //   .remove()
//     }


