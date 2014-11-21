/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var initiiereLayertree              = require('./initiiereLayertree'),
    aktualisiereEbeneInLocalStorage = require('./aktualisiereEbeneInLocalStorage');

module.exports = function (layer, title) {
    layer.set('title', title);
    initiiereLayertree('Eigene Ebenen');
    // layer in localStorage speichern
    aktualisiereEbeneInLocalStorage(layer);
};