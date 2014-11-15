/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function () {
    var URL,
        $beobfelder_FNS_XGIS         = $("#beobfelder_FNS_XGIS"),
        $beobfelder_FNS_YGIS         = $("#beobfelder_FNS_YGIS"),
        $beobfelder_COORDONNEE_FED_E = $("#beobfelder_COORDONNEE_FED_E"),
        $beobfelder_COORDONNEE_FED_N = $("#beobfelder_COORDONNEE_FED_N"),
        $TPopXKoord                  = $("#TPopXKoord"),
        $TPopYKoord                  = $("#TPopYKoord"),
        $PopXKoord                   = $("#PopXKoord"),
        $PopYKoord                   = $("#PopYKoord"),
        melde                        = require('./melde');

    if ($beobfelder_FNS_XGIS.val() && $beobfelder_FNS_YGIS.val()) {
        URL = "//www.maps.zh.ch/?x=" + $beobfelder_FNS_XGIS.val() + "&y=" + $beobfelder_FNS_YGIS.val() + "&scale=3000&markers=ring";
        window.open(URL, 'target="_blank"');
    } else if ($beobfelder_COORDONNEE_FED_E.val() && $beobfelder_COORDONNEE_FED_N.val()) {
        URL = "//www.maps.zh.ch/?x=" + $beobfelder_COORDONNEE_FED_E.val() + "&y=" + $beobfelder_COORDONNEE_FED_N.val() + "&scale=3000&markers=ring";
        window.open(URL, 'target="_blank"');
    } else if ($TPopXKoord.val() && $TPopYKoord.val()) {
        URL = "//www.maps.zh.ch/?x=" + $TPopXKoord.val() + "&y=" + $TPopYKoord.val() + "&scale=3000&markers=ring";
        window.open(URL, 'target="_blank"');
    } else if ($PopXKoord.val() && $PopYKoord.val()) {
        URL = "//www.maps.zh.ch/?x=" + $PopXKoord.val() + "&y=" + $PopYKoord.val() + "&scale=3000&markers=ring";
        window.open(URL, 'target="_blank"');
    } else {
        melde("Fehler: Keine Koordinaten zum Anzeigen", "Aktion abgebrochen");
    }
};

module.exports = returnFunction;