/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                     = require('jquery'),
    _                     = require('underscore'),
    clearLocalStorage     = require('./modules/clearLocalStorage'),
    erstelleArtlisten     = require('./modules/erstelleArtlisten'),
    waehleApliste         = require('./modules/waehleApliste'),
    speichern             = require('./modules/speichern'),
    oeffneUri             = require('./modules/oeffneUri'),
    setupEvents           = require('./modules/setupEvents'),
    erstelleGemeindeliste = require('./modules/erstelleGemeindeliste'),
    createGlobals         = require('./modules/createGlobals');

// benötigte globale Variabeln initialisieren
window.apf       = window.apf       || {};
window.apf.gmap  = window.apf.gmap  || {};
window.apf.olmap = window.apf.olmap || {};

window.apf.initiiereApp = function () {
    createGlobals();

    // dataType ist immer json
    // Bei jedem Lesezugriff soll geprüft werden, ob alle Voraussetzungen erfüllt sind
    // v.a., ob der User online ist
    $.ajaxSetup({
        dataType: 'json',
        beforeSend: function () {
            if (!window.apf.pruefeLesevoraussetzungen()) {
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
};

window.apf.initiiereApp();