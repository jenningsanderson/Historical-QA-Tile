module.exports = function(data, tile, writeData, done) {

    //Extract the osm layer from the mbtile
    var layer = data.osm.osm;

    var nodes = 0;
    
    layer.features.forEach(function(feat){
        if(feat.properties['@object_history']){
            writeData(feat.properties['@id'] + ": " + JSON.parse(feat.properties['@object_history']).length+ "\n")
        }
    });

    done(null, nodes);
};
