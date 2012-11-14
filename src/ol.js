function init() {
	//Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	var ch_bbox_lonlat = new OpenLayers.Bounds(8.46, 47.34, 8.58, 47.42);
	var zh_bbox_lonlat = new OpenLayers.Bounds(8.1572, 47.1417, 9.03748, 47.7124);
	var ch_bbox_1903 = new OpenLayers.Bounds(681000, 245500, 684000, 248500);

	Proj4js.defs["EPSG:21781"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
	Proj4js.defs["EPSG:900913"]= "+title=GoogleMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";

	// avoid pink tiles
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";

	var map = new OpenLayers.Map('map', {
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:21781"),
		allOverlays: true,
		units: 'm',
		fractionalZoom: true
		//maxExtent: zh_bbox_lonlat
	});
	/*var map = new OpenLayers.Map('map', {
		projection: "EPSG:4326",
		maxResolution: 3000,
		//allOverlays: true,
		units: 'm',
		fractionalZoom: true,
		maxExtent: ch_bbox_lonlat
	});*/
	

	// the SATELLITE layer has all 22 zoom level, so we add it first to
    // become the internal base layer that determines the zoom levels of the
    // map.
    var gsat = new OpenLayers.Layer.Google(
        "Google Satellit",
        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
    );
    var gphy = new OpenLayers.Layer.Google(
        "Google Relief",
        {type: google.maps.MapTypeId.TERRAIN, visibility: false}
    );
    var gmap = new OpenLayers.Layer.Google(
        "Google Strassen", // the default
        {numZoomLevels: 20, visibility: false}
    );
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22, visibility: false}
    );
    //wms hinzufügen
	var ch_tww = new OpenLayers.Layer.WMS("CH TWW", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden',
		//projection: new OpenLayers.Projection("EPSG:4326"),
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false
	});
	var ch_hm = new OpenLayers.Layer.WMS("CH Hochmoore", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-hochmoore',
		//projection: new OpenLayers.Projection("EPSG:4326"),
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

	map.addLayers([gsat, gphy, gmap, ghyb, ch_tww, ch_hm, ch_fm, ch_au, ch_alg]);

	// Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    //auf Europa zentrieren
    map.setCenter(new OpenLayers.LonLat(8.8, 47.4).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    ), 11);

	map.addControl(new OpenLayers.Control.MousePosition({numDigits: 0, separator: ' / '}));
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.Permalink());
	map.addControl(new OpenLayers.Control.KeyboardDefaults());
	map.addControl(new OpenLayers.Control.ScaleLine());

	//Titel für die Ebenen-Auswahl setzen, Standard ist "Overlays"
	$(".dataLbl").text("Ebenen");

	//map.zoomToMaxExtent();
};