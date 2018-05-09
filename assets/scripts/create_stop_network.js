// Script 1

d3.json('assets/data/2018.json', function(error, data) {
    var stations = {};
    for (var i = 0; i < data.length; i++) {
        if (!(data[i]["start station name"] in stations)) {
            stations[data[i]["start station name"]] = {
                name: data[i]["start station name"],
                lat: data[i]["start station latitude"],
                long: data[i]["start station longitude"]
            };
        } else if (!(data[i]["end station name"] in stations)) {
            stations[data[i]["end station name"]] = {
                name: data[i]["end station name"],
                lat: data[i]["end station latitude"],
                long: data[i]["end station longitude"]
            };
        }
    }

    var station_network = {};
    for (var station_A in stations) {
        let a = stations[station_A];
        station_network[station_A] = {};
        for (var station_B in stations) {
            let b = stations[station_B];
            if (station_A == '8D QC Station 01' || station_B == '8D QC Station 01') {
                console.log(stations[station_A], stations[station_B]);
            }
            if (a.name != b.name) {
                station_network[station_A][station_B] = {
                    meters: distance(a.lat, a.long, b.lat, b.long, 'K') * 1000,
                    cumulativeTripTime: 0,
                    tripCount: 0,
                    avgSpeed: 0,
                    popUpOpen: false,
                    geoJSON: {}
                };
            }
        }
    }

    download(JSON.stringify(stations), 'hubway_station_network.json', 'application/json');
});

// This routine calculates the distance between two points (given the
// latitude/longitude of those points). It is being used to calculate
// the distance between two locations using GeoDataSource (TM) prodducts
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
function distance(lat1, lon1, lat2, lon2, unit) {
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
	return dist
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
