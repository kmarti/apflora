/*jslint node: true, browser: true, nomen: true*/

// benötigte globale Variablen initialisieren
window.apf = window.apf || {};
window.apf.gmap = window.apf.gmap || {};
window.apf.olmap = window.apf.olmap || {};

window.apf.initiiereApp = require('./modules/initiiereApp');

// setzt window.apf und localStorage.apId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowAp = function (id) {
    'use strict';
    localStorage.apId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/ap=' + localStorage.apId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // ap bereitstellen
            window.apf.ap = data[0];
        }
    });
};

// setzt window.apf.pop und localStorage.popId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowPop = function (id) {
    'use strict';
    localStorage.popId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopulation/feld=PopId/wertNumber=' + localStorage.popId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // pop bereitstellen
            window.apf.pop = data[0];
        }
    });
};

// setzt window.apf.apziel und localStorage.apzielId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowApziel = function (id) {
    'use strict';
    localStorage.apzielId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblZiel/feld=ZielId/wertNumber=' + localStorage.apzielId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // apziel bereitstellen
            window.apf.apziel = data[0];
        }
    });
};

// setzt window.apf.zielber und localStorage.zielberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowZielber = function (id) {
    'use strict';
    localStorage.zielberId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblZielBericht/feld=ZielBerId/wertString=' + localStorage.zielberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // zielber bereitstellen
            window.apf.zielber = data[0];
        }
    });
};

// setzt window.apf.erfkrit und localStorage.erfkritId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowErfkrit = function (id) {
    'use strict';
    localStorage.erfkritId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblErfKrit/feld=ErfkritId/wertString=' + localStorage.erfkritId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // erfkrit bereitstellen
            window.apf.erfkrit = data[0];
        }
    });
};

// setzt window.apf.jber und localStorage.jberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowJber = function (id) {
    'use strict';
    localStorage.jberId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblJBer/feld=JBerId/wertNumber=' + localStorage.jberId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // jber bereitstellen
            window.apf.jber = data[0];
        }
    });
};

// setzt window.apf.jberUebersicht und localStorage.jberUebersichtId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowJberUebersicht = function (id) {
    'use strict';
    localStorage.jberUebersichtId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblJBerUebersicht/feld=JbuJahr/wertNumber=' + localStorage.jberUebersichtId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // jber_uebersicht bereitstellen
            window.apf.jberUebersicht = data[0];
        }
    });
};

// setzt window.apf.ber und localStorage.berId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowBer = function (id) {
    'use strict';
    localStorage.berId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblBer/feld=BerId/wertNumber=' + localStorage.berId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            data = data[0];
            // ber bereitstellen
            window.apf.ber = data;
        }
    });
};

// setzt window.apf.idealbiotop und localStorage.idealbiotopId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowIdealbiotop = function (id) {
    'use strict';
    localStorage.idealbiotopId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblIdealbiotop/feld=IbApArtId/wertNumber=' + localStorage.idealbiotopId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // idealbiotop bereitstellen
            window.apf.idealbiotop = data[0];
        }
    });
};

// setzt window.apf.assozarten und localStorage.assozartenId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowAssozarten = function (id) {
    'use strict';
    localStorage.assozartenId = id;
    $.ajax({
        type: 'get',
        url: '/api/v1/apflora/tabelle=tblAssozArten/feld=AaId/wertNumber=' + localStorage.assozartenId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data) {
            // assozarten bereitstellen
            window.apf.assozarten = data;
        }
    });
};

// setzt window.apf.popmassnber und localStorage.popmassnberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowPopmassnber = function (id) {
    'use strict';
    localStorage.popmassnberId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopMassnBericht/feld=PopMassnBerId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // popmassnber bereitstellen
            window.apf.popmassnber = data[0];
        }
    });
};

// setzt window.apf.tpop und localStorage.tpopId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpop = function (id) {
    'use strict';
    localStorage.tpopId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilpopulation/feld=TPopId/wertNumber=' + localStorage.tpopId
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpop bereitstellen
            window.apf.tpop = data[0];
        }
    });
};

window.apf.downloadFileFromView = function (view, filename, format) {
    // löst einen Download aus
    // als Formate steht momentan nur csv (und teilweise kml) zur Verfügung, weil xlsx leider nicht funktioniert hat
    var getTimestamp       = require('./modules/getTimestamp'),
        createBlobDataXlsx = require('./modules/createBlobDataXlsx'),
        url,
        blob,
        blobData;

    format = format || 'csv';

    if (format === 'xlsx') {
        // Daten als json holen
        // TODO: wird als text/html geholt!!!????
        $.ajax({
            /*beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
            },*/
            type: 'get',
            url: 'api/v1/exportView/xlsx/view=' + view,
            //contentType: "application/json",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).done(function (data) {
            // als Blob verpacken und downloaden
            blobData = createBlobDataXlsx(data);
            blob     = new Blob([blobData], {type: "application/octet-stream;charset=utf-8;"});
            saveAs(blob, filename + "_" + getTimestamp() + '.xlsx');
        });
    } else {
        url = 'api/v1/exportView/' + format + '/view=' + view + '/filename=' + filename + '_' + getTimestamp();
        $.fileDownload(url, {
            preparingMessageHtml: "Der Download wird vorbereitet, bitte warten...",
            failMessageHtml: "Beim Aufbereiten des Downloads ist ein Problem aufgetreten, bitte nochmals versuchen."
        });
    }
};

window.apf.downloadFileFromViewWehreIdIn = function (view, idName, idListe, filename, format) {
    // löst einen Download aus
    // als Formate steht momentan nur csv zur Verfügung, weil xlsx leider nicht funktioniert hat
    var getTimestamp = require('./modules/getTimestamp'),
        url;

    format = format || 'csv';
    url = 'api/v1/exportViewWhereIdIn/' + format + '/view=' + view + '/idName=' + idName + '/idListe=' + idListe + '/filename=' + filename + '_' + getTimestamp();

    $.fileDownload(url, {
        preparingMessageHtml: "Der Download wird vorbereitet, bitte warten...",
        failMessageHtml: "Beim Aufbereiten des Downloads ist ein Problem aufgetreten, bitte nochmals versuchen."
    });
};

// setzt window.apf.popber und localStorage.popberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowPopber = function (id) {
    'use strict';
    localStorage.popberId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblPopBericht/feld=PopBerId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // popber bereitstellen
            window.apf.popber = data[0];
        }
    });
};

// setzt window.apf.tpopfeldkontr und localStorage.tpopfeldkontrId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopfeldkontr = function (id) {
    'use strict';
    localStorage.tpopfeldkontrId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopFeldkontrolle/feld=TPopKontrId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopfeldkontr bereitstellen
            window.apf.tpopfeldkontr = data[0];
        }
    });
};

// setzt window.apf.tpopmassn und localStorage.tpopmassnId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopmassn = function (id) {
    'use strict';
    localStorage.tpopmassnId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopMassnahme/feld=TPopMassnId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopmassn bereitstellen
            window.apf.tpopmassn = data[0];
        }
    });
};

// setzt window.apf.tpopmassnber und localStorage.tpopmassnberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopmassnber = function (id) {
    'use strict';
    localStorage.tpopmassnberId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopMassnBericht/feld=TPopMassnBerId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopmassnber bereitstellen
            window.apf.tpopmassnber = data[0];
        }
    });
};

// setzt window.apf.tpopber und localStorage.tpopberId
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopber = function (id) {
    'use strict';
    localStorage.tpopberId = id;
    $.ajax({
        type: 'get',
        url: 'api/v1/apflora/tabelle=tblTeilPopBericht/feld=TPopBerId/wertNumber=' + id
    }).done(function (data) {
        // Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
        if (data && data[0]) {
            // tpopber bereitstellen
            window.apf.tpopber = data[0];
        }
    });
};

window.apf.initiiereExporte = function (anchor) {
    'use strict';
    var zeigeFormular = require('./modules/zeigeFormular');
    $("#testart_div").hide();
    $("#forms_titelzeile").hide();
    zeigeFormular("exporte");
    history.pushState(null, null, "index.html?exporte=true");
    if (anchor) {
        location.hash = "#" + anchor;
    }
};

// leert alle Felder und stellt ihre Breite ein
window.apf.leereFelderVonFormular = function (Formular) {
    'use strict';
    $('#' + Formular + ' input[type="text"]').each(function (){
        $(this).val("");
    });
    $('#' + Formular + ' input[type="radio"]:checked').each(function (){
        $(this).prop('checked', false);
    });
    $('#' + Formular + ' select').each(function (){
        $(this).val("");
    });
};

// begrenzt die maximale Höhe des Baums auf die Seitenhöhe, wenn nötig
window.apf.setzeTreehoehe = function () {
    'use strict';
    if ($(window).width() > 1000) {
        if (($(".jstree-no-icons").height() + 157) > $(window).height()) {
            $("#tree").css("max-height", $(window).height() - 139);
        }
    } else {
        // Spalten sind untereinander. Baum 75px weniger hoch, damit Formulare immer erreicht werden können
        if (($(".jstree-no-icons").height() + 157) > $(window).height()-75) {
            $("#tree").css("max-height", $(window).height() - 220);
        }
    }
};

window.apf.setzeKartenhoehe = function () {
    'use strict';
    var lyt_max_height = window.apf.berechneOlmapLayertreeMaxhöhe,
        forms_height,
        max_width;
    // Formulare sind unbegrenzt hoch aber Karten sollen das nicht sein
    if (window.apf.kartenhoeheManuell) {
        forms_height = $(window).height() - 17;
        max_width = $("#forms").width();
        // resizable neu rechnen lassen, sonst bleibt ga_karten_div in falscher Grösse
        // leider funktioniert das nicht wie gewünscht:
        // wenn der Benutzer die Grösse verändert hat, passt sich ga_karten_div nicht mehr richtig an Veränderungen des Bildschirms an...
        //$('.apf-resizable').resizable('destroy');
        //$('.apf-resizable').resizable();
        /*$('.apf-resizable').resizable({
            maxWidth: max_width,
            maxHeight: forms_height
        });*/
        $("#forms").height(forms_height);
        $('#ga_karten_div')
            //.css('width', max_width)
            .css('max-width', max_width)
            //.css('height', forms_height)
            .css('max-height', forms_height);
        $('.apf-resizable').resizable();
        if (window.apf.olmap && window.apf.olmap.map) {
            window.apf.olmap.map.updateSize();
            // Maximalgrösse des Layertree begrenzen
            $('#olmap_layertree_layers').css('max-height', lyt_max_height);
        }
        if (typeof google !== "undefined" && google.maps && window.apf.gmap && window.apf.gmap.map !== undefined) {
            google.maps.event.trigger(window.apf.gmap.map, 'resize');
        }
    } else {
        $("#forms").height('auto');
    }
};

window.apf.olmap.blendeOlmapExportieren = function () {
    'use strict';
    var map_size,
        anz_kartenpixel,
        tooltip_title;

    map_size = window.apf.olmap.map.getSize();
    // resolution nicht berücksichtigen - das funktionierte nicht zuverlässig und gab Probleme
    anz_kartenpixel = /*window.apf.olmap.map.getView().getResolution() * */map_size[0] * map_size[1];
    $('#olmap_exportieren').button();
    if (anz_kartenpixel > 500000) {
        $('#olmap_exportieren').button("disable");
        tooltip_title = 'Karte als png herunterladen<br>Diese Funktion ist inaktiv<br>Um sie zu aktivieren, müssen Sie die Karte verkleinern<br>Packen Sie dazu die untere rechte Ecke und ziehen Sie sie nach oben links';
    } else {
        $('#olmap_exportieren').button("enable");
        tooltip_title = 'Karte als png herunterladen';
    }
    $("#olmap_exportieren_div").tooltip({
        tooltipClass: "tooltip-styling-hinterlegt",
        content: tooltip_title
    });
};

window.apf.berechneOlmapLayertreeMaxhöhe = function () {
    var lyt_max_height;
    if ($(window).width() > 1000) {
        lyt_max_height = $(window).height() - 115;
    } else {
        // Spalten sind untereinander
        lyt_max_height = 200;
    }
    return lyt_max_height;
};

(function ($) {
    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);

// setzt die Höhe von textareas so, dass der Text genau rein passt
window.apf.fitTextareaToContent = function (id, maxHeight) {
    'use strict';
   var text = id && id.style ? id : document.getElementById(id);
   if (!text)
      return;

   /* Accounts for rows being deleted, pixel value may need adjusting */
   if (text.clientHeight == text.scrollHeight) {
      text.style.height = "30px";
   }       

   var adjustedHeight = text.clientHeight;
   if (!maxHeight || maxHeight > adjustedHeight) {
      adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
      if (maxHeight)
         adjustedHeight = Math.min(maxHeight, adjustedHeight);
      if (adjustedHeight > text.clientHeight)
         text.style.height = adjustedHeight + "px";
   }
};

window.apf.erstelleApliste = function (programm, callback) {
    'use strict';
    var setzeAutocompleteFuerApliste = require('./modules/setzeAutocompleteFuerApliste');
    window.apf.apliste = window.apf.apliste || {};

    // sicherstellen, dass ein Programm übergeben wurde
    if (!programm) {
        apliste_erstellt.resolve();
        return apliste_erstellt.promise();
    }

    // nur machen, wenn window.apf.apliste noch nicht existiert
    if (!window.apf.apliste[programm]) {
        $.ajax({
            type: 'get',
            url: 'api/v1/apliste/programm=' + programm
        }).done(function (data) {
            // die Daten werden später benötigt > globale Variable erstellen
            window.apf.apliste[programm] = data;
            setzeAutocompleteFuerApliste(programm);
            if (callback) { callback(); }
        });
    } else {
        setzeAutocompleteFuerApliste(programm);
        if (callback) { callback(); }
    }
};

// wird in index.html benutzt
window.apf.wähleApListe = function (programm) {
    require('./modules/waehleApliste')(programm);
};

// diese Funktion kann nicht modularisiert werden, weil jstree nicht für node entwickelt wurde!!!!
window.apf.erstelleTree = function (ApArtId) {
    require('./modules/jstree/erstelleTree')(ApArtId);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_pop = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Populationen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_apziel = function (node) {
    'use strict';
    var anz = 0,
        anzTxt;
    $($.jstree._reference(node)._get_children(node)).each(function (index) {
        $($(this).find("> ul > li")).each(function (index) {
            anz += 1;
        });
    });
    anzTxt = "AP-Ziele (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_apzieljahr = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt;
    anzTxt = $.jstree._reference(node).get_text(node).slice(0, 6);
    anzTxt += anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_zielber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Ziel-Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_erfkrit = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "AP-Erfolgskriterien (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_jber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "AP-Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_ber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_assozarten = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "assoziierte Arten (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpop = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Teilpopulationen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_popber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Populations-Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_popmassnber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Massnahmen-Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopmassnber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Massnahmen-Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopmassn = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Massnahmen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopber = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Teilpopulations-Berichte (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopfeldkontr = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Feldkontrollen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopfreiwkontr = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Freiwilligen-Kontrollen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifteOrdnerBeobZugeordnet = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "Beobachtungen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_beob_nicht_beurteilt = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "nicht beurteilte Beobachtungen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifteOrdnerBeobNichtNuzuordnen = function (node) {
    'use strict';
    var anz = $(node).find("> ul > li").length,
        anzTxt = "nicht zuzuordnende Beobachtungen (" + anz + ")";
    $.jstree._reference(node).rename_node(node, anzTxt);
};

window.apf.tpopKopiertInPopOrdnerTpopEinfügen = function (aktiverNode) {
    'use strict';
    var insertNeuenNodeEineHierarchiestufeTiefer = require('./modules/jstree/insertNeuenNodeEineHierarchiestufeTiefer'),
        melde                                    = require('./modules/melde'),
        erstelleIdAusDomAttributId               = require('./modules/erstelleIdAusDomAttributId');

    $.ajax({
        type: 'post',
        url: 'api/v1/tpopInsertKopie/popId=' + erstelleIdAusDomAttributId($(aktiverNode).attr("id")) + '/tpopId=' + erstelleIdAusDomAttributId($(window.apf.tpop_node_kopiert).attr("id")) + '/user=' + sessionStorage.User
    }).done(function (id) {
        var strukturtyp = "tpop",
            beschriftung = window.apf.tpopObjektKopiert.TPopFlurname;
        if (window.apf.tpopObjektKopiert.TPopNr) {
            beschriftung = window.apf.tpopObjektKopiert.TPopNr + ': ' + window.apf.tpopObjektKopiert.TPopFlurname
        }
        insertNeuenNodeEineHierarchiestufeTiefer(aktiverNode, "", strukturtyp, id, beschriftung);
    }).fail(function () {
        melde("Fehler: Die Teilpopulation wurde nicht erstellt");
    });
};

window.apf.pruefeLesevoraussetzungen = function () {
    'use strict';
    // kontrollieren, ob der User offline ist
    if (!navigator.onLine) {
        console.log('offline');
        $("#offline_dialog")
            .show()
            .dialog({
                modal: true,
                width: 400,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
        return false;
    }
    return true;
};

window.apf.pruefeSchreibvoraussetzungen = function () {
    'use strict';
    var melde = require('./modules/melde');

    // kontrollieren, ob der User online ist
    if (window.apf.pruefeLesevoraussetzungen()) {
        // kontrollieren, ob der User Schreibrechte hat
        if (sessionStorage.NurLesen) {
            melde("Sie haben keine Schreibrechte", "Speichern abgebrochen");
            return false;
        }
        return true;
    }
};

// braucht $ wegen jstree
// vorläufig indirekt aufrufen, damit $ übergeben wird
// später durch jstree 3 ablösen
window.apf.speichern = function (that) {
    require('./modules/speichern')(that);
};

(function ($) {
    // friendly helper //tinyurl.com/6aow6yn
    // Läuft durch alle Felder im Formular
    // Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
    // nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
    $.fn.serializeObject = function () {
        var o, a;
        o = {};
        a = this.serializeArray();
        $.each(a, function () {
            if (this.value) {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value);
                } else {
                    o[this.name] = this.value;
                }
            }
        });
        return o;
    };
})(jQuery);

window.apf.olmap.getLayerNames = function () {
    var layer_objekt_array = window.apf.olmap.map.getLayers().getArray(),
        layers = _.map(layer_objekt_array, function (layer_objekt) {
            if (layer_objekt.values_ && layer_objekt.values_.title) {
                 return layer_objekt.values_.title;
            }
        });
    return layers;
};

window.apf.olmap.getLayersWithTitle = function () {
    var layers_array = window.apf.olmap.map.getLayers().getArray(),
        layers = _.map(layers_array, function (layer) {
            if (layer.get('title')) {
                 return layer;
            }
        });
    return layers || [];
};

window.apf.olmap.entferneLayerNachName = function (name) {
    var layers_array = window.apf.olmap.getLayersWithTitle(),
        layername,
        layer_kategorie,
        aktualisiereEbeneInLocalStorage = require('./modules/olmap/aktualisiereEbeneInLocalStorage');

    _.each(layers_array, function (layer) {
        layername = layer.get('title');
        layer_kategorie = layer.get('kategorie');
        if (layername === name) {
            window.apf.olmap.map.removeLayer(layer);
            if (layer_kategorie === 'Eigene Ebenen') {
                // ebene aus localStorage entfernen
                //console.log('entferneLayerNachName meldet: lasse entfernen layer mit title ' + layername);
                aktualisiereEbeneInLocalStorage(layer, true);
            }
        }
    });
};

window.apf.olmap.entferneAlleApfloraLayer = function () {
    'use strict';
    var initiiereLayertree = require('./modules/olmap/initiiereLayertree');
    if (window.apf.olmap && window.apf.olmap.map) {
        // getLayers retourniert ein Objekt!!!
        // um die eigentlichen Layers zu erhalten, muss man .getLayers().getArray() aufrufen!!!
        var layers_array = window.apf.olmap.map.getLayers().getArray(),
            kategorie,
            title,
            zu_löschende_layer = [];
        // zuerst nur einen Array mit den zu löschenden Layern erstellen
        // wenn man sofort löscht, wird nur der erste entfernt!
        _.each(layers_array, function (layer) {
            kategorie = layer.get('kategorie');
            title = layer.get('title');
            if (kategorie && kategorie === 'AP Flora' && title !== 'Detailpläne') {
                zu_löschende_layer.push(layer);
            }
        });
        _.each(zu_löschende_layer, function (layer) {
            window.apf.olmap.map.removeLayer(layer);
        });
        initiiereLayertree();
    }
};

window.apf.aktualisiereKoordinatenVonTPop = function (tpop) {
    var koord_aktualisiert = $.Deferred();
    // Datensatz updaten
    $.ajax({
        type: 'post',
        url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + tpop.TPopId + '/feld=TPopXKoord/wert=' + tpop.TPopXKoord + '/user=' + sessionStorage.User
    }).done(function () {
        $.ajax({
            type: 'post',
            url: 'api/v1/update/apflora/tabelle=tblTeilpopulation/tabelleIdFeld=TPopId/tabelleId=' + tpop.TPopId + '/feld=TPopYKoord/wert=' + tpop.TPopYKoord + '/user=' + sessionStorage.User
        }).done(function () {
            koord_aktualisiert.resolve();
        });
    });
    return koord_aktualisiert.promise();
};

window.apf.olmap.stapleLayerZuoberst = function (layer_title) {
    var layers = window.apf.olmap.map.getLayers(),
        layers_array = window.apf.olmap.map.getLayers().getArray(),
        top_layer,
        initiiereLayertree = require('./modules/olmap/initiiereLayertree');

    _.each(layers_array, function (layer, index) {
        if (layer.get('title') === layer_title) {
            top_layer = layers.removeAt(index);
            layers.insertAt(layers_array.length, top_layer);
        }
    });
    initiiereLayertree();
};

window.apf.olmap.entferneModifyInteractionFuerTpop = function () {
    'use strict';
    if (window.apf.olmap.modifyInteraction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modifyInteraction);
        delete window.apf.olmap.modifyInteraction;
    }
};

// wird in index.html benutzt
window.apf.olmap.entferneModifyInteractionFuerVectorLayer = function (input_div) {
    require('./modules/olmap/entferneModifyInteractionFuerVectorLayer')(input_div);
};

// wird in index.html benutzt
window.apf.olmap.erstelleModifyInteractionFürVectorLayer = function (vectorlayer) {
    require('./modules/olmap/erstelleModifyInteractionFuerVectorLayer')(vectorlayer);
};

// wird in index.html benutzt
window.apf.olmap.exportiereLayer = function (layer, selected_value) {
    require('./modules/olmap/exportiereLayer')(layer, selected_value);
};

window.apf.download = function (filename, text) {
    'use strict';
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
};

window.apf.olmap.istLayerSichtbarNachName = function (layername) {
    'use strict';
    var layer_objekt_array,
        layer_ist_sichtbar;
    // prüfen, ob eine map existiert
    if (window.apf.olmap.map) {
        layer_objekt_array = window.apf.olmap.map.getLayers().getArray();
        layer_ist_sichtbar = _.find(layer_objekt_array, function (layer_objekt) {
            return layer_objekt.get('title') === layername && layer_objekt.get('visible');
        });
        if (layer_ist_sichtbar) {
            return true;
        }
    }
    return false;
};

// dieser Funktion kann man einen Wert zum speichern übergeben
window.apf.speichereWert = function (tabelle, id, feld, wert) {
    'use strict';
    var melde = require('./modules/melde');

    $.ajax({
        type: 'post',
        url: 'php/' + tabelle + '_update.php',
        data: {
            "id": id,
            "Feld": feld,
            "Wert": wert,
            "user": sessionStorage.User
        }
    }).fail(function () {
        melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
    });
};

window.apf.olmap.erstelleContentFuerTPop = function (tpop) {
    'use strict';
    var myFlurname = tpop.TPopFlurname || '(kein Flurname)';
    return '<table>' +
        '<tr><td><p>Typ:</p></td><td><p>Teilpopulation</p></td></tr>' +
        '<tr><td><p>Population:</p></td><td><p>' + tpop.PopName + '</p></td></tr>' +
        '<tr><td><p>Teilpopulation:</p></td><td><p>' + myFlurname + '</p></td></tr>' +
        '<tr><td><p>Koordinaten:</p></td><td><p>' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p></td></tr>' +
        '</table>' +
        '<p><a href="#" onclick="window.apf.oeffneTPop(\'' + tpop.TPopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')">Formular neben der Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneTPopInNeuemTab(\'' + tpop.TPopId + '\')">Formular in neuem Fenster öffnen<\/a></p>';
};

// retourniert features
// übergibt man einen Typ, werden nur features dieses Typs retourniert
window.apf.olmap.listSelectedFeatures = function (typ) {
    'use strict';
    var selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray(),
        features_to_return;
    features_to_return = _.filter(selected_features, function (feature) {
        if (typ) {
            return feature.get('myTyp') === typ;
        } else {
            return feature.get('myTyp');
        }
    });
    return features_to_return;
};

// sucht features an einem Ort in der Karte
window.apf.olmap.sucheFeatures = function (pixel) {
    var features = [];
    window.apf.olmap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        features.push(feature);
    });
    return features;
};

window.apf.olmap.entfernePopupOverlays = function () {
    var overlays = window.apf.olmap.map.getOverlays().getArray(),
        zu_löschender_overlay = [];
    _.each(overlays, function (overlay) {
        if (overlay.get('typ') === 'popup') {
            zu_löschender_overlay.push(overlay);
        }
    });
    _.each(zu_löschender_overlay, function (overlay) {
        window.apf.olmap.map.removeOverlay(overlay);
    });
    // alle qtips entfernen
    $('.qtip').each(function () {
        $(this).qtip('destroy', true);
    });
};

window.apf.olmap.erstelleContentFuerPop = function (pop) {
    'use strict';
    return '<table>' +
        '<tr><td><p>Typ:</p></td><td><p>Population</p></td></tr>' +
        '<tr><td><p>Koordinaten:</p></td><td><p>' + pop.PopXKoord + ' / ' + pop.PopYKoord + '</p></td></tr>' +
        '</table>' +
        '<p><a href="#" onclick="window.apf.öffnePop(\'' + pop.PopId + '\')">Formular anstelle Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.oeffneFormularAlsPopup(\'pop\', ' + pop.PopId + ')">Formular neben der Karte öffnen<\/a></p>' +
        '<p><a href="#" onclick="window.apf.öffnePopInNeuemTab(\'' + pop.PopId + '\')">Formular in neuem Fenster öffnen<\/a></p>';
};


// ermöglicht es, nach dem toolip zu sortieren
window.apf.vergleicheTPopZumSortierenNachTooltip = function (a,b) {
    'use strict';
    if (a.tooltip < b.tooltip) {return -1;}
    if (a.tooltip > b.tooltip) {return 1;}
    return 0;
};

window.apf.deaktiviereGeoAdminAuswahl = function () {
    'use strict';
    if (window.apf.olmap.auswahlPolygonLayer) {
        window.apf.olmap.auswahlPolygonLayer.removeAllFeatures();
    }
    if (window.drawControl) {
        window.drawControl.deactivate();
    }
    $("#ergebnisAuswahl").css("display", "none");
    delete window.apf.tpop_id_array;
    delete window.tpop_id_liste;
    delete window.apf.pop_id_array;
    delete window.pop_id_liste;
};

window.apf.erstelleTPopNrLabel = function (popnr, tpopnr) {
    'use strict';
    // tooltip bzw. label vorbereiten: nullwerte ausblenden
    if (popnr && tpopnr) {
        return popnr + '/' + tpopnr;
    } else if (popnr) {
        return popnr + '/?';
    } else if (tpopnr) {
        return '?/' + tpopnr;
    } else {
        return '?/?';
    }
};

window.apf.olmap.erstelleMarkerFürTPopLayer = function (tpop) {
    return new ol.Feature({
        geometry: new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]),
        tpopNr: tpop.TPopNr,
        popNr: tpop.PopNr,
        tpop_nr_label: window.apf.erstelleTPopNrLabel(tpop.PopNr, tpop.TPopNr),
        tpop_name: tpop.TPopFlurname || '(kein Name)',
        name: window.apf.erstelleTPopNrLabel(tpop.PopNr, tpop.TPopNr),  // brauchts das noch? TODO: entfernen
        popupContent: window.apf.olmap.erstelleContentFuerTPop(tpop),
        popup_title: tpop.Artname,
        // koordinaten werden benötigt damit das popup am richtigen Ort verankert wird
        xkoord: tpop.TPopXKoord,
        ykoord: tpop.TPopYKoord,
        myTyp: 'tpop',
        myId: tpop.TPopId
    });
};

window.apf.olmap.onFeatureSelect = function (feature) {
    'use strict';
    var popup = new OpenLayers.Popup.FramedCloud("popup",
            feature.geometry.getBounds().getCenterLonLat(),
            null,
            feature.attributes.message,
            null,
            false    // true zeigt Schliess-Schalftläche an. Schliessen zerstört aber event-listener > popup kann nur ein mal angezeigt werden!
        );
    popup.autoSize = true;
    popup.maxSize = new OpenLayers.Size(600,600);
    popup.fixedRelativePosition = true;
    feature.popup = popup;
    window.apf.gmap.addPopup(popup);
};

window.apf.olmap.onFeatureUnselect = function (feature) {
    'use strict';
    feature.popup.hide();
};

// GoogleMap: alle Marker löschen
// benutzt wo in GoogleMaps Marker gesetzt und verschoben werden
window.apf.gmap.clearMarkers = function () {
    'use strict';
    _.each(window.apf.gmap.markersArray, function (marker) {
        marker.setMap(null);
    });
};

// GoogleMap: alle InfoWindows löschen
// benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
window.apf.gmap.clearInfoWindows = function () {
    'use strict';
    _.each(window.apf.gmap.infoWindowArray, function (info_window) {
        info_window.setMap(null);
    });
};

window.apf.oeffneTPop = function (tpopId) {
    'use strict';
    localStorage.tpopId = tpopId;
    $.jstree._reference("[typ='tpop']#" + tpopId).deselect_all();
    $("#tree").jstree("select_node", "[typ='tpop']#" + tpopId);
};

window.apf.oeffneTPopInNeuemTab = function (tpopId) {
    'use strict';
    window.open("index.html?ap=" + localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + tpopId, "_blank");
};

window.apf.öffnePop = function (popId) {
    'use strict';
    console.log('popId = ', popId);
    localStorage.popId = popId;
    $.jstree._reference("[typ='pop']#" + popId).deselect_all();
    $("#tree").jstree("select_node", "[typ='pop']#" + popId);
};

window.apf.öffnePopInNeuemTab = function (popId) {
    'use strict';
    window.open("index.html?ap=" + localStorage.apId + "&pop=" + popId, "_blank");
};

window.apf.oeffneBeob = function (beobId) {
    'use strict';
    localStorage.beobId = beobId;
    $.jstree._reference("[typ='beob_nicht_beurteilt']#beob" + beobId).deselect_all();
    $("#tree").jstree("select_node", "[typ='beob_nicht_beurteilt']#beob" + beobId);
};

window.apf.oeffneBeobInNeuemTab = function (beobId) {
    'use strict';
    window.open("index.html?ap="+localStorage.apId + "&beob_nicht_beurteilt=" + beobId, "_blank");
};

window.apf.öffneTPopBeob = function (beobId) {
    'use strict';
    localStorage.beobId = beobId;
    $.jstree._reference("[typ='beob_zugeordnet']#beob" + beobId).deselect_all();
    $("#tree").jstree("select_node", "[typ='beob_zugeordnet']#beob" + beobId);
};

window.apf.öffneTPopBeobInNeuemTab = function (beobId) {
    'use strict';
    window.open("index.html?ap="+localStorage.apId + "&pop=" + localStorage.popId + "&tpop=" + localStorage.tpopId + "&beob_nicht_beurteilt=" + beobId, "_blank");
};





/* 
    Document   : wms.js
    Created on : Feb 16, 2011, 3:25:27 PM
    Author     : "Gavin Jackson <Gavin.Jackson@csiro.au>"

    Refactored code from //lyceum.massgis.state.ma.us/wiki/doku.php?id=googlemapsv3:home

    example: loadWMS(map, "//spatial.ala.org.au/geoserver/wms?", customParams);

    You can easily add a WMS overlay by calling the loadWMS(map, baseURL, customParams) function, where:

    map - is an instance of Google.maps.Map
    baseURL - is the base URL of your WMS server (eg geoserver)
    customParams - Additional WMS parameters
*/

function bound(value, opt_min, opt_max) {
    if (opt_min != null) value = Math.max(value, opt_min);
    if (opt_max != null) value = Math.min(value, opt_max);
    return value;
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function MercatorProjection() {
    /*global Google*/
    var MERCATOR_RANGE = 256;
    this.pixelOrigin_ = new google.maps.Point(
        MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
    this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
    this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
}

MercatorProjection.prototype.fromLatLngToPoint = function (latLng, opt_point) {
    /*global Google*/
    var me = this,
        point = opt_point || new google.maps.Point(0, 0),
        origin = me.pixelOrigin_;
    point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
    // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
    // 89.189.  This is about a third of a tile past the edge of the world tile.
    var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
    return point;
};

MercatorProjection.prototype.fromDivPixelToLatLng = function (pixel, zoom) {
    /*global Google*/
    var me = this,
        origin = me.pixelOrigin_,
        scale = Math.pow(2, zoom),
        lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_,
        latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_,
        lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
    return new google.maps.LatLng(lat, lng);
};

MercatorProjection.prototype.fromDivPixelToSphericalMercator = function (pixel, zoom) {
    /*global Google*/
    var me = this,
        coord = me.fromDivPixelToLatLng(pixel, zoom),
        r = 6378137.0,
        x = r * degreesToRadians(coord.lng()),
        latRad = degreesToRadians(coord.lat()),
        y = (r / 2) * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad)));
    return new google.maps.Point(x,y);
};

function loadWMS(map, baseURL, customParams) {
    /*global Google*/
    var tileHeight = 256,
        tileWidth = 256,
        opacityLevel = 0.75,
        isPng = true,
        minZoomLevel = 2,
        maxZoomLevel = 28;

    //var baseURL = "";
    // für SVO
    var wmsParams = [
    "REQUEST=GetMap",
    "SERVICE=WMS",
    "VERSION=1.1.1",
    //"WIDTH=512",
    //"HEIGHT=512",
    //"SRS=EPSG:4326",
    //"LAYERS=zonen-schutzverordnungen",
    "STYLES=default",
    "TRANSPARENT=TRUE",
    "FORMAT=image/gif"
    ];
    // für av
    /*var wmsParams = [
    //"REQUEST=GetCapabilities",
    //"SERVICE=WMS",
    //"VERSION=1.3.0",
    "WIDTH="+ tileWidth,
    "HEIGHT="+ tileHeight
    ];*/

    // add additional parameters
    wmsParams = wmsParams.concat(customParams);

    var overlayOptions = {
        getTileUrl: function (coord, zoom) {
            var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
            var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);

            var projectionMap = new MercatorProjection();

            var lULg = projectionMap.fromDivPixelToSphericalMercator(lULP, zoom);
            var lLRg  = projectionMap.fromDivPixelToSphericalMercator(lLRP, zoom);

            var lUL_Latitude = lULg.y;
            var lUL_Longitude = lULg.x;
            var lLR_Latitude = lLRg.y;
            var lLR_Longitude = lLRg.x;
            // GJ: there is a bug when crossing the -180 longitude border (tile does not render) - this check seems to fix it
            if (lLR_Longitude < lUL_Longitude){
              lLR_Longitude = Math.abs(lLR_Longitude);
            }
            var urlResult = baseURL + wmsParams.join("&") + "&bbox=" + lUL_Longitude + "," + lUL_Latitude + "," + lLR_Longitude + "," + lLR_Latitude;

            return urlResult;
        },

        tileSize: new google.maps.Size(tileHeight, tileWidth),

        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel,

        opacity: opacityLevel,

        isPng: isPng
    };

    var overlayWMS = new google.maps.ImageMapType(overlayOptions);

    map.overlayMapTypes.insertAt(0, overlayWMS);

    map.setOptions({
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.HYBRID
            ],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });
}

/*! Copyright (c) 2011 Brandon Aaron (//brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: //adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(//www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 *
 * Benutzt, um Mouswheel-Scrollen abzufangen und den event zu verhindern (unbeabsichtigte Änderung von Zahlen in number-Feldern verhindern)
 *
 */

(function ($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function () {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function () {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function (fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function (fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

// offenbar nicht benutzt
window.apf.getInternetExplorerVersion = function () {
    'use strict';
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent,
        re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat(RegExp.$1);
  }
  return rv;
};

// deaktiviert Messen und Auswählen
window.apf.olmap.deactivateMenuItems = function () {
    'use strict';
    // messen deaktivieren
    window.apf.olmap.removeMeasureInteraction();
    // Auswählen deaktivieren
    window.apf.olmap.removeSelectFeaturesInSelectableLayers();
    // allfällige popups schliessen
    window.apf.olmap.entfernePopupOverlays();
    // allfällige tooltips von ga-karten verstecken
    $('div.ga-tooltip').hide();
    // allfällige modify-interaction entfernen
    window.apf.olmap.entferneModifyInteractionFuerTpop();
};

window.apf.olmap.removeSelectFeaturesInSelectableLayers = function () {
    'use strict';
    if (window.apf.olmap.map.olmap_select_interaction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.map.olmap_select_interaction);
        delete window.apf.olmap.map.olmap_select_interaction;
        window.apf.olmap.removeDragBox();
        $("#ergebnisAuswahl").hide();
    }
};

window.apf.olmap.addSelectFeaturesInSelectableLayers = function () {
    'use strict';
    var addDragBoxForPopTpop = require('./modules/olmap/addDragBoxForPopTpop'),
        stylePop             = require('./modules/olmap/stylePop'),
        styleTPop            = require('./modules/olmap/styleTPop');
    window.apf.olmap.map.olmap_select_interaction = new ol.interaction.Select({
        // TODO: 'layerFilter' will soon be deprecated > change to 'layers' when deprecated
        layerFilter: function (layer) {
            return layer.get('selectable') === true;
        },
        style: function (feature, resolution) {
            switch(feature.get('myTyp')) {
            case 'pop':
                return stylePop(feature, resolution, true);
            case 'tpop':
                return styleTPop(feature, resolution, true);
            case 'Detailplan':
                return window.apf.olmap.detailplanStyleSelected(feature, resolution);
            }
        }
        /*,
         // wenn man das feature zum zweiten mal klickt, soll es nicht mehr selected sein
         toggleCondition: function (event) {
         return event === 'click';
         }*/
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.map.olmap_select_interaction);
    // man soll auch mit dragbox selecten können
    addDragBoxForPopTpop();
};

window.apf.olmap.getSelectedFeatures = function () {
    if (window.apf.olmap.map.olmap_select_interaction) {
        return window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else {
        return [];
    }
};

window.apf.olmap.getSelectedFeaturesOfType = function (type) {
    var features_array = window.apf.olmap.getSelectedFeatures(),
        return_array = [],
        feature_type;
    if (features_array.length === 0) {
        return [];
    }
    _.each(features_array, function (feature) {
        feature_type = feature.get('myTyp');
        if (feature_type === type) {
            return_array.push(feature);
        }
    });
    return return_array;
};

window.apf.olmap.removeDragBox = function () {
    'use strict';
    if (window.apf.olmap.drag_box_interaction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.drag_box_interaction);
        //window.apf.olmap.drag_box_interaction.off('boxend');
        delete window.apf.olmap.drag_box_interaction;
    }
};

window.apf.olmap.addShowFeatureInfoOnClick = function () {
    'use strict';
    window.apf.olmap.map.on('singleclick', function (event) {
        var pixel = event.pixel,
            coordinate = event.coordinate,
            zeigeFeatureInfo = require('./modules/olmap/zeigeFeatureInfo');
        // nur machen, wenn nicht selektiert wird
        if (!window.apf.olmap.map.olmap_select_interaction) {
            zeigeFeatureInfo(pixel, coordinate);
        }
        // prüfen, ob pop / tpop gewählt wurden
        // verzögern, weil die neuste selection sonst nicht erfasst wird
        setTimeout(function () {
            window.apf.olmap.prüfeObPopTpopGewähltWurden();
        }, 100);
    });
};

window.apf.olmap.prüfeObPopTpopGewähltWurden = function () {
    var popSelected = [],
        tpopSelected = [],
        erstelleListeDerAusgewaehltenPopTPop = require('./modules/erstelleListeDerAusgewaehltenPopTPop');

    // prüfen, ob pop / tpop gewählt wurden
    popSelected = window.apf.olmap.getSelectedFeaturesOfType('pop');
    tpopSelected = window.apf.olmap.getSelectedFeaturesOfType('tpop');

    // wenn ja: anzeigen
    if (popSelected.length > 0 || tpopSelected.length > 0) {
        erstelleListeDerAusgewaehltenPopTPop(popSelected, tpopSelected);
    } else {
        $("#ergebnisAuswahl").hide();
    }
};

window.apf.olmap.changeCursorOverFeature = function () {
    'use strict';
    $(window.apf.olmap.map.getViewport()).on('mousemove', function (e) {
        var pixel = window.apf.olmap.map.getEventPixel(e.originalEvent),
            hit = window.apf.olmap.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                return true;
            });
        if (hit) {
            $('#ga_karten_div').css('cursor', 'pointer');
        } else {
            $('#ga_karten_div').css('cursor', '');
        }
    });
};

window.apf.olmap.addMousePositionControl = function () {
    'use strict';
    var mousePositionControl = new ol.control.MousePosition({
        //This is the format we want the coordinate in
        //The number argument in createStringXY is the number of decimal places
        coordinateFormat: ol.coordinate.createStringXY(0),
        projection: "EPSG:21781",
        undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate
    });
    window.apf.olmap.map.addControl(mousePositionControl);
};

window.apf.olmap.addFullScreenControl = function () {
    'use strict';
    var myFullScreenControl = new ol.control.FullScreen();
    window.apf.olmap.map.addControl(myFullScreenControl);
    // auf Deutsch beschriften
    $('#ga_karten_div').find('.ol-full-screen').find('span[role="tooltip"]').html('Vollbild wechseln');
};

// wird in index.html benutzt
window.apf.olmap.frageNameFuerEbene = function (eigene_ebene) {
    return require('./modules/olmap/frageNameFuerEbene')(eigene_ebene);
};

window.apf.olmap.nenneEbeneUm = function (layer, title) {
    'use strict';
    var initiiereLayertree              = require('./modules/olmap/initiiereLayertree'),
        aktualisiereEbeneInLocalStorage = require('./modules/olmap/aktualisiereEbeneInLocalStorage');
    layer.set('title', title);
    initiiereLayertree('Eigene Ebenen');
    // layer in localStorage speichern
    aktualisiereEbeneInLocalStorage(layer);
};

// wird in index.html benutzt
window.apf.olmap.initiiereLayertree = function (active_kategorie) {
    require('./modules/olmap/initiiereLayertree')(active_kategorie);
};

// wird in index.html verwendet
window.apf.oeffneFormularAlsPopup = function (formularname, id) {
    require('./modules/oeffneFormularAlsPopup')(formularname, id);
};

window.apf.olmap.detailplanStyle = function (feature, resolution) {
    'use strict';
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(250, 58, 15, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#fa3a0f',
            width: 1
        })
    });
};

window.apf.olmap.detailplanStyleSelected = function (feature, resolution) {
    'use strict';
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(15, 85, 250, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#0F55FA',
            width: 1
        })
    });
};

// wird in index.js benutzt
window.apf.olmap.stylePop = function (feature, resolution, selected) {
    return require('./modules/olmap/stylePop')(feature, resolution, selected);
};

// wird in index.js benutzt
window.apf.olmap.styleTPop = function (feature, resolution, selected, verorten) {
    return require('./modules/olmap/styleTPop')(feature, resolution, selected, verorten);
};

window.apf.olmap.messe = function (element) {
    'use strict';
    var addMeasureInteraction = require('./modules/olmap/addMeasureInteraction');
    window.apf.olmap.deactivateMenuItems();
    if (element.value === 'line' && element.checked) {
        addMeasureInteraction('LineString');
    } else if (element.value === 'polygon' && element.checked) {
        addMeasureInteraction('Polygon');
    } else {
        window.apf.olmap.removeMeasureInteraction();
    }
};

window.apf.olmap.removeMeasureInteraction = function () {
    window.apf.olmap.entferneLayerNachName('messen');
    window.apf.olmap.map.removeInteraction(window.apf.olmap.drawMeasure);
    delete window.apf.olmap.drawMeasure;
    $("#ergebnisMessung").text("");
    $(window.apf.olmap.map.getViewport()).off('mousemove');
};

/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
*/
window.apf.olmap.formatLength = function (line) {
    var length = Math.round(line.getLength() * 100) / 100,
        output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' km';
    } else {
        output = (Math.round(length * 100) / 100) + ' m';
    }
    return output;
};

/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
*/
window.apf.olmap.formatArea = function (polygon) {
    var area = polygon.getArea(),
        output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
    }
    return output;
};

window.apf.olmap.wähleAus = function () {
    window.apf.olmap.deactivateMenuItems();
    window.apf.olmap.addSelectFeaturesInSelectableLayers();
};

window.apf.olmap.schliesseLayeroptionen = function () {
    'use strict';
    $("#olmap_layertree").accordion("option", "active", false);
};

window.apf.erstelleGemeindeliste = function () {
    'use strict';
    var speichern = require('./modules/speichern'),
        melde     = require('./modules/melde');
    if (!window.apf.gemeinden) {
        $.ajax({
            type: 'get',
            url: 'api/v1/gemeinden'
        }).done(function (data) {
            if (data) {
                // Gemeinden bereitstellen
                // Feld mit Daten beliefern
                var gemeinden = _.map(data, function (gemeinde) {
                    if (gemeinde.GmdName) {
                        return gemeinde.GmdName;
                    }
                });
                window.apf.gemeinden = gemeinden;
                // autocomplete-widget für Gemeinden initiieren
                $("#TPopGemeinde").autocomplete({
                    source: gemeinden,
                    delay: 0,
                    // Change-Event wird nicht ausgelöst > hier aufrufen
                    change: function (event, ui) {
                        speichern(event.target);
                    }
                });
            }
        }).fail(function () {
            melde("Fehler: Die Liste der Gemeinden konnte nicht bereitgestellt werden");
        });
    }
};

// wird aufgerufen, wenn der ap geändert wird
// wird in index.html benutzt
window.apf.waehleAp = function (apId) {
    require('./modules/waehleAp')(apId);
};

window.apf.kopiereKoordinatenInPop = function (x_koord, y_koord) {
    'use strict';
    var melde = require('./modules/melde');

    // prüfen, ob X- und Y-Koordinaten vergeben sind
    if (x_koord > 100000 && y_koord > 100000) {
        // Koordinaten der Pop nachführen
        $.ajax({
            type: 'post',
            url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + localStorage.popId + '/feld=PopXKoord/wert=' + x_koord + '/user=' + sessionStorage.User
        }).done(function () {
            $.ajax({
                type: 'post',
                url: 'api/v1/update/apflora/tabelle=tblPopulation/tabelleIdFeld=PopId/tabelleId=' + localStorage.popId + '/feld=PopYKoord/wert=' + y_koord + '/user=' + sessionStorage.User
            }).done(function () {
                $("#kopiereKoordinatenInPopRueckmeldung").fadeIn('slow');
                setTimeout(function () {
                    $("#kopiereKoordinatenInPopRueckmeldung").fadeOut('slow');
                }, 3000);
            }).fail(function () {
                melde("Fehler: Y-Koordinate wurde nicht kopiert (die X-Koordinate offenbar schon)");
            });
        }).fail(function () {
            melde("Fehler: Koordinaten wurden nicht kopiert");
        });
    } else {
        // auffordern, die Koordinaten zu vergeben und Speichern abbrechen
        melde("Sie müssen zuerst Koordinaten erfassen", "Koordinaten nicht kopiert");
    }
};

// wird in index.html benutzt
window.apf.prüfeAnmeldung = function () {
    require('./modules/pruefeAnmeldung')();
};

// erwartet aktuelle Werte für jahr und typ
// erstellt den label für den Baum
window.apf.erstelleLabelFürFeldkontrolle = function (jahr, typ) {
    'use strict';
    if (typeof jahr === "undefined") {
        jahr = "(kein Jahr)";
    }
    if (typeof typ === "undefined") {
        typ = "(kein Typ)";
    }
    return jahr + ": " + typ;
};

// erwartet aktuelle Werte für jahr und beurteilung
// erstellt den label für den Baum
window.apf.erstelleLabelFuerMassnahme = function (jahr, beurteilung) {
    'use strict';
    if (typeof jahr === "undefined") {
        jahr = "(kein Jahr)";
    }
    if (typeof beurteilung === "undefined") {
        beurteilung = "(keine Beurteilung)";
    }
    return jahr + ": " + beurteilung;
};

// gibt HTML zurück, mit dem die Informationen über eine Beobachtung dargestellt werden
// erwartet die Daten der Beobachtung
window.apf.erstelleFelderFuerBeob = function (data, beobtyp) {
    'use strict';
    // Titel für Beob im Formular erstellen
    var beobtitel = "<h1>Informationen aus ";
    if (beobtyp === "infospezies") {
        beobtitel += "Info Spezies";
    } else {
        beobtitel += "EvAB";
    }
    beobtitel += " (nicht veränderbar)</h1>";
    // Beob-Felder dynamisch aufbauen
    var html_beobfelder = "<table>",
        html_beobfeld,
        nichtAnzuzeigendeFelder = ["NO_ISFS", "ESPECE", "CUSTOM_TEXT_5_", "OBJECTID", "FNS_GISLAYER", "FNS_ISFS", "ID", "FNS_JAHR", "NOM_COMPLET", "FAMILLE"];
    $.each(data, function (index, value) {
        if ((value || value === 0) && nichtAnzuzeigendeFelder.indexOf(index) === -1) {
            // TODO: Zahlen, text und Memofelder unterscheiden
            // TODO: Felder durch externe Funktion erstellen lassen
            // ID: beobfelder_ voranstellen, um Namens-Kollisionen zu vermeiden
            html_beobfeld = '<tr class="fieldcontain"><td class="label" style="padding-bottom:3px;"><label for="beobfelder_';
            html_beobfeld += index;
            html_beobfeld += '">';
            html_beobfeld += index;
            html_beobfeld += ':</label></td><td class="Datenfelder" style="padding-bottom:3px;"><input id="beobfelder_';
            html_beobfeld += index;
            html_beobfeld += '" class="Datenfelder" type="text" readonly="readonly" value="';
            html_beobfeld += value;
            html_beobfeld += '""></td></tr>';
            html_beobfelder += html_beobfeld;
        }
    });
    html_beobfelder += "</table>";
    return beobtitel + html_beobfelder;
};


window.apf.melde = function (meldung, title) {
    'use strict';
    require('./modules/melde')(meldung, title);
};

// wird in index.html benutzt
window.apf.löscheAp = function (apId) {
    require('./modules/loescheAp')(apId);
};

// wird in index.html benutzt
window.apf.undeleteDatensatz = function () {
    require('./modules/undeleteDatensatz')();
};

// wird in index benutzt
window.apf.olmap.exportiereKarte = function (event) {
    'use strict';
    require('./modules/olmap/exportiereKarte')(event);
};

// hier behalten, damit $ eingefügt werden kann
window.apf.treeKontextmenu = function (node) {
    return require('./modules/jstree/treeKontextmenu')(node);
};

// damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
// Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
(function ($) {
    $.fn.extend( {
        limiter: function (limit, elem) {
            $(this).on("keyup focus", function () {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html(limit - chars);
            }
            setCount($(this)[0], elem);
        }
    });
})(jQuery);

// erstellt einen guid
// Quelle: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
window.apf.erstelleGuid = function () {
    'use strict';
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};