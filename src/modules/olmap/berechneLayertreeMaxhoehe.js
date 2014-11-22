/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery');

module.exports = function () {
    var lytMaxHeight;
    if ($(window).width() > 1000) {
        lytMaxHeight = $(window).height() - 115;
    } else {
        // Spalten sind untereinander
        lytMaxHeight = 200;
    }
    return lytMaxHeight;
};