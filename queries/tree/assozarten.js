'use strict';

var _ = require('underscore')
    , mysql = require('mysql')
    , connectionApflora = mysql.createConnection({
        host: 'localhost',
        user: 'alexande',
        password: 'y3oYksFsQL49es9x',
        database: 'alexande_apflora'
    })
    , response = {}
    ;

var assozarten = function(request, reply) {
    var id = decodeURIComponent(request.params.id);
    connectionApflora.query(
        'SELECT AaId, alexande_beob.ArtenDb_Arteigenschaften.Artname FROM tblAssozArten LEFT JOIN alexande_beob.ArtenDb_Arteigenschaften ON AaSisfNr = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId where AaApArtId = ' + id + ' ORDER BY alexande_beob.ArtenDb_Arteigenschaften.Artname',
        function(err, data) {
            if (err) reply(err);
            response.data = 'assoziierte Arten (' + data.length + ')';
            response.attr = {
                id: 'ap_ordner_assozarten' + id,
                typ: 'ap_ordner_assozarten'
            };
            response.children = buildChildFromData(data);
            reply(null, response);
        }
    );
};

function buildChildFromData(data) {
    var childrenArray = [],
        object;
    _.each(data, function(assArt) {
        object = {};
        object.data = assArt.Artname || '(keine Art gewählt)';
        object.attr = {
            id: assArt.AaId,
            typ: 'assozarten'
        };
        childrenArray.push(object);
    });
    return childrenArray;
}

module.exports = assozarten;