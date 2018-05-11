// Script 1

d3.json('assets/data/2017.json', function(error, data) {
    var hours = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    for (var i = 0; i < data.length; i++) {
        let hour = data[i]['starttime'].split(" ")[1].split(":");
        hours[parseInt(hour[0])] += 1;
    }

    for (var i = 0; i < hours.length; i++) {
        hours[i] = Math.round(hours[i]/365);
    }

    download(JSON.stringify(hours), 'viz4.json', 'application/json');
});

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
