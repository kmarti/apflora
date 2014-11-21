// setzt window.apf.pop und localStorage.popId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.popId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopulation/feld=PopId/wertNumber=' + localStorage.popId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // pop bereitstellen
            window.apf.pop = data[0];
        }
    });
};