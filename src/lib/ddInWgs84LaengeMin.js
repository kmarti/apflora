/**
 * Konvertiert Projektionen
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (laenge) {
    var laengeGrad = Math.floor(laenge);
    return Math.floor((laenge - laengeGrad) * 60);
};