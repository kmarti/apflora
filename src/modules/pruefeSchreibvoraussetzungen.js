'use strict';

var $                         = require('jquery'),
    pruefeLesevoraussetzungen = require('./pruefeLesevoraussetzungen');

module.exports = function () {
    // kontrollieren, ob der User online ist
    if (window.apf.prüfeLesevoraussetzungen()) {
        // kontrollieren, ob der User Schreibrechte hat
        if (sessionStorage.NurLesen) {
            window.apf.melde("Sie haben keine Schreibrechte", "Speichern abgebrochen");
            return false;
        }
        return true;
    }
};