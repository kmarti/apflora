/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var _                  = require('underscore'),
    mysql              = require('mysql'),
    config             = require('../../src/modules/configuration'),
    escapeStringForSql = require('../escapeStringForSql'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

function buildChildFromData(data) {
    var childrenArray = [],
        object;

    _.each(data, function (assArt) {
        object      = {};
        object.data = assArt.Artname || '(keine Art gewählt)';
        object.attr = {
            id:  assArt.AaId,
            typ: 'assozarten'
        };
        childrenArray.push(object);
    });

    return childrenArray;
}

module.exports = function (request, reply) {
    var apId = escapeStringForSql(decodeURIComponent(request.params.apId)),
        response;

    connection.query(
        'SELECT AaId, alexande_beob.ArtenDb_Arteigenschaften.Artname FROM tblAssozArten LEFT JOIN alexande_beob.ArtenDb_Arteigenschaften ON AaSisfNr = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId where AaApArtId = ' + apId + ' ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname',
        function (err, data) {
            if (err) { reply(err); }
            response      = {};
            response.data = 'assoziierte Arten (' + data.length + ')';
            response.attr = {
                id:  'apOrdnerAssozarten' + apId,
                typ: 'apOrdnerAssozarten'
            };
            response.children = buildChildFromData(data);
            reply(null, response);
        }
    );
};