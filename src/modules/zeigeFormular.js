// managed die Sichtbarkeit von Formularen
// wird von allen initiiere_-Funktionen verwendet
// wird ein Formularname übergeben, wird dieses Formular gezeigt
// und alle anderen ausgeblendet
// zusätzlich wird die Höhe von textinput-Feldern an den Textinhalt angepasst

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $              = require('jquery'),
    initiiereOlmap = require('./olmap/initiiereOlmap');

module.exports = function (Formularname) {
    var formularAngezeigt = $.Deferred(),
        $forms            = $("#forms"),
        $form             = $('form'),
        $testart_div      = $("#testart_div"),
        $forms_titelzeile = $("#forms_titelzeile"),
        $ap_waehlen       = $("#ap_waehlen"),
        $Formularname;

    // zuerst alle Formulare ausblenden
    $forms.hide();
    $form.each(function () {
        $(this).hide();
    });
    // Karten sind in div statt form
    $('.karte').each(function () {
        $(this).hide();
    });

    // damit kann bei Grössenänderung die Formularhöhe von Karten gemanagt werden
    window.apf.kartenhoeheManuell = false;
    // höhe von forms auf auto setzen, weil dies von den Kartenansichten verändert wird
    $forms.height('auto');
    $testart_div.hide();
    $forms_titelzeile.hide();
    // Bei Testarten Hinweis anzeigen
    if ($ap_waehlen.val()) {
        // titelzeile inline, sonst gibt es einen unschönen Abstand nach oben
        //$("#forms_titelzeile").css("display", "inline");
        $forms_titelzeile.css("display", "none");
        if ($ap_waehlen.val() <= 150 && Formularname !== "jber_uebersicht" && Formularname !== "exporte" && Formularname !== "GeoAdminKarte") {
            // titelzeile inline-block, sonst werden Tabs nach rechts verschoben
            $("#forms_titelzeile").css("display", "inline-block");
            $testart_div
                .css("color", "#03970F")
                .show()
                .html("Das ist eine Testart - hier kann man alles ausprobieren!");
        } else if ($("#ap_waehlen").val() <= 150 && Formularname === "jber_uebersicht") {
            $("#forms_titelzeile").css("display", "inline-block");
            $testart_div
                .css("color", "#DF0303")
                .show()
                .html("Vorsicht: Die Übericht ist für alle Arten, daher HIER NICHT TESTEN");
        }
    }

    if (Formularname) {
        $forms.show();
        $("#ap_loeschen").show();
        $("#exportieren_1").hide();
        if (Formularname === "google_karte" || Formularname === "GeoAdminKarte") {
            // Titelzeile entfernen
            $("#forms_titelzeile").css("display", "none");
            // höhe einstellen
            $Formularname = $("#" + Formularname);
            $Formularname.css("height", $(window).height() - 17 + "px");
            // markieren, dass die Formularhöhe anders gesetzt werden soll
            window.apf.kartenhoeheManuell = true;
            window.apf.setzeKartenhoehe();
            $Formularname.show();
            if (Formularname === "GeoAdminKarte") {
                initiiereOlmap();
            }
        } else {
            $forms.css("background-color", "#FFE");
            $form.each(function () {
                $(this).hide();
                if ($(this).attr("id") === Formularname) {
                    $(this).show();
                    $('textarea').each(function () {
                        window.apf.fitTextareaToContent(this, document.documentElement.clientHeight);
                    });
                }
            });
            $(window).scrollTop(0);
        }
        formularAngezeigt.resolve();
    }
    return formularAngezeigt.promise();
};