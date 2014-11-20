/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                        = require('jquery'),
    zeigeFormular            = require('./zeigeFormular'),
    frageObUndeleteDatensatz = require('./frageObUndeleteDatensatz'),
    melde                    = require('./melde'),
    erstelleApliste          = require('./erstelleApliste');

module.exports = function (apId) {
    var $ap_waehlen_text = $("#ap_waehlen_text"),
        $exportieren_2   = $("#exportieren_2");

    //Variable zum rückgängig machen erstellen
    window.apf.deleted     = window.apf.ap;
    window.apf.deleted.typ = "ap";
    //Artname in Textform merken
    window.apf.deleted.Artname = $ap_waehlen_text.val();
    $.ajax({
        type: 'delete',
        url: 'api/v1/apflora/tabelle=tblAktionsplan/tabelleIdFeld=ApArtId/tabelleId=' + apId
    }).done(function () {
        delete localStorage.apId;
        delete window.apf.ap;
        delete localStorage.ap;
        // alle zwischengespeicherten aplisten löschen
        delete window.apf.apliste;
        $("#programm_neu")
            .attr("checked", false)
            .trigger('change');
        $("#programm_alle")
            .attr("checked", true)
            .trigger('change');
        $("#programm_wahl")
            .buttonset();
        //$("#programm_wahl").buttonset('refresh');
        erstelleApliste("programm_alle");
        $('#ap_waehlen').val('');
        $ap_waehlen_text.val('');
        $ap_waehlen_text.attr('placeholder', 'Artförderprogramm wählen');
        $("#tree").hide();
        $("#suchen").hide();
        $exportieren_2.hide();
        $("#hilfe").hide();
        $("#ap_loeschen").hide();
        $exportieren_2.show();
        $("#ap").hide();
        $("#forms").hide();
        //Hinweis zum rückgängig machen anzeigen
        frageObUndeleteDatensatz("Das Programm der Art '" + window.apf.deleted.Artname + "' wurde gelöscht.");
        //Artname wird nicht mehr gebraucht und soll später nicht in Datensatz eingefügt werden
        delete window.apf.deleted.Artname;
        //forms muss eingeblendet sein, weil undelete_div darin ist
        zeigeFormular("keines");
    }).fail(function () {
        melde("Fehler: Das Programm wurde nicht gelöscht");
    });
};