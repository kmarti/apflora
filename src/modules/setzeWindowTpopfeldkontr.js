// setzt window.apf.tpopfeldkontr und localStorage.tpopfeldkontrId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.tpopfeldkontrId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPopKontr/feld=TPopKontrId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopfeldkontr bereitstellen
            window.apf.tpopfeldkontr = data[0];
        }
    });
};