!function(e) {
    function o() {
        var e=r(),
        o=L.layerGroup.collision( {
            margin: 5
        }
        );
        o.addTo(e),
        i("https://asset.wsj.net/wsjnewsgraphics/projects/hurricanemap/currentGeoJSON.json").then(function(e) {
            return a(e)
        }
        ).then(function(r) {
            return n(r, e, o)
        }
        ),
        socialRiser.create(),
        Iframe.init()
    }
    function r() {
        var o=!1;
        e("body").hasClass("template-embed")&&(o=!1);
        var r=new L.Map("mapid", {
            scrollWheelZoom:o, minZoom:3, maxZoom:10, layers:new L.tileLayer("https://{s}.tiles.mapbox.com/v3/wsjgraphics.map-ie50n254/{z}/{x}/{y}{r}.png", {
                attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="http://www.nhc.noaa.gov/">Source: NOAA</a>', detectRetina: !0
            }
            )
        }
        ),
        i=_.debounce(t, 500);
        return t(),
        e(window).resize(function() {
            i(r)
        }
        ),
        r
    }



    function t(o) {
        if(e(".template-standalone #main-wrapper main .content-wrapper #mapid").css("height", e(window).height()-e("#mapid").offset().top-e("footer").outerHeight()), e(".template-embed #main-wrapper main .content-wrapper #mapid").css("height", e(window).height()-e("#mapid").offset().top), "undefined"!=typeof o) {
            var r=m.length,
            t=h.concat(y.slice(r-4, r)),
            i=L.featureGroup(t);


var url = "https://raw.githubusercontent.com/sgiusa/florida/master/g.geojson?123";
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
    if (xhr.status === 200) {
        new L.geoJson(JSON.parse(xhr.responseText)).addTo(map);
    }
};
xhr.send();

            // var markers = L.markerClusterGroup();
            // var geoJsonLayer = L.geoJson(geoJsonData, {
            //     onEachFeature: function (feature, layer) {
            //       layer.bindPopup('working');
            //     }
            // });
            // markers.addLayer(geoJsonLayer);
            // o.addLayer(markers);
            o.fitBounds(i.getBounds())
        }
    }
    function i(o) {
        return e.getJSON(o)
    }
    function a(o) {
        var r=o.features,
        t=wsjCommon.getQuery("storm");
        if(t) {
            var i=_.filter(r, function(e) {
                return e.properties.storm===t
            }
            );
            0!==i.length&&(r=i)
        }
        var a=_.filter(r, function(e) {
            return"Point"==e.geometry.type&&"historical"!=e.properties.source
        }
        ),
        n=_.sortBy(a, function(e) {
            return e.properties.datetime
        }
        ),
        c=_.groupBy(n, function(e) {
            return e.properties.storm
        }
        );
        return e.each(c, function(e) {
            c[e]=c[e][0];
            var o=_.indexOf(r, c[e]);
            r[o].properties.highlight=!0
        }
        ),
        r
    }
    function n(o, r, i) {
        var a="";
        return e.each(o, function(e, o) {
            switch(o.geometry.type) {
                case"LineString":var t=L.geoJSON(o, {
                    style:function(e) {
                        return"historical"==e.properties.source?c(e): u
                    }
                    , onEachFeature:function(e, o) {
                        var r="<strong>"+o.feature.properties.storm+"</strong><br />";
                        o.bindTooltip(r, {
                            sticky: "true", className: "leaflet-popup"
                        }
                        )
                    }
                }
                ).addTo(r);
                "historical"==o.properties.source?y.push(t):h.push(t), m.push(t);
                break;
                case"Polygon":var n=L.geoJson(o, {
                    style:function(e) {
                        return c(e)
                    }
                    , onEachFeature:function(e, o) {
                        var r="<strong>"+o.feature.properties.storm+"</strong><br />";
                        o.bindTooltip(r, {
                            sticky: "true", className: "leaflet-popup"
                        }
                        )
                    }
                }
                ).addTo(r);
                h.push(n), m.push(n);
                break;
                case"Point":var s=L.geoJson(o, {
                    pointToLayer:function(e, o) {
                        var r=L.circleMarker(o, c(e));
                        return r
                    }
                    , onEachFeature:function(e, o) {
                        var t=new L.LatLng(o.feature.geometry.coordinates[1], o.feature.geometry.coordinates[0]);
                        if(o.feature.properties.highlight) {
                            var n=L.marker([o.feature.geometry.coordinates[1], o.feature.geometry.coordinates[0]], {
                                icon: f[o.feature.properties.cat].icon
                            }
                            );
                            r.addLayer(n)
                        }
                        var c="<strong>"+o.feature.properties.storm+"</strong><br /><strong>Intensity</strong>: "+f[o.feature.properties.cat].type+"<br /><strong>Wind speed</strong>: "+o.feature.properties.wind+" mph";
                        if(o.bindTooltip(c, {
                            sticky: "true", className: "leaflet-popup"
                        }
                        ), "historical"!=e.properties.source) {
                            var s=L.marker(t, {
                                clickable:!1, interactive:!1, icon:L.divIcon( {
                                    html: '<div class="leaflet-tooltip">'+p(e.properties.datetime)+"</div>"
                                }
                                )
                            }
                            );
                            if(i.addLayer(s), o.feature.properties.cat!=a) {
                                var l=L.marker(t, {
                                    clickable:!1, interactive:!1, icon:L.divIcon( {
                                        html: '<div class="leaflet-tooltip wsj-storm-type"><strong>'+f[o.feature.properties.cat].type+"</strong></div>"
                                    }
                                    )
                                }
                                );
                                i.addLayer(l), a=o.feature.properties.cat
                            }
                        }
                    }
                }
                ).addTo(r);

                "historical"==o.properties.source?y.push(s):h.push(s), m.push(s)
            }
        }
        ),
        t(r),
        o
    }
    function c(e) {
        var o="undefined"==typeof e.feature?e: e.feature;
        return"Point"==o.geometry.type? {
            radius: 3, fillColor: f[o.properties.cat].color, color: f[o.properties.cat].color, weight: 1, stroke: 1, opacity: 1, fillOpacity: 1, cickable: !1
        }
        :"Polygon"==o.geometry.type? {
            fillColor: "#5c81a3", color: "#5c81a3", weight: 3, stroke: 0, opacity: 1, fillOpacity: .1, cickable: !1
        }
        : {
            fillColor: f[o.properties.cat].color, color: f[o.properties.cat].color, weight: 3, stroke: 1, opacity: 1, fillOpacity: 1, cickable: !1
        }
    }
    function p(e) {
        momentTime=moment.utc(e).local().tz("America/New_York"),
        meridiem=momentTime.format("a").charAt(0)+".m. ET";
        var o=momentTime.format("ddd. h")+" "+meridiem;
        return o
    }
    e(function() {
        o()
    }
    );
    var s=L.icon( {
        iconUrl: "img/hurricane-retina.gif", iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [-3, -76]
    }
    ),
    l=L.icon( {
        iconUrl: "img/tropical-storm-retina.gif", iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [-3, -76]
    }
    ),
    f= {
        DB: {
            color: "#eff3f6", icon: l, type: "Tropical Disturbance"
        }
        ,
        E: {
            color: "#eff3f6", icon: l, type: "Extra Tropical"
        }
        ,
        H1: {
            color: "#fc7a70", icon: s, type: "Category 1"
        }
        ,
        H2: {
            color: "#cc3233", icon: s, type: "Category 2"
        }
        ,
        H3: {
            color: "#a7262a", icon: s, type: "Category 3"
        }
        ,
        H4: {
            color: "#874e99", icon: s, type: "Category 4"
        }
        ,
        H5: {
            color: "#4e2b70", icon: s, type: "Category 5"
        }
        ,
        LO: {
            color: "#eff3f6", icon: l, type: "Tropical Low"
        }
        ,
        STD: {
            color: "#eff3f6", icon: l, type: "Subtropical Depression"
        }
        ,
        PTC: {
            color: "#eff3f6", icon: l, type: "Potential Tropical Cyclone"
        }
        ,
        STS: {
            color: "#eff3f6", icon: l, type: "Subtropical Storm"
        }
        ,
        SS: {
            color: "#eff3f6", icon: l, type: "Subtropical Storm"
        }
        ,
        TD: {
            color: "#ffd597", icon: l, type: "Tropical Depression"
        }
        ,
        TS: {
            color: "#f4bb60", icon: l, type: "Tropical Storm"
        }
        ,
        WV: {
            color: "#eff3f6", icon: l, type: "Tropical Wave"
        }
    }
    ,
    u= {
        color: "black", dashArray: [2, 4], weight: 2
    }
    ,
    m=[],
    h=[],
    y=[];



}

(jQuery);