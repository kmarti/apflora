/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery'),
    _ = require('underscore');

module.exports = function () {
    // nur machen, wenn noch nicht passiert - sonst werden die html dauernd ersetzt
    if (!window.apf.artliste) {
        $.ajax({
            type: 'get',
            url: 'api/v1/artliste'
        }).done(function (data) {
            // data ist Objekt-Array
            // Felder: id, label
            // globale Variable setzen, damit initiiereAssozart sie verwenden kann
            window.apf.artliste = data;

            $("#AaSisfNrText").autocomplete({
                minLength: 0,
                delay: 500,
                source: window.apf.artliste,
                select: function (event, ui) {
                    $(this).val(ui.item.label);
                    // das versteckte Feld mit der ID nachführen
                    $('#AaSisfNr')
                        .val(ui.item.id)
                        .trigger('change');
                    return false;
                },
                change: function (event, ui) {
                    // sicherstellen, dass nur Werte aus der Liste gewählt werden können
                    var textPasstZuId = true,
                        $AaSisfNr = $('#AaSisfNr'),
                        id = $AaSisfNr.val(),
                        text;

                    if (id) {
                        text = _.find(window.apf.artliste, function (art) {
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

            $('#TPopMassnAnsiedWirtspfl').autocomplete({
                minLength: 0,
                delay: 500,
                source: window.apf.artliste,
                select: function (event, ui) {
                    $(this)
                        .val(ui.item.label)
                        .trigger('change');
                    return false;
                },
                change: function (event, ui) {
                    if (!ui.item) {
                        // kein zulässiger Eintrag > Feld leeren
                        $(this).val('');
                    }
                }
            });
        });
    }
};