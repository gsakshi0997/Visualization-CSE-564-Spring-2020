function bar(ne,str){

    d3.selectAll(".svgid").remove();


    var margin = {top: 50, right: 10, bottom: 90, left: 150},
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, width]).round(true).padding(0.08);
              //.paddingInner(1);
    var y = d3.scaleLinear().range([height, 0]);
              

    var svg = d3.select("body")
        .append("svg")
    		.attr('class','svgid')
        .attr("width", width + margin.left + margin.right+150)
        .attr("height", height + margin.top + margin.bottom +80)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


    // var tip = d3.tip()
    //   .attr('class', 'tip')
    //   .offset([0, 0])
    //   .html(function(d) {
    //     return "<b><span style='color:black'>" + d.value + "</span></b>";
    //   })
    // svg.call(tip);
    x.domain(ne.map(function(d) { return d.key; }));
    y.domain([0, d3.max(ne, function(d) { return d.value; })]);

    var bars=svg.selectAll(".bar")
          .data(ne)
        	.enter().append("rect")
          .attr('class', 'bar1')
              //.attr("fill", "#5e64c1")
          .on('mouseover', function(d){
            d3.select(this).attr('class', 'bar2');
            d3.select(this)
          .attr('width', x.bandwidth() + 9)
          .attr("y", function(d) { return y(d.value) - 9; })
          .attr("height", function(d) { return height - y(d.value) + 9; });

        svg.append("text")
         .attr('class', 'val') 
         .attr('x', function() {
             return x(d.key);
         })
         .attr('y', function() {
             return y(d.value) - 12;
         })
         .text(function() {
             return [d.value];  
         });
          })
          .on('mouseout', function(){
            d3.select(this).attr('class', 'bar1');
            d3.select(this)
          .attr('width', x.bandwidth())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });

        d3.selectAll('.val')
          .remove()
          })
          .attr("x", function(d) { return x(d.key); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });


      // svg.append("g")
      //     .attr("transform", "translate(0," + height + ")")
      //     .call(d3.axisBottom(x));
      // svg.append("text")             
      //     .attr("transform",
      //           "translate(" + (width/2) + " ," + 
      //                          (height + margin.top+18) + ")")
      //     .style("text-anchor", "middle")
      //     .attr("transform", "rotate(-60)");
          
    svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")	
          .style("text-anchor", "end")
          .attr("dx", "-.4em")
          .attr("dy", "-.50em")
          .attr("y",15)
          .attr("transform", "rotate(-45)");


    svg.append("text")             
          .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height +margin.top+ 65) + ")")
          .style("text-anchor", "middle")
      		.text(str);


    svg.append("g").call(d3.axisLeft(y));

    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left+100)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Frequency");      


//svg.selectAll("*").remove();


}
