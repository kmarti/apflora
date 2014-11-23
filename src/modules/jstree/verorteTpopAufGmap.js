/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde'),
    verorteTPop                = require('../gMap/verorteTPop');

module.exports = function (nodeTpopId) {
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + erstelleIdAusDomAttributId(nodeTpopId)
    }).done(function (data) {
        verorteTPop(data[0]);
    }).fail(function () {
        melde("Fehler: Keine Daten erhalten");
    });
};