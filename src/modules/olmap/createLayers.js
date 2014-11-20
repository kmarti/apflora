/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $            = require('jquery'),
    _            = require('underscore'),
    ol           = require('ol'),
    ga           = require('ga'),
    defaultStyle = require('./defaultStyle');

module.exports = function () {
    var bingStylesObject,
        bingStyles,
        bingLayers,
        chOrtholuftbildLayer,
        chLkGrauLayer,
        chLkFarbeLayer,
        chSiegriedkarteLayer,
        chGemeindenLayer,
        chKantoneLayer,
        chParzellenLayer,
        chAmLayer,
        chAmWanderLayer,
        chAuenLayer,
        chFmLayer,
        chHmLayer,
        chTwwLayer,
        chVogelreservateLayer,
        detailplaeneLayerSource,
        detailplaeneLayer,
        zhAvLayer,
        zhKartierungenLayerSource,
        loadZhKartierungenLayerLource,
        zhKartierungenLayer,
        zhSvoFarbigLayer,
        zhSvoGrauLayer,
        zhLichteWaelderLayer,
        zhWaldkartierungLayer,
        zhGemeindenLayer,
        zhOrtholuftbildLayer1,
        zhOrtholuftbildLayer,
        zhUepLayer,
        zhBasiskartenLayer,
        zhHoehenmodellLayer,
        layersProv,
        layers,
        styleFunction,
        eigeneEbenen,
        eigeneEbenenLayers;

    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    bingStylesObject = {
        'Aerial':           'Bing Luftbild',
        'AerialWithLabels': 'Bing Luftbild beschriftet',
        'Road':             'Bing Strassenkarte'
    };
    bingStyles = _.keys(bingStylesObject);
    bingLayers = [];

    _.each(bingStyles, function (bing_style) {
        bingLayers.push(new ol.layer.Tile({
            title:     bingStylesObject[bing_style],
            kategorie: 'Welt Hintergrund',
            visible:   false,
            preload:   Infinity,
            source: new ol.source.BingMaps({
                //projection: new ol.proj.EPSG21781(),
                //projection: projection,
                projection: 'EPSG:21781',
                key:        'AjGOtB_ygBplpxXtKiiHtm-GERjSg9TFEoCmuBI_Yz4VWy0unRGUDo9GOZHA46Pf',
                imagerySet: bing_style
            })
        }));
    });

    chOrtholuftbildLayer = ga.layer.create('ch.swisstopo.swissimage');
    chOrtholuftbildLayer.set('title', 'Luftbild CH');
    chOrtholuftbildLayer.set('visible', false);
    chOrtholuftbildLayer.set('kategorie', 'Hintergrund');

    chLkGrauLayer = ga.layer.create('ch.swisstopo.pixelkarte-grau');
    chLkGrauLayer.set('title', 'Landeskarten CH grau');
    chLkGrauLayer.set('visible', false);
    chLkGrauLayer.set('kategorie', 'Hintergrund');

    chLkFarbeLayer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    chLkFarbeLayer.set('title', 'Landeskarten CH farbig');
    chLkFarbeLayer.set('visible', true);
    chLkFarbeLayer.set('kategorie', 'Hintergrund');

    chSiegriedkarteLayer = ga.layer.create('ch.swisstopo.hiks-siegfried');
    chSiegriedkarteLayer.set('title', 'Siegfriedkarte 1881');
    chSiegriedkarteLayer.set('visible', false);
    chSiegriedkarteLayer.set('kategorie', 'Hintergrund');

    chGemeindenLayer = ga.layer.create('ch.swisstopo-vd.geometa-gemeinde');
    chGemeindenLayer.set('title', 'Gemeinden');
    chGemeindenLayer.set('visible', false);
    chGemeindenLayer.set('kategorie', 'CH Sachinformationen');

    chKantoneLayer = ga.layer.create('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill');
    chKantoneLayer.set('title', 'Kantone');
    chKantoneLayer.set('visible', false);
    chKantoneLayer.set('crossOrigin', null);
    chKantoneLayer.set('kategorie', 'CH Sachinformationen');

    chParzellenLayer = ga.layer.create('ch.kantone.cadastralwebmap-farbe');
    chParzellenLayer.set('title', 'Parzellen');
    chParzellenLayer.set('visible', false);
    chKantoneLayer.set('crossOrigin', null);
    chParzellenLayer.set('kategorie', 'CH Sachinformationen');

    chAmLayer = ga.layer.create('ch.bafu.bundesinventare-amphibien');
    chAmLayer.set('title', 'Amphibien');
    chAmLayer.set('visible', false);
    chAmLayer.set('kategorie', 'CH Biotopinventare');

    chAmWanderLayer = ga.layer.create('ch.bafu.bundesinventare-amphibien_wanderobjekte');
    chAmWanderLayer.set('title', 'Amphibien Wanderobjekte');
    chAmWanderLayer.set('visible', false);
    chAmWanderLayer.set('kategorie', 'CH Biotopinventare');

    chAuenLayer = ga.layer.create('ch.bafu.bundesinventare-auen');
    chAuenLayer.set('title', 'Auen');
    chAuenLayer.set('visible', false);
    chAuenLayer.set('kategorie', 'CH Biotopinventare');

    chFmLayer = ga.layer.create('ch.bafu.bundesinventare-flachmoore');
    chFmLayer.set('title', 'Flachmoore');
    chFmLayer.set('visible', false);
    chFmLayer.set('kategorie', 'CH Biotopinventare');

    chHmLayer = ga.layer.create('ch.bafu.bundesinventare-hochmoore');
    chHmLayer.set('title', 'Hochchmoore');
    chHmLayer.set('visible', false);
    chHmLayer.set('kategorie', 'CH Biotopinventare');

    chTwwLayer = ga.layer.create('ch.bafu.bundesinventare-trockenwiesen_trockenweiden');
    chTwwLayer.set('title', 'Trockenwiesen und -weiden');
    chTwwLayer.set('visible', false);
    chTwwLayer.set('kategorie', 'CH Biotopinventare');

    chVogelreservateLayer = ga.layer.create('ch.bafu.bundesinventare-vogelreservate');
    chVogelreservateLayer.set('title', 'Vogelreservate');
    chVogelreservateLayer.set('visible', false);
    chVogelreservateLayer.set('kategorie', 'CH Biotopinventare');

    detailplaeneLayerSource = new ol.source.GeoJSON({
        url: 'geojson/detailplaene.geojson'/*,
         myTyp: 'Detailplan'*/    // funktioniert nicht
    });
    /* funktioniert nicht:
     detailplaeneLayerSource.forEachFeature(function (feature) {
     feature.setValues('myTyp', 'Detailplan');
     });*/

    detailplaeneLayer = new ol.layer.Vector({
        title:     'Detailpläne',
        opacity:   1,
        visible:   false,
        kategorie: 'AP Flora',
        selectable: true,
        source:     detailplaeneLayerSource,
        style:      window.apf.olmap.detailplanStyle()
    });

    // ausgeschaltet, da es nicht funktioniert (authorization required)
    zhAvLayer = new ol.layer.Tile({
        title:     'Amtliche Vermessung',
        visible:   false,
        kategorie: 'ZH Sachinformationen',
        source:    new ol.source.TileWMS({
            url: '//agabriel:4zC6MgjM@wms.zh.ch/avwms',
            //url: '//wms.zh.ch/avwms',
            crossOrigin: null,
            params: {
                'layers': 'liegenschaften'
            }
        })
    });

    // OL3 hat noch Probleme und bereinigt die Methoden für WFS - zuwarten
    zhKartierungenLayerSource = new ol.source.ServerVector({
        //format: new ol.format.GeoJSON(),    // holt nicht mal die Daten
        format: new ol.format.WFS({    // holt die Daten - sollte aber bald die Attrribute nicht mehr benötigen
            featureNS:   '//maps.zh.ch',
            featureType: 'polygon'
        }),
        //format: new ol.format.GML(),
        loader: function (extent, resolution, projection) {
            $.ajax({
                type: 'GET',
                url: '//maps.zh.ch/wfs/FnsNSWFS',
                data: {
                    SERVICE: 'WFS',
                    VERSION: '1.0.0',
                    REQUEST: 'GetFeature',
                    TYPENAME: 'lrm_veg',
                    SRSNAME: 'EPSG:21781',
                    bbox: extent.join(',') + ',EPSG:21781'
                },
                dataType: 'jsonp',
                jsonpCallback: 'loadZhKartierungenLayerLource'
            });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
            maxZoom: 19
        })),
        projection: 'EPSG:21781'
    });

    loadZhKartierungenLayerLource = function (response) {
        zhKartierungenLayerSource.addFeatures(zhKartierungenLayerSource.readFeatures(response));    // funktioniert nicht!
    };

    zhKartierungenLayer = new ol.layer.Vector({
        title:     'Lebensraum-Kartierungen',
        opacity:   0.7,
        visible:   false,
        kategorie: 'ZH Sachinformationen',
        source:    zhKartierungenLayerSource,
        style:     new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 255, 1.0)',
                width: 2
            })
        })
    });

    zhSvoFarbigLayer = new ol.layer.Tile({
        title:      'SVO farbig',
        opacity:    0.7,
        visible:    false,
        kategorie: 'ZH Sachinformationen',
        legende:   true,
        legende_url: 'http://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr'
            }
        })
    });

    zhSvoGrauLayer = new ol.layer.Tile({
        title:     'SVO schwarz/weiss',
        visible:   false,
        kategorie: 'ZH Sachinformationen',
        legende:   true,
        legende_url: 'http://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen-raster&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'zonen-schutzverordnungen-raster,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr',
                'singleTile': true
            }
        })
    });

    zhLichteWaelderLayer = new ol.layer.Tile({
        title:     'Wälder: lichte',
        visible:   false,
        kategorie: 'ZH Sachinformationen',
        legende:   true,
        legende_url: 'http://wms.zh.ch/FnsLWZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=objekte-lichte-waelder-kanton-zuerich&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/FnsLWZH',
            crossOrigin: null,
            params: {
                'layers': 'objekte-lichte-waelder-kanton-zuerich',
                'singleTile': true
            }
        })
    });

    // nicht eingeschaltet, da ohne Legende wenig brauchbar
    zhWaldkartierungLayer = new ol.layer.Tile({
        title:     'Wälder: Vegetation',
        visible:   false,
        kategorie: 'ZH Sachinformationen',
        legende:   true,
        legende_url: 'http://wms.zh.ch/WaldVKWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=waldgesellschaften&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/WaldVKWMS',
            crossOrigin: null,
            params: {
                'layers':     'waldgesellschaften',
                'singleTile': true
            }
        })
    });

    // nicht im Gebrauch
    zhGemeindenLayer = new ol.layer.Tile({
        title:     'Kanton',
        visible:   false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/BASISKARTEZH',
            crossOrigin: null,
            params: {
                'layers': 'grenzen,gemeindegrenzen',
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    zhOrtholuftbildLayer1 = new ol.layer.Tile({
        title:     'Luftbild',
        visible:   false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//agabriel:4zC6MgjM@wms.zh.ch/OrthoZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'orthophotos',
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    zhOrtholuftbildLayer = new ol.layer.Tile({
        title:     'Luftbild ZH',
        visible:   false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/OrthoBackgroundZH',
            crossOrigin: null,
            params: {
                'layers': 'orthoaktuell',
                'singleTile': true
            }
        })
    });

    zhUepLayer = new ol.layer.Tile({
        title:     'Übersichtsplan ZH',
        visible:   false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: 'http://wms.zh.ch/upwms',
            crossOrigin: null,
            params: {
                'layers': 'upwms',
                'singleTile': true
            }
        })
    });

    zhBasiskartenLayer = new ol.layer.Tile({
        title:     'Landeskarten ZH',
        visible:   false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/BASISKARTEZH',
            crossOrigin: null,
            params: {
                'layers': 'wald,seen,lk500,lk200,lk100,lk50,lk25,up8,up24',
                'singleTile': true
            }
        })
    });

    zhHoehenmodellLayer = new ol.layer.Tile({
        title:     'Höhenmodell ZH',
        visible:   false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/DTMBackgroundZH',
            crossOrigin: null,
            params: {
                'layers': 'dtm',
                'singleTile': true
            }
        })
    });

    // Zunächst alle Layer definieren
    layersProv = [
        zhHoehenmodellLayer,
        zhOrtholuftbildLayer,
        chOrtholuftbildLayer,
        zhBasiskartenLayer,
        chLkGrauLayer,
        chLkFarbeLayer,
        chSiegriedkarteLayer,
        chParzellenLayer,
        chGemeindenLayer,
        chAmLayer,
        chAmWanderLayer,
        chAuenLayer,
        chFmLayer,
        chHmLayer,
        chTwwLayer,
        chVogelreservateLayer,
        chKantoneLayer,
        zhUepLayer,
        zhSvoFarbigLayer,
        zhSvoGrauLayer,
        //zhKartierungenLayer,    // warten, das OL3 mit WFS noch nicht funktioniert
        zhLichteWaelderLayer,
        zhWaldkartierungLayer,
        detailplaeneLayer
    ];

    // bing-layers vorne setzen
    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    //var layers = layersProv.concat(bingLayers);
    layers = layersProv;

    // prüfen, ob in localStorage eigene Layer existieren
    // ausgeschaltet, weil die LayerObjekte von OL3 rekursiv sind und nicht für die localStorage stringified werden können
    if (localStorage.olmapEigeneEbenen) {
        // drag and drop geo-files
        styleFunction = function (feature, resolution) {
            var featureStyleFunction = feature.getStyleFunction();

            if (featureStyleFunction) {
                return featureStyleFunction.call(feature, resolution);
            }
            return defaultStyle[feature.getGeometry().getType()];
        };
        // diese hinzufügen
        eigeneEbenen = JSON.parse(localStorage.olmapEigeneEbenen);
        eigeneEbenenLayers = [];
        _.each(eigeneEbenen, function (ebene) {
            var format,
                features,
                vectorSource,
                layer;

            format = new ol.format.GeoJSON();
            features = format.readFeatures(ebene);
            //window.eigeneEbenen.push(features);
            vectorSource = new ol.source.Vector({
                features: features
            });
            layer = new ol.layer.Vector({
                guid:      ebene.guid,
                source:    vectorSource,
                style:     styleFunction,
                title:     ebene.title,
                kategorie: ebene.kategorie
            });
            eigeneEbenenLayers.push(layer);
        });
        layers = layers.concat(eigeneEbenenLayers);
    }

    return layers;
};