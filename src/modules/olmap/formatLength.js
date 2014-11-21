/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
*/

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

module.exports = function (line) {
    var length = Math.round(line.getLength() * 100) / 100,
        output;

    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' km';
    } else {
        output = (Math.round(length * 100) / 100) + ' m';
    }
    return output;
};