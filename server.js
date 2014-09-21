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
         * Get Data from DB
         * and return that
         * db.get('user', request.params.id, function(err, item)...
         * ...reply(item)
         */

        /**
         * db.query can be outsourced to a function with callback
         * referenced by server.helper
         * then it can be cached
         * see http://blog.andyet.com/tag/node at 15min
         * Anwendungsfall für cachen: v.a. Feldlisten?
         */

        /**
         * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
         * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
         * und im reply zu einem Objekt zusammengefasst werden
         * Beispiel: BeoListe, FeldListe, tree
         */

        server.methods.gemeinden('gemeinden', connectionApflora, request, reply);
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
            server.methods.artliste('artliste', connectionBeob, request, reply);
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
        server.methods.apliste('apliste', connectionApflora, request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/api/anmeldung/name={name}/pwd={pwd}',
    handler: function (request, reply) {
        var userName = decodeURIComponent(request.params.name),
            password = decodeURIComponent(request.params.pwd);
        connectionApflora.query(
            'SELECT NurLesen FROM tblUser WHERE UserName = "' + userName + '" AND Passwort = "' + password + '"',
            function(err, data) {
                if (err) throw err;
                reply(data);
            }
        );
    }
});

server.method('adressen', serverMethodAdressen, {
    cache: { expiresIn: 60 * 1000 }
});

server.route({
    method: 'GET',
    path: '/api/adressen',
    handler: function (request, reply) {
        server.methods.adressen('adressen', connectionApflora, request, reply);
    }
});

server.route({
    method: 'GET',
    path: '/ap={id}',
    handler: function (request, reply) {
        var id = decodeURIComponent(request.params.id);
        connectionApflora.query(
                'SELECT alexande_apflora.tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblAktionsplan.ApStatus, alexande_apflora.tblAktionsplan.ApJahr, alexande_apflora.tblAktionsplan.ApUmsetzung, alexande_apflora.tblAktionsplan.ApBearb, alexande_apflora.tblAktionsplan.ApArtwert, alexande_apflora.tblAktionsplan.MutWann, alexande_apflora.tblAktionsplan.MutWer FROM alexande_apflora.tblAktionsplan INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId WHERE ApArtId = ' + id,
            function(err, data) {
                if (err) throw err;
                reply(data);
            }
        );
    }
});