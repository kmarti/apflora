// in DOM-Objekten sind viele ID's der Name des DOM-Elements vorangestellt, damit die ID eindeutig ist
// ACHTUNG auf die Reihenfolge der Ersatzbefehle. Sonst wird z.B. in 'tpopber' 'popber' ersetzt und es bleibt 't'

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

module.exports = function (domAttributId) {
    var returnWert;

    if (!domAttributId) {
        return null;
    }

    returnWert = domAttributId.replace('apOrdnerPop', '').replace('apOrdnerApziel', '').replace('apOrdnerErfkrit', '').replace('apOrdnerJber', '').replace('apOrdnerBer', '').replace('apOrdnerBeobNichtBeurteilt', '').replace('apOrdnerBeobNichtZuzuordnen', '').replace('idealbiotop', '').replace('apOrdnerAssozarten', '').replace('tpopOrdnerMassnber', '').replace('tpopOrdnerMassn', '').replace('tpopmassnber', '').replace('tpopmassn', '').replace('popOrdnerMassnber', '').replace('popmassnber', '').replace('tpopOrdnerFeldkontr', '').replace('tpopOrdnerFreiwkontr', '').replace('tpopfreiwkontr', '').replace('tpopOrdnerTpopber', '').replace('tpopber', '').replace('popOrdnerPopber', '').replace('popber', '').replace('tpopOrdnerBeobZugeordnet', '').replace('beob', '').replace('ber', '');

    if (domAttributId == returnWert && parseInt(returnWert, 10) && parseInt(returnWert, 10) != returnWert) {
        console.log('window.apf.erstelleIdAusDomAttributId meldet: erhalten ' + domAttributId + ', zurückgegeben: ' + returnWert + '. Die Regel in der function muss wohl angepasst werden');
    }

    return returnWert;
};