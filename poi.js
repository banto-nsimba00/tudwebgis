var map = L.map('map').setView([53.10054336715068, -6.32801717103338], 9.5);
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>'
      }).addTo(map);

      var owsrootUrl = 'http://webgis-an.sytes.net/geoserver/ows';



    var SecondarySchools = L.tileLayer.wms(owsrootUrl, {
                layers: 'ireland:secondary_schools_wicklow',
                  transparent: true,
                  opacity: 5.5,
                  format: 'image/png'
                }).addTo(map);


      function buildOverpassApiUrl(map, overpassQuery) {
        var bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
        console.log(bounds);
        var nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
        var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
        var relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
        var query = '?data=[out:json][timeout:15];(' + nodeQuery + wayQuery + relationQuery + ');out body geom;';
        var baseUrl = 'http://overpass-api.de/api/interpreter';
        var resultUrl = baseUrl + query;
        return resultUrl;
      }

      $("#query-button").click(function () {
        var queryTextfieldValue = $("#query-textfield").val();
        var overpassApiUrl = buildOverpassApiUrl(map, queryTextfieldValue);

        $.get(overpassApiUrl, function (osmDataAsJson) {
          var resultAsGeojson = osmtogeojson(osmDataAsJson);
          var resultLayer = L.geoJson(resultAsGeojson, {
            style: function (feature) {
              return {color: "#ff0000"};
            },
            filter: function (feature, layer) {
              var isPolygon = (feature.geometry) && (feature.geometry.type !== undefined) && (feature.geometry.type === "Polygon");
              if (isPolygon) {
                feature.geometry.type = "Point";
                var polygonCenter = L.latLngBounds(feature.geometry.coordinates[0]).getCenter();
                feature.geometry.coordinates = [ polygonCenter.lat, polygonCenter.lng ];
              }
              return true;
            },
            onEachFeature: function (feature, layer) {
              var popupContent = "";
              popupContent = popupContent + "<dt>@id</dt><dd>" + feature.properties.type + "/" + feature.properties.id + "</dd>";
              var keys = Object.keys(feature.properties.tags);
              keys.forEach(function (key) {
                popupContent = popupContent + "<dt>" + key + "</dt><dd>" + feature.properties.tags[key] + "</dd>";
              });
              popupContent = popupContent + "</dl>"
              layer.bindPopup(popupContent);
            }
          }).addTo(map);
        });
      });
      var url = 'webgis-an.sytes.net'
      var legend = L.control({position: 'bottomright'});

          legend.onAdd = function (map) {
              var div = L.DomUtil.create('div', 'info legend');
                  div.innerHTML += '<b>Secondary School</b><br>Level</br>'
                  div.innerHTML +=
                  '<img src="https://' + url + '/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=secondary_schools_wicklow" alt="legend" width="100" height="105">';
              return div;
          };
          legend.addTo(map);
