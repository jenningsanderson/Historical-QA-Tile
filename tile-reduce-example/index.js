var tileReduce = require('tile-reduce')
var fs = require('fs')
var path = require('path');

//var inFile = '/data/tiles2/planet-20160916.mbtiles'
var inFile = '/home/anderstj/dumpster-fire/nepal_history_no_geometry.mbtiles'

var outFile = fs.createWriteStream('nepal_edit_timetstamps.csv')

outFile.write("user, time, version, changeset\n")

var errors = 0;

tileReduce({
//    bbox: [-105.301453,39.964348,-105.178093,40.09441],
    zoom: 12,
    map: '/home/anderstj/dumpster-fire/map.js',
    sources: [{
        name: 'osm',
        mbtiles: path.join(inFile), 
        raw: false}],
    output: outFile,
    maxWorkers: 28
})
.on('reduce', function(res) {
    errors+= res
})
.on('end', function() {
    console.log("done with " + errors + " errors")
});