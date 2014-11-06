/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    _  = require('underscore'),
    ol = require('ol');

var returnFunction = function () {
    // allfällige bestehende Interaction entfernen
    window.apf.olmap.entferneModifyInteractionFürTpop();
    // feature-overlay erstellen
    window.apf.olmap.modify_overlay = new ol.FeatureOverlay({
        style: function (feature, resolution) {
            return window.apf.olmap.tpopStyle(feature, resolution, false, true);
        }
    });
    // neues oder gewähltes feature hinzufügen
    window.apf.olmap.modify_overlay.addFeature(window.apf.olmap.modify_source.getFeatures()[0]);
    // modify-interaction erstellen
    window.apf.olmap.modify_interaction = new ol.interaction.Modify({
        features: window.apf.olmap.modify_overlay.getFeatures()
    });
    // zählt, wieviele male .on('change') ausgelöst wurde
    window.apf.olmap.modify_interaction.zähler = 0;
    // interaction.Modify meldet nicht, wenn etwas verändert wurde
    // daher muss registriert werden, wann das feature geändert wird
    window.apf.olmap.modify_overlay.getFeatures().getArray()[0].on('change', function () {
        // funktioniert zwar, wird aber beim Verschieben Dutzende bis hunderte Male ausgelöst
        var zähler,
            coordinates = this.getGeometry().getCoordinates(),
            feature = this;
        window.apf.olmap.modify_interaction.zähler++;
        // speichert, wieviele male .on('change') ausgelöst wurde, bis setTimout aufgerufen wurde
        zähler = window.apf.olmap.modify_interaction.zähler;
        setTimeout(function () {
            if (zähler === window.apf.olmap.modify_interaction.zähler) {
                // in den letzten 200 Millisekunden hat sich nichts geändert > speichern
                // Koordinaten in tpop ergänzen
                window.apf.tpop.TPopXKoord = parseInt(coordinates[0]);
                window.apf.tpop.TPopYKoord = parseInt(coordinates[1]);
                $.when(window.apf.aktualisiereKoordinatenVonTPop(window.apf.tpop))
                .then(function () {
                    // marker in tpop_layer ergänzen
                    // tpop_layer neu zeichnen
                    var layers = window.apf.olmap.map.getLayers().getArray(),
                        tpop_layer_nr = $('#olmap_layertree_Teilpopulationen').val(),
                        tpop_layer = layers[tpop_layer_nr],
                        tpop_layer_source = tpop_layer.getSource(),
                        tpop_layer_features = tpop_layer_source.getFeatures(),
                        aktuelles_feature = _.find(tpop_layer_features, function (feature) {
                            return feature.get('myId') === window.apf.tpop.TPopId;
                        });
                    aktuelles_feature.getGeometry().setCoordinates(coordinates);
                    // abhängige Eigenschaften aktualisieren
                    aktuelles_feature.set('xkoord', window.apf.tpop.TPopXKoord);
                    aktuelles_feature.set('ykoord', window.apf.tpop.TPopYKoord);
                    aktuelles_feature.set('popup_content', window.apf.olmap.erstelleContentFürTPop(window.apf.tpop));
                });
            }
        }, 200);
    });
    /*
    // change scheint nicht zu passieren. Probiert: change, pointerdrag, click, drawend
    window.apf.olmap.modify_interaction.on('move', function (event) {
        console.log('jetzt die Koordinaten aktualisieren');

    });*/
    window.apf.olmap.map.addInteraction(window.apf.olmap.modify_interaction);
};

module.exports = returnFunction;