/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (popId) {
    window.open("index.html?ap=" + localStorage.apId + "&pop=" + popId, "_blank");
};