/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                  = require('underscore'),
    $                  = require('jquery'),
    ol                 = require('ol'),
    google             = require('google'),
    saveAs             = require('saveAs'),
    pruefeObAngemeldet = require('./pruefeObAngemeldet'),
    isDateSupported    = require('./isDateSupported');

// benötigte globale Variabeln initialisieren
window.apf       = window.apf       || {};
window.apf.gmap  = window.apf.gmap  || {};
window.apf.olmap = window.apf.olmap || {};

module.exports = function () {
    // das muss aus unerfindlichem Grund direkt von index.htm. aus aufgerufen werden
    // sonst wirkt jquery-ui nicht
    window.apf.pruefeObAngemeldet = function () {
        pruefeObAngemeldet();
    };

    // ...und wegen oberem, muss auch diese Funktion in index.html bereit stehen
    window.apf.isDateSupported = function () {
        return isDateSupported();
    };

    // setzt window.apf und localStorage.apId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowAp = function (id) {
        localStorage.apId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/ap=' + localStorage.apId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // ap bereitstellen
                window.apf.ap = data[0];
            }
        });
    };

    // setzt window.apf.pop und localStorage.popId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowPop = function (id) {
        localStorage.popId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblPopulation/feld=PopId/wertNumber=' + localStorage.popId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // pop bereitstellen
                window.apf.pop = data[0];
            }
        });
    };

    // setzt window.apf.apziel und localStorage.apzielId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowApziel = function (id) {
        localStorage.apzielId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblZiel/feld=ZielId/wertNumber=' + localStorage.apzielId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // apziel bereitstellen
                window.apf.apziel = data[0];
            }
        });
    };

    // setzt window.apf.zielber und localStorage.zielberId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowZielber = function (id) {
        localStorage.zielberId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblZielBericht/feld=ZielBerId/wertString=' + localStorage.zielberId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // zielber bereitstellen
                window.apf.zielber = data[0];
            }
        });
    };

    // setzt window.apf.erfkrit und localStorage.erfkritId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowErfkrit = function (id) {
        localStorage.erfkritId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblErfKrit/feld=ErfkritId/wertString=' + localStorage.erfkritId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // erfkrit bereitstellen
                window.apf.erfkrit = data[0];
            }
        });
    };

    // setzt window.apf.jber und localStorage.jberId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowJber = function (id) {
        localStorage.jberId = id;
        $.ajax({
            type: 'get',
            url: '/api/v1/apflora/tabelle=tblJBer/feld=JBerId/wertNumber=' + localStorage.jberId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // jber bereitstellen
                window.apf.jber = data[0];
            }
        });
    };

    // setzt window.apf.jberUebersicht und localStorage.jberUebersichtId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowJberUebersicht = function (id) {
        localStorage.jberUebersichtId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblJBerUebersicht/feld=JbuJahr/wertNumber=' + localStorage.jberUebersichtId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // jberUebersicht bereitstellen
                window.apf.jberUebersicht = data[0];
            }
        });
    };

    // setzt window.apf.ber und localStorage.berId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowBer = function (id) {
        localStorage.berId = id;
        $.ajax({
            type: 'get',
            url: '/api/v1/apflora/tabelle=tblBer/feld=BerId/wertNumber=' + localStorage.berId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                data = data[0];
                // ber bereitstellen
                window.apf.ber = data;
            }
        });
    };

    // setzt window.apf.idealbiotop und localStorage.idealbiotopId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowIdealbiotop = function (id) {
        localStorage.idealbiotopId = id;
        $.ajax({
            type: 'get',
            url: '/api/v1/apflora/tabelle=tblIdealbiotop/feld=IbApArtId/wertNumber=' + localStorage.idealbiotopId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // idealbiotop bereitstellen
                window.apf.idealbiotop = data[0];
            }
        });
    };

    // setzt window.apf.assozarten und localStorage.assozartenId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowAssozarten = function (id) {
        localStorage.assozartenId = id;
        $.ajax({
            type: 'get',
            url: '/api/v1/apflora/tabelle=tblAssozArten/feld=AaId/wertNumber=' + localStorage.assozartenId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data) {
                // assozarten bereitstellen
                window.apf.assozarten = data;
            }
        });
    };

    // setzt window.apf.popmassnber und localStorage.popmassnberId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowPopmassnber = function (id) {
        localStorage.popmassnberId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblPopMassnBericht/feld=PopMassnBerId/wertNumber=' + id
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // popmassnber bereitstellen
                window.apf.popmassnber = data[0];
            }
        });
    };

    // setzt window.apf.tpop und localStorage.tpopId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowTpop = function (id) {
        localStorage.tpopId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + localStorage.tpopId
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // tpop bereitstellen
                window.apf.tpop = data[0];
            }
        });
    };

    // setzt window.apf.popber und localStorage.popberId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowPopber = function (id) {
        localStorage.popberId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblPopBericht/feld=PopBerId/wertNumber=' + id
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // popber bereitstellen
                window.apf.popber = data[0];
            }
        });
    };

    // setzt window.apf.tpopfeldkontr und localStorage.tpopfeldkontrId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowTpopfeldkontr = function (id) {
        localStorage.tpopfeldkontrId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + id
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // tpopfeldkontr bereitstellen
                window.apf.tpopfeldkontr = data[0];
            }
        });
    };

    // setzt window.apf.tpopmassn und localStorage.tpopmassnId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowTpopmassn = function (id) {
        localStorage.tpopmassnId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + id
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // tpopmassn bereitstellen
                window.apf.tpopmassn = data[0];
            }
        });
    };

    // setzt window.apf.tpopmassnber und localStorage.tpopmassnberId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowTpopmassnber = function (id) {
        localStorage.tpopmassnberId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopMassnBerId/wertNumber=' + id
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // tpopmassnber bereitstellen
                window.apf.tpopmassnber = data[0];
            }
        });
    };

    // setzt window.apf.tpopber und localStorage.tpopberId
    // wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
    window.apf.setzeWindowTpopber = function (id) {
        localStorage.tpopberId = id;
        $.ajax({
            type: 'get',
            url: 'api/v1/apflora/tabelle=tblTeilPopBericht/feld=TPopBerId/wertNumber=' + id
        }).done(function (data) {
            // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
            if (data && data[0]) {
                // tpopber bereitstellen
                window.apf.tpopber = data[0];
            }
        });
    };

    window.apf.initiiereExporte = function (anchor) {
        var zeigeFormular = require('./zeigeFormular');
        $("#testart_div").hide();
        $("#forms_titelzeile").hide();
        zeigeFormular("exporte");
        history.pushState(null, null, "index.html?exporte=true");
        if (anchor) {
            location.hash = "#" + anchor;
        }
    };

    // leert alle Felder und stellt ihre Breite ein
    window.apf.leereFelderVonFormular = function (Formular) {
        $('#' + Formular).find('input[type="text"]').each(function () {
            $(this).val("");
        });
        $('#' + Formular).find('input[type="radio"]:checked').each(function () {
            $(this).prop('checked', false);
        });
        $('#' + Formular).find('select').each(function () {
            $(this).val("");
        });
    };

    // begrenzt die maximale Höhe des Baums auf die Seitenhöhe, wenn nötig
    window.apf.setzeTreehoehe = function () {
        if ($(window).width() > 1000) {
            if (($(".jstree-no-icons").height() + 157) > $(window).height()) {
                $("#tree").css("max-height", $(window).height() - 139);
            }
        } else {
            // Spalten sind untereinander. Baum 75px weniger hoch, damit Formulare immer erreicht werden können
            if (($(".jstree-no-icons").height() + 157) > $(window).height() - 75) {
                $("#tree").css("max-height", $(window).height() - 220);
            }
        }
    };

    window.apf.berechneOlmapLayertreeMaxhoehe = function () {
        var lytMaxHeight;
        if ($(window).width() > 1000) {
            lytMaxHeight = $(window).height() - 115;
        } else {
            // Spalten sind untereinander
            lytMaxHeight = 200;
        }
        return lytMaxHeight;
    };

    (function ($) {
        $.fn.hasScrollBar = function () {
            return this.get(0).scrollHeight > this.height();
        };
    })(jQuery);

    // übernimmt einen node
    // zählt dessen children und passt die Beschriftung an
    window.apf.beschrifteOrdner = function (node) {
        var anz,
            anzTxt,
            nodeTyp = node.attr('typ');

        console.log(nodeTyp);

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

    (function ($) {
        // friendly helper //tinyurl.com/6aow6yn
        // Läuft durch alle Felder im Formular
        // Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
        // nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
        $.fn.serializeObject = function () {
            var o, a;
            o = {};
            a = this.serializeArray();
            $.each(a, function () {
                if (this.value) {
                    if (o[this.name]) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value);
                    } else {
                        o[this.name] = this.value;
                    }
                }
            });
            return o;
        };
    })(jQuery);

    window.apf.olmap.getLayerNames = function () {
        var layerObjektArray = window.apf.olmap.map.getLayers().getArray(),
            layers = _.map(layerObjektArray, function (layerObjekt) {
                if (layerObjekt.values_ && layerObjekt.values_.title) {
                    return layerObjekt.values_.title;
                }
            });
        return layers;
    };

    window.apf.olmap.getLayersWithTitle = function () {
        var layersArray = window.apf.olmap.map.getLayers().getArray(),
            layers = _.map(layersArray, function (layer) {
                if (layer.get('title')) {
                    return layer;
                }
            });
        return layers || [];
    };

    window.apf.olmap.entferneModifyInteractionFuerTpop = function () {
        if (window.apf.olmap.modifyInteraction) {
            window.apf.olmap.map.removeInteraction(window.apf.olmap.modifyInteraction);
            delete window.apf.olmap.modifyInteraction;
        }
    };

    window.apf.download = function (filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
    };

    // dieser Funktion kann man einen Wert zum speichern übergeben
    window.apf.speichereWert = function (tabelle, id, feld, wert) {
        var melde = require('./melde');

        $.ajax({
            type: 'post',
            url: 'php/' + tabelle + '_update.php',
            data: {
                "id": id,
                "Feld": feld,
                "Wert": wert,
                "user": sessionStorage.user
            }
        }).fail(function () {
            melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
        });
    };

    // sucht features an einem Ort in der Karte
    window.apf.olmap.sucheFeatures = function (pixel) {
        var features = [];
        window.apf.olmap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            features.push(feature);
        });
        return features;
    };


    // ermöglicht es, nach dem toolip zu sortieren
    window.apf.vergleicheTPopZumSortierenNachTooltip = function (a, b) {
        if (a.tooltip < b.tooltip) { return -1; }
        if (a.tooltip > b.tooltip) { return 1; }
        return 0;
    };

    window.apf.erstelleTPopNrLabel = function (popnr, tpopnr) {
        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        popnr  = popnr  || '?';
        tpopnr = tpopnr || '?';
        return popnr + '/' + tpopnr;
    };

    // GoogleMap: alle Marker löschen
    // benutzt wo in GoogleMaps Marker gesetzt und verschoben werden
    window.apf.gmap.clearMarkers = function () {
        _.each(window.apf.gmap.markersArray, function (marker) {
            marker.setMap(null);
        });
    };

    // GoogleMap: alle InfoWindows löschen
    // benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
    window.apf.gmap.clearInfoWindows = function () {
        _.each(window.apf.gmap.infoWindowArray, function (info_window) {
            info_window.setMap(null);
        });
    };

    window.apf.oeffneTPop = function (tpopId) {
        localStorage.tpopId = tpopId;
        $.jstree._reference("[typ='tpop']#" + tpopId).deselect_all();
        $("#tree").jstree("select_node", "[typ='tpop']#" + tpopId);
    };

    window.apf.oeffneTPopInNeuemTab = function (tpopId) {
        window.open("index.html?ap=" + localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + tpopId, "_blank");
    };

    window.apf.oeffnePop = function (popId) {
        localStorage.popId = popId;
        $.jstree._reference("[typ='pop']#" + popId).deselect_all();
        $("#tree").jstree("select_node", "[typ='pop']#" + popId);
    };

    window.apf.oeffnePopInNeuemTab = function (popId) {
        window.open("index.html?ap=" + localStorage.apId + "&pop=" + popId, "_blank");
    };

    window.apf.oeffneBeob = function (beob) {
        var initiiereBeob = require('./initiiereBeob'),
            beobStatus,
            beobTyp;

        beobStatus = (beob.BeobNichtZuordnen ? 'nicht_zuzuordnen' : 'nicht_beurteilt');
        beobTyp = (isNaN(beob.NO_NOTE) ? 'evab' : 'infospezies');

        localStorage.beobtyp = beobTyp;
        initiiereBeob(beobTyp, beob.NO_NOTE, beobStatus);
    };

    window.apf.oeffneBeobInNeuemTab = function (beob) {
        var beobStatus = (beob.BeobNichtZuordnen ? 'beobNichtZuzuordnen' : 'beobNichtBeurteilt');
        window.open("index.html?ap=" + localStorage.apId + "&" + beobStatus + "=" + beob.NO_NOTE, "_blank");
    };

    window.apf.oeffneTPopBeob = function (beobId) {
        localStorage.beobId = beobId;
        $.jstree._reference("[typ='beobZugeordnet']#beob" + beobId).deselect_all();
        $("#tree").jstree("select_node", "[typ='beobZugeordnet']#beob" + beobId);
    };

    window.apf.oeffneTPopBeobInNeuemTab = function (beobId) {
        window.open("index.html?ap=" + localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + localStorage.tpopId + "&beobNichtBeurteilt=" + beobId, "_blank");
    };


    /*! Copyright (c) 2011 Brandon Aaron (//brandonaaron.net)
     * Licensed under the MIT License (LICENSE.txt).
     *
     * Thanks to: //adomas.org/javascript-mouse-wheel/ for some pointers.
     * Thanks to: Mathias Bank(//www.mathias-bank.de) for a scope bug fix.
     * Thanks to: Seamus Leahy for adding deltaX and deltaY
     *
     * Version: 3.0.6
     * 
     * Requires: 1.2.2+
     *
     * Benutzt, um Mouswheel-Scrollen abzufangen und den event zu verhindern (unbeabsichtigte Änderung von Zahlen in number-Feldern verhindern)
     *
     */

    (function ($) {

        var types = ['DOMMouseScroll', 'mousewheel'];

        if ($.event.fixHooks) {
            for ( var i=types.length; i; ) {
                $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
            }
        }

        $.event.special.mousewheel = {
            setup: function () {
                if ( this.addEventListener ) {
                    for ( var i=types.length; i; ) {
                        this.addEventListener( types[--i], handler, false );
                    }
                } else {
                    this.onmousewheel = handler;
                }
            },
            
            teardown: function () {
                if ( this.removeEventListener ) {
                    for ( var i=types.length; i; ) {
                        this.removeEventListener( types[--i], handler, false );
                    }
                } else {
                    this.onmousewheel = null;
                }
            }
        };

        $.fn.extend({
            mousewheel: function (fn) {
                return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
            },
            
            unmousewheel: function (fn) {
                return this.unbind("mousewheel", fn);
            }
        });


        function handler(event) {
            var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
            event = $.event.fix(orgEvent);
            event.type = "mousewheel";
            
            // Old school scrollwheel delta
            if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
            if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
            
            // New school multidimensional scroll (touchpads) deltas
            deltaY = delta;
            
            // Gecko
            if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
                deltaY = 0;
                deltaX = -1*delta;
            }
            
            // Webkit
            if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
            if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
            
            // Add event and delta to the front of the arguments
            args.unshift(event, delta, deltaX, deltaY);
            
            return ($.event.dispatch || $.event.handle).apply(this, args);
        }

    })(jQuery);

    window.apf.olmap.getSelectedFeatures = function () {
        if (window.apf.olmap.map.olmapSelectInteraction) {
            return window.apf.olmap.map.olmapSelectInteraction.getFeatures().getArray();
        }
        return [];
    };

    window.apf.olmap.getSelectedFeaturesOfType = function (type) {
        var features_array = window.apf.olmap.getSelectedFeatures(),
            return_array = [],
            feature_type;
        if (features_array.length === 0) {
            return [];
        }
        _.each(features_array, function (feature) {
            feature_type = feature.get('myTyp');
            if (feature_type === type) {
                return_array.push(feature);
            }
        });
        return return_array;
    };

    window.apf.olmap.removeDragBox = function () {
        if (window.apf.olmap.dragBoxInteraction) {
            window.apf.olmap.map.removeInteraction(window.apf.olmap.dragBoxInteraction);
            //window.apf.olmap.dragBoxInteraction.off('boxend');
            delete window.apf.olmap.dragBoxInteraction;
        }
    };

    window.apf.olmap.addShowFeatureInfoOnClick = function () {
        window.apf.olmap.map.on('singleclick', function (event) {
            var pixel = event.pixel,
                coordinate = event.coordinate,
                zeigeFeatureInfo = require('./olmap/zeigeFeatureInfo');
            // nur machen, wenn nicht selektiert wird
            if (!window.apf.olmap.map.olmapSelectInteraction) {
                zeigeFeatureInfo(pixel, coordinate);
            }
            // prüfen, ob pop / tpop gewählt wurden
            // verzögern, weil die neuste selection sonst nicht erfasst wird
            setTimeout(function () {
                window.apf.olmap.pruefeObPopTpopGewaehltWurden();
            }, 100);
        });
    };

    window.apf.olmap.pruefeObPopTpopGewaehltWurden = function () {
        var popSelected = [],
            tpopSelected = [],
            erstelleListeDerAusgewaehltenPopTPop = require('./erstelleListeDerAusgewaehltenPopTPop');

        // prüfen, ob pop / tpop gewählt wurden
        popSelected = window.apf.olmap.getSelectedFeaturesOfType('pop');
        tpopSelected = window.apf.olmap.getSelectedFeaturesOfType('tpop');

        // wenn ja: anzeigen
        if (popSelected.length > 0 || tpopSelected.length > 0) {
            erstelleListeDerAusgewaehltenPopTPop(popSelected, tpopSelected);
        } else {
            $("#ergebnisAuswahl").hide();
        }
    };

    window.apf.olmap.changeCursorOverFeature = function () {
        $(window.apf.olmap.map.getViewport()).on('mousemove', function (e) {
            var pixel = window.apf.olmap.map.getEventPixel(e.originalEvent),
                hit = window.apf.olmap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                    return true;
                });
            if (hit) {
                $('#ga_karten_div').css('cursor', 'pointer');
            } else {
                $('#ga_karten_div').css('cursor', '');
            }
        });
    };

    window.apf.olmap.addMousePositionControl = function () {
        var mousePositionControl = new ol.control.MousePosition({
            //This is the format we want the coordinate in
            //The number argument in createStringXY is the number of decimal places
            coordinateFormat: ol.coordinate.createStringXY(0),
            projection: "EPSG:21781",
            undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate
        });
        window.apf.olmap.map.addControl(mousePositionControl);
    };

    window.apf.olmap.addFullScreenControl = function () {
        var myFullScreenControl = new ol.control.FullScreen();
        window.apf.olmap.map.addControl(myFullScreenControl);
        // auf Deutsch beschriften
        $('#ga_karten_div').find('.ol-full-screen').find('span[role="tooltip"]').html('Vollbild wechseln');
    };

    window.apf.olmap.nenneEbeneUm = function (layer, title) {
        var initiiereLayertree              = require('./olmap/initiiereLayertree'),
            aktualisiereEbeneInLocalStorage = require('./olmap/aktualisiereEbeneInLocalStorage');
        layer.set('title', title);
        initiiereLayertree('Eigene Ebenen');
        // layer in localStorage speichern
        aktualisiereEbeneInLocalStorage(layer);
    };

    // wird in index.html verwendet
    window.apf.oeffneFormularAlsPopup = function (formularname, id) {
        require('./oeffneFormularAlsPopup')(formularname, id);
    };

    window.apf.olmap.detailplanStyle = function (feature, resolution) {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(250, 58, 15, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: '#fa3a0f',
                width: 1
            })
        });
    };

    window.apf.olmap.detailplanStyleSelected = function (feature, resolution) {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(15, 85, 250, 0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: '#0F55FA',
                width: 1
            })
        });
    };

    window.apf.olmap.messe = function (element) {
        var addMeasureInteraction = require('./olmap/addMeasureInteraction'),
            deactivateMenuItems   = require('./olmap/deactivateMenuItems');
        deactivateMenuItems();
        if (element.value === 'line' && element.checked) {
            addMeasureInteraction('LineString');
        } else if (element.value === 'polygon' && element.checked) {
            addMeasureInteraction('Polygon');
        } else {
            // es wurde 'infos abfragen geklickt'
            window.apf.olmap.removeMeasureInteraction();
        }
    };

    window.apf.olmap.removeMeasureInteraction = function () {
        var entferneLayerNachName = require('./olmap/entferneLayerNachName');

        entferneLayerNachName('messen');
        window.apf.olmap.map.removeInteraction(window.apf.olmap.drawMeasure);
        delete window.apf.olmap.drawMeasure;
        $("#ergebnisMessung").text("");
        $(window.apf.olmap.map.getViewport()).off('mousemove');
    };

    /**
     * format length output
     * @param {ol.geom.LineString} line
     * @return {string}
    */
    window.apf.olmap.formatLength = function (line) {
        var length = Math.round(line.getLength() * 100) / 100,
            output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) + ' km';
        } else {
            output = (Math.round(length * 100) / 100) + ' m';
        }
        return output;
    };

    /**
     * format length output
     * @param {ol.geom.Polygon} polygon
     * @return {string}
    */
    window.apf.olmap.formatArea = function (polygon) {
        var area = polygon.getArea(),
            output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
        }
        return output;
    };

    window.apf.olmap.waehleAus = function () {
        var deactivateMenuItems                 = require('./olmap/deactivateMenuItems'),
            addSelectFeaturesInSelectableLayers = require('./olmap/addSelectFeaturesInSelectableLayers');

        deactivateMenuItems();
        addSelectFeaturesInSelectableLayers();
    };

    window.apf.olmap.schliesseLayeroptionen = function () {
        $("#olmap_layertree").accordion("option", "active", false);
    };

    // erwartet aktuelle Werte für jahr und typ
    // erstellt den label für den Baum
    window.apf.erstelleLabelFuerFeldkontrolle = function (jahr, typ) {
        if (typeof jahr === "undefined") {
            jahr = "(kein Jahr)";
        }
        if (typeof typ === "undefined") {
            typ = "(kein Typ)";
        }
        return jahr + ": " + typ;
    };

    // erwartet aktuelle Werte für jahr und beurteilung
    // erstellt den label für den Baum
    window.apf.erstelleLabelFuerMassnahme = function (jahr, beurteilung) {
        if (typeof jahr === "undefined") {
            jahr = "(kein Jahr)";
        }
        if (typeof beurteilung === "undefined") {
            beurteilung = "(keine Beurteilung)";
        }
        return jahr + ": " + beurteilung;
    };

    // damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
    // Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
    (function ($) {
        $.fn.extend( {
            limiter: function (limit, elem) {
                $(this).on("keyup focus", function () {
                    setCount(this, elem);
                });
                function setCount(src, elem) {
                    var chars = src.value.length;
                    if (chars > limit) {
                        src.value = src.value.substr(0, limit);
                        chars = limit;
                    }
                    elem.html(limit - chars);
                }
                setCount($(this)[0], elem);
            }
        });
    })(jQuery);

    // erstellt einen guid
    // Quelle: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    window.apf.erstelleGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
};