/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeBeobUndTPop           = require('../gmap/zeigeBeobUndTPop'),
    zeigeBeob                  = require('../gmap/zeigeBeob');

module.exports = function (nodeBeobId) {
    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=/tpopId=/beobId=' + erstelleIdAusDomAttributId(nodeBeobId) + '/nichtZuzuordnen='
    }).done(function (beob) {
        if (beob && beob[0]) {
            // Array belassen -zeigeBeob benötigt einen Array
            $.ajax({
                type: 'get',
                url: 'api/v1/apKarte/apId=' + localStorage.apId
            }).done(function (tpop) {
                if (tpop && tpop.length > 0) {
                    zeigeBeobUndTPop(beob, tpop);
                } else {
                    zeigeBeob(beob);
                }
            });
        } else {
            melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};