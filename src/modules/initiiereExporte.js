/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $             = require('jquery'),
    zeigeFormular = require('./zeigeFormular');

module.exports = function (anchor) {
    $("#testartDiv").hide();
    $("#formsTitelzeile").hide();
    zeigeFormular("exporte");
    history.pushState(null, null, "index.html?exporte=true");
    if (anchor) {
        location.hash = "#" + anchor;
    }
};