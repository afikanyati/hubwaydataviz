// ====== Data Visualization IV ======
//
// When during the day is Hubway most popular?

function buildVizFour(hourData) {
    // for (let i = 0 ; i < yearData.length; i++){
    //     let  mapdayhrs = {};  //maps days to 24 hours
    //     let  dayhrs = [];             //new storage
    //
    //     let  startdayhr = yearData[i]['starttime'];
    //     startdayhr = startdayhr.split(' ');     //split by spaces
    //     dayhrs.push(startdayhr.shift());    //add the number
    //     dayhrs.push(startdayhr.join(' '));  //and the rest of the string
    //
    //     firstchartime = dayhrs[1][0]  // first and 2nd                                         character of time
    //     secondchartime = dayhrs[1][1]
    //
    //     if dayhrs[0] not in mapdayhrs{
    //         if (secondchartime is not ":"){  /// ie 10am & after
    //             mapdayhrs[dayhrs[0]][parseInt(firstchartime + secondchartime)] += 1    //set index of where you will put this count
    //         }
    //
    //         else{     // btw 0am and 9am
    //             mapdayhrs[dayhrs[0]][firstchartime] += 1    //set index of where you will put this count
    //         }
    //         }
    //     }
    //     console.log(dayhrs)
    let hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM",
                "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM",
                "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM",
                "9PM", "10PM", "11PM"];

    let margin = {top: 20, right: 20, bottom: 50, left: 60},
        width = d3.select('#viz4').node().clientWidth - margin.left - margin.right,
        height = d3.select('#viz4').node().clientHeight - margin.top - margin.bottom;

    // set the ranges
    let x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    let y = d3.scaleLinear()
              .range([height, 0]);

    let svg = d3.select("#viz4").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


    // format the data
    hourData.forEach(function(d, i) {
        hourData[i] = {
            hour: hours[i],
            trips: d
        };
    });
    let maxTrips = d3.max(hourData, function(d) { return d.trips; });
    let colorScale = d3.scaleLinear().domain([0, maxTrips]).range(["#e2eaea", "#084c4c"]);

    // Scale the range of the data in the domains
    x.domain(hourData.map(function(d) { return d.hour; }));
    y.domain([0, maxTrips]);

    svg.append("g")
     .attr("class", "grid")
     .attr("transform", "translate(0," + height + ")")
     .call(make_x_gridlines(24)
         .tickSize(-height)
         .tickFormat("")
     )

     // add the Y gridlines
     svg.append("g")
         .attr("class", "grid")
         .call(make_y_gridlines(8)
             .tickSize(-width)
             .tickFormat("")
         )

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(hourData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr('fill', function(d) {return colorScale(d.trips);})
        .attr("x", function(d) { return x(d.hour); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) {return y(d.trips); })
        .attr("height", function(d) { return height - y(d.trips); });

    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "translate(" + width/2 + " ," + (height + margin.top + 15) + ")")
      .style("text-anchor", "end")
      .text("Hour");

  svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", - (height/2))
      .attr("y", -margin.left)
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text("Number of Hubway Trips");

      // gridlines in x axis function
  function make_x_gridlines(numLines) {
      return d3.axisBottom(x)
          .ticks(numLines)
  }

  // gridlines in y axis function
  function make_y_gridlines(numLines) {
      return d3.axisLeft(y)
          .ticks(numLines)
  }
}
