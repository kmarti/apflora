// nimmt drei Variablen entgegen:
// tpop_liste: Die Liste der darzustellenden Teilpopulationen
// tpopid_markiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (tpop_liste, tpopid_markiert, visible) {
    var tpop_layer_erstellt = $.Deferred(),
        tpop_layer,
        markers = [],
        marker,
        selected_features;

    if (window.apf.olmap.map.olmap_select_interaction && tpopid_markiert) {
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else if (tpopid_markiert) {
        window.apf.olmap.addSelectFeaturesInSelectableLayers();
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    }

    if (visible === null) {
        visible = true;
    }

    _.each(tpop_liste, function (tpop) {
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
    tpop_layer = new ol.layer.Vector({
        title: 'Teilpopulationen',
        source: new ol.source.Vector({
                features: markers
            }),
        style: function (feature, resolution) {
            return window.apf.olmap.tpopStyle(feature, resolution);
        }
    });
    tpop_layer.set('visible', visible);
    tpop_layer.set('kategorie', 'AP Flora');
    
    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(tpop_layer);

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