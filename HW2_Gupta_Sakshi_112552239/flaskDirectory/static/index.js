function selectType() {

    var dropdown = document.getElementById("Task2");
    var Value = dropdown.options[dropdown.selectedIndex].value;
    if(Value=="elbow")
          send_data_1("/elbow","Elbow Plot (K-Means Clustering)")
    else if (Value=="org") 
        send_data_2b("/scree_org", "Scree Plot - Original Data");
    else if(Value=="rand")
        send_data_2b("/scree_rand", "Scree Plot - Random Samples");
    else if(Value=="strat")
        send_data_2b("/scree_strat","Scree Plot - Stratified Samples" );
    else
      send_data_2c("/get_sqloadings","Top 3 PCA attributes");
}

function send_data_1(url,label) {
    $.ajax({
    type: 'GET',
    url: url,
      contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {

    },

    success: function(reply) {
        draw_lineplot(reply, label);
    },
    error: function(reply) {
    $("#chart_container").html(reply);
    }
  });
}

function send_data_2b(url,label) {
    $.ajax({
	  type: 'GET',
	  url: url,
      contentType: 'application/json; charset=utf-8',
	  xhrFields: {
		withCredentials: false
	  },
	  headers: {

	  },

	  success: function(reply) {
		    draw_screeplot(reply, label);
	  },
	  error: function(reply) {
		$("#chart_container").html(reply);
	  }
	});
}

function send_data_2c(url,label) {
    $.ajax({
    type: 'GET',
    url: url,
      contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {

    },

    success: function(reply) {
        draw_histplot(reply, label);
    },
    error: function(reply) {
    $("#chart_container").html(reply);
    }
  });
}

function selectRedType(){
    var dropdown = document.getElementById("Task3");
    var rb = document.getElementById("samplingType");
    var Value = dropdown.options[dropdown.selectedIndex].value;

    if(Value == -1) {
        rb.style.visibility = "hidden";
        resetEverything()
      }
    else if(Value=="pca")
    {
      rb.style.visibility = "visible";
      if(rb[0].checked)
        draw_scatt("/pca_scatt_random",0,"2D Scatterplot for PCA Random Sampling")
      else
        draw_scatt("/pca_scatt_strat",1,"2D Scatterplot for PCA Stratified Sampling")
    }
    else if(Value=="mds-euc")
    {
      rb.style.visibility = "visible";
      if(rb[0].checked)
        draw_scatt("/mds_euc_rand",0,"2D Scatterplot for MDS-Euclidean Distance (Random Sampling)")
      else
        draw_scatt("/mds_euc_strat",1,"2D Scatterplot for MDS-Euclidean Distance (Stratified Sampling)")
    }
    else if(Value=="mds-corr")
    {
      rb.style.visibility = "visible";
      if(rb[0].checked)
        draw_scatt("/mds_corr_rand",0,"2D Scatterplot for MDS-Correlation Distance (Random Sampling)")
      else
        draw_scatt("/mds_corr_strat",1,"2D Scatterplot for MDS-Correlation Distance (Stratified Sampling)")
    }
    else if(Value=="scatt")
    {
      rb.style.visibility = "visible";
      if(rb[0].checked)
        draw_scattmat("/scattmat_rand",0,"Scatterplot Matrix for 3 highest PCA Loadings (Random Sampling)")
      else
        draw_scattmat("/scattmat_strat",1,"Scatterplot Matrix for 3 highest PCA Loadings (Stratified Sampling)")
    }
}
function resetEverything() {
     d3.selectAll('.svgid').remove();
}
function draw_lineplot(reply,label)
{
  var data = JSON.parse(reply);
    var str=label

    d3.selectAll(".svgid").remove();
    

    var margin = {top: 50, right: 10, bottom: 90, left: 150};
    var width = 1100 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var chart_width = 800;
    var chart_height = 550;

    var x = d3.scale.linear().domain([2, 6]).range([0, chart_width - 120]);
    var y = d3.scale.linear().domain([0, d3.max(data)]).range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var markerX
    var markerY
    var color = d3.scale.category10();

    var line = d3.svg.line()
        .x(function(d,i) {
            if (i == 3) {
                markerX = x(i);
                markerY = y(d);
            }
            return x(i);
        })
        .y(function(d) { return y(d); })

    var svg = d3.select("body").append("svg")
        .attr('class','svgid')
        .attr("width", width + margin.left + margin.right+150)
        .attr("height", height + margin.top + margin.bottom +80)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
          .attr("class", "x_axis")
          .attr("transform", "translate(180," + height + ")")
          .call(xAxis);

    svg.append("g")
          .attr("class", "y_axis")
          .attr("transform", "translate(180,0)")
          .call(yAxis);

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ 100 +","+(height/2)+")rotate(-90)")
        .text("Distortions");

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ ((chart_width/2) + 100) +","+ ((chart_width/2)) +")")
        .text("K");

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (height + margin.top + margin.bottom) +","+(chart_height - margin.bottom-30)+")")
        .text(label);

    svg.append("path")
        .attr("class", "screepath")
        .attr("d", line(data))
        .attr("transform", "translate(520,125)")
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", "3px");

    svg.append("circle")
              .attr("cx", markerX)
              .attr("cy", markerY)
              .attr("r", 6)
              .attr("transform", "translate(182,62)")
              .style("fill", "red")
              .style("stroke", "red");
}

function draw_scatt(url,num,label) {
    $.ajax({
    type: 'GET',
    url: url,
      contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {

    },
    success: function(reply) {
        draw_scattplot(reply,num,label);
    },
    error: function(reply) {
    $("#chart_container").html(reply);
    }
  });
}

function draw_scattmat(url,num,label) {
    $.ajax({
    type: 'GET',
    url: url,
      contentType: 'application/json; charset=utf-8',
    xhrFields: {
    withCredentials: false
    },
    headers: {

    },
    success: function(reply) {
        draw_scattmatrix(reply,num,label);
    },
    error: function(reply) {
    $("#chart_container").html(reply);
    }
  });
}

function draw_screeplot(eigen_values, label) {

    console.log("Inside draw_scree_plot");
    console.log("Eigen Values")
    //console.log(eigen_values)
    var data = JSON.parse(eigen_values);
    var str=label

    d3.selectAll(".svgid").remove();
    

    var margin = {top: 50, right: 10, bottom: 90, left: 150};
    var width = 1100 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var chart_width = 800;
    var chart_height = 550;

    var x = d3.scale.linear().domain([1, data.length + 0.5]).range([0, chart_width - 120]);
    var y = d3.scale.linear().domain([0, d3.max(data)]).range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(22);
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var markerX
    var markerY
    var color = d3.scale.category10();

    var line = d3.svg.line()
        .x(function(d,i) {
            if (i == 1) {
                markerX = x(i);
                markerY = y(d);
            }
            return x(i);
        })
        .y(function(d) { return y(d); })

    // Add an SVG element with the desired dimensions and margin.
    var svg = d3.select("body").append("svg")
        .attr('class','svgid')
        .attr("width", width + margin.left + margin.right+150)
        .attr("height", height + margin.top + margin.bottom +80)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // create yAxis
    svg.append("g")
          .attr("class", "x_axis")
          .attr("transform", "translate(180," + height + ")")
          .call(xAxis);

    // Add the y-axis to the left
    svg.append("g")
          .attr("class", "y_axis")
          .attr("transform", "translate(180,0)")
          .call(yAxis);

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ 120 +","+(height/2)+")rotate(-90)")
        .text("Explained Variance of Eigen Values");

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ ((chart_width/2) + 100) +","+ ((chart_width/2)) +")")
        .text("K");

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (height + margin.top + margin.bottom) +","+(chart_height - margin.bottom-30)+")")
        .text(str);

    svg.append("path")
        .attr("class", "screepath")
        .attr("d", line(data))
        .attr("transform", "translate(240,-2)")
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", "3px");

    svg.append("circle")
              .attr("cx", markerX)
              .attr("cy", markerY)
              .attr("r", 6)
              .attr("transform", "translate(240,-3)")
              .style("fill", "red")
              .style("stroke", "red");

    console.log(markerY)
    var th_line = svg.append("line")
        .attr("x1", 180)
        .attr("y1", markerY)
        .attr("x2", 810)
        .attr("y2", markerY)
        .attr("stroke-width", 2)
        .attr("stroke", "orange");


}

function draw_histplot(data,label) {
    d3.selectAll('.svgid').remove();
    loading_vector = JSON.parse(data);
    console.log("Inside hist plot")
    var columns = Object.keys(loading_vector);
    var str=label
    var column_loadings = []

    for (var i=0; i<columns.length; i++) {
        column_loadings[i] = loading_vector[columns[i]];
    }

    var margin = {top: 1000, right: 10, bottom: 90, left: 150};
    var width = 1100 - margin.left - margin.right;
    var height = (1000 - margin.top - margin.bottom)*columns.length;
    var chart_height = 800;

    chart = d3.select("body")
      .append('svg')
      .attr('id', 'histogram')
      .attr('class', 'svgid')
      .attr('width', width + margin.left + margin.right+1500)
      .attr('height', chart_height)
      .append("g")
      .style("transform", "translate(" + margin.left + 200 + "," + margin.top + ")");

    var x = d3.scale.linear().domain([0, d3.max(column_loadings)]).range([0, width]);

    var y = d3.scale.ordinal().domain(column_loadings).rangeBands([0, 60 * column_loadings.length]);

    var y2 = d3.scale.ordinal().domain(columns).rangeBands([0, 60 * columns.length]);

        chart.selectAll("line")
       .data(x.ticks(21))
       .enter().append("line")
       .attr("class", "barline")
       .attr("x1", function(d) { return x(d) + 200; })
       .attr("x2", function(d) { return x(d) + 200; })
       .attr("y1", 0)
       .attr("y2", 300 * columns.length);

        chart.selectAll(".rule")
       .data(x.ticks(21))
       .enter().append("text")
       .attr("class", "barrule")
       .attr("x", function(d) { return x(d) + 250; })
       .attr("y", 0)
       .attr("text-anchor", "middle")
       .attr("font-size", 10)
       .text(String);

        chart.selectAll("rect")
       .data(column_loadings)
       .enter().append("rect")
       .attr("x", 280)
       .attr("y", function(d) { return y(d) + 50; })
       .attr("width", x)
       .attr("height", 50).style("fill", "purple");

        chart.selectAll("loadings")
       .data(column_loadings)
       .enter().append("text")
       .attr("x", function(d) { return x(d) + 320; })
       .attr("y", function(d){ return y(d) + y.rangeBand()/2+50; })
       .attr("dx", 135)
       .attr("text-anchor", "end")
       .attr('class', 'loadings')
       .text(String);

        chart.selectAll("names")
       .data(columns)
       .enter().append("text")
       .attr("x", 150)
       .attr("y", function(d){ return y2(d) + y.rangeBand()/2+50; } )
       .attr("text-anchor", "start")
       .attr('class', 'names')
       .text(String);

        chart.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ 800 +","+800+")")
        .text(str);
}


function draw_scattplot(reply,num,label)
{
  //console.log(label)
  //console.log(reply)

  d3.selectAll('.svgid').remove();
    var data = JSON.parse(reply);
    var obj= [];
    columns = Object.keys(data);

    for(var i=0; i < Object.keys(data[0]).length; ++i){
        obj_dict = {}
        obj_dict.x = data[0][i];
        obj_dict.y = data[1][i];

        obj_dict.clusterid = data['clusterid'][i]
        obj_dict.col1 = data[columns[2]][i]
        obj_dict.col2 = data[columns[3]][i]
        obj.push(obj_dict);
        console.log(data['clusterid'][i]);

    }

    data = obj;
      //console.log(data);

    var margin = {top: 50, right: 10, bottom: 90, left: 150};
    var width = 1100 - margin.left - margin.right;
    var height = 550 - margin.top - margin.bottom;

    var xValue = function(d) { return d.x;};
    var xScale = d3.scale.linear().range([0, 800]);
    var xMap = function(d) { return xScale(xValue(d)); };
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) { return d.y;};
    var yScale = d3.scale.linear().range([height, 0]);
    var yMap = function(d) { return yScale(yValue(d));};
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    var cluster_color

    if(num==0) {
        cluster_color = function(d) { return d.clusteridx;}
    } else {
        cluster_color = function(d) { return d.clusterid;}
    }
    var color = d3.scale.category10();

    var svg = d3.select("body").append("svg")
        .attr('class', 'svgid')
        .attr("width", width + margin.left + margin.right)
        .attr("height", 700)
        .append("g")
        .attr("transform", "translate(250,80)");

    var tooltip = d3.select("body").append('div').style('position','absolute');

    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    xAxisLine = svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "x_axis")
          .call(xAxis)

    yAxisLine = svg.append("g")
          .attr("class", "y_axis")
          .call(yAxis)

    svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (-70) +","+(height/2)+")rotate(-90)")
            .text("Component 2");

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (880/2) +","+(620 - margin.top - margin.bottom)+")")
        .text("Component 1");

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (880/2) +","+(670 - margin.top - margin.bottom)+")")
        .text(label);

    svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", xMap)
          .attr("r", 3.5)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cluster_color(d));})
          .on("mouseover", function(d) {
              tooltip.transition().style('opacity', .9)
                .style('color','black')
                .style('font-size', '20px')
              tooltip.html(columns[2] + ":" + d.col1 + ", " + columns[3] + ":" + d.col2)
                .style("top", (d3.event.pageY - 28) + "px")
                .style("left", (d3.event.pageX + 5) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
              tooltip.html('');
          });
}

function draw_scattmatrix(reply,num,label)
{
    //console.log(reply)
    d3.selectAll('.svgid').remove();
    var col = JSON.parse(reply);
    var columns = Object.keys(col);
    var width = 960;
    var size = 230;
    var padding = 20;

    var x = d3.scale.linear().range([padding/2, size - padding/2]);

    var y = d3.scale.linear().range([size - padding/2, padding/2]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);

    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(6);

    var color = d3.scale.category10();
    var cluster_color
    if(num==0) 
    {
      cluster_color = function(d) { return d.clusteridx;}
    } 
    else
    {
      cluster_color = function(d) { return d.clusterid;}
    }
    
    data = {};
    data[columns[0]] = col[columns[0]];
    data[columns[1]] = col[columns[1]];
    data[columns[2]] = col[columns[2]];
    data[columns[3]] = col[columns[3]];

    var fil_col = {},columns = d3.keys(data).filter(function(d) { return d !== "clusterid"; }),n = columns.length;

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);
    columns.forEach(function(col_name) {
        fil_col[col_name] = d3.extent(d3.values(data[col_name]));
    });

    var svg = d3.select("body").append("svg")
        .attr('class', 'svgid')
        .attr("width", size * n + padding+500)
        .attr("height", size * n + padding+90)
        .append("g")
        .attr("transform", "translate("+ (700/2) +","+(60)+")");

    svg.selectAll(".x.axis")
        .data(columns)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(fil_col[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
        .data(columns)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(fil_col[d]); d3.select(this).call(yAxis); });

    svg.append("text")
        .attr("x", (width / 2.8))
        .attr("y", 0 + (5))
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (50) +","+(720)+")")
        .text(label);

    var cell = svg.selectAll(".cell")
        .data(cross(columns, columns))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });

    function plot(p) {
          var cell = d3.select(this);
          x.domain(fil_col[String(p.x)]);
          y.domain(fil_col[String(p.y)]);
          cell.append("rect")
              .attr("class", "frame")
              .attr("x", padding / 2)
              .attr("y", padding / 2)
              .attr("width", size - padding)
              .attr("height", size - padding);

          f_comp = data[String(p.x)];
          s_comp = data[String(p.y)];
          res = []
          s = d3.values(s_comp)
          cluster = data['clusterid']
          //console.log(cluster)
          d3.values(f_comp).forEach(function(item, index) {
              temp = {};
              temp["x"] = item;
              temp["y"] = s[index];
              temp["clusterid"] = cluster[index];
              res.push(temp);
          });
          //console.log(res)
          cell.selectAll("circle")
              .data(res)
              .enter().append("circle")
              .attr("cx", function(d) { return x(d.x); })
              .attr("cy", function(d) { return y(d.y); })
              .attr("r", 4)
              .style("fill", function(d) { return num==0 ? color(0) : color(d.cluster); });
    }
}
function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
}
