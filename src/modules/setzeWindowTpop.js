// setzt window.apf.tpop und localStorage.tpopId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.tpopId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + localStorage.tpopId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpop bereitstellen
            window.apf.tpop = data[0];
        }
    });
};