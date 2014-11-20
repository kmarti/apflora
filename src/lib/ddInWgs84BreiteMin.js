/**
 * wandelt Projektionen um
 * @return {number}
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (breite) {
    var breiteGrad = Math.floor(breite);
    return Math.floor((breite - breiteGrad) * 60);
};