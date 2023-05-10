var url = 'webgis-an.sytes.net'
var owsrootUrl = 'https://' + url + '/geoserver/ows';


var map = L.map('map').setView([53.10054336715068, -6.32801717103338], 9.5);

    var osmMap =
		L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);



  var baseLayers = {
    "OpenStreetMap": osmMap,
    };

  var wmsURL = 'http://webgis-an.sytes.net/geoserver/ows';

var SecondarySchools = L.tileLayer.wms(wmsURL, {
            layers: 'ireland:secondary_schools_wicklow',
              transparent: true,
              opacity: 5.5,
              format: 'image/png'
            }).addTo(map);

var Wicklow = L.tileLayer.wms(wmsURL, {
                layers: '	ireland:wicklow_sa',
                transparent: true,
                opacity: 0.5,
                format: 'image/png'
            }).addTo(map);





var markers = L.markerClusterGroup();
var wfsData = new L.GeoJSON();

var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : 'secondary_schools_wicklow',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4326'
};

var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);



function schoolkidsStyle(feature) {
    return {
        color: 'white',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.6,
        fillColor: getColor(feature.properties.level)
    };
}

$.ajax({
    url : URL,
    dataType : 'jsonp',
    jsonpCallback : 'getJson',
    success : function (response) {
        wfsData = L.geoJson(response, {
          style: schoolkidsStyle,
          onEachFeature: function (feature, layer) {
            popupOptions = {maxWidth: 200};
            layer.bindPopup("<b><u>secondary level</u></b><br><br>" +
                    feature.properties.level.toFixed(2) + "% in ", popupOptions);
            layer.on('click', function (e) {
                map.setView(e.latlng, 14) // Add the marker followed by pan and zoom
            });
           }
        })
        markers.addLayer(wfsData).addTo(map);
    }
});










//  legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<b>Small Areas of Wicklow</b><br>Number of 12 - 18 years per SA</br>'
        div.innerHTML +=
        '<img src="https://' + url + '/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=ireland:wicklow_sa" alt="legend" width="70" height="105">';
    return div;
};
legend.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<b>Secondary School</b><br>Level</br>'
        div.innerHTML +=
        '<img src="https://' + url + '/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=secondary_schools_wicklow" alt="legend" width="100" height="105">';
    return div;
};
legend.addTo(map);
