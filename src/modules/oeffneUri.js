/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $   = require('jquery'),
    _   = require('underscore'),
    Uri = require('Uri');

var returnFunction = function () {
    var uri                     = new Uri($(location).attr('href')),
        anchor                  = uri.anchor() || null,
        apId                    = uri.getQueryParamValue('ap'),
        popId                   = uri.getQueryParamValue('pop'),
        tpopId                  = uri.getQueryParamValue('tpop'),
        tpopfeldkontrId         = uri.getQueryParamValue('tpopfeldkontr'),
        tpopfreiwkontrId        = uri.getQueryParamValue('tpopfreiwkontr'),
        tpopmassnId             = uri.getQueryParamValue('tpopmassn'),
        tpopberId               = uri.getQueryParamValue('tpopber'),
        tpopmassnberId          = uri.getQueryParamValue('tpopmassnber'),
        popberId                = uri.getQueryParamValue('popber'),
        popmassnberId           = uri.getQueryParamValue('popmassnber'),
        apzielId                = uri.getQueryParamValue('apziel'),
        zielberId               = uri.getQueryParamValue('zielber'),
        erfkritId               = uri.getQueryParamValue('erfkrit'),
        jberId                  = uri.getQueryParamValue('jber'),
        jber_uebersichtId       = uri.getQueryParamValue('jber_uebersicht'),
        berId                   = uri.getQueryParamValue('ber'),
        idealbiotopId           = uri.getQueryParamValue('idealbiotop'),
        assozartenId            = uri.getQueryParamValue('assozarten'),
        exporte                 = uri.getQueryParamValue('exporte'),
        ap_waehlen_text,
        initiiereIdealbiotop    = require('./initiiereIdealbiotop'),
        initiiereAp             = require('./initiiereAp'),
        initiierePop            = require('./initiiereBeob'),
        initiiereApziel         = require('./initiiereApziel'),
        initiiereErfkrit        = require('./initiiereErfkrit'),
        initiiereZielber        = require('./initiiereZielber'),
        initiiereJber           = require('./initiiereJber'),
        initiiereJberUebersicht = require('./initiiereJberUebersicht'),
        initiiereBer            = require('./initiiereBer'),
        initiierePopMassnBer    = require('./initiierePopMassnBer'),
        initiiereTPop           = require('./initiiereTPop'),
        initiierePopBer         = require('./initiierePopBer'),
        initiiereTPopFeldkontr  = require('./initiiereTPopFeldkontr'),
        initiiereTPopMassn      = require('./initiiereTPopMassn'),
        initiiereTPopMassnBer   = require('./initiiereTPopMassnBer'),
        initiiereTPopBer        = require('./initiiereTPopBer');

    // zuerst die globalen Variabeln setzen
    if (apId)              window.apf.setzeWindowAp(apId);
    if (popId)             window.apf.setzeWindowPop(popId);
    if (tpopId)            window.apf.setzeWindowTpop(tpopId);
    if (tpopfeldkontrId)   window.apf.setzeWindowTpopfeldkontr(tpopfeldkontrId);
    if (tpopfreiwkontrId)  window.apf.setzeWindowTpopfeldkontr(tpopfreiwkontrId);
    if (tpopmassnId)       window.apf.setzeWindowTpopmassn(tpopmassnId);
    if (tpopberId)         window.apf.setzeWindowTpopber(tpopberId);
    if (tpopmassnberId)    window.apf.setzeWindowTpopmassnber(tpopmassnberId);
    if (popberId)          window.apf.setzeWindowPopber(popberId);
    if (popmassnberId)     window.apf.setzeWindowPopmassnber(popmassnberId);
    if (apzielId)          window.apf.setzeWindowApziel(apzielId);
    if (zielberId)         window.apf.setzeWindowZielber(zielberId);
    if (erfkritId)         window.apf.setzeWindowErfkrit(erfkritId);
    if (jberId)            window.apf.setzeWindowJber(jberId);
    if (jber_uebersichtId) window.apf.setzeWindowJberUebersicht(jber_uebersichtId);
    if (berId)             window.apf.setzeWindowBer(berId);
    if (idealbiotopId)     window.apf.setzeWindowIdealbiotop(idealbiotopId);
    if (assozartenId)      window.apf.setzeWindowAssozarten(assozartenId);

    if (apId) {
        // Dem Feld im Formular den Wert zuweisen
        $("#ap_waehlen").val(apId);
        // gewählte Art in Auswahlliste anzeigen
        ap_waehlen_text = _.find(window.apf.apliste.programm_alle, function (art) {
            return art.id == apId;
        });
        if (ap_waehlen_text) {
            $("#ap_waehlen_text").val(ap_waehlen_text.label);
        }
        if (tpopId) {
            if (tpopfeldkontrId) {
                // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
                // Die Markierung wird im load-Event wieder entfernt
                window.apf.tpopfeldkontr_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopFeldkontr(apId, popId, tpopId, tpopfeldkontrId, 'feldKontr');
            } else if (tpopfreiwkontrId) {
                // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
                window.apf.tpopfreiwkontr_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                localStorage.tpopfreiwkontr = true;
                initiiereTPopFeldkontr(apId, popId, tpopId, tpopfeldkontrId, 'freiwKontr');
            } else if (tpopmassnId) {
                // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
                window.apf.tpopmassn_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopMassn(apId, popId, tpopId, tpopmassnId);
            } else if (tpopberId) {
                // markieren, dass nach dem loaded-event im Tree die tpopber angezeigt werden soll
                window.apf.tpopber_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopBer(apId, popId, tpopId, tpopberId);
            } else if (uri.getQueryParamValue('beob_zugeordnet')) {
                // markieren, dass nach dem loaded-event im Tree die beob_zugeordnet angezeigt werden soll
                window.apf.beob_zugeordnet_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                /*ausgeschaltet - funktioniert nicht! vermutlich, weil tree.php und beob_distzutpop sich in quere kommen
                // herausfinden, ob beobtyp infospezies oder evab ist
                localStorage.beobId = uri.getQueryParamValue('beob_zugeordnet');
                if (isNaN(uri.getQueryParamValue('beob_zugeordnet'))) {
                    // evab
                    localStorage.beobtyp = "evab";
                    window.apf.initiiere_beob("evab", localStorage.beobId, "zugeordnet");
                } else {
                    localStorage.beobtyp = "infospezies";
                    window.apf.initiiere_beob("infospezies", localStorage.beobId, "zugeordnet");
                }*/
            } else if (tpopmassnberId) {
                // markieren, dass nach dem loaded-event im Tree die tpopmassnber angezeigt werden soll
                window.apf.tpopmassnber_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopMassnBer(apId, popId, tpopmassnberId);
            } else {
                // muss tpop sein
                // markieren, dass nach dem loaded-event im Tree die TPop angezeigt werden soll
                window.apf.tpop_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPop(apId, popId, tpopId);
            }
        } else if (popId) {
            if (popberId) {
                // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
                window.apf.popber_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiierePopBer(apId, popId, popberId);
            } else if (popmassnberId) {
                // markieren, dass nach dem loaded-event im Tree die popmassnber angezeigt werden soll
                window.apf.popmassnber_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiierePopMassnBer(apId, popId, popmassnberId);
            } else {
                // muss pop sein
                // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
                window.apf.pop_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiierePop(apId, popId);
            }
        } else if (apzielId) {
            if (zielberId) {
                // markieren, dass nach dem loaded-event im Tree die zielber angezeigt werden soll
                window.apf.zielber_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereZielber(apId, apzielId, zielberId);
            } else {
                // muss ein apziel sein
                // markieren, dass nach dem loaded-event im Tree die apziel angezeigt werden soll
                window.apf.apziel_zeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereApziel(apId, apzielId);
            }
        } else if (erfkritId) {
            // markieren, dass nach dem loaded-event im Tree die erfkrit angezeigt werden soll 
            window.apf.erfkrit_zeigen = true;
            // direkt laden
            initiiereErfkrit(apId, erfkritId);
        } else if (jberId) {
            // markieren, dass nach dem loaded-event im Tree die jber angezeigt werden soll 
            window.apf.jber_zeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereJber(apId, jberId);
        } else if (jber_uebersichtId) {
            // markieren, dass nach dem loaded-event im Tree die jber_uebersicht angezeigt werden soll 
            window.apf.jber_übersicht_zeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereJberUebersicht(apId, jber_uebersichtId);
        } else if (berId) {
            // markieren, dass nach dem loaded-event im Tree die ber angezeigt werden soll 
            window.apf.ber_zeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereBer(apId, berId);
        } else if (idealbiotopId) {
            // markieren, dass nach dem loaded-event im Tree die idealbiotop angezeigt werden soll 
            window.apf.idealbiotop_zeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereIdealbiotop(apId);
        } else if (assozartenId) {
            // markieren, dass nach dem loaded-event im Tree die assozarten angezeigt werden soll 
            window.apf.assozarten_zeigen = true;
            // NICHT direkt initiieren, weil sonst die Artliste noch nicht existiert
        } else if (uri.getQueryParamValue('beob_nicht_beurteilt')) {
            // markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
            window.apf.beob_nicht_beurteilt_zeigen = true;
        } else if (uri.getQueryParamValue('beob_nicht_zuzuordnen')) {
            // markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
            window.apf.beob_nicht_zuzuordnen_zeigen = true;
        } else {
            // muss ap sein
            // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
            window.apf.ap_zeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereAp(apId);
        }
        window.apf.erstelle_tree(apId);
    } else {
        if (exporte) {
            window.apf.initiiereExporte(anchor);
        }
    }
};

module.exports = returnFunction;