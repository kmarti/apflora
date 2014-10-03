'use strict';

var $               = require('jquery'),
    dateFormat      = require('dateformat'),
    _               = require('underscore'),
    limiter         = require('../lib/limiter'),
    initiierePop    = require('./initiierePop'),
    getAdressenHtml = require('./getAdressenHtml');

var returnFunction = function() {

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    limiter($);

    if (!localStorage.tpopmassn_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }

    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopmassn");

    // Daten für die pop aus der DB holen
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + localStorage.tpopmassn_id,
        dataType: 'json'
    }).done(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];

            // tpopmassn bereitstellen
            window.apf.tpopmassn = data;

            // Felder mit Daten beliefern
            // für select TPopMassnTyp Daten holen - oder vorhandene nutzen
            if (!window.apf.tpopmassntyp_html) {
                $.ajax({
                    type:     'get',
                    url:      'api/v1/tpopMassnTypen',
                    dataType: 'json'
                }).done(function(data2) {
                    if (data2 && data2.length > 0) {
                        // Feld mit Daten beliefern
                        var html;
                        html = "<option></option>";
                        _.each(data2, function(tpopmassn_typ) {
                            html += "<option value=\"" + tpopmassn_typ.id + "\">" + tpopmassn_typ.MassnTypTxt + "</option>";
                        });
                        window.apf.tpopmassntyp_html = html;
                        $("#TPopMassnTyp")
                            .html(html)
                            .val(window.apf.tpopmassn.TPopMassnTyp);
                    }
                });
            } else {
                $("#TPopMassnTyp")
                    .html(window.apf.tpopmassntyp_html)
                    .val(window.apf.tpopmassn.TPopMassnTyp);
            }
            $("#TPopMassnTxt")
                .val(data.TPopMassnTxt)
                .limiter(255, $("#TPopMassnTxt_limit"));
            $("#TPopMassnJahr").val(data.TPopMassnJahr);
            if (data.TPopMassnDatum) {
                $("#TPopMassnDatum").val(dateFormat(data.TPopMassnDatum, 'yyyy.mm.dd'));
            }
            // Adressen holen, um TPopMassnBearb zu füllen
            getAdressenHtml(function(html) {
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
            // für TPopMassnAnsiedWirtspfl wurde die Artliste schon bereitgestellt
            // wenn die Anwendung direkt auf einer TPopMassn geöffnet wird, ist die Liste noch nicht bereit
            // darum hier nochmals holen
            $.when(window.apf.erstelle_artlisten())
                .then(function() {
                    $("#TPopMassnAnsiedWirtspfl").val(data.TPopMassnAnsiedWirtspfl);
                    $("#TPopMassnAnsiedHerkunftPop")
                        .val(data.TPopMassnAnsiedHerkunftPop)
                        .limiter(255, $("#TPopMassnAnsiedHerkunftPop_limit"));
                    $("#TPopMassnAnsiedDatSamm")
                        .val(data.TPopMassnAnsiedDatSamm)
                        .limiter(50, $("#TPopMassnAnsiedDatSamm_limit"));
                    $("#TPopMassnGuid").val(data.TPopMassnGuid);

                    // Formulare blenden
                    window.apf.zeigeFormular("tpopmassn");
                    history.replaceState({tpopmassn: "tpopmassn"}, "tpopmassn", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopmassn=" + localStorage.tpopmassn_id);

                    // bei neuen Datensätzen Fokus steuern
                    $('#TPopMassnJahr').focus();
                });
        }
    });
};

module.exports = returnFunction;