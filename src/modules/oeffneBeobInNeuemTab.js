/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (beob) {
    var beobStatus = (beob.beobNichtZuordnen ? 'beobNichtZuzuordnen' : 'beobNichtBeurteilt');
    window.open("index.html?ap=" + localStorage.apId + "&" + beobStatus + "=" + beob.NO_NOTE, "_blank");
};