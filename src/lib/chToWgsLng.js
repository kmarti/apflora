/**
 * Convert CH y/x to WGS long
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (y, x) {
    // Converts militar to civil and to unit = 1000km
    var lng,
        yAux,
        xAux;

    // Axiliary values (% Bern)
    yAux = (y - 600000) / 1000000;
    xAux = (x - 200000) / 1000000;

    // Process long
    lng = 2.6779094
        + 4.728982 * yAux
        + 0.791484 * yAux * xAux
        + 0.1306   * yAux * Math.pow(xAux, 2)
        - 0.0436   * Math.pow(yAux, 3);

    // Unit 10000" to 1 " and converts seconds to degrees (dec)
    lng = lng * 100 / 36;

    return lng;
};