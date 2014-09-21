'use strict';

var idealbiotop = function(request, reply) {
    var id = decodeURIComponent(request.params.id),
        response = {};
    response.data = 'Idealbiotop';
    response.attr = {
        id: 'idealbiotop' + id,
        typ: 'idealbiotop'
    };
    reply(null, response);
};

module.exports = idealbiotop;