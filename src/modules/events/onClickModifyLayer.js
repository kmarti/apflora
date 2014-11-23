/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                        = require('jquery'),
    entferneModifyInteractionFuerVectorLayer = require('../olmap/entferneModifyInteractionFuerVectorLayer'),
    erstelleModifyInteractionFuerVectorLayer = require('../olmap/erstelleModifyInteractionFuerVectorLayer');

module.exports = function () {
    // layer holen
    var layerDiv            = $(this).parent().siblings('input'),
        layerIndex          = layerDiv.val(),
        layer               = window.apf.olmap.map.getLayers().getArray()[layerIndex],
        buttonDiv           = $(this).siblings('label').first(),
        geomSelectDiv       = $(this).siblings('.modifyLayerGeomType'),
        geomSelectDivId     = geomSelectDiv.attr('id'),
        buttonIcon          = $(this).button('option', 'icons').primary,
        $nonModifyOptions   = $(this).siblings('.nonModifyOptions'),
        tooltipContent;

    // modify-layer steuern
    if (window.apf.olmap.modifyInteractionFuerVectorlayer) {
        // modify entfernen
        // input_div mitgeben, damit alle übrigen Layer deaktiviert werden können
        entferneModifyInteractionFuerVectorLayer(layerDiv);
    }

    // modifyLayerGeomType selectmenu zurücksetzen...
    $('.modifyLayerGeomType')
        .selectmenu()
        .selectmenu('destroy')
        .hide();

    // Zustand der Layeranzeige steuern
    if (buttonIcon === 'ui-icon-locked') {
        // war inaktiv, also aktivieren
        erstelleModifyInteractionFuerVectorLayer(layer);
        // title ändern
        tooltipContent = 'Ebene schützen';
        // selectmenu initiieren
        geomSelectDiv.selectmenu({
            width: 140
        });
        // give the selectmenu a tooltip
        // oberhalb, sonst verdeckt er den Inhalt, wenn der öffnet...
        $('#' + geomSelectDivId + '-button').tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            items:        'span',
            content:      geomSelectDiv.attr('title'),
            position: {
                my: 'left bottom-5',
                at: 'left top'
            }
        });
        // Optionen, die nicht der Bearbeitung dienen, auf zweite Zeile
        $nonModifyOptions
            .css('display', 'block')
            .css('margin-left', '3px');
        // button is pencil
        $(this)
            .button({
                icons: { primary: 'ui-icon-pencil' },
                text: false
            })
            .button('refresh');
    } else {
        // button war aktiv > deaktivieren
        // title ändern
        tooltipContent = 'Ebene bearbeiten';
        // Optionen, die nicht der Bearbeitung dienen, auf gleiche Zeile
        $nonModifyOptions
            .css('display', 'inline')
            .css('margin-left', '0');
        // button is locked
        $(this)
            .button({
                icons: { primary: 'ui-icon-locked' },
                text:  false
            })
            .button('refresh');
    }
    // tooltip von .modifyLayer anpassen
    buttonDiv
        .attr('title', tooltipContent)
        .tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            content:      tooltipContent
        });
};