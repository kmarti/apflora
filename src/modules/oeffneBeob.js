/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (beob) {
    var initiiereBeob = require('./initiiereBeob'),
        beobStatus,
        beobTyp;

    beobStatus = (beob.BeobNichtZuordnen ? 'nicht_zuzuordnen' : 'nicht_beurteilt');
    beobTyp    = (isNaN(beob.NO_NOTE)    ? 'evab'             : 'infospezies');

    localStorage.beobtyp = beobTyp;
    initiiereBeob(beobTyp, beob.NO_NOTE, beobStatus);
};