function init() {
	//Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	var ch_bbox_lonlat = new OpenLayers.Bounds(8.46, 47.34, 8.58, 47.42);
	var zh_bbox_lonlat = new OpenLayers.Bounds(8.1572, 47.1417, 9.03748, 47.7124);
	var ch_bbox_1903_2 = new OpenLayers.Bounds(486000, 360000, 837000, 70000);
	var zh_bbox_1903 = new OpenLayers.Bounds(669000, 222000, 717000, 284000);

	Proj4js.defs["EPSG:21781"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
	Proj4js.defs["EPSG:900913"]= "+title=GoogleMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";

	// avoid pink tiles
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";

	var map = new OpenLayers.Map('map', {
		projection: new OpenLayers.Projection("EPSG:21781"),
		allOverlays: true,
		units: 'm',
		fractionalZoom: true,
		maxExtent: zh_bbox_1903
	});

	//SVO als WFS hinzufügen
	var zh_liwa = new OpenLayers.Layer.Vector("ZH Lichte Wälder", {
	    strategies: [new OpenLayers.Strategy.BBOX()],
	    protocol: new OpenLayers.Protocol.WFS.v1_1_0({
	        url:  "http://maps.zh.ch/wfs/FnsNSWFS",
	        featureType: "lichtwaelder_teilobj",
	        featureNs: "http://www.opengis.net/gml"
	        //featureNs: "http://www.intergraph.com/geomedia/gml"
	    })
	});
	/*var zh_nso = new OpenLayers.Layer.Vector("ZH NS-Objekte", {
	    strategies: [new OpenLayers.Strategy.BBOX()],
	    protocol: new OpenLayers.Protocol.WFS.v1_1_0({
	        url:  "http://www.maps.zh.ch/wfs/FnsNSWFS",
	        version: "1.1.0",
	        featureType: "naturschutzobjekte_f",
	        srsName: "EPSF:21781"
	    })
	});*/
	// prepare to style the data
    styleMap = new OpenLayers.StyleMap({
        strokeColor: "black",
        strokeWidth: 2,
        strokeOpacity: 0.5,
        fillOpacity: 0.2
    });
	var zh_nso = new OpenLayers.Layer.Vector("ZH NS-Objekte", {
	    strategies: [new OpenLayers.Strategy.Fixed()],
	    protocol: new OpenLayers.Protocol.WFS.v1_1_0({
	        url:  "http://maps.zh.ch/wfs/FnsNSWFS",
	        featureType: "naturschutzobjekte_f"
	    }),
	    styleMap: "ol/zh_nsobjekte_stylemap.sld",
	    visibility: false
	});
    //WFS hinzufügen
    var wfs = new OpenLayers.Layer.Vector("WFS", {
	    strategies: [new OpenLayers.Strategy.BBOX()],
	    protocol: new OpenLayers.Protocol.WFS({
	        url:  "http://demo.opengeo.org/geoserver/wfs",
	        featureType: "tasmania_roads",
	        featureNS: "http://www.openplans.org/topp"
	    }),
	    styleMap: styleMap
	});
    //wms hinzufügen
    var zh_uep = new OpenLayers.Layer.WMS("ZH Übersichtsplan", "http://wms.zh.ch/upwms", {
		layers: 'upwms',
		//projection: new OpenLayers.Projection("EPSG:4326"),
		//projection: "EPSG:21781",
		isBaseLayer: true
	}, {
		visibility: true,
		singleTile: true
		//ratio: 1.0
	});
    var zh_av = new OpenLayers.Layer.WMS("ZH Parzellen", "http://wms.zh.ch/avwms", {
		layers: 'RESF',
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false,
		singleTile: true
	});
	var zh_avnr = new OpenLayers.Layer.WMS("ZH Parzellen-Nummern", "http://wms.zh.ch/avwms", {
		layers: 'OSNR',
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false,
		singleTile: true
	});
	var zh_svo = new OpenLayers.Layer.WMS("ZH SVO", "http://wms.zh.ch/FnsSVOZHWMS", {
		layers: 'FnsSVOZHWMS',
		transparent: true
	}, {
		singleTile: true,
		opacity: 0.7,
		visibility: false
	});
	var zh_waldveg = new OpenLayers.Layer.WMS("ZH Wald Vegetation", "http://wms.zh.ch/FnsSVOZHWMS", {
		layers: 'FnsSVOZHWMS',
		transparent: true
	}, {
		singleTile: true,
		opacity: 0.7,
		visibility: false
	});
	var ch_tww = new OpenLayers.Layer.WMS("CH TWW", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden',
		projection: new OpenLayers.Projection("EPSG:4326"),
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false
	});
	var ch_hm = new OpenLayers.Layer.WMS("CH Hochmoore", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-hochmoore',
		projection: new OpenLayers.Projection("EPSG:4326"),
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false
	});	
	var ch_fm = new OpenLayers.Layer.WMS("CH Flachmoore", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-flachmoore',
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false
	});
	var ch_au = new OpenLayers.Layer.WMS("CH Auen", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-auen',
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false
	});
	var ch_alg = new OpenLayers.Layer.WMS("CH Amphibien", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-amphibien',
		transparent: true
	}, {
		visibility: false,
		opacity: 0.7
	});
	map.addLayers([zh_uep, zh_av, zh_avnr, zh_svo, zh_nso]);
	//map.addLayers([zh_nso]);

	// Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    //auf Europa zentrieren
    //map.setCenter(693000, 251500);
    /*map.setCenter(new OpenLayers.LonLat(8.8, 47.4).transform(
        new OpenLayers.Projection("EPSG:21781"),
        map.getProjectionObject()
    ), 14);*/

	map.addControl(new OpenLayers.Control.MousePosition({numDigits: 0, separator: ' / '}));
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.Permalink());
	map.addControl(new OpenLayers.Control.KeyboardDefaults());
	map.addControl(new OpenLayers.Control.ScaleLine());

	map.zoomToMaxExtent();

	//Titel für die Ebenen-Auswahl setzen, Standard ist "Overlays"
	$(".layersDiv .dataLbl").text("Ebenen");
};