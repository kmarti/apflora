/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    if ($('#beobNichtZuordnen').prop('checked') === true) {
        // node verschieben. Der Rest wird vom Callback fon jstree.move_node erledigt
        $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#apOrdnerBeobNichtZuzuordnen' + localStorage.apId, 'first');
    } else {
        // node verschieben. Den Rest macht der callback zu jstree.move_node
        $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#apOrdnerBeobNichtBeurteilt' + localStorage.apId, 'first');
    }
};