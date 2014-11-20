/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $     = require('jquery'),
    ol    = require('ol'),
    melde = require('../melde');

var returnFunction = function (clickEvent) {
    var exportPNGElement = document.getElementById('olmap_exportieren'),
        info;

    if ('download' in exportPNGElement) {
        exportPNGElement.addEventListener('click', function (e) {
            window.apf.olmap.map.once('postcompose', function (clickEvent) {
                var canvas = clickEvent.context.canvas;
                exportPNGElement.href = canvas.toDataURL('image/png');
            });
            window.apf.olmap.map.renderSync();
        }, false);
        if (!window.apf.olmap.recentlyClicked) {
            // beim ersten mal soll der Event gleich wiederholt werden
            window.apf.olmap.recentlyClicked = true;
            // warten, sonst kommen zwei Downloads
            setTimeout(function () {
                exportPNGElement.click();
            }, 200);
        }
    } else {
        info = 'Der Download ist nur möglich, wenn Ihr Browser das moderne Download-Attribut unterstützt <a href="http://caniuse.com/#feat=download">(hier eine aktuelle Liste der unterstützenden Browser)</a>';
        melde(info, "Export abgebrochen");
    }
};

module.exports = returnFunction;