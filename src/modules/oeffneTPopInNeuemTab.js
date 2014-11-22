/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (tpopId) {
    window.open("index.html?ap=" + localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + tpopId, "_blank");
};