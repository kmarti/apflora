'use strict';

var idealbiotop = function(request, reply) {
    var apId     = decodeURIComponent(request.params.apId),
        response = {};

    response.data = 'Idealbiotop';
    response.attr = {
        id: 'idealbiotop' + apId,
        typ: 'idealbiotop'
    };

    reply(null, response);
};

module.exports = idealbiotop;