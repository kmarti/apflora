/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (window.apf.olmap.modifyInteraction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modifyInteraction);
        delete window.apf.olmap.modifyInteraction;
    }
};