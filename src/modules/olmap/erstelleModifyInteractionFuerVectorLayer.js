/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                        = require('jquery'),
    _                                        = require('underscore'),
    ol                                       = require('ol'),
    frageNameFuerEbene                       = require('./frageNameFuerEbene'),
    entferneModifyInteractionFuerVectorLayer = require('./entferneModifyInteractionFuerVectorLayer'),
    defaultStyle                             = require('./defaultStyle'),
    aktualisiereEbeneInLocalStorage          = require('./aktualisiereEbeneInLocalStorage');

module.exports = function (vectorlayer) {
    var layerTitle,
        $geom_type_select;

    if (vectorlayer === 'neuer_layer') {
        vectorlayer = new ol.layer.Vector({
            guid:      window.apf.erstelleGuid(),
            source:    new ol.source.Vector(),
            title:     'neue Ebene',
            kategorie: 'Eigene Ebenen',
            style: function (feature, resolution) {
                return defaultStyle[feature.getGeometry().getType()];
            }
        });
        window.apf.olmap.map.addLayer(vectorlayer);
        // umbenennen, dann ModifyInteraction erstellen
        frageNameFuerEbene(vectorlayer);
        return;
    }

    layerTitle = vectorlayer.get('title');
    $geom_type_select = $('#modify_layer_geom_type_' + layerTitle.replace(" ", "_"));

    // darin werden die ids von selectierten features gespeichert
    window.apf.olmap.modifiedFeatures = [];

    // allfällige bestehende Interaction entfernen
    entferneModifyInteractionFuerVectorLayer();

    // select interaction erstellen
    window.apf.olmap.selectInteractionFuerVectorlayer = new ol.interaction.Select({
        layers: function (layer) {
            // selectable sind nur features aus dem gewählten layer
            return layer.get('title') === layerTitle;
        }
    });

    // selected features sollen modifiziert werden können
    window.apf.olmap.selectedFeatures = window.apf.olmap.selectInteractionFuerVectorlayer.getFeatures();

    window.apf.olmap.selectedFeatures.on('add', function (event) {
        // now listen if the feature is changed
        var feature   = event.element,
            featureId = feature.getId();
        // wenn jemand eine eigene Ebene ergänzt hat, kann es sein, dass die features keine id's haben
        // also wenn nötig ergänzen
        if (!featureId) {
            feature.setId(_.uniqueId());
        }
        feature.on('change', function (event) {
            var changeEventFeature = event.target,
                changeEventFeatureId = changeEventFeature.getId();
            window.apf.olmap.modifiedFeatures = window.apf.olmap.modifiedFeatures || [];
            // id in modified_features ergänzen
            window.apf.olmap.modifiedFeatures = _.union(window.apf.olmap.modifiedFeatures, [changeEventFeatureId]);
            // speichern
            aktualisiereEbeneInLocalStorage(vectorlayer);
        });

        // listen to pressing of delete key, then delete selected features
        $(document).on('keyup', function (event) {
            if (event.keyCode == 46) {
                // alle gewählten features aus select_interaction und source entfernen
                window.apf.olmap.selectedFeatures.forEach(function (selectedFeature) {
                    var selectedFeatureId,
                        vectorlayerFeatures,
                        sourceFeatureId;

                    selectedFeatureId = selectedFeature.getId();
                    window.apf.olmap.selectedFeatures.remove(selectedFeature);
                    // features aus vectorlayer_source entfernen
                    vectorlayerFeatures = vectorlayer.getSource().getFeatures();
                    vectorlayerFeatures.forEach(function (sourceFeature) {
                        sourceFeatureId = sourceFeature.getId();
                        if (sourceFeatureId === selectedFeatureId) {
                            vectorlayer.getSource().removeFeature(sourceFeature);
                            // speichern
                            aktualisiereEbeneInLocalStorage(vectorlayer);
                        }
                    });
                });
                $(document).off('keyup');
            }
        });

        // verhindern, dass Knoten im Strukturbaum entfernt werden
        $.jstree._reference("[typ='apOrdnerPop']").deselect_all();
    });

    window.apf.olmap.selectedFeatures.on('remove', function (event) {
        var feature       = event.element,
            featureId     = feature.getId(),
            feature_index = window.apf.olmap.modifiedFeatures.indexOf(featureId);

        if (feature_index > -1) {
            // speichern
            aktualisiereEbeneInLocalStorage(vectorlayer);
            // erst wieder speichern, wenn neu verändert wurde
            window.apf.olmap.modifiedFeatures.splice(feature_index, 1);
        }
    });

    // global definieren: wird benötigt, um später (beim Klick auf 'Ebene bearbeiten') festzustellen, ob eine modify-interaction existiert
    window.apf.olmap.modifyInteractionFuerVectorlayer = new ol.interaction.Modify({
        features: window.apf.olmap.selectInteractionFuerVectorlayer.getFeatures(),
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function (event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        }
    });

    function addDrawInteraction() {
        if ($geom_type_select.val() !== 'leerwert') {
            window.apf.olmap.drawInteractionFuerVectorlayer = new ol.interaction.Draw({
                source: vectorlayer.getSource(),
                type: /** @type {ol.geom.GeometryType} */ ($geom_type_select.val())
            });
            window.apf.olmap.map.addInteraction(window.apf.olmap.drawInteractionFuerVectorlayer);
            // bei 'drawend' würde man Änderungen in die DB schreiben
            window.apf.olmap.drawInteractionFuerVectorlayer.on('drawend', function (event) {
                var id = _.uniqueId();
                event.feature.setId(id);
                window.apf.olmap.modifiedFeatures = window.apf.olmap.modifiedFeatures || [];
                // id in modified_features ergänzen
                window.apf.olmap.modifiedFeatures = _.union(window.apf.olmap.modifiedFeatures, [id]);
                // speichern
                aktualisiereEbeneInLocalStorage(vectorlayer);
            });
        }
    }

    $geom_type_select.on('selectmenuchange', function () {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.drawInteractionFuerVectorlayer);
        addDrawInteraction();
    });

    addDrawInteraction();
    window.apf.olmap.map.addInteraction(window.apf.olmap.selectInteractionFuerVectorlayer);
    window.apf.olmap.map.addInteraction(window.apf.olmap.modifyInteractionFuerVectorlayer);
};