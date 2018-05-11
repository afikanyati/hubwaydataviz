// ====== Data Visualization II ======
//
// What are the most popular Hubway stops?

//CREATE MAP (COORDINATES[LAT, LONG], AMT OF ZOOM(1=WHOLE GLOBE & 12.8=SEE CAMBRIDGE))

//LEAFLET== L (LOOK AT LINK AFIKA SENT); USE RADIUS TO ATTRIBUTE POPULARITY TO CIRCLE SIZE

let viz2 = L.map('viz2').setView([42.3581, -71.093198], 12.8);
let circleRefs = [];

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
    let ctr = counterData;
    let keysSorted = Object.keys(ctr).sort(function(a,b){return ctr[a]-ctr[b]}).reverse();

    // TO GET GREEN CIRCLES
    for (var stationName in stationData) {
        var station = stationData[stationName];
        L.circle([station.lat, station.long],
            {color: '#289699',
            fillColor: '#289699',
            fillOpacity: 1,
            radius: 30
        })
        .bindPopup("<b>Hubway Stop:</b> " + stationName + "<br><b>Trips: </b>" + ctr[stationName] + "<b>", {'autoClose': false})
        .on('mouseover', function (e) {
            this.openPopup(); })
        .on('mouseout', function (e) {
            this.closePopup(); })
        .addTo(viz2);
    }

    //normalize radius size to be between 10 and 50
    let extent   = d3.extent(Object.values(ctr));
    let scale = d3.scaleLinear().domain(extent).range([35, 180]);

    function addCircles(start, end) {
        let circleRef;
        for (let i = start; i < end; i++) {
            let name= keysSorted[i];
            let station = stationData[name];
            circleRef = L.circle([station.lat, station.long],
                {
                    color: '#a9206a',
                    fillColor: '#a9206a',
                    fillOpacity: 0.5,
                    radius: scale(ctr[name])
                })
                .bindPopup("<b>Hubway Stop:</b> " + name + "<br><b>Trips: </b>" + ctr[name] + "<b>", {'autoClose': false})
                .on('mouseover', function (e) {
                    this.openPopup(); })
                .on('mouseout', function (e) {
                    this.closePopup(); })
                .addTo(viz2);
            circleRefs.push(circleRef);
        };
    }

    // to cap off highest number you wanna see
    function removeCircles(cap) {
        // we will remove everything after cap to keep 1st up until cap
        var removeCircles = circleRefs.slice(cap);
        circleRefs = circleRefs.slice(0, cap);

        for (let i = 0; i < removeCircles.length; i++) {
            removeCircles[i].remove();
        }
    }

    addCircles(0,10);

    d3.select('#viz2-input-container').append('input')
        .attr('id', 'viz2-input')
        .attr('class', 'slider')
		.attr('type', 'range')
		.attr('name', 'slider')
		.attr('min', 0)
		.attr('max', Object.keys(stationData).length)
		.attr('step', 1)
		.attr('value', 10);
    d3.select('#viz2-input-container').append('p')
        .attr('id', 'viz2-input-value')
        .text(10)

    d3.select('#viz2-input').on("change", function() {
        let value = Math.round(this.value);
        // Change text change
        d3.select('#viz2-input-value')
            .text(value);

        if (value == circleRefs.length) {
            // do nothing
            return;
        } else if (value > circleRefs.length) {
            //  add circles
            addCircles(circleRefs.length, value);
        } else {
            // remove circles
            removeCircles(value);
        }
	});

}
