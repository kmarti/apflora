/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (programm) {
    $("#ap_waehlen_text").autocomplete({
        minLength: 0,
        delay: 500,
        source: window.apf.apliste[programm],
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $("#ap_waehlen")
                .val(ui.item.id)
                .trigger('change');
            return false;
        },
        change: function (event, ui) {
            // sicherstellen, dass nur Werte aus der Liste gewählt werden können
            var textPasstZuId = true,
                id = $("#ap_waehlen").val(),
                text;

            if (id) {
                text = _.find(window.apf.apliste.programm_alle, function (art) {
                    return art.id == id;
                });
                if (text && text.label) {
                    if (text.label !== $(this).val()) {
                        textPasstZuId = false;
                    }
                }
            }
            if (!textPasstZuId) {
                // kein zulässiger Eintrag > Feld wiederherstellen
                console.log('kein zulässiger Eintrag');
                $(this).val(text.label);
            }
        }
    });
};