/**
 * baut das html für die Dropdown-Liste der Delarze-Lebensräume
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.lrdelarzeHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (callback) {
    var html = window.apf.lrdelarzeHtml;

    if (!html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/lrDelarze'
        }).done(function (data) {
            if (data) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (lr) {
                    html += '<option value="' + lr.id + '">' + lr.Einheit + '</option>';
                });
                window.apf.lrdelarzeHtml = html;
            }
            callback(html);
            return;
        });
    }
    callback(html);
};