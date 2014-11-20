// übernimmt eine Liste von (markierten) TPop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpopId's der liste

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _  = require('underscore'),
    ol = require('ol');

var returnFunction = function (tpop_liste_markiert) {
    var bounds,
        xkoord_array = [],
        ykoord_array = [],
        x_max,
        y_max,
        x_min,
        y_min,
        tpopidMarkiert = [];

    // bounds der anzuzeigenden bestimmen
    if (tpop_liste_markiert && tpop_liste_markiert.length > 0) {
        _.each(tpop_liste_markiert, function (tpop) {
            tpopidMarkiert.push(tpop.TPopId);
            xkoord_array.push(tpop.TPopXKoord);
            ykoord_array.push(tpop.TPopYKoord);
        });
        // extent berechnen
        // puffern, damit immer alles sichtbar ist
        // underscore retourniert strings, also in Zahlen umwandeln
        x_max = parseInt(_.max(xkoord_array), 10) + 70;
        x_min = parseInt(_.min(xkoord_array), 10) - 70;
        y_max = parseInt(_.max(ykoord_array), 10) + 70;
        y_min = parseInt(_.min(ykoord_array), 10) - 70;
        bounds = [x_min, y_min, x_max, y_max];
    } else {
        // keine tpop übergeben, Kanton anzeigen
        bounds = [669000, 222000, 717000, 284000];
    }
    return {
        bounds: bounds,
        tpopidMarkiert: tpopidMarkiert
    };
};

module.exports = returnFunction;