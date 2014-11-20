// setzt die Höhe von textareas so, dass der Text genau rein passt

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (id, maxHeight) {
    var text = id && id.style ? id : document.getElementById(id),
        adjustedHeight;

    if (!text) {
        return;
    }

    /* Accounts for rows being deleted, pixel value may need adjusting */
    if (text.clientHeight == text.scrollHeight) {
        text.style.height = "30px";
    }

    adjustedHeight = text.clientHeight;
    if (!maxHeight || maxHeight > adjustedHeight) {
        adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
        if (maxHeight) {
            adjustedHeight = Math.min(maxHeight, adjustedHeight);
        }
        if (adjustedHeight > text.clientHeight) {
            text.style.height = adjustedHeight + "px";
        }
    }
};