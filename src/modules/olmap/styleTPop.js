// steuert den style von tpop
// tpopidMarkiert: beim Aufbau des Layers werden markierte mitgegeben
// selected: mit der Maus oder drag_box markierte
// verorten: beim Verorten soll das Symbol rot sein

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

var returnFunction = function (feature, resolution, selected, verorten) {
    var icon = 'img/flora_icon.png',
        tpopid = feature.get('myId'),
        style,
        image_style,
        text_inhalt,
        text_style,
        stroke_color = 'white',
        style_with_text,
        style_without_text,
        $layertree_tpop_nr = $('#layertree_tpop_nr');

    // markierte: icon ist gelb
    if (selected) {
        icon = 'img/flora_icon_gelb.png';
        stroke_color = 'red';
    }

    if (verorten) {
        icon = 'img/flora_icon_rot.png';
    }

    image_style = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: icon
    }));

    // text bestimmen, abhängig von der Einstellung im Layertree
    if ($layertree_tpop_nr.is(':checked')) {
        text_inhalt = feature.get('tpop_nr_label');
    } else if ($('#layertree_tpop_name').is(':checked')) {
        text_inhalt = feature.get('tpop_name');
    }

    text_style = new ol.style.Text({
        font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
        text: text_inhalt,
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: stroke_color,
            width: 7
        })
    });

    style_with_text = new ol.style.Style({
        image: image_style,
        text: text_style
    });
    style_without_text = new ol.style.Style({
        image: image_style
    });

    // style bestimmen
    if ($layertree_tpop_nr.is(':checked')) {
        style = style_with_text;
    } else if ($('#layertree_tpop_name').is(':checked')) {
        style = style_with_text;
    } else {
        style = style_without_text;
    }

    return [style];
};

module.exports = returnFunction;