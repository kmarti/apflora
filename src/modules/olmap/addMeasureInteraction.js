// erhält den Typ der Interaktion: 'Polygon' oder 'LineString'

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                        = require('jquery'),
    ol                       = require('ol'),
    removeMeasureInteraction = require('./removeMeasureInteraction'),
    formatLength             = require('./formatLength'),
    formatArea               = require('./formatArea');

module.exports = function (type) {
    var source,
        messenLayer,
        // Currently drawed feature
        // @type {ol.Feature}
        sketch = null,
        // Element for currently drawed feature
        // @type {Element}
        sketchElement,
        mouseMoveHandler;

    // allfällige Resten entfernen
    removeMeasureInteraction();
    // neu aufbauen
    source      = new ol.source.Vector();
    messenLayer = new ol.layer.Vector({
        title:  'messen',
        source: source,
        style:  new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 1)',
                width: 3,
                lineDash: [2, 2],
                lineCap: 'square'
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    window.apf.olMap.map.addLayer(messenLayer);

    // handle pointer move
    // @param {Event} evt
    mouseMoveHandler = function (evt) {
        if (sketch) {
            var output,
                geom = (sketch.getGeometry());

            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(/** @type {ol.geom.Polygon} */ (geom));

            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength( /** @type {ol.geom.LineString} */ (geom));
            }
            sketchElement.innerHTML = output;
        }
    };

    $(window.apf.olMap.map.getViewport()).on('mousemove', mouseMoveHandler);

    window.apf.olMap.drawMeasure = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (type)
    });
    window.apf.olMap.map.addInteraction(window.apf.olMap.drawMeasure);

    window.apf.olMap.drawMeasure.on('drawstart',
        function (evt) {
            // set sketch
            sketch         = evt.feature;
            sketchElement  = document.createElement('li');
            var outputList = document.getElementById('olMapErgebnisMessung');
            if (outputList.childNodes) {
                outputList.insertBefore(sketchElement, outputList.firstChild);
            } else {
                outputList.appendChild(sketchElement);
            }
        }, this);

    window.apf.olMap.drawMeasure.on('drawend', function () {
        // unset sketch
        sketch        = null;
        sketchElement = null;
    }, this);
};