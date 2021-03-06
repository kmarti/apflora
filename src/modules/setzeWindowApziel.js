// setzt window.apf.apziel und localStorage.apzielId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.apzielId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblZiel/feld=ZielId/wertNumber=' + localStorage.apzielId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // apziel bereitstellen
            window.apf.apziel = data[0];
        }
    });
};