/**
 * baut das html für die Dropdown-Liste der Massnahmentypen
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.tpopmassntypHtml
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (callback) {
    var html = window.apf.tpopmassntypHtml;

    if (!html) {
        $.ajax({
            type:     'get',
            url:      'api/v1/tpopMassnTypen'
        }).done(function (data) {
            if (data && data.length > 0) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (tpopmassnTyp) {
                    html += '<option value="' + tpopmassnTyp.id + '">' + tpopmassnTyp.MassnTypTxt + '</option>';
                });
                window.apf.tpopmassntypHtml = html;
            }
            callback(html);
            return;
        });
    }
    callback(html);
};