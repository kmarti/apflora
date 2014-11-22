/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (tpopId) {
    localStorage.tpopId = tpopId;
    $.jstree._reference("[typ='tpop']#" + tpopId).deselect_all();
    $("#tree").jstree("select_node", "[typ='tpop']#" + tpopId);
};