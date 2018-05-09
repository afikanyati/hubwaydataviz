// Load Data
d3.queue()
    .defer(d3.json, "assets/data/viz5_stations.json")
    .defer(d3.json, "assets/data/viz5_station_network.json")
    .defer(d3.json, "assets/data/viz5_distinct_trips.json")
    .defer(d3.json, "assets/data/viz6.json")
    .defer(d3.json, "assets/data/viz7.json")
    .defer(d3.json, "assets/data/2017.json")
    .await(loadVisualizations);

function loadVisualizations(error, stationData, networkData, distinctTripsData,viz6Data, viz7Data, yearData) {
    if (error) throw error;
    console.log("Data Loaded!");
    buildVizOne(stationData);
    buildVizTwo(stationData, yearData);
    buildVizThree();
    buildVizFour();
    buildVizFive(stationData, networkData, distinctTripsData);
    buildVizSix(viz6Data);
    buildVizSeven(viz7Data);
}
