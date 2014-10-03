'use strict';

var idealbiotop = function (request, reply) {
    var apId     = decodeURIComponent(request.params.apId),
        node = {};

    node.data = 'Idealbiotop';
    node.attr = {
        id: 'idealbiotop' + apId,
        typ: 'idealbiotop'
    };

    reply(null, node);
};

module.exports = idealbiotop;