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
    , connectionBeob = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    })
    , connectionViews = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_views'
    })
    , serverMethodGemeinden = require('./serverMethods/gemeinden')
    , serverMethodArtliste  = require('./serverMethods/artliste')
    , serverMethodApliste   = require('./serverMethods/apliste')
    , serverMethodAdressen  = require('./serverMethods/adressen')
    , queryAp               = require('./queries/ap')
    , queryAssozart         = require('./queries/assozart')
    , queryAssozartInsert   = require('./queries/assozartInsert')
    , queryTabelleInsert    = require('./queries/tabelleInsert')
    , queryTabelleUpdate    = require('./queries/tabelleUpdate')
    , queryIdealbiotop      = require('./queries/idealbiotop')
    , queryAnmeldung        = require('./queries/anmeldung')
    , treeAssozarten        = require('./queries/tree/assozarten')
    , treeIdealbiotop       = require('./queries/tree/idealbiotop')
    ;

connectionApflora.connect();

// require moonboots_hapi plugin
/*server.pack.register({plugin: require('moonboots_hapi'), options: moonbootsConfig}, function (err) {
    if (err) throw err;
    server.start(function (err) {
        if (err) throw err;
        console.log('Server running at:', server.info.uri);
    });
});*/

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

        /**
         * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
         * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
         * und im reply zu einem Objekt zusammengefasst werden
         * Beispiel: BeoListe, FeldListe, tree
         */

        server.methods.gemeinden(connectionApflora, request, reply);
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
            server.methods.artliste(connectionBeob, request, reply);
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
        server.methods.apliste(connectionApflora, request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/anmeldung/name={name}/pwd={pwd}',
    handler: function (request, reply) {
        queryAnmeldung(connectionApflora, request, reply);
    }
});

server.method('adressen', serverMethodAdressen, {
    cache: { expiresIn: 60 * 1000 }
});
server.route({
    method: 'GET',
    path: '/api/adressen',
    handler: function (request, reply) {
        server.methods.adressen(connectionApflora, request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/ap={apId}',
    handler: function (request, reply) {
        queryAp(connectionApflora, request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/tree/ap={id}',
    config: {
        pre: [
            [
                { method: treeAssozarten, assign: 'assozarten' },
                { method: treeIdealbiotop, assign: 'idealbiotop' }
            ]

        ],
        handler: function (request, reply) {
            reply([request.pre.idealbiotop, request.pre.assozarten]);
        }
    }

});

server.route({
    method: 'GET',
    path: '/ap={apId}/assozart={assozArtId}',
    handler: function (request, reply) {
        queryAssozart(connectionApflora, request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/update/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: function (request, reply) {
        queryTabelleUpdate(connectionApflora, request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/insert/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
    handler: function (request, reply) {
        queryTabelleInsert(connectionApflora, request, reply);
    }
});

server.route({
    method: 'POST',
    path: '/api/ap={apId}/assozart-neu/user={user}',
    handler: function (request, reply) {
        queryAssozartInsert(connectionApflora, request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/ap={apId}/idealbiotop',
    handler: function (request, reply) {
        queryIdealbiotop(connectionApflora, request, reply);
    }
});