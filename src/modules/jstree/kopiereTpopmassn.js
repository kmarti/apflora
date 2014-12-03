/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    erstelleIdAusDomAttributId   = require('../erstelleIdAusDomAttributId'),
    melde                        = require('../melde'),
    pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen');

module.exports = function (aktiverNode) {
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }
    var tpopMassnTypCheckedText = $("#TPopMassnTyp option:checked").text();
    window.apf.tpopmassnNodeKopiert = aktiverNode;
    // Daten des Objekts holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPopMassn/feld=TPopMassnId/wertNumber=' + erstelleIdAusDomAttributId($(window.apf.tpopmassnNodeKopiert).attr("id"))
    }).done(function (data) {
        if (data && data[0]) {
            window.apf.tpopmassnObjektKopiert = data[0];
            // den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
            window.apf.tpopmassnObjektKopiert.TPopMassnBerErfolgsbeurteilungTxt = "";
            if (tpopMassnTypCheckedText) {
                window.apf.tpopmassnObjektKopiert.TPopMassnBerErfolgsbeurteilungTxt = tpopMassnTypCheckedText;
            }
        }
    }).fail(function () {
        melde("Fehler: Die Massnahme wurde nicht kopiert");
    });
};