/**
 * Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (breiteGrad, breiteMin, breiteSec, laengeGrad, laengeMin, laengeSec) {
    var lat,
        lng,
        latAux,
        lngAux,
        x;

    // Converts degrees dec to sex
    lat = breiteSec + breiteMin * 60 + breiteGrad * 3600;
    lng = laengeSec + laengeMin * 60 + laengeGrad * 3600;

    // Axiliary values (% Bern)
    latAux = (lat - 169028.66) / 10000;
    lngAux = (lng -  26782.5)  / 10000;

    x = 200147.07
        + 308807.95 * latAux
        +   3745.25 * Math.pow(lngAux, 2)
        +     76.63 * Math.pow(latAux, 2)
        -    194.56 * Math.pow(lngAux, 2) * latAux
        +    119.79 * Math.pow(latAux, 3);

    return x;
};