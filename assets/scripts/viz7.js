// ====== Data Visualization VII ======
//
// Has Hubway popularity increased over time?

// Load Data
d3.queue()
    .defer(d3.json, "assets/data/viz7.json")
    .await(buildVizSeven);

// Intialize Variables
let margin7 = {top: 60, right: 40, bottom: 60, left: 60},
    width7 = d3.select('#viz7').node().clientWidth - margin7.left - margin7.right,
    height7 = d3.select('#viz7').node().clientHeight - margin7.top - margin7.bottom;

let x7 = d3.scaleLinear()
        .range([0, width7]);

let y7 = d3.scaleLinear()
        .range([height7, 0]);

let color7 = d3.scaleLinear().range(["#c3e5e4", "#289699", "#031918"]);

let radius7 = d3.scaleLinear().range([5, 40]);

let xAxis7 = d3.axisBottom(x7).ticks(7).tickFormat(d3.format(".4r"));

let yAxis7 = d3.axisLeft(y7).tickFormat(d3.format(".2s"));

let svg7 = d3.select('#viz7').append("svg")
            .attr("width", width7 + margin7.left + margin7.right)
            .attr("height", height7 + margin7.top + margin7.bottom)
            .append("g")
            .attr("transform", "translate(" + margin7.left + "," + margin7.top + ")");

function buildVizSeven (error, data) {

    if (error) throw error;

    x7.domain(d3.extent(data, function(d) {return d.year;})).nice();
    y7.domain(d3.extent(data, function(d) {return d.trips;})).nice();
    let bikeExtent = d3.extent(data, function(d) {return d.bikes;});
    radius7.domain(bikeExtent).nice();
    color7.domain([bikeExtent[0], (bikeExtent[1] - bikeExtent[0]) / 2, bikeExtent[1]]).nice();

    svg7.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height7 + ")")
        .call(xAxis7.tickSize(-(height7 + 5)))
        .append("text")
        .attr("class", "label")
        .attr("x", width7)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year");

    svg7.append("g")
        .attr("class", "y axis")
        .call(yAxis7.tickSize(-(width7 + 5)))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Hubway Trips");

    svg7.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return radius7(d.bikes); })
        .attr("cx", function(d) { return x7(d.year); })
        .attr("cy", function(d) { return y7(d.trips); })
        .style("fill", function(d) { return color7(d.bikes); });

    let legend = svg7.selectAll(".legend")
        .data(color7.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width7 - 45)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color7);

    legend.append("text")
        .attr("x", width7 - 15)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });
}
