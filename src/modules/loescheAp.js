/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function (ap_id) {
    var $ap_waehlen_text = $("#ap_waehlen_text"),
        zeigeFormular = require('./zeigeFormular');

    //Variable zum rückgängig machen erstellen
    window.apf.deleted = window.apf;
    window.apf.deleted.typ = "ap";
    //Artname in Textform merken
    window.apf.deleted.Artname = $ap_waehlen_text.val();
    $.ajax({
        type: 'delete',
        url: 'api/v1/apflora/tabelle=tblAktionsplan/tabelleIdFeld=ApArtId/tabelleId=' + ap_id
    }).done(function () {
        var $exportieren_2 = $("#exportieren_2");
        delete localStorage.ap_id;
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
        window.apf.erstelleApliste("programm_alle");
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
        window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das Programm der Art '" + window.apf.deleted.Artname + "' wurde gelöscht.");
        //Artname wird nicht mehr gebraucht und soll später nicht in Datensatz eingefügt werden
        delete window.apf.deleted.Artname;
        //forms muss eingeblendet sein, weil undelete_div darin ist
        zeigeFormular("keines");
    }).fail(function () {
        window.apf.melde("Fehler: Das Programm wurde nicht gelöscht");
    });
};

module.exports = returnFunction;