'use strict';

var _ = require('underscore')
    , mysql = require('mysql')
    , config = require('../../src/modules/configuration')
    , connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    })
    , response = {}
    ;

var beobNichtZuzuordnen = function(request, reply) {
    var id = decodeURIComponent(request.params.id);
    connection.query(
        "SELECT alexande_beob.tblBeobBereitgestellt.NO_ISFS, alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, 'infospezies' AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE WHERE alexande_apflora.tblBeobZuordnung.NO_NOTE IS NOT NULL AND alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=1 AND alexande_beob.tblBeobBereitgestellt.NO_ISFS=" + id + " UNION SELECT alexande_beob.tblBeobBereitgestellt.NO_ISFS, alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, 'evab' AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET WHERE alexande_apflora.tblBeobZuordnung.NO_NOTE IS NOT NULL AND alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=1 AND alexande_beob.tblBeobBereitgestellt.NO_ISFS=" + id + " ORDER BY Datum DESC LIMIT 100",
        function(err, data) {
            if (err) reply(err);

            if (data.length < 100) {
                response.data = 'nicht zuzuordnende Beobachtungen (' + data.length + ')';
            } else {
                response.data = 'nicht zuzuordnende Beobachtungen (erste ' + data.length + ')';
            }
            response.attr = {
                id: 'ap_ordner_beob_nicht_zuzuordnen' + id,
                typ: 'ap_ordner_beob_nicht_zuzuordnen'
            };
            response.children = buildChildFromData(data);
            reply(null, response);
        }
    );
};

function buildChildFromData(data) {
    var childrenArray = [],
        object;
    _.each(data, function(beob) {
        object = {};
        var datum = beob.Datum || '(kein Datum)',
            autor = beob.Autor || '(kein Autor)';
        object.data = datum + ': ' + autor;
        // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
        object.attr = {
            id: 'beob' + beob['NO_NOTE'],
            typ: 'beob_nicht_zuzuordnen',
            beobtyp: beob.beobtyp
        };
        childrenArray.push(object);
    });
    return childrenArray;
}

module.exports = beobNichtZuzuordnen;