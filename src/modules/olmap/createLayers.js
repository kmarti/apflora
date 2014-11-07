/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    _  = require('underscore'),
    ol = require('ol'),
    ga = require('ga');

var returnFunction = function () {
    var bing_styles_object,
        bing_styles,
        bing_layers,
        ch_ortholuftbild_layer,
        ch_lk_grau_layer,
        ch_lk_farbe_layer,
        ch_siegriedkarte_layer,
        ch_gemeinden_layer,
        ch_kantone_layer,
        ch_parzellen_layer,
        ch_am_layer,
        ch_am_wander_layer,
        ch_auen_layer,
        ch_fm_layer,
        ch_hm_layer,
        ch_tww_layer,
        ch_vogelreservate_layer,
        detailpläne_layer_source,
        detailpläne_layer,
        zh_av_layer,
        zh_kartierungen_layer_source,
        load_zh_kartierungen_layer_source,
        zh_kartierungen_layer,
        zh_svo_farbig_layer,
        zh_svo_grau_layer,
        zh_lichte_wälder_layer,
        zh_waldkartierung_layer,
        zh_gemeinden_layer,
        zh_ortholuftbild_layer_1,
        zh_ortholuftbild_layer,
        zh_üp_layer,
        zh_basiskarten_layer,
        zh_höhenmodell_layer,
        layers_prov,
        layers,
        defaultStyle = require('./defaultStyle'),
        styleFunction,
        eigene_ebenen,
        eigene_ebenen_layers;

    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    bing_styles_object = {
        'Aerial': 'Bing Luftbild',
        'AerialWithLabels': 'Bing Luftbild beschriftet',
        'Road': 'Bing Strassenkarte'
    };
    bing_styles = _.keys(bing_styles_object);
    bing_layers = [];

    _.each(bing_styles, function (bing_style) {
        bing_layers.push(new ol.layer.Tile({
            title: bing_styles_object[bing_style],
            kategorie: 'Welt Hintergrund',
            visible: false,
            preload: Infinity,
            source: new ol.source.BingMaps({
                //projection: new ol.proj.EPSG21781(),
                //projection: projection,
                projection: 'EPSG:21781',
                key: 'AjGOtB_ygBplpxXtKiiHtm-GERjSg9TFEoCmuBI_Yz4VWy0unRGUDo9GOZHA46Pf',
                imagerySet: bing_style
            })
        }));
    });

    ch_ortholuftbild_layer = ga.layer.create('ch.swisstopo.swissimage');
    ch_ortholuftbild_layer.set('title', 'Luftbild CH');
    ch_ortholuftbild_layer.set('visible', false);
    ch_ortholuftbild_layer.set('kategorie', 'Hintergrund');

    ch_lk_grau_layer = ga.layer.create('ch.swisstopo.pixelkarte-grau');
    ch_lk_grau_layer.set('title', 'Landeskarten CH grau');
    ch_lk_grau_layer.set('visible', false);
    ch_lk_grau_layer.set('kategorie', 'Hintergrund');

    ch_lk_farbe_layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    ch_lk_farbe_layer.set('title', 'Landeskarten CH farbig');
    ch_lk_farbe_layer.set('visible', true);
    ch_lk_farbe_layer.set('kategorie', 'Hintergrund');

    ch_siegriedkarte_layer = ga.layer.create('ch.swisstopo.hiks-siegfried');
    ch_siegriedkarte_layer.set('title', 'Siegfriedkarte 1881');
    ch_siegriedkarte_layer.set('visible', false);
    ch_siegriedkarte_layer.set('kategorie', 'Hintergrund');

    ch_gemeinden_layer = ga.layer.create('ch.swisstopo-vd.geometa-gemeinde');
    ch_gemeinden_layer.set('title', 'Gemeinden');
    ch_gemeinden_layer.set('visible', false);
    ch_gemeinden_layer.set('kategorie', 'CH Sachinformationen');

    ch_kantone_layer = ga.layer.create('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill');
    ch_kantone_layer.set('title', 'Kantone');
    ch_kantone_layer.set('visible', false);
    ch_kantone_layer.set('crossOrigin', null);
    ch_kantone_layer.set('kategorie', 'CH Sachinformationen');

    ch_parzellen_layer = ga.layer.create('ch.kantone.cadastralwebmap-farbe');
    ch_parzellen_layer.set('title', 'Parzellen');
    ch_parzellen_layer.set('visible', false);
    ch_kantone_layer.set('crossOrigin', null);
    ch_parzellen_layer.set('kategorie', 'CH Sachinformationen');

    ch_am_layer = ga.layer.create('ch.bafu.bundesinventare-amphibien');
    ch_am_layer.set('title', 'Amphibien');
    ch_am_layer.set('visible', false);
    ch_am_layer.set('kategorie', 'CH Biotopinventare');

    ch_am_wander_layer = ga.layer.create('ch.bafu.bundesinventare-amphibien_wanderobjekte');
    ch_am_wander_layer.set('title', 'Amphibien Wanderobjekte');
    ch_am_wander_layer.set('visible', false);
    ch_am_wander_layer.set('kategorie', 'CH Biotopinventare');

    ch_auen_layer = ga.layer.create('ch.bafu.bundesinventare-auen');
    ch_auen_layer.set('title', 'Auen');
    ch_auen_layer.set('visible', false);
    ch_auen_layer.set('kategorie', 'CH Biotopinventare');

    ch_fm_layer = ga.layer.create('ch.bafu.bundesinventare-flachmoore');
    ch_fm_layer.set('title', 'Flachmoore');
    ch_fm_layer.set('visible', false);
    ch_fm_layer.set('kategorie', 'CH Biotopinventare');

    ch_hm_layer = ga.layer.create('ch.bafu.bundesinventare-hochmoore');
    ch_hm_layer.set('title', 'Hochchmoore');
    ch_hm_layer.set('visible', false);
    ch_hm_layer.set('kategorie', 'CH Biotopinventare');

    ch_tww_layer = ga.layer.create('ch.bafu.bundesinventare-trockenwiesen_trockenweiden');
    ch_tww_layer.set('title', 'Trockenwiesen und -weiden');
    ch_tww_layer.set('visible', false);
    ch_tww_layer.set('kategorie', 'CH Biotopinventare');

    ch_vogelreservate_layer = ga.layer.create('ch.bafu.bundesinventare-vogelreservate');
    ch_vogelreservate_layer.set('title', 'Vogelreservate');
    ch_vogelreservate_layer.set('visible', false);
    ch_vogelreservate_layer.set('kategorie', 'CH Biotopinventare');

    detailpläne_layer_source = new ol.source.GeoJSON({
        url: 'geojson/detailplaene.geojson'/*,
         myTyp: 'Detailplan'*/    // funktioniert nicht
    });
    /* funktioniert nicht:
     detailpläne_layer_source.forEachFeature(function (feature) {
     feature.setValues('myTyp', 'Detailplan');
     });*/

    detailpläne_layer = new ol.layer.Vector({
        title: 'Detailpläne',
        opacity: 1,
        visible: false,
        kategorie: 'AP Flora',
        selectable: true,
        source: detailpläne_layer_source,
        style: window.apf.olmap.detailplanStyle()
    });

    // ausgeschaltet, da es nicht funktioniert (authorization required)
    zh_av_layer = new ol.layer.Tile({
        title: 'Amtliche Vermessung',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//agabriel:4zC6MgjM@wms.zh.ch/avwms',
            //url: '//wms.zh.ch/avwms',
            crossOrigin: null,
            params: {
                'layers': 'liegenschaften'
            }
        })
    });

    // OL3 hat noch Probleme und bereinigt die Methoden für WFS - zuwarten
    zh_kartierungen_layer_source = new ol.source.ServerVector({
        //format: new ol.format.GeoJSON(),    // holt nicht mal die Daten
        format: new ol.format.WFS({    // holt die Daten - sollte aber bald die Attrribute nicht mehr benötigen
            featureNS: '//maps.zh.ch',
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
                jsonpCallback: 'load_zh_kartierungen_layer_source'
            });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
            maxZoom: 19
        })),
        projection: 'EPSG:21781'
    });

    load_zh_kartierungen_layer_source = function (response) {
          zh_kartierungen_layer_source.addFeatures(zh_kartierungen_layer_source.readFeatures(response));    // funktioniert nicht!
    };

    zh_kartierungen_layer = new ol.layer.Vector({
        title: 'Lebensraum-Kartierungen',
        opacity: 0.7,
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: zh_kartierungen_layer_source,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 255, 1.0)',
                width: 2
            })
        })
    });

    zh_svo_farbig_layer = new ol.layer.Tile({
        title: 'SVO farbig',
        opacity: 0.7,
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
        legende_url: 'http://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr'
            }
        })
    });

    zh_svo_grau_layer = new ol.layer.Tile({
        title: 'SVO schwarz/weiss',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
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

    zh_lichte_wälder_layer = new ol.layer.Tile({
        title: 'Wälder: lichte',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
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
    zh_waldkartierung_layer = new ol.layer.Tile({
        title: 'Wälder: Vegetation',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
        legende_url: 'http://wms.zh.ch/WaldVKWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=waldgesellschaften&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/WaldVKWMS',
            crossOrigin: null,
            params: {
                'layers': 'waldgesellschaften',
                'singleTile': true
            }
        })
    });

    // nicht im Gebrauch
    zh_gemeinden_layer = new ol.layer.Tile({
        title: 'Kanton',
        visible: false,
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
    zh_ortholuftbild_layer_1 = new ol.layer.Tile({
        title: 'Luftbild',
        visible: false,
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
    zh_ortholuftbild_layer = new ol.layer.Tile({
        title: 'Luftbild ZH',
        visible: false,
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

    zh_üp_layer = new ol.layer.Tile({
        title: 'Übersichtsplan ZH',
        visible: false,
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

    zh_basiskarten_layer = new ol.layer.Tile({
        title: 'Landeskarten ZH',
        visible: false,
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

    zh_höhenmodell_layer = new ol.layer.Tile({
        title: 'Höhenmodell ZH',
        visible: false,
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
    layers_prov = [
        zh_höhenmodell_layer,
        zh_ortholuftbild_layer,
        ch_ortholuftbild_layer,
        zh_basiskarten_layer,
        ch_lk_grau_layer,
        ch_lk_farbe_layer,
        ch_siegriedkarte_layer,
        ch_parzellen_layer,
        ch_gemeinden_layer,
        ch_am_layer,
        ch_am_wander_layer,
        ch_auen_layer,
        ch_fm_layer,
        ch_hm_layer,
        ch_tww_layer,
        ch_vogelreservate_layer,
        ch_kantone_layer,
        zh_üp_layer,
        zh_svo_farbig_layer,
        zh_svo_grau_layer,
        //zh_kartierungen_layer,    // warten, das OL3 mit WFS noch nicht funktioniert
        zh_lichte_wälder_layer,
        zh_waldkartierung_layer,
        detailpläne_layer
    ];

    // bing-layers vorne setzen
    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    //var layers = layers_prov.concat(bing_layers);
    layers = layers_prov;

    // prüfen, ob in localStorage eigene Layer existieren
    // ausgeschaltet, weil die LayerObjekte von OL3 rekursiv sind und nicht für die localStorage stringified werden können
    if (localStorage.olmap_eigene_ebenen) {
        // drag and drop geo-files
        styleFunction = function (feature, resolution) {
            var featureStyleFunction = feature.getStyleFunction();
            if (featureStyleFunction) {
                return featureStyleFunction.call(feature, resolution);
            }
            return defaultStyle[feature.getGeometry().getType()];
        };
        // diese hinzufügen
        eigene_ebenen = JSON.parse(localStorage.olmap_eigene_ebenen);
        eigene_ebenen_layers = [];
        _.each(eigene_ebenen, function (ebene) {
            var format = new ol.format.GeoJSON(),
                features = format.readFeatures(ebene);
            //window.eigene_ebenen.push(features);
            var vectorSource = new ol.source.Vector({
                features: features
            });
            var layer = new ol.layer.Vector({
                guid: ebene.guid,
                source: vectorSource,
                style: styleFunction,
                title: ebene.title,
                kategorie: ebene.kategorie
            });
            eigene_ebenen_layers.push(layer);
        });
        layers = layers.concat(eigene_ebenen_layers);
    }

    return layers;
};

module.exports = returnFunction;