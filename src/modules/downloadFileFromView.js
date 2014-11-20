// löst einen Download aus
// als Formate steht momentan nur csv (und teilweise kml) zur Verfügung, weil xlsx leider nicht funktioniert hat

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                  = require('jquery'),
    saveAs             = require('saveAs'),
    getTimestamp       = require('./getTimestamp'),
    createBlobDataXlsx = require('./createBlobDataXlsx');

module.exports = function (view, filename, format) {
    var url,
        blob,
        blobData;

    format = format || 'csv';

    if (format === 'xlsx') {
        // Daten als json holen
        // TODO: wird als text/html geholt!!!????
        $.ajax({
            /*beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
            },*/
            type: 'get',
            url: 'api/v1/exportView/xlsx/view=' + view,
            //contentType: "application/json",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json",
                "Accept":       "application/json"
            }
        }).done(function (data) {
            // als Blob verpacken und downloaden
            blobData = createBlobDataXlsx(data);
            blob     = new Blob([blobData], {type: "application/octet-stream;charset=utf-8;"});
            saveAs(blob, filename + "_" + getTimestamp() + '.xlsx');
        });
    } else {
        url = 'api/v1/exportView/' + format + '/view=' + view + '/filename=' + filename + '_' + getTimestamp();
        $.fileDownload(url, {
            preparingMessageHtml: "Der Download wird vorbereitet, bitte warten...",
            failMessageHtml: "Beim Aufbereiten des Downloads ist ein Problem aufgetreten, bitte nochmals versuchen."
        });
    }
};