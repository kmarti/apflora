/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (aktiverNode) {
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.pruefeSchreibvoraussetzungen()) {
        return;
    }
    window.apf.beobZugeordnetNodeAusgeschnitten = aktiverNode;
};