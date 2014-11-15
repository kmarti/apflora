// retourniert die Beschriftung für TPop auf Karten
// Wenn TPop mit ihrer Nummer beschriftet sein sollen
// tpopNr und popNr wird übernommen

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function (popNr, tpopNr) {
    var tpopBeschriftung;

    popNr = popNr || "?";
    if (tpopNr) {
        tpopBeschriftung = popNr + "/" + tpopNr;
    } else {
        tpopBeschriftung = popNr + "/?";
    }
    return tpopBeschriftung;
};

module.exports = returnFunction;