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
config.forms = {
    ap: {
        tabelleInDb: 'tblAktionsplan',
        tabelleIdFeld: 'ApArtId'
    },
    pop: {
        tabelleInDb: 'tblPopulation',
        tabelleIdFeld: 'PopId'
    },
    tpop: {
        tabelleInDb: 'tblTeilpopulation',
        tabelleIdFeld: 'TPopId'
    },
    tpopfeldkontr: {
        tabelleInDb: 'tblTeilPopFeldkontrolle',
        tabelleIdFeld: 'TPopKontrId'
    },
    tpopmassn: {
        tabelleInDb: 'tblTeilPopMassnahme',
        tabelleIdFeld: 'TPopMassnId'
    },
    apziel: {
        tabelleInDb: 'tblZiel',
        tabelleIdFeld: 'ZielId'
    },
    zielber: {
        tabelleInDb: 'tblZielBericht',
        tabelleIdFeld: 'ZielBerId'
    },
    erfkrit: {
        tabelleInDb: 'tblErfKrit',
        tabelleIdFeld: 'ErfkritId'
    },
    jber: {
        tabelleInDb: 'tblJBer',
        tabelleIdFeld: 'JBerId'
    },
    jber_uebersicht: {
        tabelleInDb: 'tblJBerUebersicht',
        tabelleIdFeld: 'JbuJahr'
    },
    ber: {
        tabelleInDb: 'tblBer',
        tabelleIdFeld: 'BerId'
    },
    idealbiotop: {
        tabelleInDb: 'tblIdealbiotop',
        tabelleIdFeld: 'IbApArtId'
    },
    assozarten: {
        tabelleInDb: 'tblAssozArten',
        tabelleIdFeld: 'AaId'
    },
    popber: {
        tabelleInDb: 'tblPopBericht',
        tabelleIdFeld: 'PopBerId'
    },
    popmassnber: {
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId'
    },
    tpopber: {
        tabelleInDb: 'tblTeilPopBericht',
        tabelleIdFeld: 'TPopBerId'
    },
    tpopmassnber: {
        tabelleInDb: 'tblPopMassnBericht',
        tabelleIdFeld: 'PopMassnBerId'
    },
    beob: {
        tabelleInDb: 'tblBeobZuordnung',
        tabelleIdFeld: 'NO_NOTE'
    }
};

module.exports = config;