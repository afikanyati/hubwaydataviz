// Load Data
d3.queue()
    .defer(d3.json, "assets/data/viz2_counter.json")
    .defer(d3.json, "assets/data/viz3_stations.json")
    .defer(d3.json, "assets/data/viz3_links.json")
    .defer(d3.json, "assets/data/viz4.json")
    .defer(d3.json, "assets/data/viz5_stations.json")
    .defer(d3.json, "assets/data/viz5_station_network.json")
    .defer(d3.json, "assets/data/viz5_distinct_trips.json")
    .defer(d3.json, "assets/data/viz6.json")
    .defer(d3.json, "assets/data/viz7.json")
    .await(loadVisualizations);

function loadVisualizations(error, viz2CounterData, viz3StationsData, viz3LinksData, viz4Data, stationData, viz5NetworkData, viz5DistinctTripsData, viz6Data, viz7Data) {
    if (error) throw error;
    console.log("Data Loaded!");
    buildVizOne(stationData);
    buildVizTwo(stationData, viz2CounterData);
    buildVizThree(viz3StationsData,viz3LinksData);
    buildVizFour(viz4Data);
    buildVizFive(stationData, viz5NetworkData, viz5DistinctTripsData);
    buildVizSix(viz6Data);
    buildVizSeven(viz7Data);
}
