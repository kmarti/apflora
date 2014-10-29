/**
 * baut das html für die Dropdown-Liste der Zähleinheiten
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.TPopKontrZähleinheit_html
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * diser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (callback) {
    var html = '';

    if (!window.apf.TPopKontrZähleinheit_html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/feldkontrZaehleinheit',
            dataType: 'json'
        }).done(function (data) {
            if (data && data.length > 0) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (zähleinheit) {
                    html += '<option value="' + zähleinheit.id + '">' + zähleinheit.ZaehleinheitTxt + '</option>';
                });
                window.apf.TPopKontrZähleinheit_html = html;
            }
            callback(html);
        });
    }
    callback(window.apf.TPopKontrZähleinheit_html);
};

module.exports = returnFunction;