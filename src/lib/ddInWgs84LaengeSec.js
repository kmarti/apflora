/**
 * Konvertiert Projektionen
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (laenge) {
    var laengeGrad = Math.floor(laenge),
        laengeMin  = Math.floor((laenge - laengeGrad) * 60);

    return Math.round((((laenge - laengeGrad) - (laengeMin / 60)) * 60 * 60) * 100) / 100;
};