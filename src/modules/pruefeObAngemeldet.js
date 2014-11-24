/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $               = require('jquery'),
    pruefeAnmeldung = require('./pruefeAnmeldung');

module.exports = function () {
    var $Useranmeldung = $("#anmeldeDialog").dialog({
        autoOpen:      false,
        height:        320,
        width:         310,
        modal:         true,
        closeOnEscape: false,
        buttons: {
            "anmelden": function () {
                pruefeAnmeldung();
            }
        },
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog).hide();
            //Reaktion auf Enter-Taste in anmeldeDialog
            $("#anmeldeDialog").on("keydown", function (e) {
                if (e.keyCode == $.ui.keyCode.ENTER) {
                    pruefeAnmeldung();
                }
            });
        }
    });

    if (!sessionStorage.user) {
        $Useranmeldung.dialog("open");
    }
};