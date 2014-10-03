'use strict';

var mysql      = require('mysql'),
    config     = require('../src/modules/configuration'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: config.db.userName,
        password: config.db.passWord,
        database: 'alexande_apflora'
    });

var distzutpop = function (request, callback) {
    var beobId = decodeURIComponent(request.params.beobId);
    connection.query(
        'SELECT NO_NOTE, NO_ISFS, alexande_apflora.tblTeilpopulation.TPopId, FNS_XGIS, FNS_YGIS, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((FNS_XGIS-TPopXKoord)*(FNS_XGIS-TPopXKoord)+(FNS_YGIS-TPopYKoord)*(FNS_YGIS-TPopYKoord)) AS DistZuTPop FROM alexande_beob.tblBeobInfospezies INNER JOIN (alexande_apflora.tblPopulation INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE ="' + beobId + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND FNS_XGIS IS NOT NULL AND FNS_YGIS IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
        function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
};

module.exports = distzutpop;