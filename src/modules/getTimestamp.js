/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var dateFormat = require('dateformat');

module.exports = function () {
    var now = new Date();
    return dateFormat(now, 'yyyy-mm-dd_hh-MM:ss');
};