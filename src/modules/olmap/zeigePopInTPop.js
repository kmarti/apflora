/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    ol                 = require('ol'),
    melde              = require('../melde'),
    initiiereLayertree = require('./initiiereLayertree'),
    erstellePopLayer   = require('./erstellePopLayer');

module.exports = function (overlayPopVisible, overlayPopnrVisible, popidMarkiert) {
    var pop_gezeigt = $.Deferred();

    $.ajax({
        type: 'get',
        url: 'api/v1/popKarteAlle/apId=' + window.apf.ap.ApArtId
    }).done(function (PopListe) {
        // Layer für Symbole und Beschriftung erstellen
        $.when(erstellePopLayer(PopListe, popidMarkiert, overlayPopVisible)).then(function () {
            // layertree neu aufbauen
            initiiereLayertree();
            pop_gezeigt.resolve();
        });
    }).fail(function () {
        melde("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
        pop_gezeigt.resolve();
    });
    return pop_gezeigt.promise();
};