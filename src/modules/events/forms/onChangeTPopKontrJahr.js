/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $         = require('jquery'),
    speichern = require('../../speichern');

module.exports = function () {
    var objekt,
        $TPopKontrDatum = $('#TPopKontrDatum');

    if ($TPopKontrDatum.val()) {
        $TPopKontrDatum.val(null);
        objekt          = {};
        objekt.name     = 'TPopKontrDatum';
        objekt.formular = 'tpopfeldkontr';
        speichern(objekt);
    }
};