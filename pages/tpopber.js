/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $     = require('jquery'),
    _     = require('underscore'),
    View  = require('ampersand-view'),
    melde = require('../src/modules/melde');

module.exports = View.extend({
    pageTitle: '',
    template: '',
    initialize: function (tpopBerId) {
        var self = this;
        // objekt holen
        // Daten für die tpopber aus der DB holen
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblTeilPopBericht/feld=TPopBerId/wertNumber=' + tpopBerId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                self.model = data[0];
                history.pushState(null, null, "index.html?ap=" + localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + localStorage.tpopId + "&tpopber=" + tpopBerId);
            }
        }).fail(function () {
            melde('Fehler: keine Daten für den Teilpopulations-Bericht erhalten');
        });
    }
});