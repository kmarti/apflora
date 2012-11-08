function init() {
	//Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";

	// avoid pink tiles
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";
	var map = new OpenLayers.Map('map', {
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		allOverlays: true,
		units: 'm',
		fractionalZoom: true
	});
	map.addControl(new OpenLayers.Control.LayerSwitcher());

	// the SATELLITE layer has all 22 zoom level, so we add it first to
    // become the internal base layer that determines the zoom levels of the
    // map.
    var gsat = new OpenLayers.Layer.Google(
        "Google Satellite",
        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
    );
    var gphy = new OpenLayers.Layer.Google(
        "Google Physical",
        {type: google.maps.MapTypeId.TERRAIN, visibility: false}
    );
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20, visibility: false}
    );
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22, visibility: false}
    );
    //WMS hinzufürgen
    var svozh1 = new OpenLayers.Layer.WMS("SVO ZH", "http://wms.zh.ch/FnsSVOZHWMS", {
		layers: "GISZHPUB.FNS_SCHUTZVERORDNUNGEN/GISZHPUB.SVO_ZONEN_F"
	});
	var svozh2 = new OpenLayers.Layer.WMS("SVO ZH", "http://www.gis.zh.ch/scripts/wmsFNSSVO2.asp", {
		layers: "GISZHPUB.FNS_SCHUTZVERORDNUNGEN/GISZHPUB.SVO_ZONEN_F"
	});
	//SVO als WFS hinzufügen
	var svo_wfs = new OpenLayers.Layer.Vector("WFS", {
	    strategies: [new OpenLayers.Strategy.BBOX()],
	    protocol: new OpenLayers.Protocol.WFS({
	        url:  "http://maps.zh.ch/wfs/FnsNSWFS",
	        service: "WFS",
	        version: "1.1.0",
	        request: "GetCapabilities",
	        featureType: "GISZHPUB.FNS_NSO/GISZHPUB.FNS_NATURSCHUTZOBJEKTE_F"
	    })
	});
    //WFS hinzufügen
    var wfs = new OpenLayers.Layer.Vector("WFS", {
	    strategies: [new OpenLayers.Strategy.BBOX()],
	    protocol: new OpenLayers.Protocol.WFS({
	        url:  "http://demo.opengeo.org/geoserver/wfs",
	        featureType: "tasmania_roads",
	        featureNS: "http://www.openplans.org/topp"
	    })
	});

	var ch_tww = new OpenLayers.Layer.WMS("CH TWW", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-trockenwiesen_trockenweiden',
		transparent: true
	}, {
		opacity: 0.7,
		visibility: false
	});
	var ch_hm = new OpenLayers.Layer.WMS("CH Hochmoore", "http://wms.geo.admin.ch", {
		layers: 'ch.bafu.bundesinventare-hochmoore',
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
	var zh_av = new OpenLayers.Layer.WMS("ZH AV", "http://wms.zh.ch/avwms", {
		//layers: 'avwms',
		transparent: true,
		visibility: false
	}, {
		opacity: 0.7
	});
	var ch_lk25 = new OpenLayers.Layer.WMTS({
		name: "LK 25'000",
        url: "http://wmts.geo.admin.ch",
        layer: "ch.swisstopo.pixelkarte-farbe-pk25.noscale",
        matrixSet: 21781,
        //matrixIds: 21781,
        format: "image/jpeg",
        style: "ch.swisstopo.pixelkarte-farbe-pk25.noscale",
        visibility: false
    });	
	//map.addLayers([gsat, gphy, gmap, ghyb, nasa]);
	map.addLayers([gsat, gphy, gmap, ghyb, ch_lk25, ch_tww, ch_hm, ch_fm, ch_au, ch_alg]);

	// Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    //auf Europa zentrieren
    map.setCenter(new OpenLayers.LonLat(8.8, 47.4).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    ), 11);
    //auf tasmanien zentrieren
    /*map.setCenter(new OpenLayers.LonLat(146.7, -41.8).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    ), 6);*/

	//map.zoomToMaxExtent();
};