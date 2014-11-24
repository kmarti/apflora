/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                             = require('underscore'),
    downloadFileFromView          = require('../../downloadFileFromView'),
    downloadFileFromViewWehreIdIn = require('../../downloadFileFromViewWehreIdIn');

module.exports = function () {
    // wenn pop ausgewählt, diese übergeben
    var popIdListe = '';
    if (window.apf.olMap.popSelected) {
        _.each(window.apf.olMap.popSelected, function (pop, index) {
            popIdListe +=  pop.get('myId');
            if (index + 1 < window.apf.olMap.popSelected.length) {
                popIdListe += ',';
            }
        });
        downloadFileFromViewWehreIdIn('vPop', 'PopId', popIdListe, 'Populationen', 'csv');
    } else {
        downloadFileFromView('vPop', 'Populationen', 'csv');
    }
    return false; // this is critical to stop the click event which will trigger a normal file download!
};