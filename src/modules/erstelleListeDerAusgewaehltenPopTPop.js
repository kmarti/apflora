/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (pop_selected, tpop_selected) {
    // rückmelden, welche Objekte gewählt wurden
    var rueckmeldung = "",
        popId,
        tpopId;

    // globale Variabeln anlegen, damit die Exportfunktionen sie später nutzen können
    window.apf.olmap.pop_selected = pop_selected;
    window.apf.olmap.tpop_selected = tpop_selected;

    if (pop_selected.length > 0) {
        // pop nach nr sortieren
        pop_selected = _.sortBy(pop_selected, function (pop) {
            var popNr = pop.get('popNr');
            return parseInt(popNr);
        });
        if (tpop_selected.length > 0) {
            // tpop und pop betitteln
            rueckmeldung += "<p class='ergebnisAuswahlListeTitel'>" + pop_selected.length + " Populationen: </p>";
        }
        rueckmeldung += "<table>";
        _.each(pop_selected, function (pop) {
            popId = pop.get('myId');
            rueckmeldung += '<tr><td><a href="#" onclick="window.apf.öffnePop(\'' + popId + '\')">';
            rueckmeldung += pop.get('popNr') + ':<\/a></td><td><a href="#" onclick="window.apf.öffnePop(\'' + popId + '\')">' + pop.get('pop_name') + '<\/a></td></tr>';
        });
        rueckmeldung += "</table>";
    }
    if (tpop_selected.length > 0) {
        // tpop nach nr dann tpopnr sortieren
        tpop_selected = _.sortBy(tpop_selected, function (tpop) {
            var popNr = tpop.get('popNr') || 0,
                tpopNr = tpop.get('tpopNr') || 0,
                pop_tpop_nr = parseFloat(parseInt(popNr) + '.' + parseInt(tpopNr));
            return pop_tpop_nr;
        });
        if (pop_selected.length > 0) {
            // tpop und pop betitteln
            rueckmeldung += "<p class='ergebnisAuswahlListeTitel ergebnisAuswahlListeTitelTPop'>" + tpop_selected.length + " Teilpopulationen: </p>";
        }
        rueckmeldung += "<table>";
        _.each(tpop_selected, function (tpop) {
            tpopId = tpop.get('myId');
            rueckmeldung += '<tr><td><a href="#" onclick="window.apf.öffneTPopInNeuemTab(\'' + tpopId + '\')">';
            rueckmeldung += tpop.get('tpop_nr_label') + ':<\/a></td><td><a href="#" onclick="window.apf.öffneTPopInNeuemTab(\'' + tpopId + '\')">';
            rueckmeldung += tpop.get('tpop_name') + "<\/a></td></tr>";
        });
        rueckmeldung += "</table>";
    }
    // Höhe der Meldung begrenzen. Leider funktioniert maxHeight nicht
    var height = "auto";
    if (tpop_selected.length > 25) {
        height = 650;
    }

    // Listentitel erstellen
    var listentitel,
        exportieren = "Exportieren: ",
        exportierenPop = "<a href='#' class='export_pop'>Populationen</a>",
        exportierenTPop = "<a href='#' class='export_tpop'>Teilpopulationen</a>, <a href='#' class='export_kontr'>Kontrollen</a>, <a href='#' class='export_massn'>Massnahmen</a>";
    if (pop_selected.length > 0 && tpop_selected.length > 0) {
        listentitel = "Gewählt wurden " + pop_selected.length + " Populationen und " + tpop_selected.length + " Teilpopulationen";
        exportieren += exportierenPop + ", " + exportierenTPop;
    } else if (pop_selected.length > 0) {
        listentitel = "Gewählt wurden " + pop_selected.length + " Populationen:";
        exportieren += exportierenPop;
    } else if (tpop_selected.length > 0) {
        listentitel = "Gewählt wurden " + tpop_selected.length + " Teilpopulationen:";
        exportieren += exportierenTPop;
    } else {
        listentitel = "Keine Populationen/Teilpopulationen gewählt";
        exportieren = "";
    }
    $("#ergebnisAuswahlHeaderText").html(listentitel);
    $("#ergebnisAuswahlListe").html(rueckmeldung);
    $("#ergebnisAuswahlFooter").html(exportieren);
    // Ergebnis-Div einblenden
    $("#ergebnisAuswahl").css("display", "block");
};

module.exports = returnFunction;