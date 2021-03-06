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

var $             = require('jquery'),
    _             = require('underscore'),
    melde         = require('./melde'),
    zeigeFormular = require('./zeigeFormular'),
    waehleApliste = require('./waehleApliste'),
    oeffneUri     = require('./oeffneUri'),
    erstelleTree  = require('./jstree/erstelleTree');

module.exports = function () {
    var tabelle,
        data = {},
        typ,
        id;

    if (!window.apf.deleted) {
        melde("Wiederherstellung gescheitert", "Fehler");
        return false;
    }

    //Artname wurde für die Anzeige in undeleteDiv gespeichert - entfernen, da kein Feld in Tabelle
    delete window.apf.deleted.Artname;

    // tabelle setzen
    typ = window.apf.deleted.typ;
    // typ gehört nicht zum Datensatz > löschen
    delete window.apf.deleted.typ;

    switch (typ) {
    case "ap":
        tabelle = "tblAp";
        id = window.apf.deleted.ApArtId;
        //Artname wurde für die Anzeige in undeleteDiv gespeichert - entfernen, da kein Feld in Tabelle
        delete window.apf.deleted.Artname;
        break;
    case "apziel":
        tabelle = "tblZiel";
        id = window.apf.deleted.ZielId;
        break;
    case "zielber":
        tabelle = "tblZielBer";
        id = window.apf.deleted.ZielBerId;
        break;
    case "erfkrit":
        tabelle = "tblErfKrit";
        id = window.apf.deleted.ErfkritId;
        break;
    case "pop":
        tabelle = "tblPop";
        id = window.apf.deleted.PopId;
        break;
    case "popber":
        tabelle = "tblPopBer";
        id = window.apf.deleted.PopBerId;
        break;
    case "popmassnber":
        tabelle = "tblPopMassnBer";
        id = window.apf.deleted.PopMassnBerId;
        break;
    case "tpop":
        tabelle = "tblTPop";
        id = window.apf.deleted.TPopId;
        break;
    case "tpopmassn":
        tabelle = "tblTPopMassn";
        id = window.apf.deleted.TPopMassnId;
        break;
    case "tpopmassnber":
        tabelle = "tblTPopMassnBer";
        id = window.apf.deleted.TPopMassnBerId;
        break;
    case "tpopber":
        tabelle = "tblTPopBer";
        id = window.apf.deleted.TPopBerId;
        break;
    case "tpopfeldkontr":
    case "tpopfreiwkontr":
        tabelle = "tblTPopKontr";
        id = window.apf.deleted.TPopKontrId;
        break;
    case "jber":
        tabelle = "tblJBer";
        id = window.apf.deleted.JBerId;
        break;
    case "jberUebersicht":
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
        melde("Wiederherstellung gescheitert", "Fehler");
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
            // erzwingen, dass die apliste neu geholt wird
            delete window.apf.apliste.programmAlle;
            $.when(waehleApliste('programmAlle')).then(function () {
                // pushState funktioniert nicht, unklar wieso
                history.pushState(null, null, "index.html?ap=" + id);
                oeffneUri();
            });
        } else {
            //tree neu aufbauen
            $.when(erstelleTree(localStorage.apId)).then(function () {
                $("#tree").jstree("select_node", "[typ='" + typ + "']#" + id);
            });
        }
    }).fail(function () {
        melde("Fehler: Wiederherstellung gescheitert");
    });
};