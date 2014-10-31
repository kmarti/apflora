/**
 * leert die localStorage
 */

/*jslint node: true, browser: true, nomen: true */
'use strict';

var returnFunction = function () {
    delete localStorage.ap_id;
    delete localStorage.apziel_id;
    delete localStorage.assozarten_id;
    delete localStorage.beob_id;
    delete localStorage.beob_status;
    delete localStorage.beobtyp;
    delete localStorage.ber_id;
    delete localStorage.erfkrit_id;
    delete localStorage.idealbiotop_id;
    delete localStorage.jber_id;
    delete localStorage.jber_uebersicht_id;
    delete localStorage.pop_id;
    delete localStorage.popber_id;
    delete localStorage.popmassnber_id;
    delete localStorage.tpop_id;
    delete localStorage.tpopber_id;
    delete localStorage.tpopfeldkontr_id;
    delete localStorage.tpopfreiwkontr_id;
    delete localStorage.tpopmassn_id;
    delete localStorage.tpopmassnber_id;
    delete localStorage.zielber_id;
};

module.exports = returnFunction;