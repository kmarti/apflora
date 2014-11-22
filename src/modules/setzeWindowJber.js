// setzt window.apf.jber und localStorage.jberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.jberId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblJBer/feld=JBerId/wertNumber=' + localStorage.jberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // jber bereitstellen
            window.apf.jber = data[0];
        }
    });
};