/**
 * baut das html für die Dropdown-Liste der Zähleinheiten
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.TPopKontrZaehleinheitHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (callback) {
    var html = window.apf.TPopKontrZaehleinheitHtml;

    if (!html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/feldkontrZaehleinheit'
        }).done(function (data) {
            if (data && data.length > 0) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (zaehleinheit) {
                    html += '<option value="' + zaehleinheit.ZaehleinheitCode + '">' + zaehleinheit.ZaehleinheitTxt + '</option>';
                });
                window.apf.TPopKontrZaehleinheitHtml = html;
            }
            callback(html);
            return;
        });
    }
    callback(html);
};