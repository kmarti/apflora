/**
 * baut das html für die Dropdown-Liste der Übereinstimmung mit dem Idealbiotop
 * speichert die Liste in window.apf.IdealBiotopÜbereinst_html
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * diser wird das generierte html übergeben
 */

/*jslint node: true, browser: true */
'use strict';


var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (callback) {
    var html = '';

    if (!window.apf.IdealBiotopÜbereinst_html) {
        $.ajax({
            type: 'get',
            url: 'api/v1/idealbiotopUebereinst',
            dataType: 'json'
        }).done(function (data) {
            if (data && data.length > 0) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (übereinst) {
                    html += '<option value="' + übereinst.id + '">' + übereinst.DomainTxt + '</option>';
                });
                window.apf.IdealBiotopÜbereinst_html = html;
            }
            callback(html);
        });
    }
    callback(window.apf.IdealBiotopÜbereinst_html);
};

module.exports = returnFunction;