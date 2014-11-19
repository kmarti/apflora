/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    zeigeTPop                  = require('../olmap/zeigeTPop');

module.exports = function (nodeTpopId) {
    $.ajax({
        type: 'get',
        url: 'api/v1/tpopKarte/tpopId=' + erstelleIdAusDomAttributId(nodeTpopId)
    }).done(function (data) {
        if (data.length > 0) {
            zeigeTPop(data);
        } else {
            melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
        }
    }).fail(function () {
        melde("Fehler: Keine Teilpopulationen erhalten");
    });
};