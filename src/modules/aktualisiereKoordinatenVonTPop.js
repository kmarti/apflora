/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $     = require('jquery'),
    melde = require('./melde');

module.exports = function (tpop) {
    var koordAktualisiert = $.Deferred(),
        felder = {};

    // Objekt vorbereiten, das die Felder, ihre Werte und übrige benötigte Angaben enthält
    felder.id         = tpop.TPopId;
    felder.user       = sessionStorage.user;
    felder.TPopXKoord = tpop.TPopXKoord;
    felder.TPopYKoord = tpop.TPopYKoord;

    // Datensatz updaten
    // /api/v1/updateMultiple/apflora/tabelle={tabelle}/felder={felder}
    $.ajax({
        type: 'post',
        url: 'api/v1/updateMultiple/apflora/tabelle=tblTeilpopulation/felder=' + JSON.stringify(felder)
    }).done(function () {
        koordAktualisiert.resolve();
    }).fail(function () {
        melde('Fehler: Die Koordinaten wurden nicht aktualisiert');
        koordAktualisiert.resolve();
    });
    return koordAktualisiert.promise();
};