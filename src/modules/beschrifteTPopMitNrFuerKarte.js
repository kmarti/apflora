// retourniert die Beschriftung für TPop auf Karten
// Wenn TPop mit ihrer Nummer beschriftet sein sollen
// tpopNr und popNr wird übernommen

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (popNr, tpopNr) {
    var tpopBeschriftung;

    popNr = popNr || "?";
    tpopBeschriftung = (tpopNr ? popNr + "/" + tpopNr : popNr + "/?");

    return tpopBeschriftung;
};