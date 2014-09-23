'use strict';

var $ = require('jquery'),
    dateFormat = require('dateformat');

var initiiereIdealbiotop = function() {
    'use strict';
    if (!localStorage.ap_id) {
        // es fehlen benötigte Daten > eine Ebene höher
        window.apf.initiiere_ap();
        return;
    }
    // Felder zurücksetzen
    window.apf.leereFelderVonFormular("idealbiotop");
    // Daten für die idealbiotop aus der DB holen
    var getIdealbiotop = $.ajax({
            type: 'get',
            url: '/api/select/tabelle=tblIdealbiotop/tabelleIdFeld=IbApArtId/tabelleId=' + localStorage.ap_id,
            dataType: 'json'
        }),
        $IbErstelldatum = $("#IbErstelldatum");
    getIdealbiotop.always(function(data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // idealbiotop bereitstellen
            localStorage.idealbiotop_id = data.IbApArtId;
            window.apf.idealbiotop = data;
            // Felder mit Daten beliefern
            if (data.IbErstelldatum) $("#IbErstelldatum").val(dateFormat(data.IbErstelldatum, 'dd.mm.yyyy'));
            $("#IbHoehenlage").val(data.IbHoehenlage);
            $("#IbRegion").val(data.IbRegion);
            $("#IbExposition").val(data.IbExposition);
            $("#IbBesonnung").val(data.IbBesonnung);
            $("#IbHangneigung").val(data.IbHangneigung);
            $("#IbBodenTyp").val(data.IbBodenTyp);
            $("#IbBodenKalkgehalt").val(data.IbBodenKalkgehalt);
            $("#IbBodenDurchlaessigkeit").val(data.IbBodenDurchlaessigkeit);
            $("#IbBodenHumus").val(data.IbBodenHumus);
            $("#IbBodenNaehrstoffgehalt").val(data.IbBodenNaehrstoffgehalt);
            $("#IbWasserhaushalt").val(data.IbWasserhaushalt);
            $("#IbKonkurrenz").val(data.IbKonkurrenz);
            $("#IbMoosschicht").val(data.IbMoosschicht);
            $("#IbKrautschicht").val(data.IbKrautschicht);
            $("#IbStrauchschicht").val(data.IbStrauchschicht);
            $("#IbBaumschicht").val(data.IbBaumschicht);
            $("#IbBemerkungen").val(data.IbBemerkungen);
            // Formulare blenden
            window.apf.zeigeFormular("idealbiotop");
            history.replaceState({idealbiotop: "idealbiotop"}, "idealbiotop", "index.html?ap=" + localStorage.ap_id + "&idealbiotop=" + localStorage.idealbiotop_id);
            // bei neuen Datensätzen Fokus steuern
            if (!$IbErstelldatum.val()) {
                $IbErstelldatum.focus();
            }
        } else {
            // nur aktualisieren, wenn Schreibrechte bestehen
            if (!window.apf.prüfeSchreibvoraussetzungen()) {
                return;
            }

            // null zurückgekommen > Datesatz schaffen
            var insertIdealbiotop = $.ajax({
                type: 'post',
                url: '/api/insert/tabelle=tblIdealbiotop/feld=IbApArtId/wert=' + localStorage.ap_id + '/user=' + sessionStorage.User,
                dataType: 'json'
            });
            insertIdealbiotop.always(function(data) {
                localStorage.idealbiotop_id = data.IbApArtId;
                window.apf.initiiere_idealbiotop();
            });
            insertIdealbiotop.fail(function() {
                //window.apf.melde("Fehler: Kein Idealbiotop erstellt");
                console.log("Fehler: Kein Idealbiotop erstellt");
            });
        }
    });
};

module.exports = initiiereIdealbiotop;