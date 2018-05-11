// ====== Data Visualization III ======
//
// How do popular stations relate to popular trips?
function buildVizThree(data1,data2){
    /*
     function parseStations(d) {
     return {
     name : +d.name,
     id: d.id,
     type: +d.type
     };
     }
     */
    draw(data1,data2)
    function draw(nodes_data, links_data) {
        var width = d3.select('#viz3').node().clientWidth,
        height = d3.select('#viz3').node().clientHeight;

        

        // transform ids into numbers
        links_data.forEach(function (d) {
            d.source = +d.source;
            d.target = +d.target;
        });

        // transform ids into numbers
        nodes_data.forEach(function (d) {
            d.name = +d.name
        });

        console.log(nodes_data)
        // filter links to have only those that appear in the list of stations
        var links_data_sorted = links_data.sort(function (a,b) {return a.type - b.type}).reverse()
        var links = links_data_sorted.filter(function(d,i){return i < 300});
        //var links = links_data


        //create somewhere to put the force directed graph
        var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        let svg = d3.select('#viz3').append("svg")
            .attr("width", width)
            .attr("height", height);

        var radius = 15;
        

        
        //set up forces
        var link_force = d3.forceLink().id(function (d) {return d.name}).strength(0.5);

        var charge_force = d3.forceManyBody().strength(-100);

        var center_force = d3.forceCenter(width / 2, height / 2);

        // set up the simulation
        var simulation = d3.forceSimulation()
            .force("charge", charge_force)
            .force("center", center_force)
            .force("link", link_force);

        //add encompassing group for the zoom
        var g = svg.append("g")
            .attr("class", "everything");

        var min_max_nodes = d3.extent(nodes_data, function(d){return d.type;})
        var min_max_links = d3.extent(links_data, function(d){return d.type;})
        var radius_scaled = d3.scaleLinear().range([3,60]).domain(min_max_nodes)
        var links_scaled = d3.scaleLinear().range([3,50]).domain(min_max_links)
        //draw lines for the links
        var link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke-width", function (d) {return links_scaled(d.type)})
            .style("stroke", linkColour);
        
        
//draw circles for the nodes
        var node = g.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            // before this was nodes_data
            .data(nodes_data)
            .enter()
            .append("circle")
            .attr("r", function (d) {
                return radius_scaled(d.type)
            })
            .attr("fill", circleColour)
            .on("mouseover", function(d) {
            div.transition()
            .duration(200)
            .style("opacity", .9);
            div.html(d.id)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
       })
            .on("mouseout", function(d) {
            div.transition()
            .duration(500)
            .style("opacity", 0);
            })
//    simulation
        simulation.nodes(nodes_data).on("tick", tickActions);
        simulation.force("link").links(links);

//add drag capabilities

        var drag_handler = d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end);

        drag_handler(node);


//add zoom capabilities
        /*
        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(svg);
*/
        /** Functions **/

//Function to choose what color circle we have
//Let's return blue for males and red for females
        function circleColour(d) {
            return "#cc5da3";
        }

//Function to choose the line colour and thickness 
//If the link type is "A" return green 
//If the link type is "E" return red 
        function linkColour(d) {
            return "#084c4c";
        }

//Drag functions 
//d is the node 

        function drag_start(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

//make sure you can't drag the circle outside the box
        function drag_drag(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function drag_end(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
//Zoom functions
        /*
        function zoom_actions() {
            g.attr("transform", d3.event.transform)
        }
*/
        function tickActions() {
            //update circle positions each tick of the simulation
            /*
            node
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y;
                });
                */
            node
            .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

            //update link positions
            link
                .attr("x1", function (d, i) {
//        if (i===0){console.log(d)}
                    return d.source.x
                })
                .attr("y1", function (d) {
                    return d.source.y
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y
                });
        }
            }
}

