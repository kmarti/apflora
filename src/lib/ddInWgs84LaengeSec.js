/**
 * Konvertiert Projektionen
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true */
'use strict';


module.exports = function (Laenge) {
    var LaengeGrad = Math.floor(Laenge),
        LaengeMin  = Math.floor((Laenge - LaengeGrad) * 60);

    return Math.round((((Laenge - LaengeGrad) - (LaengeMin / 60)) * 60 * 60) * 100) / 100;
};