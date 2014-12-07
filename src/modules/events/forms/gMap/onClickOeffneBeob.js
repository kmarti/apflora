/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $          = require('jquery'),
    oeffneBeob = require('../../../oeffneBeob');

module.exports = function (event) {
    event.preventDefault();
    oeffneBeob($(this).data('beob'));
};