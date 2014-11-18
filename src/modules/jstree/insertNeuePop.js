/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeApId) {
    console.log('nodeApId: ', nodeApId);
    $.ajax({
        type: 'post',
        url: 'api/v1/insert/apflora/tabelle=tblPopulation/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(nodeApId) + '/user=' + sessionStorage.user
    }).done(function (id) {
        var strukturtyp  = "pop",
            beschriftung = "neue Population";
        if ($(aktiverNode).attr("id") === nodeApId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Keine neue Population erstellt");
    });
};