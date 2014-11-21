/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var deactivateMenuItems                 = require('./deactivateMenuItems'),
    addSelectFeaturesInSelectableLayers = require('./addSelectFeaturesInSelectableLayers');

module.exports = function () {
    deactivateMenuItems();
    addSelectFeaturesInSelectableLayers();
};