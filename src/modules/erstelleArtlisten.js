/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

// übernimmt $ wegen jquery ui
module.exports = function () {
    var $AaSisfNr = $('#AaSisfNr');

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
                    $AaSisfNr
                        .val(ui.item.id)
                        .trigger('change');
                    return false;
                },
                change: function (event, ui) {
                    if (!ui.item) {
                        // kein zulässiger Eintrag > Feld leeren
                        $(this).val('');
                        $AaSisfNr.val('');
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
                }
            });
        });
    }
};