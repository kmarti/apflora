// diese Einstellungen funktionieren nur, wenn sie von index.html direkt ausgelöst werden
// ursprünglich waren sie in index.html selber enthalten
// es klappt aber auch, wenn index.html sie via globale Variable aufruft

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $         = require('jquery'),
    speichern = require('./speichern');

module.exports = function () {
    // jQuery ui widgets initiieren
    // aus unerfindlichem Grund muss das in index.html passieren. Schade
    $("#programmWahl").buttonset({
        create: function () {
            // erst jetzt einblenden, weil sonst die normalen checkboxen aufblitzen
            $("#programmWahl").show();
        }
    });
    $("#olMapMessen").buttonset();
    $("button").button();
    $("input[type='button']").button();
    $("#tpopfeldkontr_tabs").tabs();

    // tooltip: Klasse zuweisen, damit gestylt werden kann
    $("#label_olmap_infos_abfragen, #label_olmap_distanz_messen, #label_olmap_flaeche_messen, #label_olmap_auswaehlen, #olMapExportierenDiv, .apfTooltip").tooltip({
        tooltipClass: "tooltip-styling-hinterlegt",
        content: function () {
            return $(this).attr('title');
        }
    });

    $(".exportAbschnitt").tooltip({
        tooltipClass: "export_abschnitt_tooltip_class",
        content: function () {
            return $(this).attr('title');
        }
    });

    $('#olMapExportieren').button({
        icons: {
            primary: "ui-icon-circle-arrow-s"
        },
        text: false,
        disabled: true
    });

    // Datumsfelder: Widget initiieren
    var monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        wochentageKurz = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        wochentageLang = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

    $.datepicker.setDefaults({
        buttonImage:     "style/images/calendar.gif",
        buttonImageOnly: true,
        dateFormat:      "dd.mm.yy",
        altFormat:       "dd.mm.yy",
        monthNames:      monate,
        dayNamesMin:     wochentageKurz,
        dayNames:        wochentageLang,
        firstDay:        1,
        showOn:          "button",
        defaultDate:     +0,
        onSelect: function () {
            $(this).trigger('change');
        }
    });

    // datepicker nur initialisieren, wenn der Browser keinen eigenen hat (z.B. Chrome)
    if (!window.apf.isDateSupported()) {
        $("#TPopKontrDatum, #TPopMassnDatum, #JBerDatum, #IbErstelldatum").datepicker();
    }

    $('.apf-with-tooltip')
        .each(function () {
            $(this).qtip({
                content: {
                    text:  $(this).next('.tooltiptext'),
                    title: 'Legende'
                },
                style: {
                    // Use the jQuery UI widget classes
                    widget: true,
                    // Remove the default styling
                    def: false,
                    tip: false
                },
                position: {
                    my:       'top right',
                    at:       'bottom right',
                    target:   $(this),
                    viewport: $(window)
                }
            });
        })
        .qtip({
            events: {
                render: function (event, api) {
                    api.elements.wrapper.addClass('ui-corner-all');
                }
            }
        });
};