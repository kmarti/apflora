'use strict';

var $ = require('jquery');
require('jquery-ui');

var initiiereIndex = function() {
    // Versuch, damit $.ajax auch in IE funktioniert
    // jQuery hängt an jede Anfrage ein &_= und Zufahlszahl
    // AUSGESCHALTET, WEIL TPOPFELDKONTR_UPDATE_MULTIPLE.PHP NICHT MEHR FUNKTIONIERTE (UND MEHR?)
    //$.ajaxSetup({cache:false})

    // jQuery ui widgets initiieren
    $("#programm_wahl").buttonset({
        create: function() {
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
        content: function() {
            return $(this).attr('title');
        }
    });

    $(".export_abschnitt").tooltip({
        tooltipClass: "export_abschnitt_tooltip_class",
        content: function() {
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
    $("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });
    $("#TPopMassnDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopMassnJahr", altFormat: "yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });
    $("#JBerDatum, #IbErstelldatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });

    // Variablen setzen für Formular Feldkontrollen, hier damit nur ein mal
    window.apf.feldliste_feldkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrTyp', 'TPopKontrJungpfl', 'TPopKontrVitalitaet', 'TPopKontrUeberleb', 'TPopKontrEntwicklung', 'TPopKontrUrsach', 'TPopKontrUrteil', 'TPopKontrAendUms', 'TPopKontrAendKontr', 'TPopKontrGuid', 'TPopKontrFlaeche', 'TPopKontrVegTyp', 'TPopKontrKonkurrenz', 'TPopKontrMoosschicht', 'TPopKontrKrautschicht', 'TPopKontrStrauchschicht', 'TPopKontrBaumschicht', 'TPopKontrBodenTyp', 'TPopKontrBodenKalkgehalt', 'TPopKontrBodenDurchlaessigkeit', 'TPopKontrBodenHumus', 'TPopKontrBodenNaehrstoffgehalt', 'TPopKontrBodenAbtrag', 'TPopKontrWasserhaushalt', 'TPopKontrHandlungsbedarf', 'TPopKontrIdealBiotopUebereinst', 'TPopKontrLeb', 'TPopKontrLebUmg'];
    window.apf.feldliste_freiwkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrPlan', 'TPopKontrUebFlaeche', 'TPopKontrUebPfl', 'TPopKontrNaBo', 'TPopKontrJungPflJN', 'TPopKontrVegHoeMax', 'TPopKontrVegHoeMit', 'TPopKontrGefaehrdung', 'TPopKontrGuid'];

    // Auswahllisten aufbauen
    $("#ap_loeschen").hide();
    window.apf.erstelle_artlisten();

    // HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
    $.when(window.apf.wähleApListe("programm_alle"))
        .then(function() {
            // falls eine Unteradresse angewählt wurde, diese öffnen
            window.apf.öffneUri();
        });
};

module.exports = initiiereIndex;