/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    var $beobNichtBeurteilt = $('#beobNichtBeurteilt');
    if ($beobNichtBeurteilt.prop('checked') === true) {
        // node verschieben. Den rest macht der callback zu jstree.move_node
        $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#apOrdnerBeobNichtBeurteilt' + localStorage.apId, 'first');
    } else {
        // es bringt nichts, diesen Haken zu entfernen
        // stattdessen soll ein anderer Wert gewählt werden
        $beobNichtBeurteilt.prop('checked', true);
    }
};