// nimmt drei Variablen entgegen:
// tpopListe: Die Liste der darzustellenden Teilpopulationen
// tpopid_markiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    _  = require('underscore'),
    ol = require('ol');

var returnFunction = function (tpopListe, tpopid_markiert, visible) {
    var tpop_layer_erstellt = $.Deferred(),
        tpopLayer,
        markers = [],
        marker,
        selected_features,
        styleTPop = require('./styleTPop');

    if (window.apf.olmap.map.olmap_select_interaction && tpopid_markiert) {
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else if (tpopid_markiert) {
        window.apf.olmap.addSelectFeaturesInSelectableLayers();
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    }

    if (visible === null) {
        visible = true;
    }

    _.each(tpopListe, function (tpop) {
        // marker erstellen...
        marker = window.apf.olmap.erstelleMarkerFürTPopLayer(tpop);

        // ...und in Array speichern
        markers.push(marker);

        // markierte in window.apf.olmap.map.olmap_select_interaction ergänzen
        if (tpopid_markiert && tpopid_markiert.indexOf(tpop.TPopId) !== -1) {
            selected_features.push(marker);
        }
    });

    // layer für Marker erstellen
    tpopLayer = new ol.layer.Vector({
        title: 'Teilpopulationen',
        source: new ol.source.Vector({
                features: markers
            }),
        style: function (feature, resolution) {
            return styleTPop(feature, resolution);
        }
    });
    tpopLayer.set('visible', visible);
    tpopLayer.set('kategorie', 'AP Flora');
    
    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(tpopLayer);

    if (selected_features && selected_features.length > 0) {
        setTimeout(function () {
            window.apf.olmap.prüfeObPopTpopGewähltWurden();
        }, 100);
        // Schaltfläche olmap_auswaehlen aktivieren
        $('#olmap_auswaehlen')
            .prop('checked', true)
            .button()
            .button("refresh");
    }

    tpop_layer_erstellt.resolve();
    return tpop_layer_erstellt.promise();
};

module.exports = returnFunction;