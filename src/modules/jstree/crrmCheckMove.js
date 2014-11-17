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
        case 'popOrdnerTpop':
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
        case 'tpopOrdnerMassn':
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
        case 'tpopOrdnerFeldkontr':
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
        case 'tpopOrdnerFreiwkontr':
            return {
                after: false,
                before: false,
                inside: true
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "beobZugeordnet") {
        switch (m.r.attr("typ")) {
        case 'beobZugeordnet':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpopOrdnerBeobZugeordnet':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'apOrdnerBeobNichtBeurteilt':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beobNichtBeurteilt':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'apOrdnerBeobNichtZuzuordnen':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beobNichtZuzuordnen':
            return {
                after: true,
                before: true,
                inside: false
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "beobNichtBeurteilt") {
        switch (m.r.attr("typ")) {
        case 'beobZugeordnet':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpopOrdnerBeobZugeordnet':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'apOrdnerBeobNichtBeurteilt':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beobNichtBeurteilt':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'apOrdnerBeobNichtZuzuordnen':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beobNichtZuzuordnen':
            return {
                after: true,
                before: true,
                inside: false
            };
        default:
            return false;
        }
    }
    if (m.o.attr("typ") === "beobNichtZuzuordnen") {
        switch (m.r.attr("typ")) {
        case 'beobZugeordnet':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'tpopOrdnerBeobZugeordnet':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'apOrdnerBeobNichtBeurteilt':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beobNichtBeurteilt':
            return {
                after: true,
                before: true,
                inside: false
            };
        case 'apOrdnerBeobNichtZuzuordnen':
            return {
                after: false,
                before: false,
                inside: true
            };
        case 'beobNichtZuzuordnen':
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