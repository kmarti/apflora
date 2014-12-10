/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                                         = require('jquery'),
    erstelleIdAusDomAttributId                = require('../erstelleIdAusDomAttributId'),
    insertNeuenNodeEineHierarchiestufeTiefer  = require('./insertNeuenNodeEineHierarchiestufeTiefer'),
    insertNeuenNodeAufGleicherHierarchiestufe = require('./insertNeuenNodeAufGleicherHierarchiestufe'),
    melde                                     = require('../melde');

module.exports = function (aktiverNode, parentNode, nodeApId) {
    $.ajax({
        type: 'post',
        url: 'api/v1/insert/apflora/tabelle=tblJBer/feld=ApArtId/wert=' + erstelleIdAusDomAttributId(nodeApId) + '/user=' + encodeURIComponent(sessionStorage.user)
    }).done(function (id) {
        var strukturtyp  = "jber",
            beschriftung = "neuer AP-Bericht";
        if ($(aktiverNode).attr("id") === nodeApId) {
            insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        } else {
            insertNeuenNodeAufGleicherHierarchiestufe(aktiverNode, parentNode, strukturtyp, id, beschriftung);
        }
    }).fail(function () {
        melde("Fehler: Keinen neuen AP-Bericht erstellt");
    });
};