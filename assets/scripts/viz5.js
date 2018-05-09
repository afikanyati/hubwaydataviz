// Data Visualization V
// Do Hubway riders move faster on specific routes?


// Initialize Leaflet Map
let viz5 = L.map('viz5').setView([42.3581, -71.093198], 15);

// Add Mapbox Light Tile Theme
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiYWZpa2FueWF0aSIsImEiOiJjajN2cDhhemgwMDNwNDZvMnV2aGsybXBiIn0.xMS5RIax-2CoNplp4MX62A'
}).addTo(viz5);

// Stores list of all stations visited in 2017
let stations = {};
// Stores a network graph of all stations visited in 2017
let stationNetwork = {};
// Stores the minimum bike speed for calculating d3js color scale
let minSpeed = Infinity;
// Stores the maximum bike speed for calculating d3js color scale
let maxSpeed = -Infinity;
// Stores data on all the currently active geoJSON routes on the map
let geoJSONLayers = [];
// Stores data on all the currently active bicycle markers on the map
let bikeMarkers = [];
// Stores data on all the currently active bicycle intervals
let bikeIntervals = [];
// Stores the d3js color scale
let colorScale;
// Stores distinct start-end station trips in 2017
let distinctTrips = [];
// Stores whether user has currently selected a station
let stationSelected = false;
// Stores currently active station
let activeStation = null;
// Stores currently active station
let activeRoute = null;

function buildVizFive(stationData, networkData, distinctTripsData) {
    // Cache data
    stations = stationData;
    stationNetwork = networkData;
    distinctTrips = distinctTripsData;

    // Place Stations on Map
    for (let name in stationData) {
        // Get station name
        let station = stationData[name];

        // Place Station Marker on Map
        L.circle([station.lat, station.long], {
            color: '#289699',
            fillColor: '#289699',
            fillOpacity: 1,
            radius: 15
        }).bindPopup("<b>" + name + "</b>", {'autoClose': false, closeOnClick: false})
        .on('mouseover', function (e) {
            if (!stationSelected) {
                this.openPopup();
                stationSelected = true;
            }
        })
        .on('mouseout', function (e) {
            if (geoJSONLayers.length == 0 && stationSelected) {
                stationSelected = false;
                this.closePopup();
            }
        })
        .on('click', function(e){
            if (!activeStation) {
                activeStation = name;
                addStationRoutesToMap(name);
            }
        })
        .on('popupclose', function(e) {
            activeStation = null;
            clearGeoJSONLayers();
            clearBikeMarkers();
        })
        .addTo(viz5);
    }

    // Calculate minimum and maximum speeds
    for (let i = 0; i < distinctTrips.length; i++) {
        let start = distinctTrips[i]['start'];
        let end = distinctTrips[i]['end'];
        let avgSpeed = (stationNetwork[start][end]['meters'])/(stationNetwork[start][end].cumulativeTripTime/stationNetwork[start][end].tripCount);
        stationNetwork[start][end]['avgSpeed'] = avgSpeed;

        // Check if lower than min speed
        // Only do if start-end station pair has at least one trip
        if (avgSpeed < minSpeed && Object.keys(stationNetwork[start][end].geoJSON).length > 0) {
           minSpeed = avgSpeed;
        }

        // Check if higher than min speed
        // Only do if start-end station pair has at least one trip
        if (avgSpeed > maxSpeed && Object.keys(stationNetwork[start][end].geoJSON).length > 0) {
           maxSpeed = avgSpeed;
        }
    }

    // Set Color Scale
    let scaleInc = (maxSpeed - minSpeed)/2;
    colorScale = d3.scaleLinear().domain([minSpeed - scaleInc, minSpeed, minSpeed + scaleInc, maxSpeed, maxSpeed + scaleInc]).range(["#fdf5a6", "#f7dc6a", "#ef6945", "#b73227", "#b21e45"]);
};

// ===== Helper Functions =====

// Adds Trip Routes from a Given Station to the Map
// [string] name: name of start station
function addStationRoutesToMap(name) {
    let station = stationNetwork[name];
    let destinations = Object.keys(station);

    // Add routes to map
    destinations.forEach(function(end, i) {
        let route = station[end];

        if (Object.keys(route.geoJSON) == 0) {
            return;
        }
        let avgSpeed = route.meters/(route.cumulativeTripTime/route.tripCount);
        let color = colorScale(avgSpeed);
        let layer = L.geoJSON(route.geoJSON, {
                        style: {
                            "color": color,
                            "weight": 5,
                            "opacity": 0.3
                        }
                    })
                    .on('mouseover', function (e) {
                        this.setStyle({
                            "color": color,
                            "weight": 5,
                            "opacity": 1
                        });
                    })
                    .on('mouseout', function (e) {
                        this.setStyle({
                            "color": color,
                            "weight": 5,
                            "opacity": 0.3
                        });
                    })
                    .addTo(viz5);
        let routePathNum = geoJSONLayers.push(layer) - 1;
        let bikeMarkerNum = startBikeAnimation(route, name, end);
        layer.on('click', function(e) {
            if (activeRoute && _.isEqual(activeRoute, {start: name, end: end})) {
                // Deactivate Route
                activeRoute = null;
                // Show other routes and bikers
                clearGeoJSONLayers();
                clearBikeMarkers();
                addStationRoutesToMap(activeStation);
            } else {
                // Activate Route
                activeRoute = {start: name, end: end};
                // Clear other routes and bikers
                bikeMarkers[bikeMarkerNum[0]].openPopup();
                clearGeoJSONLayers(routePathNum);
                clearBikeMarkers(bikeMarkerNum[0]);
            }
        })
    });
}

// Removes all Trip Routes from the Map
function clearGeoJSONLayers(except) {
    geoJSONLayers.forEach(function(layer, i) {
        if (except == i) {
            return;
        }
        layer.clearLayers();
    });
}

// Removes all Trip Routes from the Map
function clearBikeMarkers(except) {
    bikeMarkers.forEach(function(marker, i) {
        if (except == i) {
            return;
        }
        marker.remove();
        clearInterval(bikeIntervals[i]);
    });
}

// Calculates the distance between two points (given the
// latitude/longitude of those points).
//
// Definitions:
// latitudes are negative, east longitudes are positive
// Passed to function:
//      lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)
//      lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)
//      unit = the unit you desire for results
//              where: 'M' is statute miles (default)
//                     'K' is kilometers
//                     'N' is nautical miles
function coordDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist;
}

function startBikeAnimation(route, start, end) {
    // Create Route Array
    // Segment each route straight line by time it takes to complete
    // Represents a single animation frame
    let coords = [];
    let totalTime = 0;
    let timeFactor = 3;
    let avgSpeed = route.avgSpeed;
    for (let i = 0; i < route.geoJSON.coordinates.length - 1; i++) {
        let lat1 = route.geoJSON.coordinates[i][1];
        let long1 = route.geoJSON.coordinates[i][0];
        let lat2 = route.geoJSON.coordinates[i+1][1];
        let long2 = route.geoJSON.coordinates[i+1][0];
        let d = coordDistance(lat1, long1, lat2, long2, 'K') * 1000;
        let time = (route.cumulativeTripTime/route.tripCount) * d/route.meters;
        time = Math.floor(time/timeFactor);
        let latInc = (lat2 - lat1)/time;
        let longInc = (long2 - long1)/time;
        for (let j = 0; j < time; j++) {
            coords.push([lat1 + j*latInc, long1 + j*longInc]);
        }
    }

    let second = 0; // Current second being animated
    let bikeNum = [-1]; // Index of bike circle in bikeMarkers array

    let interval = setInterval(function() {
            if (second == 0 && bikeNum[0] == -1) {
                // Assign color
                let color = '#a9206a';
                if (avgSpeed == maxSpeed) {
                    color = '#ea204e';
                } else if (avgSpeed == minSpeed) {
                    color = '#fdf5a6';
                }

                let bike = L.circle([coords[second][0], coords[second][1]], {
                        color: color,
                        fillColor: '#741b56',
                        fillOpacity: 1,
                        radius: 8
                    })
                    .bindPopup("<b>Start:</b> " + start + "<br><b>End:</b> " + end + "<br><b>Average Speed:</b> " + Math.round(route.avgSpeed * 100) / 100 + " m/s")
                    .addTo(viz5);

                // Add bike marker
                bikeNum[0] = bikeMarkers.push(bike) - 1;
            } else {
                bikeMarkers[bikeNum[0]].setLatLng([coords[second][0], coords[second][1]]);
                bikeMarkers[bikeNum[0]].redraw();
            }

            if (second + 1 == coords.length) {
                second = 0;
            } else {
                second += 1;
            }
        }, 100);
    bikeIntervals.push(interval);
    return bikeNum;
}
