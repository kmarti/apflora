/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                 = require('jquery'),
    ol                                = require('ol'),
    erstelleModifyInteractionFuerTPop = require('./erstelleModifyInteractionFuerTPop'),
    zeigeTPop                         = require('./zeigeTPop'),
    styleTPop                         = require('./styleTPop');

var returnFunction = function (tpop) {
    var bounds,
        x_max,
        x_min,
        y_max,
        y_min,
        new_feature,
        modifySource;

    // tpop hat keine PopNr
    // Infos von Pop müssen ergänzt werden, weil sie als Label angezeigt werden
    tpop.PopNr   = window.apf.pop.PopNr;
    tpop.PopName = window.apf.pop.PopName;
    tpop.Artname = window.apf.ap.Artname;

    $.when(zeigeTPop()).then(function () {
        window.apf.olmap.deactivateMenuItems();

        // modify-layer erstellen
        modifySource = new ol.source.Vector();
        var modify_layer = new ol.layer.Vector({
            title: 'verortende Teilpopulation',
            kategorie: 'AP Flora',
            source: modifySource,
            style: function (feature, resolution) {
                return styleTPop(feature, resolution, false, true);
            }
        });
        window.apf.olmap.map.addLayer(modify_layer);

        if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
            // bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
            x_max = parseInt(tpop.TPopXKoord, 10) + 200;
            x_min = parseInt(tpop.TPopXKoord, 10) - 200;
            y_max = parseInt(tpop.TPopYKoord, 10) + 200;
            y_min = parseInt(tpop.TPopYKoord, 10) - 200;
            bounds = [x_min, y_min, x_max, y_max];
            // wenn schon eine Koordinate existiert:
            // tpop als feature zum modify hinzufügen
            new_feature = new ol.Feature(new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]));
            modifySource.addFeature(new_feature);
            // modify-handler erstellen
            erstelleModifyInteractionFuerTPop(modifySource);
            // Karte zum richtigen Ausschnitt zoomen
            window.apf.olmap.map.updateSize();
            window.apf.olmap.map.getView().fitExtent(bounds, window.apf.olmap.map.getSize());
            // verzögern, sonst funktioniert es nicht
            setTimeout(function () {
                window.apf.olmap.stapleLayerZuoberst('verortende Teilpopulation');
            }, 200);
        } else {
            // wenn keine Koordinate existiert:
            window.apf.olmap.draw_interaction = new ol.interaction.Draw({
                source: modifySource,
                type: /** @type {ol.geom.GeometryType} */ ('Point')
            });
            window.apf.olmap.map.addInteraction(window.apf.olmap.draw_interaction);

            window.apf.olmap.draw_interaction.once('drawend', function (event) {
                var coordinates = event.feature.getGeometry().getCoordinates();
                // Koordinaten in tpop ergänzen
                tpop.TPopXKoord  = parseInt(coordinates[0], 10);
                tpop.TPopYKoord = parseInt(coordinates[1], 10);
                $.when(window.apf.aktualisiereKoordinatenVonTPop(tpop)).then(function () {
                    // marker in tpopLayer ergänzen
                    // tpopLayer holen
                    var layers            = window.apf.olmap.map.getLayers().getArray(),
                        tpopLayerNr     = $('#olmap_layertree_Teilpopulationen').val(),
                        tpopLayer        = layers[tpopLayerNr],
                        tpopLayerSource = tpopLayer.getSource();
                    // marker ergänzen
                    tpopLayerSource.addFeature(window.apf.olmap.erstelleMarkerFürTPopLayer(tpop));
                    // selects entfernen - aus unerfindlichem Grund ist der neue Marker selektiert
                    window.apf.olmap.removeSelectFeaturesInSelectableLayers();
                });
                window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction);
                // modify-interaction erstellen
                erstelleModifyInteractionFuerTPop(modifySource);
            }, this);
            // verzögern, sonst funktioniert es nicht
            setTimeout(function () {
                window.apf.olmap.stapleLayerZuoberst('verortende Teilpopulation');
            }, 200);
        }
    });
};

module.exports = returnFunction;