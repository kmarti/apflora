/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (event) {
    var layers = window.apf.olMap.map.getLayers().getArray();
    layers[event.target.value].setVisible(event.target.checked);
};