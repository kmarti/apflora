/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen');

module.exports = function (aktiverNode) {
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }
    window.apf.beobNodeAusgeschnitten = aktiverNode;
};