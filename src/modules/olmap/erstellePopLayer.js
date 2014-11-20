// übernimmt drei Variablen: popliste ist das Objekt mit den Populationen
// popidMarkiert der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    _  = require('underscore'),
    ol = require('ol');

var returnFunction = function (popliste, popidMarkiert, visible) {
    var popLayerErstellt = $.Deferred(),
        markers = [],
        marker,
        myLabel,
        myName,
        popupContent,
        pop_mit_nr_layer,
        selected_features,
        stylePop = require('./stylePop');

    if (window.apf.olmap.map && window.apf.olmap.map.olmap_select_interaction && popidMarkiert) {
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else if (popidMarkiert) {
        window.apf.olmap.addSelectFeaturesInSelectableLayers();
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    }

    if (visible === null) {
        visible = true;
    }

    _.each(popliste, function (pop) {
        myName = pop.PopName || '(kein Name)';
        popupContent = window.apf.olmap.erstelleContentFuerPop(pop);

        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        myLabel = (pop.PopNr ? pop.PopNr.toString() : '?');

        // marker erstellen...
        marker = new ol.Feature({
            geometry: new ol.geom.Point([pop.PopXKoord, pop.PopYKoord]),
            popNr: myLabel,
            pop_name: myName,
            name: myLabel, // noch benötigt? TODO: entfernen
            popupContent: popupContent,
            popup_title: myName,
            // Koordinaten werden gebraucht, damit das popup richtig platziert werden kann
            xkoord: pop.PopXKoord,
            ykoord: pop.PopYKoord,
            myTyp: 'pop',
            myId: pop.PopId
        });

        // marker in Array speichern
        markers.push(marker);

        // markierte in window.apf.olmap.map.olmap_select_interaction ergänzen
        if (popidMarkiert && popidMarkiert.indexOf(pop.PopId) !== -1) {
            selected_features.push(marker);
        }
    });

    // layer für Marker erstellen
    pop_mit_nr_layer = new ol.layer.Vector({
        title: 'Populationen',
        selectable: true,
        source: new ol.source.Vector({
            features: markers
        }),
        style: function (feature, resolution) {
            return stylePop(feature, resolution);
        }
    });
    pop_mit_nr_layer.set('visible', visible);
    pop_mit_nr_layer.set('kategorie', 'AP Flora');
    window.apf.olmap.map.addLayer(pop_mit_nr_layer);

    if (selected_features && selected_features.length > 0) {
        setTimeout(function () {
            window.apf.olmap.pruefeObPopTpopGewaehltWurden();
        }, 100);
        // Schaltfläche olmap_auswaehlen aktivieren
        $('#olmap_auswaehlen')
            .prop('checked', true)
            .button()
            .button("refresh");
    }

    popLayerErstellt.resolve();
    return popLayerErstellt.promise();
};

module.exports = returnFunction;