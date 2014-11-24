/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    if (event.keyCode === 46) {
        event.stopPropagation();
    }
};