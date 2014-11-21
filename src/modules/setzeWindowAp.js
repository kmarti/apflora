// setzt window.apf und localStorage.apId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.apId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/ap=' + localStorage.apId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // ap bereitstellen
            window.apf.ap = data[0];
        }
    });
};