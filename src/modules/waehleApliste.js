/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $           = require('jquery'),
    initiiereAp = require('./initiiereAp');

module.exports = function (programm) {
    var $ap_waehlen      = $("#ap_waehlen"),
        $ap_waehlen_text = $("#ap_waehlen_text"),
        aplisteErstellt  = $.Deferred();

    $ap_waehlen_text.attr('placeholder', 'Daten werden aufbereitet...');
    $ap_waehlen.val('');
    $ap_waehlen_text.val('');
    $("#ap").hide();
    $("#forms").hide();
    $('#tree').hide();
    $("#suchen").hide();
    $("#exportieren_2").hide();
    $("#hilfe").hide();
    $("#ap_loeschen").hide();
    $("#exportieren_1").show();

    window.apf.erstelleApliste(programm, function () {
        var $programm_wahl_checked = $("[name='programm_wahl']:checked"),
            hinweisText;

        if ($programm_wahl_checked.attr("id") === "programm_neu") {
            hinweisText = 'Art für neues Förderprogramm wählen';
        } else if ($programm_wahl_checked.attr("id") === "programm_ap") {
            hinweisText = 'Aktionsplan wählen';
        } else {
            hinweisText = 'Artförderprogramm wählen';
        }

        $ap_waehlen_text.attr('placeholder', hinweisText);

        if (!$("#anmelde_dialog").dialog("isOpen")) {
            $ap_waehlen_text.focus();
        }

        aplisteErstellt.resolve();
    });

    return aplisteErstellt.promise();
};