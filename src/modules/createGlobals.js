/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var pruefeObAngemeldet = require('./pruefeObAngemeldet'),
    isDateSupported    = require('./isDateSupported');

// benötigte globale Variabeln initialisieren
window.apf       = window.apf       || {};
window.apf.gmap  = window.apf.gmap  || {};
window.apf.olmap = window.apf.olmap || {};

module.exports = function () {
    // das muss aus unerfindlichem Grund direkt von index.html aus aufgerufen werden
    // sonst wirkt jquery-ui nicht
    window.apf.pruefeObAngemeldet = function () {
        pruefeObAngemeldet();
    };

    // ...und wegen oberem, muss auch diese Funktion in index.html bereit stehen
    window.apf.isDateSupported = function () {
        return isDateSupported();
    };

    // wird in index.html benutzt
    window.apf.oeffneTPop = function (tpopId) {
        require('./oeffneTPop')(tpopId);
    };

    // wird in index.html benutzt
    window.apf.oeffneTPopInNeuemTab = function (tpopId) {
        require('./oeffneTPopInNeuemTab')(tpopId);
    };

    // wird in index.html benutzt
    window.apf.oeffnePop = function (popId) {
        require('./oeffnePop')(popId);
    };

    // wird in index.html benutzt
    window.apf.oeffnePopInNeuemTab = function (popId) {
        require('./oeffnePopInNeuemTab')(popId);
    };

    // wird in index.html benutzt
    window.apf.oeffneTPopBeob = function (beobId) {
        require('./oeffneTPopBeob')(beobId);
    };

    // wird in index.html benutzt
    window.apf.oeffneTPopBeobInNeuemTab = function (beobId) {
        require('./oeffneTPopBeobInNeuemTab')(beobId);
    };

    // wird in index.html verwendet
    window.apf.oeffneFormularAlsPopup = function (formularname, id) {
        require('./oeffneFormularAlsPopup')(formularname, id);
    };

    // wird in index.html verwendet
    window.apf.olmap.messe = function (element) {
        require('./olmap/messe')(element);
    };

    // wird in index.html verwendet
    window.apf.olmap.waehleAus = function () {
        require('./olmap/waehleAus')();
    };
};