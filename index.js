var tileReduce = require('tile-reduce')
var fs = require('fs')
var path = require('path');

//var inFile = '/data/tiles2/planet-20160916.mbtiles'
var inFile = '/home/anderstj/dumpster-fire/test_history.mbtiles'

var outFile = 'tmp.log'

tileReduce({
//     bbox: [-105.301453,39.964348,-105.178093,40.09441],
    zoom: 12,
    map: '/home/anderstj/dumpster-fire/map.js',
    sources: [{
        name: 'osm',
        mbtiles: path.join(inFile), 
        raw: false}],
    output: fs.createWriteStream(outFile),
    maxWorkers: 28
})
.on('reduce', function(cnt) {
})
.on('end', function() {
    console.log('done')
});
null

