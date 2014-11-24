/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    var $berUrl = $("#berUrl"),
        url = $berUrl.val();

    if (url.substring(0, 3) === "www") {
        url = "//" + url;
        $berUrl.val(url);
    } else if (url.substring(0, 4) !== "http") {
        url = "//www." + url;
        $berUrl.val(url);
    }
    $('#BerURLHref').attr('onClick', "window.open('" + url + "', target='_blank')");
};