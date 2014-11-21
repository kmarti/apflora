/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    erstelleIdAusDomAttributId   = require('../erstelleIdAusDomAttributId'),
    pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen');

module.exports = function (aktiverNode) {
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }
    // Jetzt die PopId merken - ihr muss danach eine andere ApArtId zugeteilt werden
    window.apf.popId = erstelleIdAusDomAttributId($(aktiverNode).attr("id"));
    // merken, dass ein node ausgeschnitten wurde
    window.apf.popZumVerschiebenGemerkt = true;
    // und wie er heisst (um es später im Kontextmenü anzuzeigen)
    window.apf.popBezeichnung = $("#PopNr").val() + " " + $("#PopName").val();
};