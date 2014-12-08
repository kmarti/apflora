/**
 * holt die Daten für die Dropdown-Liste der Zähleinheiten
 * wird in mehreren Felder benutzt
 * speichert die Liste in window.apf.TPopKontrZaehleinheit
 * um wiederholte DB-Zugriffe zu vermeiden
 * nimmt eine callback-Funktion entgegen
 * dieser werden die geholten Daten übergeben
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function () {
    var data = window.apf.TPopKontrZaehleinheit,
        dataGeholt = $.Deferred();

    if (!data) {
        $.ajax({
            type: 'get',
            url: 'api/v1/feldkontrZaehleinheit'
        }).done(function (data) {
            window.apf.TPopKontrZaehleinheit = data;
            dataGeholt.resolve();
        }).fail(function () {
            window.apf.TPopKontrZaehleinheit = [];
            dataGeholt.resolve();
        });
    }
    return dataGeholt.promise();
};