/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    if (event.keyCode === 13) {
        $('#tree').jstree('search', this.value);
    } else {
        $('#tree').jstree('clear_search');
    }
};