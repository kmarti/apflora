/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (window.apf.olmap.dragBoxInteraction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.dragBoxInteraction);
        //window.apf.olmap.dragBoxInteraction.off('boxend');
        delete window.apf.olmap.dragBoxInteraction;
    }
};