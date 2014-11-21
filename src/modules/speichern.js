// wird von allen Formularen benutzt
// speichert den Wert eines Feldes in einem Formular
// übernimmt das Objekt, in dem geändert wurde
// kann nicht modularisiert werden, weil jstree verwendet wird und dieses nicht mit node kompatibel ist

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    _                            = require('underscore'),
    configuration                = require('./configuration'),
    waehleAp                     = require('./waehleAp'),
    melde                        = require('./melde'),
    pruefeSchreibvoraussetzungen = require('./pruefeSchreibvoraussetzungen'),
    erstelleLabelFuerMassnahme   = require('./erstelleLabelFuerMassnahme');

var speichern = function (that) {
    var feldtyp,
        formular,
        tabelleInDb,
        tabelleIdFeld,
        feldname,
        feldwert,
        objekt,
        table,
        popbeschriftung,
        popberbeschriftung,
        popberentwicklungLabel,
        popmassnberbeschriftung,
        popmassnberbeschriftungLabel,
        tpopbeschriftung,
        tpopkontrjahr,
        $TPopKontrJahr,
        tpopfeldkontr_label,
        tpopberjahr,
        tpopberentwicklung,
        tpopberentwicklungLabel,
        $PopName,
        $PopNr,
        $PopBerJahr,
        $PopMassnBerJahr,
        $TPopNr,
        $TPopFlurname,
        $TPopBerJahr,
        tpopmassnbezeichnung,
        $TPopMassnJahr,
        $TPopMassnTypChecked,
        tpopmassberbeschriftung,
        tpopmassberbeschriftungLabel,
        $TPopMassnBerJahr,
        zielbeschriftung,
        $ZielBerJahr,
        zielberbeschriftung,
        $ZielBerErreichung,
        erfkritbeschriftung,
        erfkritbeschriftungLabel,
        jberbeschriftung,
        berbeschriftung,
        $BerJahr,
        $BerTitel,
        aabeschriftung,
        $tree = $("#tree"),
        jahr;

    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }

    formular = that.formular || $(that).attr("formular");
    // infos über die betroffene Tabelle holen
    table = _.findWhere(configuration.tables, {form: formular});
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
    } else if (feldtyp && feldtyp === "date") {
        // testen, ob der Benutzer das Datum im verlangten Format erfasst hat
        feldwert = $("#" + feldname).val();
        if (feldwert) {
            if (/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/.test(feldwert)) {
                // ja: Reihenfolge kehren - mysql will das so
                //var dataArray = feldwert.split('.');
                feldwert = feldwert.split('.').reverse().join('.');
            } else if (/[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}/.test(feldwert)) {
                // so übergibt der Kalender von Chrome
                feldwert = feldwert.split('-').join('.');
            } else {
                $("#" + feldname).focus();
                return;
            }
        }
        // Hinweis: Leerwerte werden weiter gegeben, damit ein Datum entfernt werden kann
    } else {
        // textarea, input, select
        feldwert = $("#" + feldname).val();
    }
    // ja/nein Felder zu boolean umbauen
    if (feldname === "PopHerkunftUnklar" || feldname === "TPopHerkunftUnklar" || feldname === "TPopMassnPlan" || feldname === "TPopKontrPlan") {
        feldwert = (feldwert ? 1 : '');
    }
    if (feldname === "BeobBemerkungen" && localStorage.beobStatus === "nicht_beurteilt") {
        // hier soll nicht gespeichert werden
        $("#BeobBemerkungen").val("");
        melde("Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich", "Aktion abgebrochen");
        return;
    }
    $.ajax({
        type: 'post',
        url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=' + feldname + '/wert=' + feldwert + '/user=' + sessionStorage.user
    }).done(function () {
        // Variable für Objekt nachführen
        // jberUebersicht speichert kein window.formular, daher testen, ob es existiert
        if (window.apf[formular]) {
            window.apf[formular][feldname] = feldwert;
        }
        // Wenn ApArtId verändert wurde: Formular aktualisieren
        if (feldname === "ApArtId" && feldwert) {
            waehleAp(feldwert);
            return;
        }
        // Wenn in feldkontr Datum erfasst, auch Jahr speichern
        if (feldname === "TPopKontrDatum" && feldwert) {
            jahr = feldwert.split('.')[0];
            $('#TPopKontrJahr').val(jahr);
            objekt          = {};
            objekt.name     = "TPopKontrJahr";
            objekt.formular = "tpopfeldkontr";
            speichern(objekt);
        }
        // dito bei tpopmassn
        if (feldname === "TPopMassnDatum" && feldwert) {
            jahr = feldwert.split('.')[0];
            $('#TPopMassnJahr').val(jahr);
            objekt          = {};
            objekt.name     = "TPopMassnJahr";
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
                objekt          = {};
                objekt.name     = "TPopKontrMethode1";
                objekt.formular = formular;
                speichern(objekt);
                // Feld TPopKontrAnz1
                objekt          = {};
                objekt.name     = "TPopKontrAnz1";
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
                objekt          = {};
                objekt.name     = "TPopKontrMethode2";
                objekt.formular = formular;
                speichern(objekt);
                // Feld TPopKontrAnz2
                objekt          = {};
                objekt.name     = "TPopKontrAnz2";
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
                objekt          = {};
                objekt.name     = "TPopKontrMethode3";
                objekt.formular = formular;
                speichern(objekt);
                // Feld TPopKontrAnz3
                objekt          = {};
                objekt.name     = "TPopKontrAnz3";
                objekt.formular = formular;
                speichern(objekt);
            }
        }
    }).fail(function () {
        melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
    });
    // nodes im Tree updaten, wenn deren Bezeichnung ändert
    switch (feldname) {
    case "PopNr":
    case "PopName":
        $PopNr   = $("#PopNr");
        $PopName = $("#PopName");
        if ($PopName.val() && $PopNr.val()) {
            popbeschriftung = $PopNr.val() + ": " + $PopName.val();
        } else if ($PopName.val()) {
            popbeschriftung = "(keine Nr): " + $PopName.val();
        } else if ($PopNr.val()) {
            popbeschriftung = $PopNr.val() + ": (kein Name)";
        } else {
            popbeschriftung = "(keine Nr, kein Name)";
        }
        $tree.jstree("rename_node", "[typ='apOrdnerPop'] #" + localStorage.popId, popbeschriftung);
        break;
    case "PopBerJahr":
    case "PopBerEntwicklung":
        $PopBerJahr = $("#PopBerJahr");
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
        $tree.jstree("rename_node", "[typ='popOrdnerPopber'] #" + localStorage.popberId, popberbeschriftung);
        break;
    case "PopMassnBerJahr":
    case "PopMassnBerErfolgsbeurteilung":
        $PopMassnBerJahr = $("#PopMassnBerJahr");
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
        $tree.jstree("rename_node", "[typ='popOrdnerMassnber'] #" + localStorage.popmassnberId, popmassnberbeschriftung);
        break;
    case "TPopNr":
    case "TPopFlurname":
        $TPopNr = $("#TPopNr");
        $TPopFlurname = $("#TPopFlurname");
        if ($TPopNr.val() && $TPopFlurname.val()) {
            tpopbeschriftung = $TPopNr.val() + ": " + $TPopFlurname.val();
        } else if ($TPopFlurname.val()) {
            tpopbeschriftung = "(keine Nr): " + $TPopFlurname.val();
        } else if ($TPopNr.val()) {
            tpopbeschriftung = $TPopNr.val() + ": (kein Flurname)";
        } else {
            tpopbeschriftung = "(keine Nr, kein Flurname)";
        }
        $tree.jstree("rename_node", "[typ='popOrdnerTpop'] #" + localStorage.tpopId, tpopbeschriftung);
        break;
    case "TPopKontrTyp":
    case "TPopKontrJahr":
        // wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
        $TPopKontrJahr      = $("#TPopKontrJahr").val();
        tpopkontrjahr       = $TPopKontrJahr || "(kein Jahr)";
        tpopfeldkontr_label = tpopkontrjahr + ': ' +  $("label[for='" + $('input[name="TPopKontrTyp"]:checked').attr('id') + "']").text();
        // Problem: Es ist nicht bekannt, ob eine Freiwilligenkontrolle umbennant wird oder eine Feldkontrolle
        // Lösung: Beide nodes umbenennen. Nur eine davon hat die richtige id
        $tree.jstree("rename_node", "[typ='tpopOrdnerFreiwkontr'] #" + localStorage.tpopfeldkontrId, tpopkontrjahr);
        $tree.jstree("rename_node", "[typ='tpopOrdnerFeldkontr'] #" + localStorage.tpopfeldkontrId, tpopfeldkontr_label);
        break;
    case "TPopBerJahr":
    case "TPopBerEntwicklung":
        $TPopBerJahr = $("#TPopBerJahr");
        // wenn kein Jahr/Entwicklung gewählt: "(kein Jahr/Entwicklung)"
        tpopberentwicklungLabel = $("label[for='" + $('input[name="TPopBerEntwicklung"]:checked').attr('id') + "']").text();
        tpopberjahr        = $TPopBerJahr.val()      || "(kein Jahr)";
        tpopberentwicklung = tpopberentwicklungLabel || "(keine Beurteilung)";
        $tree.jstree("rename_node", "[typ='tpopOrdnerTpopber'] #" + localStorage.tpopberId, tpopberjahr + ": " + tpopberentwicklung);
        break;
    case "TPopMassnJahr":
    case "TPopMassnTyp":
        // wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
        $TPopMassnJahr = $("#TPopMassnJahr");
        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked");
        if ($TPopMassnJahr.val() && $TPopMassnTypChecked.text()) {
            tpopmassnbezeichnung = $TPopMassnJahr.val() + ": " + $TPopMassnTypChecked.text();
        } else if ($TPopMassnJahr.val()) {
            tpopmassnbezeichnung = $TPopMassnJahr.val() + ": (kein Typ)";
        } else if ($TPopMassnTypChecked.text()) {
            tpopmassnbezeichnung = "(kein Jahr): " + $TPopMassnTypChecked.text();
        } else {
            tpopmassnbezeichnung = "(kein Jahr): (kein Typ)";
        }
        tpopmassnbezeichnung = erstelleLabelFuerMassnahme($TPopMassnJahr.val(), $TPopMassnTypChecked.text());
        $tree.jstree("rename_node", "[typ='tpopOrdnerMassn'] #" + localStorage.tpopmassnId, tpopmassnbezeichnung);
        break;
    case "TPopMassnBerJahr":
    case "TPopMassnBerErfolgsbeurteilung":
        // wenn kein Jahr/Beurteilung: "(kein Jahr/Beurteilung)"
        $TPopMassnBerJahr = $("#TPopMassnBerJahr");
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
        $tree.jstree("rename_node", "[typ='tpopOrdnerMassnber'] #" + localStorage.tpopmassnberId, tpopmassberbeschriftung);
        break;
    case "ZielBezeichnung":
        zielbeschriftung = feldwert || "(Ziel nicht beschrieben)";
        $tree.jstree("rename_node", "[typ='apzieljahr'] #" + localStorage.apzielId, zielbeschriftung);
        break;
    case "ZielBerJahr":
    case "ZielBerErreichung":
        $ZielBerJahr = $("#ZielBerJahr");
        $ZielBerErreichung = $("#ZielBerErreichung");
        if ($ZielBerJahr.val() && $ZielBerErreichung.val()) {
            zielberbeschriftung = $ZielBerJahr.val() + ": " + $ZielBerErreichung.val();
        } else if ($ZielBerJahr.val()) {
            zielberbeschriftung = $ZielBerJahr.val() + ": (keine Beurteilung)";
        } else if ($ZielBerErreichung.val()) {
            zielberbeschriftung = "(kein Jahr): " + $ZielBerErreichung.val();
        } else {
            zielberbeschriftung = "(kein Jahr): (keine Beurteilung)";
        }
        $tree.jstree("rename_node", "[typ='zielberOrdner'] #" + localStorage.zielberId, zielberbeschriftung);
        break;
    case "ErfkritErreichungsgrad":
    case "ErfkritTxt":
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
        $tree.jstree("rename_node", "[typ='apOrdnerErfkrit'] #" + localStorage.erfkritId, erfkritbeschriftung);
        break;
    case "JBerJahr":
        jberbeschriftung = feldwert || "(kein Jahr)";
        $tree.jstree("rename_node", "[typ='apOrdnerJber'] #" + localStorage.jberId, jberbeschriftung);
        break;
    case "BerTitel":
    case "BerJahr":
        $BerJahr = $("#BerJahr");
        $BerTitel = $("#BerTitel");
        if ($BerJahr.val() && $BerTitel.val()) {
            berbeschriftung = $BerJahr.val() + ": " + $BerTitel.val();
        } else if ($BerJahr.val()) {
            berbeschriftung = $BerJahr.val() + ": (kein Titel)";
        } else if ($BerTitel.val()) {
            berbeschriftung = "(kein Jahr): " + $BerTitel.val();
        } else {
            berbeschriftung = "(kein Jahr): (kein Titel)";
        }
        $tree.jstree("rename_node", "[typ='apOrdnerBer'] #" + localStorage.berId, berbeschriftung);
        break;
    case "AaSisfNr":
        aabeschriftung = $("#AaSisfNrText").val() || "(kein Artname)";
        $tree.jstree("rename_node", "[typ='apOrdnerAssozarten'] #" + localStorage.assozartenId, aabeschriftung);
        break;
    }
};

module.exports = speichern;