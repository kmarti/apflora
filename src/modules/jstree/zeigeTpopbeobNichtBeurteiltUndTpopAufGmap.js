/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeBeobUndTPop           = require('../gmap/zeigeBeobUndTPop'),
    zeigeBeob                  = require('../gmap/zeigeBeob');

module.exports = function (nodeApId) {
    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=' + erstelleIdAusDomAttributId(nodeApId) + '/tpopId=/beobId=/nichtZuzuordnen='
    }).done(function (beob) {
        if (beob.length > 0) {
            $.ajax({
                type: 'get',
                url: 'api/v1/apKarte/apId=' + erstelleIdAusDomAttributId(nodeApId)
            }).done(function (tpop) {
                if (tpop && tpop.length > 0) {
                    zeigeBeobUndTPop(beob, tpop);
                } else {
                    zeigeBeob(beob);
                }
            });
        } else {
            melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};