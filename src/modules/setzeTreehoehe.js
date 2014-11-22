// begrenzt die maximale Höhe des Baums auf die Seitenhöhe, wenn nötig

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function () {
    if ($(window).width() > 1000) {
        if (($(".jstree-no-icons").height() + 157) > $(window).height()) {
            $("#tree").css("max-height", $(window).height() - 139);
        }
    } else {
        // Spalten sind untereinander. Baum 75px weniger hoch, damit Formulare immer erreicht werden können
        if (($(".jstree-no-icons").height() + 157) > $(window).height() - 75) {
            $("#tree").css("max-height", $(window).height() - 220);
        }
    }
};