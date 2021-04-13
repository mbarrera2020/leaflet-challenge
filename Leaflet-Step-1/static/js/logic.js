// get the url for the earthquake data
// reference main URL -- https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// var queryURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=2019-01-02&maxlongitude=170.52148437&minlongitude=-150.83789062&maxlatitude=80.74894534&minlatitude=-85.16517337"

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
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  }
);
console.log(earthquakes)
  
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function to create 6 color grades for earthquake magnitudes for circle markers.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function magnitudeColors(color) {
//   if (color < 1){return "#B7DF5F"}
//   else if (color < 2){return "#DCED11"}
//   else if (color < 3){return "#EDD911"}
//   else if (color < 4){return "#EDB411"} 
//   else if (color < 5 ){return "#ED7211"}
//   else {return "#ED4311"}
// };

// *********************************************
// create a function that creates markers
// function createCircleMarker(feature, latlng ){

//   // Change the values of these options to change the symbol's appearance
//     var markerOptions = {
//       radius: markerSize(feature.properties.mag),
//       fillColor: magnitudeColors(feature.properties.mag),
//       color: "black",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//     }
//     return L.circleMarker( latlng, markerOptions );
//   };

// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // *******************************************************************************
  // create circle markers
  // NOTE:  
  //   Data markers should reflect the magnitude of the earthquake by their size 
  //   and depth of the earth quake by color. Earthquakes with higher magnitudes 
  //   should appear larger and earthquakes with greater depth should appear darker 
  //   in color.
  // *******************************************************************************
  // function markerSize(mag){
  //   return mag * 5
  // }

// // ````````````````````````````````````````````````````````````````````````````````  
// // Loop through the locations and create one marker for each location / earthquake
// // ````````````````````````````````````````````````````````````````````````````````
// for (var i = 0; i < cities.length; i++) {
//   L.circle(cities[i].location, {
//     fillOpacity: 0.75,
//     color: "white",
//     fillColor: magnitudeColors(feature.properties.mag),
//     // Setting our circle's radius equal to the output of the markerSize function
//     // This will make the marker's size proportionate to the earthquake magnitude
//     radius: markerSize(feature.properties.mag),
//   }).bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Population: " + cities[i].population + "</h3>").addTo(myMap);



} // end bracket for function createMap
