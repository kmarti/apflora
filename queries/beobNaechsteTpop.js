/*jslint node: true, browser: true */
'use strict';


var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var tabelle = function (request, callback) {
    var apId = decodeURIComponent(request.params.apId),
        X    = decodeURIComponent(request.params.X),
        Y    = decodeURIComponent(request.params.Y);
    connection.query(
        'SELECT TPopId, TPopFlurname, SQRT((' + X + '-TPopXKoord)*(' + X + '-TPopXKoord)+(' + Y + '-TPopYKoord)*(' + Y + '-TPopYKoord)) AS DistZuTPop FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId WHERE ApArtId = ' + apId + ' AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL ORDER BY DistzuTPop LIMIT 1',
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = tabelle;