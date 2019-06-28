var map = L.map('mapid').setView(center, 8);
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
}).addTo(map);
var osm_hot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
});
var baseLayers = {
        "CartoDB Positron": CartoDB_Positron,
        "OSM Hot": osm_hot,
};
var control = L.control.layers(baseLayers, {}).addTo(map);

// L.vectorGrid.protobuf("http://localhost:1313/cartotb/out/{z}/{x}/{y}.pbf", {
//         vectorTileLayerStyles: {
//                 tbi: function(properties, zoom){
//                         return {
//                                 fillColor: properties.fill,
//                                 fill: true,
//                                 fillOpacity: properties["fill-opacity"],
//                                 color: properties.stroke,
//                                 opacity: properties["stroke-opacity"],
//                                 weight: 1
//                         }
//                 }
//         },
// }).addTo(map);

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

loadJSON(dataUrl + '/missions.json', function(response) {
        var miss = JSON.parse(response);

        var rectangles = new L.FeatureGroup();
        for (var mname in miss){
                var bounds = [[miss[mname]["bounds"][1], miss[mname]["bounds"][0]], [miss[mname]["bounds"][3], miss[mname]["bounds"][2]]];
                L.imageOverlay(miss[mname]["pic"], bounds).addTo(map);
                rec = new L.rectangle(bounds, {}).addTo(rectangles);
                rec.on('click', function(e) {
                        map.setView(e.latlng,  13);
                }
                );
                map.on('zoomend', function(e) {
                        if (map.getZoom() > 12){
                                map.removeLayer(rectangles);
                        }
                        else {
                                map.addLayer(rectangles);
                        }
                });
        };
        map.addLayer(rectangles);
});

function featStyle(feat, interactive=false) {
        return {
                color: feat.properties.stroke,
                fillOpacity: feat.properties["fill-opacity"],
                fillColor: feat.properties.fill,
                opacity: feat.properties["stroke-opacity"],
                weight: feat.properties["stroke-width"],
                interactive: interactive,
        };
};

// var TBInclayer;
loadJSON(dataUrl + '/TBIncidence.json', function(response) {
        var TBIncidence = JSON.parse(response);
        TBInclayer = new L.GeoJSON(TBIncidence, {
                style: function (feature) { return featStyle(feature) }
        }).addTo(map);
        // TBInclayer = L.vectorGrid.slicer(TBIncidence, {
        //     vectorTileLayerStyles: {
        //         sliced: {  },
        //         TBIncidence: function (feature) { return featStyle(feature) }
        //     }
        // }).addTo(map);
        TBInclayer.setZIndex(10);
        control.addOverlay(TBInclayer, 'TB Rate');
});

loadJSON(dataUrl + '/TBIncidenceAbs.json', function(response) {
        var TBIncidenceAbs = JSON.parse(response);
        TBInclayerAbs = new L.GeoJSON(TBIncidenceAbs, {
                style: function (feature) { return featStyle(feature) }
        });
        TBInclayerAbs.setZIndex(9);
        control.addOverlay(TBInclayerAbs, 'TB Cases');
});

loadJSON(dataUrl + '/hz.json', function(response) {
        var hz = JSON.parse(response);
        var HZlayer = new L.GeoJSON(hz, {
                style: function (feature) { return featStyle(feature, true) }
        }).bindTooltip(function (layer) {
                return "<b>" + layer.feature.properties.tbmap_name + "</b><br>" +
                        "Incidence rate: " + layer.feature.properties.tbmap_incidence
        });
        HZlayer.setZIndex(8);
        control.addOverlay(HZlayer, 'Health Zones');
});

loadJSON(dataUrl + '/screening.json', function(response) {
        var screening = JSON.parse(response);
        var screeningLayer = new L.GeoJSON(screening, {
                pointToLayer: function (feature, latlng) {
                        var circ = L.circle(latlng, {
                                radius: 2000,
                                color: "blue",
                                opacity: 0.8,
                                weight: 1,
                                fillColor: "blue",
                                fillOpacity: 0.5
                        }).bindPopup(
                                "<b>" + feature.properties.name + "</b><br>" +
                                "<b>POP:</b>" + feature.properties.pop + "<br>" +
                                "<b>TB:</b>" + feature.properties.tb + "<br>" +
                                "<b>NNS:</b>" + feature.properties.nns
                        );
                        circ.on('mouseover', function (e) {this.openPopup();});
                        circ.on('mouseout', function (e) {this.closePopup();});
                        return circ;
                }
        });
        screeningLayer.setZIndex(7);
        control.addOverlay(screeningLayer, 'Screening');
});

loadJSON(dataUrl + '/mines.json', function(response) {
        var mines = JSON.parse(response);
        var minesLayer = new L.GeoJSON(mines, {
                pointToLayer: function (feature, latlng) {
                        return L.circle(latlng, {
                                radius: feature.properties.radius * 100,
                                color: "black",
                                opacity: 0.5,
                                weight: 1,
                                fillColor: "black",
                                fillOpacity: 0.3
                        });
                }
        });
        minesLayer.setZIndex(6);
        control.addOverlay(minesLayer, 'Mines');
});

loadJSON(dataUrl + '/hfacs.json', function(response) {
        var hfacs = JSON.parse(response);
        var healthIcon = L.icon({
                iconUrl: '../../../tbassets/health-icon.png',

                iconSize:     [28, 40], // size of the icon
                iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, -46] // point from which the popup should open relative to the iconAnchor
        });
        var hfacsLayer = new L.GeoJSON(hfacs, {
                pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {
                                icon: healthIcon
                        }).bindPopup(
                                "<b>" + feature.properties.name + "</b>"
                        );
                }
        });
        hfacsLayer.setZIndex(5);
        control.addOverlay(hfacsLayer, 'Health Facilities');
});

map.on("overlayadd", function(eo) {
        if (eo.name === "TB Rate") {
                setTimeout(function() {
                        map.removeLayer(TBInclayerAbs)
                }, 10);
        } else if (eo.name === "TB Cases") {
                setTimeout(function() {
                        map.removeLayer(TBInclayer)
                }, 10);
        }
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend'),
                grades = [1, 2, 5, 10],
                opacity = [0.1, 0.35, 0.6, 0.7],
                colors = ['#cccc00', '#cc8800', '#cc4400', '#cc0000'];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                        '<i style="background:' + colors[i] + '; opacity:' + opacity[i] + '"></i> >' + grades[i] + 'x<br>';
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

