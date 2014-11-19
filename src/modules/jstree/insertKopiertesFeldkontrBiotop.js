/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    melde                                     = require('../melde');

module.exports = function (nodeFeldkontrId) {
    var data = {};
    data.id = erstelleIdAusDomAttributId(nodeFeldkontrId);
    data.user = sessionStorage.user;
    // nur aktualisieren, wenn Schreibrechte bestehen
    if (!window.apf.pruefeSchreibvoraussetzungen()) {
        return;
    }
    _.each(window.apf.feldkontrBiotop, function (value, key) {
        $("#" + key).val(value);
        data[key] = value;
    });
    // jetzt alles speichern
    $.ajax({
        type: 'post',
        url: 'api/v1/updateMultiple/apflora/tabelle=tblTeilPopFeldkontrolle/felder=' + JSON.stringify(data)
    }).fail(function () {
        melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
    });
};