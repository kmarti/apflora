/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');
require('jquery-ui');

module.exports = function () {
    // kontrollieren, ob der User offline ist
    if (!navigator.onLine) {
        console.log('offline');
        $("#offline_dialog")
            .show()
            .dialog({
                modal: true,
                width: 400,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
        return false;
    }
    return true;
};