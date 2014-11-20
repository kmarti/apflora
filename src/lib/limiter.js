/**
 * damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
 * Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function ($) {
    $.fn.extend({
        limiter: function (limit, elem) {
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html(limit - chars);
            }
            $(this).on("keyup focus", function () {
                setCount(this, elem);
            });
            setCount($(this)[0], elem);
        }
    });
};