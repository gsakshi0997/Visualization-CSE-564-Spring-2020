
function AgeFunc()
{
    var str="Age";
    var num_bins=15;
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Age);
    })
    hist(col,str,num_bins);
   })
}
function NationalityFunc()
{
    var str="Nationality";
    d3.csv("new.csv",function(data){
    //console.log(data);
    var col=data.map(function(da){
        return (da);
    })
   
   var col_nest=d3.nest()
  .key(function(d) { return d.Nationality; })
  .rollup(function(v) { return v.length; })
  .entries(col);

  //console.log(col_nest);
    bar(col_nest,str);
})
}
function OverallFunc()
{
      var num_bins=15;

    var str="Overall Ranking of Player";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Overall);
    })
    hist(col,str,num_bins);
   })
}
function ClubFunc()
{
    var str="Club";
    d3.csv("new.csv",function(data){
    //console.log(data);
    var col=data.map(function(da){
        return (da);
    })
   
   var col_nest=d3.nest()
  .key(function(d) { return d.Club; })
  .rollup(function(v) { return v.length; })
  .entries(col);

  //console.log(col_nest);
    bar(col_nest,str);
})
}
function ValueFunc()
{
    var num_bins=15;

    var str="Value scores of a player";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Value);
    })
    hist(col,str,num_bins);
   })
}
function PositionFunc()
{
    var str="Playing Position"
    d3.csv("new.csv",function(data){
    //console.log(data);
    var col=data.map(function(da){
        return (da);
    })
   
   var col_nest=d3.nest()
  .key(function(d) { return d.Position; })
  .rollup(function(v) { return v.length; })
  .entries(col);

  //console.log(col_nest);
    bar(col_nest,str);
})
}
function CrossingFunc()
{
      var num_bins=15;

    var str="Crossing Points";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Crossing);
    })
    hist(col,str,num_bins);
   })
}
function Body_typeFunc()
{
    var str="Body Type of the player";
    d3.csv("new.csv",function(data){
    //console.log(data);
    var col=data.map(function(da){
        return (da);
    })
   
   var col_nest=d3.nest()
  .key(function(d) { return d.BodyType; })
  .rollup(function(v) { return v.length; })
  .entries(col);

  //console.log(col_nest);
    bar(col_nest,str);
})
}
function FinishingFunc()
{
      var num_bins=15;

    var str="Finishing Score";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Finishing);
    })
    hist(col,str,num_bins);
   })
}
function DribblingFunc()
{
      var num_bins=15;

    var str="Dribbling Score";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Dribbling);
    })
    hist(col,str,num_bins);
   })
}
function Sprint_speedFunc()
{
      var num_bins=15;

    var str="Dribbling Speed";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.SprintSpeed);
    })
    hist(col,str,num_bins);
   })
}
function HeightFunc()
{
    var str="Height";
    d3.csv("new.csv",function(data){
    //console.log(data);
    var col=data.map(function(da){
        return (da);
    })
   
   var col_nest=d3.nest()
  .key(function(d) { return d.Height; })
  .rollup(function(v) { return v.length; })
  .entries(col);

  //console.log(col_nest);
    bar(col_nest,str);
})
}
function WeightFunc()
{
    var num_bins=15;

    var str="Weight";
    d3.csv("new.csv",function(data){
    var col=data.map(function(da){
        return parseInt(da.Weight);
    })
    hist(col,str,num_bins);
   })
}
function Preferred_footFunc()
{
    var str="Preferred Foot";
    d3.csv("new.csv",function(data){
    //console.log(data);
    var col=data.map(function(da){
        return (da);
    })
   
   var col_nest=d3.nest()
  .key(function(d) { return d.PreferredFoot; })
  .rollup(function(v) { return v.length; })
  .entries(col);

    //console.log(col_nest);
    bar(col_nest,str);
})
}


