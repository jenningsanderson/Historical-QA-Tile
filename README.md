# Full History OSM-QA Tiles?

Guessing a user's _home location_ is a very complicated task. It has been attempted many different ways in the past. This repository tackles two problems:

1. Can we embed full-history into a an `mbtiles` file format so that we can use the parallel power of tile-reduce to analyze historical OSM data?

1. Can looking at the details of the tags that a user adds or changes on the map be enough to tell us about their home location?

## Status

 - Can successfully get the area of Boulder, CO into an `.mbtiles` format with the following arguments: 
 
        $ tippecanoe -o boulder_history.mbtiles -Pf -ps -pt -pf -pk -Z12 -z12 -d14 -l osm -n osm boulder_history.geojsonl
        
 - Working with the state of CO (osm history file is ~100MB with 2.7M ways, 1.4M unique ways and 3.6M unique nodes) requires > 45GB of RAM. Ouch. This will not scale very well as is, the full-history file itself is 50+GB, CO represents 0.2% of the file. If we cut the world up into sections the size of CO, it will take about 15+ days to run the planet on a 32 core server with 128GB of RAM. The good news... we could probably do this?


 - 201,534 is the maximum length of a string (characters) that gets encoded by tippecanoe. The `@object_history` object in the tile is passed to tile-reduce as a string and needs to be parsed back to JSON. It consistently fails with strings of this length.

 - Can currently process the state of Colorado for a list of editors and a count of the `name` tags they have added to existing objects in 11 seconds!
 
 
 
 

## Current Schema 

```javascript
properties: {
  // Same as current format...
  @id: <#>,
  @user: <str>,
  @uid: <#>,
  @version: 5,
  @changeset: <#>
  tag_1: <str>,
  tag_2: <str>,
  tag_3: <#>,
  ...

  // New stuff... (This will only exist if there is history for this object)
  *@object_history: [
    {
      version: 1,
      user: user1,
      uid: <#>,
      changeset: <#>,
      created_at: <isodate>,
      *tags_added: {
        'created_by':'JOSM'
      },
      *geometry: {   // If the geometry of the object at creation is different than the current, then store the original as the 'new' value in the first history.
        new: <geojson /*first geometry*/>,
    },
    {
      version: 2,
      user: user2,
      uid: <#>,
      changeset: <#>,
      created_at: <isodate>,
      *new_tags: { 
        'highway':'tertiary' 
      },
      seconds_since_last_edit: <#>
    },
    {
      version: 3,
      user: user3,
      uid: <#>,
      changeset: <#>,
      created_at: <isodate>,
      *new_tags: { 
        'speed':'35mph' 
      },
      *changed_tags: { //An example of a road that was upgraded from tertiary to secondary in this change.
        'highway': ['tertiary','secondary'] 
      },
      seconds_since_last_edit: <#>
    },
    {
      version: 4,
      user: user4,
      uid: <#>,
      changeset: <#>,
      created_at: <isodate>,
      *deleted_tags: {
        speed: '35mph',
      }
      *geometry_change: { //This user extended the road 500 meters.
        old: <geojson /* geometry as it existed in version 3 (which is the same as geometry from version 1)*/ >,
        new: <geojson /* geometry of longer road*/>
      },
      seconds_since_last_edit: <#>
    },
    {
      version: 5,
      //This is the current version of the object
      user: user5,
      uid: <#>,
      changeset: <#>,
      created_at: <isodate>,
      *geometry_change: { //This user changed the road to its current geometry
        old: <geojson /* geometry as it was in version4 */>
        new: <geojson /* current geometry */>
      },
      seconds_since_last_edit: <#>
    }
  ]
}
```