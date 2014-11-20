/**
 * wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (breite, laenge) {
    var ddInWgs84BreiteGrad = require('./ddInWgs84BreiteGrad'),
        breiteGrad          = ddInWgs84BreiteGrad(breite),
        ddInWgs84BreiteMin  = require('./ddInWgs84BreiteMin'),
        breiteMin           = ddInWgs84BreiteMin(breite),
        ddInWgs84BreiteSec  = require('./ddInWgs84BreiteSec'),
        breiteSec           = ddInWgs84BreiteSec(breite),
        ddInWgs84LaengeGrad = require('./ddInWgs84LaengeGrad'),
        laengeGrad          = ddInWgs84LaengeGrad(laenge),
        ddInWgs84LaengeMin  = require('./ddInWgs84LaengeMin'),
        laengeMin           = ddInWgs84LaengeMin(laenge),
        ddInWgs84LaengeSec  = require('./ddInWgs84LaengeSec'),
        laengeSec           = ddInWgs84LaengeSec(laenge),
        wgs84InChX          = require('./wgs84InChX');

    return Math.floor(wgs84InChX(breiteGrad, breiteMin, breiteSec, laengeGrad, laengeMin, laengeSec));
};