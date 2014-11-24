/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    initiiereAp     = require('./initiiereAp'),
    erstelleApliste = require('./erstelleApliste');

module.exports = function (programm) {
    var $apWaehlen      = $("#apWaehlen"),
        $apWaehlenText  = $("#apWaehlenText"),
        aplisteErstellt = $.Deferred();

    $apWaehlenText.attr('placeholder', 'Daten werden aufbereitet...');
    $apWaehlen.val('');
    $apWaehlenText.val('');
    $("#ap").hide();
    $("#forms").hide();
    $('#tree').hide();
    $("#suchen").hide();
    $("#exportieren2").hide();
    $("#hilfe").hide();
    $("#apLoeschen").hide();
    $("#exportieren1").show();

    erstelleApliste(programm, function () {
        var $programmWahlChecked = $("[name='programmWahl']:checked"),
            hinweisText;

        if ($programmWahlChecked.attr("id") === "programmNeu") {
            hinweisText = 'Art für neues Förderprogramm wählen';
        } else if ($programmWahlChecked.attr("id") === "programmAp") {
            hinweisText = 'Aktionsplan wählen';
        } else {
            hinweisText = 'Artförderprogramm wählen';
        }

        $apWaehlenText.attr('placeholder', hinweisText);

        //if (!$("#anmeldeDialog").dialog("isOpen")) {
        if (!$("#anmeldeDialog").is(':visible')) {
            $apWaehlenText.focus();
        }

        aplisteErstellt.resolve();
    });

    return aplisteErstellt.promise();
};