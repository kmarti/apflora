/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                   = require('underscore'),
    getSelectedFeatures = require('./getSelectedFeatures');

module.exports = function (type) {
    var featuresArray = getSelectedFeatures(),
        returnArray = [],
        featureType;

    if (featuresArray.length === 0) {
        return [];
    }
    _.each(featuresArray, function (feature) {
        featureType = feature.get('myTyp');
        if (featureType === type) {
            returnArray.push(feature);
        }
    });
    return returnArray;
};