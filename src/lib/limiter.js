/**
 * damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
 * Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
 */

'use strict';

var $ = require('jquery');

module.exports = function($) {
    $.fn.extend( {
        limiter: function (limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html(limit - chars);
            }
            setCount($(this)[0], elem);
        }
    });
};