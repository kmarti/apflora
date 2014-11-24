/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    entferneLayerNachName = require('../../../../olMap/entferneLayerNachName'),
    initiiereLayertree    = require('../../../../olMap/initiiereLayertree'),
    melde                 = require('../../../../melde');

module.exports = function () {
    // layer holen
    var layerDiv   = $(this).parent().parent().siblings('input'),
        layerIndex = layerDiv.val(),
        layer      = window.apf.olMap.map.getLayers().getArray()[layerIndex],
        layerName  = layer.get('title');

    if (layerName) {
        // open a dialog
        $("#entferneEigeneEbeneDialog").dialog({
            resizable: false,
            height:    'auto',
            width:     400,
            modal:     true,
            buttons: {
                "ja, entfernen!": function () {
                    $(this).dialog("close");
                    entferneLayerNachName(layerName);
                    initiiereLayertree('Eigene Ebenen');
                },
                "abbrechen": function () {
                    $(this).dialog("close");
                }
            }
        });
    } else {
        melde('Fehler: Layer nicht entfernt');
    }
};