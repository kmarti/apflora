/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $            = require('jquery'),
    ol           = require('ol'),
    nenneEbeneUm = require('./nenneEbeneUm');

module.exports = function (eigeneEbene) {
    var nameErfragt = $.Deferred(),
        $eigene_ebene_name = $('#eigene_ebene_name'),
        $eigene_ebene_name_container = $('#eigene_ebene_name_container');

    // eigene Ebene global speichern, damit der eventhandler darauf zugreifen kann
    window.apf.olMap.eigeneEbene = eigeneEbene;

    $eigene_ebene_name_container.dialog({
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
                    nenneEbeneUm(eigeneEbene, $eigene_ebene_name.val());
                    // Namen zurücksetzen
                    $eigene_ebene_name.val('');
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

    $eigene_ebene_name.on('keyup', function (event) {
        if (event.which == 13 && eigeneEbene) {
            // enter pressed
            // umbenennen
            nenneEbeneUm(eigeneEbene, event.target.value);
            // Namen zurücksetzen
            $eigene_ebene_name.val('');
            $('#eigene_ebene_name_container').dialog("close");
            $('#olMap').off('keyup', '#eigene_ebene_name');
            delete window.apf.olMap.eigeneEbene;
            nameErfragt.resolve();
        }
    });
    return nameErfragt.promise();
};