function init() {
	//Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	//OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	var zh_bbox_1903 = new OpenLayers.Bounds(669000, 222000, 717000, 284000);

	var map = new OpenLayers.Map('map', {
		projection: new OpenLayers.Projection("EPSG:21781"),
		units: 'm',
		//auf Kt. Zürich richten
		maxExtent: new OpenLayers.Bounds(669000, 222000, 717000, 284000)
	});
	
	var ch_lk25 = new OpenLayers.Layer.WMTS({
		name: "LK 25'000",
		url: "http://wmts1.geo.admin.ch",
		version: "1.0.0",
        layer: "ch.swisstopo.pixelkarte-farbe",
        style: "default",
        matrixSet: "21781",
        //matrixIds: matrixIds,
        format: "image/jpeg",
        isBaseLayer: true
    });

    var wmts = new OpenLayers.Layer.WMTS({
		layer: "ch.swisstopo.pixelkarte-farbe",
		name: "Pixelmap WMTS",
		url: ["http://wmts0.geo.admin.ch/",
			"http://wmts1.geo.admin.ch/",
			"http://wmts2.geo.admin.ch/",
			"http://wmts3.geo.admin.ch/",
			"http://wmts4.geo.admin.ch/" ],
		tileOrigin: new OpenLayers.LonLat(700000.0, 260000.0),  //fix origin. Otherwqise, same as maxExtent
		zoomOffset: 14,
		matrixSet: "21781",
		format: "image/jpeg",
		opacity: 1.0,
		isBaseLayer: true,
		requestEncoding: "REST",
		style: "default" ,  // must be provided
		dimensions: ['TIME'],
		params: {'time': '20111206'},
		formatSuffix: 'jpeg'  // because we are not using .jpg
	});
	
	map.addLayers([wmts]);

	map.addControl(new OpenLayers.Control.MousePosition({numDigits: 0, separator: ' / '}));
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.Permalink());
	map.addControl(new OpenLayers.Control.KeyboardDefaults());
	map.addControl(new OpenLayers.Control.ScaleLine());

	map.zoomToMaxExtent();

	//Titel für die Ebenen-Auswahl setzen, Standard ist "Overlays"
	$(".dataLbl").text("Ebenen");
};