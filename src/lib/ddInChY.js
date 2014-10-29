/**
 * wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict';

module.exports = function (breite, länge) {
    var ddInWgs84BreiteGrad = require('./ddInWgs84BreiteGrad'),
        breiteGrad          = ddInWgs84BreiteGrad(breite),
        ddInWgs84BreiteMin  = require('./ddInWgs84BreiteMin'),
        breiteMin           = ddInWgs84BreiteMin(breite),
        ddInWgs84BreiteSec  = require('./ddInWgs84BreiteSec'),
        breiteSec           = ddInWgs84BreiteSec(breite),
        ddInWgs84LängeGrad  = require('./ddInWgs84LaengeGrad'),
        längeGrad           = ddInWgs84LängeGrad(länge),
        ddInWgs84LängeMin   = require('./ddInWgs84LaengeMin'),
        längeMin            = ddInWgs84LängeMin(länge),
        ddInWgs84LängeSec   = require('./ddInWgs84LaengeSec'),
        längeSec            = ddInWgs84LängeSec(länge),
        wgs84InChY          = require('./wgs84InChY');

    return Math.floor(wgs84InChY(breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, längeSec));
};