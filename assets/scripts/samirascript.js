//I WANNA CREATE A MAP (COORDINATES[LAT, LONG], AMT OF ZOOM (1=WHOLE GLOBE AND 12.8 IS ENOUGH TO SEE CAMBRIDGE))

//LEAFLET== L (LOOK AT LINK AFIKA SENT); USE RADIUS TO ATTRIBUTE POPULARITY TO CIRCLE SIZE

var mymap = L.map('mapid').setView([42.3581, -71.093198], 12.8);

//THIS WHOLE BLOCK: MAPBOX WEBSITE CREATES THEMES FOR MAPS
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    //    THEME I WANNA USE
    id: 'mapbox.light',
    //PASSWORD TO ACCESS THE THEME
    accessToken: 'pk.eyJ1IjoiYWZpa2FueWF0aSIsImEiOiJjajN2cDhhemgwMDNwNDZvMnV2aGsybXBiIn0.xMS5RIax-2CoNplp4MX62A'
}).addTo(mymap);

//CREATES THE HUBWAY ICON (SAVED WITHIN ASETS FOLDER)
//APPARENTLY LOGO NEEDS SHADOWS
var hubwayIcon = L.icon({
    iconUrl: 'assets/images/hubway-logo.png',
    shadowUrl: 'assets/images/hubway-logo-shadow.png',
//DEFINING SIZE OF LOGO
    iconSize:     [38, 38], // size of the icon
    shadowSize:   [38, 38], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [-10, -2],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
//USING D3: STATIONS.JSON WITH EVERY STATION AND ALL OF ITS INFO BUT NOW USE ONLY 2017 DATA SO NOT STATION.JSON
d3.json("assets/data/2017.json", function(error, data) {
    for (var stationName in data) {
        var station = data[stationName];
        L.marker([station.lat, station.long], {icon: hubwayIcon}).addTo(mymap);
    }
});
