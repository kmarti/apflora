// steuert den style von pop
// selected: mit der Maus oder drag_box markierte

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

module.exports = function (feature, resolution, selected) {
    var icon = 'img/flora_icon_braun.png',
        style,
        imageStyle,
        textInhalt,
        textStyle,
        strokeColor = 'white',
        styleWithText,
        styleWithoutText,
        $layertree_pop_nr = $('#layertree_pop_nr');

    // markierte: icon ist orange und Text hat roten Hintergrund
    if (selected) {
        icon        = 'img/flora_icon_orange.png';
        strokeColor = 'red';
    }

    imageStyle = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor:       [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity:      1,
        src:          icon
    }));

    // text bestimmen, abhängig von der Einstellung im Layertree
    if ($layertree_pop_nr.is(':checked')) {
        textInhalt = feature.get('popNr');
    } else if ($('#layertree_pop_name').is(':checked')) {
        textInhalt = feature.get('pop_name');
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

    // style bestimmen
    if ($layertree_pop_nr.is(':checked')) {
        style = styleWithText;
    } else if ($('#layertree_pop_name').is(':checked')) {
        style = styleWithText;
    } else {
        style = styleWithoutText;
    }

    return [style];
};