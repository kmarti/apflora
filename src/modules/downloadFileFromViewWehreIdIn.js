// löst einen Download aus
// als Formate steht momentan nur csv zur Verfügung, weil xlsx leider nicht funktioniert hat

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $            = require('jquery'),
    getTimestamp = require('./getTimestamp');

module.exports = function (view, idName, idListe, filename, format) {
    var url;

    format = format || 'csv';
    url = 'api/v1/exportViewWhereIdIn/' + format + '/view=' + view + '/idName=' + idName + '/idListe=' + idListe + '/filename=' + filename + '_' + getTimestamp();

    $.fileDownload(url, {
        preparingMessageHtml: "Der Download wird vorbereitet, bitte warten...",
        failMessageHtml:      "Beim Aufbereiten des Downloads ist ein Problem aufgetreten, bitte nochmals versuchen."
    });
};