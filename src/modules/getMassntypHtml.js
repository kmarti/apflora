/**
 * baut das html für die Dropdown-Liste der Massnahmentypen
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.tpopmassntyp_html
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * diser wird das generierte html übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

var returnFunction = function (callback) {
    var html = '';

    if (!window.apf.tpopmassntyp_html) {
        $.ajax({
            type:     'get',
            url:      'api/v1/tpopMassnTypen'
        }).done(function (data) {
            if (data && data.length > 0) {
                // Feld mit Daten beliefern
                html = "<option></option>";
                _.each(data, function (tpopmassn_typ) {
                    html += '<option value="' + tpopmassn_typ.id + '">' + tpopmassn_typ.MassnTypTxt + '</option>';
                });
                window.apf.tpopmassntyp_html = html;
            }
            callback(html);
        });
    }
    callback(window.apf.tpopmassntyp_html);
};

module.exports = returnFunction;