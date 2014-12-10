/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var escapeStringForSql = require('../escapeStringForSql');

module.exports = function (request, reply) {
    var apId,
        node;

    apId      = escapeStringForSql(request.params.apId);

    node      = {};
    node.data = 'Idealbiotop';
    node.attr = {
        id:  'idealbiotop' + apId,
        typ: 'idealbiotop'
    };

    reply(null, node);
};