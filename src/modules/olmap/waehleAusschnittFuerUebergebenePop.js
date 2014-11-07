// übernimmt eine Liste von (markierten) Pop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpop_id's der liste

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _  = require('underscore'),
    ol = require('ol');

var returnFunction = function (pop_liste_markiert) {
    var bounds,
        xkoord_array = [],
        ykoord_array = [],
        x_max,
        y_max,
        x_min,
        y_min,
        // bounds der anzuzeigenden bestimmen
        popid_markiert = [];

    if (pop_liste_markiert && pop_liste_markiert.length > 0) {
        _.each(pop_liste_markiert, function (pop) {
            popid_markiert.push(pop.PopId);
            xkoord_array.push(pop.PopXKoord);
            ykoord_array.push(pop.PopYKoord);
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
        popid_markiert: popid_markiert
    };
};

module.exports = returnFunction;