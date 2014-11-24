// managed die Sichtbarkeit von Formularen
// wird von allen initiiere_-Funktionen verwendet
// wird ein Formularname übergeben, wird dieses Formular gezeigt
// und alle anderen ausgeblendet
// zusätzlich wird die Höhe von textinput-Feldern an den Textinhalt angepasst

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                    = require('jquery'),
    initiiereOlmap       = require('./olMap/initiiereOlmap'),
    fitTextareaToContent = require('./fitTextareaToContent'),
    setzeKartenhoehe     = require('./setzeKartenhoehe');

module.exports = function (Formularname) {
    var formularAngezeigt = $.Deferred(),
        $forms            = $("#forms"),
        $form             = $('form'),
        $testartDiv       = $("#testartDiv"),
        $formsTitelzeile  = $("#formsTitelzeile"),
        $apWaehlen        = $("#apWaehlen"),
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
    $testartDiv.hide();
    $formsTitelzeile.hide();
    // Bei Testarten Hinweis anzeigen
    if ($apWaehlen.val()) {
        // titelzeile inline, sonst gibt es einen unschönen Abstand nach oben
        //$("#formsTitelzeile").css("display", "inline");
        $formsTitelzeile.css("display", "none");
        if ($apWaehlen.val() <= 150 && Formularname !== "jberUebersicht" && Formularname !== "exporte" && Formularname !== "olMap") {
            // titelzeile inline-block, sonst werden Tabs nach rechts verschoben
            $("#formsTitelzeile").css("display", "inline-block");
            $testartDiv
                .css("color", "#03970F")
                .show()
                .html("Das ist eine Testart - hier kann man alles ausprobieren!");
        } else if ($("#apWaehlen").val() <= 150 && Formularname === "jberUebersicht") {
            $("#formsTitelzeile").css("display", "inline-block");
            $testartDiv
                .css("color", "#DF0303")
                .show()
                .html("Vorsicht: Die Übericht ist für alle Arten, daher HIER NICHT TESTEN");
        }
    }

    if (Formularname) {
        $forms.show();
        $("#apLoeschen").show();
        $("#exportieren1").hide();
        if (Formularname === "gMap" || Formularname === "olMap") {
            // Titelzeile entfernen
            $("#formsTitelzeile").css("display", "none");
            // höhe einstellen
            $Formularname = $("#" + Formularname);
            $Formularname.css("height", $(window).height() - 17 + "px");
            // markieren, dass die Formularhöhe anders gesetzt werden soll
            window.apf.kartenhoeheManuell = true;
            setzeKartenhoehe();
            $Formularname.show();
            if (Formularname === "olMap") {
                initiiereOlmap();
            }
        } else {
            $forms.css("background-color", "#FFE");
            $form.each(function () {
                $(this).hide();
                if ($(this).attr("id") === Formularname) {
                    $(this).show();
                    $('textarea').each(function () {
                        fitTextareaToContent(this, document.documentElement.clientHeight);
                    });
                }
            });
            $(window).scrollTop(0);
        }
        formularAngezeigt.resolve();
    }
    return formularAngezeigt.promise();
};