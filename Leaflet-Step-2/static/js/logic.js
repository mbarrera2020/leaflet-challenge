// Leaflet-Step-2

// get the url for the earthquake data
// reference main URL -- https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// var queryURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=2019-01-02&maxlongitude=170.52148437&minlongitude=-150.83789062&maxlatitude=80.74894534&minlatitude=-85.16517337"

// url for earthquake in last 7 days -- reference only
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data)
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  // }

  console.log(earthquakeData)
  // Sending earthquakes layer to the createMap function
    createMap(buildCircles(earthquakeData));
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    // zoom: 7,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  })
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control -- upper right radio buttons for (Street & Dark Map)
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//-----------------------------------------------------------------------------------------
// ** since legend is not run as a function, put code as part of the Create Map Function
// // *************************************************************************************
// // Map LEGEND code section
// // Reference -- legend code from student activity 17-Day2-Activities4
// // *************************************************************************************
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  // -- if using geojson
  // var limits = geojson.options.limits;
  // var colors = geojson.options.colors;

  // -- use this for testing
  var limits = [0, 1, 2, 3, 4, 5];
  var colors = ["greenyellow", "lemonchiffon", "moccasin", "orange", "darkorange", "red"];

  // var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
  // var colors = ["#AEF48B", "E5F48B", "F4F48B", "F4DA8B", "EAB412", "EA4C12"];

  var labels = [];
  // var labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];

  // Add min & max
  var legendInfo = "<h5>Mag (0, 1, 2, 3, 4, 5+)" +
    "<div class=\"labels\">" +
      // "<div class=\"min\">" + limits[0] + "</div>" +
      // "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  div.innerHTML += labels.join("");
  return div;
};

// Adding legend to the map
legend.addTo(myMap);

//----------- end of legend code ----------

} // end of function createMap

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function to create 6 color grades for earthquake magnitudes for circle markers.
// Color reference:  
// 1) https://www.rapidtables.com/web/color/html-color-codes.html
// 2) http://www.2createawebsite.com/build/hex-colors.html
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// function magnitudeColors(color) {
//   if (color > 5){return "red"}
//   else if (color > 4){return "darkorange"}
//   else if (color > 3){return "orange"}
//   else if (color > 2){return "moccasin"} 
//   else if (color > 1 ){return "lemonchiffon"}
//   else {return "greenyellow"}
// };

function magnitudeColors(color) {
  if (color > 5 ){return "greenyellow"}
  else if (color > 4){return "lemonchiffon"}
  else if (color > 3){return "moccasin"}
  else if (color > 2){return "orange"} 
  else if (color > 1 ){return "darkorange"}
  else {return "red"}
};

// function magnitudeColors(color) {
//   if (color < 1){return "greenyellow"}
//   else if (color < 2){return "lemonchiffon"}
//   else if (color < 3){return "moccasin"}
//   else if (color < 4){return "orange"} 
//   else if (color < 5 ){return "darkorange"}
//   else {return "red"}
// };

  // *******************************************************************************
  // Create circle markers
  // NOTE:  
  //   Data markers should reflect the magnitude of the earthquake by their size 
  //   and depth of the earthquake by color. Earthquakes with higher magnitudes 
  //   should appear larger and earthquakes with greater depth should appear darker 
  //   in color.
  // *******************************************************************************
  function markerSize(mag){
    return mag * 35000
  }

  // // ````````````````````````````````````````````````````````````````````````````````  
  // // Loop through the locations and create one marker for each location / earthquake.
  // // Note:
  // // Data markers should reflect the magnitude of the earthquake by their size and 
  // // depth of the earthquake by color. Earthquakes with higher magnitudes should 
  // // appear larger and earthquakes with greater depth should appear darker in color.
  // // ````````````````````````````````````````````````````````````````````````````````
  function buildCircles(earthquakes){
    circlearray = []
    console.log("function buildCircles in process... ")
    
  for (var i = 0; i < earthquakes.length; i++) {
    circlearray.push(

    L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "lightgrey",
      // stroke:false,
      // fill: true,
      
      // -- depth of earthquake -- color
      fillColor: magnitudeColors([earthquakes[i].geometry.coordinates[2]]), 

      // -- magnitude -- size of circle 
      radius: markerSize(earthquakes[i].properties.mag),

      // -- bind earthquake info
    }).bindPopup ("<h3>" + earthquakes[i].properties.place + 
          "<h3> Magnitude: " + earthquakes[i].properties.mag +
          "<h3> Depth: " + earthquakes[i].geometry.coordinates[2] +
          "</h3><hr><p>" + new Date(earthquakes[i].properties.time) + "</p>")
    ) // end of push
  }
  console.log(circlearray.length)
  console.log("Magnitude = ")
  console.log(markerSize)
  
  // .addTo(myMap);
  return L.layerGroup(circlearray)
  
} // end bracket for function createMap

