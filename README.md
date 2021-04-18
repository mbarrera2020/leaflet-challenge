# leaflet-challenge
Leaflet techniques -- Create USGS earthquake map(s) with Leaflet.

Author: Maria Barrera
Date: 04/18/2021

## Dataset:  geojson -- earthquakes URL

## Level 1 -- Basic Visualization: 
1.  Visualize an earthquake data set using USGS GeoJSON.
    Ref:  https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

2.  Import & Visualize the Data

Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

The data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

Note:  The depth of the earth can be found as the third coordinate for each earthquake.

Include popups that provide additional information about the earthquake when a marker is clicked.

Create a legend that will provide context for the map data.

## Level 2 -- More Data: 
Add a second data set on the map to illustrate the relationship between tectonic plates and seismic activity. Pull in a second data set and visualize it along side the original set of data. Data on tectonic plates can be found at https://github.com/fraxen/tectonicplates.

Plot a second data set on the map.

Add a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

Add layer controls to the map.
