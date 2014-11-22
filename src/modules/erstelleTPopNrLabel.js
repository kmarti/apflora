// tooltip bzw. label vorbereiten: nullwerte ausblenden

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (popnr, tpopnr) {
    popnr  = popnr  || '?';
    tpopnr = tpopnr || '?';
    return popnr + '/' + tpopnr;
};