// steuert den style von tpop
// tpopidMarkiert: beim Aufbau des Layers werden markierte mitgegeben
// selected: mit der Maus oder drag_box markierte
// verorten: beim Verorten soll das Symbol rot sein

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

module.exports = function (feature, resolution, selected, verorten) {
    var icon = 'img/flora_icon.png',
        imageStyle,
        textInhalt,
        textStyle,
        strokeColor = 'white',
        styleWithText,
        styleWithoutText,
        $layertree_tpop_nr = $('#layertree_tpop_nr');

    // markierte: icon ist gelb
    if (selected) {
        icon        = 'img/flora_icon_gelb.png';
        strokeColor = 'red';
    }

    if (verorten) {
        icon = 'img/flora_icon_rot.png';
    }

    imageStyle = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor:       [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity:      1,
        src:          icon
    }));

    // text bestimmen, abhängig von der Einstellung im Layertree
    if ($layertree_tpop_nr.is(':checked')) {
        textInhalt = feature.get('tpop_nr_label');
    } else if ($('#layertree_tpop_name').is(':checked')) {
        textInhalt = feature.get('tpop_name');
    }

    textStyle = new ol.style.Text({
        font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
        text: textInhalt,
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: strokeColor,
            width: 7
        })
    });

    styleWithText = new ol.style.Style({
        image: imageStyle,
        text:  textStyle
    });
    styleWithoutText = new ol.style.Style({
        image: imageStyle
    });

    // style bestimmen und zurück geben
    if ($layertree_tpop_nr.is(':checked')) {
        return [styleWithText];
    }
    if ($('#layertree_tpop_name').is(':checked')) {
        return [styleWithText];
    }
    return [styleWithoutText];
};