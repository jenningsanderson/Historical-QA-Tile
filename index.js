var tileReduce = require('tile-reduce')
var fs = require('fs')
var path = require('path');

//var inFile = '/data/tiles2/planet-20160916.mbtiles'
var inFile = '/home/anderstj/dumpster-fire/colorado_history_no_geometry.mbtiles'

var outFile = 'tmp.log'

var final_users = {}

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
.on('reduce', function(users) {
    Object.keys(users).forEach(function(u){
        if(final_users.hasOwnProperty(u)){
            final_users.u += users[u]
        }else{
            final_users[u] = users[u]
        }
    });
})
.on('end', function() {
    var sortable = [];
    for (var user in final_users)
        sortable.push([user, final_users[user]])

    sortable.sort(function(a, b) {
        return a[1] - b[1]
    })
    
    sortable.reverse()
    
    fs.writeFileSync('tag_counts.json',JSON.stringify(sortable))
    console.log('done')
});
null

