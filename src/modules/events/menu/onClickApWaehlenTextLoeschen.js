/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $        = require('jquery'),
    waehleAp = require('../../waehleAp');

module.exports = function () {
    waehleAp();
    $('#apWaehlenText').focus();
};