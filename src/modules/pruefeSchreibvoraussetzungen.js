/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                         = require('jquery'),
    pruefeLesevoraussetzungen = require('./pruefeLesevoraussetzungen'),
    melde                     = require('./melde');

module.exports = function () {
    // kontrollieren, ob der User online ist
    if (window.apf.pruefeLesevoraussetzungen()) {
        // kontrollieren, ob der User Schreibrechte hat
        if (sessionStorage.NurLesen) {
            melde("Sie haben keine Schreibrechte", "Speichern abgebrochen");
            return false;
        }
        return true;
    }
};