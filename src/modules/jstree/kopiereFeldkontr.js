/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                          = require('jquery'),
    erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId'),
    melde                      = require('../melde');

module.exports = function (aktiverNode) {
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.pruefeSchreibvoraussetzungen()) {
        return;
    }
    window.apf.tpopfeldkontrNodeKopiert = aktiverNode;
    // Daten des Objekts holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopfeldkontrNodeKopiert).attr("id"))
    }).done(function (data) {
        window.apf.tpopfeldkontrObjektKopiert = data[0];
    }).fail(function () {
        melde("Fehler: Die Feldkontrolle wurde nicht kopiert");
    });
};