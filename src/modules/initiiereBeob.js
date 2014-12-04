/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                      = require('jquery'),
    _                      = require('underscore'),
    capitaliseFirstLetter  = require('../lib/capitaliseFirstLetter'),
    initiiereAp            = require('./initiiereAp'),
    zeigeFormular          = require('./zeigeFormular'),
    melde                  = require('./melde'),
    erstelleFelderFuerBeob = require('./erstelleFelderFuerBeob');

var initiiereBeob = function (beobTyp, beobId, beobStatus, ohneZuZeigen) {

    // beobStatus markiert, ob die Beobachtung:
    // - schon zugewiesen ist (zugeordnet)
    // - noch nicht beurteilt ist (nicht_beurteilt)
    // - nicht zuzuordnen ist (nicht_zuzuordnen)
    // beobStatus muss gespeichert werden, damit bei Datenänderungen bekannt ist, ob ein bestehender Datensatz bearbeitet oder ein neuer geschaffen werden muss
    localStorage.beobStatus = beobStatus;
    // sicherstellen, dass beobtyp immer bekannt ist
    localStorage.beobtyp = beobTyp;

    var url,
        urlDistzutpop,
        urlZuordnung,
        $BeobBemerkungen,
        idFeld,
        htmlBeobfelder,
        htmlDistzutpop;

    if (!beobId && !ohneZuZeigen) {
        // es fehlen benötigte Daten > eine Ebene höher
        if (beobStatus === "nicht_beurteilt" || beobStatus === "nicht_zuzuordnen") {
            initiiereAp();
        } else {
            initiiereBeob();
        }
        return;
    }

    $BeobBemerkungen = $("#BeobBemerkungen");

    // beobid hat meist 'beob' vorangestellt - entfernen!
    if (beobId.indexOf('beob') > -1) {
        beobId = beobId.replace('beob', '');
    }
    // beobid bereitstellen
    localStorage.beobId = beobId;

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
        url: url
    }).done(function (dataBeob) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (dataBeob && dataBeob.length > 0) {
            dataBeob = dataBeob[0];

            // boebfelder bereitstellen
            htmlBeobfelder = erstelleFelderFuerBeob(dataBeob, beobTyp);
            $("#beob_table").html(htmlBeobfelder);

            // Abstand zu TPop aus der DB holen
            urlDistzutpop = 'api/v1/beobDistzutpop' + capitaliseFirstLetter(beobTyp) + '/beobId=' + beobId;
            $.ajax({
                type: 'get',
                url: urlDistzutpop
            }).done(function (data) {
                // Tabellenzeile beginnen
                htmlDistzutpop = '<tr class="fieldcontain distZuTPop"><td class="label"><label for="distZuTPop">Einer Teilpopulation zuordnen:</label></td><td class="Datenfelder"><div class="Datenfelder" id="DistZuTPop_Felder">';
                if (data) {
                    _.each(data, function (beob, index) {
                        if (index > 0) {
                            htmlDistzutpop += "<br>";
                        }
                        htmlDistzutpop += '<input type="radio" name="distZuTPop" id="distZuTPop';
                        htmlDistzutpop += beob.TPopId;
                        htmlDistzutpop += '" class="distZuTPop" formular="beob" value="';
                        htmlDistzutpop += beob.TPopId;
                        htmlDistzutpop += '" distZuTPop="';
                        htmlDistzutpop += beob.DistZuTPop;
                        htmlDistzutpop += '"';
                        // jetzt ermitteln, ob das die angezeigte Beob ist
                        // wenn ja: checked
                        if (beob.TPopId === localStorage.tpopId) {
                            htmlDistzutpop += ' checked';
                        }
                        htmlDistzutpop += '>';
                        // Label beginnen
                        htmlDistzutpop += '<label for="distZuTPop';
                        htmlDistzutpop += beob.TPopId;
                        htmlDistzutpop += '">';
                        // Wenn TPop keine Koordinaten haben, dies anzeigen und Anzeige von NAN verhindern
                        if (parseInt(beob.DistZuTPop, 10) >= 0) {
                            htmlDistzutpop += parseInt(beob.DistZuTPop, 10) + "m: " + beob.TPopFlurname;
                        } else {
                            htmlDistzutpop += beob.TPopFlurname;
                        }
                        // Label abschliessen
                        htmlDistzutpop += '</label>';
                    });

                    // Tabellenzeile abschliessen
                    htmlDistzutpop += '</div></td></tr>';

                    // distzutpop bereitstellen
                    $("#beob_zuordnungsfelder").html(htmlDistzutpop);

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
                            url: urlZuordnung
                        }).done(function (data) {
                            if (data && data[0]) {
                                data = data[0];
                                // Felder mit Daten beliefern
                                $("#beobNichtBeurteilt").prop("checked", false);
                                if (data.BeobNichtZuordnen === 1) {
                                    $("#beobNichtZuordnen").prop("checked", true);
                                } else {
                                    $("#beobNichtZuordnen").prop("checked", false);
                                }
                                $("#distZuTPop" + data.TPopId).prop("checked", true);
                                $("#BeobBemerkungen").val(data.BeobBemerkungen);
                                $("#BeobMutWann").val(data.BeobMutWann);
                                $("#BeobMutWer").val(data.BeobMutWer);

                                // Formulare blenden
                                // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
                                if (!ohneZuZeigen) {
                                    zeigeFormular("beob");
                                    if (beobStatus === "zugeordnet") {
                                        history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + localStorage.tpopId + "&beobZugeordnet=" + beobId);
                                    } else if (beobStatus === "nicht_zuzuordnen") {
                                        history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&beobNichtZuzuordnen=" + beobId);
                                    }
                                }
                            }
                        });
                    } else {
                        // beobStatus ist "nicht beurteilt"
                        $("#beobNichtBeurteilt").prop("checked", true);
                        $("#beobNichtZuordnen").prop("checked", false);

                        // allfällige im letzen beob enthaltene Werte entfernen
                        $BeobBemerkungen
                            .val("")
                            .attr("placeholder", "Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich");

                        // Formulare blenden
                        // nur, wenn ohneZuZeigen nicht true ist (true, um in dialog anzuzeigen)
                        if (!ohneZuZeigen) {
                            zeigeFormular("beob");
                            history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&beobNichtBeurteilt=" + beobId);
                        }
                    }
                }
            });
        }
    }).fail(function () {
        melde('Fehler: Keine Daten für die Beobachtung erhalten');
    });
};

module.exports = initiiereBeob;