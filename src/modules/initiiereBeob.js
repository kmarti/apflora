/*jslint node: true, browser: true, nomen: true */
'use strict';

var $                     = require('jquery'),
    _                     = require('underscore'),
    capitaliseFirstLetter = require('../lib/capitaliseFirstLetter'),
    initiiereAp           = require('./initiiereAp');

var initiiereBeob = function (beobTyp, beobId, beobStatus, ohneZuZeigen) {
    // beob_status markiert, ob die Beobachtung:
    // - schon zugewiesen ist (zugeordnet)
    // - noch nicht beurteilt ist (nicht_beurteilt)
    // - nicht zuzuordnen ist (nicht_zuzuordnen)
    // beob_status muss gespeichert werden, damit bei Datenänderungen bekannt ist, ob ein bestehender Datensatz bearbeitet oder ein neuer geschaffen werden muss
    localStorage.beob_status = beobStatus;
    // sicherstellen, dass beobtyp immer bekannt ist
    localStorage.beobtyp = beobTyp;

    var url,
        url_distzutpop,
        urlZuordnung,
        $BeobBemerkungen = $("#BeobBemerkungen"),
        idFeld;

    if (!beobId && !ohneZuZeigen) {
        // es fehlen benötigte Daten > eine Ebene höher
        if (beobStatus === "nicht_beurteilt" || beobStatus === "nicht_zuzuordnen") {
            initiiereAp();
        } else {
            initiiereBeob();
        }
        return;
    }

    // beobid hat meist 'beob' vorangestellt - entfernen!
    if (beobId.indexOf('beob') > -1) {
        beobId = beobId.replace('beob', '');
    }
    // beobid bereitstellen
    localStorage.beob_id = beobId;

    // EvAB oder Infospezies? > entsprechende url zusammensetzen
    if (beobTyp === 'evab') {
        idFeld = 'NO_NOTE_PROJET';
        url = 'api/v1/beob/tabelle=tblBeobEvab/feld=' + idFeld + '/wertString=' + beobId;
    } else {
        idFeld = 'NO_NOTE';
        url = 'api/v1/beob/tabelle=tblBeobInfospezies/feld=' + idFeld + '/wertNumber=' + beobId;
    }

    // Daten für die beob aus der DB holen
    $.ajax({
        type: 'get',
        url: url,
        dataType: 'json'
    }).done(function (data_beob) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data_beob && data_beob.length > 0) {
            data_beob = data_beob[0];

            // boebfelder bereitstellen
            var html_beobfelder = window.apf.erstelleFelderFürBeob(data_beob, beobTyp);
            $("#beob_table").html(html_beobfelder);

            // Abstand zu TPop aus der DB holen
            url_distzutpop = 'api/v1/beobDistzutpop' + capitaliseFirstLetter(beobTyp) + '/beobId=' + beobId;
            $.ajax({
                type: 'get',
                url: url_distzutpop,
                dataType: 'json'
            }).done(function (data) {
                // Tabellenzeile beginnen
                var html_distzutpop = '<tr class="fieldcontain DistZuTPop"><td class="label"><label id="DistZuTPop_label" for="DistZuTPop">Einer Teilpopulation zuordnen:</label></td><td class="Datenfelder"><div class="Datenfelder" id="DistZuTPop_Felder">';
                if (data) {
                    _.each(data, function (beob, index) {
                        if (index>0) {
                            html_distzutpop += "<br>";
                        }
                        html_distzutpop += '<input type="radio" name="DistZuTPop" id="DistZuTPop';
                        html_distzutpop += beob.TPopId;
                        html_distzutpop += '" class="DistZuTPop" formular="beob" value="';
                        html_distzutpop += beob.TPopId;
                        html_distzutpop += '" DistZuTPop="';
                        html_distzutpop += beob.DistZuTPop;
                        html_distzutpop += '"';
                        // jetzt ermitteln, ob das die angezeigte Beob ist
                        // wenn ja: checked
                        if (/*beobStatus === 'zugeordnet' && */beob.TPopId == localStorage.tpop_id) {
                            html_distzutpop += ' checked';
                        }
                        html_distzutpop += '>';
                        // Label beginnen
                        html_distzutpop += '<label for="DistZuTPop';
                        html_distzutpop += beob.TPopId;
                        html_distzutpop += '">';
                        // Wenn TPop keine Koordinaten haben, dies anzeigen und Anzeige von NAN verhindern
                        if (parseInt(beob.DistZuTPop, 10) >= 0) {
                            html_distzutpop += parseInt(beob.DistZuTPop) + "m: " + beob.TPopFlurname;
                        } else {
                            html_distzutpop += beob.TPopFlurname;
                        }
                        // Label abschliessen
                        html_distzutpop += '</label>';
                    });

                    // Tabellenzeile abschliessen
                    html_distzutpop += '</div></td></tr>';

                    // distzutpop bereitstellen
                    $("#beob_zuordnungsfelder").html(html_distzutpop);

                    $BeobBemerkungen.attr("placeholder", "");

                    if (beobStatus !== "nicht_beurteilt") {
                        // Daten der Zuordnung holen
                        if (beobTyp === 'evab') {
                            urlZuordnung = 'api/v1/apflora/tabelle=tblBeobZuordnung/feld=NO_NOTE/wertString=' + beobId;
                        } else {
                            urlZuordnung = 'api/v1/apflora/tabelle=tblBeobZuordnung/feld=NO_NOTE/wertNumber=' + beobId;
                        }
                        $.ajax({
                            type: 'get',
                            url: urlZuordnung,
                            dataType: 'json'
                        }).done(function (data) {
                            if (data && data[0]) data = data[0];
                            // Felder mit Daten beliefern
                            $("#BeobNichtBeurteilt").prop("checked", false);
                            if (data.BeobNichtZuordnen === 1) {
                                $("#BeobNichtZuordnen").prop("checked", true);
                            } else {
                                $("#BeobNichtZuordnen").prop("checked", false);
                            }
                            $("#DistZuTPop" + data.TPopId).prop("checked", true);
                            $("#BeobBemerkungen").val(data.BeobBemerkungen);
                            $("#BeobMutWann").val(data.BeobMutWann);
                            $("#BeobMutWer").val(data.BeobMutWer);

                            // Formulare blenden
                            // nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
                            if (!ohneZuZeigen) {
                                window.apf.zeigeFormular("beob");
                                if (beobStatus === "zugeordnet") {
                                    history.pushState(null, null, "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&beob_zugeordnet=" + beobId);
                                } else if (beobStatus === "nicht_zuzuordnen") {
                                    history.pushState(null, null, "index.html?ap=" + localStorage.ap_id + "&beob_nicht_zuzuordnen=" + beobId);
                                }
                            }
                        });
                    } else {
                        // beob_status ist "nicht beurteilt"
                        $("#BeobNichtBeurteilt").prop("checked", true);
                        $("#BeobNichtZuordnen").prop("checked", false);

                        // allfällige im letzen beob enthaltene Werte entfernen
                        $BeobBemerkungen
                            .val("")
                            .attr("placeholder", "Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich");

                        // Formulare blenden
                        // nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
                        if (!ohneZuZeigen) {
                            window.apf.zeigeFormular("beob");
                            history.pushState(null, null, "index.html?ap=" + localStorage.ap_id + "&beob_nicht_beurteilt=" + beobId);
                        }
                    }
                }
            });
        }
    }).fail(function () {
        window.apf.melde('Fehler: Keine Daten für die Beobachtung erhalten');
    });
};

module.exports = initiiereBeob;