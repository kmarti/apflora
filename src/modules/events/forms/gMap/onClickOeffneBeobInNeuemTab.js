/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                    = require('jquery'),
    oeffneBeobInNeuemTab = require('../../../oeffneBeobInNeuemTab');

module.exports = function () {
    event.preventDefault();
    oeffneBeobInNeuemTab($(this).data('beob'));
};