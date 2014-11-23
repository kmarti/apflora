/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeTPopAufGmap           = require('../gMap/zeigeTPop');

module.exports = function (nodePopId) {
    $.ajax({
        type: 'get',
        url: 'api/v1/popKarte/popId=' + erstelleIdAusDomAttributId(nodePopId)
    }).done(function (data) {
        if (data && data.length > 0) {
            zeigeTPopAufGmap(data);
        } else {
            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Teilpopulationen erhalten");
    });
};