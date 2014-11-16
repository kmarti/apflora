// öffnet ein modal und teilt etwas mit

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var $ = require('jquery');

module.exports = function (meldung, title) {
    title = title || ' ';

    $("#Meldung")
        .html(meldung)
        .attr('title', title)
        .dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
};