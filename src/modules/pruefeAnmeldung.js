/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function () {
    var $anmeldung_name = $("#anmeldung_name").val(),
        $anmeldung_passwort = $("#anmeldung_passwort").val();
    // Leserechte zurücksetzen
    delete sessionStorage.NurLesen;
    if ($anmeldung_name && $anmeldung_passwort) {
        $.ajax({
            type: 'get',
            url: 'api/v1/anmeldung/name=' + $anmeldung_name + '/pwd=' + $anmeldung_passwort
        }).done(function (data) {
            if (data && data.length > 0) {
                sessionStorage.User = $anmeldung_name;
                // wenn NurLesen, globale Variable setzen
                if (data[0].NurLesen === -1) {
                    sessionStorage.NurLesen = true;
                }
                $("#anmeldung_rueckmeldung")
                    .html("Willkommen " + $anmeldung_name)
                    .addClass("ui-state-highlight");
                setTimeout(function () {
                    $("#anmelde_dialog").dialog("close", 2000);
                    if (!$('#forms').is(':visible')) {
                        $('#ap_waehlen_text').focus();
                    }
                }, 1000);
            } else {
                $("#anmeldung_rueckmeldung")
                    .html("Anmeldung gescheitert")
                    .addClass("ui-state-highlight");
                setTimeout(function () {
                    $("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
                }, 500);
            }
        }).fail(function () {
            window.apf.melde("Anmeldung gescheitert", "Oops!");
        });
    } else {
        $("#anmeldung_rueckmeldung")
            .html("Bitte Name und Passwort ausfüllen")
            .addClass("ui-state-highlight");
        setTimeout(function () {
            $("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
        }, 500);
    }
};

module.exports = returnFunction;