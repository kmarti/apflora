/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeTPopBeob              = require('../gmap/zeigeTPopBeob');

module.exports = function (nodeTpopId, nodeBeobId) {
    var tpopId          = '',
        beobId          = '';

    // id's vorbereiten
    if (nodeTpopId) { tpopId = erstelleIdAusDomAttributId(nodeTpopId); }
    if (nodeBeobId) { beobId = erstelleIdAusDomAttributId(nodeBeobId); }

    // es ist immer nur eine der id's gegeben
    $.ajax({
        type: 'get',
        url: '/api/v1/beobKarte/apId=/tpopId=' + tpopId + '/beobId=' + beobId + '/nichtZuzuordnen='
    }).done(function (data) {
        if (data) {
            zeigeTPopBeob(data);
        } else {
            melde("Es gibt keine Beobachtungen mit Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};