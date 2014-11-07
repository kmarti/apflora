/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    ol = require('ol');

var returnFunction = function (eigeneEbene) {
    var name_erfragt = $.Deferred(),
        $eigene_ebene_name = $('#eigene_ebene_name'),
        $eigene_ebene_name_container = $('#eigene_ebene_name_container');
    // eigene Ebene global speichern, damit der eventhandler darauf zugreifen kann
    window.apf.olmap.eigene_ebene = eigeneEbene;
    $eigene_ebene_name_container
        .dialog({
            title: 'Ebene taufen',
            modal: true,
            position: {
                my: 'center',
                at: 'center',
                of: $('#ga_karten_div')
            },
            buttons: [
                {
                    text: "speichern",
                    click: function () {
                        // umbenennen
                        window.apf.olmap.nenneEbeneUm(eigeneEbene, $eigene_ebene_name.val());
                        // Namen zurücksetzen
                        $eigene_ebene_name.val('');
                        $(this).dialog("close");
                        name_erfragt.resolve();
                    }
                },
                {
                    text: "abbrechen",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        })
        .dialog('open');
    $eigene_ebene_name.on('keyup', function (event) {
        if (event.which == 13 && eigeneEbene) {
            // enter pressed
            // umbenennen
            window.apf.olmap.nenneEbeneUm(eigeneEbene, event.target.value);
            // Namen zurücksetzen
            $eigene_ebene_name.val('');
            $('#eigene_ebene_name_container').dialog("close");
            $('#GeoAdminKarte').off('keyup', '#eigene_ebene_name');
            delete window.apf.olmap.eigene_ebene;
            name_erfragt.resolve();
        }
    });
    return name_erfragt.promise();
};

module.exports = returnFunction;