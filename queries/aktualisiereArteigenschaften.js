/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var mysql              = require('mysql'),
    _                  = require('underscore'),
    async              = require('async'),
    config             = require('../src/modules/configuration'),
    escapeStringForSql = require('./escapeStringForSql'),
    request            = require('request'),
    createInsertSqlFromObjectArray = require('./createInsertSqlFromObjectArray'),
    connection = mysql.createConnection({
        host:     'localhost',
        user:     config.db.userName,
        password: config.db.passWord,
        database: 'alexande_beob'
    });

// teilt einen Array in gleiche Teile
function split(a, n) {
    var len = a.length,
        out = [],
        i = 0,
        size;
    while (i < len) {
        size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
}

module.exports = function (req, reply) {
    // neue Daten holen
    request({
        method: 'GET',
        uri: 'http://arteigenschaften.ch/artendb/_design/artendb/_list/export_apflora/flora?include_docs=true',
        json: true
    }, function (error, response, body) {
        if (error) { throw error; }
        if (!error && response.statusCode == 200) {
            // empty table
            connection.query(
                'TRUNCATE TABLE alexande_beob.ArtenDb_Arteigenschaften',
                function (err) {
                    if (err) { throw err; }
                    // Daten müssen in drei Teile aufgeteilt werden
                    // sonst gibt es bei der Verarbeitung Abstürze
                    // Idee: mit async.series automatisieren
                    var artenArray = split(body, 3),
                        eigenschaftenString0 = createInsertSqlFromObjectArray(artenArray[0]),
                        eigenschaftenString1 = createInsertSqlFromObjectArray(artenArray[1]),
                        eigenschaftenString2 = createInsertSqlFromObjectArray(artenArray[2]),
                        sqlBase = 'INSERT INTO alexande_beob.ArtenDb_Arteigenschaften (GUID, TaxonomieId, Familie, Artname, NameDeutsch, Status, Artwert, KefArt, KefKontrolljahr, FnsJahresartJahr) VALUES ',
                        sql;

                    // add new values
                    sql = sqlBase + eigenschaftenString0;

                    connection.query(
                        sql,
                        function (err) {
                            //console.log('eigenschaftenString0 verarbeitet');
                            if (err) {
                                reply('Fehler: Die Arteigenschaften wurden nicht aktualisiert');
                                throw err;
                            }
                            sql = sqlBase + eigenschaftenString1;
                            connection.query(
                                sql,
                                function (err) {
                                    //console.log('eigenschaftenString1 verarbeitet');
                                    if (err) {
                                        reply('Fehler: Die Arteigenschaften wurden nicht aktualisiert');
                                        throw err;
                                    }
                                    sql = sqlBase + eigenschaftenString2;
                                    connection.query(
                                        sql,
                                        function (err) {
                                            //console.log('eigenschaftenString2 verarbeitet');
                                            if (err) {
                                                reply('Fehler: Die Arteigenschaften wurden nicht aktualisiert');
                                                throw err;
                                            }
                                            reply('Arteigenschaften hinzugefügt');
                                            connection.end();
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    });
};