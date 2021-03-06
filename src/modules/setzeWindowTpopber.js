// setzt window.apf.tpopber und localStorage.tpopberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.tpopberId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPopBer/feld=TPopBerId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopber bereitstellen
            window.apf.tpopber = data[0];
        }
    });
};