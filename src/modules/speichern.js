// wird von allen Formularen benutzt
// speichert den Wert eines Feldes in einem Formular
// übernimmt das Objekt, in dem geändert wurde
// kann nicht modularisiert werden, weil jstree verwendet wird und dieses nicht mit node kompatibel ist

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                            = require('jquery'),
    _                            = require('underscore'),
    configuration                = require('./configuration'),
    melde                        = require('./melde'),
    pruefeSchreibvoraussetzungen = require('./pruefeSchreibvoraussetzungen'),
    speichern2                   = require('./speichern2');

module.exports = function (that) {
    var feldtyp,
        formular,
        tabelleInDb,
        tabelleIdFeld,
        tabelleId,
        feldname,
        feldwert,
        table;

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

    tabelleId = localStorage[formular + "Id"];

    if (formular === 'tpopkontrzaehl') {
        tabelleId = $(that).parent().parent().parent().find('[name="TPopKontrZaehlId"]').val();
        console.log('tpopkontrzaehl tabelleId: ', tabelleId);
        // TODO: Wenn keine tabelleId, neuen Datensatz anfügen
        if (!tabelleId) {
            $.ajax({
                type: 'post',
                url: 'api/v1/insert/apflora/tabelle=tblTPopKontrZaehl/feld=TPopKontrId/wert=' + localStorage.tpopfeldkontrId + '/user=' + sessionStorage.user
            }).done(function (TPopKontrZaehlId) {
                // die Felder dieser Zählung mit der neuen id aktualisieren
                console.log('TPopKontrZaehlId: ', TPopKontrZaehlId);
                tabelleId = TPopKontrZaehlId;
                speichern2(that, formular, tabelleInDb, tabelleIdFeld, tabelleId, feldname, feldwert);
            });
            return;
        }
    }

    speichern2(that, formular, tabelleInDb, tabelleIdFeld, tabelleId, feldname, feldwert);
};