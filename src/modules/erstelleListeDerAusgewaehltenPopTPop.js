/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (pop_selected, tpop_selected) {
    // rückmelden, welche Objekte gewählt wurden
    var rückmeldung = "",
        pop_id,
        tpop_id;

    // globale Variabeln anlegen, damit die Exportfunktionen sie später nutzen können
    window.apf.olmap.pop_selected = pop_selected;
    window.apf.olmap.tpop_selected = tpop_selected;

    if (pop_selected.length > 0) {
        // pop nach nr sortieren
        pop_selected = _.sortBy(pop_selected, function (pop) {
            var pop_nr = pop.get('pop_nr');
            return parseInt(pop_nr);
        });
        if (tpop_selected.length > 0) {
            // tpop und pop betitteln
            rückmeldung += "<p class='ergebnisAuswahlListeTitel'>" + pop_selected.length + " Populationen: </p>";
        }
        rückmeldung += "<table>";
        _.each(pop_selected, function (pop) {
            pop_id = pop.get('myId');
            rückmeldung += '<tr><td><a href="#" onclick="window.apf.öffnePop("' + pop_id + '")">';
            rückmeldung += pop.get('pop_nr') + ':<\/a></td><td><a href="#" onclick="window.apf.öffnePop("' + pop_id + '")">' + pop.get('pop_name') + '<\/a></td></tr>';
        });
        rückmeldung += "</table>";
    }
    if (tpop_selected.length > 0) {
        // tpop nach nr dann tpopnr sortieren
        tpop_selected = _.sortBy(tpop_selected, function (tpop) {
            var pop_nr = tpop.get('pop_nr') || 0,
                tpop_nr = tpop.get('tpop_nr') || 0,
                pop_tpop_nr = parseFloat(parseInt(pop_nr) + '.' + parseInt(tpop_nr));
            return pop_tpop_nr;
        });
        if (pop_selected.length > 0) {
            // tpop und pop betitteln
            rückmeldung += "<p class='ergebnisAuswahlListeTitel ergebnisAuswahlListeTitelTPop'>" + tpop_selected.length + " Teilpopulationen: </p>";
        }
        rückmeldung += "<table>";
        _.each(tpop_selected, function (tpop) {
            tpop_id = tpop.get('myId');
            rückmeldung += '<tr><td><a href="#" onclick="window.apf.öffneTPopInNeuemTab("' + tpop_id + '")">';
            rückmeldung += tpop.get('tpop_nr_label') + ':<\/a></td><td><a href="#" onclick="window.apf.öffneTPopInNeuemTab("' + tpop_id + '")">';
            rückmeldung += tpop.get('tpop_name') + "<\/a></td></tr>";
        });
        rückmeldung += "</table>";
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
    $("#ergebnisAuswahlListe").html(rückmeldung);
    $("#ergebnisAuswahlFooter").html(exportieren);
    // Ergebnis-Div einblenden
    $("#ergebnisAuswahl").css("display", "block");
};

module.exports = returnFunction;