/*jslint node: true, browser: true, nomen: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (vectorlayer) {
    var defaultStyle = {
            'Point': [new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,255,0,0.5)'
                    }),
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: '#ff0',
                        width: 1
                    })
                })
            })],
            'LineString': [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#f00',
                    width: 3
                })
            })],
            'Polygon': [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0,255,255,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#0ff',
                    width: 1
                })
            })],
            'MultiPoint': [new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,0,255,0.5)'
                    }),
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: '#f0f',
                        width: 1
                    })
                })
            })],
            'MultiLineString': [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#0f0',
                    width: 3
                })
            })],
            'MultiPolygon': [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0,0,255,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#00f',
                    width: 1
                })
            })]
        },
        entferneModifyInteractionFuerVectorLayer = require('./modules/entferneModifyInteractionFuerVectorLayer');

    if (vectorlayer === 'neuer_layer') {
        vectorlayer = new ol.layer.Vector({
            guid: window.apf.erstelleGuid(),
            source: new ol.source.Vector(),
            title: 'neue Ebene',
            kategorie: 'Eigene Ebenen',
            style: function (feature, resolution) {
                return defaultStyle[feature.getGeometry().getType()];
            }
        });
        window.apf.olmap.map.addLayer(vectorlayer);
        // umbenennen, dann ModifyInteraction erstellen
        window.apf.olmap.frageNameFürEbene(vectorlayer);
        return;
    }

    var layer_title = vectorlayer.get('title'),
        $geom_type_select = $('#modify_layer_geom_type_' + layer_title.replace(" ", "_"));

    // darin werden die ids von selectierten features gespeichert
    window.apf.olmap.modified_features = [];

    // allfällige bestehende Interaction entfernen
    entferneModifyInteractionFuerVectorLayer();

    // select interaction erstellen
    window.apf.olmap.select_interaction_für_vectorlayer = new ol.interaction.Select({
        layers: function (layer) {
            // selectable sind nur features aus dem gewählten layer
            return layer.get('title') === layer_title;
        }
    });

    // selected features sollen modifiziert werden können
    window.apf.olmap.selected_features = window.apf.olmap.select_interaction_für_vectorlayer.getFeatures();

    window.apf.olmap.selected_features.on('add', function (event) {
        // now listen if the feature is changed
        var feature = event.element,
            feature_id = feature.getId();
        // wenn jemand eine eigene Ebene ergänzt hat, kann es sein, dass die features keine id's haben
        // also wenn nötig ergänzen
        if (!feature_id) {
            feature.setId(_.uniqueId());
        }
        feature.on('change', function (event) {
            var feature = event.target,
                feature_id = feature.getId();
            window.apf.olmap.modified_features = window.apf.olmap.modified_features || [];
            // id in modified_features ergänzen
            window.apf.olmap.modified_features = _.union(window.apf.olmap.modified_features, [feature_id]);
            // speichern
            window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
        });

        // listen to pressing of delete key, then delete selected features
        $(document).on('keyup', function (event) {
            if (event.keyCode == 46) {
                // alle gewählten features aus select_interaction und source entfernen
                window.apf.olmap.selected_features.forEach(function (selected_feature) {
                    var selected_feature_id = selected_feature.getId();
                    window.apf.olmap.selected_features.remove(selected_feature);
                    // features aus vectorlayer_source entfernen
                    var vectorlayer_features = vectorlayer.getSource().getFeatures();
                    vectorlayer_features.forEach(function (source_feature) {
                        var source_feature_id = source_feature.getId();
                        if (source_feature_id === selected_feature_id) {
                            vectorlayer.getSource().removeFeature(source_feature);
                            // speichern
                            window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
                        }
                    });
                });
                $(document).off('keyup');
            }
        });

        // verhindern, dass Knoten im Strukturbaum entfernt werden
        $.jstree._reference("[typ='ap_ordner_pop']").deselect_all();
    });

    window.apf.olmap.selected_features.on('remove', function (event) {
        var feature = event.element,
            feature_id = feature.getId(),
            feature_index = window.apf.olmap.modified_features.indexOf(feature_id);
        if (feature_index > -1) {
            // speichern
            window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
            // erst wieder speichern, wenn neu verändert wurde
            window.apf.olmap.modified_features.splice(feature_index, 1);
        }
    });

    // global definieren: wird benötigt, um später (beim Klick auf 'Ebene bearbeiten') festzustellen, ob eine modify-interaction existiert
    window.apf.olmap.modify_interaction_für_vectorlayer = new ol.interaction.Modify({
        features: window.apf.olmap.select_interaction_für_vectorlayer.getFeatures(),
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function (event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });

    $geom_type_select.on('selectmenuchange', function (event) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
        addDrawInteraction();
    });

    function addDrawInteraction() {
        if ($geom_type_select.val() !== 'leerwert') {
            window.apf.olmap.draw_interaction_für_vectorlayer = new ol.interaction.Draw({
                source: vectorlayer.getSource(),
                type: /** @type {ol.geom.GeometryType} */ ($geom_type_select.val())
            });
            window.apf.olmap.map.addInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
            // bei 'drawend' würde man Änderungen in die DB schreiben
            window.apf.olmap.draw_interaction_für_vectorlayer.on('drawend', function (event) {
                var id = _.uniqueId();
                event.feature.setId(id);
                window.apf.olmap.modified_features = window.apf.olmap.modified_features || [];
                // id in modified_features ergänzen
                window.apf.olmap.modified_features = _.union(window.apf.olmap.modified_features, [id]);
                // speichern
                window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
            });
        }
    }

    addDrawInteraction();
    window.apf.olmap.map.addInteraction(window.apf.olmap.select_interaction_für_vectorlayer);
    window.apf.olmap.map.addInteraction(window.apf.olmap.modify_interaction_für_vectorlayer);
};

module.exports = returnFunction;