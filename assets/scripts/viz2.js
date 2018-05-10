// ====== Data Visualization II ======
//
// What are the most popular Hubway stops?

//CREATE MAP (COORDINATES[LAT, LONG], AMT OF ZOOM(1=WHOLE GLOBE & 12.8=SEE CAMBRIDGE))

//LEAFLET== L (LOOK AT LINK AFIKA SENT); USE RADIUS TO ATTRIBUTE POPULARITY TO CIRCLE SIZE

var viz2 = L.map('viz2').setView([42.3581, -71.093198], 12.8);
var circleRefs = [];

//THIS WHOLE BLOCK: MAPBOX WEBSITE CREATES THEMES FOR MAPS
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    //    THEME I WANNA USE
    id: 'mapbox.light',
    //PASSWORD TO ACCESS THE THEME
    accessToken: 'pk.eyJ1IjoiYWZpa2FueWF0aSIsImEiOiJjajN2cDhhemgwMDNwNDZvMnV2aGsybXBiIn0.xMS5RIax-2CoNplp4MX62A'
}).addTo(viz2);

function buildVizTwo (stationData, counterData) {
    // TO GET RED CIRCLES
    var ctr = counterData;
    var keysSorted = Object.keys(ctr).sort(function(a,b){return ctr[a]-ctr[b]}).reverse();
    
    //normalize radius size to be between 10 and 50
    var maxstat   = d3.max(Object.values(ctr));
    var minstat   = d3.min(Object.values(ctr));
    var scale = d3.scaleLinear().domain([minstat, maxstat]).range([10, 150]);
    var radius=  _.map(radius, function(x) {return scale(x)})
    
    function addCircles (start, end){
        for (var i = start; i < end; i++) {
        name= keysSorted[i]
        var station = stationData[name];
        
       var circleRef = L.circle([station.lat, station.long], 
        {color: '#a9206a',
        fillColor: '#a9206a',
        fillOpacity: 0.5,
        radius: scale(ctr[name]), 
        })
    .addTo(viz2)};
    
    circleRefs.push(circleRef);
    }
    // to cap off highest number you wanna see
    function removeCircles(cap){
        
        // we will remove everything after cap to keep 1st up until cap
        var removeCircles = circleRefs.slice(cap)
        
        for (var circ in removeCircles){
            circ.remove()
        }
    }
    
    addCircles(0,10)
    
    // TO GET GREEN CIRCLES
    for (var stationName in stationData) {
        var station = stationData[stationName];
        L.circle([station.lat, station.long], 
            {color: '#289699',
            fillColor: '#289699',
            fillOpacity: 1,
            radius: 30}
                ).bindPopup("<b>" + stationName + "</b>", {'autoClose': false})
        .on('mouseover', function (e) {
            this.openPopup(); })
        .on('mouseout', function (e) {
            this.closePopup(); })
        .addTo(viz2);
    }
    
    d3.select('#viz2-input-container').append('input')
        .attr('id', 'viz2-input')
		.attr('type', 'range')
		.attr('name', 'slider')
		.attr('min', minstat)
		.attr('max', maxstat)
		.attr('step', 1)
		.attr('value', 10);
    
    d3.select('#viz2-input').on("change", function() {
        console.log(3);
	   var value = Math.round(this.value);
        if (value == circleRefs.length) {
            return;
        }
        else if (value > circleRefs.length) {
            //  add circles
            addCircles(circleRefs.length, value)
            
        } else {
            // remove circles
            removeCircles(value)
        }
	});

}


