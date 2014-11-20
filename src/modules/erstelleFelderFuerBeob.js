// gibt HTML zurück, mit dem die Informationen über eine Beobachtung dargestellt werden
// erwartet die Daten der Beobachtung

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (data, beobtyp) {
    // Titel für Beob im Formular erstellen
    var beobtitel = "<h1>Informationen aus ",
        htmlBeobfelder,
        htmlBeobfeld,
        nichtAnzuzeigendeFelder = ["NO_ISFS", "ESPECE", "CUSTOM_TEXT_5_", "OBJECTID", "FNS_GISLAYER", "FNS_ISFS", "ID", "FNS_JAHR", "NOM_COMPLET", "FAMILLE"];

    if (beobtyp === "infospezies") {
        beobtitel += "Info Spezies";
    } else {
        beobtitel += "EvAB";
    }
    beobtitel += " (nicht veränderbar)</h1>";
    // Beob-Felder dynamisch aufbauen
    htmlBeobfelder = "<table>";
    $.each(data, function (index, value) {
        if ((value || value === 0) && nichtAnzuzeigendeFelder.indexOf(index) === -1) {
            // TODO: Zahlen, text und Memofelder unterscheiden
            // TODO: Felder durch externe Funktion erstellen lassen
            // ID: beobfelder_ voranstellen, um Namens-Kollisionen zu vermeiden
            htmlBeobfeld  = '<tr class="fieldcontain"><td class="label" style="padding-bottom:3px;"><label for="beobfelder_';
            htmlBeobfeld += index;
            htmlBeobfeld += '">';
            htmlBeobfeld += index;
            htmlBeobfeld += ':</label></td><td class="Datenfelder" style="padding-bottom:3px;"><input id="beobfelder_';
            htmlBeobfeld += index;
            htmlBeobfeld += '" class="Datenfelder" type="text" readonly="readonly" value="';
            htmlBeobfeld += value;
            htmlBeobfeld += '""></td></tr>';
            htmlBeobfelder += htmlBeobfeld;
        }
    });
    htmlBeobfelder += "</table>";
    return beobtitel + htmlBeobfelder;
};