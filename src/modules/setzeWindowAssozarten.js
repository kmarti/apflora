// setzt window.apf.assozarten und localStorage.assozartenId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.assozartenId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblAssozArten/feld=AaId/wertNumber=' + localStorage.assozartenId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // assozarten bereitstellen
            window.apf.assozarten = data;
        }
    });
};