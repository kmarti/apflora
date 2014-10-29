/**
 * baut das html für die Dropdown-Liste der Delarze-Lebensräume
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.lrdelarze_html
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * diser wird das generierte html übergeben
 */

'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (callback) {
    var html = '';

    if (!window.apf.lrdelarze_html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/lrDelarze',
            dataType: 'json'
        }).done(function (data) {
            if (data) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (lr) {
                    html += '<option value="' + lr.id + '">' + lr.Einheit + '</option>';
                });
                window.apf.lrdelarze_html = html;
            }
            callback(html);
        });
    }
    callback(window.apf.lrdelarze_html);
};

module.exports = returnFunction;