// Load Data
d3.queue()
    .defer(d3.json, "assets/data/viz2_counter.json")
    .defer(d3.json, "assets/data/viz5_stations.json")
    .defer(d3.json, "assets/data/viz5_station_network.json")
    .defer(d3.json, "assets/data/viz5_distinct_trips.json")
    .defer(d3.json, "assets/data/viz6.json")
    .defer(d3.json, "assets/data/viz7.json")
    .defer(d3.json, "assets/data/viz3_stations.json")
    .defer(d3.json, "assets/data/viz3_links.json")

    .await(loadVisualizations);

function loadVisualizations(error, counterData, stationData, networkData, distinctTripsData,viz6Data, viz7Data, viz3_stations, viz3_links) {
    if (error) throw error;
    console.log("Data Loaded!");
    buildVizOne(stationData);
    buildVizTwo(stationData, counterData);
    buildVizThree(viz3_stations,viz3_links);
    buildVizFour();
    buildVizFive(stationData, networkData, distinctTripsData);
    buildVizSix(viz6Data);
    buildVizSeven(viz7Data);
}
