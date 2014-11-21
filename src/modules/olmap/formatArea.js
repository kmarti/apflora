/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
*/

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

module.exports = function (polygon) {
    var area = polygon.getArea(),
        output;

    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
    }
    return output;
};