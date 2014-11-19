/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    var $Useranmeldung = $("#anmelde_dialog").dialog({
        autoOpen:      false,
        height:        320,
        width:         310,
        modal:         true,
        closeOnEscape: false,
        buttons: {
            "anmelden": function () {
                window.apf.pruefeAnmeldung();
            }
        },
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog).hide();
            //Reaktion auf Enter-Taste in anmelde_dialog
            $("#anmelde_dialog").on("keydown", function (e) {
                if (e.keyCode == $.ui.keyCode.ENTER) {
                    window.apf.pruefeAnmeldung();
                }
            });
        }
    });

    if (!sessionStorage.user) {
        $Useranmeldung.dialog("open");
    }
};