/**
 * wandelt Projektionen um
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true */
'use strict';


module.exports = function (Breite) {
    var BreiteGrad = Math.floor(Breite);
    return Math.floor((Breite - BreiteGrad) * 60);
};