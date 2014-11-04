// input_div: div des Layers, das jetzt aktiviert wird

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

var returnFunction = function (input_div) {
    var $modify_layer = $('.modify_layer');
    input_div = input_div || null;
    if (window.apf.olmap.modify_interaction_für_vectorlayer) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modify_interaction_für_vectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.select_interaction_für_vectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
        delete window.apf.olmap.modify_interaction_für_vectorlayer;
        delete window.apf.olmap.select_interaction_für_vectorlayer;
        delete window.apf.olmap.draw_interaction_für_vectorlayer;
    }
    // alle buttons im layer-tool zurückstellen
    $modify_layer
        .button({
            icons: {primary: 'ui-icon-locked'},
            text: false
        })
        .button('refresh');
    // tooltip zurücksetzen
    $('.modify_layer_label')
        .attr('title', 'Ebene bearbeiten')
        .tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            content: 'Ebene bearbeiten'
        });
    // geom_select ausblenden
    $('.modify_layer_geom_type').hide();
    // übrige Layer deaktivieren
    $modify_layer.each(function () {
        // sicherstellen, dass der jetzt zu aktivierende Layer nicht deaktiviert wird
        if ($(this).prop('checked') && !$(this).is(input_div)) {
            $(this).prop("checked", false).change();
        }
    });
};

module.exports = returnFunction;