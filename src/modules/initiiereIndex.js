/*jslint node: true, browser: true, nomen: true */
'use strict';

var $ = require('jquery');
require('jquery-ui');

var returnFunction = function () {
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
            window.apf.speichern(this);
        }
    });

    $("#TPopKontrDatum, #TPopMassnDatum, #JBerDatum, #IbErstelldatum").datepicker();

    // Variablen setzen für Formular Feldkontrollen, hier damit nur ein mal
    window.apf.feldliste_feldkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrTyp', 'TPopKontrJungpfl', 'TPopKontrVitalitaet', 'TPopKontrUeberleb', 'TPopKontrEntwicklung', 'TPopKontrUrsach', 'TPopKontrUrteil', 'TPopKontrAendUms', 'TPopKontrAendKontr', 'TPopKontrGuid', 'TPopKontrFlaeche', 'TPopKontrVegTyp', 'TPopKontrKonkurrenz', 'TPopKontrMoosschicht', 'TPopKontrKrautschicht', 'TPopKontrStrauchschicht', 'TPopKontrBaumschicht', 'TPopKontrBodenTyp', 'TPopKontrBodenKalkgehalt', 'TPopKontrBodenDurchlaessigkeit', 'TPopKontrBodenHumus', 'TPopKontrBodenNaehrstoffgehalt', 'TPopKontrBodenAbtrag', 'TPopKontrWasserhaushalt', 'TPopKontrHandlungsbedarf', 'TPopKontrIdealBiotopUebereinst', 'TPopKontrLeb', 'TPopKontrLebUmg'];

    window.apf.feldliste_freiwkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrPlan', 'TPopKontrUebFlaeche', 'TPopKontrUebPfl', 'TPopKontrNaBo', 'TPopKontrJungPflJN', 'TPopKontrVegHoeMax', 'TPopKontrVegHoeMit', 'TPopKontrGefaehrdung', 'TPopKontrGuid'];

    // Auswahllisten aufbauen
    $("#ap_loeschen").hide();
    window.apf.erstelleArtlisten();

    // HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
    window.apf.wähleApListe('programm_alle', function () {
        console.log('wähleApListe aufgerufen in initiiereIndex');
        // falls eine Unteradresse angewählt wurde, diese öffnen
        window.apf.öffneUri();
    });
};

module.exports = returnFunction;