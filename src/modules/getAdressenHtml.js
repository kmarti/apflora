/**
 * baut das html für die Dropdown-Liste der Adressen
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.adressenHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (callback) {
    var html = window.apf.adressenHtml;

    if (!html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/adressen'
        }).done(function (data) {
            if (data) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (adresse) {
                    html += '<option value="' + adresse.id + '">' + adresse.AdrName + '</option>';
                });
                window.apf.adressenHtml = html;
            }
            callback(html);
            return;
        });
    }
    callback(html);
};