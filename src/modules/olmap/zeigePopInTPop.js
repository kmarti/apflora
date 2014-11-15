/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $     = require('jquery'),
    ol    = require('ol'),
    melde = require('../melde');

var returnFunction = function (overlay_pop_visible, overlay_popnr_visible, popid_markiert) {
    var pop_gezeigt = $.Deferred(),
        initiiereLayertree = require('./initiiereLayertree'),
        erstellePopLayer = require('./erstellePopLayer');

    $.ajax({
        type: 'get',
        url: 'api/v1/popKarteAlle/apId=' + window.apf.ap.ApArtId
    }).done(function (PopListe) {
        // Layer für Symbole und Beschriftung erstellen
        $.when(erstellePopLayer(PopListe, popid_markiert, overlay_pop_visible)).then(function () {
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

module.exports = returnFunction;