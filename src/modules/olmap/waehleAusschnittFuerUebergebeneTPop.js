// übernimmt eine Liste von (markierten) TPop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpopId's der liste

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _  = require('underscore'),
    ol = require('ol');

module.exports = function (tpopListeMarkiert) {
    var bounds,
        xArray = [],
        yArray = [],
        xMax,
        yMax,
        xMin,
        yMin,
        tpopidMarkiert = [];

    // bounds der anzuzeigenden bestimmen
    if (tpopListeMarkiert && tpopListeMarkiert.length > 0) {
        _.each(tpopListeMarkiert, function (tpop) {
            tpopidMarkiert.push(tpop.TPopId);
            xArray.push(tpop.TPopXKoord);
            yArray.push(tpop.TPopYKoord);
        });
        // extent berechnen
        // puffern, damit immer alles sichtbar ist
        // underscore retourniert strings, also in Zahlen umwandeln
        xMax   = parseInt(_.max(xArray), 10) + 70;
        xMin   = parseInt(_.min(xArray), 10) - 70;
        yMax   = parseInt(_.max(yArray), 10) + 70;
        yMin   = parseInt(_.min(yArray), 10) - 70;
        bounds = [xMin, yMin, xMax, yMax];
    } else {
        // keine tpop übergeben, Kanton anzeigen
        bounds = [669000, 222000, 717000, 284000];
    }
    return {
        bounds:         bounds,
        tpopidMarkiert: tpopidMarkiert
    };
};