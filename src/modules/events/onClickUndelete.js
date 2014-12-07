/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var undeleteDatensatz = require('../undeleteDatensatz');

module.exports = function (event) {
    event.preventDefault();
    undeleteDatensatz();
};