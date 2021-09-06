var map = L.map(
    'mapid',
    {
        zoom: loc_data.get("zoom"),
        center: loc_data.get("center"),
    }
);

// get base map {positron}
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
}).addTo(map);

//  .. White background
var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==", {minZoom: 0});

var baseLayers = {
        "CartoDB Positron": CartoDB_Positron,
        "White background": white,
};
var control = L.control.layers(baseLayers, {}).addTo(map);

// incidence layer
inc_layer = L.vectorGrid.protobuf("/cartotb/worldmap/regions/" + mapcode + "/{z}/{x}/{y}.pbf", {
        vectorTileLayerStyles: {
                incidence: function(properties, zoom){
                        return {
                                fillColor: properties.fill,
                                fill: true,
                                fillOpacity: properties["fill-opacity"],
                                color: properties.stroke,
                                opacity: properties["stroke-opacity"],
                                weight: 1
                        }
                }
        },
}).addTo(map);
inc_layer.setZIndex(20);

// utility function to get and draw a geojson
function loadJSON(url, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                        callback(xobj.responseText);
                }
        };
        xobj.send(null);
}

// utility function to get the features styles
function featStyle(feat, interactive=false) {
        return {
                color: feat.properties.stroke || "#000000",
                fillOpacity: feat.properties["fill-opacity"] || 0.2,
                fillColor: feat.properties.fill || "#555555",
                opacity: feat.properties["stroke-opacity"] || 0.5,
                weight: feat.properties["stroke-width"] || 2,
                interactive: interactive || false,
        };
};

// draw the health zones
loadJSON("/cartotb/worldmap/regions/" + mapcode + "/hzones.geojson", function(response) {
    var hzones_data = JSON.parse(response);
    hzones_layer = new L.GeoJSON(hzones_data, {
        style: function (feature) { return featStyle(feature, interactive=true) }
    });
    hzones_layer.bindTooltip(function (layer) {
        return "<b>" + layer.feature.properties.title + "</b><br>"
    });
    // hzones_layer.setZIndex(11);
    control.addOverlay(hzones_layer, 'Health Zones');
});

// Add the satellite layer for cities
L.tileLayer(
    "/cartotb/worldmap/cities/" + mapcode + "/{z}/{x}/{y}.png",
    {tms: true, opacity: 0.7, attribution: "", minZoom: 12.1, maxZoom: 17}
).addTo(map);

// draw districts
function titlecase(text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
}

if (typeof loc_data.get("borders") !== 'undefined') {
    var borders = loc_data.get("borders");
    for (bkey of Object.keys(borders)) {
        console.log(bkey, borders[bkey]);
        loadJSON("/cartotb/worldmap/cities/" + mapcode + "/" + borders[bkey], function(response) {
            var adm_data = JSON.parse(response);
            var adm_layer = new L.GeoJSON(adm_data, {
                style: function (feature) { return featStyle(feature, interactive=true) }
            });
            adm_layer.bindTooltip(function (layer) {
                var text ="Sector: " + layer.feature.properties.ADM3_EN + "<br>Dist: " + layer.feature.properties.ADM2_EN
                if (typeof layer.feature.properties.ADM4_EN !== "undefined")
                    text = "Cell: " + layer.feature.properties.ADM4_EN + "</br>" + text
                return text
            });
            if (typeof adm_data.features[0].properties.ADM4_EN !== "undefined" )
                control.addOverlay(adm_layer, 'Cell borders');
            else
                control.addOverlay(adm_layer, 'Sector borders');
        });
    }
}

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
        grades = [0.1, 0.32, 0.5, 1],
        colors = ['#ffffcc', '#febf5a', '#f43d25', '#800026'];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<b>INC RATE:</b><br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '; opacity:1;"></i>' + grades[i] + '%<br>';
    }

    return div;
};

legend.addTo(map);

var position = L.control({position: 'bottomleft'});
position.onAdd = function (map) {
        var div = L.DomUtil.create('div', '');
        div.id = 'position';
        div.innerHTML = '<small><div id="posZoom">Zoom: ' + map.getZoom() + '</div><div id="posLatLng"></div></small>';
        return div;
};
map.on('mousemove', function(e){
        div = L.DomUtil.get('posLatLng');
        div.innerHTML = 'Lat ' + Number.parseFloat(e.latlng.lat).toFixed(2) +
                ' Lng ' + Number.parseFloat(e.latlng.lng).toFixed(2);
});
map.on('zoom', function(e){
        div = L.DomUtil.get('posZoom');
        div.innerHTML = ' Zoom: ' + map.getZoom();
});
position.addTo(map);
