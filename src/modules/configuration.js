/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

'use strict';

var config = {}
    , dbPassfile   = require('../../dbPass.json')
    ;

config.db          = {};
config.db.userName = dbPassfile.user;
config.db.passWord = dbPassfile.pass;

// für alle Formulare auflisten:
// Formularname, Name der entsprechenden Tabelle in der DB, Name der ID dieser Tabelle
// wird benutzt, um mit denselben Abfragen in diesen Tabelle durchzuführen: update, insert, delete
config.tables = [
    {
        database: 'apflora',
        tabelleInDb: 'tblAktionsplan',
        tabelleIdFeld: 'ApArtId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'ap'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopulation',
        tabelleIdFeld: 'PopId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'pop'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilpopulation',
        tabelleIdFeld: 'TPopId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpop'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopFeldkontrolle',
        tabelleIdFeld: 'TPopKontrId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopfeldkontr'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopMassnahme',
        tabelleIdFeld: 'TPopMassnId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopmassn'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblZiel',
        tabelleIdFeld: 'ZielId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'apziel'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblZielBericht',
        tabelleIdFeld: 'ZielBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'zielber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblErfKrit',
        tabelleIdFeld: 'ErfkritId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'erfkrit'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblJBer',
        tabelleIdFeld: 'JBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'jber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblJBerUebersicht',
        tabelleIdFeld: 'JbuJahr',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'jber_uebersicht'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblBer',
        tabelleIdFeld: 'BerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'ber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblIdealbiotop',
        tabelleIdFeld: 'IbApArtId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'idealbiotop'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblAssozArten',
        tabelleIdFeld: 'AaId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'assozarten'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopBericht',
        tabelleIdFeld: 'PopBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'popber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'popmassnber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopBericht',
        tabelleIdFeld: 'TPopBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopmassnber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblBeobZuordnung',
        tabelleIdFeld: 'NO_NOTE',
        mutWannFeld: 'BeobMutWann',
        mutWerFeld: 'BeobMutWer'
    }
];

module.exports = config;