/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    var tpopId = $(this).val();
    $('#tree').jstree('move_node', '#beob' + localStorage.beobId, '#tpopOrdnerBeobZugeordnet' + tpopId, 'first');
};