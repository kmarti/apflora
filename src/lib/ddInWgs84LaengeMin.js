/**
 * Konvertiert Projektionen
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true */
'use strict';


module.exports = function (Laenge) {
    var LaengeGrad = Math.floor(Laenge);
    return Math.floor((Laenge - LaengeGrad) * 60);
};