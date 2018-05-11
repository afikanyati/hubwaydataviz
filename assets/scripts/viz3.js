// ====== Data Visualization III ======
//
// How do popular stations relate to popular trips?
function buildVizThree(nodes,links){
    draw(nodes,links);

    function draw(nodesData, linksData) {
        let width = d3.select('#viz3').node().clientWidth,
        height = d3.select('#viz3').node().clientHeight;

        // transform ids into numbers
        linksData.forEach(function (d) {
            d.source = +d.source;
            d.target = +d.target;
        });

        // transform ids into numbers
        nodesData.forEach(function (d) {
            d.name = +d.name;
        });

        // filter links to have only those that appear in the list of stations
        let linksData_sorted = linksData.sort(function (a,b) {return a.type - b.type}).reverse();
        let links = linksData_sorted.filter(function(d,i){return i < 300});

        //create somewhere to put the force directed
        let svg = d3.select('#viz3').append("svg")
            .attr("width", width)
            .attr("height", height);

        // add tooltip element
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let radius = 15;

        // set up forces
        let link_force = d3.forceLink().id(function (d) {return d.name}).strength(0.5);

        let charge_force = d3.forceManyBody().strength(-100);

        let center_force = d3.forceCenter(width / 2, height / 2);

        // set up the simulation
        let simulation = d3.forceSimulation()
            .force("charge", charge_force)
            .force("center", center_force)
            .force("link", link_force);

        //add encompassing group for the zoom
        let g = svg.append("g")
            .attr("class", "everything");

        let min_max_nodes = d3.extent(nodesData, function(d){return d.type;})
        let min_max_links = d3.extent(linksData, function(d){return d.type;})
        let radius_scaled = d3.scaleLinear().range([3,60]).domain(min_max_nodes)
        let links_scaled = d3.scaleLinear().range([3,50]).domain(min_max_links)

        //draw lines for the links
        let link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke-width", function (d) {return links_scaled(d.type)})
            .style("stroke", linkColour);


        //draw circles for the nodes
        let node = g.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            // before this was nodesData
            .data(nodesData)
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
        simulation.nodes(nodesData).on("tick", tickActions);
        simulation.force("link").links(links);

        //add drag capabilities
        let drag_handler = d3.drag()
            .on("start", drag_start)
            .on("drag", drag_drag)
            .on("end", drag_end);

        drag_handler(node);


        //add zoom capabilities
        /*
        let zoom_handler = d3.zoom()
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
            link.attr("x1", function (d, i) {
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
