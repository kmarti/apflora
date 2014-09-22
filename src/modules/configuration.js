/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

'use strict';

var config = {}
    , dbPassfile = require('./dbPass')
    ;

config.db = {};
config.db.userName = dbPassfile.user;
config.db.passWord = dbPassfile.pass;

// für alle Formulare auflisten:
// Formularname, Name der entsprechenden Tabelle in der DB, Name der ID dieser Tabelle
// wird benutzt, um mit denselben Abfragen in diesen Tabelle durchzuführen: update, insert, delete
config.forms = {
    ap: {
        tabelleInDb: 'tblAktionsplan',
        idInTabelle: 'ApArtId'
    },
    pop: {
        tabelleInDb: 'tblPopulation',
        idInTabelle: 'PopId'
    },
    tpop: {
        tabelleInDb: 'tblTeilpopulation',
        idInTabelle: 'TPopId'
    },
    tpopfeldkontr: {
        tabelleInDb: 'tblTeilPopFeldkontrolle',
        idInTabelle: 'TPopKontrId'
    },
    tpopmassn: {
        tabelleInDb: 'tblTeilPopMassnahme',
        idInTabelle: 'TPopMassnId'
    },
    apziel: {
        tabelleInDb: 'tblZiel',
        idInTabelle: 'ZielId'
    },
    zielber: {
        tabelleInDb: 'tblZielBericht',
        idInTabelle: 'ZielBerId'
    },
    erfkrit: {
        tabelleInDb: 'tblErfKrit',
        idInTabelle: 'ErfkritId'
    },
    jber: {
        tabelleInDb: 'tblJBer',
        idInTabelle: 'JBerId'
    },
    jber_uebersicht: {
        tabelleInDb: 'tblJBerUebersicht',
        idInTabelle: 'JbuJahr'
    },
    ber: {
        tabelleInDb: 'tblBer',
        idInTabelle: 'BerId'
    },
    idealbiotop: {
        tabelleInDb: 'tblIdealbiotop',
        idInTabelle: 'IbApArtId'
    },
    assozarten: {
        tabelleInDb: 'tblAssozArten',
        idInTabelle: 'AaId'
    },
    popber: {
        tabelleInDb: 'tblPopBericht',
        idInTabelle: 'PopBerId'
    },
    popmassnber: {
        tabelleInDb: 'tblPopMassnBericht',
        idInTabelle: 'PopMassnBerId'
    },
    tpopber: {
        tabelleInDb: 'tblTeilPopBericht',
        idInTabelle: 'TPopBerId'
    },
    tpopmassnber: {
        tabelleInDb: 'tblPopMassnBericht',
        idInTabelle: 'PopMassnBerId'
    },
    beob: {
        tabelleInDb: 'tblBeobZuordnung',
        idInTabelle: 'NO_NOTE'
    }
};

module.exports = config;