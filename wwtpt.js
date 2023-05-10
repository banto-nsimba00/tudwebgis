var url = 'webgis-an.sytes.net'
var owsrootUrl = 'https://' + url + '/geoserver/ows';


var map = L.map('map').setView([53.10054336715068, -6.32801717103338], 9.5);

    var osmMap =
		L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

    var markers = L.markerClusterGroup();





    var wfsData = new L.GeoJSON();



    var owsrootUrl = 'http://webgis-an.sytes.net/geoserver/ows';



  var SecondarySchools = L.tileLayer.wms(owsrootUrl, {
              layers: 'ireland:secondary_schools_wicklow',
                transparent: true,
                opacity: 5.5,
                format: 'image/png'
              }).addTo(map);



    var defaultParameters = {
        service : 'WFS',
        version : '2.0',
        request : 'GetFeature',
        typeName : 'ireland:bus_stops',
        outputFormat : 'text/javascript',
        format_options : 'callback:getJson',
        SrsName : 'EPSG:4326'
    };

    var parameters = L.Util.extend(defaultParameters);
    var URL = owsrootUrl + L.Util.getParamString(parameters);

    console.log('UR');
    var WFSLayer = null;
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#f25c5c',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        //info.update(layer.feature.properties); // Update info control with data (uncomment with control enabled)
    }

    function resetHighlight(e) {
        wfsData.resetStyle(e.target);

        //info.update(); // Update info control (uncomment with control enabled)
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }




    var ajax = $.ajax({
        url : URL,
        dataType : 'jsonp',
        jsonpCallback : 'getJson',
        success : function (response) {
            WFSLayer = L.geoJson(response, {
              onEachFeature: function (feature, layer) {
                popupOptions = {maxWidth: 200};
                layer.bindPopup("<b>Bus Stop:</b> " + feature.properties.commonname, popupOptions);
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
               }
            })
            markers.addLayer(WFSLayer).addTo(map);
            }
    });
var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<b>Secondary School</b><br>Level</br>'
            div.innerHTML +=
            '<img src="https://' + url + '/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=secondary_schools_wicklow" alt="legend" width="100" height="105">';
        return div;
    };
    legend.addTo(map);
