/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeBeobUndTPop           = require('../gMap/zeigeBeobUndTPop'),
    zeigeBeob                  = require('../gMap/zeigeBeob');

module.exports = function (nodeApId, nodeBeobId) {
    var apId,
        beobId;

    apId   = (nodeApId   ? erstelleIdAusDomAttributId(nodeApId)   : '');
    beobId = (nodeBeobId ? erstelleIdAusDomAttributId(nodeBeobId) : '');

    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=' + apId + '/tpopId=/beobId=' + beobId + '/nichtZuzuordnen='
    }).done(function (beob) {
        if (beob.length > 0) {
            $.ajax({
                type: 'get',
                url: 'api/v1/apKarte/apId=' + apId
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