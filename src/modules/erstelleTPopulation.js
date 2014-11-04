// uups: wird offenbar nicht benutzt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var returnFunction = function (TPop) {
    // styles für overlay_top definieren
    var defaultStyle = new OpenLayers.Style({
            externalGraphic: '//www.apflora.ch/img/flora_icon_rot.png',
            graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
            title: '${tooltip}'
        }),
        selectStyle = new OpenLayers.Style({
            externalGraphic: '//www.apflora.ch/img/flora_icon_gelb.png'
        }),
        // overlay layer für Marker vorbereiten
        overlay_tpopulation = new OpenLayers.Layer.Vector('Teilpopulation', {
            styleMap: new OpenLayers.StyleMap({
                'default': defaultStyle,
                'select': defaultStyle
            })
        }),
        myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord),
        myTPopFlurname = TPop.TPopFlurname || '(kein Flurname)',
        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        myTooltip;

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
    var marker = new OpenLayers.Feature.Vector(myLocation, {
        tooltip: myTooltip
    });

    // die marker der Ebene hinzufügen
    overlay_tpopulation.addFeatures(marker);

    // die marker sollen verschoben werden können
    var dragControl = new OpenLayers.Control.DragFeature(overlay_tpopulation, {
        onComplete: function (feature) {
            // x und y merken
            TPop.TPopXKoord = feature.geometry.x;
            TPop.TPopYKoord = feature.geometry.y;
            // Datensatz updaten
            window.apf.speichereWert('tpop', localStorage.tpop_id, 'TPopXKoord', TPop.TPopXKoord);
            window.apf.speichereWert('tpop', localStorage.tpop_id, 'TPopYKoord', TPop.TPopYKoord);
        }
    });
    window.apf.olmap.addControl(dragControl);
    dragControl.activate();

    // overlay zur Karte hinzufügen
    window.apf.olmap.addLayer(overlay_tpopulation);

    // control zur Karte hinzufügen
    window.selectControlTPop = new OpenLayers.Control.SelectFeature(overlay_tpopulation, {clickout: true});
    window.apf.olmap.addControl(window.selectControlTPop);
    window.selectControlTPop.activate();
};

module.exports = returnFunction;