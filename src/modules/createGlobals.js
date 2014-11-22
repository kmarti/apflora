/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                  = require('underscore'),
    $                  = require('jquery'),
    pruefeObAngemeldet = require('./pruefeObAngemeldet'),
    isDateSupported    = require('./isDateSupported');

// benötigte globale Variabeln initialisieren
window.apf       = window.apf       || {};
window.apf.gmap  = window.apf.gmap  || {};
window.apf.olmap = window.apf.olmap || {};

module.exports = function () {
    // das muss aus unerfindlichem Grund direkt von index.html aus aufgerufen werden
    // sonst wirkt jquery-ui nicht
    window.apf.pruefeObAngemeldet = function () {
        pruefeObAngemeldet();
    };

    // ...und wegen oberem, muss auch diese Funktion in index.html bereit stehen
    window.apf.isDateSupported = function () {
        return isDateSupported();
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

    // wird in index.html verwendet
    window.apf.oeffneFormularAlsPopup = function (formularname, id) {
        require('./oeffneFormularAlsPopup')(formularname, id);
    };

    // wird in index.html verwendet
    window.apf.olmap.messe = function (element) {
        require('./olmap/messe')(element);
    };

    // wird in index.html verwendet
    window.apf.olmap.waehleAus = function () {
        require('./olmap/waehleAus')();
    };

    window.apf.olmap.schliesseLayeroptionen = function () {
        $("#olmap_layertree").accordion("option", "active", false);
    };
};