/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    dateFormat      = require('dateformat'),
    _               = require('underscore'),
    limiter         = require('../lib/limiter'),
    initiiereApp    = require('./initiiereApp'),
    initiiereAp     = require('./initiiereAp'),
    initiierePop    = require('./initiierePop'),
    initiiereTPop   = require('./initiiereTPop'),
    getAdressenHtml = require('./getAdressenHtml'),
    getMassntypHtml = require('./getMassntypHtml'),
    zeigeFormular   = require('./zeigeFormular'),
    melde           = require('./melde');

var returnFunction = function (apId, popId, tpopId, massnId) {
    // prüfen, ob voraussetzungen gegeben sind
    if (!apId && !localStorage.ap_id) {
        // Anwendung neu initiieren
        initiiereApp();
        return;
    }
    if (!popId && !localStorage.pop_id && !window.apf.pop && (window.apf.pop && !window.apf.pop.PopId)) {
        // es fehlen benötigte Daten > zwei Ebenen höher
        initiiereAp(apId);
        return;
    }
    if (!tpopId && !localStorage.tpop_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop(apId, popId);
        return;
    }
    if (!massnId && !localStorage.tpopmassn_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiiereTPop(apId, popId, tpopId);
        return;
    }

    // apId setzen
    if (!localStorage.ap_id) localStorage.ap_id = apId;
    if (!apId) apId = localStorage.ap_id;
    // popId setzen
    if (!localStorage.pop_id) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            localStorage.pop_id = popId;
        } else {
            localStorage.pop_id = window.apf.pop.PopId;
        }
    }
    if (!popId) {
        if (!window.apf.pop || !window.apf.pop.PopId) {
            popId = localStorage.pop_id;
        } else {
            popId = window.apf.pop.PopId;
        }
    }
    // tpopId setzen
    if (!localStorage.tpop_id) localStorage.tpop_id = tpopId;
    if (!tpopId) tpopId = localStorage.tpop_id;
    // massnId setzen
    if (!localStorage.tpopmassn_id) localStorage.tpopmassn_id = massnId;
    if (!massnId) massnId = localStorage.tpopmassn_id;

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopmassn");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + massnId
    }).done(function (data) {
        var tPopMassnAnsiedWirtspflTxt;
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpopmassn bereitstellen
            window.apf.tpopmassn = data;

            // Felder mit Daten beliefern
            // für select TPopMassnTyp Daten holen - oder vorhandene nutzen
            getMassntypHtml(function (html) {
                $("#TPopMassnTyp")
                    .html(html)
                    .val(window.apf.tpopmassn.TPopMassnTyp);
            });
            $("#TPopMassnTxt")
                .val(data.TPopMassnTxt)
                .limiter(255, $("#TPopMassnTxt_limit"));
            $("#TPopMassnJahr").val(data.TPopMassnJahr);
            if (data.TPopMassnDatum) {
                $("#TPopMassnDatum").val(dateFormat(data.TPopMassnDatum, 'yyyy.mm.dd'));
            }
            // Adressen holen, um TPopMassnBearb zu füllen
            getAdressenHtml(function (html) {
                $("#TPopMassnBearb")
                    .html(html)
                    .val(window.apf.tpopmassn.TPopMassnBearb);
            });
            $("#TPopMassnBemTxt").val(data.TPopMassnBemTxt);
            if (data.TPopMassnPlan === 1) {
                $("#TPopMassnPlan").prop("checked", true);
            } else {
                $("#TPopMassnPlan").prop("checked", false);
            }
            $("#TPopMassnPlanBez")
                .val(data.TPopMassnPlanBez)
                .limiter(255, $("#TPopMassnPlanBez_limit"));
            $("#TPopMassnFlaeche").val(data.TPopMassnFlaeche);
            $("#TPopMassnAnsiedForm")
                .val(data.TPopMassnAnsiedForm)
                .limiter(255, $("#TPopMassnAnsiedForm_limit"));
            $("#TPopMassnAnsiedPflanzanordnung")
                .val(data.TPopMassnAnsiedPflanzanordnung)
                .limiter(255, $("#TPopMassnAnsiedPflanzanordnung_limit"));
            $("#TPopMassnMarkierung")
                .val(data.TPopMassnMarkierung)
                .limiter(255, $("#TPopMassnMarkierung_limit"));
            $("#TPopMassnAnsiedAnzTriebe").val(data.TPopMassnAnsiedAnzTriebe);
            $("#TPopMassnAnsiedAnzPfl").val(data.TPopMassnAnsiedAnzPfl);
            $("#TPopMassnAnzPflanzstellen").val(data.TPopMassnAnzPflanzstellen);
            $("#TPopMassnAnsiedWirtspfl").val(data.TPopMassnAnsiedWirtspfl);
            $("#TPopMassnAnsiedHerkunftPop")
                .val(data.TPopMassnAnsiedHerkunftPop)
                .limiter(255, $("#TPopMassnAnsiedHerkunftPop_limit"));
            $("#TPopMassnAnsiedDatSamm")
                .val(data.TPopMassnAnsiedDatSamm)
                .limiter(50, $("#TPopMassnAnsiedDatSamm_limit"));
            $("#TPopMassnGuid").val(data.TPopMassnGuid);

            // Formulare blenden
            zeigeFormular("tpopmassn");
            history.pushState(null, null, "index.html?ap=" + apId + "&pop=" + popId + "&tpop=" + tpopId + "&tpopmassn=" + massnId);

            // bei neuen Datensätzen Fokus steuern
            $('#TPopMassnJahr').focus();
        }
    }).fail(function () {
        melde('Fehler: keine Daten für die Massnahme erhalten');
    });
};

module.exports = returnFunction;