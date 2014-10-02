'use strict';

var _          = require('underscore'),
    mysql      = require('mysql'),
    async      = require('async'),
    config     = require('../../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    }),
    response   = {},
    apId;

var returnFunction = function(request, reply) {
    apId = decodeURIComponent(request.params.apId);

    // query ber AND jberUebersicht first
    async.parallel({
        jberListe: function (callback) {
            connection.query(
                'SELECT JBerId, ApArtId, JBerJahr FROM tblJBer where ApArtId = ' + apId + ' ORDER BY JBerJahr',
                function (err, jber) {
                    callback(err, jber);
                }
            );
        },
        jberÜbersichtListe: function (callback) {
            connection.query(
                'SELECT JbuJahr FROM tblJBerUebersicht',
                function (err, jberÜbersicht) {
                    callback(err, jberÜbersicht);
                }
            );
        }
    }, function (err, results) {
        var jberListe = results.jberListe,
            responseChildren;
        response.data = 'AP-Berichte (' + jberListe.length + ')';
        response.attr = {
            id: 'ap_ordner_jber' + apId,
            typ: 'ap_ordner_jber'
        };
        responseChildren = buildChildrenForJBerOrdner(results);
        response.children = responseChildren;
        reply(null, response);
    });
};

function buildChildrenForJBerOrdner(results) {
    var childrenArray = [],
        object,
        beschriftung = '(kein Jahr)';
    _.each(results.jberListe, function(jber) {
        object = {};

        if (jber.JBerJahr) beschriftung = jber.JBerJahr.toString();
        object.data = beschriftung;

        object.attr = {
            id: jber.JBerId,
            typ: 'jber'
        };

        if (jber.JBerJahr) {
            object.children = buildChildForJBer(jber.JBerJahr, results.jberÜbersichtListe);
        }
        childrenArray.push(object);
    });
    return childrenArray;
}

function buildChildForJBer(JBerJahr, jberÜbersichtListe) {
    // zuerst den Datensatz extrahieren
    var jberÜbersicht = _.find(jberÜbersichtListe, function(jberÜbersicht) {
        return jberÜbersicht.JbuJahr === JBerJahr;
    });
    
    if (jberÜbersicht) {
        var object = {};
        object.data = 'Übersicht zu allen Arten';
        object.attr = {
            id: jberÜbersicht.JbuJahr,
            typ: 'jber_uebersicht'
        };
        return [object];
    } else {
        return null;
    }
}

module.exports = returnFunction;