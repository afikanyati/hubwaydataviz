// ====== Data Visualization VI ======
//
// Is Hubway affected by seasonal weather?

function buildVizSix(data) {
    let rose = Chart.rose(),
    height = 600,
    numbers = ['Trips'],
	format = d3.timeFormat('%m/%Y');

    // Get the maximum value:
	let maxVal = d3.max(data, function(d) {
		return d.val;
	});

	// Where the maximum value gives us the maximum radius:
	let maxRadius = Math.sqrt(maxVal * 12 / Math.PI);

    // Append a new figure to the DOM:
	figure = d3.select('#viz6')
		.append( 'figure' );

	// Get the figure width:
	width = parseInt(figure.style( 'width' ), 10 );

	// Update the chart generator settings:
	rose.legend(numbers)
		.width(width)
		.height(height)
		.delay(0)
		.duration(500)
		.domain([0, maxRadius])
		.angle(function(d) { return d.month; } )
		.area( function(d, i) { return [d.val]; });

	// Bind the data and generate a new chart:
	figure.datum(data)
		.attr('class', 'chart figure1')
		.call( rose );

	// Create a slider:
	Chart.slider(data, 0, data.length, 1); // minVal, maxVal, step

}

var Chart = {};

Chart.rose = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 20, 'left': 20},
        width7 = d3.select('#viz6').node().clientWidth - margin.left - margin.right,
        height7 = d3.select('#viz6').node().clientHeight - margin.top - margin.bottom,
		area = function(d) { return [d.y]; },
		angle = function(d) { return d.x; },
		radiusScale = d3.scaleLinear(),
		angleScale = d3.scaleLinear().range( [Math.PI, 3*Math.PI ] ),
		domain = [0, 1],
		legend = [''],
		label = function(d) { return d.label; },
		delay = 1000,
		duration = 100,
		canvas, graph, centerX, centerY, numWedges, wedgeGroups, wedges, legendGroup;

	// Arc Generator:
	var arc = d3.arc()
		.innerRadius( 0 )
		.outerRadius( function(d,i) { return radiusScale( d.radius ); } )
		.startAngle( function(d,i) { return angleScale( d.angle ); } );

	function chart( selection ) {

		selection.each( function( data ) {

			// Determine the number of wedges:
			numWedges = data.length;

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams();

			// Create the chart base:
			createBase( this );

			// Create the wedges:
			createWedges( data );

		});

	}; // end FUNCTION chart()

	//
	function formatData( data ) {
		// Convert data to standard representation; needed for non-deterministic accessors:
		data = data.map( function(d, i) {
			return {
				'angle': angle.call(data, d, i),
				'area': area.call(data, d, i),
				'label': label.call(data, d, i)
			};
		});

		// Now convert the area values to radii:
		// http://understandinguncertainty.org/node/214
		return data.map( function(d, i) {
			return {
				'angle': d.angle,
				'label': d.label,
				'radius': d.area.map( function(area) {
					return Math.sqrt( area*numWedges / Math.PI );
				})
			}
		})
	}; // end FUNCTION formatData()

	//
	function updateParams() {
		// Update the arc generator:
		arc.endAngle( function(d,i) { return angleScale( d.angle ) + (Math.PI / (numWedges/2)); } );

		// Determine the chart center:
		centerX = (width - margin.left - margin.right) / 2;
		centerY = (height - margin.top - margin.bottom) / 2;

		// Update the radius scale:
		radiusScale.domain( domain )
			.range( [0, d3.min( [centerX, centerY] ) ] );

		// Update the angle scale:
		angleScale.domain( [0, numWedges] );
	}; // end FUNCTION updateParams()

	//
	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + (centerX + margin.left) + ',' + (centerY + margin.top) + ')');

	}; // end FUNCTION createBase()


	function createWedges( data ) {
        let maxRadius = d3.max(data, function(d) {
    		return d.radius[0];
    	});
        let colorScale = d3.scaleLinear().domain([0, maxRadius]).range(["#ffffff", "#084c4c"]);
		// Create the wedge groups:
		wedgeGroups = graph.selectAll('.wedgeGroup')
			.data( data )
		  .enter().append('svg:g')
		  	.attr('class', 'wedgeGroup')
		  	.attr('transform', 'scale(0,0)');

		// Create the wedges:
		wedges = wedgeGroups.selectAll('.wedge')
		  	.data( function(d) {
		  		var ids = d3.range(0, legend.length);

		  		ids.sort( function(a,b) {
			  		var val2 = d.radius[b],
			  			val1 = d.radius[a]
			  		return  val2 - val1;
			  	});
			  	return ids.map( function(i) {
			  		return {
			  			'legend': legend[i],
			  			'radius': d.radius[i],
			  			'angle': d.angle
			  		};
			  	});
		  	})
		  .enter().append('svg:path')
		  	.attr('class', function(d) { return 'wedge ' + d.legend; })
		  	.attr('d', arc );

		// Append title tooltips:
		wedges.append('svg:title')
			.text( function(d) { return d.legend + ': ' + Math.floor(Math.pow(d.radius,2) * Math.PI / numWedges); });

		// Transition the wedges to view:
		wedgeGroups.transition()
			.delay( delay )
			.duration( function(d,i) {
				return duration*i;
			})
			.attr('transform', 'scale(1,1)');

		// Append labels to the wedgeGroups:
		var numLabels = data.length;

		wedgeGroups.selectAll('.label-path')
			.data( function(d,i) {
				return [
					{
						'index': i,
						'angle': d.angle,
						'radius': d3.max( d.radius.concat( [23] ) )
					}
				];
			} )
		  .enter().append('svg:path')
		  	.attr('class', 'label-path')
		  	.attr('id', function(d) {
		  		return 'label-path' + (d.index + numLabels);
		  	})
			.attr('d', arc)
		  	.attr('fill', function(d) {
                return colorScale(d.radius);
            })
		  	.attr('stroke', 'none');

		wedgeGroups.selectAll('.label')
			.data( function(d,i) {
				return [
					{
						'index': i,
						'label': d.label
					}
				];
			} )
		  .enter().append('svg:text')
	   		.attr('class', 'label')
	   		.attr('text-anchor', 'start')
	   		.attr('x', 5)
	   		.attr('dy', '-.71em')
	   		.attr('text-align', 'center')
	  		.append('textPath')
	  			.attr('xlink:href', function(d,i) {
	  				return '#label-path' + (d.index + numLabels);
	  			})
	  			.text( function(d) { return d.label; } );

	}; // end FUNCTION createWedges()

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: area
	chart.area = function( _ ) {
		if (!arguments.length) return area;
		area = _;
		return chart;
	};

	// Set/Get: angle
	chart.angle = function( _ ) {
		if (!arguments.length) return angle;
		angle = _;
		return chart;
	};

	// Set/Get: label
	chart.label = function( _ ) {
		if (!arguments.length) return label;
		label = _;
		return chart;
	};

	// Set/Get: domain
	chart.domain = function( _ ) {
		if (!arguments.length) return domain;
		domain = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	// Set/Get: delay
	chart.delay = function( _ ) {
		if (!arguments.length) return delay;
		delay = _;
		return chart;
	};

	// Set/Get: duration
	chart.duration = function( _ ) {
		if (!arguments.length) return duration;
		duration = _;
		return chart;
	};

	return chart;

}; // end FUNCTION rose()

Chart.slider = function(data, minVal, maxVal, step) {

	d3.select('#viz6').append('input')
		.attr('class', 'slider')
        .attr('id', 'viz6-input')
		.attr('type', 'range')
		.attr('name', 'slider')
		.attr('min', minVal)
		.attr('max', maxVal)
		.attr('step', 0.001)
		.attr('value', maxVal);

	d3.select("#viz6-input").on("change", function() {
	  var value = Math.round(this.value);

	  d3.selectAll('.wedgeGroup')
	  	.filter( function(d,i) { return i < value; } )
	  	.transition()
	  		.duration( 500 )
	  		.attr( 'transform', 'scale(1,1)');

	  d3.selectAll('.wedgeGroup')
	  	.filter( function(d,i) { return i >= value; } )
	  	.transition()
	  		.duration( 500 )
	  		.attr( 'transform', 'scale(0,0)' );
	});

    d3.select('#viz6')
        .append('label')
        .attr("class", "input-label")
        .append("text")
        .text("Filter by Month");


}; // end FUNCTION slider()
