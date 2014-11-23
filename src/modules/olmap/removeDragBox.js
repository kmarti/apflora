/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (window.apf.olMap.dragBoxInteraction) {
        window.apf.olMap.map.removeInteraction(window.apf.olMap.dragBoxInteraction);
        //window.apf.olMap.dragBoxInteraction.off('boxend');
        delete window.apf.olMap.dragBoxInteraction;
    }
};