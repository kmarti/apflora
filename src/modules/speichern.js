// wird von allen Formularen benutzt
// speichert den Wert eines Feldes in einem Formular
// übernimmt das Objekt, in dem geändert wurde
// kann nicht modularisiert werden, weil jstree verwendet wird und dieses nicht mit node kompatibel ist

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

// braucht $ wegen jstree
var speichern = function (that) {
    var feldtyp,
        formular,
        tabelleInDb,
        tabelleIdFeld,
        feldname,
        feldwert,
        objekt,
        $PopName             = $("#PopName"),
        $PopNr               = $("#PopNr"),
        $tree                = $("#tree"),
        $PopBerJahr          = $("#PopBerJahr"),
        $PopMassnBerJahr     = $("#PopMassnBerJahr"),
        $TPopNr              = $("#TPopNr"),
        $TPopFlurname        = $("#TPopFlurname"),
        $TPopBerJahr         = $("#TPopBerJahr"),
        $TPopMassnJahr       = $("#TPopMassnJahr"),
        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked"),
        $TPopMassnBerJahr    = $("#TPopMassnBerJahr"),
        $ZielBerJahr         = $("#ZielBerJahr"),
        $ZielBerErreichung   = $("#ZielBerErreichung"),
        $BerJahr             = $("#BerJahr"),
        $BerTitel            = $("#BerTitel"),
        configuration        = require('./configuration'),
        waehleAp             = require('./waehleAp'),
        melde                = require('./melde');

    if (window.apf.prüfeSchreibvoraussetzungen()) {
        formular = $(that).attr("formular");
        // infos über die betroffene Tabelle holen
        var table = _.findWhere(configuration.tables, {form: formular});
        // die zu aktualisierende Tabelle in der DB
        tabelleInDb = table.tabelleInDb;
        // das zu aktualisierende Feld
        tabelleIdFeld = table.tabelleIdFeld;
        feldname = that.name;
        feldtyp = $(that).attr("type") || null;
        // Feldwert ermitteln
        if (feldtyp && feldtyp === "checkbox") {
            feldwert = $('input:checkbox[name=' + feldname + ']:checked').val();
        } else if (feldtyp && feldtyp === "radio") {
            feldwert = $('input:radio[name=' + feldname + ']:checked').val();
        } else {
            // textarea, input, select
            feldwert = $("#" + feldname).val();
        }
        // ja/nein Felder zu boolean umbauen
        if (feldname === "PopHerkunftUnklar" || feldname === "TPopHerkunftUnklar" || feldname === "TPopMassnPlan" || feldname === "TPopKontrPlan") {
            if (feldwert) {
                feldwert = 1;
            } else {
                feldwert = "";
            }
        }
        if (feldname === "BeobBemerkungen" && localStorage.beob_status === "nicht_beurteilt") {
            // hier soll nicht gespeichert werden
            $("#BeobBemerkungen").val("");
            melde("Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich", "Aktion abgebrochen");
            return;
        }
        $.ajax({
            type: 'post',
            url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "_id"] + '/feld=' + feldname + '/wert=' + feldwert + '/user=' + sessionStorage.User
        }).done(function () {
            // Variable für Objekt nachführen
            // jber_uebersicht speichert kein window.formular, daher testen, ob es existiert
            if (window.apf[formular]) window.apf[formular][feldname] = feldwert;
            // Wenn ApArtId verändert wurde: Formular aktualisieren
            if (feldname === "ApArtId" && feldwert) {
                waehleAp(feldwert);
                return;
            }
            // Wenn in feldkontr Datum erfasst, auch Jahr speichern
            if (feldname === "TPopKontrDatum" && feldwert) {
                objekt = {};
                objekt.name = "TPopKontrJahr";
                objekt.formular = "tpopfeldkontr";
                speichern(objekt);
            }
            // dito bei tpopmassn
            if (feldname === "TPopMassnDatum" && feldwert) {
                objekt = {};
                objekt.name = "TPopMassnJahr";
                objekt.formular = "tpopmassn";
                speichern(objekt);
            }
            // wenn in TPopKontrZaehleinheit 1 bis 3 ein Leerwert eingeführt wurde
            // sollen auch die Felder TPopKontrMethode 1 bis 3 und TPopKontrAnz 1 bis 3 Leerwerte erhalten
            if (!feldwert) {
                if (feldname === "TPopKontrZaehleinheit1") {
                    // UI aktualisieren
                    if (window.apf.tpopfeldkontr.TPopKontrMethode1) {
                        $("#TPopKontrMethode1" + window.apf.tpopfeldkontr.TPopKontrMethode1).prop("checked", false);
                    }
                    $("#TPopKontrAnz1").val("");
                    // Datenbank aktualisieren
                    // Feld TPopKontrMethode1
                    objekt = {};
                    objekt.name = "TPopKontrMethode1";
                    objekt.formular = formular;
                    speichern(objekt);
                    // Feld TPopKontrAnz1
                    objekt = {};
                    objekt.name = "TPopKontrAnz1";
                    objekt.formular = formular;
                    speichern(objekt);
                }
                if (feldname === "TPopKontrZaehleinheit2") {
                    // UI aktualisieren
                    if (window.apf.tpopfeldkontr.TPopKontrMethode2) {
                        $("#TPopKontrMethode2" + window.apf.tpopfeldkontr.TPopKontrMethode2).prop("checked", false);
                    }
                    $("#TPopKontrAnz2").val("");
                    // Datenbank aktualisieren
                    // Feld TPopKontrMethode2
                    objekt = {};
                    objekt.name = "TPopKontrMethode2";
                    objekt.formular = formular;
                    speichern(objekt);
                    // Feld TPopKontrAnz2
                    objekt = {};
                    objekt.name = "TPopKontrAnz2";
                    objekt.formular = formular;
                    speichern(objekt);
                }
                if (feldname === "TPopKontrZaehleinheit3") {
                    // UI aktualisieren
                    if (window.apf.tpopfeldkontr.TPopKontrMethode3) {
                        $("#TPopKontrMethode3" + window.apf.tpopfeldkontr.TPopKontrMethode3).prop("checked", false);
                    }
                    $("#TPopKontrAnz3").val("");
                    // Datenbank aktualisieren
                    // Feld TPopKontrMethode3
                    objekt = {};
                    objekt.name = "TPopKontrMethode3";
                    objekt.formular = formular;
                    speichern(objekt);
                    // Feld TPopKontrAnz3
                    objekt = {};
                    objekt.name = "TPopKontrAnz3";
                    objekt.formular = formular;
                    speichern(objekt);
                }
            }
        }).fail(function () {
            melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
        });
        // nodes im Tree updaten, wenn deren Bezeichnung ändert
        switch(feldname) {
            case "PopNr":
            case "PopName":
                var popbeschriftung;
                if ($PopName.val() && $PopNr.val()) {
                    popbeschriftung = $PopNr.val() + ": " + $PopName.val();
                } else if ($PopName.val()) {
                    popbeschriftung = "(keine Nr): " + $PopName.val();
                } else if ($PopNr.val()) {
                    popbeschriftung = $PopNr.val() + ": (kein Name)";
                } else {
                    popbeschriftung = "(keine Nr, kein Name)";
                }
                $tree.jstree("rename_node", "[typ='ap_ordner_pop'] #" + localStorage.pop_id, popbeschriftung);
                break;
            case "PopBerJahr":
            case "PopBerEntwicklung":
                var popberbeschriftung,
                    popberentwicklungLabel = $("label[for='" + $('input[name="PopBerEntwicklung"]:checked').attr('id') + "']").text();
                if ($PopBerJahr.val() && popberentwicklungLabel) {
                    popberbeschriftung = $PopBerJahr.val() + ": " + popberentwicklungLabel;
                } else if ($PopBerJahr.val()) {
                    popberbeschriftung = $PopBerJahr.val() + ": (kein Status)";
                } else if (popberentwicklungLabel) {
                    popberbeschriftung = "(kein Jahr): " + popberentwicklungLabel;
                } else {
                    popberbeschriftung = "(kein Jahr): (kein Status)";
                }
                $tree.jstree("rename_node", "[typ='pop_ordner_popber'] #" + localStorage.popber_id, popberbeschriftung);
                break;
            case "PopMassnBerJahr":
            case "PopMassnBerErfolgsbeurteilung":
                var popmassnberbeschriftung,
                    popmassnberbeschriftungLabel = $("label[for='" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').attr('id') + "']").text();
                if ($PopMassnBerJahr.val() && popmassnberbeschriftungLabel) {
                    popmassnberbeschriftung = $PopMassnBerJahr.val() + ": " + popmassnberbeschriftungLabel;
                } else if ($PopMassnBerJahr.val()) {
                    popmassnberbeschriftung = $PopMassnBerJahr.val() + ": (nicht beurteilt)";
                } else if (popmassnberbeschriftungLabel) {
                    popmassnberbeschriftung = "(kein Jahr): " + popmassnberbeschriftungLabel;
                } else {
                    popmassnberbeschriftung = "(kein Jahr): (nicht beurteilt)";
                }
                $tree.jstree("rename_node", "[typ='pop_ordner_massnber'] #" + localStorage.popmassnber_id, popmassnberbeschriftung);
                break;
            case "TPopNr":
            case "TPopFlurname":
                var tpopbeschriftung;
                if ($TPopNr.val() && $TPopFlurname.val()) {
                    tpopbeschriftung = $TPopNr.val() + ": " + $TPopFlurname.val();
                } else if ($TPopFlurname.val()) {
                    tpopbeschriftung = "(keine Nr): " + $TPopFlurname.val();
                } else if ($TPopNr.val()) {
                    tpopbeschriftung = $TPopNr.val() + ": (kein Flurname)";
                } else {
                    tpopbeschriftung = "(keine Nr, kein Flurname)";
                }
                $tree.jstree("rename_node", "[typ='pop_ordner_tpop'] #" + localStorage.tpop_id, tpopbeschriftung);
                break;
            case "TPopKontrTyp":
            case "TPopKontrJahr":
                // wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
                var $TPopKontrJahr = $("#TPopKontrJahr").val(),
                    tpopkontrjahr = ($TPopKontrJahr ? $TPopKontrJahr : "(kein Jahr)"),
                    tpopfeldkontr_label = tpopkontrjahr + ': ' +  $("label[for='" + $('input[name="TPopKontrTyp"]:checked').attr('id') + "']").text();
                // Problem: Es ist nicht bekannt, ob eine Freiwilligenkontrolle umbennant wird oder eine Feldkontrolle
                // Lösung: Beide nodes umbenennen. Nur eine davon hat die richtige id
                $tree.jstree("rename_node", "[typ='tpop_ordner_freiwkontr'] #" + localStorage.tpopfeldkontr_id, tpopkontrjahr);
                $tree.jstree("rename_node", "[typ='tpop_ordner_feldkontr'] #" + localStorage.tpopfeldkontr_id, tpopfeldkontr_label);
                break;
            case "TPopBerJahr":
            case "TPopBerEntwicklung":
                // wenn kein Jahr/Entwicklung gewählt: "(kein Jahr/Entwicklung)"
                var tpopberjahr,
                    tpopberentwicklung,
                    tpopberentwicklungLabel = $("label[for='" + $('input[name="TPopBerEntwicklung"]:checked').attr('id') + "']").text();
                if ($TPopBerJahr.val()) {
                    tpopberjahr = $TPopBerJahr.val();
                } else {
                    tpopberjahr = "(kein Jahr)";
                }
                if (tpopberentwicklungLabel) {
                    tpopberentwicklung = tpopberentwicklungLabel;
                } else {
                    tpopberentwicklung = "(keine Beurteilung)";
                }
                $tree.jstree("rename_node", "[typ='tpop_ordner_tpopber'] #" + localStorage.tpopber_id, tpopberjahr + ": " + tpopberentwicklung);
                break;
            case "TPopMassnJahr":
            case "TPopMassnTyp":
                // wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
                var tpopmassnbezeichnung;
                if ($TPopMassnJahr.val() && $TPopMassnTypChecked.text()) {
                    tpopmassnbezeichnung = $TPopMassnJahr.val() + ": " + $TPopMassnTypChecked.text();
                } else if ($TPopMassnJahr.val()) {
                    tpopmassnbezeichnung = $TPopMassnJahr.val() + ": (kein Typ)";
                } else if ($TPopMassnTypChecked.text()) {
                    tpopmassnbezeichnung = "(kein Jahr): " + $TPopMassnTypChecked.text();
                } else {
                    tpopmassnbezeichnung = "(kein Jahr): (kein Typ)";
                }
                tpopmassnbezeichnung = window.apf.erstelleLabelFürMassnahme($TPopMassnJahr.val(), $TPopMassnTypChecked.text());
                $tree.jstree("rename_node", "[typ='tpop_ordner_massn'] #" + localStorage.tpopmassn_id, tpopmassnbezeichnung);
                break;
            case "TPopMassnBerJahr":
            case "TPopMassnBerErfolgsbeurteilung":
                // wenn kein Jahr/Beurteilung: "(kein Jahr/Beurteilung)"
                var tpopmassberbeschriftung,
                    tpopmassberbeschriftungLabel = $("label[for='" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').attr('id') + "']").text();
                if ($TPopMassnBerJahr.val() && tpopmassberbeschriftungLabel) {
                    tpopmassberbeschriftung = $TPopMassnBerJahr.val() + ": " + tpopmassberbeschriftungLabel;
                } else if ($TPopMassnBerJahr.val()) {
                    tpopmassberbeschriftung = $TPopMassnBerJahr.val() + ": (keine Beurteilung)";
                } else if (tpopmassberbeschriftungLabel) {
                    tpopmassberbeschriftung = "(kein Jahr): " + tpopmassberbeschriftungLabel;
                } else {
                    tpopmassberbeschriftung = "(kein Jahr): (keine Beurteilung)";
                }
                $tree.jstree("rename_node", "[typ='tpop_ordner_massnber'] #" + localStorage.tpopmassnber_id, tpopmassberbeschriftung);
                break;
            case "ZielBezeichnung":
                var zielbeschriftung = (feldwert ? feldwert : "(Ziel nicht beschrieben)");
                $tree.jstree("rename_node", "[typ='apzieljahr'] #" + localStorage.apziel_id, zielbeschriftung);
                break;
            case "ZielBerJahr":
            case "ZielBerErreichung":
                var zielberbeschriftung;
                if ($ZielBerJahr.val() && $ZielBerErreichung.val()) {
                    zielberbeschriftung = $ZielBerJahr.val() + ": " + $ZielBerErreichung.val();
                } else if ($ZielBerJahr.val()) {
                    zielberbeschriftung = $ZielBerJahr.val() + ": (keine Beurteilung)";
                } else if ($ZielBerErreichung.val()) {
                    zielberbeschriftung = "(kein Jahr): " + $ZielBerErreichung.val();
                } else {
                    zielberbeschriftung = "(kein Jahr): (keine Beurteilung)";
                }
                $tree.jstree("rename_node", "[typ='zielber_ordner'] #" + localStorage.zielber_id, zielberbeschriftung);
                break;
            case "ErfkritErreichungsgrad":
            case "ErfkritTxt":
                var erfkritbeschriftung,
                    erfkritbeschriftungLabel = $("label[for='" + $('input[name="ErfkritErreichungsgrad"]:checked').attr('id') + "']").text();
                if (erfkritbeschriftungLabel && $("#ErfkritTxt").val()) {
                    erfkritbeschriftung = erfkritbeschriftungLabel + ": " + $("#ErfkritTxt").val();
                } else if (erfkritbeschriftungLabel) {
                    erfkritbeschriftung = erfkritbeschriftungLabel + ": (kein Kriterium)";
                } else if ($("#ErfkritTxt").val()) {
                    erfkritbeschriftung = "(keine Beurteilung): " + $("#ErfkritTxt").val();
                } else {
                    erfkritbeschriftung = "(keine Beurteilung): (kein Kriterium)";
                }
                $tree.jstree("rename_node", "[typ='ap_ordner_erfkrit'] #" + localStorage.erfkrit_id, erfkritbeschriftung);
                break;
            case "JBerJahr":
                var jberbeschriftung = (feldwert ? feldwert : "(kein Jahr)");
                $tree.jstree("rename_node", "[typ='ap_ordner_jber'] #" + localStorage.jber_id, jberbeschriftung);
                break;
            case "BerTitel":
            case "BerJahr":
                var berbeschriftung;
                if ($BerJahr.val() && $BerTitel.val()) {
                    berbeschriftung = $BerJahr.val() + ": " + $BerTitel.val();
                } else if ($BerJahr.val()) {
                    berbeschriftung = $BerJahr.val() + ": (kein Titel)";
                } else if ($BerTitel.val()) {
                    berbeschriftung = "(kein Jahr): " + $BerTitel.val();
                } else {
                    berbeschriftung = "(kein Jahr): (kein Titel)";
                }
                $tree.jstree("rename_node", "[typ='ap_ordner_ber'] #" + localStorage.ber_id, berbeschriftung);
                break;
            case "AaSisfNr":
                var aabeschriftung = (feldwert ? $("#AaSisfNrText").val() : "(kein Artname)");
                $tree.jstree("rename_node", "[typ='ap_ordner_assozarten'] #" + localStorage.assozarten_id, aabeschriftung);
                break;
        }
    }
};

module.exports = speichern;