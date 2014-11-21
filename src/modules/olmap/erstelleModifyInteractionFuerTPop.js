/*jslint node: true, browser: true, nomen: true, todo: true, plusplus: true */
'use strict';

var $                              = require('jquery'),
    _                              = require('underscore'),
    ol                             = require('ol'),
    styleTPop                      = require('./styleTPop'),
    aktualisiereKoordinatenVonTPop = require('../aktualisiereKoordinatenVonTPop'),
    erstelleContentFuerTPop        = require('./erstelleContentFuerTPop');

module.exports = function (modifySource) {
    var modifyOverlay;

    // allfällige bestehende Interaction entfernen
    window.apf.olmap.entferneModifyInteractionFuerTpop();
    // feature-overlay erstellen
    modifyOverlay = new ol.FeatureOverlay({
        style: function (feature, resolution) {
            return styleTPop(feature, resolution, false, true);
        }
    });
    // neues oder gewähltes feature hinzufügen
    modifyOverlay.addFeature(modifySource.getFeatures()[0]);
    // modify-interaction erstellen
    // global, weil es später entfernt werden muss
    window.apf.olmap.modifyInteraction = new ol.interaction.Modify({
        features: modifyOverlay.getFeatures()
    });
    // zählt, wieviele male .on('change') ausgelöst wurde
    window.apf.olmap.modifyInteraction.zaehler = 0;
    // interaction.Modify meldet nicht, wenn etwas verändert wurde
    // daher muss registriert werden, wann das feature geändert wird
    modifyOverlay.getFeatures().getArray()[0].on('change', function () {
        // funktioniert zwar, wird aber beim Verschieben Dutzende bis hunderte Male ausgelöst
        var zaehler,
            coordinates = this.getGeometry().getCoordinates();

        window.apf.olmap.modifyInteraction.zaehler++;
        // speichert, wieviele male .on('change') ausgelöst wurde, bis setTimout aufgerufen wurde
        zaehler = window.apf.olmap.modifyInteraction.zaehler;
        setTimeout(function () {
            if (zaehler === window.apf.olmap.modifyInteraction.zaehler) {
                // in den letzten 200 Millisekunden hat sich nichts geändert > speichern
                // Koordinaten in tpop ergänzen
                window.apf.tpop.TPopXKoord = parseInt(coordinates[0], 10);
                window.apf.tpop.TPopYKoord = parseInt(coordinates[1], 10);
                $.when(aktualisiereKoordinatenVonTPop(window.apf.tpop)).then(function () {
                    // marker in tpopLayer ergänzen
                    // tpopLayer neu zeichnen
                    var layers            = window.apf.olmap.map.getLayers().getArray(),
                        tpopLayerNr       = $('#olmap_layertree_Teilpopulationen').val(),
                        tpopLayer         = layers[tpopLayerNr],
                        tpopLayerSource   = tpopLayer.getSource(),
                        tpopLayerFeatures = tpopLayerSource.getFeatures(),
                        aktuellesFeature;

                    aktuellesFeature = _.find(tpopLayerFeatures, function (feature) {
                        return feature.get('myId') === window.apf.tpop.TPopId;
                    });

                    aktuellesFeature.getGeometry().setCoordinates(coordinates);
                    // abhängige Eigenschaften aktualisieren
                    aktuellesFeature.set('xkoord', window.apf.tpop.TPopXKoord);
                    aktuellesFeature.set('ykoord', window.apf.tpop.TPopYKoord);
                    aktuellesFeature.set('popupContent', erstelleContentFuerTPop(window.apf.tpop));
                });
            }
        }, 200);
    });
    /*
    // change scheint nicht zu passieren. Probiert: change, pointerdrag, click, drawend
    window.apf.olmap.modifyInteraction.on('move', function (event) {
        console.log('jetzt die Koordinaten aktualisieren');

    });*/
    window.apf.olmap.map.addInteraction(window.apf.olmap.modifyInteraction);
};