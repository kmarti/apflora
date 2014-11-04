/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var config = {},
    dbPassfile   = require('../../dbPass.json');

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
        form: 'ap',
        initiiereFunktion: 'initiiereAp',
        treeTyp: 'gibt es nicht!'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopulation',
        tabelleIdFeld: 'PopId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'pop',
        initiiereFunktion: 'initiierePop',
        treeTyp: 'pop'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilpopulation',
        tabelleIdFeld: 'TPopId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpop',
        initiiereFunktion: 'initiiereTPop',
        treeTyp: 'tpop'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopFeldkontrolle',
        tabelleIdFeld: 'TPopKontrId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopfeldkontr',
        initiiereFunktion: 'initiiereTPopFeldkontr',
        treeTyp: 'tpopfeldkontr'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopMassnahme',
        tabelleIdFeld: 'TPopMassnId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopmassn',
        initiiereFunktion: 'initiiereTPopMassn',
        treeTyp: 'tpopmassn'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblZiel',
        tabelleIdFeld: 'ZielId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'apziel',
        initiiereFunktion: 'initiiereApziel',
        treeTyp: 'apziel'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblZielBericht',
        tabelleIdFeld: 'ZielBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'zielber',
        initiiereFunktion: 'initiiereZielber',
        treeTyp: 'zielber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblErfKrit',
        tabelleIdFeld: 'ErfkritId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'erfkrit',
        initiiereFunktion: 'initiiereErfkrit',
        treeTyp: 'erfkrit'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblJBer',
        tabelleIdFeld: 'JBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'jber',
        initiiereFunktion: 'initiiereJber',
        treeTyp: 'jber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblJBerUebersicht',
        tabelleIdFeld: 'JbuJahr',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'jber_uebersicht',
        initiiereFunktion: 'initiiereJberUebersicht',
        treeTyp: 'jber_uebersicht'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblBer',
        tabelleIdFeld: 'BerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'ber',
        initiiereFunktion: 'initiiereBer',
        treeTyp: 'ber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblIdealbiotop',
        tabelleIdFeld: 'IbApArtId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'idealbiotop',
        initiiereFunktion: 'initiiereIdealbiotop',
        treeTyp: 'idealbiotop'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblAssozArten',
        tabelleIdFeld: 'AaId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'assozarten',
        initiiereFunktion: 'initiiereAssozart',
        treeTyp: 'assozarten'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopBericht',
        tabelleIdFeld: 'PopBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'popber',
        initiiereFunktion: 'initiierePopBer',
        treeTyp: 'popber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'popmassnber',
        initiiereFunktion: 'initiierePopMassnBer',
        treeTyp: 'popmassnber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopBericht',
        tabelleIdFeld: 'TPopBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopber',
        initiiereFunktion: 'initiiereTPopBer',
        treeTyp: 'tpopber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblTeilPopMassnBericht',
        tabelleIdFeld: 'TPopMassnBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopmassnber',
        initiiereFunktion: 'initiiereTPopMassnBer',
        treeTyp: 'tpopmassnber'
    },
    {
        database: 'apflora',
        tabelleInDb: 'tblBeobZuordnung',
        tabelleIdFeld: 'NO_NOTE',
        mutWannFeld: 'BeobMutWann',
        mutWerFeld: 'BeobMutWer',
        initiiereFunktion: '',
        treeTyp: 'drei verschiedene!'
    }
];

module.exports = config;