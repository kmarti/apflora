/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    ol                 = require('ol'),
    melde              = require('../melde'),
    initiiereLayertree = require('./initiiereLayertree'),
    erstellePopLayer   = require('./erstellePopLayer');

module.exports = function (overlayPopVisible, overlayPopnrVisible, popidMarkiert) {
    var popGezeigt = $.Deferred();

    $.ajax({
        type: 'get',
        url: 'api/v1/popKarteAlle/apId=' + window.apf.ap.ApArtId
    }).done(function (popListe) {
        // Layer für Symbole und Beschriftung erstellen
        $.when(erstellePopLayer(popListe, popidMarkiert, overlayPopVisible)).then(function () {
            // layertree neu aufbauen
            initiiereLayertree();
            popGezeigt.resolve();
        });
    }).fail(function () {
        melde("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
        popGezeigt.resolve();
    });
    return popGezeigt.promise();
};