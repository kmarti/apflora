/*jslint node: true, browser: true, nomen: true, todo: true, white: true */
'use strict';

var $                            = require('jquery'),
    pruefeSchreibvoraussetzungen = require('../pruefeSchreibvoraussetzungen');

module.exports = function () {
    var tpopKontrFlaeche               = $("#TPopKontrFlaeche").val(),
        tpopKontrLeb                   = $("#TPopKontrLeb").val(),
        tpopKontrLebUmg                = $("#TPopKontrLebUmg").val(),
        tpopKontrVegTyp                = $("#TPopKontrVegTyp").val(),
        tpopKontrKonkurrenz            = $("#TPopKontrKonkurrenz").val(),
        tpopKontrMoosschicht           = $("#TPopKontrMoosschicht").val(),
        tpopKontrKrautschicht          = $("#TPopKontrKrautschicht").val(),
        tpopKontrStrauchschicht        = $("#TPopKontrStrauchschicht").val(),
        tpopKontrBaumschicht           = $("#TPopKontrBaumschicht").val(),
        tpopKontrBodenTyp              = $("#TPopKontrBodenTyp").val(),
        tpopKontrBodenKalkgehalt       = $("#TPopKontrBodenKalkgehalt").val(),
        tpopKontrBodenDurchlaessigkeit = $("#TPopKontrBodenDurchlaessigkeit").val(),
        tpopKontrBodenHumus            = $("#TPopKontrBodenHumus").val(),
        tpopKontrBodenNaehrstoffgehalt = $("#TPopKontrBodenNaehrstoffgehalt").val(),
        tpopKontrBodenAbtrag           = $("#TPopKontrBodenAbtrag").val(),
        tpopKontrWasserhaushalt        = $("#TPopKontrWasserhaushalt").val(),
        tpopKontrHandlungsbedarf       = $("#TPopKontrHandlungsbedarf").val(),
        fkb;

    // nur fortfahren, wenn Schreibrechte bestehen
    if (!pruefeSchreibvoraussetzungen()) {
        return;
    }
    delete window.apf.feldkontrBiotop;
    window.apf.feldkontrBiotop = fkb = {};
    if (tpopKontrFlaeche)               { fkb.TPopKontrFlaeche               = tpopKontrFlaeche; }
    if (tpopKontrLeb)                   { fkb.TPopKontrLeb                   = tpopKontrLeb; }
    if (tpopKontrLebUmg)                { fkb.TPopKontrLebUmg                = tpopKontrLebUmg; }
    if (tpopKontrVegTyp)                { fkb.TPopKontrVegTyp                = tpopKontrVegTyp; }
    if (tpopKontrKonkurrenz)            { fkb.TPopKontrKonkurrenz            = tpopKontrKonkurrenz; }
    if (tpopKontrMoosschicht)           { fkb.TPopKontrMoosschicht           = tpopKontrMoosschicht; }
    if (tpopKontrKrautschicht)          { fkb.TPopKontrKrautschicht          = tpopKontrKrautschicht; }
    if (tpopKontrStrauchschicht)        { fkb.TPopKontrStrauchschicht        = tpopKontrStrauchschicht; }
    if (tpopKontrBaumschicht)           { fkb.TPopKontrBaumschicht           = tpopKontrBaumschicht; }
    if (tpopKontrBodenTyp)              { fkb.TPopKontrBodenTyp              = tpopKontrBodenTyp; }
    if (tpopKontrBodenKalkgehalt)       { fkb.TPopKontrBodenKalkgehalt       = tpopKontrBodenKalkgehalt; }
    if (tpopKontrBodenDurchlaessigkeit) { fkb.TPopKontrBodenDurchlaessigkeit = tpopKontrBodenDurchlaessigkeit; }
    if (tpopKontrBodenHumus)            { fkb.TPopKontrBodenHumus            = tpopKontrBodenHumus; }
    if (tpopKontrBodenNaehrstoffgehalt) { fkb.TPopKontrBodenNaehrstoffgehalt = tpopKontrBodenNaehrstoffgehalt; }
    if (tpopKontrBodenAbtrag)           { fkb.TPopKontrBodenAbtrag           = tpopKontrBodenAbtrag; }
    if (tpopKontrWasserhaushalt)        { fkb.TPopKontrWasserhaushalt        = tpopKontrWasserhaushalt; }
    if (tpopKontrHandlungsbedarf)       { fkb.TPopKontrHandlungsbedarf       = tpopKontrHandlungsbedarf; }
};