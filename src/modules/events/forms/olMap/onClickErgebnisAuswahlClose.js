/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    $('#olMapInfosAbfragen').trigger('click');
    $("#olMapErgebnisAuswahl").hide();
};