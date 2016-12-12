var _ = require("lodash")

module.exports = function(data, tile, writeData, done) {

    //Extract the osm layer from the mbtile
    var layer = data.osm.osm;
    
    var users_adding_names = []
    
    layer.features.forEach(function(feat){
        if(feat.properties.hasOwnProperty('@object_history')){
            try{
                var history = JSON.parse(feat.properties['@object_history'])
                history.forEach(function(hist_obj){
                    if(hist_obj.hasOwnProperty("new_tags") && hist_obj.version>1){
                        if(hist_obj.new_tags.hasOwnProperty('name')){
                            users_adding_names.push(hist_obj.user)
                        }
                    }
                })
            }catch (err) {
                writeData("ERROR " + feat.properties['@object_history'].length+"\n")
            }
        }
    });
    
    var users = _.countBy(users_adding_names)
    writeData(JSON.stringify(users) + "\n")

    done(null, users);
};
