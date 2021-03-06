/**
 * startet die Anwendung, indem der Server gestartet wird
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var _                                 = require('underscore'),
    json2xls                          = require('json2xls'),
    json2csv                          = require('json2csv'),
    Hapi                              = require('hapi'),
    fs                                = require('fs'),
    server                            = new Hapi.Server(
        '0.0.0.0',
        4000,
        {
            debug: {
                request: ['error']
            }/*,        ausgeschaltet, da es lokal nicht funktioniert
            tls: {
                key: fs.readFileSync('./ssl/ssl.key'),
                cert: fs.readFileSync('./ssl/ssl.crt'),
            }*/
        }
    ),
    mysql                             = require('mysql'),
    config                            = require('./src/modules/configuration'),
    connectionApflora                 = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    }),
    queryGemeinden                    = require('./queries/gemeinden'),
    queryArtliste                     = require('./queries/artliste'),
    queryApliste                      = require('./queries/apliste'),
    queryAdressen                     = require('./queries/adressen'),
    queryLrDelarze                    = require('./queries/lrDelarze'),
    queryTpopMassnTypen               = require('./queries/tpopMassnTypen'),
    queryAp                           = require('./queries/ap'),
    queryApInsert                     = require('./queries/apInsert'),
    queryFeldkontrZaehleinheit        = require('./queries/feldkontrZaehleinheit'),
    queryIdealbiotopUebereinst        = require('./queries/idealbiotopUebereinst'),
    queryTabelleSelectApfloraNumber   = require('./queries/tabelleSelectApfloraNumber'),
    queryTabelleSelectApfloraString   = require('./queries/tabelleSelectApfloraString'),
    queryTabelleSelectBeobNumber      = require('./queries/tabelleSelectBeobNumber'),
    queryTabelleSelectBeobString      = require('./queries/tabelleSelectBeobString'),
    queryTabelleInsertApflora         = require('./queries/tabelleInsertApflora'),
    queryTabelleInsertMultipleApflora = require('./queries/tabelleInsertMultipleApflora'),
    queryTpopmassnInsertKopie         = require('./queries/tpopmassnInsertKopie'),
    queryTpopfeldkontrInsertKopie     = require('./queries/tpopfeldkontrInsertKopie'),
    queryTpopInsertKopie              = require('./queries/tpopInsertKopie'),
    queryFeldkontrInsert              = require('./queries/feldkontrInsert'),
    queryTabelleUpdateApflora         = require('./queries/tabelleUpdateApflora'),
    queryTabelleUpdateMultipleApflora = require('./queries/tabelleUpdateMultipleApflora'),
    queryTabelleUpdateBeob            = require('./queries/tabelleUpdateBeob'),
    queryTabelleDeleteApflora         = require('./queries/tabelleDeleteApflora'),
    queryAnmeldung                    = require('./queries/anmeldung'),
    treeAssozarten                    = require('./queries/tree/assozarten'),
    treeIdealbiotop                   = require('./queries/tree/idealbiotop'),
    treeBeobNichtZuzuordnen           = require('./queries/tree/beobNichtZuzuordnen'),
    treeBeobNichtBeurteilt            = require('./queries/tree/beobNichtBeurteilt'),
    treeBer                           = require('./queries/tree/ber'),
    treeJBer                          = require('./queries/tree/jber'),
    treeErfkrit                       = require('./queries/tree/erfkrit'),
    treeApziel                        = require('./queries/tree/apziel'),
    treePop                           = require('./queries/tree/pop'),
    queryBeobDistzutpopEvab           = require('./queries/beobDistzutpopEvab'),
    queryBeobNaechsteTpop             = require('./queries/beobNaechsteTpop'),
    queryBeobDistzutpopInfospezies    = require('./queries/beobDistzutpopInfospezies'),
    queryBeobKarte                    = require('./queries/beobKarte'),
    queryApKarte                      = require('./queries/apKarte'),
    queryPopKarte                     = require('./queries/popKarte'),
    queryPopKarteAlle                 = require('./queries/popKarteAlle'),
    queryPopChKarte                   = require('./queries/popChKarte'),
    queryPopsChKarte                  = require('./queries/popsChKarte'),
    queryTPopKarte                    = require('./queries/tpopKarte'),
    queryTPopsKarte                   = require('./queries/tpopsKarte'),
    queryTPopKarteAlle                = require('./queries/tpopKarteAlle'),
    exportView                        = require('./queries/exportView'),
    exportViewWhereIdIn               = require('./queries/exportViewWhereIdIn'),
    getKmlForPop                      = require('./src/modules/getKmlForPop'),
    getKmlForTpop                     = require('./src/modules/getKmlForTpop'),
    aktualisiereArteigenschaften      = require('./queries/aktualisiereArteigenschaften');

connectionApflora.connect();

server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

server.route({
    method: 'GET',
    path: '/{path*}',
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
    path: '/style/images/{param*}',
    handler: {
        directory: {
            path: 'style/images'
        }
    }
});

/* Versuch, funktioniert nicht*/
server.route({
    method: 'GET',
    path: '/etc/{param*}',
    handler: {
        directory: {
            path: 'etc'
        }
    }
});

/*server.route({
    method: 'GET',
    path: '/etc/Beziehungen.pdf',
    handler: function (request, reply) {
        reply.file('etc/Beziehungen.pdf');
    }
});*/

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
    path: '/api/v1/gemeinden',
    handler: queryGemeinden
});

server.route({
    method: 'GET',
    path: '/api/v1/artliste',
    handler: queryArtliste
});

server.route({
    method: 'GET',
    path: '/api/v1/apliste/programm={programm}',
    handler: queryApliste
});

server.route({
    method: 'GET',
    path: '/api/v1/anmeldung/name={name}/pwd={pwd}',
    handler: queryAnmeldung
});

server.route({
    method: 'GET',
    path: '/api/v1/adressen',
    handler: queryAdressen
});

server.route({
    method: 'GET',
    path: '/api/v1/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectApfloraNumber
});

server.route({
    method: 'GET',
    path: '/api/v1/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectBeobNumber
});

server.route({
    method: 'GET',
    path: '/api/v1/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectApfloraString
});

server.route({
    method: 'GET',
    path: '/api/v1/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectBeobString
});

server.route({
    method: 'POST',
    path: '/api/v1/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateApflora
});

server.route({
    method: 'POST',
    path: '/api/v1/updateMultiple/apflora/tabelle={tabelle}/felder={felder}',
    handler: queryTabelleUpdateMultipleApflora
});

server.route({
    method: 'POST',
    path: '/api/v1/update/beob/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateBeob
});

server.route({
    method: 'POST',
    path: '/api/v1/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
    handler: queryTabelleInsertApflora
});

server.route({
    method: 'POST',
    path: '/api/v1/insertMultiple/apflora/tabelle={tabelle}/felder={felder}',
    handler: queryTabelleInsertMultipleApflora
});

server.route({
    method: 'POST',
    path: '/api/v1/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}',
    handler: queryTpopmassnInsertKopie
});

server.route({
    method: 'POST',
    path: '/api/v1/tpopfeldkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}',
    handler: queryTpopfeldkontrInsertKopie
});

server.route({
    method: 'POST',
    path: '/api/v1/tpopInsertKopie/popId={popId}/tpopId={tpopId}/user={user}',
    handler: queryTpopInsertKopie
});

server.route({
    method: 'POST',
    path: '/api/v1/insert/feldkontr/tpopId={tpopId}/tpopKontrtyp={tpopKontrtyp?}/user={user}',
    handler: queryFeldkontrInsert
});

server.route({
    method: 'DELETE',
    path: '/api/v1/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
    handler: queryTabelleDeleteApflora
});

server.route({
    method: 'GET',
    path: '/api/v1/lrDelarze',
    handler: queryLrDelarze
});

server.route({
    method: 'GET',
    path: '/api/v1/tpopMassnTypen',
    handler: queryTpopMassnTypen
});

server.route({
    method: 'GET',
    path: '/api/v1/ap={apId}',
    handler: queryAp
});

server.route({
    method: 'POST',
    path: '/api/v1/apInsert/apId={apId}/user={user}',
    handler: queryApInsert
});

server.route({
    method: 'GET',
    path: '/api/v1/feldkontrZaehleinheit',
    handler: queryFeldkontrZaehleinheit
});

server.route({
    method: 'GET',
    path: '/api/v1/idealbiotopUebereinst',
    handler: queryIdealbiotopUebereinst
});

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 * Beispiel: BeoListe, FeldListe, tree
 */

server.route({
    method: 'GET',
    path: '/api/v1/tree/apId={apId}',
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
                { method: treeApziel, assign: 'apziel' },
                { method: treePop, assign: 'pop' }
            ]

        ],
        handler: function (request, reply) {
            reply([
                request.pre.pop,
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
    path: '/api/v1/beobDistzutpopEvab/beobId={beobId}',
    handler: queryBeobDistzutpopEvab
});

server.route({
    method: 'GET',
    path: '/api/v1/beobDistzutpopInfospezies/beobId={beobId}',
    handler: queryBeobDistzutpopInfospezies
});

server.route({
    method: 'GET',
    path: '/api/v1/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}',
    handler: queryBeobNaechsteTpop
});

server.route({
    method: 'GET',
    path: '/api/v1/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}',
    handler: queryBeobKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/apKarte/apId={apId}',
    handler: queryApKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/popKarte/popId={popId}',
    handler: queryPopKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/popKarteAlle/apId={apId}',
    handler: queryPopKarteAlle
});

server.route({
    method: 'GET',
    path: '/api/v1/popChKarte/popId={popId}',
    handler: queryPopChKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/popsChKarte/apId={apId}',
    handler: queryPopsChKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/tpopKarte/tpopId={tpopId}',
    handler: queryTPopKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/tpopsKarte/popId={popId}',
    handler: queryTPopsKarte
});

server.route({
    method: 'GET',
    path: '/api/v1/tpopKarteAlle/apId={apId}',
    handler: queryTPopKarteAlle
});

server.route({
    method: 'GET',
    path: '/api/v1/exportView/xslx/view={view}',
    //handler: exportView
    handler: function (request, reply) {
        exportView(request, function (err, data) {
            reply(data)
                .header('Content-Type', 'application/json;')
                .header('Accept', 'application/json;')
                //.header('Content-disposition', 'attachment; filename=' + filename + '.csv')
                .header('Pragma', 'no-cache');
                //.header('Set-Cookie', 'fileDownload=true; path=/');
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/v1/exportView/csv/view={view}/filename={filename}',
    handler: function (request, reply) {
        var filename = request.params.filename;
        exportView(request, function (err, data) {
            var fields = _.keys(data[0]);
            json2csv({
                data: data,
                fields: fields
            }, function (err, csv) {
                if (err) {
                    console.log(err);
                }
                reply(csv)
                    .header('Content-Type', 'text/x-csv; charset=utf-8')
                    .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
                    .header('Pragma', 'no-cache')
                    .header('Set-Cookie', 'fileDownload=true; path=/');
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/v1/exportViewWhereIdIn/csv/view={view}/idName={idName}/idListe={idListe}/filename={filename}',
    handler: function (request, reply) {
        var filename = request.params.filename;
        exportViewWhereIdIn(request, function (data) {
            var fields = _.keys(data[0]);
            json2csv({
                data: data,
                fields: fields
            }, function (err, csv) {
                if (err) { console.log(err); }
                reply(csv)
                    .header('Content-Type', 'text/x-csv; charset=utf-8')
                    .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
                    .header('Pragma', 'no-cache')
                    .header('Set-Cookie', 'fileDownload=true; path=/');
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/v1/exportView/kml/view={view}/filename={filename}',
    handler: function (request, reply) {
        var filename = request.params.filename,
            view     = request.params.view,
            kml;

        exportView(request, function (err, data) {
            switch (view) {
            case 'vPopFuerKml':
            case 'vPopFuerKmlNamen':
                kml = getKmlForPop(data);
                break;
            case 'vTPopFuerKml':
            case 'vTPopFuerKmlNamen':
                kml = getKmlForTpop(data);
                break;
            }
            if (kml) {
                reply(kml)
                    .header('Content-Type', 'application/vnd.google-earth.kml+xml kml; charset=utf-8')
                    .header('Content-disposition', 'attachment; filename=' + filename + '.kml')
                    .header('Pragma', 'no-cache')
                    .header('Set-Cookie', 'fileDownload=true; path=/');
            }
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/v1/aktualisiereArteigenschaften',
    handler: function (request, reply) {
        aktualisiereArteigenschaften(request, reply);
    }
});