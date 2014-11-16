// Formulare als dialog öffnen
// braucht die id des Formulars
// und die id des Datensatzes, der anzuzeigen ist

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (formularname, id) {
    var $formularname = $('#' + formularname),
        title;

    // id setzen
    localStorage[formularname + 'Id'] = id;

    // titel bestimmen
    switch (formularname) {
    case 'pop':
        title = 'Population';
        // formular initiieren, ohne anzuzeigen
        require('./initiierePop')(null, id, true);
        break;
    case 'tpop':
        title = 'Teilpopulation';
        // formular initiieren, ohne anzuzeigen
        require('./initiiereTpop')(null, null, id, true);
        break;
    case 'beob':
        title = 'Beobachtung';
        // formular initiieren, ohne anzuzeigen
        require('./initiiereBeob')('beob_nicht_beurteilt', id, 'nicht_beurteilt', true);
        break;
    default:
        title = '';
    }

    // dialog öffnen
    $formularname.dialog({
        close: function () {
            $formularname.dialog("destroy");
        },
          //height: 600,
        width: 600,
        maxHeight: $('#menu').height(),
        resizable: true,
        position: {
            my: 'left top',
            at: 'left top',
            of: $('#menu')
        },
        title: title
    });
    $formularname.dialog("open");
};