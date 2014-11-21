// retourniert features
// übergibt man einen Typ, werden nur features dieses Typs retourniert
// offenbar nicht benutzt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _  = require('underscore');

module.exports = function (typ) {
    var selectedFeatures = window.apf.olmap.map.olmapSelectInteraction.getFeatures().getArray(),
        featuresToReturn;
    featuresToReturn = _.filter(selectedFeatures, function (feature) {
        if (typ) {
            return feature.get('myTyp') === typ;
        }
        return feature.get('myTyp');
    });
    return featuresToReturn;
};