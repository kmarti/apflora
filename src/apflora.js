/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                         = require('jquery'),
    _                         = require('underscore'),
    createGlobals             = require('./modules/createGlobals'),
    clearLocalStorage         = require('./modules/clearLocalStorage'),
    erstelleGemeindeliste     = require('./modules/erstelleGemeindeliste'),
    erstelleArtlisten         = require('./modules/erstelleArtlisten'),
    waehleApliste             = require('./modules/waehleApliste'),
    oeffneUri                 = require('./modules/oeffneUri'),
    setupEvents               = require('./modules/setupEvents'),
    pruefeLesevoraussetzungen = require('./modules/pruefeLesevoraussetzungen'),
    preventMousescrollEvent   = require('./lib/preventMousescrollEvent');

// benötigte globale Variabeln initialisieren
window.apf       = window.apf       || {};
window.apf.gMap  = window.apf.gMap  || {};
window.apf.olMap = window.apf.olMap || {};

// initiiereApp als globale Variable bereitstellen,
// damit es wenn nötig später wieder aufgerufen werden kann
// apflora.js kann den anderen Modulen nicht als browserify-Modul bereitgestellt werden,
// weil es die Quelle der Modularisierung ist
window.apf.initiiereApp = function () {
    createGlobals();

    // dataType ist immer json
    // Bei jedem Lesezugriff soll geprüft werden, ob alle Voraussetzungen erfüllt sind
    // v.a., ob der User online ist
    $.ajaxSetup({
        dataType: 'json',
        beforeSend: function () {
            if (!pruefeLesevoraussetzungen()) {
                return false;
            }
        }
    });

    // localStorage ausräumen
    clearLocalStorage();

    // Gemeindeliste erstellen (wenn nötig)
    erstelleGemeindeliste();

    // Auswahllisten aufbauen
    erstelleArtlisten();

    // HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
    $.when(waehleApliste('programm_alle')).then(function () {
        // falls eine Unteradresse angewählt wurde, diese öffnen
        oeffneUri();
    });

    // für index.html bereitstellen
    // damit es garantiert nur ein mal ausgeführt wird
    window.apf.setupEvents = function () {
        setupEvents();
    };

    preventMousescrollEvent($);
};

// gleich ein mal ausführen
window.apf.initiiereApp();