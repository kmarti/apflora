/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                    = require('jquery'),
    erstelleListeDerAusgewaehltenPopTPop = require('../erstelleListeDerAusgewaehltenPopTPop'),
    getSelectedFeaturesOfType            = require('./getSelectedFeaturesOfType');

module.exports = function () {
    var popSelected  = [],
        tpopSelected = [];

    // prüfen, ob pop / tpop gewählt wurden
    popSelected  = getSelectedFeaturesOfType('pop');
    tpopSelected = getSelectedFeaturesOfType('tpop');

    // wenn ja: anzeigen
    if (popSelected.length > 0 || tpopSelected.length > 0) {
        erstelleListeDerAusgewaehltenPopTPop(popSelected, tpopSelected);
    } else {
        $("#olMapErgebnisAuswahl").hide();
    }
};