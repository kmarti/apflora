/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (beobId) {
    localStorage.beobId = beobId;
    $.jstree._reference("[typ='beobZugeordnet']#beob" + beobId).deselect_all();
    $("#tree").jstree("select_node", "[typ='beobZugeordnet']#beob" + beobId);
};