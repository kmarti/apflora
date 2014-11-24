/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $                    = require('jquery'),
    downloadFileFromView = require('../..//downloadFileFromView');

module.exports = function () {
    downloadFileFromView($(this).attr('view'), $(this).attr('filename'), $(this).attr('format') || null);
    return false; // this is critical to stop the click event which will trigger a normal file download!
};