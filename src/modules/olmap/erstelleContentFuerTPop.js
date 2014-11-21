/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (tpop) {
    var myFlurname = tpop.TPopFlurname || '(kein Flurname)';
    return '<table>' +
        '<tr><td><p>Typ:</p></td><td><p>Teilpopulation</p></td></tr>' +
        '<tr><td><p>Population:</p></td><td><p>' + tpop.PopName + '</p></td></tr>' +
        '<tr><td><p>Teilpopulation:</p></td><td><p>' + myFlurname + '</p></td></tr>' +
        '<tr><td><p>Koordinaten:</p></td><td><p>' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p></td></tr>' +
        '</table>' +
        '<p><a href="#" onclick="window.apf.oeffneTPop(\'' + tpop.TPopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneTPopInNeuemTab(\'' + tpop.TPopId + '\')">Formular in neuem Fenster öffnen<\/a></p>';
};