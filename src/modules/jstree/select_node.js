/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (event, data, ApArtId) {
    var node,
        nodeTyp,
        nodeId,
        initiiereBeob              = require('../initiiereBeob'),
        initiiereIdealbiotop       = require('../initiiereIdealbiotop'),
        initiiereAp                = require('../initiiereAp'),
        initiierePop               = require('../initiierePop'),
        initiiereApziel            = require('../initiiereApziel'),
        initiiereZielber           = require('../initiiereZielber'),
        initiiereErfkrit           = require('../initiiereErfkrit'),
        initiiereJber              = require('../initiiereJber'),
        initiiereJberUebersicht    = require('../initiiereJberUebersicht'),
        initiiereBer               = require('../initiiereBer'),
        initiiereAssozart          = require('../initiiereAssozart'),
        initiierePopMassnBer       = require('../initiierePopMassnBer'),
        initiiereTPop              = require('../initiiereTPop'),
        initiierePopBer            = require('../initiierePopBer'),
        initiiereTPopFeldkontr     = require('../initiiereTPopFeldkontr'),
        initiiereTPopMassn         = require('../initiiereTPopMassn'),
        initiiereTPopMassnBer      = require('../initiiereTPopMassnBer'),
        initiiereTPopBer           = require('../initiiereTPopBer'),
        erstelleIdAusDomAttributId = require('../erstelleIdAusDomAttributId');

    // Erinnerung an letzten Klick im Baum löschen
    delete localStorage.tpopfreiwkontr;

    node = data.rslt.obj;
    nodeTyp = node.attr("typ");
    // in der ID des Nodes enthaltene Texte müssen entfernt werden
    nodeId = erstelleIdAusDomAttributId(node.attr("id"));
    // node öffnen
    $.jstree._reference(node).open_node(node);
    // richtiges Formular initiieren
    if (nodeTyp.slice(0, 3) === "ap_" || nodeTyp === "apzieljahr") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#ap").is(':visible') || localStorage.apId !== nodeId) {
            localStorage.apId = nodeId;
            delete localStorage.popId;
            initiiereAp(nodeId);
        }
    } else if (nodeTyp === "pop" || nodeTyp.slice(0, 4) === "pop_") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#pop").is(':visible') || localStorage.popId !== nodeId) {
            localStorage.popId = nodeId;
            initiierePop(ApArtId, nodeId);
        }
    } else if (nodeTyp === "apziel" || nodeTyp === "zielber_ordner") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#apziel").is(':visible') || localStorage.apzielId !== nodeId) {
            localStorage.apzielId = nodeId;
            initiiereApziel();
        }
    } else if (nodeTyp === "zielber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#zielber").is(':visible') || localStorage.zielberId !== nodeId) {
            localStorage.zielberId = nodeId;
            initiiereZielber();
        }
    } else if (nodeTyp === "erfkrit") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#erfkrit").is(':visible') || localStorage.erfkritId !== nodeId) {
            localStorage.erfkritId = nodeId;
            initiiereErfkrit();
        }
    } else if (nodeTyp === "jber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#jber").is(':visible') || localStorage.jberId !== nodeId) {
            localStorage.jberId = nodeId;
            initiiereJber();
        }
    } else if (nodeTyp === "jber_uebersicht") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#jber_uebersicht").is(':visible') || localStorage.jberUebersichtId !== nodeId) {
            localStorage.jberUebersichtId = nodeId;
            initiiereJberUebersicht();
        }
    } else if (nodeTyp === "ber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#ber").is(':visible') || localStorage.berId !== nodeId) {
            localStorage.berId = nodeId;
            initiiereBer();
        }
    } else if (nodeTyp === "idealbiotop") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#idealbiotop").is(':visible')) {
            // eigene id nicht nötig
            // 1:1 mit ap verbunden, gleich id
            // wenn noch kein Datensatz existiert erstellt ihn initiiereIdealbiotop
            initiiereIdealbiotop();
        }
    } else if (nodeTyp === "assozarten") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#assozarten").is(':visible') || localStorage.assozartenId !== nodeId) {
            localStorage.assozartenId = nodeId;
            initiiereAssozart(localStorage.apId, nodeId);
        }
    } else if (nodeTyp === "popber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#popber").is(':visible') || localStorage.popberId !== nodeId) {
            localStorage.popberId = nodeId;
            initiierePopBer();
        }
    } else if (nodeTyp === "popmassnber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#popmassnber").is(':visible') || localStorage.popmassnberId !== nodeId) {
            localStorage.popmassnberId = nodeId;
            initiierePopMassnBer();
        }
    } else if (nodeTyp === "tpop" || nodeTyp.slice(0, 5) === "tpop_") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#tpop").is(':visible') || localStorage.tpopId !== nodeId) {
            localStorage.tpopId = nodeId;
            initiiereTPop();
        }
    } else if (nodeTyp === "tpopfeldkontr") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontrId !== nodeId) {
            localStorage.tpopfeldkontrId = nodeId;
            initiiereTPopFeldkontr();
        }
    } else if (nodeTyp === "tpopfreiwkontr") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontrId !== nodeId) {
            localStorage.tpopfeldkontrId = nodeId;
            localStorage.tpopfreiwkontr = true;
            initiiereTPopFeldkontr();
        }
    } else if (nodeTyp === "tpopmassn") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#tpopmassn").is(':visible') || localStorage.tpopmassnId !== nodeId) {
            localStorage.tpopmassnId = nodeId;
            initiiereTPopMassn();
        }
    } else if (nodeTyp === "tpopber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#tpopber").is(':visible') || localStorage.tpopberId !== nodeId) {
            localStorage.tpopberId = nodeId;
            initiiereTPopBer();
        }
    } else if (nodeTyp === "beob_zugeordnet") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#beob").is(':visible') || localStorage.beobId !== nodeId || localStorage.beobStatus !== "zugeordnet") {
            localStorage.beobId = nodeId;
            localStorage.beobtyp = node.attr("beobtyp");
            initiiereBeob(node.attr("beobtyp"), nodeId, "zugeordnet");
        }
    } else if (nodeTyp === "beob_nicht_beurteilt") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#beob").is(':visible') || localStorage.beobId !== nodeId || localStorage.beobStatus !== "nicht_beurteilt") {
            localStorage.beobId = nodeId;
            localStorage.beobtyp = node.attr("beobtyp");
            // den Beobtyp mitgeben
            initiiereBeob(node.attr("beobtyp"), nodeId, "nicht_beurteilt");
        }
    } else if (nodeTyp === "beob_nicht_zuzuordnen") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#beob").is(':visible') || localStorage.beobId !== nodeId || localStorage.beobStatus !== "nicht_zuzuordnen") {
            localStorage.beobId = nodeId;
            localStorage.beobtyp = node.attr("beobtyp");
            // den Beobtyp mitgeben
            initiiereBeob(node.attr("beobtyp"), nodeId, "nicht_zuzuordnen");
        }
    } else if (nodeTyp === "tpopmassnber") {
        // verhindern, dass bereits offene Seiten nochmals geöffnet werden
        if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnberId !== nodeId) {
            localStorage.tpopmassnberId = nodeId;
            initiiereTPopMassnBer();
        }
    }
};