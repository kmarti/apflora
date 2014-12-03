/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                        = require('jquery'),
    zeigeFormular            = require('./zeigeFormular'),
    frageObUndeleteDatensatz = require('./frageObUndeleteDatensatz'),
    melde                    = require('./melde'),
    erstelleApliste          = require('./erstelleApliste');

module.exports = function (apId) {
    var $apWaehlenText = $("#apWaehlenText"),
        $exportieren2  = $("#exportieren2");

    //Variable zum rückgängig machen erstellen
    window.apf.deleted     = window.apf.ap;
    window.apf.deleted.typ = "ap";
    //Artname in Textform merken
    window.apf.deleted.Artname = $apWaehlenText.val();
    $.ajax({
        type: 'delete',
        url: 'api/v1/apflora/tabelle=tblAp/tabelleIdFeld=ApArtId/tabelleId=' + apId
    }).done(function () {
        delete localStorage.apId;
        delete window.apf.ap;
        delete localStorage.ap;
        // alle zwischengespeicherten aplisten löschen
        delete window.apf.apliste;
        $("#programmNeu")
            .attr("checked", false)
            .trigger('change');
        $("#programmAlle")
            .attr("checked", true)
            .trigger('change');
        $("#programmWahl")
            .buttonset();
        //$("#programmWahl").buttonset('refresh');
        erstelleApliste("programmAlle");
        $('#apWaehlen').val('');
        $apWaehlenText.val('');
        $apWaehlenText.attr('placeholder', 'Artförderprogramm wählen');
        $("#tree").hide();
        $("#suchen").hide();
        $exportieren2.hide();
        $("#hilfe").hide();
        $("#apLoeschen").hide();
        $exportieren2.show();
        $("#ap").hide();
        $("#forms").hide();
        //Hinweis zum rückgängig machen anzeigen
        frageObUndeleteDatensatz("Das Programm der Art '" + window.apf.deleted.Artname + "' wurde gelöscht.");
        //Artname wird nicht mehr gebraucht und soll später nicht in Datensatz eingefügt werden
        delete window.apf.deleted.Artname;
        //forms muss eingeblendet sein, weil undeleteDiv darin ist
        zeigeFormular("keines");
    }).fail(function () {
        melde("Fehler: Das Programm wurde nicht gelöscht");
    });
};