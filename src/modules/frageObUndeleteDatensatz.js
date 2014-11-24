// zeigt während 25 Sekunden einen Hinweis an und einen Link, mit dem eine Aktion rückgängig gemacht werden kann
// erwartet die Mitteilung, was passiert ist

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (wasIstPassiert) {
    // Hinweis zum rückgängig machen anzeigen
    $("#undeleteDiv").html(wasIstPassiert + " <a href='#' id='undelete'>Rückgängig machen?</a>");
    $(".undelete").show();
    if ($(window).width() > 1000) {
        $("#forms").css("top", "37px");
    }
    setTimeout(function () {
        $("#undeleteDiv").html("");
        $(".undelete").hide();
        $("#forms").css("top", "");
    }, 30000);
};