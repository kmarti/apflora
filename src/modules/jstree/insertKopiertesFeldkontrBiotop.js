/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    _                                         = require('underscore'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    melde                                     = require('../melde'),
    pruefeSchreibvoraussetzungen              = require('../pruefeSchreibvoraussetzungen');

module.exports = function (nodeFeldkontrId) {
    var data  = {};
    data.id   = erstelleIdAusDomAttributId(nodeFeldkontrId);
    data.user = sessionStorage.user;
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }
    _.each(window.apf.feldkontrBiotop, function (value, key) {
        $("#" + key).val(value);
        data[key] = value;
    });
    // jetzt alles speichern
    $.ajax({
        type: 'post',
        url: 'api/v1/updateMultiple/apflora/tabelle=tblTPopKontr/felder=' + JSON.stringify(data)
    }).fail(function () {
        melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
    });
};