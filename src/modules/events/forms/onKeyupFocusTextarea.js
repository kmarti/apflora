/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var fitTextareaToContent = require('../../fitTextareaToContent');

module.exports = function () {
    fitTextareaToContent(this, document.documentElement.clientHeight);
};