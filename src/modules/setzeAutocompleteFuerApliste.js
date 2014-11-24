/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function (programm) {
    $("#apWaehlenText").autocomplete({
        minLength: 0,
        delay: 500,
        source: window.apf.apliste[programm],
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $("#apWaehlen")
                .val(ui.item.id)
                .trigger('change');
            return false;
        },
        change: function (event, ui) {
            // sicherstellen, dass nur Werte aus der Liste gewählt werden können
            var textPasstZuId = true,
                id = $("#apWaehlen").val(),
                text;

            if (id) {
                text = _.find(window.apf.apliste.programmAlle, function (art) {
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
                $(this).val(text.label);
            }
        }
    });
};