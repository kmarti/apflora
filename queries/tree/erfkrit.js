/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var _          = require('underscore'),
    mysql      = require('mysql'),
    config     = require('../../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var erfkrit = function (request, reply) {
    var apId = decodeURIComponent(request.params.apId);
    connection.query(
        'SELECT ErfkritId, ApArtId, BeurteilTxt, ErfkritTxt, BeurteilOrd FROM tblErfKrit LEFT JOIN DomainApErfKrit ON ErfkritErreichungsgrad = BeurteilId where ApArtId = ' + apId + ' ORDER BY BeurteilOrd',
        function (err, data) {
            var node = {};

            if (err) reply(err);

            node.data = 'AP-Erfolgskriterien (' + data.length + ')';
            node.attr = {
                id: 'apOrdnerErfkrit' + apId,
                typ: 'apOrdnerErfkrit'
            };
            node.children = buildChildFromData(data);

            reply(null, node);
        }
    );
};

function buildChildFromData(data) {
    var childrenArray = [],
        object,
        beschriftung;

    _.each(data, function (erfkrit) {
        object = {};

        if (erfkrit.BeurteilTxt && erfkrit.ErfkritTxt) {
            beschriftung = erfkrit.BeurteilTxt + ': ' + erfkrit.ErfkritTxt;
        } else if (erfkrit.BeurteilTxt) {
            beschriftung = erfkrit.BeurteilTxt + ': (kein Kriterium)';
        } else if (erfkrit.ErfkritTxt) {
            beschriftung = '(keine Beurteilung): ' + erfkrit.ErfkritTxt;
        } else {
            beschriftung = '(keine Beurteilung): (kein Kriterium)';
        }

        object.data = beschriftung;

        // erfkrit voransetzen, damit die ID im ganzen Baum eindeutig ist
        object.attr = {
            id: erfkrit.ErfkritId,
            typ: 'erfkrit'
        };
        childrenArray.push(object);
    });

    return childrenArray;
}

module.exports = erfkrit;