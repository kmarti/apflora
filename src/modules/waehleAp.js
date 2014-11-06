// wird aufgerufen, wenn der ap geändert wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (ap_id) {
    var initiiereAp = require('./initiiereAp'),
        programm = $("[name='programm_wahl']:checked").attr("id"),
        ap_waehlen_text,
        placeholderText = 'Artförderprogramm wählen',
        zeigeFormular   = require('./zeigeFormular'),
        waehleApliste   = require('./waehleApliste');

    if (ap_id) {
        // einen AP gewählt
        localStorage.ap_id = ap_id;

        if (programm === "programm_neu") {
            // zuerst einen neuen Datensatz anlegen
            $.ajax({
                type: 'post',
                url: 'api/v1/apInsert/apId=' + ap_id + '/user=' + sessionStorage.User
            }).done(function () {
                // nachdem ein neues Programm erstellt wurde, soll nicht mehr "neu" zur Wahl stehen, sondern "alle"
                $("#programm_neu").attr("checked", false);
                $("#programm_alle").attr("checked", true);
                $("#programm_wahl").buttonset();
                // alle zwischengespeicherten aplisten löschen
                delete window.apf.apliste;
                // Auswahlliste für Programme updaten
                $.when(waehleApliste("programm_alle")).then(function () {
                    // Strukturbaum updaten
                    $.when(window.apf.erstelle_tree(ap_id)).then(function () {
                        // gewählte Art in Auswahlliste anzeigen
                        ap_waehlen_text = _.find(window.apf.apliste.programm_alle, function (art) {
                            return art.id == ap_id;
                        });
                        if (ap_waehlen_text) {
                            $('#ap_waehlen').val(ap_id);
                            $('#ap_waehlen_text').val(ap_waehlen_text.label);
                        }
                        $("#ApArtId").val(ap_id);
                        // gewählte Art in Formular anzeigen
                        initiiereAp(ap_id);
                    });
                });
            }).fail(function () {
                window.apf.melde("Fehler: Keine Daten für Programme erhalten");
            });
        } else {
            window.apf.erstelle_tree(ap_id);
            $("#ap").show();
            initiiereAp(ap_id);
        }
    } else {
        // leeren Wert gewählt
        $('#ap_waehlen_text').val('');
        if (programm === 'programm_neu') { placeholderText = 'Art für neues Förderprogramm wählen'; }
        if (programm === 'programm_ap')  { placeholderText = 'Aktionsplan wählen' };
        $("#ap_waehlen_text").attr('placeholder', placeholderText);
        $("#tree").hide();
        $("#suchen").hide();
        $("#exportieren_2").hide();
        $("#hilfe").hide();
        $("#ap_loeschen").hide();
        $("#exportieren_1").show();
        $("#ap").hide();
        zeigeFormular();
        history.pushState(null, null, "index.html");
    }
};

module.exports = returnFunction;