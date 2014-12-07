// übernimmt einen node
// zählt dessen children und passt die Beschriftung an

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (node) {
    console.log('node: ', node);
    
    var anz,
        anzTxt,
        nodeTyp = node.attr('typ');

    anz = $(node).find("> ul > li").length;

    switch (nodeTyp) {
    case 'apOrdnerPop':
        anzTxt = "Populationen (" + anz + ")";
        break;
    case 'apzieljahr':
        anzTxt = $.jstree._reference(node).get_text(node).slice(0, 6);
        anzTxt += anz + ")";
        break;
    case 'zielberOrdner':
        anzTxt = "Ziel-Berichte (" + anz + ")";
        break;
    case 'apOrdnerErfkrit':
        anzTxt = "AP-Erfolgskriterien (" + anz + ")";
        break;
    case 'apOrdnerJber':
        anzTxt = "AP-Berichte (" + anz + ")";
        break;
    case 'apOrdnerBer':
        anzTxt = "Berichte (" + anz + ")";
        break;
    case 'apOrdnerAssozarten':
        anzTxt = "assoziierte Arten (" + anz + ")";
        break;
    case 'popOrdnerMassnber':
        anzTxt = "Massnahmen-Berichte (" + anz + ")";
        break;
    case 'popOrdnerPopber':
        anzTxt = "Populations-Berichte (" + anz + ")";
        break;
    case 'popOrdnerTpop':
        anzTxt = "Teilpopulationen (" + anz + ")";
        break;
    case 'tpopOrdnerMassn':
        anzTxt = "Massnahmen (" + anz + ")";
        break;
    case 'tpopOrdnerMassnber':
        anzTxt = "Massnahmen-Berichte (" + anz + ")";
        break;
    case 'tpopOrdnerTpopber':
        anzTxt = "Teilpopulations-Berichte (" + anz + ")";
        break;
    case 'tpopOrdnerFeldkontr':
        anzTxt = "Feldkontrollen (" + anz + ")";
        break;
    case 'tpopOrdnerFreiwkontr':
        anzTxt = "Freiwilligen-Kontrollen (" + anz + ")";
        break;
    case 'tpopOrdnerBeobZugeordnet':
        anzTxt = "Beobachtungen (" + anz + ")";
        break;
    case 'apOrdnerBeobNichtBeurteilt':
        anzTxt = (anz === 100 ? "nicht beurteilte Beobachtungen (neuste " + anz + ")" : "nicht beurteilte Beobachtungen (" + anz + ")");
        break;
    case 'apOrdnerBeobNichtZuzuordnen':
        anzTxt = (anz === 100 ? "nicht zuzuordnende Beobachtungen (neuste " + anz + ")" : "nicht zuzuordnende Beobachtungen (" + anz + ")");
        break;
    case 'apOrdnerApziel':
        anz = 0;
        $($.jstree._reference(node)._get_children(node)).each(function () {
            $($(this).find("> ul > li")).each(function () {
                anz += 1;
            });
        });
        anzTxt = "AP-Ziele (" + anz + ")";
        break;
    }
    $.jstree._reference(node).rename_node(node, anzTxt);
};