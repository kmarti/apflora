/**
 * baut das html für die Dropdown-Liste der Adressen
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.adressen_html
 * um wiederholte DB-Zugriffe zu vermeiden
 */

'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function(callback) {
    var html = '';

    if (!window.apf.adressen_html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/adressen',
            dataType: 'json'
        }).done(function(data2) {
            if (data2) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data2, function(adresse) {
                    html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                });
                window.apf.adressen_html = html;
            }
            callback(html);
        });
    }
    callback(window.apf.adressen_html);
};

module.exports = returnFunction;