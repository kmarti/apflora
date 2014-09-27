'use strict';

var $ = require('jquery'),
    _ = require('underscore'),
    //limiter = require('../lib/limiter'),
    initiierePop = require('./initiierePop');

require('jquery-ui');

var initiiereTPopFeldkontr = function() {

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    // Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
    (function($) {
        $.fn.extend( {
            limiter: function(limit, elem) {
                $(this).on("keyup focus", function() {
                    setCount(this, elem);
                });
                function setCount(src, elem) {
                    var chars = src.value.length;
                    if (chars > limit) {
                        src.value = src.value.substr(0, limit);
                        chars = limit;
                    }
                    elem.html( limit - chars );
                }
                setCount($(this)[0], elem);
            }
        });
    })(jQuery);

    // wird gemeinsam für Feld- und Freiwilligenkontrollen verwendet
    // Feldkontrollen: Felder der Freiwilligenkontrollen ausblenden
    // Freiwilligenkontrollen: Felder der Feldkontrollen ausblenen plus Register Biotop
    if (!localStorage.tpopfeldkontr_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        initiierePop();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("tpopfeldkontr");
    // alle Felder ausblenden. Später werden die benötigten eingeblendet
    $('.feld_tpopfeldkontr').each(function() {
        $(this).hide();
    });
    // Daten für die tpopfeldkontr aus der DB holen
    var getTpopfeldkontr = $.ajax({
            type: 'get',
            url: 'php/tpopfeldkontr.php',
            dataType: 'json',
            data: {
                "id": localStorage.tpopfeldkontr_id
            }
        }),
        $TPopKontrJahr = $("#TPopKontrJahr"),
        $TPopKontrJungPflJN_ja = $("#TPopKontrJungPflJN_ja"),
        $TPopKontrJungPflJN_nein = $("#TPopKontrJungPflJN_nein"),
        $TPopKontrJungPflJN_leer = $("#TPopKontrJungPflJN_leer");
    getTpopfeldkontr.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // tpopfeldkontr bereitstellen
            window.apf.tpopfeldkontr = data;
            // gemeinsame Felder
            // mit Daten beliefern
            $TPopKontrJahr.val(data.TPopKontrJahr);
            if (data.TPopKontrDatum !== "01.01.1970") {
                // php macht aus einem Nullwert im Datum den 1.1.1970!!!
                $("#TPopKontrDatum").val(data.TPopKontrDatum);
            } else {
                $("#TPopKontrDatum").val("");
            }
            $("#TPopKontrMethode1" + data.TPopKontrMethode1).prop("checked", true);
            $("#TPopKontrAnz1").val(data.TPopKontrAnz1);
            $("#TPopKontrMethode2" + data.TPopKontrMethode2).prop("checked", true);
            $("#TPopKontrAnz2").val(data.TPopKontrAnz2);
            $("#TPopKontrMethode3" + data.TPopKontrMethode3).prop("checked", true);
            $("#TPopKontrAnz3").val(data.TPopKontrAnz3);
            $("#TPopKontrTxt").val(data.TPopKontrTxt);
            $("#TPopKontrGuid").val(data.TPopKontrGuid);
            // TPopKontrBearb: Daten holen - oder vorhandene nutzen
            if (!window.apf.adressen_html) {
                var getAdressen = $.ajax({
                    type: 'get',
                    url: 'api/v1/adressen',
                    dataType: 'json'
                });
                getAdressen.always(function(data2) {
                    if (data2) {
                        // Feld mit Daten beliefern
                        var html;
                        html = "<option></option>";
                        _.each(data2, function(adresse) {
                            html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                        });
                        window.apf.adressen_html = html;
                        $("#TPopKontrBearb")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrBearb);
                    }
                });
            } else {
                $("#TPopKontrBearb")
                    .html(window.apf.adressen_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrBearb);
            }
            // für 3 selectfelder TPopKontrZaehleinheit Daten holen - oder vorhandene nutzen
            if (!window.apf.TPopKontrZähleinheit_html) {
                var getTpopfeldkontrZaehleinheit = $.ajax({
                    type: 'get',
                    url: 'php/tpopfeldkontr_zaehleinheit.php',
                    dataType: 'json'
                });
                getTpopfeldkontrZaehleinheit.always(function(data3) {
                    if (data3) {
                        // Feld mit Daten beliefern
                        var html;
                        html = "<option></option>";
                        _.each(data3.rows, function(zähleinheit) {
                            html += "<option value=\"" + zähleinheit.id + "\">" + zähleinheit.ZaehleinheitTxt + "</option>";
                        });
                        window.apf.TPopKontrZähleinheit_html = html;
                        // alle 3 Felder setzen
                        $("#TPopKontrZaehleinheit1")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit1);
                        $("#TPopKontrZaehleinheit2")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit2);
                        $("#TPopKontrZaehleinheit3")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit3);
                    }
                });
            } else {
                // alle 3 Felder setzen
                $("#TPopKontrZaehleinheit1")
                    .html(window.apf.TPopKontrZähleinheit_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit1);
                $("#TPopKontrZaehleinheit2")
                    .html(window.apf.TPopKontrZähleinheit_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit2);
                $("#TPopKontrZaehleinheit3")
                    .html(window.apf.TPopKontrZähleinheit_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit3);
            }
            // Felder, die nur in der Feldkontrolle vorkommen
            if (!localStorage.tpopfreiwkontr) {
                $("#TPopKontrTyp" + data.TPopKontrTyp).prop("checked", true);
                $("#TPopKontrJungpfl").val(data.TPopKontrJungpfl);
                $("#TPopKontrVitalitaet")
                    .val(data.TPopKontrVitalitaet)
                    .limiter(255, $("#TPopKontrVitalitaet_limit"));
                $("#TPopKontrUeberleb").val(data.TPopKontrUeberleb);
                $("#TPopKontrEntwicklung" + data.TPopKontrEntwicklung).prop("checked", true);
                $("#TPopKontrUrsach")
                    .val(data.TPopKontrUrsach)
                    .limiter(255, $("#TPopKontrUrsach_limit"));
                $("#TPopKontrUrteil")
                    .val(data.TPopKontrUrteil)
                    .limiter(255, $("#TPopKontrUrteil_limit"));
                $("#TPopKontrAendUms")
                    .val(data.TPopKontrAendUms)
                    .limiter(255, $("#TPopKontrAendUms_limit"));
                $("#TPopKontrAendKontr")
                    .val(data.TPopKontrAendKontr)
                    .limiter(255, $("#TPopKontrAendKontr_limit"));
                // Biotop
                $("#TPopKontrFlaeche").val(data.TPopKontrFlaeche);
                $("#TPopKontrVegTyp")
                    .val(data.TPopKontrVegTyp)
                    .limiter(100, $("#TPopKontrVegTyp_limit"));
                $("#TPopKontrKonkurrenz")
                    .val(data.TPopKontrKonkurrenz)
                    .limiter(100, $("#TPopKontrKonkurrenz_limit"));
                $("#TPopKontrMoosschicht")
                    .val(data.TPopKontrMoosschicht)
                    .limiter(100, $("#TPopKontrMoosschicht_limit"));
                $("#TPopKontrKrautschicht")
                    .val(data.TPopKontrKrautschicht)
                    .limiter(100, $("#TPopKontrKrautschicht_limit"));
                $("#TPopKontrStrauchschicht")
                    .val(data.TPopKontrStrauchschicht)
                    .limiter(255, $("#TPopKontrStrauchschicht_limit"));
                $("#TPopKontrBaumschicht")
                    .val(data.TPopKontrBaumschicht)
                    .limiter(100, $("#TPopKontrBaumschicht_limit"));
                $("#TPopKontrBodenTyp")
                    .val(data.TPopKontrBodenTyp)
                    .limiter(255, $("#TPopKontrBodenTyp_limit"));
                $("#TPopKontrBodenKalkgehalt")
                    .val(data.TPopKontrBodenKalkgehalt)
                    .limiter(100, $("#TPopKontrBodenKalkgehalt_limit"));
                $("#TPopKontrBodenDurchlaessigkeit")
                    .val(data.TPopKontrBodenDurchlaessigkeit)
                    .limiter(100, $("#TPopKontrBodenDurchlaessigkeit_limit"));
                $("#TPopKontrBodenHumus")
                    .val(data.TPopKontrBodenHumus)
                    .limiter(100, $("#TPopKontrBodenHumus_limit"));
                $("#TPopKontrBodenNaehrstoffgehalt")
                    .val(data.TPopKontrBodenNaehrstoffgehalt)
                    .limiter(100, $("#TPopKontrBodenNaehrstoffgehalt_limit"));
                $("#TPopKontrBodenAbtrag")
                    .val(data.TPopKontrBodenAbtrag)
                    .limiter(255, $("#TPopKontrBodenAbtrag_limit"));
                $("#TPopKontrWasserhaushalt")
                    .val(data.TPopKontrWasserhaushalt)
                    .limiter(255, $("#TPopKontrWasserhaushalt_limit"));
                $("#TPopKontrHandlungsbedarf").val(data.TPopKontrHandlungsbedarf);
                $("#TPopKontrIdealBiotopUebereinst" + data.TPopKontrIdealBiotopUebereinst).prop("checked", true);
                // TPopKontrLeb: Daten holen - oder vorhandene nutzen
                if (!window.apf.lrdelarze_html) {
                    var getLrDelarze = $.ajax({
                        type: 'get',
                        url: 'php/lrdelarze.php',
                        dataType: 'json'
                    });
                    getLrDelarze.always(function(data4) {
                        if (data4) {
                            // Feld mit Daten beliefern
                            var html;
                            html = "<option></option>";
                            _.each(data4.rows, function(lr) {
                                html += "<option value=\"" + lr.id + "\">" + lr.Einheit + "</option>";
                            });
                            window.apf.lrdelarze_html = html;
                            $("#TPopKontrLeb")
                                .html(html)
                                .val(window.apf.tpopfeldkontr.TPopKontrLeb);
                            $("#TPopKontrLebUmg")
                                .html(html)
                                .val(window.apf.tpopfeldkontr.TPopKontrLebUmg);
                        }
                    });
                } else {
                    $("#TPopKontrLeb")
                        .html(window.apf.lrdelarze_html)
                        .val(window.apf.tpopfeldkontr.TPopKontrLeb);
                    $("#TPopKontrLebUmg")
                        .html(window.apf.lrdelarze_html)
                        .val(window.apf.tpopfeldkontr.TPopKontrLebUmg);
                }
            }
            // TPopKontrIdealBiotopUebereinst: Daten holen - oder vorhandene nutzen
            if (!window.apf.IdealBiotopÜbereinst_html) {
                var getIdealbiotopübereinst = $.ajax({
                    type: 'get',
                    url: 'php/idealbiotopuebereinst.php',
                    dataType: 'json'
                });
                getIdealbiotopübereinst.always(function(data5) {
                    if (data5) {
                        // Feld mit Daten beliefern
                        var html;
                        html = "<option></option>";
                        _.each(data5.rows, function(übereinst) {
                            html += "<option value=\"" + übereinst.id + "\">" + übereinst.DomainTxt + "</option>";
                        });
                        window.apf.IdealBiotopÜbereinst_html = html;
                        $("#TPopKontrIdealBiotopUebereinst")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrIdealBiotopUebereinst);
                    }
                });
            } else {
                $("#TPopKontrIdealBiotopUebereinst")
                    .html(window.apf.IdealBiotopÜbereinst_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrIdealBiotopUebereinst);
            }
            // Felder, die nur in freiwkontr vorkommen
            if (localStorage.tpopfreiwkontr) {
                if (data.TPopKontrPlan == 1) {
                    $("#TPopKontrPlan").prop("checked", true);
                } else {
                    $("#TPopKontrPlan").prop("checked", false);
                }
                $("#TPopKontrUebFlaeche").val(data.TPopKontrUebFlaeche);
                $("#TPopKontrUebPfl").val(data.TPopKontrUebPfl);
                $("#TPopKontrNaBo").val(data.TPopKontrNaBo);
                $TPopKontrJungPflJN_ja.prop("checked", false);
                $TPopKontrJungPflJN_nein.prop("checked", false);
                $TPopKontrJungPflJN_leer.prop("checked", false);
                if (data.TPopKontrJungPflJN == 1) {
                    $TPopKontrJungPflJN_ja.prop("checked", true);
                } else if (data.TPopKontrJungPflJN == 0) {
                    $TPopKontrJungPflJN_nein.prop("checked", true);
                } else {
                    $TPopKontrJungPflJN_leer.prop("checked", true);
                }
                $("#TPopKontrVegHoeMax").val(data.TPopKontrVegHoeMax);
                $("#TPopKontrVegHoeMit").val(data.TPopKontrVegHoeMit);
                $("#TPopKontrGefaehrdung")
                    .val(data.TPopKontrGefaehrdung)
                    .limiter(255, $("#TPopKontrGefaehrdung_limit"));
            }
            // fieldcontain-divs der benötigten Felder einblenden
            if (localStorage.tpopfreiwkontr) {
                _.each(window.apf.feldliste_freiwkontr, function(feld) {
                    $("#fieldcontain_" + feld).show();
                });
            } else {
                _.each(window.apf.feldliste_feldkontr, function(feld) {
                    $("#fieldcontain_" + feld).show();
                });
            }
            // Formulare blenden
            window.apf.zeigeFormular("tpopfeldkontr");
            if (!localStorage.tpopfreiwkontr) {
                history.replaceState({tpopfeldkontr: "tpopfeldkontr"}, "tpopfeldkontr", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopfeldkontr=" + localStorage.tpopfeldkontr_id);
            } else {
                history.replaceState({tpopfreiwkontr: "tpopfreiwkontr"}, "tpopfreiwkontr", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopfreiwkontr=" + localStorage.tpopfeldkontr_id);
            }
            // Register in Feldkontr blenden
            if (localStorage.tpopfreiwkontr) {
                $("#tpopfeldkontr_tabs_biotop").hide();
                $("#biotop_tab_li").hide();
                $("#tpopfeldkontr_tabs").tabs("option", "active", 0);
            } else {
                $("#tpopfeldkontr_tabs_biotop").show();
                $("#biotop_tab_li").show();
                // Dieses Element wird fälschlicherweise in Entwicklung eingeblendet
                // keine Ahnung wieso
                // ausblenden!
                $("#tpopfeldkontr_tabs_biotop").hide();
            }
            // Fokus steuern
            $TPopKontrJahr.focus();
            $(window).scrollTop(0);
        }
    });
};

module.exports = initiiereTPopFeldkontr;