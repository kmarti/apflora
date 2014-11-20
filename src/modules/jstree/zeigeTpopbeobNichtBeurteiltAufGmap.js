/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeBeob                  = require('../gmap/zeigeBeob');

module.exports = function (nodeApId) {
    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId(nodeApId) + '/tpopId=/beobId=/nichtZuzuordnen='
    }).done(function (data) {
        if (data.length > 0) {
            zeigeBeob(data);
        } else {
            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};