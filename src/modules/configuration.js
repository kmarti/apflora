/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var config         = {},
    dbPassfile     = require('../../dbPass.json');

config.db          = {};
config.db.userName = dbPassfile.user;
config.db.passWord = dbPassfile.pass;

// für alle Formulare auflisten:
// Formularname, Name der entsprechenden Tabelle in der DB, Name der ID dieser Tabelle
// wird benutzt, um mit denselben Abfragen in diesen Tabelle durchzuführen: update, insert, delete
config.tables = [
    {
        database:          'apflora',
        tabelleInDb:       'tblAp',
        tabelleIdFeld:     'ApArtId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'ap',
        initiiereFunktion: 'initiiereAp',
        treeTyp:           'gibt es nicht!'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblPop',
        tabelleIdFeld:     'PopId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'pop',
        initiiereFunktion: 'initiierePop',
        treeTyp:           'pop'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblTPop',
        tabelleIdFeld:     'TPopId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'tpop',
        initiiereFunktion: 'initiiereTPop',
        treeTyp:           'tpop'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblTPopKontr',
        tabelleIdFeld:     'TPopKontrId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'tpopfeldkontr',
        initiiereFunktion: 'initiiereTPopKontr',
        treeTyp:           'tpopfeldkontr'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblTPopKontrZaehl',
        tabelleIdFeld:     'TPopKontrZaehlId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'tpopkontrzaehl',
        initiiereFunktion: 'initiiereTPopKontr',
        treeTyp:           'tpopfeldkontr'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblTPopMassn',
        tabelleIdFeld:     'TPopMassnId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'tpopmassn',
        initiiereFunktion: 'initiiereTPopMassn',
        treeTyp:           'tpopmassn'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblZiel',
        tabelleIdFeld:     'ZielId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'apziel',
        initiiereFunktion: 'initiiereApziel',
        treeTyp:           'apziel'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblZielBer',
        tabelleIdFeld:     'ZielBerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'zielber',
        initiiereFunktion: 'initiiereZielber',
        treeTyp:           'zielber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblErfKrit',
        tabelleIdFeld:     'ErfkritId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'erfkrit',
        initiiereFunktion: 'initiiereErfkrit',
        treeTyp:           'erfkrit'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblJBer',
        tabelleIdFeld:     'JBerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'jber',
        initiiereFunktion: 'initiiereJber',
        treeTyp:           'jber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblJBerUebersicht',
        tabelleIdFeld:     'JbuJahr',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'jberUebersicht',
        initiiereFunktion: 'initiiereJberUebersicht',
        treeTyp:           'jberUebersicht'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblBer',
        tabelleIdFeld:     'BerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'ber',
        initiiereFunktion: 'initiiereBer',
        treeTyp:           'ber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblIdealbiotop',
        tabelleIdFeld:     'IbApArtId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'idealbiotop',
        initiiereFunktion: 'initiiereIdealbiotop',
        treeTyp:           'idealbiotop'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblAssozArten',
        tabelleIdFeld:     'AaId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'assozarten',
        initiiereFunktion: 'initiiereAssozart',
        treeTyp:           'assozarten'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblPopBer',
        tabelleIdFeld:     'PopBerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'popber',
        initiiereFunktion: 'initiierePopBer',
        treeTyp:           'popber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblPopMassnBer',
        tabelleIdFeld:     'PopMassnBerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'popmassnber',
        initiiereFunktion: 'initiierePopMassnBer',
        treeTyp:           'popmassnber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblTPopBer',
        tabelleIdFeld:     'TPopBerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'tpopber',
        initiiereFunktion: 'initiiereTPopBer',
        treeTyp:           'tpopber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblTPopMassnBer',
        tabelleIdFeld:     'TPopMassnBerId',
        mutWannFeld:       'MutWann',
        mutWerFeld:        'MutWer',
        form:              'tpopmassnber',
        initiiereFunktion: 'initiiereTPopMassnBer',
        treeTyp:           'tpopmassnber'
    },
    {
        database:          'apflora',
        tabelleInDb:       'tblBeobZuordnung',
        tabelleIdFeld:     'NO_NOTE',
        mutWannFeld:       'BeobMutWann',
        mutWerFeld:        'BeobMutWer',
        initiiereFunktion: '',
        treeTyp:           'drei verschiedene!'
    }
];

module.exports = config;