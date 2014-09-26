/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict';
var  _       = require('underscore')
    , Hapi   = require('hapi')
    , server = new Hapi.Server(
        'localhost',
        4000,
        {
            debug: { request: ['error'] }
        }
    )
    //, moonbootsConfig = require('./moonbootsConfig')
    , mysql  = require('mysql')
    , config = require('./src/modules/configuration')
    , connectionApflora = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    })
    , serverMethodGemeinden           = require('./serverMethods/gemeinden')
    , serverMethodArtliste            = require('./serverMethods/artliste')
    , serverMethodApliste             = require('./serverMethods/apliste')
    , serverMethodAdressen            = require('./serverMethods/adressen')
    , queryAp                         = require('./queries/ap')
    , queryTabelleSelectApfloraNumber = require('./queries/tabelleSelectApfloraNumber')
    , queryTabelleSelectApfloraString = require('./queries/tabelleSelectApfloraString')
    , queryTabelleSelectBeobNumber    = require('./queries/tabelleSelectBeobNumber')
    , queryTabelleSelectBeobString    = require('./queries/tabelleSelectBeobString')
    , queryTabelleInsertApflora       = require('./queries/tabelleInsertApflora')
    , queryTabelleUpdateApflora       = require('./queries/tabelleUpdateApflora')
    , queryTabelleUpdateBeob          = require('./queries/tabelleUpdateBeob')
    , queryTabelleDeleteApflora       = require('./queries/tabelleDeleteApflora')
    , queryAnmeldung                  = require('./queries/anmeldung')
    , treeAssozarten                  = require('./queries/tree/assozarten')
    , treeIdealbiotop                 = require('./queries/tree/idealbiotop')
    , treeBeobNichtZuzuordnen         = require('./queries/tree/beobNichtZuzuordnen')
    , treeBeobNichtBeurteilt          = require('./queries/tree/beobNichtBeurteilt')
    , treeBer                         = require('./queries/tree/ber')
    , treeJBer                        = require('./queries/tree/jber')
    , treeErfkrit                     = require('./queries/tree/erfkrit')
    , treeApziel                      = require('./queries/tree/apziel')
    , queryBeobDistzutpopEvab         = require('./queries/beobDistzutpopEvab')
    , queryBeobDistzutpopInfospezies  = require('./queries/beobDistzutpopInfospezies')
    , queryBeobKarte                  = require('./queries/beobKarte')
    ;

connectionApflora.connect();

server.start(function (err) {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file('index.html');
    }
});

server.route({
    method: 'GET',
    path: '/src/{param*}',
    handler: {
        directory: {
            path: 'src'
        }
    }
});

server.route({
    method: 'GET',
    path: '/style/{param*}',
    handler: {
        directory: {
            path: 'style'
        }
    }
});

server.route({
    method: 'GET',
    path: '/kml/{param*}',
    handler: {
        directory: {
            path: 'kml'
        }
    }
});

server.route({
    method: 'GET',
    path: '/geojson/{param*}',
    handler: {
        directory: {
            path: 'geojson'
        }
    }
});

server.route({
    method: 'GET',
    path: '/img/{param*}',
    handler: {
        directory: {
            path: 'img'
        }
    }
});

server.method('gemeinden', serverMethodGemeinden, {
    cache: { expiresIn: 8 * 60 * 60 * 1000 }
});
server.route({
    method: 'GET',
    path: '/api/gemeinden',
    handler: function (request, reply) {
        server.methods.gemeinden(request, reply);
    }
});

server.method('artliste', serverMethodArtliste, {
    cache: { expiresIn: 8 * 60 * 60 * 1000 }
});
server.route({
    method: 'GET',
    path: '/api/artliste',
    config: {
        handler: function (request, reply) {
            server.methods.artliste(request, reply);
        }
    }
});

server.method('apliste', serverMethodApliste, {
    cache: { expiresIn: 8 * 60 * 60 * 1000 }
});
server.route({
    method: 'GET',
    path: '/api/apliste/programm={programm}',
    handler: function (request, reply) {
        server.methods.apliste(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/anmeldung/name={name}/pwd={pwd}',
    handler: function (request, reply) {
        queryAnmeldung(request, reply);
    }
});

server.method('adressen', serverMethodAdressen, {
    cache: { expiresIn: 60 * 1000 }
});
server.route({
    method: 'GET',
    path: '/api/adressen',
    handler: function (request, reply) {
        server.methods.adressen(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/select/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: function (request, reply) {
        queryTabelleSelectApfloraNumber(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/select/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: function (request, reply) {
        queryTabelleSelectBeobNumber(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/select/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: function (request, reply) {
        queryTabelleSelectApfloraString(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/select/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: function (request, reply) {
        queryTabelleSelectBeobString(request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: function (request, reply) {
        queryTabelleUpdateApflora(request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/update/beob/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: function (request, reply) {
        queryTabelleUpdateBeob(request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
    handler: function (request, reply) {
        queryTabelleInsertApflora(request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/delete/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
    handler: function (request, reply) {
        queryTabelleDeleteApflora(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/ap={apId}',
    handler: function (request, reply) {
        queryAp(request, reply);
    }
});

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 * Beispiel: BeoListe, FeldListe, tree
 */

server.route({
    method: 'GET',
    path: '/api/tree/ap={id}',
    config: {
        pre: [
            [
                { method: treeAssozarten, assign: 'assozarten' },
                { method: treeIdealbiotop, assign: 'idealbiotop' },
                { method: treeBeobNichtZuzuordnen, assign: 'beobNichtZuzuordnen' },
                { method: treeBeobNichtBeurteilt, assign: 'beobNichtBeurteilt' },
                { method: treeBer, assign: 'ber' },
                { method: treeJBer, assign: 'jber' },
                { method: treeErfkrit, assign: 'erfkrit' },
                { method: treeApziel, assign: 'apziel' }
            ]

        ],
        handler: function (request, reply) {
            reply([
                request.pre.apziel,
                request.pre.erfkrit,
                request.pre.jber,
                request.pre.ber,
                request.pre.beobNichtBeurteilt,
                request.pre.beobNichtZuzuordnen,
                request.pre.idealbiotop,
                request.pre.assozarten
            ]);
        }
    }

});

server.route({
    method: 'GET',
    path: '/api/beobDistzutpopEvab/beobId={beobId}',
    handler: function (request, reply) {
        queryBeobDistzutpopEvab(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/beobDistzutpopInfospezies/beobId={beobId}',
    handler: function (request, reply) {
        queryBeobDistzutpopInfospezies(request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}',
    handler: function (request, reply) {
        queryBeobKarte(request, reply);
    }
});