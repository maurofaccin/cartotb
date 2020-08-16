var map = L.map('mapid').setView([-5, 28], 4);
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
}).addTo(map);

var lyr = L.tileLayer(
    "../worldmap/world-overlay/{z}/{x}/{y}.png",
    {tms: true, opacity: 1, attribution: "", minZoom: 0, maxZoom: 10}
).addTo(map);

map.on('click', function() { window.open('worldmap'); })
