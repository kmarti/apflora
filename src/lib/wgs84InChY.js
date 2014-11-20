/**
 * Wandelt WGS84 in CH-Landeskoordinaten um
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (breiteGrad, breiteMin, breiteSec, laengeGrad, laengeMin, laengeSec) {
    var lat,
        lng,
        latAux,
        lngAux,
        y;

    // Converts degrees dec to sex
    lat = breiteSec + breiteMin * 60 + breiteGrad * 3600;
    lng = laengeSec + laengeMin * 60 + laengeGrad * 3600;

    // Axiliary values (% Bern)
    latAux = (lat - 169028.66) / 10000;
    lngAux = (lng -  26782.5)  / 10000;

    // Process Y
    y = 600072.37
        + 211455.93 * lngAux
        -  10938.51 * lngAux * latAux
        -      0.36 * lngAux * Math.pow(latAux, 2)
        -     44.54 * Math.pow(lngAux, 3);

    return y;
};