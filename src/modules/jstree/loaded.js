/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (ApArtId) {
    var initiiereAp = require('../initiiereAp');

    window.apf.setzeTreehoehe();
    $("#suchen").show();
    $("#exportieren_2").show();
    $("#exportieren_1").hide();
    $("#hilfe").show();
    if (window.apf.popZeigen) {
        $("#tree").jstree("select_node", "[typ='pop']#" + localStorage.popId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
        delete window.apf.popZeigen;
    }
    if (window.apf.popberZeigen) {
        $("#tree").jstree("select_node", "[typ='popber']#" + localStorage.popberId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
        delete window.apf.popberZeigen;
    }
    if (window.apf.popmassnberZeigen) {
        $("#tree").jstree("select_node", "[typ='popmassnber']#" + localStorage.popmassnberId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
        delete window.apf.popmassnberZeigen;
    }
    if (window.apf.tpopZeigen) {
        $("#tree").jstree("select_node", "[typ='tpop']#" + localStorage.tpopId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
        delete window.apf.tpopZeigen;
    }
    if (window.apf.tpopfeldkontrZeigen) {
        $("#tree").jstree("select_node", "[typ='tpopfeldkontr']#" + localStorage.tpopfeldkontrId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
        delete window.apf.tpopfeldkontrZeigen;
    }
    if (window.apf.tpopfreiwkontrZeigen) {
        $("#tree").jstree("select_node", "[typ='tpopfreiwkontr']#" + localStorage.tpopfeldkontrId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
        delete window.apf.tpopfreiwkontrZeigen;
    }
    if (window.apf.tpopmassnZeigen) {
        $("#tree").jstree("select_node", "[typ='tpopmassn']#" + localStorage.tpopmassnId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
        delete window.apf.tpopmassnZeigen;
    }
    if (window.apf.tpopberZeigen) {
        $("#tree").jstree("select_node", "[typ='tpopber']#" + localStorage.tpopberId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
        delete window.apf.tpopberZeigen;
    }
    if (window.apf.beobZugeordnetZeigen) {
        $("#tree").jstree("select_node", "#beob" + localStorage.beobId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob_zugeordnet geöffnet wird
        delete window.apf.beobZugeordnetZeigen;
    }
    if (window.apf.tpopmassnberZeigen) {
        $("#tree").jstree("select_node", "[typ='tpopmassnber']#" + localStorage.tpopmassnberId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
        delete window.apf.tpopmassnberZeigen;
    }
    if (window.apf.apzielZeigen) {
        $("#tree").jstree("select_node", "[typ='apziel']#" + localStorage.apzielId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
        delete window.apf.apzielZeigen;
    }
    if (window.apf.zielberZeigen) {
        $("#tree").jstree("select_node", "[typ='zielber']#" + localStorage.zielberId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
        delete window.apf.zielberZeigen;
    }
    if (window.apf.erfkritZeigen) {
        $("#tree").jstree("select_node", "[typ='erfkrit']#" + localStorage.erfkritId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
        delete window.apf.erfkritZeigen;
    }
    if (window.apf.jberZeigen) {
        $("#tree").jstree("select_node", "[typ='jber']#" + localStorage.jberId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
        delete window.apf.jberZeigen;
    }
    if (window.apf.jberUebersichtZeigen) {
        $("#tree").jstree("select_node", "[typ='jber_uebersicht']#" + localStorage.jberUebersichtId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese jber_uebersicht geöffnet wird
        delete window.apf.jberUebersichtZeigen;
    }
    if (window.apf.berZeigen) {
        $("#tree").jstree("select_node", "[typ='ber']#" + localStorage.berId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
        delete window.apf.berZeigen;
    }
    if (window.apf.idealbiotopZeigen) {
        $("#tree").jstree("select_node", "[typ='idealbiotop']#" + localStorage.idealbiotopId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese idealbiotop geöffnet wird
        delete window.apf.idealbiotopZeigen;
    }
    if (window.apf.assozartenZeigen) {
        $("#tree").jstree("select_node", "[typ='assozarten']#" + localStorage.assozartenId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
        delete window.apf.assozartenZeigen;
    }
    if (window.apf.beobNichtBeurteiltZeigen) {
        $("#tree").jstree("select_node", "#beob" + localStorage.beobId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
        delete window.apf.beobNichtBeurteiltZeigen;
    }
    if (window.apf.beobNichtZuzuordnenZeigen) {
        $("#tree").jstree("select_node", "#beob" + localStorage.beobId);
        // diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
        delete window.apf.beobNichtZuzuordnenZeigen;
    }
    if (window.apf.apZeigen) {
        initiiereAp(ApArtId);
        //localStorage.apId = ApArtId;
        //$('#ap_waehlen').trigger('change');
        // diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
        delete window.apf.apZeigen;
    }
};