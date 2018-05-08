// ====== Data Visualization I ======
//
// Where is Hubway?

// Initialize Leaflet Map
var viz1 = L.map('viz1').setView([42.3581, -71.093198], 15);

// Add Mapbox Light Tile Theme
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiYWZpa2FueWF0aSIsImEiOiJjajN2cDhhemgwMDNwNDZvMnV2aGsybXBiIn0.xMS5RIax-2CoNplp4MX62A'
}).addTo(viz1);

d3.json("assets/data/stations.json", function(error, data) {
    if (error) throw error;
    
    for (let name in data) {
        // Get station name
        var station = data[name];

        // Place Station Marker on Map
        L.circle([station.lat, station.long], {
            color: '#289699',
            fillColor: '#289699',
            fillOpacity: 1,
            radius: 15
        }).bindPopup("<b>" + name + "</b>", {'autoClose': false})
        .on('mouseover', function (e) {
            this.openPopup();
        })
        .on('mouseout', function (e) {
            this.closePopup();
        })
        .addTo(viz1);
    }
});
