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
         * Beispiel: BeoListe, FeldListe
         */

        connectionApflora.query('SELECT GmdName FROM DomainGemeinden ORDER BY GmdName', function(err, data) {
            if (err) throw err;
            reply(data);
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/artliste',
    handler: function (request, reply) {
        connectionBeob.query(
            "SELECT TaxonomieId, IF(Status Is Not Null, CONCAT(Artname, '   ', Status), Artname) AS Artname FROM ArtenDb_Arteigenschaften ORDER BY Artname",
            function(err, data) {
                if (err) throw err;
                reply(data);
            }
        );
    }
});

server.route({
    method: 'GET',
    path: '/api/apliste/programm={programm}',
    handler: function (request, reply) {
        switch(decodeURIComponent(request.params.programm)) {
            case 'programm_ap':
                connectionApflora.query(
                    "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId WHERE alexande_apflora.tblAktionsplan.ApStatus BETWEEN 1 AND 3 ORDER BY ap_name",
                    function(err, data) {
                        if (err) throw err;
                        reply(data);
                    }
                );
            break;
            case 'programm_alle':
                connectionApflora.query(
                    "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId ORDER BY ap_name",
                    function(err, data) {
                        if (err) throw err;
                        reply(data);
                    }
                );
            break;
            default:
                connectionApflora.query(
                    "SELECT IF(alexande_beob.ArtenDb_Arteigenschaften.Status is not null, CONCAT(alexande_beob.ArtenDb_Arteigenschaften.Artname, '   ', alexande_beob.ArtenDb_Arteigenschaften.Status), alexande_beob.ArtenDb_Arteigenschaften.Artname) AS ap_name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS id FROM alexande_beob.ArtenDb_Arteigenschaften WHERE alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT alexande_apflora.tblAktionsplan.ApArtId FROM alexande_apflora.tblAktionsplan) ORDER BY ap_name",
                    function(err, data) {
                        if (err) throw err;
                        reply(data);
                    }
                );
            break;
        }
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