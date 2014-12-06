/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    $('#AaSisfNr').val(this.value).trigger('change');
};