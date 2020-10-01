var zoom0 = 3
var zoom1 = 7
var zoom2 = 13

// pull geojsons
function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
function featStyle(feat, interactive=false) {
    return {
        fill: true,
        color: feat.properties.stroke,
        fillColor: feat.properties.fill,
        fillOpacity: feat.properties["fill-opacity"],
        opacity: feat.properties["stroke-opacity"],
        weight: feat.properties["stroke-width"],
        interactive: interactive,
    };
};

function clickFeature(e) {
    var layer = e.target;
    map.fitBounds(layer.getBounds());
    //console.log(layer.feature.properties.name); //country info from geojson
}
function onEachFeature(feature, layer) {
    layer.on({
        click: clickFeature
    });
}
function addLegend(content, entries) {
    for (var i=0; i < entries.length; i++){
        var entry = document.createElement("I");
        entry.style.backgroundColor = cmap[entries[i][0]];
        content.appendChild(entry);
        var text = document.createTextNode(entries[i][1]);
        content.appendChild(text);
        content.appendChild(document.createElement("BR"));
    }
}
function toggleCaption(e) {
    var content = document.getElementById("legend-content");
    if (content) {
        content.remove()
    } else {
        var div = e.target;
        var zoom = map.getZoom()
        var caption = document.createElement("DIV");
        caption.id = "legend-content";
        if (zoom <= zoom0) {
            addLegend(caption, legends["zoom0"]);
            text = document.createTextNode("Country level incidence");
        } else if (zoom <= zoom1) {
            addLegend(caption, legends["zoom1"]);
            text = document.createTextNode("Country level incidence with population distribuion");
        } else if (zoom < zoom2) {
            addLegend(caption, legends["zoom2"]);
            text = document.createTextNode("Incidence from all datasets available");
        } else {
            addLegend(caption, legends["zoom3"]);
            text = document.createTextNode("Incidence from satellite images only");
        }
        textP = document.createElement("P");
        textP.appendChild(text)
        caption.appendChild(textP);
        div.appendChild(caption);
    }
}

function removeCaption() {
    var content = document.getElementById("legend-content");
    if (content) {content.remove();}
}

// Base layers
//  .. OpenStreetMap
var osm = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors', minZoom: 0});

//  .. CartoDB Positron
var cartodb = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>', minZoom: 0});

// .. Imagery
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});

//  .. White background
var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==", {minZoom: 0});

// Overlay layers (TMS)
var lyr = L.tileLayer("/cartotb/worldmap/world-overlay/{z}/{x}/{y}.png", {tms: true, opacity: 1, attribution: "", minZoom: zoom0, maxZoom: zoom1});

var pbfGroup = L.layerGroup();
var cities = L.layerGroup();
var regions = ["cod_lualaba", "cod_skivu", "cod_nkivu", "rwa", "bel"];
var cityBounds = L.layerGroup();
var worldmap = L.layerGroup();

loadJSON("/cartotb/worldmap/world-overlay/world.geojson", function(response) {
    var worldGeojson = JSON.parse(response);
    var world = new L.GeoJSON(worldGeojson, {
        style: function (feature) { return featStyle(feature, true) },
    }).addTo(worldmap);
});

function draw_incidence(region, index) {
    var openmaptilesUrl = "/cartotb/worldmap/regions/" + region + "/{z}/{x}/{y}.pbf";
    var openmaptilesAttribution = '<a href="https://openmaptiles.org/">&copy; OpenMapTiles</a>, <a href="https://maurofaccin.github.io">MauroFaccin</a>';
    var vectorTileOptions = {
        rendererFactory: L.canvas.tile,
        attribution: openmaptilesAttribution,
        maxNativeZoom: 18,
        minZoom: zoom1,
        maxZoom: zoom2,
        vectorTileLayerStyles: {
            "incidence": function(properties, zoom) {
                return {
                    weight: properties["stroke-width"],
                    color: properties.stroke,
                    opacity: properties["stroke-opacity"],
                    fill: true,
                    fillColor: properties.fill,
                    fillOpacity: properties["fill-opacity"]
                }
            },
        },
        interactive: true,    // Make sure that this VectorGrid fires mouse/pointer events
    };
    var pbfLayer = L.vectorGrid.protobuf(openmaptilesUrl, vectorTileOptions).addTo(pbfGroup);

    // add the cities
    var city = L.tileLayer("/cartotb/worldmap/cities/" + region + "/{z}/{x}/{y}.png", {tms: true, opacity: 0.7, attribution: "", minZoom: zoom2 - 0.9, maxZoom: 17}).addTo(cities);

    loadJSON("/cartotb/worldmap/cities/" + region + "/cities.geojson", function(response) {
        var bounds = JSON.parse(response);
        var citylayer = new L.GeoJSON(bounds, {
            style: function (feature) { return featStyle(feature, true) },
            onEachFeature: onEachFeature
        }).addTo(cityBounds);
    });
}
regions.forEach(draw_incidence);

var minzoom = Math.max(
    Math.log2(window.screen.height / 256),
    Math.log2(window.screen.width / 256)
);

// Map
var map = L.map("map", {
    center: [0, 0],
    zoomSnap:0,
    zoomDelta: 1,
    zoom: minzoom,
    minZoom: minzoom,
    zoomControl: false,
    maxBounds: [[-80, -180], [80, 180]],
    layers: [cartodb, worldmap, lyr, pbfGroup, cities]
});

var basemaps = {"CartoDB Positron": cartodb, "OpenStreetMap": osm, "Satellite": Esri_WorldImagery, "Without background": white};
var overlaymaps = {"Countries": worldmap, "Only pop": lyr, "Vector": pbfGroup, "Cities": cities};

// Title
var title = L.control();
title.onAdd = function(map) {
    this._div = L.DomUtil.create("h1", "ctl");
    this.update();
    return this._div;
};
title.update = function(props) {
    this._div.innerHTML = '<a href="https://maurofaccin.github.io/cartotb">CartoTB</a>';
};
title.addTo(map);

// Legend
var cmap = {"col-0": "#ffffcc", "col-1": "#fff3af", "col-2": "#ffe793", "col-3": "#fed976", "col-4": "#febf5a", "col-5": "#fea647", "col-6": "#fd8c3c", "col-7": "#fc6330", "col-8": "#f43d25", "col-9": "#e2191c", "col-10": "#c90823", "col-11": "#a80026", "col-12": "#800026"}
var legends = {
    "zoom0": [["col-0", "0"], ["col-6", "0.3%"], ["col-9", "1%"]],
    "zoom1": [["col-0", "0"], ["col-6", "0.1%"], ["col-12", "1%"]],
    "zoom2": [["col-0", "0.1%"], ["col-4", "0.32%"], ["col-8", "0.5%"], ["col-12", "1%"]],
    "zoom3": [["col-0", "low"], ["col-12", "high"]],
}

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    var legTitle = document.createElement('H3');
    legTitle.appendChild(document.createTextNode('LEGEND'));
    legTitle.style.margin=0;
    div.appendChild(legTitle);
    div.addEventListener("mouseenter", toggleCaption);
    div.addEventListener("mouseleave", toggleCaption);
    div.addEventListener("touchend", toggleCaption);
    return div;
};

legend.addTo(map);

// Add base layers
L.control.layers(basemaps, overlaymaps, {collapsed: true, position: 'topleft'}).addTo(map);
map.on("zoomend", function() {
    var zoom = this.getZoom();
    removeCaption();
    if (zoom <= zoom0) {
        this.addLayer(worldmap);
    } else if (zoom <= zoom1) {
        this.removeLayer(cityBounds);
        this.removeLayer(worldmap);
    } else if (zoom < zoom2) {
        this.addLayer(cityBounds);
    } else {
        this.removeLayer(cityBounds);
    }
});

L.control.zoom({position: "topleft"}).addTo(map);

// Get the modal
var modal = document.getElementById("modal");

function hideModal () {
  modal.style.display = "none";
    console.log('modal hidden');

}
// When the user clicks on <span> (x), close the modal
modal.onclick = hideModal

