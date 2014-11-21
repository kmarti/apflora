/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $      = require('jquery'),
    google = require('google');

module.exports = function () {
    var lytMaxHeight = window.apf.berechneOlmapLayertreeMaxhoehe,
        formsHeight,
        maxWidth;

    // Formulare sind unbegrenzt hoch aber Karten sollen das nicht sein
    if (window.apf.kartenhoeheManuell) {
        formsHeight = $(window).height() - 17;
        maxWidth    = $("#forms").width();
        // resizable neu rechnen lassen, sonst bleibt ga_karten_div in falscher Grösse
        // leider funktioniert das nicht wie gewünscht:
        // wenn der Benutzer die Grösse verändert hat, passt sich ga_karten_div nicht mehr richtig an Veränderungen des Bildschirms an...
        //$('.apf-resizable').resizable('destroy');
        //$('.apf-resizable').resizable();
        /*$('.apf-resizable').resizable({
            maxWidth: maxWidth,
            maxHeight: formsHeight
        });*/
        $("#forms").height(formsHeight);
        $('#ga_karten_div')
            //.css('width', maxWidth)
            .css('max-width', maxWidth)
            //.css('height', formsHeight)
            .css('max-height', formsHeight);
        $('.apf-resizable').resizable();
        if (window.apf.olmap && window.apf.olmap.map) {
            window.apf.olmap.map.updateSize();
            // Maximalgrösse des Layertree begrenzen
            $('#olmap_layertree_layers').css('max-height', lytMaxHeight);
        }
        if (google !== undefined && google.maps && window.apf.gmap && window.apf.gmap.map !== undefined) {
            google.maps.event.trigger(window.apf.gmap.map, 'resize');
        }
    } else {
        $("#forms").height('auto');
    }
};