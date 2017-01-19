var turf = require("turf") 
var _ = require("lodash")

module.exports = function(data, tile, writeData, done) {

    //Extract the osm layer from the mbtile
    var layer = data.osm.osm;
    
    var errors = 0;
    
    layer.features.forEach(function(feat){

        writeData(feat.properties['@user']+","+feat.properties['@created_at']+","+feat.properties['@version']+","+feat.properties['@changeset']+"\n")

        if(feat.properties.hasOwnProperty('@object_history')){
            try{
                var history = JSON.parse(feat.properties['@object_history'])
                for(var i=0; i<history.length-1; i++){
                    hist_obj = history[i]
                    writeData(hist_obj.user+","+hist_obj.created_at+","+hist_obj.version+","+hist_obj.changeset+"\n")
                }
            }catch (err) {
                errors++;
            }
        }
    });
    
    done(null, errors)
};
