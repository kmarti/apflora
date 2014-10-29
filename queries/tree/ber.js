/*jslint node: true, browser: true, nomen: true */
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

var ber = function (request, reply) {
    var apId = decodeURIComponent(request.params.apId);
    connection.query(
        "SELECT BerId, ApArtId, BerJahr, BerTitel FROM tblBer where ApArtId =" + apId + " ORDER BY BerJahr DESC, BerTitel",
        function (err, data) {
            var node = {};

            if (err) reply(err);

            node.data = 'Berichte (' + data.length + ')';
            node.attr = {
                id: 'ap_ordner_ber' + apId,
                typ: 'ap_ordner_ber'
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

    _.each(data, function (ber) {
        object = {};

        if (ber.BerJahr && ber.BerTitel) {
            beschriftung = ber.BerJahr + ': ' + ber.BerTitel;
        } else if (ber.BerJahr) {
            beschriftung = ber.BerJahr + ': (kein Titel)';
        } else if (ber.BerTitel) {
            beschriftung = '(kein Jahr): ' + ber.BerTitel;
        } else {
            beschriftung = '(kein Jahr): (kein Titel)';
        }

        object.data = beschriftung;

        // ber voransetzen, damit die ID im ganzen Baum eindeutig ist
        object.attr = {
            id: ber.BerId,
            typ: 'ber'
        };
        childrenArray.push(object);
    });

    return childrenArray;
}

module.exports = ber;