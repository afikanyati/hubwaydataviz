// ====== Data Visualization VII ======
//
// Has Hubway popularity increased over time?

function buildVizSeven (data) {
    // Intialize Variables
    let margin = {top: 60, right: 40, bottom: 60, left: 60},
        width = d3.select('#viz7').node().clientWidth - margin.left - margin.right,
        height = d3.select('#viz7').node().clientHeight - margin.top - margin.bottom;

    let x = d3.scaleLinear()
            .range([0, width]);

    let y = d3.scaleLinear()
            .range([height, 0]);

    let color = d3.scaleLinear().range(["#c3e5e4", "#289699", "#031918"]).nice();

    let radius = d3.scaleLinear().range([5, 40]);

    let xAxis = d3.axisBottom(x).ticks(7).tickFormat(d3.format(".4r"));

    let yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));

    let svg = d3.select('#viz7').append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) {return d.year;})).nice();
    y.domain(d3.extent(data, function(d) {return d.trips;})).nice();
    let bikeExtent = d3.extent(data, function(d) {return d.bikes;});
    radius.domain(bikeExtent).nice();
    color.domain([bikeExtent[0], bikeExtent[0] + (bikeExtent[1] - bikeExtent[0]) / 2, bikeExtent[1]]).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.tickSize(-(height + 5)));


    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(" + width/2 + " ," + (height + margin.top/2) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis.tickSize(-(width + 5)));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", - (height / 2))
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Hubway Trips");

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return radius(d.bikes); })
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.trips); })
        .style("fill", function(d) { return color(d.bikes); });

    svg.append("text")
        .attr("class", "legend-label")
        .attr("transform", "translate(" + (width) + " ," + -30 + ")")
        .style("text-anchor", "end")
        .text("Bikes");

    let legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (-margin.top/2 + i * 20 + 20) + ")"; });

    legend.append("rect")
        .attr("x", width - 45)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 15)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });
}
