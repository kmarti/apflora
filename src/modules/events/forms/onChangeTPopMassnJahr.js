/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    speichern = require('../../speichern');

module.exports = function () {
    var objekt,
        $TPopMassnDatum = $('#TPopMassnDatum');

    if ($TPopMassnDatum.val()) {
        $TPopMassnDatum.val(null);
        objekt          = {};
        objekt.name     = 'TPopMassnDatum';
        objekt.formular = 'tpopmassn';
        speichern(objekt);
    }
};