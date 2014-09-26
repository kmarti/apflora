/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

'use strict';

var config = {}
    , dbPassfile   = require('./dbPass.json')
    ;

config.db          = {};
config.db.userName = dbPassfile.user;
config.db.passWord = dbPassfile.pass;

// für alle Formulare auflisten:
// Formularname, Name der entsprechenden Tabelle in der DB, Name der ID dieser Tabelle
// wird benutzt, um mit denselben Abfragen in diesen Tabelle durchzuführen: update, insert, delete
config.tables = [
    {
        tabelleInDb: 'tblAktionsplan',
        tabelleIdFeld: 'ApArtId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'ap'
    },
    {
        tabelleInDb: 'tblPopulation',
        tabelleIdFeld: 'PopId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'pop'
    },
    {
        tabelleInDb: 'tblTeilpopulation',
        tabelleIdFeld: 'TPopId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpop'
    },
    {
        tabelleInDb: 'tblTeilPopFeldkontrolle',
        tabelleIdFeld: 'TPopKontrId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopfeldkontr'
    },
    {
        tabelleInDb: 'tblTeilPopMassnahme',
        tabelleIdFeld: 'TPopMassnId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopmassn'
    },
    {
        tabelleInDb: 'tblZiel',
        tabelleIdFeld: 'ZielId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'apziel'
    },
    {
        tabelleInDb: 'tblZielBericht',
        tabelleIdFeld: 'ZielBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'zielber'
    },
    {
        tabelleInDb: 'tblErfKrit',
        tabelleIdFeld: 'ErfkritId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'erfkrit'
    },
    {
        tabelleInDb: 'tblJBer',
        tabelleIdFeld: 'JBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'jber'
    },
    {
        tabelleInDb: 'tblJBerUebersicht',
        tabelleIdFeld: 'JbuJahr',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'jber_uebersicht'
    },
    {
        tabelleInDb: 'tblBer',
        tabelleIdFeld: 'BerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'ber'
    },
    {
        tabelleInDb: 'tblIdealbiotop',
        tabelleIdFeld: 'IbApArtId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'idealbiotop'
    },
    {
        tabelleInDb: 'tblAssozArten',
        tabelleIdFeld: 'AaId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'assozarten'
    },
    {
        tabelleInDb: 'tblPopBericht',
        tabelleIdFeld: 'PopBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'popber'
    },
    {
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'popmassnber'
    },
    {
        tabelleInDb: 'tblTeilPopBericht',
        tabelleIdFeld: 'TPopBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopber'
    },
    {
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId',
        mutWannFeld: 'MutWann',
        mutWerFeld: 'MutWer',
        form: 'tpopmassnber'
    },
    {
        tabelleInDb: 'tblBeobZuordnung',
        tabelleIdFeld: 'NO_NOTE',
        mutWannFeld: 'BeobMutWann',
        mutWerFeld: 'BeobMutWer',
        form: 'beob'
    }
];

module.exports = config;