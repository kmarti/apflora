// deaktiviert Messen und Auswählen

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                      = require('jquery'),
    entfernePopupOverlays                  = require('./entfernePopupOverlays'),
    removeSelectFeaturesInSelectableLayers = require('./removeSelectFeaturesInSelectableLayers');

module.exports = function () {
    // messen deaktivieren
    window.apf.olmap.removeMeasureInteraction();
    // Auswählen deaktivieren
    removeSelectFeaturesInSelectableLayers();
    // allfällige popups schliessen
    entfernePopupOverlays();
    // allfällige tooltips von ga-karten verstecken
    $('div.ga-tooltip').hide();
    // allfällige modify-interaction entfernen
    window.apf.olmap.entferneModifyInteractionFuerTpop();
};