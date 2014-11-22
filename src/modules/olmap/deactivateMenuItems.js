// deaktiviert Messen und Auswählen

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                      = require('jquery'),
    entfernePopupOverlays                  = require('./entfernePopupOverlays'),
    removeSelectFeaturesInSelectableLayers = require('./removeSelectFeaturesInSelectableLayers'),
    removeMeasureInteraction               = require('./removeMeasureInteraction'),
    entferneModifyInteractionFuerTpop      = require('./entferneModifyInteractionFuerTpop');

module.exports = function () {
    // messen deaktivieren
    removeMeasureInteraction();
    // Auswählen deaktivieren
    removeSelectFeaturesInSelectableLayers();
    // allfällige popups schliessen
    entfernePopupOverlays();
    // allfällige tooltips von ga-karten verstecken
    $('div.ga-tooltip').hide();
    // allfällige modify-interaction entfernen
    entferneModifyInteractionFuerTpop();
};