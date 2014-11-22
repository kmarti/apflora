// setzt window.apf.ber und localStorage.berId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.berId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblBer/feld=BerId/wertNumber=' + localStorage.berId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // ber bereitstellen
            window.apf.ber = data;
        }
    });
};