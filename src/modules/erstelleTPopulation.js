// uups: wird offenbar nicht benutzt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var OpenLayers = require('OpenLayers');

module.exports = function (TPop) {
    var defaultStyle,
        selectStyle,
        overlayTPop,
        myLocation,
        myTPopFlurname = TPop.TPopFlurname || '(kein Flurname)',
        myTooltip,
        marker,
        dragControl;

    // styles für overlay_top definieren
    defaultStyle = new OpenLayers.Style({
        externalGraphic: '//www.apflora.ch/img/flora_icon_rot.png',
        graphicWidth: 32,
        graphicHeight: 37,
        graphicYOffset: -37,
        title: '${tooltip}'
    });
    selectStyle = new OpenLayers.Style({
        externalGraphic: '//www.apflora.ch/img/flora_icon_gelb.png'
    });
    // overlay layer für Marker vorbereiten
    overlayTPop = new OpenLayers.Layer.Vector('Teilpopulation', {
        styleMap: new OpenLayers.StyleMap({
            'default': defaultStyle,
            'select': defaultStyle
        })
    });
    myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord);

    // tooltip bzw. label vorbereiten: nullwerte ausblenden
    if (window.apf.pop.PopNr && TPop.TPopNr) {
        myTooltip = window.apf.pop.PopNr + '/' + TPop.TPopNr + ' ' + myTPopFlurname;
    } else if (window.apf.pop.PopNr) {
        myTooltip = window.apf.pop.PopNr + '/?' + ' ' + myTPopFlurname;
    } else if (TPop.TPopNr) {
        myTooltip = '?/' + TPop.TPopNr + ' ' + myTPopFlurname;
    } else {
        myTooltip = '?/?' + ' ' + myTPopFlurname;
    }

    // marker erstellen...
    // gewählte erhalten style gelb und zuoberst
    marker = new OpenLayers.Feature.Vector(myLocation, {
        tooltip: myTooltip
    });

    // die marker der Ebene hinzufügen
    overlayTPop.addFeatures(marker);

    // die marker sollen verschoben werden können
    dragControl = new OpenLayers.Control.DragFeature(overlayTPop, {
        onComplete: function (feature) {
            // x und y merken
            TPop.TPopXKoord = feature.geometry.x;
            TPop.TPopYKoord = feature.geometry.y;
            // Datensatz updaten
            window.apf.speichereWert('tpop', localStorage.tpopId, 'TPopXKoord', TPop.TPopXKoord);
            window.apf.speichereWert('tpop', localStorage.tpopId, 'TPopYKoord', TPop.TPopYKoord);
        }
    });
    window.apf.olmap.addControl(dragControl);
    dragControl.activate();

    // overlay zur Karte hinzufügen
    window.apf.olmap.addLayer(overlayTPop);

    // control zur Karte hinzufügen
    window.selectControlTPop = new OpenLayers.Control.SelectFeature(overlayTPop, {clickout: true});
    window.apf.olmap.addControl(window.selectControlTPop);
    window.selectControlTPop.activate();
};