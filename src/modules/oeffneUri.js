/*jslint node: true, browser: true, nomen: true, todo: true, white: true */
'use strict';

var $                         = require('jquery'),
    _                         = require('underscore'),
    Uri                       = require('Uri'),
    initiiereIdealbiotop      = require('./initiiereIdealbiotop'),
    initiiereAp               = require('./initiiereAp'),
    initiierePop              = require('./initiierePop'),
    initiiereApziel           = require('./initiiereApziel'),
    initiiereErfkrit          = require('./initiiereErfkrit'),
    initiiereZielber          = require('./initiiereZielber'),
    initiiereJber             = require('./initiiereJber'),
    initiiereJberUebersicht   = require('./initiiereJberUebersicht'),
    initiiereBer              = require('./initiiereBer'),
    initiierePopMassnBer      = require('./initiierePopMassnBer'),
    initiiereTPop             = require('./initiiereTPop'),
    initiierePopBer           = require('./initiierePopBer'),
    initiiereTPopKontr        = require('./initiiereTPopKontr'),
    initiiereTPopMassn        = require('./initiiereTPopMassn'),
    initiiereTPopMassnBer     = require('./initiiereTPopMassnBer'),
    initiiereTPopBer          = require('./initiiereTPopBer'),
    initiiereBeob             = require('./initiiereBeob'),
    erstelleTree              = require('./jstree/erstelleTree'),
    setzeWindowAp             = require('./setzeWindowAp'),
    setzeWindowPop            = require('./setzeWindowPop'),
    setzeWindowApziel         = require('./setzeWindowApziel'),
    setzeWindowZielber        = require('./setzeWindowZielber'),
    setzeWindowErfkrit        = require('./setzeWindowErfkrit'),
    setzeWindowJber           = require('./setzeWindowJber'),
    setzeWindowJberUebersicht = require('./setzeWindowJberUebersicht'),
    setzeWindowBer            = require('./setzeWindowBer'),
    setzeWindowIdealbiotop    = require('./setzeWindowIdealbiotop'),
    setzeWindowAssozarten     = require('./setzeWindowAssozarten'),
    setzeWindowPopmassnber    = require('./setzeWindowPopmassnber'),
    setzeWindowTpop           = require('./setzeWindowTpop'),
    setzeWindowPopber         = require('./setzeWindowPopber'),
    setzeWindowTpopfeldkontr  = require('./setzeWindowTpopfeldkontr'),
    setzeWindowTpopmassn      = require('./setzeWindowTpopmassn'),
    setzeWindowTpopmassnber   = require('./setzeWindowTpopmassnber'),
    setzeWindowTpopber        = require('./setzeWindowTpopber'),
    initiiereExporte          = require('./initiiereExporte');

module.exports = function () {
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
        jberUebersichtId        = uri.getQueryParamValue('jberUebersicht'),
        berId                   = uri.getQueryParamValue('ber'),
        idealbiotopId           = uri.getQueryParamValue('idealbiotop'),
        assozartenId            = uri.getQueryParamValue('assozarten'),
        beobZugeordnetId        = uri.getQueryParamValue('beobZugeordnet'),
        beobNichtBeurteiltId    = uri.getQueryParamValue('beobNichtBeurteilt'),
        beobNichtZuzuordnenId   = uri.getQueryParamValue('beobNichtZuzuordnen'),
        exporte                 = uri.getQueryParamValue('exporte'),
        apWaehlenText;

    // ids in Zahlen umwandeln
    if (apId)              { apId              = parseInt(apId, 10); }
    if (popId)             { popId             = parseInt(popId, 10); }
    if (tpopId)            { tpopId            = parseInt(tpopId, 10); }
    if (tpopfeldkontrId)   { tpopfeldkontrId   = parseInt(tpopfeldkontrId, 10); }
    if (tpopfreiwkontrId)  { tpopfreiwkontrId  = parseInt(tpopfreiwkontrId, 10); }
    if (tpopmassnId)       { tpopmassnId       = parseInt(tpopmassnId, 10); }
    if (tpopberId)         { tpopberId         = parseInt(tpopberId, 10); }
    if (tpopmassnberId)    { tpopmassnberId    = parseInt(tpopmassnberId, 10); }
    if (popberId)          { popberId          = parseInt(popberId, 10); }
    if (popmassnberId)     { popmassnberId     = parseInt(popmassnberId, 10); }
    if (apzielId)          { apzielId          = parseInt(apzielId, 10); }
    if (zielberId)         { zielberId         = parseInt(zielberId, 10); }
    if (erfkritId)         { erfkritId         = parseInt(erfkritId, 10); }
    if (jberId)            { jberId            = parseInt(jberId, 10); }
    if (jberUebersichtId)  { jberUebersichtId  = parseInt(jberUebersichtId, 10); }
    if (berId)             { berId             = parseInt(berId, 10); }
    if (idealbiotopId)     { idealbiotopId     = parseInt(idealbiotopId, 10); }
    if (assozartenId)      { assozartenId      = parseInt(assozartenId, 10); }

    // zuerst die globalen Variabeln setzen
    if (apId)              { setzeWindowAp(apId); }
    if (popId)             { setzeWindowPop(popId); }
    if (tpopId)            { setzeWindowTpop(tpopId); }
    if (tpopfeldkontrId)   { setzeWindowTpopfeldkontr(tpopfeldkontrId); }
    if (tpopfreiwkontrId)  { setzeWindowTpopfeldkontr(tpopfreiwkontrId); }
    if (tpopmassnId)       { setzeWindowTpopmassn(tpopmassnId); }
    if (tpopberId)         { setzeWindowTpopber(tpopberId); }
    if (tpopmassnberId)    { setzeWindowTpopmassnber(tpopmassnberId); }
    if (popberId)          { setzeWindowPopber(popberId); }
    if (popmassnberId)     { setzeWindowPopmassnber(popmassnberId); }
    if (apzielId)          { setzeWindowApziel(apzielId); }
    if (zielberId)         { setzeWindowZielber(zielberId); }
    if (erfkritId)         { setzeWindowErfkrit(erfkritId); }
    if (jberId)            { setzeWindowJber(jberId); }
    if (jberUebersichtId)  { setzeWindowJberUebersicht(jberUebersichtId); }
    if (berId)             { setzeWindowBer(berId); }
    if (idealbiotopId)     { setzeWindowIdealbiotop(idealbiotopId); }
    if (assozartenId)      { setzeWindowAssozarten(assozartenId); }

    if (apId) {
        // Dem Feld im Formular den Wert zuweisen
        $("#apWaehlen").val(apId);
        // TODO: funktioniert nicht
        // gewählte Art in Auswahlliste anzeigen
        apWaehlenText = _.find(window.apf.apliste.programmAlle, function (art) {
            return art.id === apId;
        });
        if (apWaehlenText) {
            $("#apWaehlenText").val(apWaehlenText.label);
        }
        if (tpopId) {
            if (tpopfeldkontrId) {
                // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
                // Die Markierung wird im load-Event wieder entfernt
                window.apf.tpopfeldkontrZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopKontr(apId, popId, tpopId, tpopfeldkontrId, 'feldKontr');
            } else if (tpopfreiwkontrId) {
                // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
                window.apf.tpopfreiwkontrZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                localStorage.tpopfreiwkontr = true;
                initiiereTPopKontr(apId, popId, tpopId, tpopfeldkontrId, 'freiwKontr');
            } else if (tpopmassnId) {
                // markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll
                window.apf.tpopmassnZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopMassn(apId, popId, tpopId, tpopmassnId);
            } else if (tpopberId) {
                // markieren, dass nach dem loaded-event im Tree die tpopber angezeigt werden soll
                window.apf.tpopberZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopBer(apId, popId, tpopId, tpopberId);
            } else if (beobZugeordnetId) {
                // markieren, dass nach dem loaded-event im Tree die beobZugeordnet angezeigt werden soll
                window.apf.beobZugeordnetZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                // herausfinden, ob beobtyp infospezies oder evab ist
                localStorage.beobId = beobZugeordnetId;
                if (isNaN(beobZugeordnetId)) {
                    // evab
                    localStorage.beobtyp = "evab";
                    initiiereBeob("evab", localStorage.beobId, "zugeordnet");
                } else {
                    localStorage.beobtyp = "infospezies";
                    initiiereBeob("infospezies", localStorage.beobId, "zugeordnet");
                }
            } else if (tpopmassnberId) {
                // markieren, dass nach dem loaded-event im Tree die tpopmassnber angezeigt werden soll
                window.apf.tpopmassnberZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPopMassnBer(apId, popId, tpopmassnberId);
            } else {
                // muss tpop sein
                // markieren, dass nach dem loaded-event im Tree die TPop angezeigt werden soll
                window.apf.tpopZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereTPop(apId, popId, tpopId);
            }
        } else if (popId) {
            if (popberId) {
                // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
                window.apf.popberZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiierePopBer(apId, popId, popberId);
            } else if (popmassnberId) {
                // markieren, dass nach dem loaded-event im Tree die popmassnber angezeigt werden soll
                window.apf.popmassnberZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiierePopMassnBer(apId, popId, popmassnberId);
            } else {
                // muss pop sein
                // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll
                window.apf.popZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiierePop(apId, popId);
            }
        } else if (apzielId) {
            if (zielberId) {
                // markieren, dass nach dem loaded-event im Tree die zielber angezeigt werden soll
                window.apf.zielberZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereZielber(apId, apzielId, zielberId);
            } else {
                // muss ein apziel sein
                // markieren, dass nach dem loaded-event im Tree die apziel angezeigt werden soll
                window.apf.apzielZeigen = true;
                // direkt initiieren, bevor der baum fertig aufgebaut ist
                initiiereApziel(apId, apzielId);
            }
        } else if (erfkritId) {
            // markieren, dass nach dem loaded-event im Tree die erfkrit angezeigt werden soll 
            window.apf.erfkritZeigen = true;
            // direkt laden
            initiiereErfkrit(apId, erfkritId);
        } else if (jberId) {
            // markieren, dass nach dem loaded-event im Tree die jber angezeigt werden soll 
            window.apf.jberZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereJber(apId, jberId);
        } else if (jberUebersichtId) {
            // markieren, dass nach dem loaded-event im Tree die jberUebersicht angezeigt werden soll 
            window.apf.jberUebersichtZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereJberUebersicht(apId, jberUebersichtId);
        } else if (berId) {
            // markieren, dass nach dem loaded-event im Tree die ber angezeigt werden soll 
            window.apf.berZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereBer(apId, berId);
        } else if (idealbiotopId) {
            // markieren, dass nach dem loaded-event im Tree die idealbiotop angezeigt werden soll 
            window.apf.idealbiotopZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereIdealbiotop(apId);
        } else if (assozartenId) {
            // markieren, dass nach dem loaded-event im Tree die assozarten angezeigt werden soll 
            window.apf.assozartenZeigen = true;
            // NICHT direkt initiieren, weil sonst die Artliste noch nicht existiert
        } else if (beobNichtBeurteiltId) {
            // markieren, dass nach dem loaded-event im Tree die beobZugeordnet angezeigt werden soll
            window.apf.beobNichtBeurteiltZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            // herausfinden, ob beobtyp infospezies oder evab ist
            localStorage.beobId = beobNichtBeurteiltId;
            if (isNaN(beobNichtBeurteiltId)) {
                // evab
                localStorage.beobtyp = "evab";
                initiiereBeob("evab", localStorage.beobId, "nicht_beurteilt");
            } else {
                localStorage.beobtyp = "infospezies";
                initiiereBeob("infospezies", localStorage.beobId, "nicht_beurteilt");
            }
        } else if (beobNichtZuzuordnenId) {
            // markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
            window.apf.beobNichtZuzuordnenZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            // herausfinden, ob beobtyp infospezies oder evab ist
            localStorage.beobId = beobNichtZuzuordnenId;
            if (isNaN(beobNichtZuzuordnenId)) {
                // evab
                localStorage.beobtyp = "evab";
                initiiereBeob("evab", localStorage.beobId, "nicht_zuzuordnen");
            } else {
                localStorage.beobtyp = "infospezies";
                initiiereBeob("infospezies", localStorage.beobId, "nicht_zuzuordnen");
            }
        } else {
            // muss ap sein
            // markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
            window.apf.apZeigen = true;
            // direkt initiieren, bevor der baum fertig aufgebaut ist
            initiiereAp(apId);
        }
        erstelleTree(apId);
    } else {
        if (exporte) {
            initiiereExporte(anchor);
        }
    }
};