/**
 * baut das html für die Dropdown-Liste der Übereinstimmung mit dem Idealbiotop
 * speichert die Liste in window.apf.IdealBiotopUebereinstHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (callback) {
    var html = window.apf.IdealBiotopUebereinstHtml;

    if (!html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/idealbiotopUebereinst'
        }).done(function (data) {
            if (data && data.length > 0) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (uebereinst) {
                    html += '<option value="' + uebereinst.id + '">' + uebereinst.DomainTxt + '</option>';
                });
                window.apf.IdealBiotopUebereinstHtml = html;
            }
            callback(html);
            return;
        });
    }
    callback(html);
};