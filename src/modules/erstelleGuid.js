// erstellt einen guid
// Quelle: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};