/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $  = require('jquery'),
    _  = require('underscore'),
    ol = require('ol');

// braucht $ wegen $.qtip
var returnFunction = function (pixel, coordinate) {
    var features = window.apf.olmap.sucheFeatures(pixel),
        overlay,
        popup_id,
        popup_id_array = [],
        koordinaten,
        popup_title,
        popup_text = '',
        features_mit_typ;

    // es scheint auch weitere Features zu geben (z.B. wenn man genau auf die Koordinate einer Pop klickt)
    // nur die gewollten behalten
    features_mit_typ = _.filter(features, function (feature) {
        return feature.get('myTyp') ||  feature.get('popup_title');
    });
    if (features_mit_typ && features_mit_typ.length > 0) {
        // wenn mehrere features_mit_typ vorkommen: die Infos aller sammeln und anzeigen
        if (features_mit_typ.length > 1) {
            _.each(features_mit_typ, function (feature, index) {
                if (feature.get('myTyp') === 'Detailplan') {
                    popup_text += '<h3>Objekt ID: ' + feature.get('OBJECTID') + '</h3>';
                    popup_text += '<table><tr><td><p>Typ:</p></td><td><p>Detailplan</p></td></tr>' +
                        '<tr><td><p>Fläche:</p></td><td><p>' + parseInt(feature.get('SHAPE_Area') / 10, 10) + '</p></td></tr>' +
                        '<tr><td><p>Bemerkunge:</p></td><td><p>' + (feature.get('Bemerkunge') || "") + '</p></td></tr>' +
                        '<tr><td><p>Bemerkun_1:</p></td><td><p>' + (feature.get('Bemerkun_1') || "") + '</p></td></tr></table>';
                } else {
                    popup_text += '<h3>' + feature.get('popup_title') + '</h3>';
                    popup_text += feature.get('popup_content');
                }
                if (index + 1 < features_mit_typ.length) {
                    popup_text += '<hr>';
                }
            });
            popup_title = features_mit_typ.length + ' Treffer';
            // als Koordinaten den Ort des Klicks nehmen
            koordinaten = coordinate;
        } else {
            // es gibt nur einen feature
            if (features_mit_typ[0].get('myTyp') === 'Detailplan') {
                popup_text = '<table><tr><td><p>Typ:</p></td><td><p>Detailplan</p></td></tr>' +
                    '<tr><td><p>Fläche:</p></td><td><p>' + parseInt(features_mit_typ[0].get('SHAPE_Area') / 10, 10) + '</p></td></tr>' +
                    '<tr><td><p>Bemerkunge:</p></td><td><p>' + (features_mit_typ[0].get('Bemerkunge') || "") + '</p></td></tr>' +
                    '<tr><td><p>Bemerkun_1:</p></td><td><p>' + (features_mit_typ[0].get('Bemerkun_1') || "") + '</p></td></tr></table>';
                popup_title = 'Objekt ID: ' + features_mit_typ[0].get('OBJECTID');
            } else {
                popup_text = features_mit_typ[0].get('popup_content');
                popup_title = features_mit_typ[0].get('popup_title');
            }
            // als Koordinaten die Koordinate des popups nehmen
            if (features_mit_typ[0].get('xkoord') && features_mit_typ[0].get('ykoord')) {
                koordinaten = [features_mit_typ[0].get('xkoord'), features_mit_typ[0].get('ykoord')];
            } else {
                koordinaten = coordinate;
            }
        }

        // zuerst mit gtip einen popup erzeugen
        $('.olmap_popup').each(function () {
            $(this).qtip({
                content: {
                    text: popup_text,
                    title: popup_title,
                    button: 'Close'
                },
                style: {
                    // Use the jQuery UI widget classes
                    widget: true,
                    // Remove the default styling
                    def: false,
                    classes: 'olmap_popup_styling',
                    tip: {
                        width: 20,
                        height: 20
                    }
                },
                position: {
                    my: 'top left',
                    at: 'bottom right',
                    target: $(this),
                    viewport: $('#GeoAdminKarte')
                }
            });
            $(this).qtip('toggle', true);
        });

        // id des popups ermitteln
        $('.qtip').each(function () {
            popup_id_array.push($(this).attr('data-qtip-id'));
        });
        popup_id = _.max(popup_id_array);

        // die mit qtip erzeugte div dem overlay übergeben
        overlay = new ol.Overlay({
            element: $('#qtip-' + popup_id)
        });
        window.apf.olmap.map.addOverlay(overlay);
        overlay.setPosition(koordinaten);
        overlay.set('typ', 'popup');
    } else {
        // alle popups entfernen
        window.apf.olmap.entfernePopupOverlays();
    }
};

module.exports = returnFunction;