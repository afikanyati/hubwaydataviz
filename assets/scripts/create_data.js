// Create Data File
var trips = [];
var year = 2017;
new Promise(function(resolve) {
    d3.csv("assets/data/" + year + "01-hubway-tripdata.csv", function(error, data) {
        trips = trips.concat(data);
        resolve();
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "02-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "03-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "04-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "05-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "06-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "07-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "08-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "09-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "10-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "11-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    return new Promise(function(resolve) {
        d3.csv("assets/data/" + year + "12-hubway-tripdata.csv", function(error, data) {
            trips = trips.concat(data);
            resolve();
        });
    });
}).then(function() {
    download(JSON.stringify(trips), '2017_large.json', 'application/json');
});

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
