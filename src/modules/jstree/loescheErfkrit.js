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
    // selektieren, falls direkt mit der rechten Maustaste gewählt wurde
    $.jstree._reference(aktiverNode).deselect_all();
    // alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
    $.jstree._reference(aktiverNode).open_all(aktiverNode);
    $.jstree._reference(aktiverNode).deselect_all();
    $.jstree._reference(aktiverNode).select_node(aktiverNode);
    bezeichnung = $.jstree._reference(aktiverNode).get_text(aktiverNode);
    $("#loeschen_dialog_mitteilung").html("Das Erfolgskriterium '" + bezeichnung + "' wird gelöscht.");
    $("#loeschen_dialog").dialog({
        resizable: false,
        height:    'auto',
        width:     400,
        modal:     true,
        buttons: {
            "ja, löschen!": function () {
                $(this).dialog("close");
                // Variable zum rückgängig machen erstellen
                window.apf.deleted     = window.apf.erfkrit;
                window.apf.deleted.typ = "erfkrit";
                $.ajax({
                    type: 'delete',
                    url: 'api/v1/apflora/tabelle=tblErfKrit/tabelleIdFeld=ErfkritId/tabelleId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id"))
                }).done(function () {
                    delete localStorage.erfkritId;
                    delete window.apf.erfkrit;
                    $.jstree._reference(aktiverNode).delete_node(aktiverNode);
                    // Parent Node-Beschriftung: Anzahl anpassen
                    window.apf.beschrifteOrdner(parentNode);
                    // Hinweis zum rückgängig machen anzeigen
                    frageObUndeleteDatensatz("Das Erfolgskriterium '" + bezeichnung + "' wurde gelöscht.");
                }).fail(function () {
                    melde("Fehler: Das Erfolgskriterium wurde nicht gelöscht");
                });
            },
            "abbrechen": function () {
                $(this).dialog("close");
            }
        }
    });
};