// setzt window.apf.tpopmassn und localStorage.tpopmassnId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (id) {
    localStorage.tpopmassnId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTPopMassn/feld=TPopMassnId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopmassn bereitstellen
            window.apf.tpopmassn = data[0];
        }
    });
};