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

module.exports = function (that) {
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
        tpopfeldkontrLabel,
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

    formular = $(that).attr("formular") || $(that).data('formular');

    // infos über die betroffene Tabelle holen
    table         = _.findWhere(configuration.tables, {form: formular});
    tabelleInDb   = table.tabelleInDb;
    tabelleIdFeld = table.tabelleIdFeld;
    feldname      = that.name;
    feldtyp       = $(that).attr("type") || null;

    // Feldwert ermitteln
    // wenn in speichern.js selbst ein nächster Speichervorgang ausgelöst wird, wird ein Objekt mitgegeben
    // daher nicht nur $(that), sondern auch that prüfen
    feldwert = $(that).val();
    if (feldtyp && feldtyp === "checkbox" && !$(that).is(':checked')) {
        // die geklickte Box hat den ermittelten value
        // aber sie ist jetzt nicht gechecked! > Wert = ''
        feldwert = '';
    }

    // kontrollieren, ob der Benutzer das Datum im verlangten Format erfasst hat
    if (feldwert && feldtyp && feldtyp === "date") {
        if (/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/.test(feldwert)) {
            // ja: Reihenfolge kehren - mysql will das so
            //var dataArray = feldwert.split('.');
            feldwert = feldwert.split('.').reverse().join('.');
        } else if (/[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}/.test(feldwert)) {
            // so übergibt der Kalender von Chrome
            feldwert = feldwert.split('-').join('.');
        } else {
            $(that).focus();
            return;
        }
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
        url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=' + feldname + '/wert=' + encodeURIComponent(feldwert) + '/user=' + sessionStorage.user
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
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrJahr/wert=' + encodeURIComponent(jahr) + '/user=' + sessionStorage.user
            });
        }
        // dito bei tpopmassn
        if (feldname === "TPopMassnDatum" && feldwert) {
            jahr = feldwert.split('.')[0];
            $('#TPopMassnJahr').val(jahr);
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopMassnJahr/wert=' + encodeURIComponent(jahr) + '/user=' + sessionStorage.user
            });
        }
        // wenn in Kontr Jahr geändert wurde, Datum löschen
        if (feldname === 'TPopKontrJahr') {
            $('#TPopKontrDatum').val('');
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrDatum/wert=/user=' + sessionStorage.user
            });
        }
        // dito in tpopmassn
        if (feldname === 'TPopMassnJahr') {
            $('#TPopMassnDatum').val('');
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopMassnDatum/wert=/user=' + sessionStorage.user
            });
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
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrMethode1/wert=/user=' + sessionStorage.user
                });
                // Feld TPopKontrAnz1
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrAnz1/wert=/user=' + sessionStorage.user
                });
            }
            if (feldname === "TPopKontrZaehleinheit2") {
                // UI aktualisieren
                if (window.apf.tpopfeldkontr.TPopKontrMethode2) {
                    $("#TPopKontrMethode2" + window.apf.tpopfeldkontr.TPopKontrMethode2).prop("checked", false);
                }
                $("#TPopKontrAnz2").val("");
                // Datenbank aktualisieren
                // Feld TPopKontrMethode2
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrMethode2/wert=/user=' + sessionStorage.user
                });
                // Feld TPopKontrAnz2
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrAnz2/wert=/user=' + sessionStorage.user
                });
            }
            if (feldname === "TPopKontrZaehleinheit3") {
                // UI aktualisieren
                if (window.apf.tpopfeldkontr.TPopKontrMethode3) {
                    $("#TPopKontrMethode3" + window.apf.tpopfeldkontr.TPopKontrMethode3).prop("checked", false);
                }
                $("#TPopKontrAnz3").val("");
                // Datenbank aktualisieren
                // Feld TPopKontrMethode3
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrMethode3/wert=/user=' + sessionStorage.user
                });
                // Feld TPopKontrAnz3
                $.ajax({
                    type: 'post',
                    url: 'api/v1/update/apflora/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "Id"] + '/feld=TPopKontrAnz3/wert=/user=' + sessionStorage.user
                });
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
        tpopfeldkontrLabel = tpopkontrjahr + ': ' +  $("label[for='" + $('input[name="TPopKontrTyp"]:checked').attr('id') + "']").text();
        // Problem: Es ist nicht bekannt, ob eine Freiwilligenkontrolle umbennant wird oder eine Feldkontrolle
        // Lösung: Beide nodes umbenennen. Nur eine davon hat die richtige id
        $tree.jstree("rename_node", "[typ='tpopOrdnerFreiwkontr'] #" + localStorage.tpopfeldkontrId, tpopkontrjahr);
        $tree.jstree("rename_node", "[typ='tpopOrdnerFeldkontr'] #" + localStorage.tpopfeldkontrId, tpopfeldkontrLabel);
        break;
    case "TPopKontrDatum":
        jahr               = feldwert ? feldwert.split('.')[0] : "(kein Jahr)";
        tpopfeldkontrLabel = jahr + ': ' +  $("label[for='" + $('input[name="TPopKontrTyp"]:checked').attr('id') + "']").text();
        // Problem: Es ist nicht bekannt, ob eine Freiwilligenkontrolle umbennant wird oder eine Feldkontrolle
        // Lösung: Beide nodes umbenennen. Nur eine davon hat die richtige id
        $tree.jstree("rename_node", "[typ='tpopOrdnerFreiwkontr'] #" + localStorage.tpopfeldkontrId, jahr);
        $tree.jstree("rename_node", "[typ='tpopOrdnerFeldkontr'] #" + localStorage.tpopfeldkontrId, tpopfeldkontrLabel);
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
        tpopmassnbezeichnung = erstelleLabelFuerMassnahme($TPopMassnJahr.val(), $TPopMassnTypChecked.text());
        $tree.jstree("rename_node", "[typ='tpopOrdnerMassn'] #" + localStorage.tpopmassnId, tpopmassnbezeichnung);
        break;
    case "TPopMassnDatum":
        jahr = feldwert ? feldwert.split('.')[0] : null;
        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked");
        tpopmassnbezeichnung = erstelleLabelFuerMassnahme(jahr, $TPopMassnTypChecked.text());
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