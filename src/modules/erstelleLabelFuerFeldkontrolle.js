// erwartet aktuelle Werte für jahr und typ
// erstellt den label für den Baum

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (jahr, typ) {
    jahr = jahr || "(kein Jahr)";
    typ  = typ  || "(kein Typ)";
    return jahr + ": " + typ;
};