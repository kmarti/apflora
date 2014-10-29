/*jslint node: true, browser: true, nomen: true */
'use strict';


var dateFormat = require('dateFormat');

var returnFunction = function () {
    var now = new Date();
    return dateFormat(now, 'yyyy-mm-dd_hh-MM:ss');
};

module.exports = returnFunction;