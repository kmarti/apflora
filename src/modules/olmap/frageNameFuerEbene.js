/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $            = require('jquery'),
    ol           = require('ol'),
    nenneEbeneUm = require('./nenneEbeneUm');

module.exports = function (eigeneEbene) {
    var nameErfragt = $.Deferred(),
        $olMapEigeneEbeneName = $('#olMapEigeneEbeneName'),
        $olMapEigeneEbeneNameContainer = $('#olMapEigeneEbeneNameContainer');

    // eigene Ebene global speichern, damit der eventhandler darauf zugreifen kann
    window.apf.olMap.eigeneEbene = eigeneEbene;

    $olMapEigeneEbeneNameContainer.dialog({
        title: 'Ebene taufen',
        modal: true,
        position: {
            my: 'center',
            at: 'center',
            of: $('#olMapDiv')
        },
        buttons: [
            {
                text: "speichern",
                click: function () {
                    // umbenennen
                    nenneEbeneUm(eigeneEbene, $olMapEigeneEbeneName.val());
                    // Namen zurücksetzen
                    $olMapEigeneEbeneName.val('');
                    $(this).dialog("close");
                    nameErfragt.resolve();
                }
            },
            {
                text: "abbrechen",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    }).dialog('open');

    $olMapEigeneEbeneName.on('keyup', function (event) {
        if (event.which == 13 && eigeneEbene) {
            // enter pressed
            // umbenennen
            nenneEbeneUm(eigeneEbene, event.target.value);
            // Namen zurücksetzen
            $olMapEigeneEbeneName.val('');
            $('#olMapEigeneEbeneNameContainer').dialog("close");
            $('#olMap').off('keyup', '#olMapEigeneEbeneName');
            delete window.apf.olMap.eigeneEbene;
            nameErfragt.resolve();
        }
    });
    return nameErfragt.promise();
};