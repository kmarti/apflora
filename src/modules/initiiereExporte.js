/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    zeigeFormular = require('./zeigeFormular');

module.exports = function (anchor) {
    $("#testart_div").hide();
    $("#forms_titelzeile").hide();
    zeigeFormular("exporte");
    history.pushState(null, null, "index.html?exporte=true");
    if (anchor) {
        location.hash = "#" + anchor;
    }
};