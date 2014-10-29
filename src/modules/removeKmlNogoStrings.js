/**
 * nimmt kml-Zeichenfolgen entgegen
 * ersetzt Zeichen(-folgen), die kml nicht erträgt mit konformen
 * retourniert das kml
 */

/*jslint node: true, browser: true, nomen: true */
'use strict';

var returnFunction = function (string) {
    if (string && typeof string === 'string') {
        return string.replace(/&/g, 'und').replace(/>>>/g, ' ').replace(/<<</g, ' ').replace(/"/g, '').replace(/'/g, "");
    }
    return string;
};

module.exports = returnFunction;