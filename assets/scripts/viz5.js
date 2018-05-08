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

// geoJSON styling for trip routes
let routeStyle = {
    "color": "",
    "weight": 5,
    "opacity": 0.3
};

// Stores list of all stations visited in 2017
let stations = {};
// Stores a network graph of all stations visited in 2017
let stationNetwork = {};
// Stores the minimum bike speed for calculating d3js color scale
let minSpeed = Infinity;
// Stores the maximum bike speed for calculating d3js color scale
let maxSpeed = -Infinity;
// Stores route promises from OSRM api for all trips in 2017
let routePromises = [];
// Stores the start station and end station data for each route promise. Indices should correspond.
let routes = [];
// Stores data on all the currently active geoJSON routes on the map
let geoJSONLayers = [];
// Stores data on all the currently active bicycle markers on the map
let bikeMarkers = [];
// Stores data on all the currently active bicycle intervals
let bikeIntervals = [];
// Stores the d3js color scale
let colorScale;
// Stores whether user has currently selected a station
let stationSelected = false;

// Load Data
d3.queue()
    .defer(d3.json, "assets/data/stations.json")
    .defer(d3.json, "assets/data/hubway_station_network.json")
    .defer(d3.json, "assets/data/2017.json")
    .await(buildVizFive);

function buildVizFive(error, stationData, networkData, yearData) {
    if (error) throw error;

    console.log("Getting Station Data...");
    // Cache data
    stations = stationData;
    stationNetwork = networkData;

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
        }).bindPopup("<b>" + name + "</b>", {'autoClose': false})
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
        .on('click', addStationRoutesToMap.bind({}, name))
        .on('popupclose', function(e) {
            if (geoJSONLayers.length > 0) {
                clearGeoJSONLayers();
                clearBikeMarkers();
            }
        })
        .addTo(viz5);
    }

    // Calculate average speeds between two stops
    // Add trip routes to map
    // Sum Trip Durations
    console.log("Summing Trip Durations...");
    for (let i = 0; i < yearData.length; i++) {
        let start = yearData[i]['start station name'];
        let end = yearData[i]['end station name'];

        if (start != end) {
            stationNetwork[start][end].cumulativeTripTime += +yearData[i]['tripduration'];
            stationNetwork[start][end].tripCount += 1;
            stationNetwork[end][start].cumulativeTripTime += +yearData[i]['tripduration'];
            stationNetwork[end][start].tripCount += 1;
        }
    }

    // Add route to station network
    // for (let i = 0; i < yearData.length; i++) {
    //     let start = yearData[i]['start station name'];
    //     let end = yearData[i]['end station name'];
    //
    //     // Only calculate if a positive route
    //     if (start != end && stationNetwork[start][end]['avgSpeed'] == 0) {
    //         // Get route
    //         let route = getTripRoute(stations[start].lat, stations[start].long, stations[end].lat, stations[end].long);
    //
    //         let avgSpeed = stationNetwork[start][end]['meters']/(stationNetwork[start][end].cumulativeTripTime/stationNetwork[end][start].tripCount);
    //         stationNetwork[start][end]['avgSpeed'] == avgSpeed;
    //         // Check if lower than min speed
    //         if (avgSpeed < minSpeed) {
    //            minSpeed = avgSpeed;
    //         }
    //
    //         // Check if higher than min speed
    //         if (avgSpeed > maxSpeed) {
    //            maxSpeed = avgSpeed;
    //         }
    //
    //         // Place Route Promise in routePromise Array
    //         routePromises.push(route);
    //         routes.push({start: start, end: end});
    //     }
    // }
    //
    // // Set Color Scale
    // let scaleInc = (maxSpeed - minSpeed)/2;
    // colorScale = d3.scaleLinear().domain([minSpeed - scaleInc, minSpeed, minSpeed + scaleInc, maxSpeed, maxSpeed + scaleInc]).range(["#fdf5a6", "#f7dc6a", "#ef6945", "#b73227", "#b21e45"]);
    //
    // // Calculate route distance
    // // Add routeJSON to routes network
    // Promise.all(routePromises).then(function(promises) {
    //     console.log("Adding Routes to Network...");
    //     promises.forEach(function(route, i) {
    //         let distance = 0;
    //         for (let i = 0; i < route.geometry.coordinates.length - 1; i++) {
    //             let d = coordDistance(route.geometry.coordinates[i][0], route.geometry.coordinates[i][1], route.geometry.coordinates[i+1][0], route.geometry.coordinates[i+1][1]) * 1000;
    //             distance += d;
    //         }
    //         stationNetwork[routes[i]['start']][routes[i]['end']]['geoJSON'] = route.geometry;
    //         stationNetwork[routes[i]['start']][routes[i]['end']]['meters'] = distance;
    //     });
    //     //download(JSON.stringify(stationNetwork), 'hubway_station_network_final.json', 'application/json');
    //     return resolve();
    // });
    console.log("Data Visualization Loaded!");
};

// ===== Helper Functions =====

// Gets shortest path between two lat-long points
// Uses OSRM API
// [string] lat1: latitude of start station (in decimal degrees)
// [string] long1: longitude of start station (in decimal degrees)
// [string] lat2: latitude of end station (in decimal degrees)
// [string] long2: longitude of end station (in decimal degrees)
function getTripRoute (lat1,long1,lat2,long2) {
    let api = new Promise(function(resolve) {
        var request = new XMLHttpRequest();
        var url = "http://router.project-osrm.org/route/v1/bike/" + long1 + "," + lat1 + ";" + long2 + "," + lat2 + "?geometries=geojson";

        fetch(url).then(function(response) {
                return resolve(response.json());
        });
    });

    return api.then(function(result) {
        return result['routes'][0];
    });
}

// Adds Trip Routes from a Given Station to the Map
// [string] name: name of start station
function addStationRoutesToMap(name) {
    let station = stationNetwork[name];
    let destinations = Object.keys(station);

    // Clear Old Routes
    clearGeoJSONLayers();

    // Clear Old Bikes
    clearBikeMarkers();

    // Add routes to map
    Promise.all(routePromises).then(function() {
        destinations.forEach(function(end, i) {
            let route = station[end];
            let avgSpeed = route.meters/(route.cumulativeTripTime/route.tripCount);
            routeStyle.color = colorScale(avgSpeed);
            let layer = L.geoJSON(route.geoJSON, {
                            style: routeStyle
                        })
                        .bindPopup("<b>Start:</b> " + name + "<br><b>End:</b> " + end + "<br><b>Average Speed:</b> " + Math.round(route.avgSpeed * 100) / 100 + " m/s")
                        .on('mouseover', function (e) {
                            routeStyle.opacity = 1;
                            this.setStyle(routeStyle);
                            this.openPopup();
                        })
                        .on('mouseout', function (e) {
                            routeStyle.opacity = 0.3;
                            this.setStyle(routeStyle);
                            this.closePopup();
                        })
                        .addTo(viz5);
            geoJSONLayers.push(layer);
        });
    });
}

// Removes all Trip Routes from the Map
function clearGeoJSONLayers() {
    geoJSONLayers.forEach(function(layer) {
        layer.clearLayers();
    });
    geoJSONLayers = [];
}

// Removes all Trip Routes from the Map
function clearBikeMarkers() {
    bikeMarkers.forEach(function(marker, i) {
        marker.remove();
        clearInterval(bikeIntervals[i]);
    });
    bikeIntervals = [];
    geoJSONLayers = [];
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

function startBikeAnimation(route) {
    // Create Route Array
    let coords = [];
    let totalTime = 0;
    let avgSpeed = route.meters/(route.cumulativeTripTime/route.tripCount);
    for (let i = 0; i < route.geoJSON.coordinates.length - 1; i++) {
        let lat1 = route.geoJSON.coordinates[i][1];
        let long1 = route.geoJSON.coordinates[i][0];
        let lat2 = route.geoJSON.coordinates[i+1][1];
        let long2 = route.geoJSON.coordinates[i+1][0];
        let d = coordDistance(lat1, long1, lat2, long2, 'K') * 1000;
        let time = (route.cumulativeTripTime/route.tripCount) * d/route.meters;
        time = Math.floor(time);
        let latInc = (lat2 - lat1)/time;
        let longInc = (long2 - long1)/time;
        for (let j = 0; j < time; j++) {
            coords.push([lat1 + j*latInc, long1 + j*longInc]);
        }
    }

    let second = 0;
    let bikeNum = -1;
    let interval = setInterval(function() {
            if (second == 0 && bikeNum == -1) {
                let bike = L.circle([coords[second][0], coords[second][1]], {
                        color: '#741b56',
                        fillColor: '#741b56',
                        fillOpacity: 1,
                        radius: 8
                    }).bindPopup("<b>Speed:</b> " + Math.round(avgSpeed * 100) + " m/s", {'autoClose': false})
                    .on('mouseover', function (e) {
                        this.openPopup();
                    })
                    .on('mouseout', function (e) {
                        this.closePopup();
                    })
                    .addTo(viz5);

                // Add bike marker
                bikeNum = bikeMarkers.push(bike) - 1;
            } else {
                bikeMarkers[bikeNum].setLatLng([coords[second][0], coords[second][1]]);
                bikeMarkers[bikeNum].redraw();
            }

            if (second + 1 == coords.length) {
                second = 0;
            } else {
                second += 1;
            }
        }, 10);
    bikeIntervals.push(interval);
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
