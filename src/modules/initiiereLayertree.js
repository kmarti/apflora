// baut das html für den layertree auf
// Muster:
// <li><input type="checkbox" id="olmap_layertree_Ebene 1"><label for="olmap_layertree_Ebene 1">Ebene 1</label></li><hr>
// active_kategorie: der Bereich dieser Kategorie soll offen sein

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _ = require('underscore');

//require('jquery-ui');

// $ nötig wegen .selectmenu()
var returnFunction = function ($, active_kategorie) {

    console.log('initiiereLayertree: active_kategorie = ', active_kategorie);

    var layertitel,
        visible,
        kategorie,
        //html_welt_hintergrund = '<h3>Welt Hintergrund</h3><div>',
        html_ch_hintergrund = '<h3>Hintergrund</h3><div>',
        html_ch_sachinfos = '<h3>CH Sachinformationen</h3><div>',
        html_ch_biotopinv = '<h3>CH Biotopinventare</h3><div>',
        html_zh_sachinfos = '<h3>ZH Sachinformationen</h3><div>',
        html_apflora = '<h3>ZH AP Flora</h3><div>',
        html_prov,
        html,
        $olmap_layertree_layers = $('#olmap_layertree_layers'),
        $ga_karten_div_accordion = $("#ga_karten_div").find(".accordion"),
        layers = window.apf.olmap.map.getLayers().getArray(),
        html_eigene_layer_text,
        html_eigene_layer = '<hr>',
        eigene_layer_zähler = 0,
        initialize_modify_layer = false,
        active,
        export_layer_select_ids = [],
        legende,
        legende_url,
        initialize_legende = false;

    html_eigene_layer_text = '<h3>Eigene Ebenen</h3>';
    html_eigene_layer_text += '<div>';
    html_eigene_layer_text += '<p>Einfach eine der folgenden Dateitypen auf die Karte ziehen:</p>';
    html_eigene_layer_text += '<ul>';
    html_eigene_layer_text += '<li>GPX</li>';
    html_eigene_layer_text += '<li>GeoJSON</li>';
    html_eigene_layer_text += '<li>IGC</li>';
    html_eigene_layer_text += '<li>KML</li>';
    html_eigene_layer_text += '<li>TopoJSON</li>';
    html_eigene_layer_text += '</ul>';
    html_eigene_layer_text += '<div id="olmap_eigene_ebenen_beta_container">';
    html_eigene_layer_text += '<p style="font-size:10px; line-height:0.9em;">Open Layers 3 ist noch in der Beta-Phase.<br>Daher funktionieren eigene Layer nicht immer fehlerfrei.</p>';
    html_eigene_layer_text += '</div>';
    html_eigene_layer_text += '<div id="olmap_neues_layer_container">';
    html_eigene_layer_text += '<input type="checkbox" class="neues_layer" id="olmap_neues_layer">';
    html_eigene_layer_text += '<label for="olmap_neues_layer" class="neues_layer_label">neue Ebene erstellen</label>';
    html_eigene_layer_text += '</div>';

    // accordion zerstören, damit es neu aufgebaut werden kann
    // um es zu zerstören muss es initiiert sein!
    $ga_karten_div_accordion
        .accordion({collapsible:true, active: false, heightStyle: 'content'})
        .accordion("destroy");

    _.each(layers, function (layer, index) {
        layertitel = layer.get('title') || '(Ebene ohne Titel)';
        visible = layer.get('visible');
        kategorie = layer.get('kategorie');
        legende = layer.get('legende') || false;
        legende_url = layer.get('legende_url') || null;

        console.log('layertitel: ', layertitel);

        if (layertitel !== 'messen') {
            html_prov = '<li><input type="checkbox" class="olmap_layertree_checkbox" id="olmap_layertree_' + layertitel + '" value="' + index + '"';
            // sichtbare Layer sollen gecheckt sein
            if (visible) {
                html_prov += ' checked="checked"';
            }
            html_prov += '>';
            html_prov += '<label for="olmap_layertree_' + layertitel + '">' + layertitel + '</label>';
            // bei pop und tpop muss style gewählt werden können
            if (layertitel === 'Populationen') {

                console.log('Pop-Layer wird erstellt');

                html_prov += '<div class="layeroptionen">';
                html_prov += '<label for="layertree_pop_nr" class="layertree_pop_style pop_nr">Nr.</label>';
                html_prov += '<input type="checkbox" id="layertree_pop_nr" class="layertree_pop_style pop_nr" checked="checked"> ';
                html_prov += '<label for="layertree_pop_name" class="layertree_pop_style pop_name">Namen</label>';
                html_prov += '<input type="checkbox" id="layertree_pop_name" class="layertree_pop_style pop_name">';
                html_prov += '</div>';
            }
            if (layertitel === 'Teilpopulationen') {

                console.log('TPop-Layer wird erstellt');

                html_prov += '<div class="layeroptionen">';
                html_prov += '<label for="layertree_tpop_nr" class="layertree_tpop_style tpop_nr">Nr.</label>';
                html_prov += '<input type="checkbox" id="layertree_tpop_nr" class="layertree_tpop_style tpop_nr" checked="checked"> ';
                html_prov += '<label for="layertree_tpop_name" class="layertree_tpop_style tpop_name">Namen</label>';
                html_prov += '<input type="checkbox" id="layertree_tpop_name" class="layertree_tpop_style tpop_name">';
                html_prov += '</div>';
            }
            if (kategorie === 'Eigene Ebenen') {
                html_prov += '<div class="layeroptionen">';
                html_prov += '<input type="checkbox" class="modify_layer" id="modify_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="modify_layer_' + layertitel.replace(" ", "_") + '" title="Ebene bearbeiten" class="modify_layer_label"></label>';
                html_prov += '<select id="modify_layer_geom_type_' + layertitel.replace(" ", "_") + '" class="modify_layer_geom_type apf_tooltip" title="Neue Objekte zeichnen oder<br>bestehende Objekte auswählen, um sie zu verändern"><option id="modify_layer_geom_type_leerwert" value="leerwert" selected>Objekt auswählen</option><option value="Point">Punkt zeichnen</option><option value="LineString">Linie zeichnen</option><option value="Polygon">Polygon zeichnen</option></select>';
                html_prov += '<div class="non_modify_options">';
                    html_prov += '<select id="export2_layer_geom_type_' + layertitel.replace(" ", "_") + '" class="export_layer_select apf_tooltip" title="Ebene exportieren<br>Wählen Sie ein Format"><option value="leerwert" selected>exportieren</option><option value="GeoJSON">GeoJSON</option><option value="KML">KML</option><option value="GPX">GPX</option></select>';
                html_prov += '<input type="checkbox" class="rename_layer" id="rename_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="rename_layer_' + layertitel.replace(" ", "_") + '" title="Ebene umbenennen" class="rename_layer_label"></label>';
                html_prov += '<input type="checkbox" class="entferne_layer" id="entferne_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="entferne_layer_' + layertitel.replace(" ", "_") + '" title="Ebene entfernen" class="entferne_layer_label"></label>';
                html_prov += '</div>';
                html_prov += '<div id="eigene_layer_meldung_' + layertitel.replace(" ", "_") + '" class="eigene_layer_meldung"></div>';
                html_prov += '</div>';
                initialize_modify_layer = true;
                // diese ids werden gebraucht, um tooltips zu erstellen
                export_layer_select_ids.push('export2_layer_geom_type_' + layertitel.replace(" ", "_"));
            }
            if (legende && legende_url) {
                // Symbol ergänzen
                // beim hovern erscheint popup mit Legende
                html_prov += '<a class="ui-icon ui-icon-info olmap_layertreee_legende" href="' + legende_url + '" target="_blank" title="' + legende_url + '"></a>';
                initialize_legende = true;
            }
            html_prov += '</li>';
            html_prov += '<hr>';
            switch (kategorie) {
            /*case "Welt Hintergrund":
                html_welt_hintergrund += html_prov;
                break;*/
            case "Hintergrund":
                html_ch_hintergrund += html_prov;
                break;
            case "CH Sachinformationen":
                html_ch_sachinfos += html_prov;
                break;
            case "CH Biotopinventare":
                html_ch_biotopinv += html_prov;
                break;
            case "ZH Sachinformationen":
                html_zh_sachinfos += html_prov;
                break;
            case "AP Flora":
                html_apflora += html_prov;
                break;
            case "Eigene Ebenen":
                html_eigene_layer += html_prov;
                eigene_layer_zähler++;
                break;
            default:
                //html_eigene_layer += html_prov;
                //eigene_layer_zähler++;
                break;
            }
        }
    });

    // letztes <hr> abschneiden
    // aber nur, wenn layers ergänzt wurden
    // wenn keine Layers ergänzt wurden: Layertitel nicht anzeigen (nur bei html_apflora von Bedeutung)
    //html_welt_hintergrund = html_welt_hintergrund.substring(0, (html_welt_hintergrund.length - 4));
    html_ch_hintergrund = html_ch_hintergrund.substring(0, (html_ch_hintergrund.length - 4));
    html_ch_sachinfos = html_ch_sachinfos.substring(0, (html_ch_sachinfos.length - 4));
    html_ch_biotopinv = html_ch_biotopinv.substring(0, (html_ch_biotopinv.length - 4));
    html_zh_sachinfos = html_zh_sachinfos.substring(0, (html_zh_sachinfos.length - 4));
    if (eigene_layer_zähler > 0) {
        html_eigene_layer = html_eigene_layer.substring(0, (html_eigene_layer.length - 4));
    }
    if (html_apflora !== '<h3>ZH AP Flora</h3><div>') {
        html_apflora = html_apflora.substring(0, (html_apflora.length - 4));
    } else {
        html_apflora = '';
    }
    // unteraccordions abschliessen
    //html_welt_hintergrund += '</div>';
    html_ch_hintergrund += '</div>';
    html_ch_sachinfos += '</div>';
    html_ch_biotopinv += '</div>';
    html_zh_sachinfos += '</div>';
    html_apflora += '</div>';
    if (eigene_layer_zähler > 0) {
        html_eigene_layer_text += html_eigene_layer;
    }
    html_eigene_layer_text += '</div>';
    // alles zusammensetzen
    html = /*html_welt_hintergrund + */html_ch_hintergrund + html_ch_sachinfos + html_ch_biotopinv + html_zh_sachinfos + html_apflora + html_eigene_layer_text;
    // und einsetzen
    $olmap_layertree_layers.html(html);
    // erst jetzt initiieren, sonst stimmt die Höhe nicht
    if (active_kategorie) {
        // ohne die erste Aktivierung funktioniert es nicht
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active: false,
            heightStyle: 'content'
        });
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active: 0,
            heightStyle: 'content'
        });
        if (active_kategorie === 'Eigene Ebenen') {
            active = 5;
        }
        $('#olmap_layertree_layers').accordion({
            collapsible: true,
            active: active,
            heightStyle: 'content'
        });
    } else {
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active: false,
            heightStyle: 'content'
        });
    }

    // Maximalgrösse des Layertree begrenzen
    $olmap_layertree_layers.css('max-height', window.apf.berechneOlmapLayertreeMaxhöhe);
    // buttons initiieren
    $('.neues_layer')
        .button({
            icons: {primary: 'ui-icon-plusthick'}
        })
        .button('refresh');
    $('.export_layer_select').selectmenu();
    // jetzt tooltips erstellen
    _.each(export_layer_select_ids, function (id) {
        // give the selectmenu a tooltip
        $('#' + id + '-button').tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            items: 'span',
            content: 'Ebene exportieren<br>Wählen Sie ein Format'
        });
    });
    if (initialize_modify_layer) {
        $('.modify_layer')
            .button({
                icons: {primary: 'ui-icon-locked'},
                text: false
            })
            .button('refresh');
        $('.modify_layer_label, .export_layer_select_label, .rename_layer_label, .entferne_layer_label, .apf_tooltip')
            .tooltip({
                tooltipClass: "tooltip-styling-hinterlegt",
                content: function () {
                    return $(this).attr('title');
                }
            });
        $('.rename_layer')
            .button({
                icons: {primary: 'ui-icon-tag'},
                text: false
            })
            .button('refresh');
        $('.entferne_layer')
            .button({
                icons: {primary: 'ui-icon-closethick'},
                text: false
            })
            .button('refresh');
    }
    if (initialize_legende) {
        $(".olmap_layertreee_legende").tooltip({
            tooltipClass: "tooltip_olmap_layertree_legende",
            position: {
                my: "right top+15",
                at: "right bottom",
                collision: "flipfit"
            },
            content: function () {
                var url = $(this).attr('href');
                return "<img src='" + url + "'>";
            }
        });
        // die tooltips sind beim ersten Öffnen zu weit rechts > nicht sichtbar!
        // darum alle einmal öffnen
        // ab dem zweiten mal liegen sie am richtigen Ort
        $(".olmap_layertreee_legende").each(function () {
            $(this).tooltip('open');
            $(this).tooltip('close');
        });
    }
};

module.exports = returnFunction;