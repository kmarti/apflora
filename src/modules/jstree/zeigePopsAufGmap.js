/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeTPop                   = require('../gMap/zeigeTPop');

module.exports = function (nodeApId) {
    $.ajax({
        type: 'get',
        url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId(nodeApId)
    }).done(function (data) {
        if (data && data.length > 0) {
            zeigeTPop(data);
        } else {
            melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};