/**
 * Convert CH y/x to WGS lat
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (y, x) {
    // Converts militar to civil and to unit = 1000km
    var lat,
        yAux,
        xAux;

    // Axiliary values (% Bern)
    yAux = (y - 600000) / 1000000;
    xAux = (x - 200000) / 1000000;

    // Process lat
    lat = 16.9023892
        +  3.238272 * xAux
        -  0.270978 * Math.pow(yAux, 2)
        -  0.002528 * Math.pow(xAux, 2)
        -  0.0447   * Math.pow(yAux, 2) * xAux
        -  0.0140   * Math.pow(xAux, 3);

    // Unit 10000" to 1 " and converts seconds to degrees (dec)
    lat = lat * 100 / 36;

    return lat;
};