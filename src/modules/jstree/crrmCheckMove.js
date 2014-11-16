// hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (m) {
    if (m.o.attr("typ") === "pop") {
        if (m.r.attr("typ") === "pop") {
            return {
                after: true,
                before: true,
                inside: false
            };
        }
        return false;
    }
    if (m.o.attr("typ") === "tpop") {
        switch (m.r.attr("typ")) {
        case 'tpop':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'pop_ordner_tpop':
            return {
                after: false,
                before: false,
                inside: true
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "tpopmassn") {
        switch (m.r.attr("typ")) {
        case 'tpopmassn':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpop_ordner_massn':
            return {
                after: false,
                before: false,
                inside: true
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "tpopfeldkontr") {
        switch (m.r.attr("typ")) {
        case 'tpopfeldkontr':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpop_ordner_feldkontr':
            return {
                after: false,
                before: false,
                inside: true
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "tpopfreiwkontr") {
        switch (m.r.attr("typ")) {
        case 'tpopfreiwkontr':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpop_ordner_freiwkontr':
            return {
                after: false,
                before: false,
                inside: true
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "beob_zugeordnet") {
        switch (m.r.attr("typ")) {
        case 'beob_zugeordnet':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpop_ordner_beob_zugeordnet':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'ap_ordner_beob_nicht_beurteilt':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beob_nicht_beurteilt':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'ap_ordner_beob_nicht_zuzuordnen':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beob_nicht_zuzuordnen':
            return {
                after: true,
                before: true,
                inside: false
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "beob_nicht_beurteilt") {
        switch (m.r.attr("typ")) {
        case 'beob_zugeordnet':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpop_ordner_beob_zugeordnet':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'ap_ordner_beob_nicht_beurteilt':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beob_nicht_beurteilt':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'ap_ordner_beob_nicht_zuzuordnen':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beob_nicht_zuzuordnen':
            return {
                after: true,
                before: true,
                inside: false
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "beob_nicht_zuzuordnen") {
        switch (m.r.attr("typ")) {
        case 'beob_zugeordnet':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpop_ordner_beob_zugeordnet':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'ap_ordner_beob_nicht_beurteilt':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beob_nicht_beurteilt':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'ap_ordner_beob_nicht_zuzuordnen':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beob_nicht_zuzuordnen':
            return {
                after: true,
                before: true,
                inside: false
            };
        default:
            return false;
        }
    }
    return false;
};