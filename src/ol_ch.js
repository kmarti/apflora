function init() {
	//Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	//OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	//var zh_bbox_1903 = new OpenLayers.Bounds(669000, 222000, 717000, 284000);

	var api = new GeoAdmin.API();

	/*map = new GeoAdmin.Map("map", {
		easting: 693000,
		northing: 253000,
		zoom: 4
	});*/
	api.createMap({
		div: "map",
		easting: 693000,
		northing: 253000,
		zoom: 4
	});

	var mouseposition  = new GeoAdmin.MousePositionBox({
		renderTo: "mymouseposition",
		map: api.map
	});

	var zh_uep = new OpenLayers.Layer.WMS("Übersichtsplan Kt. Zürich", "http://wms.zh.ch/upwms", {
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

	var ch_lk1000 = new OpenLayers.Layer.WMS("Landeskarte 1:1'000'000", "http://wms.geo.admin.ch?", {
		layers: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
		srs: 'EPSG:21781',
		'format': 'png'
	}, {
		singleTile: true,
		visibility: false
	});
	var ch_ktgrenzen = new OpenLayers.Layer.WMS("Kantone", "http://wms.geo.admin.ch?", {
		layers: 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill',
		srs: 'EPSG:21781',
		'format': 'png'
	}, {
		singleTile: true,
		visibility: true
	});

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

	//The complementary layer is per default the color pixelmap.
	api.map.switchComplementaryLayer("voidLayer", {opacity: 1});

	api.map.addLayers([zh_uep, ch_lk1000]);

	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk25.noscale', {
		visibility: false
	});

	api.map.addLayers([ch_ktgrenzen, zh_av, zh_avnr, zh_svo, ch_tww, ch_hm, ch_fm, ch_au, ch_alg]);

	//Add layer in the map
	/*api.map.addLayerByName('ch.bafu.bundesinventare-amphibien');
	api.map.addLayerByName('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill');
	api.map.addLayerByName('ch.bafu.bundesinventare-flachmoore');
	api.map.addLayerByName('ch.bafu.bundesinventare-auen');
	api.map.addLayerByName('ch.swisstopo.vec25-heckenbaeume');
	api.map.addLayerByName('ch.bafu.bundesinventare-moorlandschaften');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk1000.noscale');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-grau-pk1000.noscale');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk25.noscale');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk100.noscale');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk200.noscale');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk50.noscale');
	api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk500.noscale');
	api.map.addLayerByName('ch.bafu.bundesinventare-hochmoore');
	api.map.addLayerByName('ch.vbs.territorialregionen');
	api.map.addLayerByName('ch.swisstopo.swisstlm3d-karte');*/

	api.createLayerTree({
		renderTo: "layertree",
		width: 285
	});


};