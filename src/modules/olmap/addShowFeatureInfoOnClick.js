/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var zeigeFeatureInfo              = require('./zeigeFeatureInfo'),
    pruefeObPopTpopGewaehltWurden = require('./pruefeObPopTpopGewaehltWurden');

module.exports = function () {
    window.apf.olMap.map.on('singleclick', function (event) {
        var pixel      = event.pixel,
            coordinate = event.coordinate;

        // nur machen, wenn nicht selektiert wird
        if (!window.apf.olMap.map.olmapSelectInteraction) {
            zeigeFeatureInfo(pixel, coordinate);
        }
        // prüfen, ob pop / tpop gewählt wurden
        // verzögern, weil die neuste selection sonst nicht erfasst wird
        setTimeout(function () {
            pruefeObPopTpopGewaehltWurden();
        }, 100);
    });
};