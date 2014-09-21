/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict';
var  _ = require('underscore')
    , Hapi = require('hapi')
    , server = new Hapi.Server(
        'localhost',
        4000,
        {
            debug: { request: ['error'] }
        }
    )
    , moonbootsConfig = require('./moonbootsConfig')
    , mysql = require('mysql')
    , connectionApflora = mysql.createConnection({
        host: 'localhost',
        user: 'alexande',
        password: 'y3oYksFsQL49es9x',
        database: 'alexande_apflora'
    })
    , connectionBeob = mysql.createConnection({
        host: 'localhost',
        user: 'alexande',
        password: 'y3oYksFsQL49es9x',
        database: 'alexande_beob'
    })
    , connectionViews = mysql.createConnection({
        host: 'localhost',
        user: 'alexande',
        password: 'y3oYksFsQL49es9x',
        database: 'alexande_views'
    })

    , serverMethodGemeinden = require('./serverMethods/gemeinden')
    , serverMethodArtliste = require('./serverMethods/artliste')
    , serverMethodApliste = require('./serverMethods/apliste')
    , serverMethodAdressen = require('./serverMethods/adressen')
    , queryAp = require('./queries/ap')
    , queryAnmeldung = require('./queries/anmeldung')
    ;

connectionApflora.connect();

// require moonboots_hapi plugin
server.pack.register({plugin: require('moonboots_hapi'), options: moonbootsConfig}, function (err) {
    if (err) throw err;
    server.start(function (err) {
        if (err) throw err;
        console.log('Server running at:', server.info.uri);
    });
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
    path: '/ap={id}',
    handler: function (request, reply) {
        queryAp(connectionApflora, request, reply);
    }
});