/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    $(window.apf.olmap.map.getViewport()).on('mousemove', function (e) {
        var pixel,
            hit;

        pixel = window.apf.olmap.map.getEventPixel(e.originalEvent);
        hit   = window.apf.olmap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return true;
        });
        if (hit) {
            $('#ga_karten_div').css('cursor', 'pointer');
        } else {
            $('#ga_karten_div').css('cursor', '');
        }
    });
};