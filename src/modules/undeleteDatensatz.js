/*jslint node: true, browser: true, nomen: true, todo: true */

// Stellt einen Datensatz aus window.apf.deleted wieder her
/*
** TODO
** Idee: $.data() auf #undelete nutzen
** in einen Schlüssel "undelete" einen Array von Objekten verstauen
** dann können ALLE Änderungen rückgängig gemacht werden:
** Formular zeigt Inhalt von $("#undelete").data("undelete") an
** jeder Datensatz hat Schaltfläche
** bei Klick: Ja nach Typ der Daten Wiederherstellung starten und Erfolg melden
*/

'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function () {
    var tabelle,
        data = {},
        typ,
        id,
        zeigeFormular = require('./zeigeFormular');

    if (!window.apf.deleted) {
        window.apf.melde("Wiederherstellung gescheitert", "Fehler");
        return false;
    }

    //Artname wurde für die Anzeige in undelete_div gespeichert - entfernen, da kein Feld in Tabelle
    delete window.apf.deleted.Artname;

    // tabelle setzen
    typ = window.apf.deleted.typ;
    // typ gehört nicht zum Datensatz > löschen
    delete window.apf.deleted.typ;

    switch (typ) {
    case "ap":
        tabelle = "tblAktionsplan";
        id = window.apf.deleted.ApArtId;
        //Artname wurde für die Anzeige in undelete_div gespeichert - entfernen, da kein Feld in Tabelle
        delete window.apf.deleted.Artname;
        break;
    case "apziel":
        tabelle = "tblZiel";
        id = window.apf.deleted.ZielId;
        break;
    case "zielber":
        tabelle = "tblZielBericht";
        id = window.apf.deleted.ZielBerId;
        break;
    case "erfkrit":
        tabelle = "tblErfKrit";
        id = window.apf.deleted.ErfkritId;
        break;
    case "pop":
        tabelle = "tblPopulation";
        id = window.apf.deleted.PopId;
        break;
    case "popber":
        tabelle = "tblPopBericht";
        id = window.apf.deleted.PopBerId;
        break;
    case "popmassnber":
        tabelle = "tblPopMassnBericht";
        id = window.apf.deleted.PopMassnBerId;
        break;
    case "tpop":
        tabelle = "tblTeilpopulation";
        id = window.apf.deleted.TPopId;
        break;
    case "tpopmassn":
        tabelle = "tblTeilPopMassnahme";
        id = window.apf.deleted.TPopMassnId;
        break;
    case "tpopmassnber":
        tabelle = "tblTeilPopMassnBericht";
        id = window.apf.deleted.TPopMassnBerId;
        break;
    case "tpopber":
        tabelle = "tblTeilPopBericht";
        id = window.apf.deleted.TPopBerId;
        break;
    case "tpopfeldkontr":
    case "tpopfreiwkontr":
        tabelle = "tblTeilPopFeldkontrolle";
        id = window.apf.deleted.TPopKontrId;
        break;
    case "jber":
        tabelle = "tblJBer";
        id = window.apf.deleted.JBerId;
        break;
    case "jber_uebersicht":
        tabelle = "tblJBerUebersicht";
        id = window.apf.deleted.JbuJahr;
        break;
    case "ber":
        tabelle = "tblBer";
        id = window.apf.deleted.BerId;
        break;
    case "assozarten":
        tabelle = "tblAssozArten";
        id = window.apf.deleted.AaId;
        break;
    default:
        window.apf.melde("Wiederherstellung gescheitert", "Fehler");
    }

    // window.apf.deleted enthält alle Feldnamen - viele können leer sein
    // daher nur solche mit Werten übernehmen
    _.each(window.apf.deleted, function (feldwert, feldname) {
        if (feldwert) {
            data[feldname] = feldwert;
        }
    });

    // Datensatz hinzufügen
    $.ajax({
        type: 'post',
        url: 'api/v1/insertMultiple/apflora/tabelle=' + tabelle + '/felder=' + JSON.stringify(data)
    }).done(function () {
        $(".undelete").hide();
        $("#forms").css("top", "");
        // ap kann nicht via Strukturbaum gewählt werden
        if (typ === "ap") {
            //Formulare ausblenden
            zeigeFormular();
            //neu initiieren, damit die gelöschte Art gewählt werden kann
            window.apf.initiiere_index();
            // TODO: DAS TESTEN
            // Formulare blenden
            zeigeFormular("ap");
            history.pushState(null, null, "index.html?ap=" + id);
        } else {
            //tree neu aufbauen
            $.when(window.apf.erstelle_tree(localStorage.ap_id)).then(function () {
                $("#tree").jstree("select_node", "[typ='" + typ + "']#" + id);
            });
        }
    }).fail(function () {
        window.apf.melde("Fehler: Wiederherstellung gescheitert");
    });
};

module.exports = returnFunction;