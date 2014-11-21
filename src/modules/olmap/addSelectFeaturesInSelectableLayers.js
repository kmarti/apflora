/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var ol = require('ol');

module.exports = function () {
    var addDragBoxForPopTpop = require('./addDragBoxForPopTpop'),
        stylePop             = require('./stylePop'),
        styleTPop            = require('./styleTPop');

    window.apf.olmap.map.olmapSelectInteraction = new ol.interaction.Select({
        layers: function (layer) {
            return layer.get('selectable') === true;
        },
        style: function (feature, resolution) {
            switch (feature.get('myTyp')) {
            case 'pop':
                return stylePop(feature, resolution, true);
            case 'tpop':
                return styleTPop(feature, resolution, true);
            case 'Detailplan':
                return window.apf.olmap.detailplanStyleSelected(feature, resolution);
            }
        }
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.map.olmapSelectInteraction);
    // man soll auch mit dragbox selecten können
    addDragBoxForPopTpop();
};