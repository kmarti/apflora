// setzt window.apf.idealbiotop und localStorage.idealbiotopId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.idealbiotopId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblIdealbiotop/feld=IbApArtId/wertNumber=' + localStorage.idealbiotopId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // idealbiotop bereitstellen
            window.apf.idealbiotop = data[0];
        }
    });
};