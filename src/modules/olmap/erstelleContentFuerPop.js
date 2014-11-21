/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (pop) {
    return '<table>' +
        '<tr><td><p>Typ:</p></td><td><p>Population</p></td></tr>' +
        '<tr><td><p>Koordinaten:</p></td><td><p>' + pop.PopXKoord + ' / ' + pop.PopYKoord + '</p></td></tr>' +
        '</table>' +
        '<p><a href="#" onclick="window.apf.oeffnePop(\'' + pop.PopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'pop\', ' + pop.PopId + ')">Formular neben der Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffnePopInNeuemTab(\'' + pop.PopId + '\')">Formular in neuem Fenster öffnen<\/a></p>';
};