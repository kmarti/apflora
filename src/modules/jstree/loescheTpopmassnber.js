/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    erstelleIdAusDomAttributId   = require('../erstelleIdAusDomAttributId'),
    melde                        = require('../melde'),
    frageObUndeleteDatensatz     = require('../frageObUndeleteDatensatz'),
    pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen');

module.exports = function (aktiverNode, parentNode) {
    var bezeichnung;

    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }
    bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
    $("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
    $("#loeschen_dialog").dialog({
        resizable: false,
        height:    'auto',
        width:     400,
        modal:     true,
        buttons: {
            "ja, löschen!": function () {
                $(this).dialog("close");
                // Variable zum rückgängig machen erstellen
                window.apf.deleted     = window.apf.tpopmassnber;
                window.apf.deleted.typ = "tpopmassnber";
                $.ajax({
                    type: 'delete',
                    url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/tabelleIdFeld=TPopMassnBerId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                }).done(function () {
                    delete localStorage.tpopmassnberId;
                    delete window.apf.tpopmassnber;
                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                    // Parent Node-Beschriftung: Anzahl anpassen
                    window.apf.beschrifteOrdner(parentNode);
                    // Hinweis zum rückgängig machen anzeigen
                    frageObUndeleteDatensatz("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
                }).fail(function () {
                    melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
                });
            },
            "abbrechen": function () {
                $(this).dialog("close");
            }
        }
    });
};