/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeTPop                  = require('../olMap/zeigeTPop');

module.exports = function (nodePopId) {
    $.ajax({
        type: 'get',
        url: 'api/v1/tpopsKarte/popId=' + erstelleIdAusDomAttributId(nodePopId)
    }).done(function (data) {
        if (data.length > 0) {
            zeigeTPop(data);
        } else {
            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Teilpopulationen erhalten");
    });
};