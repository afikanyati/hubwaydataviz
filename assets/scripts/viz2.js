// ====== Data Visualization II ======
//
// What are the most popular Hubway stops?


//I WANNA CREATE A MAP (COORDINATES[LAT, LONG], AMT OF ZOOM (1=WHOLE GLOBE AND 12.8 IS ENOUGH TO SEE CAMBRIDGE))

//LEAFLET== L (LOOK AT LINK AFIKA SENT); USE RADIUS TO ATTRIBUTE POPULARITY TO CIRCLE SIZE

var viz2 = L.map('viz2').setView([42.3581, -71.093198], 12.8);

//THIS WHOLE BLOCK: MAPBOX WEBSITE CREATES THEMES FOR MAPS
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    //    THEME I WANNA USE
    id: 'mapbox.light',
    //PASSWORD TO ACCESS THE THEME
    accessToken: 'pk.eyJ1IjoiYWZpa2FueWF0aSIsImEiOiJjajN2cDhhemgwMDNwNDZvMnV2aGsybXBiIn0.xMS5RIax-2CoNplp4MX62A'
}).addTo(viz2);


//USING D3: STATIONS.JSON WITH EVERY STATION AND ALL OF ITS INFO BUT NOW USE ONLY 2017 DATA SO NOT STATION.JSON

function buildVizTwo (stationData, yearData) {

    for (var stationName in stationData) {
        var station = stationData[stationName];
        L.circle([station.lat, station.long], {
            color: '#289699',
            fillColor: '#289699',
            fillOpacity: 1,
            radius: 15
        }).bindPopup("<b>" + stationName + "</b>", {'autoClose': false})
        .on('mouseover', function (e) {
            this.openPopup();
        })
        .on('mouseout', function (e) {
            this.closePopup();
        })
        .addTo(viz2);
    }
}
