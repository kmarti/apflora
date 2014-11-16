/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                 = require('jquery'),
    clearLocalStorage = require('./clearLocalStorage'),
    erstelleArtlisten = require('./erstelleArtlisten'),
    waehleApliste     = require('./waehleApliste'),
    speichern         = require('./speichern'),
    oeffneUri         = require('./oeffneUri');

module.exports = function () {
    // jQuery ui widgets initiieren
    $("#programm_wahl").buttonset({
        create: function () {
            // erst jetzt einblenden, weil sonst die normalen checkboxen aufblitzen
            $("#programm_wahl").show();
        }
    });
    $("#messen").buttonset();
    $("button").button();
    $("#tpopfeldkontr_tabs").tabs();
    $('.apf-resizable').resizable();

    // tooltip: Klasse zuweisen, damit gestylt werden kann
    $("#label_olmap_infos_abfragen, #label_olmap_distanz_messen, #label_olmap_flaeche_messen, #label_olmap_auswaehlen, #olmap_exportieren_div, .apf_tooltip").tooltip({
        tooltipClass: "tooltip-styling-hinterlegt",
        content: function () {
            return $(this).attr('title');
        }
    });

    $(".export_abschnitt").tooltip({
        tooltipClass: "export_abschnitt_tooltip_class",
        content: function () {
            return $(this).attr('title');
        }
    });

    $('#olmap_exportieren').button({
        icons: {
            primary: "ui-icon-circle-arrow-s"
        },
        text: false,
        disabled: true
    });

    // localStorage ausräumen
    clearLocalStorage();

    // Gemeindeliste erstellen (wenn nötig)
    window.apf.erstelleGemeindeliste();

    // Datumsfelder: Widget initiieren
    var monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        wochentageKurz = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        wochentageLang = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

    $.datepicker.setDefaults({
        buttonImage: "style/images/calendar.gif",
        buttonImageOnly: true,
        dateFormat: "yy.mm.dd",
        altFormat: "yy.mm.dd",
        monthNames: monate,
        dayNamesMin: wochentageKurz,
        dayNames: wochentageLang,
        firstDay: 1,
        showOn: "button",
        defaultDate: +0,
        onSelect: function () {
            speichern(this);
        }
    });

    $("#TPopKontrDatum, #TPopMassnDatum, #JBerDatum, #IbErstelldatum").datepicker();

    // Auswahllisten aufbauen
    erstelleArtlisten();

    // HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
    $.when(waehleApliste('programm_alle')).then(function () {
        // falls eine Unteradresse angewählt wurde, diese öffnen
        oeffneUri();
    });
};