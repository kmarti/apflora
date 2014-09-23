(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// benötigte globale Variablen initialisieren
window.apf = window.apf || {};
window.apf.gmap = window.apf.gmap || {};
window.apf.olmap = window.apf.olmap || {};

window.apf.initiiere_index = function() {
	'use strict';
	// Versuch, damit $.ajax auch in IE funktioniert
	// jQuery hängt an jede Anfrage ein &_= und Zufahlszahl
	// AUSGESCHALTET, WEIL TPOPFELDKONTR_UPDATE_MULTIPLE.PHP NICHT MEHR FUNKTIONIERTE (UND MEHR?)
	//$.ajaxSetup({cache:false})

	// jQuery ui widgets initiieren
	$("#programm_wahl").buttonset({
		create: function() {
			// erst jetzt einblenden, weil sonst die normalen checkboxen aufblitzen
			$("#programm_wahl").show();
		}
	});
	$("#messen").buttonset();
	$("button").button();
	$("#tpopfeldkontr_tabs").tabs();
    $('.apf-resizable').resizable();

	// tooltip: Klasse zuweisen, damit gestylt werden kann
	$("#label_olmap_infos_abfragen, #label_olmap_distanz_messen, #label_olmap_flaeche_messen, #label_olmap_auswaehlen, #olmap_exportieren_div, .apf_tooltip").tooltip({
		tooltipClass: "tooltip-styling-hinterlegt",
		content: function() {
			return $(this).attr('title');
		}
	});

	$(".export_abschnitt").tooltip({
		tooltipClass: "export_abschnitt_tooltip_class",
		content: function() {
			return $(this).attr('title');
		}
	});

	$('#olmap_exportieren').button({
		icons: {
	        primary: "ui-icon-circle-arrow-s"
	    },
	    text: false,
        disabled: true
	});

	// Gemeindeliste erstellen (wenn nötig)
	window.apf.erstelleGemeindeliste();

	// Datumsfelder: Widget initiieren
	var monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        wochentageKurz = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        wochentageLang = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
	$("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });
	$("#TPopMassnDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopMassnJahr", altFormat: "yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });
	$("#JBerDatum, #IbErstelldatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });

	// Variablen setzen für Formular Feldkontrollen, hier damit nur ein mal
	window.apf.feldliste_feldkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrTyp', 'TPopKontrJungpfl', 'TPopKontrVitalitaet', 'TPopKontrUeberleb', 'TPopKontrEntwicklung', 'TPopKontrUrsach', 'TPopKontrUrteil', 'TPopKontrAendUms', 'TPopKontrAendKontr', 'TPopKontrGuid', 'TPopKontrFlaeche', 'TPopKontrVegTyp', 'TPopKontrKonkurrenz', 'TPopKontrMoosschicht', 'TPopKontrKrautschicht', 'TPopKontrStrauchschicht', 'TPopKontrBaumschicht', 'TPopKontrBodenTyp', 'TPopKontrBodenKalkgehalt', 'TPopKontrBodenDurchlaessigkeit', 'TPopKontrBodenHumus', 'TPopKontrBodenNaehrstoffgehalt', 'TPopKontrBodenAbtrag', 'TPopKontrWasserhaushalt', 'TPopKontrHandlungsbedarf', 'TPopKontrIdealBiotopUebereinst', 'TPopKontrLeb', 'TPopKontrLebUmg'];
	window.apf.feldliste_freiwkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrPlan', 'TPopKontrUebFlaeche', 'TPopKontrUebPfl', 'TPopKontrNaBo', 'TPopKontrJungPflJN', 'TPopKontrVegHoeMax', 'TPopKontrVegHoeMit', 'TPopKontrGefaehrdung', 'TPopKontrGuid'];

	// Auswahllisten aufbauen
	$("#ap_loeschen").hide();
	window.apf.erstelle_artlisten();

	// HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
	$.when(window.apf.wähleApListe("programm_alle"))
		.then(function() {
			// falls eine Unteradresse angewählt wurde, diese öffnen
			window.apf.öffneUri();
		});
};

window.apf.initiiere_ap = function() {
	'use strict';
	if (!localStorage.ap_id) {
		// es fehlen benötigte Daten > zurück zum Anfang
		// LIEGT HIER DER WURM BEGRABEN?
		// ACHTUNG, DIESE ZEILE VERURSACHTE STARTABSTÜRZE IN FIREFOX UND ZT OFFENBAR AUCH IN CHROME, DA REKURSIV IMMER WIEDER INITIIERE_INDEX AUFGERUFEN WURDE
		//window.apf.initiiere_index();
		//history.replaceState({ap: "keinap"}, "keinap", "index.html");
		return;
	}
	// Programm-Wahl konfigurieren
	var programm_wahl;
	programm_wahl = $("[name='programm_wahl']:checked").attr("id");
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("ap");
	// Wenn ein ap ausgewählt ist: Seine Daten anzeigen
	if ($("#ap_waehlen").val() && programm_wahl !== "programm_neu") {
		// Daten für den ap aus der DB holen
		var getAp = $.ajax({
			type: 'get',
			url: 'ap=' + localStorage.ap_id,
			dataType: 'json'
		});
		getAp.always(function(data) {
			// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data && data[0]) {
				// ap bereitstellen
				window.apf.ap = data[0];
				// Felder mit Daten beliefern
				$("#ApStatus" + data[0].ApStatus).prop("checked", true);
				$("#ApUmsetzung" + data[0].ApUmsetzung).prop("checked", true);
				$("#ApJahr").val(data[0].ApJahr);
				$("#ApArtwert").val(data[0].ApArtwert);
				$("#Artname").val(data[0].Artname);
				// ApBearb: Daten holen - oder vorhandene nutzen
				if (!window.apf.adressen_html) {
					var getAdressen = $.ajax({
						type: 'get',
						url: 'api/adressen',
						dataType: 'json'
					});
					getAdressen.always(function(data2) {
						if (data2) {
							// Feld mit Daten beliefern
							var html;
							html = "<option></option>";
                            _.each(data2, function(adresse) {
                                html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                            });
							window.apf.adressen_html = html;
							$("#ApBearb")
                                .html(html)
                                .val(window.apf.ApBearb);
						}
					});
				} else {
					$("#ApBearb")
                        .html(window.apf.adressen_html)
                        .val(window.apf.ApBearb);
				}
				// Formulare blenden
				window.apf.zeigeFormular("ap");
				history.replaceState({ap: "ap"}, "ap", "index.html?ap=" + data.ApArtId);
			}
		});
	} else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
		// Formulare blenden
		window.apf.zeigeFormular("ap");
	}
};

// setzt window.apf und localStorage.ap_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowAp = function(id) {
	'use strict';
	localStorage.ap_id = id;
	var getAp = $.ajax({
		type: 'get',
		url: 'ap=' + localStorage.ap_id,
		dataType: 'json'
	});
	getAp.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data && data[0]) {
			// ap bereitstellen
			window.apf.ap = data[0];
		}
	});
};

window.apf.hole_artliste_html = function() {
	'use strict';
	var liste_geholt = $.Deferred();
	// wird benutzt von function window.apf.erstelle_artlisten und window.apf.initiiere_tpopmassn
	// baut eine vollständige Artliste auf
	if (!window.apf.artliste_html) {
		var getArtliste = $.ajax({
			type: 'get',
			url: 'api/artliste',
			dataType: 'json'
		});
		getArtliste.always(function(data) {
			var html;
			html = "<option></option>";
            _.each(data, function(art) {
                html += "<option value=\"" + art.TaxonomieId + "\">" + art.Artname + "</option>";
            });
			window.apf.artliste_html = html;
			liste_geholt.resolve();
		});
	} else {
		liste_geholt.resolve();
	}
	return liste_geholt.promise();
};

// wird benutzt von Formular ap, pop und TPopMassn
// setzt vollständige Artlisten în Select-Felder
window.apf.erstelle_artlisten = function() {
	'use strict';
	var liste_erstellt = $.Deferred();
	$.when(window.apf.hole_artliste_html())
		.then(function() {
			$("#AaSisfNr").html(window.apf.artliste_html);
			$("#TPopMassnAnsiedWirtspfl").html(window.apf.artliste_html);
			liste_erstellt.resolve();
		});
	return liste_erstellt.promise();
};

window.apf.initiiere_pop = function(ohne_zu_zeigen) {
	'use strict';
	if (!localStorage.pop_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("pop");
	// Daten für die pop aus der DB holen
	var getPop = $.ajax({
            type: 'get',
            url: 'php/pop.php',
            dataType: 'json',
            data: {
                "id": localStorage.pop_id
            }
        }),
        $PopName = $("#PopName"),
        $PopNr = $("#PopNr");
	getPop.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// pop bereitstellen
			window.apf.pop = data;
			// Felder mit Daten beliefern
			$("#PopHerkunft" + data.PopHerkunft).prop("checked", true);
			if (data.PopHerkunftUnklar == 1) {
				$("#PopHerkunftUnklar").prop("checked", true);
			} else {
				$("#PopHerkunftUnklar").prop("checked", false);
			}
			$("#PopHerkunftUnklarBegruendung")
                .val(data.PopHerkunftUnklarBegruendung)
                .limiter(255, $("#PopHerkunftUnklarBegruendung_limit"));
            $PopName
                .val(data.PopName)
                .limiter(150, $("#PopName_limit"));
            $PopNr.val(data.PopNr);
			$("#PopBekanntSeit").val(data.PopBekanntSeit);
			$("#PopXKoord").val(data.PopXKoord);
			$("#PopYKoord").val(data.PopYKoord);
			// Formulare blenden
			// nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
			if (!ohne_zu_zeigen) {
				window.apf.zeigeFormular("pop");
				history.replaceState({pop: "pop"}, "pop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id);
				// bei neuen Datensätzen Fokus steuern
				if (!$PopName.val()) {
	                $PopNr.focus();
				}
			}
		}
	});
};

// setzt window.apf.pop und localStorage.pop_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowPop = function(id) {
	'use strict';
	localStorage.pop_id = id;
	var getPop = $.ajax({
		type: 'get',
		url: 'php/pop.php',
		dataType: 'json',
		data: {
			"id": localStorage.pop_id
		}
	});
	getPop.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// pop bereitstellen
			window.apf.pop = data;
		}
	});
};

window.apf.initiiere_apziel = function() {
	'use strict';
	if (!localStorage.apziel_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	var apziel_initiiert = $.Deferred(),
        $ZielJahr = $("#ZielJahr");
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("apziel");
	// Daten für die apziel aus der DB holen
	var getApZiel = $.ajax({
		type: 'get',
		url: 'php/apziel.php',
		dataType: 'json',
		data: {
			"id": localStorage.apziel_id
		}
	});
	getApZiel.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// apziel bereitstellen
			window.apf.apziel = data;
			// Felder mit Daten beliefern
            $ZielJahr.val(data.ZielJahr);
			$("#ZielTyp" + data.ZielTyp).prop("checked", true);
			$("#ZielBezeichnung").val(data.ZielBezeichnung);
			// Formulare blenden
			window.apf.zeigeFormular("apziel");
			history.replaceState({apziel: "apziel"}, "apziel", "index.html?ap=" + localStorage.ap_id + "&apziel=" + localStorage.apziel_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$ZielJahr.val()) {
                $ZielJahr.focus();
			}
			apziel_initiiert.resolve();
		}
	});
	return apziel_initiiert.promise();
};

// setzt window.apf.apziel und localStorage.apziel_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowApziel = function(id) {
	'use strict';
	localStorage.apziel_id = id;
	var getApziel = $.ajax({
		type: 'get',
		url: 'php/apziel.php',
		dataType: 'json',
		data: {
			"id": localStorage.apziel_id
		}
	});
	getApziel.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// apziel bereitstellen
			window.apf.apziel = data;
		}
	});
};

window.apf.initiiere_zielber = function() {
	'use strict';
	if (!localStorage.zielber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("zielber");
	// Daten für die zielber aus der DB holen
	var getZielBer = $.ajax({
            type: 'get',
            url: 'php/zielber.php',
            dataType: 'json',
            data: {
                "id": localStorage.zielber_id
            }
        }),
        $ZielBerJahr = $("#ZielBerJahr");
	getZielBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// zeilber bereitstellen
			window.apf.zielber = data;
			// Felder mit Daten beliefern
            $ZielBerJahr.val(data.ZielBerJahr);
			$("#ZielBerErreichung").val(data.ZielBerErreichung);
			$("#ZielBerTxt").val(data.ZielBerTxt);
			// Formulare blenden
			window.apf.zeigeFormular("zielber");
			history.replaceState({zielber: "zielber"}, "zielber", "index.html?ap=" + localStorage.ap_id + "&apziel=" + localStorage.apziel_id + "&zielber=" + localStorage.zielber_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$ZielBerJahr.val()) {
                $ZielBerJahr.focus();
			}
		}
	});
};

// setzt window.apf.zielber und localStorage.zielber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowZielber = function(id) {
	'use strict';
	localStorage.zielber_id = id;
	var getZielber = $.ajax({
		type: 'get',
		url: 'php/zielber.php',
		dataType: 'json',
		data: {
			"id": localStorage.zielber_id
		}
	});
	getZielber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// zielber bereitstellen
			window.apf.zielber = data;
		}
	});
};

window.apf.initiiere_erfkrit = function() {
	'use strict';
	if (!localStorage.erfkrit_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("erfkrit");
	// Daten für die erfkrit aus der DB holen
	var getErfkrit = $.ajax({
            type: 'get',
            url: 'php/erfkrit.php',
            dataType: 'json',
            data: {
                "id": localStorage.erfkrit_id
            }
        }),
        $ErfkritErreichungsgrad = $("#ErfkritErreichungsgrad");
	getErfkrit.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// erfkrit bereitstellen
			window.apf.erfkrit = data;
			// Felder mit Daten beliefern
			$("#ErfkritErreichungsgrad" + data.ErfkritErreichungsgrad).prop("checked", true);
			$("#ErfkritTxt")
                .val(data.ErfkritTxt)
                .limiter(255, $("#ErfkritTxt_limit"));
			// Formulare blenden
			window.apf.zeigeFormular("erfkrit");
			history.replaceState({erfkrit: "erfkrit"}, "erfkrit", "index.html?ap=" + localStorage.ap_id + "&erfkrit=" + localStorage.erfkrit_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$ErfkritErreichungsgrad.val()) {
                $ErfkritErreichungsgrad.focus();
			}
		}
	});
};

// setzt window.apf.erfkrit und localStorage.erfkrit_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowErfkrit = function(id) {
	'use strict';
	localStorage.erfkrit_id = id;
	var getErfkrit = $.ajax({
		type: 'get',
		url: 'php/erfkrit.php',
		dataType: 'json',
		data: {
			"id": localStorage.erfkrit_id
		}
	});
	getErfkrit.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// erfkrit bereitstellen
			window.apf.erfkrit = data;
		}
	});
};

window.apf.initiiere_jber = function() {
	'use strict';
	if (!localStorage.jber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("jber");
	// Daten für die jber aus der DB holen
	var getJber = $.ajax({
            type: 'get',
            url: 'php/jber.php',
            dataType: 'json',
            data: {
                "id": localStorage.jber_id
            }
        }),
        $JBerJahr = $("#JBerJahr");
	getJber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// jber bereitstellen
			window.apf.jber = data;
			// Felder mit Daten beliefern
            $JBerJahr.val(data.JBerJahr);
			$("#JBerSituation").val(data.JBerSituation);
			$("#JBerVergleichVorjahrGesamtziel").val(data.JBerVergleichVorjahrGesamtziel);
			$("#JBerBeurteilung" + data.JBerBeurteilung).prop("checked", true);
			// escapen, + und - werden sonst verändert
			$("#JBerVeraenGegenVorjahr\\" + data.JBerVeraenGegenVorjahr).prop("checked", true);
			$("#JBerAnalyse")
                .val(data.JBerAnalyse)
                .limiter(255, $("#JBerAnalyse_limit"));
			$("#JBerUmsetzung").val(data.JBerUmsetzung);
			$("#JBerErfko").val(data.JBerErfko);
			$("#JBerATxt").val(data.JBerATxt);
			$("#JBerBTxt").val(data.JBerBTxt);
			$("#JBerCTxt").val(data.JBerCTxt);
			$("#JBerDTxt").val(data.JBerDTxt);
			if (data.JBerDatum !== "01.01.1970") {
				// php macht aus einem Nullwert im Datum den 1.1.1970!!!
				$("#JBerDatum").val(data.JBerDatum);
			} else {
				$("#JBerDatum").val("");
			}
			// JBerBearb: Daten holen - oder vorhandene nutzen
			if (!window.apf.adressen_html) {
				var getAdressen = $.ajax({
					type: 'get',
					url: 'api/adressen',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// adressen bereitstellen
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2, function(adresse) {
                            html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                        });
						window.apf.adressen_html = html;
						$("#JBerBearb")
                            .html(html)
                            .val(window.apf.jber.JBerBearb);
					}
				});
			} else {
				$("#JBerBearb")
                    .html(window.apf.adressen_html)
                    .val(window.apf.jber.JBerBearb);
			}
			// Formulare blenden
			window.apf.zeigeFormular("jber");
			history.replaceState({jber: "jber"}, "jber", "index.html?ap=" + localStorage.ap_id + "&jber=" + localStorage.jber_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$JBerJahr.val()) {
                $JBerJahr.focus();
			}
		}
	});
};

// setzt window.apf.jber und localStorage.jber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowJber = function(id) {
	'use strict';
	localStorage.jber_id = id;
	var getJber = $.ajax({
		type: 'get',
		url: 'php/jber.php',
		dataType: 'json',
		data: {
			"id": localStorage.jber_id
		}
	});
	getJber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// jber bereitstellen
			window.apf.jber = data;
		}
	});
};

window.apf.initiiere_jber_uebersicht = function() {
	'use strict';
	if (!localStorage.jber_uebersicht_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("jber_uebersicht");
	// Daten für die jber_uebersicht aus der DB holen
	var getJberÜbersicht = $.ajax({
            type: 'get',
            url: 'php/jber_uebersicht.php',
            dataType: 'json',
            data: {
                "JbuJahr": localStorage.jber_uebersicht_id
            }
        }),
        $JbuJahr = $("#JbuJahr");
	getJberÜbersicht.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// jber_uebersicht bereitstellen
			window.apf.jber_übersicht = data;
			// Felder mit Daten beliefern
            $JbuJahr.val(data.JbuJahr);
			$("#JbuBemerkungen").val(data.JbuBemerkungen);
			// window.apf.fitTextareaToContent("Bemerkungen", document.documentElement.clientHeight);
			// Formulare blenden
			window.apf.zeigeFormular("jber_uebersicht");
			history.replaceState({jber_uebersicht: "jber_uebersicht"}, "jber_uebersicht", "index.html?ap=" + localStorage.ap_id + "&jber_uebersicht=" + localStorage.jber_uebersicht_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$JbuJahr.val()) {
                $JbuJahr.focus();
			}
		}
	});
};

// setzt window.apf.jber_übersicht und localStorage.jber_uebersicht_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowJberUebersicht = function(id) {
	'use strict';
	localStorage.jber_uebersicht_id = id;
	var getJberUebersicht = $.ajax({
		type: 'get',
		url: 'php/jber_uebersicht.php',
		dataType: 'json',
		data: {
			"id": localStorage.jber_uebersicht_id
		}
	});
	getJberUebersicht.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// jber_uebersicht bereitstellen
			window.apf.jber_übersicht = data;
		}
	});
};

window.apf.initiiere_ber = function() {
	'use strict';
	if (!localStorage.ber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("ber");
	// Daten für die ber aus der DB holen
	var getBer = $.ajax({
            type: 'get',
            url: 'php/ber.php',
            dataType: 'json',
            data: {
                "id": localStorage.ber_id
            }
        }),
        $BerAutor = $("#BerAutor"),
        $BerJahr = $("#BerJahr"),
        $BerTitel = $("#BerTitel"),
        $BerURL = $("#BerURL");
	getBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// ber bereitstellen
			window.apf.ber = data;
			// Felder mit Daten beliefern
            $BerAutor.val(data.BerAutor);
            $BerJahr.val(data.BerJahr);
            $BerTitel
                .val(data.BerTitel)
                .limiter(255, $("#BerTitel_limit"));
            $BerURL
                .val(data.BerURL)
                .limiter(255, $("#BerURL_limit"));
			// URL-Link initialisieren, wird bei Änderung der URL in index.html angepasst
			$('#BerURLHref').attr('onClick', "window.open('" + data.BerURL + "', target='_blank')");
			// Formulare blenden
			window.apf.zeigeFormular("ber");
			history.replaceState({ber: "ber"}, "ber", "index.html?ap=" + localStorage.ap_id + "&ber=" + localStorage.ber_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$BerAutor.val()) {
                $BerAutor.focus();
			} else if (!$BerJahr.val()) {
                $BerJahr.focus();
			} else if (!$BerTitel.val()) {
                $BerTitel.focus();
			} else if (!$BerURL.val()) {
                $BerURL.focus();
			}
		}
	});
};

// setzt window.apf.ber und localStorage.ber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowBer = function(id) {
	'use strict';
	localStorage.ber_id = id;
	var getBer = $.ajax({
		type: 'get',
		url: 'php/ber.php',
		dataType: 'json',
		data: {
			"id": localStorage.ber_id
		}
	});
	getBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// ber bereitstellen
			window.apf.ber = data;
		}
	});
};

// setzt window.apf.idealbiotop und localStorage.idealbiotop_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowIdealbiotop = function(id) {
	'use strict';
	localStorage.idealbiotop_id = id;
	var getIdealbiotop = $.ajax({
		type: 'get',
		url: '/api/select/tabelle=tblIdealbiotop/tabelleIdFeld=IbApArtId/tabelleId=' + localStorage.idealbiotop_id,
		dataType: 'json'
	});
	getIdealbiotop.done(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data && data[0]) {
			// idealbiotop bereitstellen
			window.apf.idealbiotop = data[0];
		}
	});
};

window.apf.initiiere_assozarten = function() {
	'use strict';
	if (!localStorage.assozarten_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_ap();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("assozarten");
	// Daten für die assozarten aus der DB holen
	var getAssozarten = $.ajax({
            type: 'get',
            url: '/api/select/tabelle=tblAssozArten/tabelleIdFeld=AaId/tabelleId=' + localStorage.assozarten_id,
            dataType: 'json'
        }),
        $AaSisfNr = $("#AaSisfNr");
	getAssozarten.done(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data && data.length > 0) {
			// assozarten bereitstellen
			window.apf.assozarten = data[0];
			// Felder mit Daten beliefern
            $AaSisfNr.val(data[0].AaSisfNr);
			$("#AaBem").val(data[0].AaBem);
			// Formulare blenden
			window.apf.zeigeFormular("assozarten");
			history.replaceState({assozarten: "assozarten"}, "assozarten", "index.html?ap=" + localStorage.ap_id + "&assozarten=" + localStorage.assozarten_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$AaSisfNr.val()) {
                $AaSisfNr.focus();
			}
		}
	});
};

// setzt window.apf.assozarten und localStorage.assozarten_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowAssozarten = function(id) {
	'use strict';
	localStorage.assozarten_id = id;
	var getAssozarten = $.ajax({
		type: 'get',
		url: '/api/select/tabelle=tblAssozArten/tabelleIdFeld=AaId/tabelleId=' + localStorage.assozarten_id,
		dataType: 'json'
	});
	getAssozarten.done(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// assozarten bereitstellen
			window.apf.assozarten = data;
		}
	});
};

window.apf.initiiere_popmassnber = function() {
	'use strict';
	if (!localStorage.popmassnber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("popmassnber");
	// Daten für die pop aus der DB holen
	var getPopmassnber = $.ajax({
		type: 'get',
		url: 'php/popmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popmassnber_id
		}
	});
	getPopmassnber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// popmassnber bereitstellen
			window.apf.popmassnber = data;
			// Felder mit Daten beliefern
			$("#PopMassnBerJahr").val(data.PopMassnBerJahr);
			$("#PopMassnBerErfolgsbeurteilung" + data.PopMassnBerErfolgsbeurteilung).prop("checked", true);
			$("#PopMassnBerTxt").val(data.PopMassnBerTxt);
			// Formulare blenden
			window.apf.zeigeFormular("popmassnber");
			history.replaceState({popmassnber: "popmassnber"}, "popmassnber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&popmassnber=" + localStorage.popmassnber_id);
			// bei neuen Datensätzen Fokus steuern
			$('#PopMassnBerJahr').focus();
		}
	});
};

// setzt window.apf.popmassnber und localStorage.popmassnber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowPopmassnber = function(id) {
	'use strict';
	localStorage.popmassnber_id = id;
	var getPopmassnber = $.ajax({
		type: 'get',
		url: 'php/popmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popmassnber_id
		}
	});
	getPopmassnber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// popmassnber bereitstellen
			window.apf.popmassnber = data;
		}
	});
};

window.apf.initiiere_tpop = function(ohne_zu_zeigen) {
	'use strict';
	var $TPopFlurname = $("#TPopFlurname");
	if (!localStorage.tpop_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("tpop");
	// Daten für die pop aus der DB holen
	var getTPop = $.ajax({
        type: 'get',
        url: 'php/tpop.php',
        dataType: 'json',
        data: {
            "id": localStorage.tpop_id
        }
    });
	getTPop.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpop bereitstellen
			window.apf.tpop = data;
			// Felder mit Daten beliefern
            $TPopFlurname
                .val(data.TPopFlurname)
                .limiter(255, $("#TPopFlurname_limit"));
			$("#TPopNr").val(data.TPopNr);
			$("#TPopHerkunft" + data.TPopHerkunft).prop("checked", true);
			if (data.TPopHerkunftUnklar == 1) {
				$("#TPopHerkunftUnklar").prop("checked", true);
			} else {
				$("#TPopHerkunftUnklar").prop("checked", false);
			}
			$("#TPopHerkunftUnklarBegruendung")
                .val(data.TPopHerkunftUnklarBegruendung)
                .limiter(255, $("#TPopHerkunftUnklarBegruendung_limit"));
			$("#TPopApBerichtRelevant" + data.TPopApBerichtRelevant).prop("checked", true);
			$("#TPopBekanntSeit").val(data.TPopBekanntSeit);
			$("#TPopGemeinde")
                .val(data.TPopGemeinde)
                .limiter(255, $("#TPopGemeinde_limit"));
			$("#TPopXKoord").val(data.TPopXKoord);
			$("#TPopYKoord").val(data.TPopYKoord);
			$("#TPopRadius").val(data.TPopRadius);
			$("#TPopHoehe").val(data.TPopHoehe);
			$("#TPopExposition")
                .val(data.TPopExposition)
                .limiter(50, $("#TPopExposition_limit"));
			$("#TPopKlima")
                .val(data.TPopKlima)
                .limiter(50, $("#TPopKlima_limit"));
			$("#TPopNeigung")
                .val(data.TPopNeigung)
                .limiter(50, $("#TPopNeigung_limit"));
			$("#TPopBeschr")
                .val(data.TPopBeschr)
                .limiter(255, $("#TPopBeschr_limit"));
			$("#TPopKatNr")
                .val(data.TPopKatNr)
                .limiter(255, $("#TPopKatNr_limit"));
			$("#TPopEigen")
                .val(data.TPopEigen)
                .limiter(255, $("#TPopEigen_limit"));
			$("#TPopKontakt")
                .val(data.TPopKontakt)
                .limiter(255, $("#TPopKontakt_limit"));
			$("#TPopNutzungszone")
                .val(data.TPopNutzungszone)
                .limiter(255, $("#TPopNutzungszone_limit"));
			$("#TPopBewirtschafterIn")
                .val(data.TPopBewirtschafterIn)
                .limiter(255, $("#TPopBewirtschafterIn_limit"));
			$("#TPopBewirtschaftung")
                .val(data.TPopBewirtschaftung)
                .limiter(255, $("#TPopBewirtschaftung_limit"));
			$("#TPopTxt").val(data.TPopTxt);
			// für select Daten holen - oder vorhandene nutzen
			if (!window.apf.adressen_html) {
				var getAdressen = $.ajax({
					type: 'get',
					url: 'api/adressen',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// adressen bereitstellen
						window.apf.adressen = data2;
						localStorage.adressen = JSON.stringify(data2);
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2, function(adresse) {
                            html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                        });
						window.apf.adressen_html = html;
						$("#TPopVerantw")
                            .html(html)
                            .val(window.apf.tpop.TPopVerantw);
					}
				});
			} else {
				$("#TPopVerantw")
                    .html(window.apf.adressen_html)
                    .val(window.apf.tpop.TPopVerantw);
			}
			// Formulare blenden
			// nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
			if (!ohne_zu_zeigen) {
				window.apf.zeigeFormular("tpop");
				history.replaceState({tpop: "tpop"}, "tpop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id);
				// bei neuen Datensätzen Fokus steuern
				if (!$TPopFlurname.val()) {
					$('#TPopNr').focus();
				}
			}
		}
	});
	getTPop.fail(function() {
		//window.apf.melde('Fehler: keine Daten für die Teilpopulation erhalten');
		console.log('Fehler: keine Daten für die Teilpopulation erhalten');
	});
};

// setzt window.apf.tpop und localStorage.tpop_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpop = function(id) {
	'use strict';
	localStorage.tpop_id = id;
	var getTPop = $.ajax({
		type: 'get',
		url: 'php/tpop.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpop_id
		}
	});
	getTPop.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpop bereitstellen
			window.apf.tpop = data;
		}
	});
};

window.apf.initiiere_popber = function() {
	'use strict';
	if (!localStorage.popber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("popber");
	// Daten für die popber aus der DB holen
	var getPopber = $.ajax({
		type: 'get',
		url: 'php/popber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popber_id
		}
	});
	getPopber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// popber bereitstellen
			window.apf.popber = data;
			// Felder mit Daten beliefern
			$("#PopBerJahr").val(data.PopBerJahr);
			$("#PopBerEntwicklung" + data.PopBerEntwicklung).prop("checked", true);
			$("#PopBerTxt").val(data.PopBerTxt);
			// Formulare blenden
			window.apf.zeigeFormular("popber");
			history.replaceState({tpopber: "popber"}, "popber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&popber=" + localStorage.popber_id);
			// bei neuen Datensätzen Fokus steuern
			$('#PopBerJahr').focus();
		}
	});
};

// setzt window.apf.popber und localStorage.popber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowPopber = function(id) {
	'use strict';
	localStorage.popber_id = id;
	var getPopber = $.ajax({
		type: 'get',
		url: 'php/popber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popber_id
		}
	});
	getPopber.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// popber bereitstellen
			window.apf.popber = data;
		}
	});
};

window.apf.initiiere_tpopfeldkontr = function() {
	'use strict';
	// wird gemeinsam für Feld- und Freiwilligenkontrollen verwendet
	// Feldkontrollen: Felder der Freiwilligenkontrollen ausblenden
	// Freiwilligenkontrollen: Felder der Feldkontrollen ausblenen plus Register Biotop
	if (!localStorage.tpopfeldkontr_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("tpopfeldkontr");
	// alle Felder ausblenden. Später werden die benötigten eingeblendet
	$('.feld_tpopfeldkontr').each(function() {
		$(this).hide();
	});
	// Daten für die tpopfeldkontr aus der DB holen
	var getTpopfeldkontr = $.ajax({
            type: 'get',
            url: 'php/tpopfeldkontr.php',
            dataType: 'json',
            data: {
                "id": localStorage.tpopfeldkontr_id
            }
        }),
        $TPopKontrJahr = $("#TPopKontrJahr"),
        $TPopKontrJungPflJN_ja = $("#TPopKontrJungPflJN_ja"),
        $TPopKontrJungPflJN_nein = $("#TPopKontrJungPflJN_nein"),
        $TPopKontrJungPflJN_leer = $("#TPopKontrJungPflJN_leer");
	getTpopfeldkontr.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopfeldkontr bereitstellen
			window.apf.tpopfeldkontr = data;
			// gemeinsame Felder
			// mit Daten beliefern
            $TPopKontrJahr.val(data.TPopKontrJahr);
			if (data.TPopKontrDatum !== "01.01.1970") {
				// php macht aus einem Nullwert im Datum den 1.1.1970!!!
				$("#TPopKontrDatum").val(data.TPopKontrDatum);
			} else {
				$("#TPopKontrDatum").val("");
			}
			$("#TPopKontrMethode1" + data.TPopKontrMethode1).prop("checked", true);
			$("#TPopKontrAnz1").val(data.TPopKontrAnz1);
			$("#TPopKontrMethode2" + data.TPopKontrMethode2).prop("checked", true);
			$("#TPopKontrAnz2").val(data.TPopKontrAnz2);
			$("#TPopKontrMethode3" + data.TPopKontrMethode3).prop("checked", true);
			$("#TPopKontrAnz3").val(data.TPopKontrAnz3);
			$("#TPopKontrTxt").val(data.TPopKontrTxt);
			$("#TPopKontrGuid").val(data.TPopKontrGuid);
			// TPopKontrBearb: Daten holen - oder vorhandene nutzen
			if (!window.apf.adressen_html) {
				var getAdressen = $.ajax({
					type: 'get',
					url: 'api/adressen',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2, function(adresse) {
                            html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                        });
						window.apf.adressen_html = html;
						$("#TPopKontrBearb")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrBearb);
					}
				});
			} else {
				$("#TPopKontrBearb")
                    .html(window.apf.adressen_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrBearb);
			}
			// für 3 selectfelder TPopKontrZaehleinheit Daten holen - oder vorhandene nutzen
			if (!window.apf.TPopKontrZähleinheit_html) {
				var getTpopfeldkontrZaehleinheit = $.ajax({
					type: 'get',
					url: 'php/tpopfeldkontr_zaehleinheit.php',
					dataType: 'json'
				});
				getTpopfeldkontrZaehleinheit.always(function(data3) {
					if (data3) {
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data3.rows, function(zähleinheit) {
                            html += "<option value=\"" + zähleinheit.id + "\">" + zähleinheit.ZaehleinheitTxt + "</option>";
                        });
						window.apf.TPopKontrZähleinheit_html = html;
						// alle 3 Felder setzen
						$("#TPopKontrZaehleinheit1")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit1);
						$("#TPopKontrZaehleinheit2")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit2);
						$("#TPopKontrZaehleinheit3")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit3);
					}
				});
			} else {
				// alle 3 Felder setzen
				$("#TPopKontrZaehleinheit1")
                    .html(window.apf.TPopKontrZähleinheit_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit1);
				$("#TPopKontrZaehleinheit2")
                    .html(window.apf.TPopKontrZähleinheit_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit2);
				$("#TPopKontrZaehleinheit3")
                    .html(window.apf.TPopKontrZähleinheit_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrZaehleinheit3);
			}
			// Felder, die nur in der Feldkontrolle vorkommen
			if (!localStorage.tpopfreiwkontr) {
				$("#TPopKontrTyp" + data.TPopKontrTyp).prop("checked", true);
				$("#TPopKontrJungpfl").val(data.TPopKontrJungpfl);
				$("#TPopKontrVitalitaet")
                    .val(data.TPopKontrVitalitaet)
                    .limiter(255, $("#TPopKontrVitalitaet_limit"));
				$("#TPopKontrUeberleb").val(data.TPopKontrUeberleb);
				$("#TPopKontrEntwicklung" + data.TPopKontrEntwicklung).prop("checked", true);
				$("#TPopKontrUrsach")
                    .val(data.TPopKontrUrsach)
                    .limiter(255, $("#TPopKontrUrsach_limit"));
				$("#TPopKontrUrteil")
                    .val(data.TPopKontrUrteil)
                    .limiter(255, $("#TPopKontrUrteil_limit"));
				$("#TPopKontrAendUms")
                    .val(data.TPopKontrAendUms)
                    .limiter(255, $("#TPopKontrAendUms_limit"));
				$("#TPopKontrAendKontr")
                    .val(data.TPopKontrAendKontr)
                    .limiter(255, $("#TPopKontrAendKontr_limit"));
				// Biotop
				$("#TPopKontrFlaeche").val(data.TPopKontrFlaeche);
				$("#TPopKontrVegTyp")
                    .val(data.TPopKontrVegTyp)
                    .limiter(100, $("#TPopKontrVegTyp_limit"));
				$("#TPopKontrKonkurrenz")
                    .val(data.TPopKontrKonkurrenz)
                    .limiter(100, $("#TPopKontrKonkurrenz_limit"));
				$("#TPopKontrMoosschicht")
                    .val(data.TPopKontrMoosschicht)
                    .limiter(100, $("#TPopKontrMoosschicht_limit"));
				$("#TPopKontrKrautschicht")
                    .val(data.TPopKontrKrautschicht)
                    .limiter(100, $("#TPopKontrKrautschicht_limit"));
				$("#TPopKontrStrauchschicht")
                    .val(data.TPopKontrStrauchschicht)
                    .limiter(255, $("#TPopKontrStrauchschicht_limit"));
				$("#TPopKontrBaumschicht")
                    .val(data.TPopKontrBaumschicht)
                    .limiter(100, $("#TPopKontrBaumschicht_limit"));
				$("#TPopKontrBodenTyp")
                    .val(data.TPopKontrBodenTyp)
                    .limiter(255, $("#TPopKontrBodenTyp_limit"));
				$("#TPopKontrBodenKalkgehalt")
                    .val(data.TPopKontrBodenKalkgehalt)
                    .limiter(100, $("#TPopKontrBodenKalkgehalt_limit"));
				$("#TPopKontrBodenDurchlaessigkeit")
                    .val(data.TPopKontrBodenDurchlaessigkeit)
                    .limiter(100, $("#TPopKontrBodenDurchlaessigkeit_limit"));
				$("#TPopKontrBodenHumus")
                    .val(data.TPopKontrBodenHumus)
                    .limiter(100, $("#TPopKontrBodenHumus_limit"));
				$("#TPopKontrBodenNaehrstoffgehalt")
                    .val(data.TPopKontrBodenNaehrstoffgehalt)
                    .limiter(100, $("#TPopKontrBodenNaehrstoffgehalt_limit"));
				$("#TPopKontrBodenAbtrag")
                    .val(data.TPopKontrBodenAbtrag)
                    .limiter(255, $("#TPopKontrBodenAbtrag_limit"));
				$("#TPopKontrWasserhaushalt")
                    .val(data.TPopKontrWasserhaushalt)
                    .limiter(255, $("#TPopKontrWasserhaushalt_limit"));
				$("#TPopKontrHandlungsbedarf").val(data.TPopKontrHandlungsbedarf);
				$("#TPopKontrIdealBiotopUebereinst" + data.TPopKontrIdealBiotopUebereinst).prop("checked", true);
				// TPopKontrLeb: Daten holen - oder vorhandene nutzen
				if (!window.apf.lrdelarze_html) {
					var getLrDelarze = $.ajax({
						type: 'get',
						url: 'php/lrdelarze.php',
						dataType: 'json'
					});
					getLrDelarze.always(function(data4) {
						if (data4) {
							// Feld mit Daten beliefern
							var html;
							html = "<option></option>";
                            _.each(data4.rows, function(lr) {
                                html += "<option value=\"" + lr.id + "\">" + lr.Einheit + "</option>";
                            });
							window.apf.lrdelarze_html = html;
							$("#TPopKontrLeb")
                                .html(html)
                                .val(window.apf.tpopfeldkontr.TPopKontrLeb);
							$("#TPopKontrLebUmg")
                                .html(html)
                                .val(window.apf.tpopfeldkontr.TPopKontrLebUmg);
						}
					});
				} else {
					$("#TPopKontrLeb")
                        .html(window.apf.lrdelarze_html)
                        .val(window.apf.tpopfeldkontr.TPopKontrLeb);
					$("#TPopKontrLebUmg")
                        .html(window.apf.lrdelarze_html)
                        .val(window.apf.tpopfeldkontr.TPopKontrLebUmg);
				}
			}
			// TPopKontrIdealBiotopUebereinst: Daten holen - oder vorhandene nutzen
			if (!window.apf.IdealBiotopÜbereinst_html) {
				var getIdealbiotopübereinst = $.ajax({
					type: 'get',
					url: 'php/idealbiotopuebereinst.php',
					dataType: 'json'
				});
				getIdealbiotopübereinst.always(function(data5) {
					if (data5) {
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data5.rows, function(übereinst) {
                            html += "<option value=\"" + übereinst.id + "\">" + übereinst.DomainTxt + "</option>";
                        });
						window.apf.IdealBiotopÜbereinst_html = html;
						$("#TPopKontrIdealBiotopUebereinst")
                            .html(html)
                            .val(window.apf.tpopfeldkontr.TPopKontrIdealBiotopUebereinst);
					}
				});
			} else {
				$("#TPopKontrIdealBiotopUebereinst")
                    .html(window.apf.IdealBiotopÜbereinst_html)
                    .val(window.apf.tpopfeldkontr.TPopKontrIdealBiotopUebereinst);
			}
			// Felder, die nur in freiwkontr vorkommen
			if (localStorage.tpopfreiwkontr) {
				if (data.TPopKontrPlan == 1) {
					$("#TPopKontrPlan").prop("checked", true);
				} else {
					$("#TPopKontrPlan").prop("checked", false);
				}
				$("#TPopKontrUebFlaeche").val(data.TPopKontrUebFlaeche);
				$("#TPopKontrUebPfl").val(data.TPopKontrUebPfl);
				$("#TPopKontrNaBo").val(data.TPopKontrNaBo);
				$TPopKontrJungPflJN_ja.prop("checked", false);
				$TPopKontrJungPflJN_nein.prop("checked", false);
				$TPopKontrJungPflJN_leer.prop("checked", false);
				if (data.TPopKontrJungPflJN == 1) {
					$TPopKontrJungPflJN_ja.prop("checked", true);
				} else if (data.TPopKontrJungPflJN == 0) {
					$TPopKontrJungPflJN_nein.prop("checked", true);
				} else {
					$TPopKontrJungPflJN_leer.prop("checked", true);
				}
				$("#TPopKontrVegHoeMax").val(data.TPopKontrVegHoeMax);
				$("#TPopKontrVegHoeMit").val(data.TPopKontrVegHoeMit);
				$("#TPopKontrGefaehrdung")
                    .val(data.TPopKontrGefaehrdung)
                    .limiter(255, $("#TPopKontrGefaehrdung_limit"));
			}
			// fieldcontain-divs der benötigten Felder einblenden
			if (localStorage.tpopfreiwkontr) {
                _.each(window.apf.feldliste_freiwkontr, function(feld) {
                    $("#fieldcontain_" + feld).show();
                });
			} else {
                _.each(window.apf.feldliste_feldkontr, function(feld) {
                    $("#fieldcontain_" + feld).show();
                });
			}
			// Formulare blenden
			window.apf.zeigeFormular("tpopfeldkontr");
			if (!localStorage.tpopfreiwkontr) {
				history.replaceState({tpopfeldkontr: "tpopfeldkontr"}, "tpopfeldkontr", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopfeldkontr=" + localStorage.tpopfeldkontr_id);
			} else {
				history.replaceState({tpopfreiwkontr: "tpopfreiwkontr"}, "tpopfreiwkontr", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopfreiwkontr=" + localStorage.tpopfeldkontr_id);
			}
			// Register in Feldkontr blenden
			if (localStorage.tpopfreiwkontr) {
				$("#tpopfeldkontr_tabs_biotop").hide();
				$("#biotop_tab_li").hide();
				$("#tpopfeldkontr_tabs").tabs("option", "active", 0);
			} else {
				$("#tpopfeldkontr_tabs_biotop").show();
				$("#biotop_tab_li").show();
				// Dieses Element wird fälschlicherweise in Entwicklung eingeblendet
				// keine Ahnung wieso
				// ausblenden!
				$("#tpopfeldkontr_tabs_biotop").hide();
			}
			// Fokus steuern
            $TPopKontrJahr.focus();
			$(window).scrollTop(0);
		}
	});
};

// setzt window.apf.tpopfeldkontr und localStorage.tpopfeldkontr_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopfeldkontr = function(id) {
	'use strict';
	localStorage.tpopfeldkontr_id = id;
	var getTpopfeldkontr = $.ajax({
		type: 'get',
		url: 'php/tpopfeldkontr.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopfeldkontr_id
		}
	});
	getTpopfeldkontr.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopfeldkontr bereitstellen
			window.apf.tpopfeldkontr = data;
		}
	});
};

window.apf.initiiere_tpopmassn = function() {
	'use strict';
	if (!localStorage.tpopmassn_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("tpopmassn");
	// Daten für die pop aus der DB holen
	var getTPopMassn = $.ajax({
		type: 'get',
		url: 'php/tpopmassn.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassn_id
		}
	});
	getTPopMassn.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopmassn bereitstellen
			window.apf.tpopmassn = data;
			// Felder mit Daten beliefern
			// für select TPopMassnTyp Daten holen - oder vorhandene nutzen
			if (!window.apf.tpopmassntyp_html) {
				var getTPopMassnTyp = $.ajax({
					type: 'get',
					url: 'php/tpopmassn_typ.php',
					dataType: 'json'
				});
				getTPopMassnTyp.always(function(data2) {
					if (data2) {
						// tpopmassn_typ bereitstellen
						window.apf.tpopmassn_typ = data2;
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2.rows, function(tpopmassn_typ) {
                            html += "<option value=\"" + tpopmassn_typ.id + "\">" + tpopmassn_typ.MassnTypTxt + "</option>";
                        });
						window.apf.tpopmassntyp_html = html;
						$("#TPopMassnTyp")
                            .html(html)
                            .val(window.apf.tpopmassn.TPopMassnTyp);
					}
				});
			} else {
				$("#TPopMassnTyp")
                    .html(window.apf.tpopmassntyp_html)
                    .val(window.apf.tpopmassn.TPopMassnTyp);
			}
			$("#TPopMassnTxt")
                .val(data.TPopMassnTxt)
                .limiter(255, $("#TPopMassnTxt_limit"));
			$("#TPopMassnJahr").val(data.TPopMassnJahr);
			if (data.TPopMassnDatum !== "01.01.1970") {
				// php macht aus einem Nullwert im Datum den 1.1.1970!!!
				$("#TPopMassnDatum").val(data.TPopMassnDatum);
			} else {
				$("#TPopMassnDatum").val("");
			}
			// TPopMassnBearb: Daten holen - oder vorhandene nutzen
			if (!window.apf.adressen_html) {
				var getAdressen = $.ajax({
					type: 'get',
					url: 'api/adressen',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2, function(adresse) {
                            html += "<option value=\"" + adresse.id + "\">" + adresse.AdrName + "</option>";
                        });
						window.apf.adressen_html = html;
						$("#TPopMassnBearb")
                            .html(html)
                            .val(window.apf.tpopmassn.TPopMassnBearb);
					}
				});
			} else {
				$("#TPopMassnBearb")
                    .html(window.apf.adressen_html)
                    .val(window.apf.tpopmassn.TPopMassnBearb);
			}
			$("#TPopMassnBemTxt").val(data.TPopMassnBemTxt);
			if (data.TPopMassnPlan == 1) {
				$("#TPopMassnPlan").prop("checked", true);
			} else {
				$("#TPopMassnPlan").prop("checked", false);
			}
			$("#TPopMassnPlanBez")
                .val(data.TPopMassnPlanBez)
                .limiter(255, $("#TPopMassnPlanBez_limit"));
			$("#TPopMassnFlaeche").val(data.TPopMassnFlaeche);
			$("#TPopMassnAnsiedForm")
                .val(data.TPopMassnAnsiedForm)
                .limiter(255, $("#TPopMassnAnsiedForm_limit"));
			$("#TPopMassnAnsiedPflanzanordnung")
                .val(data.TPopMassnAnsiedPflanzanordnung)
                .limiter(255, $("#TPopMassnAnsiedPflanzanordnung_limit"));
			$("#TPopMassnMarkierung")
                .val(data.TPopMassnMarkierung)
                .limiter(255, $("#TPopMassnMarkierung_limit"));
			$("#TPopMassnAnsiedAnzTriebe").val(data.TPopMassnAnsiedAnzTriebe);
			$("#TPopMassnAnsiedAnzPfl").val(data.TPopMassnAnsiedAnzPfl);
			$("#TPopMassnAnzPflanzstellen").val(data.TPopMassnAnzPflanzstellen);
			// für TPopMassnAnsiedWirtspfl wurde die Artliste schon bereitgestellt
			// wenn die Anwendung direkt auf einer TPopMassn geöffnet wird, ist die Liste noch nicht bereit
			// darum hier nochmals holen
			$.when(window.apf.erstelle_artlisten())
				.then(function() {
					$("#TPopMassnAnsiedWirtspfl").val(data.TPopMassnAnsiedWirtspfl);
					$("#TPopMassnAnsiedHerkunftPop")
                        .val(data.TPopMassnAnsiedHerkunftPop)
                        .limiter(255, $("#TPopMassnAnsiedHerkunftPop_limit"));
					$("#TPopMassnAnsiedDatSamm")
                        .val(data.TPopMassnAnsiedDatSamm)
                        .limiter(50, $("#TPopMassnAnsiedDatSamm_limit"));
					$("#TPopMassnGuid").val(data.TPopMassnGuid);
					// Formulare blenden
					window.apf.zeigeFormular("tpopmassn");
					history.replaceState({tpopmassn: "tpopmassn"}, "tpopmassn", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopmassn=" + localStorage.tpopmassn_id);
					// bei neuen Datensätzen Fokus steuern
					$('#TPopMassnJahr').focus();
				});	
		}
	});
};

// setzt window.apf.tpopmassn und localStorage.tpopmassn_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopmassn = function(id) {
	'use strict';
	localStorage.tpopmassn_id = id;
	var getTPopMassn = $.ajax({
		type: 'get',
		url: 'php/tpopmassn.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassn_id
		}
	});
	getTPopMassn.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopmassn bereitstellen
			window.apf.tpopmassn = data;
		}
	});
};

window.apf.initiiere_tpopmassnber = function() {
	'use strict';
	if (!localStorage.tpopmassnber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("tpopmassnber");
	// Daten für die pop aus der DB holen
	var getTPopMassnBer = $.ajax({
		type: 'get',
		url: 'php/tpopmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassnber_id
		}
	});
	getTPopMassnBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopmassnber bereitstellen
			window.apf.tpopmassnber = data;
			// Felder mit Daten beliefern
			$("#TPopMassnBerJahr").val(data.TPopMassnBerJahr);
			$("#TPopMassnBerErfolgsbeurteilung" + data.TPopMassnBerErfolgsbeurteilung).prop("checked", true);
			$("#TPopMassnBerTxt").val(data.TPopMassnBerTxt);
			// Formulare blenden
			window.apf.zeigeFormular("tpopmassnber");
			history.replaceState({tpopmassnber: "tpopmassnber"}, "tpopmassnber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopmassnber=" + localStorage.tpopmassnber_id);
			// bei neuen Datensätzen Fokus steuern
			$('#TPopMassnBerJahr').focus();
		}
	});
};

// setzt window.apf.tpopmassnber und localStorage.tpopmassnber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopmassnber = function(id) {
	'use strict';
	localStorage.tpopmassnber_id = id;
	var getTPopMassnBer = $.ajax({
		type: 'get',
		url: 'php/tpopmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassnber_id
		}
	});
	getTPopMassnBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopmassnber bereitstellen
			window.apf.tpopmassnber = data;
		}
	});
};

window.apf.initiiereTpopber = function() {
	'use strict';
	if (!localStorage.tpopber_id) {
		// es fehlen benötigte Daten > eine Ebene höher
		window.apf.initiiere_pop();
		return;
	}
	// Felder zurücksetzen
	window.apf.leereFelderVonFormular("tpopber");
	// Daten für die tpopber aus der DB holen
	var getTPopBer = $.ajax({
		type: 'get',
		url: 'php/tpopber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopber_id
		}
	});
	getTPopBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopber bereitstellen
			window.apf.tpopber = data;
			// Felder mit Daten beliefern
			$("#TPopBerJahr").val(data.TPopBerJahr);
			$("#TPopBerEntwicklung" + data.TPopBerEntwicklung).prop("checked", true);
			$("#TPopBerTxt").val(data.TPopBerTxt);
			// Formulare blenden
			window.apf.zeigeFormular("tpopber");
			history.replaceState({tpopber: "tpopber"}, "tpopber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopber=" + localStorage.tpopber_id);
			// bei neuen Datensätzen Fokus steuern
			$('#TPopBerJahr').focus();
		}
	});
};

// setzt window.apf.tpopber und localStorage.tpopber_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowTpopber = function(id) {
	'use strict';
	localStorage.tpopber_id = id;
	var getTPopBer = $.ajax({
		type: 'get',
		url: 'php/tpopber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopber_id
		}
	});
	getTPopBer.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopber bereitstellen
			window.apf.tpopber = data;
		}
	});
};

window.apf.initiiere_beob = function(beobtyp, beobid, beob_status, ohne_zu_zeigen) {
	'use strict';
	// beob_status markiert, ob die Beobachtung:
	// - schon zugewiesen ist (zugeordnet)
	// - noch nicht beurteilt ist (nicht_beurteilt)
	// - nicht zuzuordnen ist (nicht_zuzuordnen)
	// beob_status muss gespeichert werden, damit bei Datenänderungen bekannt ist, ob ein bestehender Datensatz bearbeitet oder ein neuer geschaffen werden muss
	localStorage.beob_status = beob_status;
	// sicherstellen, dass beobtyp immer bekannt ist
	localStorage.beobtyp = beobtyp;

	var url, url_distzutpop;
	if (!beobid && !ohne_zu_zeigen) {
		// es fehlen benötigte Daten > eine Ebene höher
		if (beob_status === "nicht_beurteilt" || beob_status === "nicht_zuzuordnen") {
			window.apf.initiiere_ap();
		} else {
			window.apf.initiiere_pop();
		}
		return;
	}

    // beobid hat meist 'beob' vorangestellt - entfernen!
    if (beobid.indexOf('beob') > -1) {
        beobid = beobid.replace('beob', '');
    }
    // beobid bereitstellen
    localStorage.beob_id = beobid;
	
	// EvAB oder Infospezies? > entsprechende url zusammensetzen
	url = 'php/beob_' + beobtyp + '.php';
	
	// Daten für die beob aus der DB holen
	var getBeob = $.ajax({
            type: 'get',
            url: url,
            dataType: 'json',
            data: {
                "id": beobid
            }
        }),
        $BeobBemerkungen = $("#BeobBemerkungen");

	getBeob.always(function(data_beob) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data_beob) {

			// boebfelder bereitstellen
			var html_beobfelder = window.apf.erstelleFelderFürBeob(data_beob, beobtyp);
			$("#beob_table").html(html_beobfelder);
			
			// Abstand zu TPop aus der DB holen
			url_distzutpop = 'php/beob_distzutpop_' + beobtyp + '.php';
			var getDistZuTPop = $.ajax({
				type: 'get',
				url: url_distzutpop,
				dataType: 'json',
				data: {
					"beobid": beobid
				}
			});
			getDistZuTPop.always(function(data) {
				// Tabellenzeile beginnen
				var html_distzutpop = '<tr class="fieldcontain DistZuTPop"><td class="label"><label id="DistZuTPop_label" for="DistZuTPop">Einer Teilpopulation zuordnen:</label></td><td class="Datenfelder"><div class="Datenfelder" id="DistZuTPop_Felder">';
				if (data) {
                    _.each(data, function(beob, index) {
                        if (index>0) {
                            html_distzutpop += "<br>";
                        }
                        html_distzutpop += '<input type="radio" name="DistZuTPop" id="DistZuTPop';
                        html_distzutpop += beob.TPopId;
                        html_distzutpop += '" class="DistZuTPop" formular="beob" value="';
                        html_distzutpop += beob.TPopId;
                        html_distzutpop += '" DistZuTPop="';
                        html_distzutpop += beob.DistZuTPop;
                        html_distzutpop += '">';
                        // Wenn TPop keine Koordinaten haben, dies anzeigen und Anzeige von NAN verhindern
                        if (parseInt(beob.DistZuTPop, 10) >= 0) {
                            html_distzutpop += parseInt(beob.DistZuTPop) + "m: " + beob.TPopFlurname;
                        } else {
                            html_distzutpop += beob.TPopFlurname;
                        }
                    });
					// Tabellenzeile abschliessen
					html_distzutpop += '</div></td></tr>';

					// distzutpop bereitstellen
					$("#beob_zuordnungsfelder").html(html_distzutpop);

                    $BeobBemerkungen.attr("placeholder", "");

					if (beob_status !== "nicht_beurteilt") {
						// Daten der Zuordnung holen
						var getBeobZuordnung = $.ajax({
							type: 'get',
							url: 'php/beob_zuordnung.php',
							dataType: 'json',
							data: {
								"id": beobid
							}
						});
						getBeobZuordnung.always(function(data) {
							// Felder mit Daten beliefern
							$("#BeobNichtBeurteilt").prop("checked", false);
							if (data.BeobNichtZuordnen == 1) {
								$("#BeobNichtZuordnen").prop("checked", true);
							} else {
								$("#BeobNichtZuordnen").prop("checked", false);
							}
							$("#DistZuTPop"+data.TPopId).prop("checked", true);
							$("#BeobBemerkungen").val(data.BeobBemerkungen);
							$("#BeobMutWann").val(data.BeobMutWann);
							$("#BeobMutWer").val(data.BeobMutWer);

							// Formulare blenden
							// nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
							if (!ohne_zu_zeigen) {
								window.apf.zeigeFormular("beob");
								if (beob_status === "zugeordnet") {
									history.replaceState({beob_zugeordnet: "beob_zugeordnet"}, "beob_zugeordnet", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&beob_zugeordnet=" + beobid);
								} else if (beob_status === "nicht_zuzuordnen") {
									history.replaceState({beob_nicht_zuzuordnen: "beob_nicht_zuzuordnen"}, "beob_nicht_zuzuordnen", "index.html?ap=" + localStorage.ap_id + "&beob_nicht_zuzuordnen=" + beobid);
								}
							}
						});
					} else {
						// beob_status ist "nicht beurteilt"
						$("#BeobNichtBeurteilt").prop("checked", true);
						$("#BeobNichtZuordnen").prop("checked", false);
						// allfällige im letzen beob enthaltene Werte entfernen
                        $BeobBemerkungen
                            .val("")
                            .attr("placeholder", "Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich");
						// Formulare blenden
						// nur, wenn ohne_zu_zeigen nicht true ist (true, um in dialog anzuzeigen)
						if (!ohne_zu_zeigen) {
							window.apf.zeigeFormular("beob");
							history.replaceState({beob_nicht_beurteilt: "beob_nicht_beurteilt"}, "beob_nicht_beurteilt", "index.html?ap=" + localStorage.ap_id + "&beob_nicht_beurteilt=" + beobid);
						}
					}
				}
			});
		}
	});
};

window.apf.initiiere_exporte = function(anchor) {
	'use strict';
	$("#testart_div").hide();
	$("#forms_titelzeile").hide();
	window.apf.zeigeFormular("exporte");
	history.replaceState({ex: "ex"}, "ex", "index.html?exporte=true");
	if (anchor) {
		location.hash = "#" + anchor;
	}
};

// managed die Sichtbarkeit von Formularen
// wird von allen initiiere_-Funktionen verwendet
// wird ein Formularname übergeben, wird dieses Formular gezeigt
// und alle anderen ausgeblendet
// zusätzlich wird die Höhe von textinput-Feldern an den Textinhalt angepasst
window.apf.zeigeFormular = function(Formularname) {
	'use strict';
	var formular_angezeigt = $.Deferred(),
        $forms = $("#forms"),
        $form = $('form'),
        $testart_div = $("#testart_div"),
        $forms_titelzeile = $("#forms_titelzeile"),
        $ap_waehlen = $("#ap_waehlen"),
        $Formularname;
	// zuerst alle Formulare ausblenden
    $forms.hide();
    $form.each(function() {
		$(this).hide();
	});
	// Karten sind in div statt form
	$('.karte').each(function() {
		$(this).hide();
	});

	// damit kann bei Grössenänderung die Formularhöhe von Karten gemanagt werden
	window.apf.kartenhöhe_manuell = false;
	// höhe von forms auf auto setzen, weil dies von den Kartenansichten verändert wird
    $forms.height('auto');
    $testart_div.hide();
    $forms_titelzeile.hide();
	// Titelzeile anzeigen, weil sie für die Kartenanzeige entfernt wird
	//$("#forms_titelzeile").css("display", "inline-block");
	// Bei Testarten Hinweis anzeigen
	if ($ap_waehlen.val()) {
		// titelzeile inline, sonst gibt es einen unschönen Abstand nach oben
		//$("#forms_titelzeile").css("display", "inline");
        $forms_titelzeile.css("display", "none");
		if ($ap_waehlen.val() <= 150 && Formularname !== "jber_uebersicht" && Formularname !== "exporte" && Formularname !== "GeoAdminKarte") {
            // titelzeile inline-block, sonst werden Tabs nach rechts verschoben
            $("#forms_titelzeile").css("display", "inline-block");
            $testart_div
                .css("color", "#03970F")
                .show()
                .html("Das ist eine Testart - hier kann man alles ausprobieren!");
		} else if ($("#ap_waehlen").val() <= 150 && Formularname === "jber_uebersicht") {
            $("#forms_titelzeile").css("display", "inline-block");
            $testart_div
                .css("color", "#DF0303")
                .show()
                .html("Vorsicht: Die Übericht ist für alle Arten, daher HIER NICHT TESTEN");
		}
	}

	if (Formularname) {
        $forms.show();
		$("#ap_loeschen").show();
		$("#exportieren_1").hide();
		if (Formularname === "google_karte" || Formularname === "GeoAdminKarte") {
			// Titelzeile entfernen
			$("#forms_titelzeile").css("display", "none");
			// höhe einstellen
            $Formularname = $("#" + Formularname);
            $Formularname.css("height", $(window).height()-17 + "px");
			// markieren, dass die Formularhöhe anders gesetzt werden soll
			window.apf.kartenhöhe_manuell = true;
			window.apf.setzeKartenhöhe();
            $Formularname.show();
			if (Formularname === "GeoAdminKarte") {
				window.apf.initiiereOlmap();
			}
		} else {
            $forms.css("background-color", "#FFE");
            $form.each(function() {
				$(this).hide();
				if ($(this).attr("id") === Formularname) {
					$(this).show();
					$('textarea').each(function() {
						window.apf.fitTextareaToContent(this, document.documentElement.clientHeight);
					});
				}
			});
			$(window).scrollTop(0);
		}
		formular_angezeigt.resolve();
	}
	return formular_angezeigt.promise();
};

// leert alle Felder und stellt ihre Breite ein
window.apf.leereFelderVonFormular = function(Formular) {
	'use strict';
	$('#' + Formular + ' input[type="text"]').each(function(){
		$(this).val("");
	});
	$('#' + Formular + ' input[type="radio"]:checked').each(function(){
		$(this).prop('checked', false);
	});
	$('#' + Formular + ' select').each(function(){
		$(this).val("");
	});
};

// begrenzt die maximale Höhe des Baums auf die Seitenhöhe, wenn nötig
window.apf.setzeTreehöhe = function() {
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

window.apf.setzeKartenhöhe = function() {
	'use strict';
    var lyt_max_height = window.apf.berechneOlmapLayertreeMaxhöhe,
    	forms_height,
    	max_width;
	// Formulare sind unbegrenzt hoch aber Karten sollen das nicht sein
	if (window.apf.kartenhöhe_manuell) {
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

window.apf.olmap.blendeOlmapExportieren = function() {
    'use strict';
    var map_size,
        anz_kartenpixel,
        tooltip_title;
    map_size = window.apf.olmap.map.getSize();
    // resolution nicht berücksichtigen - das funktionierte nicht zuverlässig und gab Probleme
    anz_kartenpixel = /*window.apf.olmap.map.getView().getResolution() * */map_size[0] * map_size[1];
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

window.apf.berechneOlmapLayertreeMaxhöhe = function() {
    var lyt_max_height;
    if ($(window).width() > 1000) {
        lyt_max_height = $(window).height() - 115;
    } else {
        // Spalten sind untereinander
        lyt_max_height = 200;
    }
    return lyt_max_height;
};

(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollHeight > this.height();
	}
})(jQuery);

// setzt die Höhe von textareas so, dass der Text genau rein passt
window.apf.fitTextareaToContent = function(id, maxHeight) {
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

window.apf.erstelle_ap_liste = function(programm) {
	'use strict';
	var apliste_erstellt = $.Deferred(),
		getApliste = $.ajax({
			type: 'get',
			url: 'api/apliste/programm=' + programm,
			dataType: 'json'
		});
	getApliste.always(function(data) {
		var html;
		html = "<option></option>";
        _.each(data, function(ap) {
            html += "<option value=\"" + ap.id + "\">" + ap.ap_name + "</option>";
        });
		$("#ap_waehlen").html(html);
		apliste_erstellt.resolve();
	});
	return apliste_erstellt.promise();
};

window.apf.wähleApListe = function(programm) {
	'use strict';
	var apliste_gewählt = $.Deferred(),
        $ap_waehlen_label = $("#ap_waehlen_label"),
        $ap_waehlen = $("#ap_waehlen");
    $ap_waehlen_label.html("Daten werden aufbereitet...");
    $ap_waehlen.html("");
	$("#ap").hide();
	$("#forms").hide();
	$('#tree').hide();
	$("#suchen").hide();
	$("#exportieren_2").hide();
	$("#hilfe").hide();
	$("#ap_loeschen").hide();
	$("#exportieren_1").show();
    $ap_waehlen.val("");
	window.apf.initiiere_ap();
	$.when(window.apf.erstelle_ap_liste(programm))
		.then(function() {
            var $programm_wahl_checked = $("[name='programm_wahl']:checked");
			if ($programm_wahl_checked.attr("id") === "programm_neu") {
                $ap_waehlen_label.html("Art für neues Förderprogramm wählen:");
			} else if ($programm_wahl_checked.attr("id") === "programm_ap") {
                $ap_waehlen_label.html("Aktionsplan wählen:");
			} else {
                $ap_waehlen_label.html("Artförderprogramm wählen:");
			}
            $ap_waehlen_label.show();
			apliste_gewählt.resolve();
		});
	return apliste_gewählt.promise();
};

window.apf.erstelle_tree = function(ApArtId) {
	'use strict';
	var jstree_erstellt = $.Deferred();
	$("#tree").jstree({
		"json_data": {
			"ajax": {
				"url": "api/tree/ap=" + ApArtId,
				"progressive_render": true
			}
		},
		"core": {
			"open_parents": true,	// wird ein node programmatisch geöffnet, öffnen sich alle parents
			"strings": {	// Deutsche Übersetzungen
				"loading": "hole Daten...",
				"new_node": "neuer Knoten"
			}
		},
		"ui": {
			"select_limit": 1,	// nur ein Datensatz kann aufs mal gewählt werden
			"selected_parent_open": true,	// wenn Code einen node wählt, werden alle parents geöffnet
			"select_prev_on_delete": true
		},
		"search": {
			"case_insensitive": true
		},
		"sort": function(a, b) {
			if ($(a).attr("sort") && $(b).attr("sort")) {
				return parseInt($(a).attr("sort"), 10) > parseInt($(b).attr("sort"), 10) ? 1 : -1;
			}
		},
		"themes": {
			"icons": false
		},
		"contextmenu": {
			"items": window.apf.treeKontextmenu,
			"select_node": true
		},
		"crrm": {
			"move": {
				"default_position": "first",
				"check_move": function(m) {
					// hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind
					if (m.o.attr("typ") === "pop") {
						if (m.r.attr("typ") === "pop") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "tpop") {
						if (m.r.attr("typ") === "tpop") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "pop_ordner_tpop") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "tpopmassn") {
						if (m.r.attr("typ") === "tpopmassn") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_massn") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "tpopfeldkontr") {
						if (m.r.attr("typ") === "tpopfeldkontr") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_feldkontr") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "tpopfreiwkontr") {
						if (m.r.attr("typ") === "tpopfreiwkontr") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_freiwkontr") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "beob_zugeordnet") {
						if (m.r.attr("typ") === "beob_zugeordnet") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_beob_zugeordnet") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob_nicht_beurteilt") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob_nicht_beurteilt") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob_nicht_zuzuordnen") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob_nicht_zuzuordnen") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "beob_nicht_beurteilt") {
						if (m.r.attr("typ") === "beob_zugeordnet") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_beob_zugeordnet") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob_nicht_beurteilt") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob_nicht_beurteilt") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob_nicht_zuzuordnen") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob_nicht_zuzuordnen") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "beob_nicht_zuzuordnen") {
						if (m.r.attr("typ") === "beob_zugeordnet") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_beob_zugeordnet") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob_nicht_beurteilt") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob_nicht_beurteilt") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob_nicht_zuzuordnen") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob_nicht_zuzuordnen") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else {
							return false;
						}
					}
					return false;
				}
			}
		},
		"types": {
			"type_attr": "typ",
			"max_children": -2,
			"max_depth": -2,
			"valid_children": ["ap_ordner_pop", "ap_ordner_apziel", "ap_ordner_erfkrit", "ap_ordner_jber", "ap_ordner_ber", "ap_ordner_beob_nicht_beurteilt", "ap_ordner_beob_nicht_zuzuordnen", "idealbiotop", "ap_ordner_assozarten"],
			"types": {
				"ap_ordner_pop": {
					"valid_children": "pop"
				},
				"pop": {
					"valid_children": ["pop_ordner_tpop", "pop_ordner_popber", "pop_ordner_massnber"],
					"new_node": "neue Population"
				},
				"pop_ordner_tpop": {
					"valid_children": "tpop"
				},
				"tpop": {
					"valid_children": ["tpop_ordner_massn", "tpop_ordner_massnber", "tpop_ordner_feldkontr", "tpop_ordner_freiwkontr", "tpop_ordner_tpopber", "tpop_ordner_beob_zugeordnet"],
					"new_node": "neue Teilpopulation"
				},
				"tpop_ordner_massn": {
					"valid_children": "tpopmassn"
				},
				"tpopmassn": {
					"valid_children": "none",
					"new_node": "neue Massnahme"
				},
				"tpop_ordner_massnber": {
					"valid_children": "tpopmassnber"
				},
				"tpopmassnber": {
					"valid_children": "none",
					"new_node": "neuer Massnahmen-Bericht"
				},
				"tpop_ordner_feldkontr": {
					"valid_children": "tpopfeldkontr"
				},
				"tpopfeldkontr": {
					"valid_children": "none",
					"new_node": "neue Feldkontrolle"
				},
				"tpop_ordner_freiwkontr": {
					"valid_children": "tpopfreiwkontr"
				},
				"tpopfreiwkontr": {
					"valid_children": "none",
					"new_node": "neue Freiwilligen-Kontrolle"
				},
				"tpop_ordner_tpopber": {
					"valid_children": "tpopber"
				},
				"tpopber": {
					"valid_children": "none",
					"new_node": "neuer Teilpopulations-Bericht"
				},
				"tpop_ordner_beob_zugeordnet": {
					"valid_children": "beob_zugeordnet"
				},
				"beob_zugeordnet": {
					"valid_children": "none"
				},
				"pop_ordner_popber": {
					"valid_children": "popber"
				},
				"popber": {
					"valid_children": "none",
					"new_node": "neuer Populations-Bericht"
				},
				"pop_ordner_massnber": {
					"valid_children": "massnber"
				},
				"massnber": {
					"valid_children": "none",
					"new_node": "neuer Massnahmen-Bericht"
				},
				"ap_ordner_apziel": {
					"valid_children": "apzieljahr"
				},
				"apzieljahr": {
					"valid_children": "apziel"
				},
				"apziel": {
					"valid_children": "zielber_ordner",
					"new_node": "neues AP-Ziel"
				},
				"zielber_ordner": {
					"valid_children": "zielber"
				},
				"zielber": {
					"valid_children": "none",
					"new_node": "neuer Ziel-Bericht"
				},
				"ap_ordner_erfkrit": {
					"valid_children": "erfkrit"
				},
				"erfkrit": {
					"valid_children": "none",
					"new_node": "neues Erfolgskriterium"
				},
				"ap_ordner_jber": {
					"valid_children": "jber"
				},
				"jber": {
					"valid_children": "jber_uebersicht",
					"new_node": "neuer AP-Bericht"
				},
				"jber_uebersicht": {
					"valid_children": "none",
					"new_node": "neue Übersicht zu allen Arten"
				},
				"ap_ordner_ber": {
					"valid_children": "ber"
				},
				"ber": {
					"valid_children": "none",
					"new_node": "neuer Bericht"
				},
				"ap_ordner_beob_nicht_beurteilt": {
					"valid_children": "beob_nicht_beurteilt"
				},
				"beob_nicht_beurteilt": {
					"valid_children": "none"
				},
				"ap_ordner_beob_nicht_zuzuordnen": {
					"valid_children": "beob_nicht_zuzuordnen"
				},
				"beob_nicht_zuzuordnen": {
					"valid_children": "none"
				},
				"idealbiotop": {
					"valid_children": "none"
				},
				"ap_ordner_assozarten": {
					"valid_children": "assozarten"
				},
				"assozarten": {
					"valid_children": "none",
					"new_node": "neue assoziierte Art"
				}
			}
		},
		"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "types"]
		//"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "dnd", "types"]   // dnd ausgeschaltet, weil es Speichern verhindert im letzten Feld vor Klick in Baum
	})
	.show()
	.bind("loaded.jstree", function(event, data) {
		jstree_erstellt.resolve();
		window.apf.setzeTreehöhe();
		$("#suchen").show();
		$("#exportieren_2").show();
		$("#exportieren_1").hide();
		$("#hilfe").show();
		if (window.apf.pop_zeigen) {
			$("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
			delete window.apf.pop_zeigen;
		}
		if (window.apf.popber_zeigen) {
			$("#tree").jstree("select_node", "[typ='popber']#" + localStorage.popber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
			delete window.apf.popber_zeigen;
		}
		if (window.apf.popmassnber_zeigen) {
			$("#tree").jstree("select_node", "[typ='popmassnber']#" + localStorage.popmassnber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
			delete window.apf.popmassnber_zeigen;
		}
		if (window.apf.tpop_zeigen) {
			$("#tree").jstree("select_node", "[typ='tpop']#" + localStorage.tpop_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
			delete window.apf.tpop_zeigen;
		}
		if (window.apf.tpopfeldkontr_zeigen) {
			$("#tree").jstree("select_node", "[typ='tpopfeldkontr']#" + localStorage.tpopfeldkontr_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
			delete window.apf.tpopfeldkontr_zeigen;
		}
		if (window.apf.tpopfreiwkontr_zeigen) {
			$("#tree").jstree("select_node", "[typ='tpopfreiwkontr']#" + localStorage.tpopfeldkontr_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
			delete window.apf.tpopfreiwkontr_zeigen;
		}
		if (window.apf.tpopmassn_zeigen) {
			$("#tree").jstree("select_node", "[typ='tpopmassn']#" + localStorage.tpopmassn_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
			delete window.apf.tpopmassn_zeigen;
		}
		if (window.apf.tpopber_zeigen) {
			$("#tree").jstree("select_node", "[typ='tpopber']#" + localStorage.tpopber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
			delete window.apf.tpopber_zeigen;
		}
		if (window.apf.beob_zugeordnet_zeigen) {
			$("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese beob_zugeordnet geöffnet wird
			delete window.apf.beob_zugeordnet_zeigen;
		}
		if (window.apf.tpopmassnber_zeigen) {
			$("#tree").jstree("select_node", "[typ='tpopmassnber']#" + localStorage.tpopmassnber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
			delete window.apf.tpopmassnber_zeigen;
		}
		if (window.apf.apziel_zeigen) {
			$("#tree").jstree("select_node", "[typ='apziel']#" + localStorage.apziel_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
			delete window.apf.apziel_zeigen;
		}
		if (window.apf.zielber_zeigen) {
			$("#tree").jstree("select_node", "[typ='zielber']#" + localStorage.zielber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
			delete window.apf.zielber_zeigen;
		}
		if (window.apf.erfkrit_zeigen) {
			$("#tree").jstree("select_node", "[typ='erfkrit']#" + localStorage.erfkrit_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
			delete window.apf.erfkrit_zeigen;
		}
		if (window.apf.jber_zeigen) {
			$("#tree").jstree("select_node", "[typ='jber']#" + localStorage.jber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
			delete window.apf.jber_zeigen;
		}
		if (window.apf.jber_übersicht_zeigen) {
			$("#tree").jstree("select_node", "[typ='jber_uebersicht']#" + localStorage.jber_uebersicht_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese jber_uebersicht geöffnet wird
			delete window.apf.jber_übersicht_zeigen;
		}
		if (window.apf.ber_zeigen) {
			$("#tree").jstree("select_node", "[typ='ber']#" + localStorage.ber_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
			delete window.apf.ber_zeigen;
		}
		if (window.apf.idealbiotop_zeigen) {
			$("#tree").jstree("select_node", "[typ='idealbiotop']#" + localStorage.idealbiotop_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese idealbiotop geöffnet wird
			delete window.apf.idealbiotop_zeigen;
		}
		if (window.apf.assozarten_zeigen) {
			$("#tree").jstree("select_node", "[typ='assozarten']#" + localStorage.assozarten_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
			delete window.apf.assozarten_zeigen;
		}
		if (window.apf.beob_nicht_beurteilt_zeigen) {
			$("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
			delete window.apf.beob_nicht_beurteilt_zeigen;
		}
		if (window.apf.beob_nicht_zuzuordnen_zeigen) {
			$("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
			// diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
			delete window.apf.beob_nicht_zuzuordnen_zeigen;
		}
		if (window.apf.ap_zeigen) {
			window.apf.initiiere_ap();
			// diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
			delete window.apf.ap_zeigen;
		}
	})
	// auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
	.hammer().bind("hold doubletap", function(event) {
		// auf PC's verhindern: Menu erscheint sonst beim Scrollen
		if ($(window).width() < 1000) {
			setTimeout(function() {
				$("#tree").jstree('get_selected').children('a').trigger('contextmenu');
			}, 500);
		}
	})
	.bind("select_node.jstree", function(e, data) {
		var node;
        window.apf.initiiere_idealbiotop = require('./modules/initiiereIdealbiotop');
		delete localStorage.tpopfreiwkontr;	// Erinnerung an letzten Klick im Baum löschen
		node = data.rslt.obj;
		var node_typ = node.attr("typ");
		// in der ID des Nodes enthaltene Texte müssen entfernt werden
		var node_id = window.apf.erstelleIdAusDomAttributId(node.attr("id"));
		$.jstree._reference(node).open_node(node);
		if (node_typ.slice(0, 3) === "ap_" || node_typ === "apzieljahr") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ap").is(':visible') || localStorage.ap_id !== node_id) {
				localStorage.ap_id = node_id;
				delete localStorage.pop_id;
				window.apf.initiiere_ap();
			}
		} else if (node_typ === "pop" || node_typ.slice(0, 4) === "pop_") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#pop").is(':visible') || localStorage.pop_id !== node_id) {
				localStorage.pop_id = node_id;
				window.apf.initiiere_pop();
			}
		} else if (node_typ === "apziel" || node_typ === "zielber_ordner") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#apziel").is(':visible') || localStorage.apziel_id !== node_id) {
				localStorage.apziel_id = node_id;
				window.apf.initiiere_apziel();
			}
		} else if (node_typ === "zielber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#zielber").is(':visible') || localStorage.zielber_id !== node_id) {
				localStorage.zielber_id = node_id;
				window.apf.initiiere_zielber();
			}
		} else if (node_typ === "erfkrit") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#erfkrit").is(':visible') || localStorage.erfkrit_id !== node_id) {
				localStorage.erfkrit_id = node_id;
				window.apf.initiiere_erfkrit();
			}
		} else if (node_typ === "jber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#jber").is(':visible') || localStorage.jber_id !== node_id) {
				localStorage.jber_id = node_id;
				window.apf.initiiere_jber();
			}
		} else if (node_typ === "jber_uebersicht") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#jber_uebersicht").is(':visible') || localStorage.jber_uebersicht_id !== node_id) {
				localStorage.jber_uebersicht_id = node_id;
				window.apf.initiiere_jber_uebersicht();
			}
		} else if (node_typ === "ber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ber").is(':visible') || localStorage.ber_id !== node_id) {
				localStorage.ber_id = node_id;
				window.apf.initiiere_ber();
			}
		} else if (node_typ === "idealbiotop") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#idealbiotop").is(':visible')) {
				// eigene id nicht nötig
				// 1:1 mit ap verbunden, gleich id
				// wenn noch kein Datensatz existiert erstellt ihn window.apf.initiiere_idealbiotop
				window.apf.initiiere_idealbiotop();
			}
		} else if (node_typ === "assozarten") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#assozarten").is(':visible') || localStorage.assozarten_id !== node_id) {
				localStorage.assozarten_id = node_id;
				window.apf.initiiere_assozarten();
			}
		} else if (node_typ === "popber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#popber").is(':visible') || localStorage.popber_id !== node_id) {
				localStorage.popber_id = node_id;
				window.apf.initiiere_popber();
			}
		} else if (node_typ === "popmassnber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#popmassnber").is(':visible') || localStorage.popmassnber_id !== node_id) {
				localStorage.popmassnber_id = node_id;
				window.apf.initiiere_popmassnber();
			}
		} else if (node_typ === "tpop" || node_typ.slice(0, 5) === "tpop_") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpop").is(':visible') || localStorage.tpop_id !== node_id) {
				localStorage.tpop_id = node_id;
				window.apf.initiiere_tpop();
			}
		} else if (node_typ === "tpopfeldkontr") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node_id) {
				localStorage.tpopfeldkontr_id = node_id;
				window.apf.initiiere_tpopfeldkontr();
			}
		} else if (node_typ === "tpopfreiwkontr") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node_id) {
				localStorage.tpopfeldkontr_id = node_id;
				localStorage.tpopfreiwkontr = true;
				window.apf.initiiere_tpopfeldkontr();
			}
		} else if (node_typ === "tpopmassn") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassn").is(':visible') || localStorage.tpopmassn_id !== node_id) {
				localStorage.tpopmassn_id = node_id;
				window.apf.initiiere_tpopmassn();
			}
		} else if (node_typ === "tpopber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopber").is(':visible') || localStorage.tpopber_id !== node_id) {
				localStorage.tpopber_id = node_id;
				window.apf.initiiereTpopber();
			}
		} else if (node_typ === "beob_zugeordnet") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "zugeordnet") {
				localStorage.beob_id = node_id;
				localStorage.beobtyp = node.attr("beobtyp");
				window.apf.initiiere_beob(node.attr("beobtyp"), node_id, "zugeordnet");
			}
		} else if (node_typ === "beob_nicht_beurteilt") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "nicht_beurteilt") {
				localStorage.beob_id = node_id;
				localStorage.beobtyp = node.attr("beobtyp");
				// den Beobtyp mitgeben
				window.apf.initiiere_beob(node.attr("beobtyp"), node_id, "nicht_beurteilt");
			}
		} else if (node_typ === "beob_nicht_zuzuordnen") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "nicht_zuzuordnen") {
				localStorage.beob_id = node_id;
				localStorage.beobtyp = node.attr("beobtyp");
				// den Beobtyp mitgeben
				window.apf.initiiere_beob(node.attr("beobtyp"), node_id, "nicht_zuzuordnen");
			}
		} else if (node_typ === "tpopmassnber") {
			// verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnber_id !== node_id) {
				localStorage.tpopmassnber_id = node_id;
				window.apf.initiiere_tpopmassnber();
			}
		}
	})
	.bind("after_open.jstree", function(e, data) {
		window.apf.setzeTreehöhe();
	})
	.bind("after_close.jstree", function(e, data) {
		window.apf.setzeTreehöhe();
	})
	.bind("prepare_move.jstree", function(e, data) {
		// herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
		window.apf.herkunft_parent_node = $.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
	})
	.bind("create_node.jstree", function(e, data) {
		if (data.rslt.parent[0].attributes.typ.nodeValue === "apzieljahr") {
			var Objekt = {};
			Objekt.name = "ZielJahr";
			Objekt.formular = "apziel";
			window.apf.speichern(Objekt);
            $("#ZielJahr")
                .val(data.rslt.parent[0].innerText.slice(1, 5))
                .focus();
		}
	})
	.bind("move_node.jstree", function(e, data) {
		var herkunft_node,
			herkunft_node_id,
			herkunft_node_typ,
			ziel_node,
			ziel_node_id,
			ziel_node_typ,
			ziel_parent_node,
			ziel_parent_node_id;
		
		// nur aktualisieren, wenn Schreibrechte bestehen
		if (!window.apf.prüfeSchreibvoraussetzungen()) {
			return;
		}

		// Variablen setzen
		herkunft_node = data.rslt.o;
		herkunft_node_id = window.apf.erstelleIdAusDomAttributId($(herkunft_node).attr("id"));
		herkunft_node_typ = herkunft_node.attr("typ");
		ziel_node = data.rslt.r;
		ziel_node_id = window.apf.erstelleIdAusDomAttributId($(ziel_node).attr("id"));
		ziel_node_typ = ziel_node.attr("typ");
		ziel_parent_node = $.jstree._reference(data.rslt.r)._get_parent(data.rslt.r);
		if ($(ziel_parent_node).attr("id")) {
			ziel_parent_node_id = window.apf.erstelleIdAusDomAttributId($(ziel_parent_node).attr("id"));
		}

		if (herkunft_node_typ === "pop") {
			if (ziel_node_typ === "pop") {
				var fügePopEin = $.ajax({
					type: 'post',
					url: 'php/pop_einfuegen.php',
					dataType: 'json',
					data: {
						"ap_art_id": ziel_parent_node_id,
						"pop_id": ziel_node_id,
						"user": sessionStorage.User
					}
				});
				fügePopEin.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_pop(ziel_parent_node);
					window.apf.beschrifte_ordner_pop(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(ziel_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.pop_id = herkunft_node_id;
					delete window.apf.pop;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_pop();
				});
				fügePopEin.fail(function(data) {
					//window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
					console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
				});
			}
			if (ziel_node_typ === "tpop") {
				var fügeTPopEin = $.ajax({
					type: 'post',
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_parent_node_id,
						"tpop_id": ziel_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopEin.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpop(ziel_parent_node);
					window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(ziel_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpop_id = herkunft_node_id;
					delete window.apf.tpop;
					delete window.apf.tpop_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpop();
				});
				fügeTPopEin.fail(function(data) {
					//window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
					console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
				});
			}
			if (ziel_node_typ === "pop_ordner_tpop") {
				var fügeTPopEin_2 = $.ajax({
					type: 'post',
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_node_id,
						"tpop_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopEin_2.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpop(ziel_node);
					window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
					// select steuern
					$.jstree._reference(ziel_node).deselect_all();
					$.jstree._reference(ziel_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpop_id = herkunft_node_id;
					delete window.apf.tpop;
					delete window.apf.tpop_node_ausgeschnitten;
					window.apf.initiiere_tpop();
				});
				fügeTPopEin_2.fail(function(data) {
					//window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
					console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
				});
			}
		}
		if (herkunft_node_typ === "tpop") {
			if (ziel_node_typ === "tpop") {
				var fügeTPopEin_3 = $.ajax({
					type: 'post',
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_parent_node_id,
						"tpop_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopEin_3.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpop(ziel_parent_node);
					window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(ziel_parent_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpop_id = herkunft_node_id;
					delete window.apf.tpop;
					delete window.apf.tpop_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpop();
				});
				fügeTPopEin_3.fail(function(data) {
					//window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
					console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
				});
			}
			if (ziel_node_typ === "pop_ordner_tpop") {
				var fügeTPopEin_4 = $.ajax({
					type: 'post',
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_node_id,
						"tpop_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopEin_4.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpop(ziel_node);
					window.apf.beschrifte_ordner_tpop(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpop_id = herkunft_node_id;
					delete window.apf.tpop;
					delete window.apf.tpop_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpop();
				});
				fügeTPopEin_4.fail(function(data) {
					//window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
					console.log("Fehler: Die Teilpopulation wurde nicht verschoben");
				});
			}
		}
		if (herkunft_node_typ === "tpopmassn") {
			if (ziel_node_typ === "tpopmassn") {
				var fügeTPopMassnEin = $.ajax({
					type: 'post',
					url: 'php/tpopmassn_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_parent_node_id,
						"tpopmassn_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopMassnEin.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpopmassn(ziel_parent_node);
					window.apf.beschrifte_ordner_tpopmassn(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(ziel_parent_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpopmassn_id = herkunft_node_id;
					delete window.apf.tpopmassn;
					delete window.apf.tpopmassn_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpopmassn();
				});
				fügeTPopMassnEin.fail(function(data) {
					//window.apf.melde("Fehler: Die Massnahme wurde nicht verschoben");
					console.log("Fehler: Die Massnahme wurde nicht verschoben");
				});
			}
			if (ziel_node_typ === "tpop_ordner_massn") {
				var fügeTPopMassnEin_2 = $.ajax({
					type: 'post',
					url: 'php/tpopmassn_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_node_id,
						"tpopmassn_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopMassnEin_2.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpopmassn(ziel_node);
					window.apf.beschrifte_ordner_tpopmassn(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpopmassn_id = herkunft_node_id;
					delete window.apf.tpopmassn;
					delete window.apf.tpopmassn_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpopmassn();
				});
				fügeTPopMassnEin_2.fail(function(data) {
					//window.apf.melde("Fehler: Die Massnahme wurde nicht verschoben");
					console.log("Fehler: Die Massnahme wurde nicht verschoben");
				});
			}
		}
		if (herkunft_node_typ === "tpopfeldkontr") {
			if (ziel_node_typ === "tpopfeldkontr") {
				var fügeTPopFeldkontrEin = $.ajax({
					type: 'post',
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_parent_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopFeldkontrEin.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpopfeldkontr(ziel_parent_node);
					window.apf.beschrifte_ordner_tpopfeldkontr(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpopfeldkontr_id = herkunft_node_id;
					delete window.apf.tpopfeldkontr;
					delete window.apf.tpopfeldkontr_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpopfeldkontr();
				});
				fügeTPopFeldkontrEin.fail(function(data) {
					//window.apf.melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
					console.log('Fehler: Die Feldkontrolle wurde nicht verschoben');
				});
			}
			if (ziel_node_typ === "tpop_ordner_feldkontr") {
				var fügeTPopFeldkontrEin_2 = $.ajax({
					type: 'post',
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopFeldkontrEin_2.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpopfeldkontr(ziel_node);
					window.apf.beschrifte_ordner_tpopfeldkontr(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpopfeldkontr_id = herkunft_node_id;
					delete window.apf.tpopfeldkontr;
					delete window.apf.tpopfeldkontr_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					window.apf.initiiere_tpopfeldkontr();
				});
				fügeTPopFeldkontrEin_2.fail(function() {
					//window.apf.melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
					console.log('Fehler: Die Feldkontrolle wurde nicht verschoben');
				});
			}
		}
		if (herkunft_node_typ === "tpopfreiwkontr") {
			if (ziel_node_typ === "tpopfreiwkontr") {
				var fügeTPopFeldkontrEin_3 = $.ajax({
					type: 'post',
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_parent_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopFeldkontrEin_3.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpopfreiwkontr(ziel_parent_node);
					window.apf.beschrifte_ordner_tpopfreiwkontr(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpopfeldkontr_id = herkunft_node_id;
					delete window.apf.tpopfeldkontr;
					delete window.apf.tpopfreiwkontr_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					localStorage.tpopfreiwkontr = true;
					window.apf.initiiere_tpopfeldkontr();
				});
				fügeTPopFeldkontrEin_3.fail(function() {
					//window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
					console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben');
				});
			}
			if (ziel_node_typ === "tpop_ordner_freiwkontr") {
				var fügeTPopFeldkontrEin_4 = $.ajax({
					type: 'post',
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				fügeTPopFeldkontrEin_4.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					window.apf.beschrifte_ordner_tpopfreiwkontr(ziel_node);
					window.apf.beschrifte_ordner_tpopfreiwkontr(window.apf.herkunft_parent_node);
					// selection steuern
					$.jstree._reference(herkunft_node).deselect_all();
					$.jstree._reference(herkunft_node).select_node(herkunft_node);
					// Variablen aufräumen
					localStorage.tpopfeldkontr_id = herkunft_node_id;
					delete window.apf.tpopfeldkontr;
					delete window.apf.tpopfreiwkontr_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
					localStorage.tpopfreiwkontr = true;
					window.apf.initiiere_tpopfeldkontr();
				});
				fügeTPopFeldkontrEin_4.fail(function() {
					//window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
					console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben');
				});
			}
		}
		if (herkunft_node_typ === "beob_zugeordnet") {
			// zugeordnet
			if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
				// zugeordnet > nicht beurteilt
				var ordneBeobachtungZu = $.ajax({
					type: 'post',
					url: 'php/beob_zuordnung_delete.php',
					dataType: 'json',
					data: {
						"id": herkunft_node_id
					}
				});
				ordneBeobachtungZu.always(function() {
					// typ des nodes anpassen
					herkunft_node.attr("typ", "beob_nicht_beurteilt");
					localStorage.beobtyp = "beob_nicht_beurteilt";
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					if (ziel_node_typ === "beob_nicht_beurteilt") {
						window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_parent_node);
					} else {
						window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_node);
					}
					window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);
					// beob initiieren
					window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_beurteilt");
					// Variablen aufräumen
					delete window.apf.beob_zugeordnet_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
				});
				ordneBeobachtungZu.fail(function() {
					//window.apf.melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
					console.log("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
				});
			}
			if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
				// zugeordnet > zugeordnet
				if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
					neue_tpop_id = ziel_node_id;
				} else {
					neue_tpop_id = ziel_parent_node_id;
				}
				var ordneBeobachtungZu_2 = $.ajax({
					type: 'post',
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": localStorage.beob_id,
						"Feld": "TPopId",
						"Wert": neue_tpop_id,
						"user": sessionStorage.User
					}
				});
				ordneBeobachtungZu_2.always(function() {
					// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
					if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
						window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
					} else {
						window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
					}
					window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);
					// selection steuern
					if (!localStorage.karte_fokussieren) {
						window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
					} else {
						delete localStorage.karte_fokussieren;
					}
					// Variablen aufräumen
					delete window.apf.beob_zugeordnet_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
				});
				ordneBeobachtungZu_2.fail(function() {
					//window.apf.melde("Fehler: Die Beobachtung wurde nicht verschoben");
					console.log('Fehler: Die Beobachtung wurde nicht verschoben');
				});
			}
			if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
				// zugeordnet > nicht zuzuordnen
				var ordneBeobachtungZu_3 = $.ajax({
					type: 'post',
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": herkunft_node_id,
						"Feld": "BeobNichtZuordnen",
						"Wert": 1,
						"user": sessionStorage.User
					} 
				});
				ordneBeobachtungZu_3.always(function() {
					// TPopId null setzen
					var setzeTpopid = $.ajax({
						type: 'post',
						url: 'php/beob_update.php',
						dataType: 'json',
						data: {
							"id": herkunft_node_id,
							"Feld": "TPopId",
							"Wert": "",
							"user": sessionStorage.User
						}
					});
					setzeTpopid.always(function() {
						// aus unerfindlichen Gründen läuft der success callback nicht, darum done
						// typ des nodes anpassen
						herkunft_node.attr("typ", "beob_nicht_zuzuordnen");
						localStorage.beobtyp = "beob_nicht_zuzuordnen";
						// Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
							window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_node);
						} else {
							window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_parent_node);
						}
						window.apf.beschrifte_ordner_beob_zugeordnet(window.apf.herkunft_parent_node);
						// Beob initiieren
						window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_zuzuordnen");
						// Variablen aufräumen
						delete window.apf.beob_node_ausgeschnitten;
						delete window.apf.herkunft_parent_node;
					});
					setzeTpopid.fail(function() {
						console.log("fehler beim Leeren von TPopId");
					});
				});
				ordneBeobachtungZu_3.fail(function() {
					//window.apf.melde("Fehler: Die Beobachtung wurde nicht verschoben");
					console.log('Fehler: Die Beobachtung wurde nicht verschoben');
				});
			}
		}
		if (herkunft_node_typ === "beob_nicht_beurteilt") {
			// nicht beurteilt
			if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
				// nicht beurteilt > zugeordnet
				if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
					neue_tpop_id = ziel_node_id;
				} else {
					neue_tpop_id = ziel_parent_node_id;
				}
				// Zuerst eine neue Zuordnung erstellen
				var insertZuordnung = $.ajax({
					type: 'post',
					url: 'php/beob_zuordnung_insert.php',
					dataType: 'json',
					data: {
						"no_note": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				insertZuordnung.always(function() {
					// jetzt aktualisieren
					var updateBeob = $.ajax({
						type: 'post',
						url: 'php/beob_update.php',
						dataType: 'json',
						data: {
							"id": herkunft_node_id,
							"Feld": "TPopId",
							"Wert": neue_tpop_id,
							"user": sessionStorage.User
						}
					});
					updateBeob.always(function() {
						// typ des nodes anpassen
						herkunft_node.attr("typ", "beob_zugeordnet");
						localStorage.beobtyp = "beob_zugeordnet";
						// Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
						window.apf.beschrifte_ordner_beob_nicht_beurteilt(window.apf.herkunft_parent_node);
						if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
							window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
						} else {
							window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
						}
						// selection steuern
						if (!localStorage.karte_fokussieren) {
							window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
						} else {
							delete localStorage.karte_fokussieren;
						}
						// Variablen aufräumen
						delete window.apf.beob_node_ausgeschnitten;
						delete window.apf.herkunft_parent_node;
					});
					updateBeob.fail(function() {
						//window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
						console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
					});
				});
				insertZuordnung.fail(function() {
					//window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
					console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
				});
			}
			if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
				// nicht beurteilt > nicht zuordnen
				var insertZuordnung_2 = $.ajax({
					type: 'post',
					url: 'php/beob_zuordnung_insert.php',
					dataType: 'json',
					data: {
						"no_note": herkunft_node_id,
						"user": sessionStorage.User
					}
				});
				insertZuordnung_2.always(function() {
					// jetzt aktualisieren
					var updateBeob_2 = $.ajax({
						type: 'post',
						url: 'php/beob_update.php',
						dataType: 'json',
						data: {
							"id": herkunft_node_id,
							"Feld": "BeobNichtZuordnen",
							"Wert": 1,
							"user": sessionStorage.User
						}
					});
					updateBeob_2.always(function() {
						// typ des nodes anpassen
						$(herkunft_node).attr("typ", "beob_nicht_zuzuordnen");
						localStorage.beobtyp = "beob_nicht_zuzuordnen";
						// Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
						window.apf.beschrifte_ordner_beob_nicht_beurteilt(window.apf.herkunft_parent_node);
						if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
							window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_node);
						} else {
							window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(ziel_parent_node);
						}
						// Beob initiieren
						window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_zuzuordnen");
						// Variablen aufräumen
						delete window.apf.beob_node_ausgeschnitten;
						delete window.apf.herkunft_parent_node;
					});
					updateBeob_2.fail(function() {
						console.log("Fehler: Die Beobachtung wurde nicht zugeordnet");
					});
				});
				insertZuordnung_2.fail(function() {
					//window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
					console.log("Fehler: Die Beobachtung wurde nicht zugeordnet");
				});
			}
		}
		if (herkunft_node_typ === "beob_nicht_zuzuordnen") {
			// nicht zuzuordnen
			if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
				// nicht zuzuordnen > nicht beurteilt
				var deleteZuordnung = $.ajax({
					type: 'post',
					url: 'php/beob_zuordnung_delete.php',
					dataType: 'json',
					data: {
						"id": herkunft_node_id
					}
				});
				deleteZuordnung.always(function() {
					// typ des nodes anpassen
					$(herkunft_node).attr("typ", "beob_nicht_beurteilt");
					localStorage.beobtyp = "beob_nicht_beurteilt";
					// Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
					window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(window.apf.herkunft_parent_node);
					if (ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
						window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_node);
					} else {
						window.apf.beschrifte_ordner_beob_nicht_beurteilt(ziel_parent_node);
					}
					// selektieren
					window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_beurteilt");
					// Variablen aufräumen
					delete window.apf.beob_node_ausgeschnitten;
					delete window.apf.herkunft_parent_node;
				});
				deleteZuordnung.fail(function() {
					//window.apf.melde("Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt");
					console.log('Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt');
				});
			}
			if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
				// nicht zuzuordnen > zugeordnet
				var neue_tpop_id;
				if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
					neue_tpop_id = ziel_node_id;
				} else {
					neue_tpop_id = ziel_parent_node_id;
				}
				var updateBeob_3 = $.ajax({
					type: 'post',
					url: 'php/beob_update.php',
						dataType: 'json',
						data: {
							"id": herkunft_node_id,
							"Feld": "BeobNichtZuordnen",
							"Wert": "",
							"user": sessionStorage.User
					}
				});
				updateBeob_3.always(function() {
					var updateBeob_4 = $.ajax({
						type: 'post',
						url: 'php/beob_update.php',
						dataType: 'json',
						data: {
							"id": herkunft_node_id,
							"Feld": "TPopId",
							"Wert": neue_tpop_id,
							"user": sessionStorage.User
						}
					});
					updateBeob_4.always(function() {
						// typ des nodes anpassen
						$(herkunft_node).attr("typ", "beob_zugeordnet");
						localStorage.beobtyp = "beob_zugeordnet";
						// Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
						window.apf.beschrifte_ordner_beob_nicht_zuzuordnen(window.apf.herkunft_parent_node);
						if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
							window.apf.beschrifte_ordner_beob_zugeordnet(ziel_node);
						} else {
							window.apf.beschrifte_ordner_beob_zugeordnet(ziel_parent_node);
						}
						// selection steuern
						window.apf.initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
						// Variablen aufräumen
						delete window.apf.beob_node_ausgeschnitten;
						delete window.apf.herkunft_parent_node;
					});
					updateBeob_4.fail(function() {
						//window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
						console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
					});
				});
				updateBeob_3.fail(function() {
					//window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
					console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
				});
			}
		}
	});
	return jstree_erstellt.promise();
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_pop = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Populationen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_apziel = function(node) {
	'use strict';
	var anz = 0,
		anzTxt;
	$($.jstree._reference(node)._get_children(node)).each(function(index) {
		$($(this).find("> ul > li")).each(function(index) {
			anz += 1;
		});
	});
	anzTxt = "AP-Ziele (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_apzieljahr = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt;
	anzTxt = $.jstree._reference(node).get_text(node).slice(0, 6);
	anzTxt += anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_zielber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Ziel-Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_erfkrit = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "AP-Erfolgskriterien (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_jber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "AP-Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_ber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_assozarten = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "assoziierte Arten (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpop = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Teilpopulationen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_popber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Populations-Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_popmassnber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Massnahmen-Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopmassnber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Massnahmen-Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopmassn = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Massnahmen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopber = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Teilpopulations-Berichte (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopfeldkontr = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Feldkontrollen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_tpopfreiwkontr = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Freiwilligen-Kontrollen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_beob_zugeordnet = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "Beobachtungen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_beob_nicht_beurteilt = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "nicht beurteilte Beobachtungen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

// übernimmt einen node
// zählt dessen children und passt die Beschriftung an
window.apf.beschrifte_ordner_beob_nicht_zuzuordnen = function(node) {
	'use strict';
	var anz = $(node).find("> ul > li").length,
		anzTxt = "nicht zuzuordnende Beobachtungen (" + anz + ")";
	$.jstree._reference(node).rename_node(node, anzTxt);
};

window.apf.treeKontextmenu = function(node) {
	'use strict';
	var items,
		aktiver_node,
		aktiver_nodeText,
		parent_node,
		parent_nodeText,
		grandparent_node,
		neue_apziele_node;
	// relevante nodes zwischenspeichern
	// aktiver_node = node;	 das hat auch funktioniert
	aktiver_node = $("#tree").jstree('get_selected');
	aktiver_nodeText = $.jstree._reference(aktiver_node).get_text(aktiver_node);
	// parent nur ermitteln, wenn parents exisiteren - sonst gibt es einen Fehler
	if ($(aktiver_node).attr("typ").slice(0, 9) !== "ap_ordner" && $(aktiver_node).attr("typ") !== "idealbiotop") {
		parent_node = $.jstree._reference(aktiver_node)._get_parent(aktiver_node);
		parent_nodeText = $.jstree._reference(parent_node).get_text(parent_node);
	}
	switch($(aktiver_node).attr("typ")) {
        case "ap_ordner_pop":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function() {
					$.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neue Population",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertPop = $.ajax({
						type: 'post',
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "pop",
							"user": sessionStorage.User
						}
					});
					insertPop.always(function(id) {
						var strukturtyp = "pop",
							beschriftung = "neue Population";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPop.fail(function() {
						//window.apf.melde("Fehler: Keine neue Population erstellt");
						console.log('Fehler: Keine neue Population erstellt');
					});
				}
			},
			"GeoAdminMaps": {
				"label": "auf CH-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_gelb.png",
				"action": function() {
					var getPopsChKarte = $.ajax({
						type: 'get',
						url: 'php/pops_ch_karte.php',
						dataType: 'json',
						data: {
							"ApArtId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getPopsChKarte.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigePopAufOlmap();
							//window.apf.zeigePopAufOlmap(data);
						} else {
							window.apf.melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
						}
					});
					getPopsChKarte.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function() {
					var getApKarte = $.ajax({
						type: 'get',
						url: 'php/ap_karte.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getApKarte.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getApKarte.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			}
		};
		if (window.apf.pop_zum_verschieben_gemerkt) {
			items.einfuegen = {
				"label": "'" + window.apf.pop_bezeichnung + "' einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					// db aktualisieren
					var updatePop = $.ajax({
						type: 'post',
						url: 'php/pop_update.php',
						dataType: 'json',
						data: {
							"id": window.apf.pop_id,
							"Feld": "ApArtId",
							"Wert": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					updatePop.always(function() {
						// Baum neu aufbauen
						$.when(window.apf.erstelle_tree(window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))))
							.then(function() {
								// dann den eingefügten Node wählen
								$("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id); 
							});
						// einfügen soll nicht mehr angezeigt werden
						delete window.apf.pop_zum_verschieben_gemerkt;
						// nicht mehr benötigte Variablen entfernen
						delete window.apf.pop_bezeichnung;
						delete window.apf.pop_id;
					});
					updatePop.fail(function() {
						//window.apf.melde("Fehler: Die Population wurde nicht verschoben");
						console.log('Fehler: Die Population wurde nicht verschoben');
					});
				}
			}
		}
		return items;
	case "ap_ordner_apziel":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function() {
					$.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertApziel = $.ajax({
						type: 'post',
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "apziel",
							"user": sessionStorage.User
						}
					});
					insertApziel.always(function(id) {
						var strukturtyp = "apziel",
							beschriftung = "neues Ziel";
						// mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
						localStorage.apziel_von_ordner_apziel = true;
						// zur Sicherheit den anderen Zeiger löschen
						delete localStorage.apziel_von_apzieljahr;
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertApziel.fail(function() {
						//window.apf.melde("Fehler: Keine neues AP-Ziel erstellt");
						console.log('Fehler: Keine neues AP-Ziel erstellt');
					});
				}
			}
		};
		return items;
	case "apzieljahr":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function() {
					$.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertApziel_2 = $.ajax({
						type: 'post',
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "apziel",
							"user": sessionStorage.User
						}
					});
					insertApziel_2.always(function(id) {
						var strukturtyp = "apziel",
							beschriftung = "neues Ziel";
						localStorage.apziel_von_apzieljahr = true;
						// zur Sicherheit den anderen Zeiger löschen
						delete localStorage.apziel_von_ordner_apziel;
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertApziel_2.fail(function() {
						//window.apf.melde("Fehler: Keine neues Ziel erstellt");
						console.log('Fehler: Keine neues Ziel erstellt');
					});
				}
			}
		};
		return items;
	case "apziel":
		items = {
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					grandparent_node = $.jstree._reference(parent_node)._get_parent(parent_node);
					var insertApziel_3 = $.ajax( {
						type: 'post',
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(grandparent_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertApziel_3.always(function(id) {
						var strukturtyp = "apziel",
							beschriftung = "neues Ziel";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertApziel_3.fail(function() {
						//window.apf.melde("Fehler: Kein neues AP-Ziel erstellt");
						console.log('Fehler: Kein neues AP-Ziel erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Das AP-Ziel '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.apziel;
								window.apf.deleted.typ = "apziel";
								var deleteApziel = $.ajax({
									type: 'post',
									url: 'php/apziel_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteApziel.always(function() {
									delete localStorage.apziel_id;
									delete window.apf.apziel;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// grandparent Node-Beschriftung: Anzahl anpassen
									grandparent_node = $.jstree._reference(parent_node)._get_parent(parent_node);
									window.apf.beschrifte_ordner_apziel(grandparent_node);
									// parent Node-Beschriftung: Anzahl anpassen
									if ($.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
										window.apf.beschrifte_ordner_apzieljahr(parent_node);
									}
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das AP-Ziel '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteApziel.fail(function() {
									//window.apf.melde("Fehler: Das AP-Ziel wurde nicht gelöscht");
									console.log('Fehler: Das AP-Ziel wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		return items;
	case "zielber_ordner":
		items = {
			"neu": {
				"label": "neuer Ziel-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertZielber = $.ajax({
						type: 'post',
						url: 'php/zielber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertZielber.always(function(id) {
						var strukturtyp = "zielber",
							beschriftung = "neuer Ziel-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertZielber.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
						console.log('Fehler: Keinen neuen Ziel-Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "zielber":
		items = {
			"neu": {
				"label": "neuer Ziel-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertZielber_2 = $.ajax({
						type: 'post',
						url: 'php/zielber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "zielber",
							"user": sessionStorage.User
						}
					});
					insertZielber_2.always(function(id) {
						var strukturtyp = "zielber",
							beschriftung = "neuer Ziel-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertZielber_2.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
						console.log('Fehler: Keinen neuen Ziel-Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Ziel-Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.zielber;
								window.apf.deleted.typ = "zielber";
								var deleteZielber = $.ajax({
									type: 'post',
									url: 'php/zielber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteZielber.always(function() {
									delete localStorage.zielber_id;
									delete window.apf.zielber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_zielber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Ziel-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteZielber.fail(function() {
									//window.apf.melde("Fehler: Der Ziel-Bericht wurde nicht gelöscht");
									console.log('Fehler: Der Ziel-Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			}
		};
		return items;
	case "ap_ordner_erfkrit":
		items = {
			"neu": {
				"label": "neues Erfolgskriterium",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertErfkrit = $.ajax({
						type: 'post',
						url: 'php/erfkrit_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertErfkrit.always(function(id) {
						var strukturtyp = "erfkrit",
							beschriftung = "neues Erfolgskriterium";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertErfkrit.fail(function() {
						//window.apf.melde("Fehler: Kein neues Erfolgskriterium erstellt");
						console.log('Fehler: Kein neues Erfolgskriterium erstellt');
					});
				}
			}
		};
		return items;
	case "erfkrit":
		items = {
			"neu": {
				"label": "neues Erfolgskriterium",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertErfkrit_2 = $.ajax({
						type: 'post',
						url: 'php/erfkrit_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "erfkrit",
							"user": sessionStorage.User
						}
					});
					insertErfkrit_2.always(function(id) {
						var strukturtyp = "erfkrit",
							beschriftung = "neues Erfolgskriterium";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertErfkrit_2.fail(function() {
						//window.apf.melde("Fehler: Kein neues Erfolgskriterium erstellt");
						console.log('Fehler: Kein neues Erfolgskriterium erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Das Erfolgskriterium '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.erfkrit;
								window.apf.deleted.typ = "erfkrit";
								var deleteErfkrit = $.ajax({
									type: 'post',
									url: 'php/erfkrit_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteErfkrit.always(function() {
									delete localStorage.erfkrit_id;
									delete window.apf.erfkrit;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_erfkrit(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das Erfolgskriterium '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteErfkrit.fail(function() {
									//window.apf.melde("Fehler: Das Erfolgskriterium wurde nicht gelöscht");
									console.log('Fehler: Das Erfolgskriterium wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			}
		};
		return items;
	case "ap_ordner_jber":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function() {
					$.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neuer AP-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertJber = $.ajax({
						type: 'post',
						url: 'php/jber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertJber.always(function(id) {
						var strukturtyp = "jber",
							beschriftung = "neuer AP-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertJber.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen AP-Bericht erstellt");
						console.log('Fehler: Keinen neuen AP-Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "jber":
		items = {
			"neu": {
				"label": "neuer AP-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertJber_2 = $.ajax({
						type: 'post',
						url: 'php/jber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "jber",
							"user": sessionStorage.User
						}
					});
					insertJber_2.always(function(id) {
						var strukturtyp = "jber",
							beschriftung = "neuer AP-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertJber_2.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen AP-Bericht erstellt");
						console.log('Fehler: Keinen neuen AP-Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der AP-Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.jber;
								window.apf.deleted.typ = "jber";
								var deleteJber = $.ajax({
									type: 'post',
									url: 'php/jber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteJber.always(function() {
									delete localStorage.jber_id;
									delete window.apf.jber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_jber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der AP-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteJber.fail(function() {
									//window.apf.melde("Fehler: Der AP-Bericht wurde nicht gelöscht");
									console.log('Fehler: Der AP-Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		// Wenn noch keine existiert, kann einen neue Übersicht zu allen Arten erstellt werden
		if ($.jstree._reference(aktiver_node)._get_children(aktiver_node).length === 0) {
			items.neu_jber_uebersicht = {
				"label": "neue Übersicht zu allen Arten",
				"separator_before": true,
				"icon": "style/images/neu.png",
				"action": function() {
					var insertJberUebersicht = $.ajax({
						type: 'post',
						url: 'php/jber_uebersicht_insert.php',
						dataType: 'json',
						data: {
							"JbuJahr": $.jstree._reference(aktiver_node).get_text(aktiver_node),
							"user": sessionStorage.User
						}
					});
					insertJberUebersicht.always(function(data) {
						var strukturtyp = "jber_uebersicht",
							ds_id = $.jstree._reference(aktiver_node).get_text(aktiver_node),
							beschriftung = "neue Übersicht zu allen Arten";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, ds_id, beschriftung);
					});
					insertJberUebersicht.fail(function() {
						//window.apf.melde("Fehler: Keine Übersicht zu allen Arten erstellt");
						console.log('Fehler: Keine Übersicht zu allen Arten erstellt');
					});
				}
			}
		}
		return items;
	case "jber_uebersicht":
		items = {
			"loeschen": {
				"label": "lösche Übersicht zu allen Arten",
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Übersicht zu allen Arten wird gelöscht");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.jber_übersicht;
								window.apf.deleted.typ = "jber_uebersicht";
								var deleteJberUebersicht = $.ajax({
									type: 'post',
									url: 'php/jber_uebersicht_delete.php',
									dataType: 'json',
									data: {
										"jahr": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteJberUebersicht.always(function() {
									delete localStorage.jber_uebersicht_id;
									delete window.apf.jber_übersicht;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Übersicht für den AP-Bericht des Jahrs \"" + window.apf.deleted.JbuJahr + "\" wurde gelöscht.");
								});
								deleteJberUebersicht.fail(function() {
									//window.apf.melde("Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht");
									console.log('Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			}
		};
		return items;
	case "ap_ordner_ber":
		items = {
			"neu": {
				"label": "neuer Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertBer = $.ajax({
						type: 'post',
						url: 'php/ber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertBer.always(function(id) {
						var strukturtyp = "ber",
							beschriftung = "neuer Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertBer.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Bericht erstellt");
						console.log('Fehler: Keinen neuen Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "ber":
		items = {
			"neu": {
				"label": "Neuer Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertBer_2 = $.ajax({
						type: 'post',
						url: 'php/ber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "ber",
							"user": sessionStorage.User
						}
					});
					insertBer_2.always(function(id) {
						var strukturtyp = "ber",
							beschriftung = "neuer Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertBer_2.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Bericht erstellt");
						console.log('Fehler: Keinen neuen Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.ber;
								window.apf.deleted.typ = "ber";
								var deleteBer = $.ajax({
									type: 'post',
									url: 'php/ber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteBer.always(function() {
									delete localStorage.ber_id;
									delete window.apf.ber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_ber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteBer.fail(function() {
									//window.apf.melde("Fehler: Der Bericht wurde nicht gelöscht");
									console.log('Fehler: Der Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			}
		};
		return items;
	case "ap_ordner_assozarten":
		items = {
			"neu": {
				"label": "neue assoziierte Art",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertAssozarten = $.ajax({
						type: 'post',
						url: 'api/insert/tabelle=tblAssozArten/feld=AaApArtId/wert=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + '/user=' + sessionStorage.User,
						dataType: 'json'
					});
					insertAssozarten.done(function(id) {
						var strukturtyp = "assozarten",
							beschriftung = "neue assoziierte Art";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertAssozarten.fail(function() {
						//window.apf.melde("Fehler: keine assoziierte Art erstellt");
						console.log('Fehler: keine assoziierte Art erstellt');
					});
				}
			}
		};
		return items;
	case "assozarten":
		items = {
			"neu": {
				"label": "neue assoziierte Art",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertAssozarten_2 = $.ajax({
						type: 'post',
						url: 'api/insert/tabelle=tblAssozArten/feld=AaApArtId/wert=' + window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")) + '/user=' + sessionStorage.User,
						dataType: 'json'
					});
					insertAssozarten_2.done(function(id) {
						var strukturtyp = "assozarten",
							beschriftung = "neue assoziierte Art";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertAssozarten_2.fail(function() {
						//window.apf.melde("Fehler: Keine assoziierte Art erstellt");
						console.log('Fehler: Keine assoziierte Art erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die assoziierte Art '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.assozarten;
								window.apf.deleted.typ = "assozarten";
								var deleteAssozarten = $.ajax({
									type: 'post',
									url: 'api/delete/tabelle=tblAssozArten/tabelleIdFeld=AaId/tabelleId=' + window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
									dataType: 'json'
								});
								deleteAssozarten.done(function() {
                                    console.log('assozart gelöscht');
									delete localStorage.assozarten_id;
									delete window.apf.assozarten;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_assozarten(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die assoziierte Art '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteAssozarten.fail(function() {
									//window.apf.melde("Fehler: Die assoziierte Art wurde nicht gelöscht");
									console.log('Fehler: Die assoziierte Art wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			}
		};
		return items;
	case "pop":
		items = {
			"neu": {
				"label": "neue Population",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertPop_2 = $.ajax( {
						type: 'post',
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "pop",
							"user": sessionStorage.User
						}
					});
					insertPop_2.always(function(id) {
						var strukturtyp = "pop",
							beschriftung = "neue Population";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPop_2.fail(function() {
						//window.apf.melde("Fehler: Keine neue Population erstellt");
						console.log('Fehler: Keine neue Population erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Population '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.pop;
								window.apf.deleted.typ = "pop";
								var deletePop = $.ajax({
									type: 'post',
									url: 'php/pop_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deletePop.always(function() {
									delete localStorage.pop_id;
									delete window.apf.pop;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_pop(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Population '" + bezeichnung + "' wurde gelöscht.");
								});
								deletePop.fail(function() {
									//window.apf.melde("Fehler: Die Population wurde nicht gelöscht");
									console.log('Fehler: Die Population wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"GeoAdminMaps": {
				"label": "auf CH-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_gelb.png",
				"action": function() {
					var getPopChKarte_2 = $.ajax({
						type: 'get',
						url: 'php/pop_ch_karte.php',
						dataType: 'json',
						data: {
							"pop_id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getPopChKarte_2.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigePopAufOlmap(data);
						} else {
							window.apf.melde("Die Population hat keine Koordinaten", "Aktion abgebrochen");
						}
					});
					getPopChKarte_2.fail(function() {
						//window.apf.melde("Fehler: Keine Populationen erhalten");
						console.log('Fehler: Keine Populationen erhalten');
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function() {
					var getPopKarte = $.ajax({
						type: 'get',
						url: 'php/pop_karte.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getPopKarte.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getPopKarte.fail(function() {
						//window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
						console.log('Fehler: Keine Teilpopulationen erhalten');
					});
				}
			}
		};
		if (!window.apf.pop_zum_verschieben_gemerkt) {
			items.ausschneiden = {
				"label": "zum Verschieben merken",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// Jetzt die PopId merken - ihr muss danach eine andere ApArtId zugeteilt werden
					window.apf.pop_id = window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"));
					// merken, dass ein node ausgeschnitten wurde
					window.apf.pop_zum_verschieben_gemerkt = true;
					// und wie er heisst (um es später im Kontextmenü anzuzeigen)
					window.apf.pop_bezeichnung = $("#PopNr").val() + " " + $("#PopName").val();

				}
			}
		}
		if (window.apf.pop_zum_verschieben_gemerkt) {
			items.einfuegen = {
				"label": "'" + window.apf.pop_bezeichnung + "' einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					var popid = window.apf.pop_id;
					var apartid = window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"));
					// db aktualisieren
					var updatePop_2 = $.ajax({
						type: 'post',
						url: 'php/pop_update.php',
						dataType: 'json',
						data: {
							"id": popid,
							"Feld": "ApArtId",
							"Wert": apartid,
							"user": sessionStorage.User
						}
					});
					updatePop_2.always(function() {
						// Baum wieder aufbauen
						$.when(window.apf.erstelle_tree(apartid))
							.then(function() {
								// dann den eingefügten Node wählen
								$("#tree").jstree("select_node", "[typ='pop']#" + popid); 
							});
						// einfügen soll nicht mehr angezeigt werden
						delete window.apf.pop_zum_verschieben_gemerkt;
						// nicht mehr benötigte Variablen entfernen
						delete window.apf.pop_bezeichnung;
						delete window.apf.pop_id;
					});
					updatePop_2.fail(function() {
						//window.apf.melde("Fehler: Die Population wurde nicht verschoben");
						console.log('Fehler: Die Population wurde nicht verschoben');
					});
				}
			}
		}
		return items;
	case "pop_ordner_tpop":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function() {
					$.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neue Teilpopulation",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPop = $.ajax({
						type: 'post',
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "tpop",
							"user": sessionStorage.User
						}
					});
					insertTPop.always(function(id) {
						var strukturtyp = "tpop",
							beschriftung = "neue Teilpopulation";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPop.fail(function() {
						//window.apf.melde("Fehler: Keine neue Teilpopulation erstellt");
						console.log('Fehler: Keine neue Teilpopulation erstellt');
					});
				}
			},
			"GeoAdminMaps": {
				"label": "auf CH-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_gelb.png",
				"action": function() {
					var getTpopsKarte = $.ajax({
						type: 'get',
						url: 'php/tpops_karte.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getTpopsKarte.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigeTPopAufOlmap(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getTpopsKarte.fail(function() {
						//window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
						console.log('Fehler: Keine Teilpopulationen erhalten');
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function() {
					var getPopKarte_2 = $.ajax({
						type: 'get',
						url: 'php/pop_karte.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getPopKarte_2.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getPopKarte_2.fail(function() {
						//window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
						console.log('Fehler: Keine Teilpopulationen erhalten');
					});
				}
			}
		};
		if (window.apf.tpop_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpop_node_ausgeschnitten).get_text(window.apf.tpop_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(aktiver_node).move_node(window.apf.tpop_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.apf.tpop_node_kopiert) {
			label = "";
			if (window.apf.tpop_objekt_kopiert.TPopNr) {
				label += window.apf.tpop_objekt_kopiert.TPopNr;
			} else {
				label += "(keine Nr.)";
			}
			label += ": ";
			if (window.apf.tpop_objekt_kopiert.TPopFlurname) {
				label += window.apf.tpop_objekt_kopiert.TPopFlurname;
			} else {
				label += "(kein Flurname)";
			}
			items.einfuegen = {
				//"label": $.jstree._reference(window.apf.tpop_node_kopiert).get_text(window.apf.tpop_node_kopiert) + " einfügen",
				"label": label + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					window.apf.tpopKopiertInPopOrdnerTpopEinfügen(aktiver_node);
				}
			}
		}
		return items;
	case "tpop":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function() {
					$.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neue Teilpopulation",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPop_2 = $.ajax({
						type: 'post',
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpop",
							"user": sessionStorage.User
						}
					});
					insertTPop_2.always(function(id) {
						var strukturtyp = "tpop",
							beschriftung = "neue Teilpopulation";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPop_2.fail(function() {
						//window.apf.melde("Fehler: Keine neue Teilpopulation erstellt");
						console.log('Fehler: Keine neue Teilpopulation erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					// selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					$.jstree._reference(aktiver_node).deselect_all();
					// alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					$.jstree._reference(aktiver_node).open_all(aktiver_node);
					$.jstree._reference(aktiver_node).deselect_all();
					$.jstree._reference(aktiver_node).select_node(aktiver_node);
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Teilpopulation '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.tpop;
								window.apf.deleted.typ = "tpop";
								// löschen
								var deleteTPop = $.ajax({
									type: 'post',
									url: 'php/tpop_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteTPop.always(function() {
									delete localStorage.tpop_id;
									delete window.apf.tpop;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpop(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Teilpopulation '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPop.fail(function() {
									//window.apf.melde("Fehler: Die Teilpopulation wurde nicht gelöscht");
									console.log('Fehler: Die Teilpopulation wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			},
			"GeoAdminMaps": {
				"label": "auf CH-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_gelb.png",
				"action": function() {
					var getTPopKarte_2 = $.ajax({
						type: 'get',
						url: 'php/tpop_karte.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getTPopKarte_2.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigeTPopAufOlmap(data);
						} else {
							window.apf.melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
						}
					});
					getTPopKarte_2.fail(function() {
						//window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
						console.log('Fehler: Keine Teilpopulationen erhalten');
					});
				}
			},
			"verortenGeoAdmin": {
				"label": "auf CH-Karten verorten",
				"separator_before": true,
				"icon": "style/images/flora_icon_rot.png",
				"action": function() {
					var getTPop_2 = $.ajax({
						type: 'get',
						url: 'php/tpop.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getTPop_2.always(function(data) {
						window.apf.verorteTPopAufOlmap(data);
					});
					getTPop_2.fail(function() {
						//window.apf.melde("Fehler: Keine Teilpopulation erhalten");
						console.log('Fehler: Keine Teilpopulation erhalten');
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function() {
					var getTPopKarte_3 = $.ajax({
						type: 'get',
						url: 'php/tpop_karte.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getTPopKarte_3.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Die Teilpopulation hat keine Koordinaten", "Aktion abgebrochen");
						}
					});
					getTPopKarte_3.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},		
			"verorten": {
				"label": "auf Google-Karten verorten",
				"separator_before": true,
				"icon": "style/images/flora_icon_rot.png",
				"action": function() {
					var getTPop_3 = $.ajax({
						type: 'get',
						url: 'php/tpop.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getTPop_3.always(function(data) {
						window.apf.gmap.verorteTPop(data);
					});
					getTPop_3.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function() {
					window.apf.zeigeBeobKoordinatenImGisBrowser();
				}
			}
		};
		if (!window.apf.tpop_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpop_node_ausgeschnitten = aktiver_node;
					// es macht keinen Sinn mehr, den kopierten node zu behalten
					// und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.apf.tpop_node_kopiert;
					delete window.apf.tpop_objekt_kopiert;
				}
			}
		}
		if (!window.apf.tpop_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpop_node_kopiert = aktiver_node;
					// Daten des Objekts holen
					var getTPop_4 = $.ajax({
						type: 'get',
						url: 'php/tpop.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpop_node_kopiert).attr("id"))
						}
					});
					getTPop_4.always(function(data) {
						window.apf.tpop_objekt_kopiert = data;
					});
					getTPop_4.fail(function() {
						//window.apf.melde("Fehler: Die Teilpopulation wurde nicht kopiert");
						console.log('Fehler: Die Teilpopulation wurde nicht kopiert');
					});
				}
			}
		}
		if (window.apf.tpop_node_kopiert) {
			var label = "";
			if (window.apf.tpop_objekt_kopiert.TPopNr) {
				label += window.apf.tpop_objekt_kopiert.TPopNr;
			} else {
				label += "(keine Nr.)";
			}
			label += ": ";
			if (window.apf.tpop_objekt_kopiert.TPopFlurname) {
				label += window.apf.tpop_objekt_kopiert.TPopFlurname;
			} else {
				label += "(kein Flurname)";
			}
			items.einfuegen = {
				"label": label + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					window.apf.tpopKopiertInPopOrdnerTpopEinfügen(parent_node);
				}
			}
		}
		if (window.apf.tpop_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpop_node_ausgeschnitten).get_text(window.apf.tpop_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(parent_node).move_node(window.apf.tpop_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		return items;
	case "pop_ordner_popber":
		items = {
			"neu": {
				"label": "neuer Populations-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertPopber = $.ajax({
						type: 'post',
						url: 'php/popber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertPopber.always(function(id) {
						var strukturtyp = "popber",
							beschriftung = "neuer Populations-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopber.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Populations-Bericht erstellt");
						console.log('Fehler: Keinen neuen Populations-Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "popber":
		items = {
			"neu": {
				"label": "neuer Populations-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertPopber_2 = $.ajax({
						type: 'post',
						url: 'php/popber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "popber",
							"user": sessionStorage.User
						}
					});
					insertPopber_2.always(function(id) {
						var strukturtyp = "popber",
							beschriftung = "neuer Populations-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopber_2.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Populations-Bericht erstellt");
						console.log('Fehler: Keinen neuen Populations-Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Populations-Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.popber;
								window.apf.deleted.typ = "popber";
								var deletePopber = $.ajax({
									type: 'post',
									url: 'php/popber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deletePopber.always(function() {
									delete localStorage.popber_id;
									delete window.apf.popber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_popber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Populations-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deletePopber.fail(function() {
									//window.apf.melde("Fehler: Der Populations-Bericht wurde nicht gelöscht");
									console.log('Fehler: Der Populations-Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		return items;
	case "pop_ordner_massnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertPopMassnBer = $.ajax({
						type: 'post',
						url: 'php/popmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertPopMassnBer.always(function(id) {
						var strukturtyp = "popmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopMassnBer.fail(function() {
						//window.apf.melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
						console.log('Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "popmassnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertPopMassnBer_2 = $.ajax({
						type: 'post',
						url: 'php/popmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "popmassnber",
							"user": sessionStorage.User
						}
					});
					insertPopMassnBer_2.always(function(id) {
						var strukturtyp = "popmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopMassnBer_2.fail(function() {
						//window.apf.melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
						console.log('Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.popmassnber;
								window.apf.deleted.typ = "popmassnber";
								var deletePopMassnBer = $.ajax({
									type: 'post',
									url: 'php/popmassnber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deletePopMassnBer.always(function() {
									delete localStorage.popmassnber_id;
									delete window.apf.popmassnber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_popmassnber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deletePopMassnBer.fail(function() {
									//window.apf.melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
									console.log('Fehler: Der Massnahmen-Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		return items;
	case "tpop_ordner_feldkontr":
		items = {
			"neu": {
				"label": "neue Feldkontrolle",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopFeldKontr = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						}
					});
					insertTPopFeldKontr.always(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = "neue Feldkontrolle";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr.fail(function() {
						//window.apf.melde("Fehler: Keine neue Feldkontrolle erstellt");
						console.log('Fehler: Keine neue Feldkontrolle erstellt');
					});
				}
			}
		};
		if (window.apf.tpopfeldkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfeldkontr_node_ausgeschnitten).get_text(window.apf.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(aktiver_node).move_node(window.apf.tpopfeldkontr_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.apf.tpopfeldkontr_node_kopiert) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					// und an die DB schicken
					var insertTPopFeldKontrKopie = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert_kopie.php',
						dataType: 'json',
						data: {
							"user": sessionStorage.User,
							"TPopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
						}
					});
					insertTPopFeldKontrKopie.always(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie.fail(function() {
						//window.apf.melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
						console.log('Fehler: Die Feldkontrolle wurde nicht erstellt');
					});
				}
			}
		}
		return items;
	case "tpopfeldkontr":
		items = {
			"neu": {
				"label": "neue Feldkontrolle",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopFeldKontr_2 = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						}
					});
					insertTPopFeldKontr_2.always(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = "neue Feldkontrolle";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr_2.fail(function() {
						//window.apf.melde("Fehler: Keine neue Feldkontrolle erstellt");
						console.log('Fehler: Keine neue Feldkontrolle erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Feldkontrolle '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.tpopfeldkontr;
								window.apf.deleted.typ = "tpopfeldkontr";
								var deleteTPopFeldKontr = $.ajax({
									type: 'post',
									url: 'php/tpopfeldkontr_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteTPopFeldKontr.always(function() {
									delete localStorage.tpopfeldkontr_id;
									delete window.apf.tpopfeldkontr;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopfeldkontr(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Feldkontrolle '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopFeldKontr.fail(function() {
									//window.apf.melde("Fehler: Die Feldkontrolle wurde nicht gelöscht");
									console.log('Fehler: Die Feldkontrolle wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"biotop_kopieren": {
				"label": "Biotop kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					delete window.apf.feldkontr_biotop;
					window.apf.feldkontr_biotop = {};
                    var $TPopKontrFlaeche = $("#TPopKontrFlaeche");
					if ($TPopKontrFlaeche.val()) {
						window.apf.feldkontr_biotop.TPopKontrFlaeche = $TPopKontrFlaeche.val();
					}
                    var $TPopKontrLeb = $("#TPopKontrLeb");
					if ($TPopKontrLeb.val()) {
						window.apf.feldkontr_biotop.TPopKontrLeb = $TPopKontrLeb.val();
					}
                    var $TPopKontrLebUmg = $("#TPopKontrLebUmg");
					if ($TPopKontrLebUmg.val()) {
						window.apf.feldkontr_biotop.TPopKontrLebUmg = $TPopKontrLebUmg.val();
					}
                    var $TPopKontrVegTyp = $("#TPopKontrVegTyp");
					if ($TPopKontrVegTyp.val()) {
						window.apf.feldkontr_biotop.TPopKontrVegTyp = $TPopKontrVegTyp.val();
					}
                    var $TPopKontrKonkurrenz = $("#TPopKontrKonkurrenz");
					if ($TPopKontrKonkurrenz.val()) {
						window.apf.feldkontr_biotop.TPopKontrKonkurrenz = $TPopKontrKonkurrenz.val();
					}
                    var $TPopKontrMoosschicht = $("#TPopKontrMoosschicht");
					if ($TPopKontrMoosschicht.val()) {
						window.apf.feldkontr_biotop.TPopKontrMoosschicht = $TPopKontrMoosschicht.val();
					}
                    var $TPopKontrKrautschicht = $("#TPopKontrKrautschicht");
					if ($TPopKontrKrautschicht.val()) {
						window.apf.feldkontr_biotop.TPopKontrKrautschicht = $TPopKontrKrautschicht.val();
					}
                    var $TPopKontrStrauchschicht = $("#TPopKontrStrauchschicht");
					if ($TPopKontrStrauchschicht.val()) {
						window.apf.feldkontr_biotop.TPopKontrStrauchschicht = $TPopKontrStrauchschicht.val();
					}
                    var $TPopKontrBaumschicht = $("#TPopKontrBaumschicht");
					if ($TPopKontrBaumschicht.val()) {
						window.apf.feldkontr_biotop.TPopKontrBaumschicht = $TPopKontrBaumschicht.val();
					}
                    var $TPopKontrBodenTyp = $("#TPopKontrBodenTyp");
					if ($TPopKontrBodenTyp.val()) {
						window.apf.feldkontr_biotop.TPopKontrBodenTyp = $TPopKontrBodenTyp.val();
					}
                    var $TPopKontrBodenKalkgehalt = $("#TPopKontrBodenKalkgehalt");
					if ($TPopKontrBodenKalkgehalt.val()) {
						window.apf.feldkontr_biotop.TPopKontrBodenKalkgehalt = $TPopKontrBodenKalkgehalt.val();
					}
					if ($("#TPopKontrBodenDurchlaessigkeit").val()) {
						window.apf.feldkontr_biotop.TPopKontrBodenDurchlaessigkeit = $("#TPopKontrBodenDurchlaessigkeit").val();
					}
					if ($("#TPopKontrBodenHumus").val()) {
						window.apf.feldkontr_biotop.TPopKontrBodenHumus = $("#TPopKontrBodenHumus").val();
					}
					if ($("#TPopKontrBodenNaehrstoffgehalt").val()) {
						window.apf.feldkontr_biotop.TPopKontrBodenNaehrstoffgehalt = $("#TPopKontrBodenNaehrstoffgehalt").val();
					}
					if ($("#TPopKontrBodenAbtrag").val()) {
						window.apf.feldkontr_biotop.TPopKontrBodenAbtrag = $("#TPopKontrBodenAbtrag").val();
					}
					if ($("#TPopKontrWasserhaushalt").val()) {
						window.apf.feldkontr_biotop.TPopKontrWasserhaushalt = $("#TPopKontrWasserhaushalt").val();
					}
					if ($("#TPopKontrHandlungsbedarf").val()) {
						window.apf.feldkontr_biotop.TPopKontrHandlungsbedarf = $("#TPopKontrHandlungsbedarf").val();
					}
				}
			}
		};
		if (window.apf.feldkontr_biotop) {
			items.biotop_einfuegen = {
				"label": "Biotop einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					var data = {};
					data.id = window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"));
					data.user = sessionStorage.User;
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
                    _.each(window.apf.feldkontr_biotop, function(value, key) {
                        $("#" + key).val(value);
                        data[key] = value;
                    });
					// jetzt alles speichern
					var updateTPopFeldKontrMultiple = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_update_multiple.php',
						dataType: 'json',
						data: data
					});
					updateTPopFeldKontrMultiple.fail(function() {
						//window.apf.melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
						console.log('Fehler: Das kopierte Biotop wurde nicht eingefügt');
					});
				}
			}
		}
		if (!window.apf.tpopfeldkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpopfeldkontr_node_ausgeschnitten = aktiver_node;
					// es macht keinen Sinn mehr, den kopierten node zu behalten
					// und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.apf.tpopfeldkontr_node_kopiert;
					delete window.apf.tpopfeldkontr_objekt_kopiert;
				}
			}
		}
		if (!window.apf.tpopfeldkontr_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpopfeldkontr_node_kopiert = aktiver_node;
					// Daten des Objekts holen
					var getTPopFeldkontr_2 = $.ajax({
						type: 'get',
						url: 'php/tpopfeldkontr.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
						}
					});
					getTPopFeldkontr_2.always(function(data) {
						window.apf.tpopfeldkontr_objekt_kopiert = data;
					});
					getTPopFeldkontr_2.fail(function() {
						//window.apf.melde("Fehler: Die Feldkontrolle wurde nicht kopiert");
						console.log('Fehler: Die Feldkontrolle wurde nicht kopiert');
					});
				}
			}
		}
		if (window.apf.tpopfeldkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfeldkontr_node_ausgeschnitten).get_text(window.apf.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(parent_node).move_node(window.apf.tpopfeldkontr_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		if (window.apf.tpopfeldkontr_node_kopiert) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfeldkontr_node_kopiert).get_text(window.apf.tpopfeldkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					// und an die DB schicken
					var insertTPopFeldKontrKopie_2 = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert_kopie.php',
						dataType: 'json',
						data: {
							"user": sessionStorage.User,
							"TPopId": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfeldkontr_node_kopiert).attr("id"))
						}
					});
					insertTPopFeldKontrKopie_2.always(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie_2.fail(function() {
						//window.apf.melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
						console.log('Fehler: Die Feldkontrolle wurde nicht erstellt');
					});
				}
			}
		}
		return items;
	case "tpop_ordner_freiwkontr":
		items = {
			"neu": {
				"label": "neue Freiwilligen-Kontrolle",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopFeldKontr_3 = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User,
							"typ": "Freiwilligen-Erfolgskontrolle"
						}
					});
					insertTPopFeldKontr_3.always(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = "neue Freiwilligen-Kontrolle";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr_3.fail(function() {
						//window.apf.melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
						console.log('Fehler: Keine neue Freiwilligen-Kontrolle erstellt');
					});
				}
			}
		};
		if (window.apf.tpopfreiwkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfreiwkontr_node_ausgeschnitten).get_text(window.apf.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(aktiver_node).move_node(window.apf.tpopfreiwkontr_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.apf.tpopfreiwkontr_node_kopiert) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					// und an die DB schicken
					var insertTPopFeldKontrKopie_3 = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert_kopie.php',
						dataType: 'json',
						data: {
							"user": sessionStorage.User,
							"TPopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
						}
					});
					insertTPopFeldKontrKopie_3.always(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie_3.fail(function() {
						//window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
						console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt');
					});
				}
			}
		}
		return items;
	case "tpopfreiwkontr":
		items = {
			"neu": {
				"label": "neue Freiwilligen-Kontrolle",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopFeldKontr_4 = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"user": sessionStorage.User,
							"typ": "Freiwilligen-Erfolgskontrolle"
						}
					});
					insertTPopFeldKontr_4.always(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = "neue Freiwilligen-Kontrolle";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr_4.fail(function() {
						//window.apf.melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
						console.log('Fehler: Keine neue Freiwilligen-Kontrolle erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.tpopfeldkontr;
								window.apf.deleted.typ = "tpopfreiwkontr";
								var deleteTPopFeldKontr_2 = $.ajax({
									type: 'post',
									url: 'php/tpopfeldkontr_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteTPopFeldKontr_2.always(function() {
									delete localStorage.tpopfeldkontr_id;
									delete localStorage.tpopfreiwkontr;
									delete window.apf.tpopfeldkontr;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopfreiwkontr(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Freiwilligen-Kontrolle '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopFeldKontr_2.fail(function() {
									//window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht");
									console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		if (!window.apf.tpopfreiwkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpopfreiwkontr_node_ausgeschnitten = aktiver_node;
					// es macht keinen Sinn mehr, den kopierten node zu behalten
					// und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.apf.tpopfreiwkontr_node_kopiert;
					delete window.apf.tpopfreiwkontr_objekt_kopiert;
				}
			}
		}
		if (!window.apf.tpopfreiwkontr_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpopfreiwkontr_node_kopiert = aktiver_node;
					// Daten des Objekts holen
					var getTPopFeldkontr_3 = $.ajax({
						type: 'get',
						url: 'php/tpopfeldkontr.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
						}
					});
					getTPopFeldkontr_3.always(function(data) {
						window.apf.tpopfreiwkontr_objekt_kopiert = data;
					});
					getTPopFeldkontr_3.fail(function() {
						//window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert");
						console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert');
					});
				}
			}
		}
		if (window.apf.tpopfreiwkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfreiwkontr_node_ausgeschnitten).get_text(window.apf.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(parent_node).move_node(window.apf.tpopfreiwkontr_node_ausgeschnitten, parent_node, "first", false);
					localStorage.tpopfreiwkontr = true;
				}
			}
		}
		if (window.apf.tpopfreiwkontr_node_kopiert) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopfreiwkontr_node_kopiert).get_text(window.apf.tpopfreiwkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					var insertTPopFeldKontrKopie_4 = $.ajax({
						type: 'post',
						url: 'php/tpopfeldkontr_insert_kopie.php',
						dataType: 'json',
						data: {
							"user": sessionStorage.User,
							"TPopId": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"TPopKontrId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopfreiwkontr_node_kopiert).attr("id"))
						}
					});
					insertTPopFeldKontrKopie_4.always(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie_4.fail(function() {
						//window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
						console.log('Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt');
					});
				}
			}
		}
		return items;
	case "tpop_ordner_massn":
		items = {
			"neu": {
				"label": "neue Massnahme",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopMassn = $.ajax({
						type: 'post',
						url: 'php/tpopmassn_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						}
					});
					insertTPopMassn.always(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = "neue Massnahme";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassn.fail(function() {
						//window.apf.melde("Fehler: Keine neue Massnahme erstellt");
						console.log('Fehler: Keine neue Massnahme erstellt');
					});
				}
			}
		};
		if (window.apf.tpopmassn_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopmassn_node_ausgeschnitten).get_text(window.apf.tpopmassn_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(aktiver_node).move_node(window.apf.tpopmassn_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.apf.tpopmassn_node_kopiert) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					var insertTPopMassnKopie = $.ajax({
						type: 'post',
						url: 'php/tpopmassn_insert_kopie.php',
						dataType: 'json',
						data: {
							"user": sessionStorage.User,
							"TPopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"TPopMassnId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
						}
					});
					insertTPopMassnKopie.always(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassnKopie.fail(function() {
						//window.apf.melde("Fehler: Die Massnahme wurde nicht erstellt");
						console.log('Fehler: Die Massnahme wurde nicht erstellt');
					});
				}
			}
		}
		return items;
	case "tpopmassn":
		items = {
			"neu": {
				"label": "neue Massnahme",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopMassn_2 = $.ajax({
						type: 'post',
						url: 'php/tpopmassn_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						}
					});
					insertTPopMassn_2.always(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = "neue Massnahme";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassn_2.fail(function() {
						//window.apf.melde("Fehler: Keine neue Massnahme erstellt");
						console.log('Fehler: Keine neue Massnahme erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Massnahme '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.tpopmassn;
								window.apf.deleted.typ = "tpopmassn";
								var deleteTPopMassn = $.ajax({
									type: 'post',
									url: 'php/tpopmassn_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteTPopMassn.always(function() {
									delete localStorage.tpopmassn_id;
									delete window.apf.tpopmassn;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopmassn(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Massnahme '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopMassn.fail(function() {
									//window.apf.melde("Fehler: Die Massnahme wurde nicht gelöscht");
									console.log('Fehler: Die Massnahme wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		if (!window.apf.tpopmassn_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpopmassn_node_ausgeschnitten = aktiver_node;
					// es macht keinen Sinn mehr, den kopierten node zu behalten
					// und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.apf.tpopmassn_node_kopiert;
					delete window.apf.tpopmassn_objekt_kopiert;
				}
			}
		}
		if (!window.apf.tpopmassn_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.tpopmassn_node_kopiert = aktiver_node;
					// Daten des Objekts holen
					var getTPopMassn_2 = $.ajax({
                            type: 'get',
                            url: 'php/tpopmassn.php',
                            dataType: 'json',
                            data: {
                                "id": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
                            }
                        }),
                        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked");
					getTPopMassn_2.always(function(data) {
						window.apf.tpopmassn_objekt_kopiert = data;
						// den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
						window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = "";
						if ($TPopMassnTypChecked.text()) {
							window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = $TPopMassnTypChecked.text();
						}
					});
					getTPopMassn_2.fail(function() {
						//window.apf.melde("Fehler: Die Massnahme wurde nicht kopiert");
						console.log('Fehler: Die Massnahme wurde nicht kopiert');
					});
				}
			}
		}
		if (window.apf.tpopmassn_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopmassn_node_ausgeschnitten).get_text(window.apf.tpopmassn_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(parent_node).move_node(window.apf.tpopmassn_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		if (window.apf.tpopmassn_node_kopiert) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.tpopmassn_node_kopiert).get_text(window.apf.tpopmassn_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					var insertTPopMassnKopie_2 = $.ajax({
						type: 'post',
						url: 'php/tpopmassn_insert_kopie.php',
						dataType: 'json',
						data: {
							"user": sessionStorage.User,
							"TPopId": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"TPopMassnId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpopmassn_node_kopiert).attr("id"))
						}
					});
					insertTPopMassnKopie_2.always(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassnKopie_2.fail(function() {
						//window.apf.melde("Fehler: Die Massnahme wurde nicht erstellt");
						console.log('Fehler: Die Massnahme wurde nicht erstellt');
					});
				}
			}
		}
		return items;
	case "tpop_ordner_tpopber":
		items = {
			"neu": {
				"label": "neuer Teilpopulations-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopBer = $.ajax({
						type: 'post',
						url: 'php/tpopber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertTPopBer.always(function(id) {
						var strukturtyp = "tpopber",
							beschriftung = "neuer Teilpopulations-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopBer.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
						console.log('Fehler: Keinen neuen Teilpopulations-Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "tpopber":
		items = {
			"neu": {
				"label": "neuer Teilpopulations-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopBer_2 = $.ajax({
						type: 'post',
						url: 'php/tpopber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopber",
							"user": sessionStorage.User
						}
					});
					insertTPopBer_2.always(function(id) {
						var strukturtyp = "tpopber",
							beschriftung = "neuer Teilpopulations-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopBer_2.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
						console.log('Fehler: Keinen neuen Teilpopulations-Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Teilpopulations-Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.tpopber;
								window.apf.deleted.typ = "tpopber";
								var deleteTPopBer = $.ajax({
									type: 'post',
									url: 'php/tpopber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteTPopBer.always(function() {
									delete localStorage.tpopber_id;
									delete window.apf.tpopber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopBer.fail(function() {
									//window.apf.melde("Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht");
									console.log('Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		return items;
	case "tpop_ordner_beob_zugeordnet":
		items = {
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function() {
					var getBeobKarte = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"tpop_id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPopBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtungen mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			}
		};
		if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items = {};
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(aktiver_node).move_node(window.apf.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.apf.beob_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.beob_node_ausgeschnitten).get_text(window.apf.beob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$("#tree").jstree("move_node", window.apf.beob_node_ausgeschnitten, aktiver_node, "first");
				}
			}
		}
		return items;
	case "beob_zugeordnet":
		items = {
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function() {
					var getBeobKarte_2 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_2.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPopBeob(data);
						} else {
							window.apf.melde("Die Beobachtung hat keine Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte_2.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GoogleMapsMitTPopTPopBeob": {
				"label": "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_3 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_3.always(function(beob) {
						if (beob.rows.length > 0) {
							var getApKarte = $.ajax({
								type: 'get',
								url: 'php/ap_karte.php',
								dataType: 'json',
								data: {
									"id": localStorage.ap_id
								}
							});
							getApKarte.always(function(tpop) {
								if (tpop.rows.length > 0) {
									window.apf.gmap.zeigeBeobUndTPop(beob, tpop);
								} else {
									window.apf.gmap.zeigeBeob(beob);
								}
							});
						} else {
							window.apf.melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
						}
					});
					getBeobKarte_3.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function() {
					window.apf.zeigeBeobKoordinatenImGisBrowser();
				}
			}
		};
		if (!window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.beob_zugeordnet_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen_beob_zugeordnet = {
				"label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(parent_node).move_node(window.apf.beob_zugeordnet_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		if (window.apf.beob_node_ausgeschnitten) {
			items.einfuegen_beob = {
				"label": $.jstree._reference(window.apf.beob_node_ausgeschnitten).get_text(window.apf.beob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$.jstree._reference(parent_node).move_node(window.apf.beob_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		return items;
	case "tpop_ordner_massnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopMassnBer = $.ajax({
						type: 'post',
						url: 'php/tpopmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertTPopMassnBer.always(function(id) {
						var strukturtyp = "tpopmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassnBer.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
						console.log('Fehler: Keinen neuen Massnahmen-Bericht erstellt');
					});
				}
			}
		};
		return items;
	case "tpopmassnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function() {
					var insertTPopMassBer_2 = $.ajax({
						type: 'post',
						url: 'php/tpopmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopmassnber",
							"user": sessionStorage.User
						}
					});
					insertTPopMassBer_2.always(function(id) {
						var strukturtyp = "tpopmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassBer_2.fail(function() {
						//window.apf.melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
						console.log('Fehler: Keinen neuen Massnahmen-Bericht erstellt');
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					var bezeichnung = $.jstree._reference(aktiver_node).get_text(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht '" + bezeichnung + "' wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								// Variable zum rückgängig machen erstellen
								window.apf.deleted = window.apf.tpopmassnber;
								window.apf.deleted.typ = "tpopmassnber";
								var deleteTPopMassnBer = $.ajax({
									type: 'post',
									url: 'php/tpopmassnber_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteTPopMassnBer.always(function() {
									delete localStorage.tpopmassnber_id;
									delete window.apf.tpopmassnber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_popmassnber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopMassnBer.fail(function() {
									//window.apf.melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
									console.log('Fehler: Der Massnahmen-Bericht wurde nicht gelöscht');
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			}
		};
		return items;
	case "ap_ordner_beob_nicht_beurteilt":
		items = {
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_4 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"apart_id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_4.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte_4.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GoogleMapsMitTPop": {
				"label": "auf Luftbild Teilpopulationen<br>&nbsp;&nbsp;&nbsp;zuordnen<br>&nbsp;&nbsp;&nbsp;Tipp: Beobachtungen auf<br>&nbsp;&nbsp;&nbsp;Teilpopulationen ziehen!",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_5 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"apart_id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_5.always(function(beob) {
						if (beob.rows.length > 0) {
							$.ajax({
								type: 'get',
								url: 'php/ap_karte.php',
								dataType: 'json',
								data: {
									"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
								},
								success: function(tpop) {
									if (tpop.rows.length > 0) {
										window.apf.gmap.zeigeBeobUndTPop(beob, tpop);
									} else {
										window.apf.gmap.zeigeBeob(beob);
									}
								}
							});
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte_5.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			}
		};
		if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first");
				}
			}
		}
		return items;
	case "beob_nicht_beurteilt":
		items = {
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_6 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_6.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte_6.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GoogleMapsMitTPopBeob": {
				"label": "auf Luftbild einer Teilpopulation<br>&nbsp;&nbsp;&nbsp;zuordnen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_7 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_7.always(function(beob) {
						if (beob.rows.length > 0) {
							var getApKarte_2 = $.ajax({
								type: 'get',
								url: 'php/ap_karte.php',
								dataType: 'json',
								data: {
									"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"))
								}
							});
							getApKarte_2.always(function(tpop) {
								if (tpop.rows.length > 0) {
									window.apf.gmap.zeigeBeobUndTPop(beob, tpop);
								} else {
									window.apf.gmap.zeigeBeob(beob);
								}
							});
						} else {
							window.apf.melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen", "Aktion abgebrochen");
						}
					});
					getBeobKarte_7.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function() {
					window.apf.zeigeBeobKoordinatenImGisBrowser();
				}
			}
		};
		if (!window.apf.beob_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.beob_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, parent_node, "first");
				}
			}
		}
		return items;
	case "ap_ordner_beob_nicht_zuzuordnen":
		items = {
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_8 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"apart_id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"nicht_zuzuordnen": "1"
						}
					});
					getBeobKarte_8.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte_8.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			}
		};
		if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first");
				}
			}
		}
		return items;
	case "beob_nicht_zuzuordnen":
		items = {
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function() {
					var getBeobKarte_9 = $.ajax({
						type: 'get',
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						}
					});
					getBeobKarte_9.always(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten", "Aktion abgebrochen");
						}
					});
					getBeobKarte_9.fail(function() {
						//window.apf.melde("Fehler: Keine Daten erhalten");
						console.log('Fehler: Keine Daten erhalten');
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function() {
					window.apf.zeigeBeobKoordinatenImGisBrowser();
				}
			}
		};
		if (!window.apf.beob_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function() {
					// nur aktualisieren, wenn Schreibrechte bestehen
					if (!window.apf.prüfeSchreibvoraussetzungen()) {
						return;
					}
					window.apf.beob_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.apf.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": $.jstree._reference(window.apf.beob_zugeordnet_node_ausgeschnitten).get_text(window.apf.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function() {
					$("#tree").jstree("move_node", window.apf.beob_zugeordnet_node_ausgeschnitten, parent_node, "first");
				}
			}
		}
		return items;
	}
};

window.apf.tpopKopiertInPopOrdnerTpopEinfügen = function(aktiver_node) {
	'use strict';
	var insertTPopKopie = $.ajax({
		type: 'post',
		url: 'php/tpop_insert_kopie.php',
		dataType: 'json',
		data: {
			"user": sessionStorage.User,
			"PopId": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
			"TPopId": window.apf.erstelleIdAusDomAttributId($(window.apf.tpop_node_kopiert).attr("id"))
		}
	});
	insertTPopKopie.always(function(id) {
		var strukturtyp = "tpop",
			beschriftung = window.apf.tpop_objekt_kopiert.TPopFlurname;
		if (window.apf.tpop_objekt_kopiert.TPopNr) {
			beschriftung = window.apf.tpop_objekt_kopiert.TPopNr + ': ' + window.apf.tpop_objekt_kopiert.TPopFlurname
		}
		window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, "", strukturtyp, id, beschriftung);
	});
	insertTPopKopie.fail(function() {
		//window.apf.melde("Fehler: Die Teilpopulation wurde nicht erstellt");
		console.log('Fehler: Die Teilpopulation wurde nicht erstellt');
	});
};

// wird offenbar momentan nicht verwendet
/*window.apf.popKopiertInPopEinfügen = function(aktiver_node, parent_node) {
	'use strict';
	var data = {};
	// nur aktualisieren, wenn Schreibrechte bestehen
	if (!window.apf.prüfeSchreibvoraussetzungen()) {
		return;
	}
	// drop kennt den parent nicht
	if (!parent_node) {
		parent_node = $.jstree._reference(aktiver_node)._get_parent(aktiver_node);
	}
	// User und neue ApArtId mitgeben
	data.MutWer = sessionStorage.User;
	data.ApArtId = window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"));
	// die alten id's entfernen
	delete window.apf.pop_objekt_kopiert.ApArtId;
	delete window.apf.pop_objekt_kopiert.PopId;
	// das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.apf.pop_objekt_kopiert.MutWann;
	delete window.apf.pop_objekt_kopiert.MutWer;
	// alle verbliebenen Felder an die url hängen
    _.each(window.apf.pop_objekt_kopiert, function(value, key) {
        // Nullwerte ausschliessen
        if (value !== null) {
            data[key] = value;
        }
    });
	// und an die DB schicken
	var insertPopKopie_2 = $.ajax({
		type: 'post',
		url: 'php/pop_insert_kopie.php',
		dataType: 'json',
		data: data
	});
	insertPopKopie_2.always(function(pop_id) {
		var strukturtyp = "pop",
			beschriftung = window.apf.pop_objekt_kopiert.PopNr + " " + window.apf.pop_objekt_kopiert.PopName;
		window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, pop_id, beschriftung);
	});
	insertPopKopie_2.fail(function() {
		//window.apf.melde("Fehler: Die Population wurde nicht erstellt");
		console.log('Die Population wurde nicht erstellt');
	});
};*/

// wird offenbar momentan nicht verwendet
window.apf.tpopKopiertInTpopEinfügen = function(aktiver_node, parent_node) {
	'use strict';
	var data = {};
	// nur aktualisieren, wenn Schreibrechte bestehen
	if (!window.apf.prüfeSchreibvoraussetzungen()) {
		return;
	}
	// drop kennt den parent nicht
	if (!parent_node) {
		parent_node = $.jstree._reference(aktiver_node)._get_parent(aktiver_node);
	}
	// User und neue PopId mitgeben
	data.MutWer = sessionStorage.User;
	data.PopId = window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"));
	// die alten id's entfernen
	delete window.apf.tpop_objekt_kopiert.PopId;
	delete window.apf.tpop_objekt_kopiert.TPopId;
	// das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.apf.tpop_objekt_kopiert.MutWann;
	delete window.apf.tpop_objekt_kopiert.MutWer;
	// alle verbliebenen Felder an die url hängen
    _.each(window.apf.tpop_objekt_kopiert, function(value, key) {
        // Nullwerte ausschliessen
        if (value !== null) {
            data[key] = value;
        }
    });
	// und an die DB schicken
	var insertTPopKopie_2 = $.ajax({
		type: 'post',
		url: 'php/tpop_insert_kopie.php',
		dataType: 'json',
		data: data
	});
	insertTPopKopie_2.always(function(tpop_id) {
		var strukturtyp = "tpop",
			beschriftung = window.apf.tpop_objekt_kopiert.TPopNr + " " + window.apf.tpop_objekt_kopiert.TPopFlurname;
		window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, tpop_id, beschriftung);
	});
	insertTPopKopie_2.fail(function() {
		//window.apf.melde("Fehler: Die Teilpopulation wurde nicht erstellt");
		console.log('Fehler: Die Teilpopulation wurde nicht erstellt');
	});
};

window.apf.prüfeLesevoraussetzungen = function() {
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
                    Ok: function() {
                        $(this).dialog("close");
                    }
                }
            });
		return false;
	} else {
		return true;
	}
};

window.apf.prüfeSchreibvoraussetzungen = function() {
	'use strict';
	// kontrollieren, ob der User online ist
	if (window.apf.prüfeLesevoraussetzungen()) {
		// kontrollieren, ob der User Schreibrechte hat
		if (sessionStorage.NurLesen) {
			window.apf.melde("Sie haben keine Schreibrechte", "Speichern abgebrochen");
			return false;
		} else {
			return true;
		}
	}
};

// wird von allen Formularen benutzt
// speichert den Wert eines Feldes in einem Formular
// übernimmt das Objekt, in dem geändert wurde
window.apf.speichern = function(that) {
	'use strict';
	var feldtyp,
        formular,
        tabelleInDb,
        tabelleIdFeld,
        feldname,
        feldwert,
        objekt,
        $PopName = $("#PopName"),
        $PopNr = $("#PopNr"),
        $tree = $("#tree"),
        $PopBerJahr = $("#PopBerJahr"),
        $PopBerEntwicklungChecked = $('input[name="PopBerEntwicklung"]:checked'),
        $spanPopBerEntwicklungPlus$PopBerEntwicklungChecked = $("#spanPopBerEntwicklung" + $PopBerEntwicklungChecked.val()),
        $spanPopMassnBerErfolgsbeurteilungPlusPopMassnBerErfolgsbeurteilungChecked = $("#spanPopMassnBerErfolgsbeurteilung" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').val()),
        $PopMassnBerJahr = $("#PopMassnBerJahr"),
        $TPopNr = $("#TPopNr"),
        $TPopFlurname = $("#TPopFlurname"),
        $TPopBerJahr = $("#TPopBerJahr"),
        $spanTPopBerEntwicklungPlusTPopBerEntwicklungChecked = $("#spanTPopBerEntwicklung" + $('input[name="TPopBerEntwicklung"]:checked').val()),
        $TPopMassnJahr = $("#TPopMassnJahr"),
        $TPopMassnTypChecked = $("#TPopMassnTyp option:checked"),
        $TPopMassnBerJahr = $("#TPopMassnBerJahr"),
        $spanTPopMassnBerErfolgsbeurteilungPlusTPopMassnBerErfolgsbeurteilungChecked = $("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()),
        $ZielBerJahr = $("#ZielBerJahr"),
        $ZielBerErreichung = $("#ZielBerErreichung"),
        $SpanErfkritErreichungsgradPlusErfkritErreichungsgradChecked = $("#SpanErfkritErreichungsgrad" + $("input:radio[name='ErfkritErreichungsgrad']:checked").val()),
        $BerJahr = $("#BerJahr"),
        $BerTitel = $("#BerTitel"),
        configuration = require('./modules/configuration');

	if (window.apf.prüfeSchreibvoraussetzungen()) {
		formular = $(that).attr("formular");
        // die zu aktualisierende Tabelle in der DB
        tabelleInDb = configuration.forms[formular].tabelleInDb;
        tabelleIdFeld = configuration.forms[formular].tabelleIdFeld;
		feldname = that.name;
		feldtyp = $(that).attr("type") || null;
		// Feldwert ermitteln
		if (feldtyp && feldtyp === "checkbox") {
			feldwert = $('input:checkbox[name=' + feldname + ']:checked').val();
		} else if (feldtyp && feldtyp === "radio") {
			feldwert = $('input:radio[name=' + feldname + ']:checked').val();
		} else {
			// textarea, input, select
			feldwert = $("#" + feldname).val();
		}
		// ja/nein Felder zu boolean umbauen
		if (feldname === "PopHerkunftUnklar" || feldname === "TPopHerkunftUnklar" || feldname === "TPopMassnPlan" || feldname === "TPopKontrPlan") {
			if (feldwert) {
				feldwert = 1;
			} else {
				feldwert = "";
			}
		}
		if (feldname === "BeobBemerkungen" && localStorage.beob_status === "nicht_beurteilt") {
			// hier soll nicht gespeichert werden
			$("#BeobBemerkungen").val("");
			window.apf.melde("Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich", "Aktion abgebrochen");
			return;
		}
		var updateFormular = $.ajax({
			type: 'post',
			url: 'api/update/tabelle=' + tabelleInDb + '/tabelleIdFeld=' + tabelleIdFeld + '/tabelleId=' + localStorage[formular + "_id"] + '/feld=' + feldname + '/wert=' + feldwert + '/user=' + sessionStorage.User,
			dataType: 'json'
		});
		updateFormular.done(function() {
			// Variable für Objekt nachführen
			window.apf[formular][feldname] = feldwert;
			// Wenn ApArtId verändert wurde: Formular aktualisieren
			if (feldname === "ApArtId" && feldwert) {
				window.apf.wähleAp(feldwert);
				return;
			}
			// Wenn in feldkontr Datum erfasst, auch Jahr speichern
			if (feldname === "TPopKontrDatum" && feldwert) {
				objekt = {};
				objekt.name = "TPopKontrJahr";
				objekt.formular = "tpopfeldkontr";
				window.apf.speichern(objekt);
			}
			// dito bei tpopmassn
			if (feldname === "TPopMassnDatum" && feldwert) {
				objekt = {};
				objekt.name = "TPopMassnJahr";
				objekt.formular = "tpopmassn";
				window.apf.speichern(objekt);
			}
			// wenn in TPopKontrZaehleinheit 1 bis 3 ein Leerwert eingeführt wurde
			// sollen auch die Felder TPopKontrMethode 1 bis 3 und TPopKontrAnz 1 bis 3 Leerwerte erhalten
			if (!feldwert) {
				if (feldname === "TPopKontrZaehleinheit1") {
					// UI aktualisieren
					if (window.apf.tpopfeldkontr.TPopKontrMethode1) {
						$("#TPopKontrMethode1" + window.apf.tpopfeldkontr.TPopKontrMethode1).prop("checked", false);
					}
					$("#TPopKontrAnz1").val("");
					// Datenbank aktualisieren
					// Feld TPopKontrMethode1
					objekt = {};
					objekt.name = "TPopKontrMethode1";
					objekt.formular = formular;
					window.apf.speichern(objekt);
					// Feld TPopKontrAnz1
					objekt = {};
					objekt.name = "TPopKontrAnz1";
					objekt.formular = formular;
					window.apf.speichern(objekt);
				}
				if (feldname === "TPopKontrZaehleinheit2") {
					// UI aktualisieren
					if (window.apf.tpopfeldkontr.TPopKontrMethode2) {
						$("#TPopKontrMethode2" + window.apf.tpopfeldkontr.TPopKontrMethode2).prop("checked", false);
					}
					$("#TPopKontrAnz2").val("");
					// Datenbank aktualisieren
					// Feld TPopKontrMethode2
					objekt = {};
					objekt.name = "TPopKontrMethode2";
					objekt.formular = formular;
					window.apf.speichern(objekt);
					// Feld TPopKontrAnz2
					objekt = {};
					objekt.name = "TPopKontrAnz2";
					objekt.formular = formular;
					window.apf.speichern(objekt);
				}
				if (feldname === "TPopKontrZaehleinheit3") {
					// UI aktualisieren
					if (window.apf.tpopfeldkontr.TPopKontrMethode3) {
						$("#TPopKontrMethode3" + window.apf.tpopfeldkontr.TPopKontrMethode3).prop("checked", false);
					}
					$("#TPopKontrAnz3").val("");
					// Datenbank aktualisieren
					// Feld TPopKontrMethode3
					objekt = {};
					objekt.name = "TPopKontrMethode3";
					objekt.formular = formular;
					window.apf.speichern(objekt);
					// Feld TPopKontrAnz3
					objekt = {};
					objekt.name = "TPopKontrAnz3";
					objekt.formular = formular;
					window.apf.speichern(objekt);
				}
			}
		});
		updateFormular.fail(function() {
			//window.apf.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
			console.log('Fehler: Die letzte Änderung wurde nicht gespeichert');
		});
		// nodes im Tree updaten, wenn deren Bezeichnung ändert
		switch(feldname) {
			case "PopNr":
			case "PopName":
				var popbeschriftung;
				if ($PopName.val() && $PopNr.val()) {
					popbeschriftung = $PopNr.val() + ": " + $PopName.val();
				} else if ($PopName.val()) {
					popbeschriftung = "(keine Nr): " + $PopName.val();
				} else if ($PopNr.val()) {
					popbeschriftung = $PopNr.val() + ": (kein Name)";
				} else {
					popbeschriftung = "(keine Nr, kein Name)";
				}
				$tree.jstree("rename_node", "[typ='ap_ordner_pop'] #" + localStorage.pop_id, popbeschriftung);
				break;
			case "PopBerJahr":
			case "PopBerEntwicklung":
				var popberbeschriftung;
				if ($PopBerJahr.val() && $spanPopBerEntwicklungPlus$PopBerEntwicklungChecked.text()) {
					popberbeschriftung = $PopBerJahr.val() + ": " + $spanPopBerEntwicklungPlus$PopBerEntwicklungChecked.text();
				} else if ($PopBerJahr.val()) {
					popberbeschriftung = $PopBerJahr.val() + ": (kein Status)";
				} else if ($spanPopBerEntwicklungPlus$PopBerEntwicklungChecked.text()) {
					popberbeschriftung = "(kein Jahr): " + $spanPopBerEntwicklungPlus$PopBerEntwicklungChecked.text();
				} else {
					popberbeschriftung = "(kein Jahr): (kein Status)";
				}
				$tree.jstree("rename_node", "[typ='pop_ordner_popber'] #" + localStorage.popber_id, popberbeschriftung);
				break;
			case "PopMassnBerJahr":
			case "PopMassnBerErfolgsbeurteilung":
				var popmassnberbeschriftung;
				if ($PopMassnBerJahr.val() && $spanPopMassnBerErfolgsbeurteilungPlusPopMassnBerErfolgsbeurteilungChecked.text()) {
					popmassnberbeschriftung = $PopMassnBerJahr.val() + ": " + $spanPopMassnBerErfolgsbeurteilungPlusPopMassnBerErfolgsbeurteilungChecked.text();
				} else if ($PopMassnBerJahr.val()) {
					popmassnberbeschriftung = $PopMassnBerJahr.val() + ": (nicht beurteilt)";
				} else if ($spanPopMassnBerErfolgsbeurteilungPlusPopMassnBerErfolgsbeurteilungChecked.text()) {
					popmassnberbeschriftung = "(kein Jahr): " + $spanPopMassnBerErfolgsbeurteilungPlusPopMassnBerErfolgsbeurteilungChecked.text();
				} else {
					popmassnberbeschriftung = "(kein Jahr): (nicht beurteilt)";
				}
				$tree.jstree("rename_node", "[typ='pop_ordner_massnber'] #" + localStorage.popmassnber_id, popmassnberbeschriftung);
				break;
			case "TPopNr":
			case "TPopFlurname":
				var tpopbeschriftung;
				if ($TPopNr.val() && $TPopFlurname.val()) {
					tpopbeschriftung = $TPopNr.val() + ": " + $TPopFlurname.val();
				} else if ($TPopFlurname.val()) {
					tpopbeschriftung = "(keine Nr): " + $TPopFlurname.val();
				} else if ($TPopNr.val()) {
					tpopbeschriftung = $TPopNr.val() + ": (kein Flurname)";
				} else {
					tpopbeschriftung = "(keine Nr, kein Flurname)";
				}
				$tree.jstree("rename_node", "[typ='pop_ordner_tpop'] #" + localStorage.tpop_id, tpopbeschriftung);
				break;
			case "TPopKontrTyp":
			case "TPopKontrJahr":
				// wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
				var tpopkontrjahr = "(kein Jahr)",
					tpopfeldkontr_label,
					$TPopKontrJahr = $("#TPopKontrJahr").val();
				if ($TPopKontrJahr) {
					tpopkontrjahr = $TPopKontrJahr;
				}
				// Problem: Es ist nicht bekannt, ob eine Freiwilligenkontrolle umbennant wird oder eine Feldkontrolle
				// Lösung: Beide nodes umbenennen. Nur eine davon hat die richtige id
				$tree.jstree("rename_node", "[typ='tpop_ordner_freiwkontr'] #" + localStorage.tpopfeldkontr_id, tpopkontrjahr);
				tpopfeldkontr_label = window.apf.erstelleLabelFürFeldkontrolle($TPopKontrJahr, $("#spanTPopKontrTyp" + $('input[name="TPopKontrTyp"]:checked').val()).text());
				$tree.jstree("rename_node", "[typ='tpop_ordner_feldkontr'] #" + localStorage.tpopfeldkontr_id, tpopfeldkontr_label);
				break;
			case "TPopBerJahr":
			case "TPopBerEntwicklung":
				// wenn kein Jahr/Entwicklung gewählt: "(kein Jahr/Entwicklung)"
				var tpopberjahr, tpopberentwicklung;
				if ($TPopBerJahr.val()) {
					tpopberjahr = $TPopBerJahr.val();
				} else {
					tpopberjahr = "(kein Jahr)";
				}
				if ($spanTPopBerEntwicklungPlusTPopBerEntwicklungChecked.text()) {
					tpopberentwicklung = $spanTPopBerEntwicklungPlusTPopBerEntwicklungChecked.text();
				} else {
					tpopberentwicklung = "(keine Beurteilung)";
				}
				$tree.jstree("rename_node", "[typ='tpop_ordner_tpopber'] #" + localStorage.tpopber_id, tpopberjahr + ": " + tpopberentwicklung);
				break;
			case "TPopMassnJahr":
			case "TPopMassnTyp":
				// wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
				var tpopmassnbezeichnung;
				if ($TPopMassnJahr.val() && $TPopMassnTypChecked.text()) {
					tpopmassnbezeichnung = $TPopMassnJahr.val() + ": " + $TPopMassnTypChecked.text();
				} else if ($TPopMassnJahr.val()) {
					tpopmassnbezeichnung = $TPopMassnJahr.val() + ": (kein Typ)";
				} else if ($TPopMassnTypChecked.text()) {
					tpopmassnbezeichnung = "(kein Jahr): " + $TPopMassnTypChecked.text();
				} else {
					tpopmassnbezeichnung = "(kein Jahr): (kein Typ)";
				}
				tpopmassnbezeichnung = window.apf.erstelleLabelFürMassnahme($TPopMassnJahr.val(), $TPopMassnTypChecked.text());
				$tree.jstree("rename_node", "[typ='tpop_ordner_massn'] #" + localStorage.tpopmassn_id, tpopmassnbezeichnung);
				break;
			case "TPopMassnBerJahr":
			case "TPopMassnBerErfolgsbeurteilung":
				// wenn kein Jahr/Beurteilung: "(kein Jahr/Beurteilung)"
				var tpopmassberbeschriftung;
				if ($TPopMassnBerJahr.val() && $spanTPopMassnBerErfolgsbeurteilungPlusTPopMassnBerErfolgsbeurteilungChecked.text()) {
					tpopmassberbeschriftung = $TPopMassnBerJahr.val() + ": " + $spanTPopMassnBerErfolgsbeurteilungPlusTPopMassnBerErfolgsbeurteilungChecked.text();
				} else if ($TPopMassnBerJahr.val()) {
					tpopmassberbeschriftung = $TPopMassnBerJahr.val() + ": (keine Beurteilung)";
				} else if ($spanTPopMassnBerErfolgsbeurteilungPlusTPopMassnBerErfolgsbeurteilungChecked.text()) {
					tpopmassberbeschriftung = "(kein Jahr): " + $spanTPopMassnBerErfolgsbeurteilungPlusTPopMassnBerErfolgsbeurteilungChecked.text();
				} else {
					tpopmassberbeschriftung = "(kein Jahr): (keine Beurteilung)";
				}
				$tree.jstree("rename_node", "[typ='tpop_ordner_massnber'] #" + localStorage.tpopmassnber_id, tpopmassberbeschriftung);
				break;
			case "ZielBezeichnung":
				var zielbeschriftung;
				if (feldwert) {
					zielbeschriftung = feldwert;
				} else {
					zielbeschriftung = "(Ziel nicht beschrieben)";
				}
				$tree.jstree("rename_node", "[typ='apzieljahr'] #" + localStorage.apziel_id, zielbeschriftung);
				break;
			case "ZielBerJahr":
			case "ZielBerErreichung":
				var zielberbeschriftung;
				if ($ZielBerJahr.val() && $ZielBerErreichung.val()) {
					zielberbeschriftung = $ZielBerJahr.val() + ": " + $ZielBerErreichung.val();
				} else if ($ZielBerJahr.val()) {
					zielberbeschriftung = $ZielBerJahr.val() + ": (keine Beurteilung)";
				} else if ($ZielBerErreichung.val()) {
					zielberbeschriftung = "(kein Jahr): " + $ZielBerErreichung.val();
				} else {
					zielberbeschriftung = "(kein Jahr): (keine Beurteilung)";
				}
				$tree.jstree("rename_node", "[typ='zielber_ordner'] #" + localStorage.zielber_id, zielberbeschriftung);
				break;
			case "ErfkritErreichungsgrad":
			case "ErfkritTxt":
				var erfkritbeschriftung;
				if ($SpanErfkritErreichungsgradPlusErfkritErreichungsgradChecked.text() && $("#ErfkritTxt").val()) {
					erfkritbeschriftung = $SpanErfkritErreichungsgradPlusErfkritErreichungsgradChecked.text() + ": " + $("#ErfkritTxt").val();
				} else if ($SpanErfkritErreichungsgradPlusErfkritErreichungsgradChecked.text()) {
					erfkritbeschriftung = $SpanErfkritErreichungsgradPlusErfkritErreichungsgradChecked.text() + ": (kein Kriterium)";
				} else if ($("#ErfkritTxt").val()) {
					erfkritbeschriftung = "(keine Beurteilung): " + $("#ErfkritTxt").val();
				} else {
					erfkritbeschriftung = "(keine Beurteilung): (kein Kriterium)";
				}
				$tree.jstree("rename_node", "[typ='ap_ordner_erfkrit'] #" + localStorage.erfkrit_id, erfkritbeschriftung);
				break;
			case "JBerJahr":
				var jberbeschriftung;
				if (feldwert) {
					jberbeschriftung = feldwert;
				} else {
					jberbeschriftung = "(kein Jahr)";
				}
				$tree.jstree("rename_node", "[typ='ap_ordner_jber'] #" + localStorage.jber_id, jberbeschriftung);
				break;
			case "BerTitel":
			case "BerJahr":
				var berbeschriftung;
				if ($BerJahr.val() && $BerTitel.val()) {
					berbeschriftung = $BerJahr.val() + ": " + $BerTitel.val();
				} else if ($BerJahr.val()) {
					berbeschriftung = $BerJahr.val() + ": (kein Titel)";
				} else if ($BerTitel.val()) {
					berbeschriftung = "(kein Jahr): " + $BerTitel.val();
				} else {
					berbeschriftung = "(kein Jahr): (kein Titel)";
				}
				$tree.jstree("rename_node", "[typ='ap_ordner_ber'] #" + localStorage.ber_id, berbeschriftung);
				break;
			case "AaSisfNr":
				var aabeschriftung;
				if (feldwert) {
					aabeschriftung = $("#AaSisfNr option[value='" + feldwert + "']").text();
				} else {
					aabeschriftung = "(kein Artname)";
				}
				$tree.jstree("rename_node", "[typ='ap_ordner_assozarten'] #" + localStorage.assozarten_id, aabeschriftung);
				break;
		}
	}
};

(function($) {
	// friendly helper //tinyurl.com/6aow6yn
	// Läuft durch alle Felder im Formular
	// Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
	// nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
	$.fn.serializeObject = function() {
		var o, a;
		o = {};
		a = this.serializeArray();
		$.each(a, function() {
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

// wandelt decimal degrees (vom GPS) in WGS84 um
window.apf.DdInWgs84BreiteGrad = function(Breite) {
	'use strict';
	var BreiteGrad = Math.floor(Breite);
	return BreiteGrad;
};

window.apf.DdInWgs84BreiteMin = function(Breite) {
	'use strict';
	var BreiteGrad = Math.floor(Breite),
		BreiteMin = Math.floor((Breite - BreiteGrad) * 60);
	return BreiteMin;
};

window.apf.DdInWgs84BreiteSec = function(Breite) {
	'use strict';
	var BreiteGrad = Math.floor(Breite),
		BreiteMin = Math.floor((Breite - BreiteGrad)*60),
		BreiteSec = Math.round((((Breite - BreiteGrad) - (BreiteMin / 60)) * 60 * 60) * 100) / 100;
	return BreiteSec;
};

window.apf.DdInWgs84LängeGrad = function(Länge) {
	'use strict';
	var LängeGrad = Math.floor(Länge);
	return LängeGrad;
};

window.apf.DdInWgs84LängeMin = function(Länge) {
	'use strict';
	var LängeGrad = Math.floor(Länge),
		LängeMin = Math.floor((Länge - LängeGrad) * 60);
	return LängeMin;
};

window.apf.DdInWgs84LängeSec = function(Länge) {
	'use strict';
	var LängeGrad = Math.floor(Länge),
		LängeMin = Math.floor((Länge - LängeGrad) * 60),
		LängeSec = Math.round((((Länge - LängeGrad) - (LängeMin / 60)) * 60 * 60) * 100) / 100;
	return LängeSec;
};

// Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
window.apf.Wgs84InChX = function(BreiteGrad, BreiteMin, BreiteSec, LängeGrad, LängeMin, LängeSec) {
	'use strict';
	var lat = BreiteSec + BreiteMin * 60 + BreiteGrad * 3600,
		lng = LängeSec + LängeMin * 60 + LängeGrad * 3600,
		// Auxiliary values (% Bern)
		lat_aux = (lat - 169028.66) / 10000,
		lng_aux = (lng - 26782.5) / 10000,
		x = 200147.07
		  + 308807.95 * lat_aux 
		  +   3745.25 * Math.pow(lng_aux, 2)
		  +	 76.63 * Math.pow(lat_aux, 2)
		  -	194.56 * Math.pow(lng_aux, 2) * lat_aux
		  +	119.79 * Math.pow(lat_aux, 3);
	return x;
};

// Wandelt WGS84 in CH-Landeskoordinaten um
window.apf.Wgs84InChY = function(BreiteGrad, BreiteMin, BreiteSec, LängeGrad, LängeMin, LängeSec) {
	'use strict';
	// Converts degrees dec to sex
	var lat = BreiteSec + BreiteMin * 60 + BreiteGrad * 3600,
		lng = LängeSec + LängeMin * 60 + LängeGrad * 3600,
		// Auxiliary values (% Bern)
		lat_aux = (lat - 169028.66) / 10000,
		lng_aux = (lng - 26782.5) / 10000,
		// Process Y
		y = 600072.37 
		  + 211455.93 * lng_aux 
		  -  10938.51 * lng_aux * lat_aux
		  -	  0.36 * lng_aux * Math.pow(lat_aux, 2)
		  -	 44.54 * Math.pow(lng_aux, 3);
	return y;
};

// wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
window.apf.DdInChX = function(Breite, Länge) {
	'use strict';
	var BreiteGrad = window.apf.DdInWgs84BreiteGrad(Breite),
		BreiteMin = window.apf.DdInWgs84BreiteMin(Breite),
		BreiteSec = window.apf.DdInWgs84BreiteSec(Breite),
		LängeGrad = window.apf.DdInWgs84LängeGrad(Länge),
		LängeMin = window.apf.DdInWgs84LängeMin(Länge),
		LängeSec = window.apf.DdInWgs84LängeSec(Länge),
		x = Math.floor(window.apf.Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LängeGrad, LängeMin, LängeSec));
	return x;
};

window.apf.DdInChY = function(Breite, Länge) {
	'use strict';
	var BreiteGrad = window.apf.DdInWgs84BreiteGrad(Breite),
		BreiteMin = window.apf.DdInWgs84BreiteMin(Breite),
		BreiteSec = window.apf.DdInWgs84BreiteSec(Breite),
		LängeGrad = window.apf.DdInWgs84LängeGrad(Länge),
		LängeMin = window.apf.DdInWgs84LängeMin(Länge),
		LängeSec = window.apf.DdInWgs84LängeSec(Länge),
		y = Math.floor(window.apf.Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LängeGrad, LängeMin, LängeSec));
	return y;
};

// von CH-Landeskoord zu DecDeg

// Convert CH y/x to WGS lat
window.apf.CHtoWGSlat = function(y, x) {
	'use strict';
	// Converts militar to civil and to unit = 1000km
	// Auxiliary values (% Bern)
	var y_aux = (y - 600000) / 1000000,
		x_aux = (x - 200000) / 1000000,
		// Process lat
		lat = 16.9023892
			 +  3.238272 * x_aux
			 -  0.270978 * Math.pow(y_aux, 2)
			 -  0.002528 * Math.pow(x_aux, 2)
			 -  0.0447   * Math.pow(y_aux, 2) * x_aux
			 -  0.0140   * Math.pow(x_aux, 3);
	// Unit 10000" to 1 " and converts seconds to degrees (dec)
	lat = lat * 100 / 36;
	return lat;
};

// Convert CH y/x to WGS long
window.apf.CHtoWGSlng = function(y, x) {
	'use strict';
	// Converts militar to civil and to unit = 1000km
	// Auxiliary values (% Bern)
	var y_aux = (y - 600000) / 1000000,
		x_aux = (x - 200000) / 1000000,
		// Process long
		lng = 2.6779094
			+ 4.728982 * y_aux
			+ 0.791484 * y_aux * x_aux
			+ 0.1306   * y_aux * Math.pow(x_aux, 2)
			- 0.0436   * Math.pow(y_aux, 3);
	// Unit 10000" to 1 " and converts seconds to degrees (dec)
	lng = lng * 100 / 36;
	return lng;
};

window.apf.gmap.zeigeTPop = function(tpop_liste) {
	'use strict';
	var anz_tpop,
        infowindow,
        tpop_beschriftung,
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers,
        tpop_id,
        latlng2,
        marker,
        contentString,
        marker_options,
        marker_cluster,
        my_flurname;
	// vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	window.apf.zeigeFormular("google_karte");
	window.apf.gmap.markers_array = [];
	window.apf.gmap.info_window_array = [];
	infowindow = new google.maps.InfoWindow();
	// TPopListe bearbeiten:
	// Objekte löschen, die keine Koordinaten haben
	// Lat und Lng ergänzen
    _.each(tpop_liste.rows, function(tpop, index) {
        if (!tpop.TPopXKoord || !tpop.TPopYKoord) {
            // tpop einsetzen geht nicht, weil Chrome Fehler meldet
            delete tpop_liste.rows[index];
        } else {
            tpop.Lat = window.apf.CHtoWGSlat(parseInt(tpop.TPopXKoord), parseInt(tpop.TPopYKoord));
            tpop.Lng = window.apf.CHtoWGSlng(parseInt(tpop.TPopXKoord), parseInt(tpop.TPopYKoord));
        }
    });
	// TPop zählen
	anz_tpop = tpop_liste.rows.length;
	// Karte mal auf Zürich zentrieren, falls in den TPopListe.rows keine Koordinaten kommen
	// auf die die Karte ausgerichtet werden kann
	lat = 47.383333;
	lng = 8.533333;
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: 15,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("google_karten_div"), options);
	window.apf.gmap.map = map;
	bounds = new google.maps.LatLngBounds();
	// für alle TPop Marker erstellen
	markers = [];
    _.each(tpop_liste.rows, function(tpop) {
        tpop_id = tpop.TPopId;
        tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
        latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng);
        if (anz_tpop === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine TPop Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        marker = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: tpop_beschriftung,
            labelContent: tpop_beschriftung,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon.png"
        });
        markers.push(marker);
        my_flurname = tpop.TPopFlurname || '(kein Flurname)';
        contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + tpop.Artname + '</h3>'+
            '<p>Population: ' + tpop.PopName + '</p>'+
            '<p>TPop: ' + my_flurname + '</p>'+
            '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular anstelle Karte öffnen<\/a></p>"+
            '<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')\">Formular neben der Karte öffnen<\/a></p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListener(map, marker, contentString);
    });
	marker_options = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m8.png",
				width: 53
			}]
	};
	// globale Variable verwenden, damit ein Klick auf die Checkbox die Ebene einblenden kann
	window.apf.google_karte_detailpläne = new google.maps.KmlLayer({
	    //url: '//www.apflora.ch/kml/rueteren.kmz',
        url: 'kml/rueteren.kmz',
	    preserveViewport: true
	});
	window.apf.google_karte_detailpläne.setMap(null);
	marker_cluster = new MarkerClusterer(map, markers, marker_options);
	if (anz_tpop === 1) {
		// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		// Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(contentString);
			infowindow.open(map, marker);
		});
	}
};

window.apf.olmap.getLayerNames = function() {
	var layer_objekt_array = window.apf.olmap.map.getLayers().getArray(),
		layers = _.map(layer_objekt_array, function(layer_objekt) {
			if (layer_objekt.values_ && layer_objekt.values_.title) {
	 			return layer_objekt.values_.title;
			}
		});
	return layers;
};

window.apf.olmap.getLayersWithTitle = function() {
	var layers_array = window.apf.olmap.map.getLayers().getArray(),
		layers = _.map(layers_array, function(layer) {
			if (layer.get('title')) {
	 			return layer;
			}
		});
	return layers || [];
};

window.apf.olmap.entferneLayerNachName = function(name) {
	var layers_array = window.apf.olmap.getLayersWithTitle(),
		layername,
		layer_kategorie;
	_.each(layers_array, function(layer) {
		layername = layer.get('title');
		layer_kategorie = layer.get('kategorie');
		if (layername === name) {
			window.apf.olmap.map.removeLayer(layer);
			if (layer_kategorie === 'Eigene Ebenen') {
				// ebene aus localStorage entfernen
				console.log('entferneLayerNachName meldet: lasse entfernen layer mit title ' + layername);
				window.apf.olmap.aktualisiereEbeneInLocalStorage(layer, true);
			}
		}
	});
};

window.apf.olmap.entferneAlleApfloraLayer = function() {
	'use strict';
	if (window.apf.olmap && window.apf.olmap.map) {
		// getLayers retourniert ein Objekt!!!
		// um die eigentlichen Layers zu erhalten, muss man .getLayers().getArray() aufrufen!!!
		var layers_array = window.apf.olmap.map.getLayers().getArray(),
			kategorie,
			title,
			zu_löschende_layer = [];
		// zuerst nur einen Array mit den zu löschenden Layern erstellen
		// wenn man sofort löscht, wird nur der erste entfernt!
		_.each(layers_array, function(layer) {
			kategorie = layer.get('kategorie');
			title = layer.get('title');
			if (kategorie && kategorie === 'AP Flora' && title !== 'Detailpläne') {
				zu_löschende_layer.push(layer);
			}
		});
		_.each(zu_löschende_layer, function(layer) {
			window.apf.olmap.map.removeLayer(layer);
		});
		window.apf.olmap.initiiereLayertree();
	}
};

window.apf.aktualisiereKoordinatenVonTPop = function(tpop) {
    var koord_aktualisiert = $.Deferred();
    // Datensatz updaten
    var updateTPop = $.ajax({
        type: 'post',
        url: 'php/tpop_update.php',
        dataType: 'json',
        data: {
            "id": tpop.TPopId,
            "Feld": "TPopXKoord",
            "Wert": tpop.TPopXKoord,
            "user": sessionStorage.User
        }
    });
    updateTPop.always(function() {
        var updateTPop_2 = $.ajax({
            type: 'post',
            url: 'php/tpop_update.php',
            dataType: 'json',
            data: {
                "id": tpop.TPopId,
                "Feld": "TPopYKoord",
                "Wert": tpop.TPopYKoord,
                "user": sessionStorage.User
            }
        });
        updateTPop_2.always(function() {
            koord_aktualisiert.resolve();
        });
    });
    return koord_aktualisiert.promise();
};

window.apf.olmap.stapleLayerZuoberst = function(layer_title) {
    var layers = window.apf.olmap.map.getLayers(),
        layers_array = window.apf.olmap.map.getLayers().getArray(),
        top_layer;
    _.each(layers_array, function(layer, index) {
        if (layer.get('title') === layer_title) {
            top_layer = layers.removeAt(index);
            layers.insertAt(layers_array.length, top_layer);
        }
    });
    window.apf.olmap.initiiereLayertree();
};

window.apf.verorteTPopAufOlmap = function(tpop) {
	'use strict';
	var bounds,
        x_max,
        x_min,
        y_max,
        y_min;

    // tpop hat keine PopNr
    // Infos von Pop müssen ergänzt werden, weil sie als Label angezeigt werden
    tpop.PopNr = window.apf.pop.PopNr;
    tpop.PopName = window.apf.pop.PopName;
    tpop.Artname = window.apf.ap.Artname;

	//$.when(window.apf.zeigeFormular("GeoAdminKarte"))
	$.when(window.apf.zeigeTPopAufOlmap())
		.then(function() {
            window.apf.olmap.deactivateMenuItems();

             // modify-layer erstellen
             window.apf.olmap.modify_source = new ol.source.Vector();
             var modify_layer = new ol.layer.Vector({
                 title: 'verortende Teilpopulation',
                 kategorie: 'AP Flora',
                 source: window.apf.olmap.modify_source,
                 style: function(feature, resolution) {
                    return window.apf.olmap.tpopStyle(feature, resolution, false, true);
                 }
             });
            window.apf.olmap.map.addLayer(modify_layer);

            if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
                // bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
                x_max = parseInt(tpop.TPopXKoord) + 200;
                x_min = parseInt(tpop.TPopXKoord) - 200;
                y_max = parseInt(tpop.TPopYKoord) + 200;
                y_min = parseInt(tpop.TPopYKoord) - 200;
                bounds = [x_min, y_min, x_max, y_max];
                // wenn schon eine Koordinate existiert:
                // tpop als feature zum modify hinzufügen
                var new_feature = new ol.Feature(new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]));
                window.apf.olmap.modify_source.addFeature(new_feature);
                // modify-handler erstellen
                window.apf.olmap.erstelleModifyInteractionFürTPop();
                // Karte zum richtigen Ausschnitt zoomen
                window.apf.olmap.map.updateSize();
                window.apf.olmap.map.getView().fitExtent(bounds, window.apf.olmap.map.getSize());
                // verzögern, sonst funktioniert es nicht
                setTimeout(function() {
                    window.apf.olmap.stapleLayerZuoberst('verortende Teilpopulation');
                }, 200);
            } else {
                // wenn keine Koordinate existiert:
                window.apf.olmap.draw_interaction = new ol.interaction.Draw({
                	source: window.apf.olmap.modify_source,
                    type: /** @type {ol.geom.GeometryType} */ ('Point')
                });
            	window.apf.olmap.map.addInteraction(window.apf.olmap.draw_interaction);
            	
                window.apf.olmap.draw_interaction.once('drawend', function(event) {
        			var coordinates = event.feature.getGeometry().getCoordinates();
                    // Koordinaten in tpop ergänzen
                    tpop.TPopXKoord  = parseInt(coordinates[0]);
                    tpop.TPopYKoord = parseInt(coordinates[1]);
                    $.when(window.apf.aktualisiereKoordinatenVonTPop(tpop))
                        .then(function() {
                            // marker in tpop_layer ergänzen
                            // tpop_layer holen
                            var layers = window.apf.olmap.map.getLayers().getArray(),
                                tpop_layer_nr = $('#olmap_layertree_Teilpopulationen').val(),
                                tpop_layer = layers[tpop_layer_nr],
                                tpop_layer_source = tpop_layer.getSource();
                            // marker ergänzen
                            tpop_layer_source.addFeature(window.apf.olmap.erstelleMarkerFürTPopLayer(tpop));
                            // selects entfernen - aus unerfindlichem Grund ist der neue Marker selektiert
                            window.apf.olmap.removeSelectFeaturesInSelectableLayers();
                        });
                    window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction);
                    // modify-interaction erstellen
                    window.apf.olmap.erstelleModifyInteractionFürTPop();
                }, this);
                // verzögern, sonst funktioniert es nicht
                setTimeout(function() {
                    window.apf.olmap.stapleLayerZuoberst('verortende Teilpopulation');
                }, 200);
            }
		});
};

window.apf.olmap.entferneModifyInteractionFürTpop = function() {
    'use strict';
    if (window.apf.olmap.modify_interaction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modify_interaction);
        delete window.apf.olmap.modify_interaction;
    }
};

window.apf.olmap.erstelleModifyInteractionFürTPop = function() {
    'use strict';
    // allfällige bestehende Interaction entfernen
    window.apf.olmap.entferneModifyInteractionFürTpop();
    // feature-overlay erstellen
    window.apf.olmap.modify_overlay = new ol.FeatureOverlay({
        style: function(feature, resolution) {
            return window.apf.olmap.tpopStyle(feature, resolution, false, true);
        }
    });
    // neues oder gewähltes feature hinzufügen
    window.apf.olmap.modify_overlay.addFeature(window.apf.olmap.modify_source.getFeatures()[0]);
    // modify-interaction erstellen
    window.apf.olmap.modify_interaction = new ol.interaction.Modify({
        features: window.apf.olmap.modify_overlay.getFeatures()
    });
    // zählt, wieviele male .on('change') ausgelöst wurde
    window.apf.olmap.modify_interaction.zähler = 0;
    // interaction.Modify meldet nicht, wenn etwas verändert wurde
    // daher muss registriert werden, wann das feature geändert wird
    window.apf.olmap.modify_overlay.getFeatures().getArray()[0].on('change', function() {
        // funktioniert zwar, wird aber beim Verschieben Dutzende bis hunderte Male ausgelöst
        var zähler,
            coordinates = this.getGeometry().getCoordinates(),
            feature = this;
        window.apf.olmap.modify_interaction.zähler++;
        // speichert, wieviele male .on('change') ausgelöst wurde, bis setTimout aufgerufen wurde
        zähler = window.apf.olmap.modify_interaction.zähler;
        setTimeout(function() {
            if (zähler === window.apf.olmap.modify_interaction.zähler) {
                // in den letzten 200 Millisekunden hat sich nichts geändert > speichern
                // Koordinaten in tpop ergänzen
                window.apf.tpop.TPopXKoord  = parseInt(coordinates[0]);
                window.apf.tpop.TPopYKoord = parseInt(coordinates[1]);
                $.when(window.apf.aktualisiereKoordinatenVonTPop(window.apf.tpop))
                    .then(function() {
                        // marker in tpop_layer ergänzen
                        // tpop_layer neu zeichnen
                        var layers = window.apf.olmap.map.getLayers().getArray(),
                            tpop_layer_nr = $('#olmap_layertree_Teilpopulationen').val(),
                            tpop_layer = layers[tpop_layer_nr],
                            tpop_layer_source = tpop_layer.getSource(),
                            tpop_layer_features = tpop_layer_source.getFeatures(),
                            aktuelles_feature = _.find(tpop_layer_features, function(feature) {
                                return feature.get('myId') === window.apf.tpop.TPopId;
                            });
                        aktuelles_feature.getGeometry().setCoordinates(coordinates);
                        // abhängige Eigenschaften aktualisieren
                        aktuelles_feature.set('xkoord', window.apf.tpop.TPopXKoord);
                        aktuelles_feature.set('ykoord', window.apf.tpop.TPopYKoord);
                        aktuelles_feature.set('popup_content', window.apf.olmap.erstelleContentFürTPop(window.apf.tpop));
                    });
            }
        }, 200);
    });
    /*
    // change scheint nicht zu passieren. Probiert: change, pointerdrag, click, drawend
    window.apf.olmap.modify_interaction.on('move', function(event) {
        console.log('jetzt die Koordinaten aktualisieren');

    });*/
    window.apf.olmap.map.addInteraction(window.apf.olmap.modify_interaction);
};

// input_div: div des Layers, das jetzt aktiviert wird
window.apf.olmap.entferneModifyInteractionFürVectorLayer = function(input_div) {
    'use strict';
    var $modify_layer = $('.modify_layer');
    input_div = input_div || null;
    if (window.apf.olmap.modify_interaction_für_vectorlayer) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modify_interaction_für_vectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.select_interaction_für_vectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
        delete window.apf.olmap.modify_interaction_für_vectorlayer;
        delete window.apf.olmap.select_interaction_für_vectorlayer;
        delete window.apf.olmap.draw_interaction_für_vectorlayer;
    }
    // alle buttons im layer-tool zurückstellen
    $modify_layer
        .button({
            icons: {primary: 'ui-icon-locked'},
            text: false
        })
        .button('refresh');
    // tooltip zurücksetzen
    $('.modify_layer_label')
    	.attr('title', 'Ebene bearbeiten')
    	.tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            content: 'Ebene bearbeiten'
        });
    // geom_select ausblenden
    $('.modify_layer_geom_type').hide();
    // übrige Layer deaktivieren
    $modify_layer.each(function() {
    	// sicherstellen, dass der jetzt zu aktivierende Layer nicht deaktiviert wird
    	if ($(this).prop('checked') && !$(this).is(input_div)) {
    		$(this).prop("checked", false).change();
    	}
    })
};

window.apf.olmap.erstelleModifyInteractionFürVectorLayer = function(vectorlayer) {
    'use strict';

    var defaultStyle = {
        'Point': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,0,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#ff0',
                    width: 1
                })
            })
        })],
        'LineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#f00',
                width: 3
            })
        })],
        'Polygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,255,255,0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#0ff',
                width: 1
            })
        })],
        'MultiPoint': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,255,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#f0f',
                    width: 1
                })
            })
        })],
        'MultiLineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0f0',
                width: 3
            })
        })],
        'MultiPolygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,255,0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#00f',
                width: 1
            })
        })]
    };

    if (vectorlayer === 'neuer_layer') {
        vectorlayer = new ol.layer.Vector({
        	guid: window.apf.erstelleGuid(),
            source: new ol.source.Vector(),
            title: 'neue Ebene',
            kategorie: 'Eigene Ebenen',
            style: function(feature, resolution) {
                return defaultStyle[feature.getGeometry().getType()];
            }
        });
        window.apf.olmap.map.addLayer(vectorlayer);
        // umbenennen, dann ModifyInteraction erstellen
        window.apf.olmap.frageNameFürEbene(vectorlayer);
        return;
    }

    var layer_title = vectorlayer.get('title'),
        $geom_type_select = $('#modify_layer_geom_type_' + layer_title.replace(" ", "_"));

    // darin werden die ids von selectierten features gespeichert
    window.apf.olmap.modified_features = [];

    // allfällige bestehende Interaction entfernen
    window.apf.olmap.entferneModifyInteractionFürVectorLayer();

    // select interaction erstellen
    window.apf.olmap.select_interaction_für_vectorlayer = new ol.interaction.Select({
        layers: function(layer) {
        	// selectable sind nur features aus dem gewählten layer
            return layer.get('title') === layer_title;
        }
    });

    // selected features sollen modifiziert werden können
    window.apf.olmap.selected_features = window.apf.olmap.select_interaction_für_vectorlayer.getFeatures();

    window.apf.olmap.selected_features.on('add', function(event) {
        // now listen if the feature is changed
        var feature = event.element,
            feature_id = feature.getId();
        // wenn jemand eine eigene Ebene ergänzt hat, kann es sein, dass die features keine id's haben
        // also wenn nötig ergänzen
        if (!feature_id) {
            feature.setId(_.uniqueId());
        }
        feature.on('change', function(event) {
            var feature = event.target,
                feature_id = feature.getId();
            window.apf.olmap.modified_features = window.apf.olmap.modified_features || [];
            // id in modified_features ergänzen
            window.apf.olmap.modified_features = _.union(window.apf.olmap.modified_features, [feature_id]);
            // speichern
            window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
        });

        // listen to pressing of delete key, then delete selected features
        $(document).on('keyup', function(event) {
            if (event.keyCode == 46) {
                // alle gewählten features aus select_interaction und source entfernen
                window.apf.olmap.selected_features.forEach(function(selected_feature) {
                    var selected_feature_id = selected_feature.getId();
                    window.apf.olmap.selected_features.remove(selected_feature);
                    // features aus vectorlayer_source entfernen
                    var vectorlayer_features = vectorlayer.getSource().getFeatures();
                    vectorlayer_features.forEach(function(source_feature) {
                        var source_feature_id = source_feature.getId();
                        if (source_feature_id === selected_feature_id) {
                            vectorlayer.getSource().removeFeature(source_feature);
			                // speichern
			                window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
                        }
                    });
                });
                $(document).off('keyup');
            }
        });

        // verhindern, dass Knoten im Strukturbaum entfernt werden
        $.jstree._reference("[typ='ap_ordner_pop']").deselect_all();
    });

    window.apf.olmap.selected_features.on('remove', function(event) {
        var feature = event.element,
            feature_id = feature.getId(),
            feature_index = window.apf.olmap.modified_features.indexOf(feature_id);
        if (feature_index > -1) {
            // speichern
            window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
            // erst wieder speichern, wenn neu verändert wurde
            window.apf.olmap.modified_features.splice(feature_index, 1);
        }
    });

    // global definieren: wird benötigt, um später (beim Klick auf 'Ebene bearbeiten') festzustellen, ob eine modify-interaction existiert
    window.apf.olmap.modify_interaction_für_vectorlayer = new ol.interaction.Modify({
        features: window.apf.olmap.select_interaction_für_vectorlayer.getFeatures(),
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });

    $geom_type_select.on('selectmenuchange', function(event) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
        addDrawInteraction();
    });

    function addDrawInteraction() {
        if ($geom_type_select.val() !== 'leerwert') {
            window.apf.olmap.draw_interaction_für_vectorlayer = new ol.interaction.Draw({
                source: vectorlayer.getSource(),
                type: /** @type {ol.geom.GeometryType} */ ($geom_type_select.val())
            });
            window.apf.olmap.map.addInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
            // bei 'drawend' würde man Änderungen in die DB schreiben
            window.apf.olmap.draw_interaction_für_vectorlayer.on('drawend', function(event) {
                var id = _.uniqueId();
                event.feature.setId(id);
                window.apf.olmap.modified_features = window.apf.olmap.modified_features || [];
                // id in modified_features ergänzen
                window.apf.olmap.modified_features = _.union(window.apf.olmap.modified_features, [id]);
                // speichern
                window.apf.olmap.aktualisiereEbeneInLocalStorage(vectorlayer);
            });
        }
    }

    addDrawInteraction();
    window.apf.olmap.map.addInteraction(window.apf.olmap.select_interaction_für_vectorlayer);
    window.apf.olmap.map.addInteraction(window.apf.olmap.modify_interaction_für_vectorlayer);
};

window.apf.olmap.exportiereLayer = function(layer, selected_value) {
	'use strict';
	var layer_name = layer.get('title') || 'Eigene_Ebene',
		allFeatures = layer.getSource().getFeatures(),
        format = new ol.format[selected_value](),
        data_parsed,
        data_stringified;
    layer_name += '.' + selected_value;
    try {
        data_parsed = format.writeFeatures(allFeatures);
    } catch (e) {
        window.apf.melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
        return;
    }
    if (selected_value === 'GeoJSON') {
    	try {
        	data_stringified = JSON.stringify(data_parsed, null, 4);
    	}
    	catch (e) {
    		window.apf.melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
    	}
    } else {
        var serializer = new XMLSerializer();
        try {
        	data_stringified = serializer.serializeToString(data_parsed);
    	}
    	catch (e) {
    		window.apf.melde('Sorry, das kann Open Layers 3 noch nicht richtig', 'Fehler beim Export');
    	}
    }
    window.apf.download(layer_name, data_stringified);
};

window.apf.download = function(filename, text) {
	'use strict';
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
};

window.apf.olmap.istLayerSichtbarNachName = function(layername) {
	'use strict';
	var layer_objekt_array,
		layer_ist_sichtbar;
	// prüfen, ob eine map existiert
	if (window.apf.olmap.map) {
		layer_objekt_array = window.apf.olmap.map.getLayers().getArray();
		layer_ist_sichtbar = _.find(layer_objekt_array, function(layer_objekt) {
			return layer_objekt.get('title') === layername && layer_objekt.get('visible');
		});
		if (layer_ist_sichtbar) {
			return true;
		}
	}
	return false;
};

window.apf.zeigeTPopAufOlmap = function(TPopListeMarkiert) {
	'use strict';
	// wenn layer "Populationen" sichtbar ist, sichtbar behalten
	var overlay_pop_visible = window.apf.olmap.istLayerSichtbarNachName("Populationen");
	// wenn layer "Populationen Namen" sichtbar ist, sichtbar behalten
	var overlay_popnr_visible = window.apf.olmap.istLayerSichtbarNachName("Populationen Nummern");
	
	var markierte_tpop = window.apf.olmap.wähleAusschnittFürÜbergebeneTPop(TPopListeMarkiert);

	// Grundkarte aufbauen
	$.when(window.apf.zeigeFormular("GeoAdminKarte"))
		.then(function() {
			// Karte zum richtigen Ausschnitt zoomen
            window.apf.olmap.map.updateSize();
            window.apf.olmap.map.getView().fitExtent(markierte_tpop.bounds, window.apf.olmap.map.getSize());
			// tpop und pop ergänzen
			// alle tpop holen
			var getTPopKarteAlle = $.ajax({
				type: 'get',
				url: 'php/tpop_karte_alle.php',
				dataType: 'json',
				data: {
					"ApArtId": window.apf.ap.ApArtId
				}
			});

			getTPopKarteAlle.always(function(tpop_liste) {
				$.when(
					// Layer für Symbole und Beschriftung erstellen
					window.apf.olmap.erstelleTPopLayer(tpop_liste, markierte_tpop.tpopid_markiert, true),
					// alle Pop holen
					window.apf.olmap.zeigePopInTPop(overlay_pop_visible, overlay_popnr_visible)
				)
				.then(function() {
					// layertree neu aufbauen
					window.apf.olmap.initiiereLayertree();
				});
			});

			getTPopKarteAlle.fail(function() {
				//window.apf.melde("Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden");
				console.log('Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden');
			});
	});
};

window.apf.zeigePopAufOlmap = function(PopListeMarkiert) {
	'use strict';
	// falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
	if (window.apf.olmap.LetzterKlickHandler) {
		window.apf.olmap.LetzterKlickHandler.deactivate();
	}
	
	var markierte_pop = window.apf.olmap.wähleAusschnittFürÜbergebenePop(PopListeMarkiert),
		extent;

	// Grundkarte aufbauen
	$.when(window.apf.zeigeFormular("GeoAdminKarte"))
		.then(function() {
			// Karte zum richtigen Ausschnitt zoomen
			// aber nur, wenn keine Auswahl aktiv
			if (window.apf.olmap.auswahlPolygonLayer && window.apf.olmap.auswahlPolygonLayer.features.length > 0) {
				// Auswahl aktiv, Zoomstufe belassen
			} else {
				window.apf.olmap.map.updateSize();
                window.apf.olmap.map.getView().fitExtent(markierte_pop.bounds, window.apf.olmap.map.getSize());
			}
			// tpop und pop ergänzen
			// alle tpop holen
			var getTPopKarteAlle_2 = $.ajax({
				type: 'get',
				url: 'php/tpop_karte_alle.php',
				dataType: 'json',
				data: {
					"ApArtId": window.apf.ap.ApArtId
				}
			});

			getTPopKarteAlle_2.always(function(TPopListe) {
				$.when(
					// Layer für Symbole und Beschriftung erstellen
                    window.apf.olmap.erstelleTPopLayer(TPopListe),
					// alle Pop holen, symbole und nr sichtbar schalten, Markierung übergeben
					window.apf.olmap.zeigePopInTPop(true, true, markierte_pop.popid_markiert)
				)
				.then(function() {
					// layertree neu aufbauen
					window.apf.olmap.initiiereLayertree();
				});
			});

			getTPopKarteAlle_2.fail(function() {
				//window.apf.melde("Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden");
				console.log('Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden');
			});
	});
};

// übernimmt eine Liste von (markierten) TPop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpop_id's der liste
window.apf.olmap.wähleAusschnittFürÜbergebeneTPop = function(tpop_liste_markiert) {
	'use strict';
	var bounds,
		xkoord_array = [],
		ykoord_array = [],
        x_max,
        y_max,
        x_min,
        y_min;

	// bounds der anzuzeigenden bestimmen
	var tpopid_markiert = [];
	if (tpop_liste_markiert && tpop_liste_markiert.rows && tpop_liste_markiert.rows.length > 0) {
        _.each(tpop_liste_markiert.rows, function(tpop) {
            tpopid_markiert.push(tpop.TPopId);
            xkoord_array.push(tpop.TPopXKoord);
	        ykoord_array.push(tpop.TPopYKoord);
        });
        // extent berechnen
	    // puffern, damit immer alles sichtbar ist
	    // underscore retourniert strings, also in Zahlen umwandeln
	    x_max = parseInt(_.max(xkoord_array)) + 70;
	    x_min = parseInt(_.min(xkoord_array)) - 70;
	    y_max = parseInt(_.max(ykoord_array)) + 70;
	    y_min = parseInt(_.min(ykoord_array)) - 70;
	    bounds = [x_min, y_min, x_max, y_max];
	} else {
		// keine tpop übergeben, Kanton anzeigen
        bounds = [669000, 222000, 717000, 284000];
	}
	return {bounds: bounds, tpopid_markiert: tpopid_markiert};
};

// übernimmt eine Liste von (markierten) Pop
// retourniert den Ausschnitt = bounds der angezeigt werden soll
// und einen array mit den tpop_id's der liste
window.apf.olmap.wähleAusschnittFürÜbergebenePop = function(pop_liste_markiert) {
	'use strict';
	var bounds,
		xkoord_array = [],
		ykoord_array = [],
        x_max,
        y_max,
        x_min,
        y_min,
        // bounds der anzuzeigenden bestimmen
		popid_markiert = [];
	if (pop_liste_markiert && pop_liste_markiert.rows.length > 0) {
        _.each(pop_liste_markiert.rows, function(pop) {
            popid_markiert.push(pop.PopId);
            xkoord_array.push(pop.PopXKoord);
	        ykoord_array.push(pop.PopYKoord);
        });
        // extent berechnen
	    // puffern, damit immer alles sichtbar ist
	    // underscore retourniert strings, also in Zahlen umwandeln
	    x_max = parseInt(_.max(xkoord_array)) + 70;
	    x_min = parseInt(_.min(xkoord_array)) - 70;
	    y_max = parseInt(_.max(ykoord_array)) + 70;
	    y_min = parseInt(_.min(ykoord_array)) - 70;
	    bounds = [x_min, y_min, x_max, y_max];
	} else {
		// keine tpop übergeben, Kanton anzeigen
        bounds = [669000, 222000, 717000, 284000];
	}
	return {bounds: bounds, popid_markiert: popid_markiert};
};

window.apf.olmap.zeigePopInTPop = function(overlay_pop_visible, overlay_popnr_visible, popid_markiert) {
	'use strict';
	var pop_gezeigt = $.Deferred(),
		getPopKarteAlle = $.ajax({
			type: 'get',
			url: 'php/pop_karte_alle.php',
			dataType: 'json',
			data: {
				"ApArtId": window.apf.ap.ApArtId
			}
		});
	getPopKarteAlle.always(function(PopListe) {
		// Layer für Symbole und Beschriftung erstellen
		$.when(
			window.apf.olmap.erstellePopLayer(PopListe, popid_markiert, overlay_pop_visible)
		)
		.then(function() {
			// layertree neu aufbauen
			window.apf.olmap.initiiereLayertree();
			pop_gezeigt.resolve();
		});
	});
	getPopKarteAlle.fail(function() {
		//window.apf.melde("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
		console.log('Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden');
		pop_gezeigt.resolve();
	});
	return pop_gezeigt.promise();
};

window.apf.olmap.erstelleTPopulation = function(TPop) {
	'use strict';
	// styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
			externalGraphic: '//www.apflora.ch/img/flora_icon_rot.png',
			graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
			title: '${tooltip}'
		}),
		selectStyle = new OpenLayers.Style({
			externalGraphic: '//www.apflora.ch/img/flora_icon_gelb.png'
		}),
		// overlay layer für Marker vorbereiten
		overlay_tpopulation = new OpenLayers.Layer.Vector('Teilpopulation', {
			styleMap: new OpenLayers.StyleMap({
				'default': defaultStyle,
				'select': defaultStyle
			})
		}),
		myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord),
		myTPopFlurname = TPop.TPopFlurname || '(kein Flurname)',
		// tooltip bzw. label vorbereiten: nullwerte ausblenden
		myTooltip;
	if (window.apf.pop.PopNr && TPop.TPopNr) {
		myTooltip = window.apf.pop.PopNr + '/' + TPop.TPopNr + ' ' + myTPopFlurname;
	} else if (window.apf.pop.PopNr) {
		myTooltip = window.apf.pop.PopNr + '/?' + ' ' + myTPopFlurname;
	} else if (TPop.TPopNr) {
		myTooltip = '?/' + TPop.TPopNr + ' ' + myTPopFlurname;
	} else {
		myTooltip = '?/?' + ' ' + myTPopFlurname;
	}

	// marker erstellen...
	// gewählte erhalten style gelb und zuoberst
	var marker = new OpenLayers.Feature.Vector(myLocation, {
		tooltip: myTooltip
	});

	// die marker der Ebene hinzufügen
	overlay_tpopulation.addFeatures(marker);

	// die marker sollen verschoben werden können
	var dragControl = new OpenLayers.Control.DragFeature(overlay_tpopulation, {
		onComplete: function(feature) {
			// x und y merken
			TPop.TPopXKoord = feature.geometry.x;
			TPop.TPopYKoord = feature.geometry.y;
			// Datensatz updaten
			window.apf.speichereWert('tpop', localStorage.tpop_id, 'TPopXKoord', TPop.TPopXKoord);
			window.apf.speichereWert('tpop', localStorage.tpop_id, 'TPopYKoord', TPop.TPopYKoord);
		}
	});
	window.apf.olmap.addControl(dragControl);
	dragControl.activate();

	// overlay zur Karte hinzufügen
	window.apf.olmap.addLayer(overlay_tpopulation);

	// control zur Karte hinzufügen
	window.selectControlTPop = new OpenLayers.Control.SelectFeature(overlay_tpopulation, {clickout: true});
	window.apf.olmap.addControl(window.selectControlTPop);
	window.selectControlTPop.activate();
};

// dieser Funktion kann man einen Wert zum speichern übergeben
window.apf.speichereWert = function(tabelle, id, feld, wert) {
	'use strict';
	var updateTabelle = $.ajax({
		type: 'post',
		url: 'php/' + tabelle + '_update.php',
		dataType: 'json',
		data: {
			"id": id,
			"Feld": feld,
			"Wert": wert,
			"user": sessionStorage.User
		}
	});
	updateTabelle.fail(function() {
		//window.apf.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
		console.log('Fehler: Die letzte Änderung wurde nicht gespeichert');
	});
};

window.apf.olmap.erstelleContentFürTPop = function(tpop) {
    'use strict';
    var my_flurname = tpop.TPopFlurname || '(kein Flurname)';
    return '<table>'+
        '<tr><td><p>Typ:</p></td><td><p>Teilpopulation</p></td></tr>'+
        '<tr><td><p>Population:</p></td><td><p>' + tpop.PopName + '</p></td></tr>'+
        '<tr><td><p>Teilpopulation:</p></td><td><p>' + my_flurname + '</p></td></tr>'+
        '<tr><td><p>Koordinaten:</p></td><td><p>' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p></td></tr>'+
        '</table>'+
        "<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular anstelle Karte öffnen<\/a></p>"+
        '<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')\">Formular neben der Karte öffnen<\/a></p>'+
        "<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>";
};

// retourniert features
// übergibt man einen Typ, werden nur features dieses Typs retourniert
window.apf.olmap.listSelectedFeatures = function(typ) {
    'use strict';
	var selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray(),
		features_to_return;
	features_to_return = _.filter(selected_features, function(feature) {
		if (typ) {
			return feature.get('myTyp') === typ;
		} else {
			return feature.get('myTyp');
		}
	});
	return features_to_return;
};

window.apf.olmap.erstelleListeDerAusgewähltenPopTPop = function(pop_selected, tpop_selected) {
	'use strict';
	// rückmelden, welche Objekte gewählt wurden
	var rückmeldung = "",
		pop_id,
        tpop_id;

    // globale Variabeln anlegen, damit die Exportfunktionen sie später nutzen können
    window.apf.olmap.pop_selected = pop_selected;
    window.apf.olmap.tpop_selected = tpop_selected;

	if (pop_selected.length > 0) {
        // pop nach nr sortieren
        pop_selected = _.sortBy(pop_selected, function(pop) {
            var pop_nr = pop.get('pop_nr');
            return parseInt(pop_nr);
        });
		if (tpop_selected.length > 0) {
			// tpop und pop betitteln
			rückmeldung += "<p class='ergebnisAuswahlListeTitel'>" + pop_selected.length + " Populationen: </p>";
		}
		rückmeldung += "<table>";
        _.each(pop_selected, function(pop) {
        	pop_id = pop.get('myId');
            rückmeldung += "<tr><td><a href=\"#\" onclick=\"window.apf.öffnePop('" + pop_id + "')\">";
            rückmeldung += pop.get('pop_nr') + ":<\/a></td><td><a href=\"#\" onclick=\"window.apf.öffnePop('" + pop_id + "')\">" + pop.get('pop_name') + "<\/a></td></tr>";
        });
		rückmeldung += "</table>";
	}
	if (tpop_selected.length > 0) {
        // tpop nach nr dann tpopnr sortieren
        tpop_selected = _.sortBy(tpop_selected, function(tpop) {
            var pop_nr = tpop.get('pop_nr') || 0,
                tpop_nr = tpop.get('tpop_nr') || 0,
                pop_tpop_nr = parseFloat(parseInt(pop_nr) + '.' + parseInt(tpop_nr));
            return pop_tpop_nr;
        });
		if (pop_selected.length > 0) {
			// tpop und pop betitteln
			rückmeldung += "<p class='ergebnisAuswahlListeTitel ergebnisAuswahlListeTitelTPop'>" + tpop_selected.length + " Teilpopulationen: </p>";
		}
		rückmeldung += "<table>";
        _.each(tpop_selected, function(tpop) {
            tpop_id = tpop.get('myId');
            rückmeldung += "<tr><td><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop_id + "')\">";
            rückmeldung += tpop.get('tpop_nr_label') + ":<\/a></td><td><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop_id + "')\">";
            rückmeldung += tpop.get('tpop_name') + "<\/a></td></tr>";
        });
		rückmeldung += "</table>";
	}
	// Höhe der Meldung begrenzen. Leider funktioniert maxHeight nicht
	var height = "auto";
	if (tpop_selected.length > 25) {
		height = 650;
	}

	// Listentitel erstellen
	var listentitel,
		exportieren = "Exportieren: ",
		exportierenPop = "<a href='#' class='export_pop'>Populationen</a>",
		exportierenTPop = "<a href='#' class='export_tpop'>Teilpopulationen</a>, <a href='#' class='export_kontr'>Kontrollen</a>, <a href='#' class='export_massn'>Massnahmen</a>";
	if (pop_selected.length > 0 && tpop_selected.length > 0) {
		listentitel = "Gewählt wurden " + pop_selected.length + " Populationen und " + tpop_selected.length + " Teilpopulationen";
		exportieren += exportierenPop + ", " + exportierenTPop;
	} else if (pop_selected.length > 0) {
		listentitel = "Gewählt wurden " + pop_selected.length + " Populationen:";
		exportieren += exportierenPop;
	} else if (tpop_selected.length > 0) {
		listentitel = "Gewählt wurden " + tpop_selected.length + " Teilpopulationen:";
		exportieren += exportierenTPop;
	} else {
		listentitel = "Keine Populationen/Teilpopulationen gewählt";
		exportieren = "";
	}
	$("#ergebnisAuswahlHeaderText").html(listentitel);
	$("#ergebnisAuswahlListe").html(rückmeldung);
	$("#ergebnisAuswahlFooter").html(exportieren);
	// Ergebnis-Div einblenden
	$("#ergebnisAuswahl").css("display", "block");
};

// sucht features an einem Ort in der Karte
window.apf.olmap.sucheFeatures = function(pixel) {
	var features = [];
	window.apf.olmap.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		features.push(feature);
	});
	return features;
};

window.apf.olmap.entfernePopupOverlays = function() {
	var overlays = window.apf.olmap.map.getOverlays().getArray(),
		zu_löschender_overlay = [];
	_.each(overlays, function(overlay) {
		if (overlay.get('typ') === 'popup') {
			zu_löschender_overlay.push(overlay);
		}
	});
	_.each(zu_löschender_overlay, function(overlay) {
		window.apf.olmap.map.removeOverlay(overlay);
	});
	// alle qtips entfernen
	$('.qtip').each(function() {
		$(this).qtip('destroy', true);
	});
};

window.apf.olmap.zeigeFeatureInfo = function(pixel, coordinate) {
	var features = window.apf.olmap.sucheFeatures(pixel),
		overlay,
		popup_id,
		popup_id_array = [],
		koordinaten,
		popup_title,
		popup_text = '',
		features_mit_typ;
	// es scheint auch weitere Features zu geben (z.B. wenn man genau auf die Koordinate einer Pop klickt)
	// nur die gewollten behalten
	features_mit_typ = _.filter(features, function(feature) {
		return feature.get('myTyp') ||  feature.get('popup_title');
	});
	if (features_mit_typ && features_mit_typ.length > 0) {
		// wenn mehrere features_mit_typ vorkommen: die Infos aller sammeln und anzeigen
		if (features_mit_typ.length > 1) {
			_.each(features_mit_typ, function(feature, index) {
				if (feature.get('myTyp') === 'Detailplan') {
					popup_text += '<h3>Objekt ID: ' + feature.get('OBJECTID') + '</h3>';
				    popup_text += '<table><tr><td><p>Typ:</p></td><td><p>Detailplan</p></td></tr>'+
		    			'<tr><td><p>Fläche:</p></td><td><p>' + parseInt(feature.get('SHAPE_Area') / 10) + '</p></td></tr>'+
		    			'<tr><td><p>Bemerkunge:</p></td><td><p>' + (feature.get('Bemerkunge') || "") + '</p></td></tr>'+
		    			'<tr><td><p>Bemerkun_1:</p></td><td><p>' + (feature.get('Bemerkun_1') || "") + '</p></td></tr></table>';
				} else {
					popup_text += '<h3>' + feature.get('popup_title') + '</h3>';
					popup_text += feature.get('popup_content');
				}
				if (index + 1 < features_mit_typ.length) {
					popup_text += '<hr>';
				}
			});
			popup_title = features_mit_typ.length + ' Treffer';
			// als Koordinaten den Ort des Klicks nehmen
			koordinaten = coordinate;
		} else {
			// es gibt nur einen feature
			if (features_mit_typ[0].get('myTyp') === 'Detailplan') {
			    popup_text = '<table><tr><td><p>Typ:</p></td><td><p>Detailplan</p></td></tr>'+
	    			'<tr><td><p>Fläche:</p></td><td><p>' + parseInt(features_mit_typ[0].get('SHAPE_Area') / 10) + '</p></td></tr>'+
	    			'<tr><td><p>Bemerkunge:</p></td><td><p>' + (features_mit_typ[0].get('Bemerkunge') || "") + '</p></td></tr>'+
	    			'<tr><td><p>Bemerkun_1:</p></td><td><p>' + (features_mit_typ[0].get('Bemerkun_1') || "") + '</p></td></tr></table>';
				popup_title = 'Objekt ID: ' + features_mit_typ[0].get('OBJECTID');
			} else {
				popup_text = features_mit_typ[0].get('popup_content');
				popup_title = features_mit_typ[0].get('popup_title');
			}
			// als Koordinaten die Koordinate des popups nehmen
			if (features_mit_typ[0].get('xkoord') && features_mit_typ[0].get('ykoord')) {
				koordinaten = [features_mit_typ[0].get('xkoord'), features_mit_typ[0].get('ykoord')];
			} else {
				koordinaten = coordinate;
			}
		}

		// zuerst mit gtip einen popup erzeugen
		$('.olmap_popup').each(function() {
			$(this).qtip({
				content: {
		            text: popup_text,
		            title: popup_title,
		            button: 'Close'
		        },
		        style: {
		            // Use the jQuery UI widget classes
		            widget: true,
		            // Remove the default styling
		            def: false,
		            classes: 'olmap_popup_styling',
			        tip: {
			        	width: 20,
			        	height: 20
			        }
		        },
		        position: {
		            my: 'top left',
		            at: 'bottom right',
		            target: $(this),
		            viewport: $('#GeoAdminKarte')
		        }
	        });
	        $(this).qtip('toggle', true);
		});

		// id des popups ermitteln
		$('.qtip').each(function() {
			popup_id_array.push($(this).attr('data-qtip-id'));
		});
		popup_id = _.max(popup_id_array);

		// die mit qtip erzeugte div dem overlay übergeben
		overlay = new ol.Overlay({
			element: $('#qtip-' + popup_id)
		});
		window.apf.olmap.map.addOverlay(overlay);
		overlay.setPosition(koordinaten);
		overlay.set('typ', 'popup');
	} else {
		// alle popups entfernen
		window.apf.olmap.entfernePopupOverlays();
	}
};

window.apf.olmap.erstelleContentFürPop = function(pop) {
    'use strict';
    return '<table>'+
        '<tr><td><p>Typ:</p></td><td><p>Population</p></td></tr>'+
        '<tr><td><p>Koordinaten:</p></td><td><p>' + pop.PopXKoord + ' / ' + pop.PopYKoord + '</p></td></tr>'+
        '</table>'+
        "<p><a href=\"#\" onclick=\"window.apf.öffnePop('" + pop.PopId + "')\">Formular anstelle Karte öffnen<\/a></p>"+
        '<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'pop\', ' + pop.PopId + ')\">Formular neben der Karte öffnen<\/a></p>'+
        "<p><a href=\"#\" onclick=\"window.apf.öffnePopInNeuemTab('" + pop.PopId + "')\">Formular in neuem Fenster öffnen<\/a></p>";
};

// übernimmt drei Variablen: popliste ist das Objekt mit den Populationen
// popid_markiert der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)
window.apf.olmap.erstellePopLayer = function(popliste, popid_markiert, visible) {
    'use strict';
    var pop_layer_erstellt = $.Deferred(),
        markers = [],
        marker,
        my_label,
        my_name,
        popup_content,
        pop_mit_nr_layer,
        selected_features;

    if (window.apf.olmap.map && window.apf.olmap.map.olmap_select_interaction && popid_markiert) {
    	selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else if (popid_markiert) {
    	window.apf.olmap.addSelectFeaturesInSelectableLayers();
    	selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    }

    if (visible === null) {
        visible = true;
    }

    _.each(popliste.rows, function(pop) {
        my_name = pop.PopName || '(kein Name)';
        popup_content = window.apf.olmap.erstelleContentFürPop(pop);

        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        if (pop.PopNr) {
            my_label = pop.PopNr.toString();
        } else {
            my_label = '?';
        }

        // marker erstellen...
        marker = new ol.Feature({
            geometry: new ol.geom.Point([pop.PopXKoord, pop.PopYKoord]),
            pop_nr: my_label,
            pop_name: my_name,
            name: my_label, // noch benötigt? TODO: entfernen
            popup_content: popup_content,
            popup_title: my_name,
            // Koordinaten werden gebraucht, damit das popup richtig platziert werden kann
            xkoord: pop.PopXKoord,
            ykoord: pop.PopYKoord,
            myTyp: 'pop',
            myId: pop.PopId
        });

        // marker in Array speichern
        markers.push(marker);

        // markierte in window.apf.olmap.map.olmap_select_interaction ergänzen
        if (popid_markiert && popid_markiert.indexOf(pop.PopId) !== -1) {
        	selected_features.push(marker);
        }
    });

    // layer für Marker erstellen
    pop_mit_nr_layer = new ol.layer.Vector({
        title: 'Populationen',
        selectable: true,
        source: new ol.source.Vector({
            features: markers
        }),
        style: function(feature, resolution) {
            return window.apf.olmap.popStyle(feature, resolution);
        }
    });
    pop_mit_nr_layer.set('visible', visible);
    pop_mit_nr_layer.set('kategorie', 'AP Flora');
    window.apf.olmap.map.addLayer(pop_mit_nr_layer);

    if (selected_features && selected_features.length > 0) {
	    setTimeout(function() {
	        window.apf.olmap.prüfeObPopTpopGewähltWurden();
	    }, 100);
	    // Schaltfläche olmap_auswaehlen aktivieren
	    $('#olmap_auswaehlen')
            .prop('checked', true)
            .button("refresh");
    }

    pop_layer_erstellt.resolve();
    return pop_layer_erstellt.promise();
};


// ermöglicht es, nach dem toolip zu sortieren
window.apf.vergleicheTPopZumSortierenNachTooltip = function(a,b) {
	'use strict';
	if (a.tooltip < b.tooltip)
		 return -1;
	if (a.tooltip > b.tooltip)
		return 1;
	return 0;
};

window.apf.deaktiviereGeoAdminAuswahl = function() {
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

window.apf.erstelleTPopNrLabel = function(popnr, tpopnr) {
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

window.apf.olmap.erstelleMarkerFürTPopLayer = function(tpop) {
	return new ol.Feature({
		geometry: new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]),
        tpop_nr: tpop.TPopNr,
        pop_nr: tpop.PopNr,
        tpop_nr_label: window.apf.erstelleTPopNrLabel(tpop.PopNr, tpop.TPopNr),
        tpop_name: tpop.TPopFlurname || '(kein Name)',
		name: window.apf.erstelleTPopNrLabel(tpop.PopNr, tpop.TPopNr),  // brauchts das noch? TODO: entfernen
        popup_content: window.apf.olmap.erstelleContentFürTPop(tpop),
        popup_title: tpop.Artname,
        // koordinaten werden benötigt damit das popup am richtigen Ort verankert wird
        xkoord: tpop.TPopXKoord,
        ykoord: tpop.TPopYKoord,
        myTyp: 'tpop',
        myId: tpop.TPopId
	});
};

// nimmt drei Variablen entgegen:
// tpop_liste: Die Liste der darzustellenden Teilpopulationen
// tpopid_markiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll
window.apf.olmap.erstelleTPopLayer = function(tpop_liste, tpopid_markiert, visible) {
	'use strict';

	var tpop_layer_erstellt = $.Deferred(),
		tpop_layer,
		markers = [],
		marker,
        selected_features;

    if (window.apf.olmap.map.olmap_select_interaction && tpopid_markiert) {
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else if (tpopid_markiert) {
        window.apf.olmap.addSelectFeaturesInSelectableLayers();
        selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    }

    if (visible === null) {
        visible = true;
    }

    _.each(tpop_liste.rows, function(tpop) {
        // marker erstellen...
        marker = window.apf.olmap.erstelleMarkerFürTPopLayer(tpop);

        // ...und in Array speichern
        markers.push(marker);

        // markierte in window.apf.olmap.map.olmap_select_interaction ergänzen
        if (tpopid_markiert && tpopid_markiert.indexOf(tpop.TPopId) !== -1) {
            selected_features.push(marker);
        }
    });

    // layer für Marker erstellen
	tpop_layer = new ol.layer.Vector({
		title: 'Teilpopulationen',
		source: new ol.source.Vector({
				features: markers
			}),
		style: function(feature, resolution) {
            return window.apf.olmap.tpopStyle(feature, resolution);
        }
	});
    tpop_layer.set('visible', visible);
    tpop_layer.set('kategorie', 'AP Flora');
    
    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(tpop_layer);

    if (selected_features && selected_features.length > 0) {
        setTimeout(function() {
            window.apf.olmap.prüfeObPopTpopGewähltWurden();
        }, 100);
        // Schaltfläche olmap_auswaehlen aktivieren
        $('#olmap_auswaehlen')
            .prop('checked', true)
            .button("refresh");
    }

	tpop_layer_erstellt.resolve();
	return tpop_layer_erstellt.promise();
};

window.apf.olmap.onFeatureSelect = function(feature) {
	'use strict';
	var popup = new OpenLayers.Popup.FramedCloud("popup",
			feature.geometry.getBounds().getCenterLonLat(),
			null,
			feature.attributes.message,
			null,
			false	// true zeigt Schliess-Schalftläche an. Schliessen zerstört aber event-listener > popup kann nur ein mal angezeigt werden!
		);
	popup.autoSize = true;
	popup.maxSize = new OpenLayers.Size(600,600);
	popup.fixedRelativePosition = true;
	feature.popup = popup;
	window.apf.gmap.addPopup(popup);
};

window.apf.olmap.onFeatureUnselect = function(feature) {
	'use strict';
	feature.popup.hide();
};

window.apf.gmap.zeigeBeobUndTPop = function(beob_liste, tpop_liste) {
	'use strict';
	window.tpop_liste = tpop_liste;
	var anz_beob,
        anz_tpop,
        infowindow_beob,
        infowindow_tpop,
        tpop,
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers_tpop,
        tpop_id,
        latlng2,
        marker_beob,
        marker_tpop,
        contentstring_beob,
        contentstring_tpop,
        marker_options_beob,
        marker_options_tpop,
        marker_cluster_beob,
        marker_cluster_tpop,
        datum,
        titel_beob,
        tpop_beschriftung,
        a_note,
        my_flurname;
	// vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	window.apf.zeigeFormular("google_karte");
	window.apf.gmap.markers_array = [];
	window.apf.gmap.info_window_array = [];
	infowindow_beob = new google.maps.InfoWindow();
	infowindow_tpop = new google.maps.InfoWindow();
	// Lat und Lng in BeobListe ergänzen
    _.each(beob_liste.rows, function(beob) {
        beob.Lat = window.apf.CHtoWGSlat(parseInt(beob.X), parseInt(beob.Y));
        beob.Lng = window.apf.CHtoWGSlng(parseInt(beob.X), parseInt(beob.Y));
    });
	// dito in TPopListe
    _.each(tpop_liste.rows, function(tpop, index) {
        if (!tpop.TPopXKoord || !tpop.TPopYKoord) {
            // tpop gibt in Chrome Fehler
            delete tpop_liste.rows[index];
        } else {
            tpop.Lat = window.apf.CHtoWGSlat(parseInt(tpop.TPopXKoord), parseInt(tpop.TPopYKoord));
            tpop.Lng = window.apf.CHtoWGSlng(parseInt(tpop.TPopXKoord), parseInt(tpop.TPopYKoord));
        }
    });
	// Beob zählen
	anz_beob = beob_liste.rows.length;
	// TPop zählen
	anz_tpop = tpop_liste.rows.length;
	// Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
	// auf die die Karte ausgerichtet werden kann
	lat = 47.383333;
	lng = 8.533333;
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: 15,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById("google_karten_div"), options);
	window.apf.gmap.map = map;
	bounds = new google.maps.LatLngBounds();

	// für alle TPop Marker erstellen
	markers_tpop = [];
    _.each(tpop_liste.rows, function(tpop) {
        tpop_id = tpop.TPopId;
        latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng);
        // Kartenausschnitt um diese Koordinate erweitern
        bounds.extend(latlng2);
        tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
        marker_tpop = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: tpop_beschriftung,
            labelContent: tpop_beschriftung,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon.png"
        });
        markers_tpop.push(marker_tpop);
        my_flurname = tpop.TPopFlurname || '(kein Flurname)';
        contentstring_tpop = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + tpop.Artname + '</h3>'+
            '<p>Population: ' + tpop.PopName + '</p>'+
            '<p>TPop: ' + my_flurname + '</p>'+
            '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular anstelle Karte öffnen<\/a></p>"+
            '<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')\">Formular neben der Karte öffnen<\/a></p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListener(map, marker_tpop, contentstring_tpop);
    });
	marker_options_tpop = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m8.png",
				width: 53
			}]
	};
	marker_cluster_tpop = new MarkerClusterer(map, markers_tpop, marker_options_tpop);
	
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, markerTPop, contentStringTPop) {
		google.maps.event.addListener(markerTPop, 'click', function() {
			infowindow_tpop.setContent(contentStringTPop);
			infowindow_tpop.open(map, markerTPop);
		});
	}

	// für alle Beob Marker erstellen
	window.markersBeob = [];
    _.each(beob_liste.rows, function(beob) {
        datum = beob.Datum;
        latlng2 = new google.maps.LatLng(beob.Lat, beob.Lng);
        if (anz_beob === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        // title muss String sein
        if (datum) {
            titel_beob = datum.toString();
        } else {
            titel_beob = "";
        }
        // A_NOTE muss String sein
        if (beob.A_NOTE) {
            a_note = beob.A_NOTE.toString();
        } else {
            a_note = "";
        }
        marker_beob = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: titel_beob,
            labelContent: a_note,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon_violett.png",
            draggable: true
        });
        window.markersBeob.push(marker_beob);
        makeListenerMarkerBeobDragend(marker_beob, beob);
        var Autor = beob.Autor || "(keiner)";
        var Projekt = beob.PROJET || "(keines)";
        var Ort = beob.DESC_LOCALITE || "(keiner)";
        contentstring_beob = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + datum + '</h3>'+
            '<p>Autor: ' + Autor + '</p>'+
            '<p>Projekt: ' + Projekt + '</p>'+
            '<p>Ort: ' + Ort + '</p>'+
            '<p>Koordinaten: ' + beob.X + ' / ' + beob.Y + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeob('" + beob.NO_NOTE + "')\">Formular anstelle Karte öffnen<\/a></p>"+
            //'<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'beob\', ' + beob.NO_NOTE + ')\">Formular neben der Karte öffnen<\/a></p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeobInNeuemTab('" + beob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListenerBeob(map, marker_beob, contentstring_beob);
    });
	// KEIN MARKERCLUSTERER: er verhindert das Entfernen einzelner Marker!
	// ausserdem macht er es schwierig, eng liegende Marker zuzuordnen
	
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListenerBeob(map, markerBeob, contentStringBeob) {
		google.maps.event.addListener(markerBeob, 'click', function() {
			infowindow_beob.setContent(contentStringBeob);
			infowindow_beob.open(map, markerBeob);
		});
	}

	function makeListenerMarkerBeobDragend(markerBeob, Beob) {
		google.maps.event.addListener(markerBeob, "dragend", function(event) {
			var lat, lng, X, Y, that;
			that = this;
			// Koordinaten berechnen
			lat = event.latLng.lat();
			lng = event.latLng.lng();
			X = window.apf.DdInChY(lat, lng);
			Y = window.apf.DdInChX(lat, lng);
			// nächstgelegene TPop aus DB holen
			var BeobNächsteTPop = $.ajax({
				type: 'get',
				url: 'php/beob_naechste_tpop.php',
				data: {
					"ApArtId": Beob.NO_ISFS,
					"X": X,
					"Y": Y
				},
				dataType: 'json'
			});
			BeobNächsteTPop.always(function(data) {
				var beobtxt;
				if (Beob.Autor) {
					beobtxt = "Beobachtung von " + Beob.Autor + " aus dem Jahr " + Beob.A_NOTE;
				} else {
					beobtxt = "Beobachtung ohne Autor aus dem Jahr " + Beob.A_NOTE;
				}
				// rückfragen
				$("#Meldung")
                    .html("Soll die " + beobtxt + "<br>der Teilpopulation '" + data[0].TPopFlurname + "' zugeordnet werden?")
                    .dialog({
					modal: true,
					title: "Zuordnung bestätigen",
					width: 600,
					buttons: {
						Ja: function() {
							$(this).dialog("close");
							// dem bind.move_node mitteilen, dass das Formular nicht initiiert werden soll
							localStorage.karte_fokussieren = true;
							// Beob der TPop zuweisen
							$("#tree").jstree("move_node", "#beob" + Beob.NO_NOTE, "#tpop_ordner_beob_zugeordnet" + data[0].TPopId, "first");
							// Den Marker der zugewiesenen Beobachtung entfernen
							that.setMap(null);
						},
						Nein: function() {
							$(this).dialog("close");
							// drag rückgängig machen
							lng = window.apf.CHtoWGSlng(Beob.X, Beob.Y);
							lat = window.apf.CHtoWGSlat(Beob.X, Beob.Y);
							var latlng3 = new google.maps.LatLng(lat, lng);
							that.setPosition(latlng3);
						}
					}
				});
			});
			BeobNächsteTPop.fail(function() {
				//window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
				console.log('Fehler: Die Beobachtung wurde nicht zugeordnet');
			});
		});
	}

	if (anz_tpop + anz_beob === 1) {
		// map.fitbounds setzt zu hohen zoom, wenn nur ein Punkt dargestellt wird > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		// Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
};

window.apf.gmap.zeigeBeob = function(beob_liste) {
	'use strict';
	var anz_beob,
        infowindow,
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers,
        latlng2,
        marker,
        contentString,
        marker_options,
        marker_cluster,
        datum,
        titel,
        a_note;
	// vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	window.apf.zeigeFormular("google_karte");
	window.apf.gmap.markers_array = [];
	window.apf.gmap.info_window_array = [];
	infowindow = new google.maps.InfoWindow();
	// Lat und Lng in BeobListe ergänzen
    _.each(beob_liste.rows, function(beob) {
        beob.Lat = window.apf.CHtoWGSlat(parseInt(beob.X), parseInt(beob.Y));
        beob.Lng = window.apf.CHtoWGSlng(parseInt(beob.X), parseInt(beob.Y));
    });
	// TPop zählen
	anz_beob = beob_liste.rows.length;
	// Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
	// auf die die Karte ausgerichtet werden kann
	lat = 47.383333;
	lng = 8.533333;
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: 15,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		mapTypeControlOptions: {
			mapTypeIds: [
			google.maps.MapTypeId.ROADMAP,
			google.maps.MapTypeId.TERRAIN,
			google.maps.MapTypeId.SATELLITE,
			google.maps.MapTypeId.HYBRID
			]
		}
	};
	map = new google.maps.Map(document.getElementById("google_karten_div"), options);
	window.apf.gmap.map = map;
	bounds = new google.maps.LatLngBounds();
	// für alle Orte Marker erstellen
	markers = [];
    _.each(beob_liste.rows, function(beob) {
        datum = beob.Datum;
        latlng2 = new google.maps.LatLng(beob.Lat, beob.Lng);
        if (anz_beob === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        // title muss String sein
        if (datum) {
            titel = datum.toString();
        } else {
            titel = "";
        }
        // A_NOTE muss String sein
        if (beob.A_NOTE) {
            a_note = beob.A_NOTE.toString();
        } else {
            a_note = "";
        }
        marker = new MarkerWithLabel({
            map: map,
            position: latlng2,
            title: titel,
            labelContent: a_note,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon_violett.png"
        });
        // dem Marker einen Typ und eine id geben
        // damit drag and drop möglich werden soll
        // marker.set("typ", "beob");
        // marker.set("id", Beob.BeobId);
        marker.metadata = {typ: "beob_nicht_beurteilt", id: beob.NO_NOTE};
        markers.push(marker);
        var Autor = beob.Autor || "(keiner)";
        var Projekt = beob.PROJET || "(keines)";
        var Ort = beob.DESC_LOCALITE || "(keiner)";
        contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + datum + '</h3>'+
            '<p>Autor: ' + Autor + '</p>'+
            '<p>Projekt: ' + Projekt + '</p>'+
            '<p>Ort: ' + Ort + '</p>'+
            '<p>Koordinaten: ' + beob.X + ' / ' + beob.Y + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeob('" + beob.NO_NOTE + "')\">Formular anstelle Karte öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeobInNeuemTab('" + beob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListener(map, marker, contentString);
    });
	marker_options = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m5.png",
				width: 53
			}]
	};
	marker_cluster = new MarkerClusterer(map, markers, marker_options);
	if (anz_beob === 1) {
		// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		// Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(contentString);
			infowindow.open(map, marker);
		});
	}
};

window.apf.gmap.zeigeTPopBeob = function(tpop_beob_liste) {
	'use strict';
	var anz_tpop_beob,
        infowindow,
        lat,
        lng,
        latlng,
        options,
        map,
        bounds,
        markers,
        latlng2,
        marker,
        contentString,
        marker_options,
        marker_cluster,
        datum,
        titel;
	// vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	window.apf.zeigeFormular("google_karte");
	window.apf.gmap.markers_array = [];
	window.apf.gmap.info_window_array = [];
	infowindow = new google.maps.InfoWindow();
	// TPopListe bearbeiten:
	// Objekte löschen, die keine Koordinaten haben
	// Lat und Lng ergänzen
    _.each(tpop_beob_liste.rows, function(tpop_beob) {
        tpop_beob.Lat = window.apf.CHtoWGSlat(parseInt(tpop_beob.X), parseInt(tpop_beob.Y));
        tpop_beob.Lng = window.apf.CHtoWGSlng(parseInt(tpop_beob.X), parseInt(tpop_beob.Y));
    });
	// TPop zählen
	anz_tpop_beob = tpop_beob_liste.rows.length;
	// Karte mal auf Zürich zentrieren, falls in den TPopBeobListe.rows keine Koordinaten kommen
	// auf die die Karte ausgerichtet werden kann
	lat = 47.383333;
	lng = 8.533333;
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: 15,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		mapTypeControlOptions: {
			mapTypeIds: [
			google.maps.MapTypeId.ROADMAP,
			google.maps.MapTypeId.TERRAIN,
			google.maps.MapTypeId.SATELLITE,
			google.maps.MapTypeId.HYBRID
			]
		}
	};
	map = new google.maps.Map(document.getElementById("google_karten_div"), options);
	window.apf.gmap.map = map;
	// Versuch: SVO einblenden
	//loadWMS(map, "//wms.zh.ch/FnsSVOZHWMS?");
	//loadWMS(map, "//www.gis.zh.ch/scripts/wmsfnssvo2.asp?");
	// Versuch: AV einblenden
	//loadWMS(map, "//wms.zh.ch/avwms?");
	bounds = new google.maps.LatLngBounds();
	// für alle Orte Marker erstellen
	markers = [];
    _.each(tpop_beob_liste.rows, function(tpop_beob) {
        datum = tpop_beob.Datum;
        latlng2 = new google.maps.LatLng(tpop_beob.Lat, tpop_beob.Lng);
        if (anz_tpop_beob === 1) {
            // map.fitbounds setzt zu hohen zoom, wenn nur eine TPopBeob Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        // title muss String sein
        if (datum) {
            titel = datum.toString();
        } else {
            titel = "";
        }
        marker = new MarkerWithLabel({
            map: map,
            position: latlng2,
            // title muss String sein
            title: titel,
            labelContent: titel,
            labelAnchor: new google.maps.Point(75, 0),
            labelClass: "MapLabel",
            icon: "img/flora_icon_violett.png"
        });
        markers.push(marker);
        var Autor = tpop_beob.Autor || "(keiner)";
        var Projekt = tpop_beob.PROJET || "(keines)";
        var Ort = tpop_beob.DESC_LOCALITE || "(keiner)";
        contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent" class="GmInfowindow">'+
            '<h3>' + datum + '</h3>'+
            '<p>Autor: ' + Autor + '</p>'+
            '<p>Projekt: ' + Projekt + '</p>'+
            '<p>Ort: ' + Ort + '</p>'+
            '<p>Koordinaten: ' + tpop_beob.X + ' / ' + tpop_beob.Y + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopBeob('" + tpop_beob.NO_NOTE + "')\">Formular anstelle Karte öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopBeobInNeuemTab('" + tpop_beob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListener(map, marker, contentString);
    });
	marker_options = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m5.png",
				width: 53
			}]
	};
	marker_cluster = new MarkerClusterer(map, markers, marker_options);
	if (anz_tpop_beob === 1) {
		// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		// Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(contentString);
			infowindow.open(map, marker);
		});
	}
};

window.apf.gmap.verorteTPop = function(tpop) {
	'use strict';
	var infowindow = new google.maps.InfoWindow(),
        lat,
        lng,
        latlng,
        zoom_level,
        options,
        map,
        map_canvas = $('#google_karten_div'),
        verorted,
        marker,
        content_string,
        tpop_beschriftung,
        my_flurname;
    window.apf.gmap.markers_array = [];

	// vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	window.apf.zeigeFormular("google_karte");

    // Optionen für die Anzeige
	if (tpop && tpop.TPopXKoord && tpop.TPopYKoord) {
		// Wenn Koordinaten vorhanden, Lat und Lng ergänzen
		lat = window.apf.CHtoWGSlat(parseInt(tpop.TPopXKoord), parseInt(tpop.TPopYKoord));
		lng = window.apf.CHtoWGSlng(parseInt(tpop.TPopXKoord), parseInt(tpop.TPopYKoord));
		zoom_level = 15;
		verorted = true;
	} else {
		// sonst auf Zürich zentrieren
		lat = 47.360566;
		lng = 8.542829;
		zoom_level = 12;
		verorted = false;
	}
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: zoom_level,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

    // Karte gründen
	map = new google.maps.Map(map_canvas[0], options);
	window.apf.gmap.map = map;

	if (verorted) {
        // marker erstellen
		tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
		marker = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: tpop_beschriftung,
			icon: "img/flora_icon_rot.png",
			draggable: true
		});
		// Marker in Array speichern, damit er gelöscht werden kann
		window.apf.gmap.markers_array.push(marker);

        // infowindow erstellen
		my_flurname = tpop.TPopFlurname || '(kein Flurname)';
		content_string = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + my_flurname + '</h3>'+
			'<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular anstelle Karte öffnen<\/a></p>"+
            '<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'tpop\', ' + tpop.TPopId + ')\">Formular neben der Karte öffnen<\/a></p>'+
			"<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		infowindow = new google.maps.InfoWindow({
			content: content_string
		});
		if (!window.apf.gmap.info_window_array) {
			window.apf.gmap.info_window_array = [];
		}
		window.apf.gmap.info_window_array.push(infowindow);

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
		});
		google.maps.event.addListener(marker, "dragend", function(event) {
			window.apf.gmap.SetLocationTPop(event.latLng, map, marker, tpop);
		});
	}

    // listener bei klick in Karte
    // entfernt bestehenden marker, erstellt neuen und aktualisiert Koordinaten
	google.maps.event.addListener(map, 'click', function(event) {
		window.apf.gmap.erstelleMarker(event.latLng, map, marker, tpop);
	});
};

window.apf.gmap.erstelleMarker = function(location, map, marker, tpop) {
	'use strict';
	var title;

	// title muss String sein
	if (tpop && tpop.TPopFlurname) {
		title = tpop.TPopFlurname;
	} else {
		title = "neue Teilpopulation";
	}
	// zuerst bisherigen Marker löschen
	window.apf.gmap.clearMarkers();
	var marker = new google.maps.Marker({
		position: location, 
		map: map,
		title: title,
		icon: "img/flora_icon_rot.png",
		draggable: true
	});
	// Marker in Array speichern, damit er gelöscht werden kann
	window.apf.gmap.markers_array.push(marker);
	google.maps.event.addListener(marker, "dragend", function(event) {
		window.apf.gmap.SetLocationTPop(event.latLng, map, marker, tpop);
	});
	window.apf.gmap.SetLocationTPop(location, map, marker);
};

window.apf.gmap.SetLocationTPop = function(LatLng, map, marker, TPop) {
	'use strict';
	var lat,
		lng,
		contentString,
		infowindow,
		Objekt,
		title,
		X,
		Y;
	// nur aktualisieren, wenn Schreibrechte bestehen
	if (!window.apf.prüfeSchreibvoraussetzungen()) {
		return;
	}
	if (TPop && TPop.TPopFlurname) {
		title = TPop.TPopFlurname;
	} else {
		title = "neue Teilpopulation";
	}
	lat = LatLng.lat();
	lng = LatLng.lng();
	X = window.apf.DdInChY(lat, lng);
	Y = window.apf.DdInChX(lat, lng);
	var updateTPop_3 = $.ajax({
		type: 'post',
		url: 'php/tpop_update.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpop_id,
			"Feld": "TPopXKoord",
			"Wert": X,
			"user": sessionStorage.User
		}
	});
	updateTPop_3.always(function() {
		var updateTPop_4 = $.ajax({
			type: 'post',
			url: 'php/tpop_update.php',
			dataType: 'json',
			data: {
				"id": localStorage.tpop_id,
				"Feld": "TPopYKoord",
				"Wert": Y,
				"user": sessionStorage.User
			}
		});
		updateTPop_4.always(function() {
			window.apf.gmap.clearInfoWindows();
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<div id="bodyContent" class="GmInfowindow">'+
				'<h3>' + title + '</h3>'+
				'<p>Koordinaten: ' + X + ' / ' + Y + '</p>'+
				"<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + localStorage.tpop_id + "')\">Formular anstelle Karte öffnen<\/a></p>"+
                '<p><a href="#" onclick=\"window.apf.öffneFormularAlsPopup(\'tpop\', ' + localStorage.tpop_id + ')\">Formular neben der Karte öffnen<\/a></p>'+
				"<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + localStorage.tpop_id + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
				'</div>'+
				'</div>';
			infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			if (!window.apf.gmap.info_window_array) {
				window.apf.gmap.info_window_array = [];
			}
			window.apf.gmap.info_window_array.push(infowindow);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, marker);
			});
		});
		updateTPop_4.fail(function() {
			//window.apf.melde("Fehler: Die Y-Koordinate wurde nicht übernommen (die X-Koordinate offenbar schon)");
			console.log('Fehler: Die Y-Koordinate wurde nicht übernommen (die X-Koordinate offenbar schon)');
		});
	});
	updateTPop_3.fail(function() {
		//window.apf.melde("Fehler: Die Koordinaten wurden nicht übernommen");
		console.log('Fehler: Die Koordinaten wurden nicht übernommen');
	});
};

// GoogleMap: alle Marker löschen
// benutzt wo in GoogleMaps Marker gesetzt und verschoben werden
window.apf.gmap.clearMarkers = function() {
	'use strict';
    _.each(window.apf.gmap.markers_array, function(marker) {
        marker.setMap(null);
    });
};

// GoogleMap: alle InfoWindows löschen
// benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
window.apf.gmap.clearInfoWindows = function() {
	'use strict';
    _.each(window.apf.gmap.info_window_array, function(info_window) {
        info_window.setMap(null);
    });
};

window.apf.öffneTPop = function(tpop_id) {
	'use strict';
	localStorage.tpop_id = tpop_id;
	$.jstree._reference("[typ='tpop']#" + tpop_id).deselect_all();
	$("#tree").jstree("select_node", "[typ='tpop']#" + tpop_id);
};

window.apf.öffneTPopInNeuemTab = function(tpop_id) {
	'use strict';
	window.open("index.html?ap="+localStorage.ap_id+"&pop=" + localStorage.pop_id+"&tpop="+tpop_id, "_blank");
};

window.apf.öffnePop = function(pop_id) {
	'use strict';
	localStorage.pop_id = pop_id;
	$.jstree._reference("[typ='pop']#" + pop_id).deselect_all();
	$("#tree").jstree("select_node", "[typ='pop']#" + pop_id);
};

window.apf.öffnePopInNeuemTab = function(pop_id) {
	'use strict';
	window.open("index.html?ap="+localStorage.ap_id+"&pop=" + pop_id, "_blank");
};

window.apf.öffneBeob = function(beob_id) {
	'use strict';
	localStorage.beob_id = beob_id;
	$.jstree._reference("[typ='beob_nicht_beurteilt']#beob" + beob_id).deselect_all();
	$("#tree").jstree("select_node", "[typ='beob_nicht_beurteilt']#beob" + beob_id);
};

window.apf.öffneBeobInNeuemTab = function(beob_id) {
	'use strict';
	window.open("index.html?ap="+localStorage.ap_id+"&beob_nicht_beurteilt=" + beob_id, "_blank");
};

window.apf.öffneTPopBeob = function(beob_id) {
	'use strict';
	localStorage.beob_id = beob_id;
	$.jstree._reference("[typ='beob_zugeordnet']#beob" + beob_id).deselect_all();
	$("#tree").jstree("select_node", "[typ='beob_zugeordnet']#beob" + beob_id);
};

window.apf.öffneTPopBeobInNeuemTab = function(beob_id) {
	'use strict';
	window.open("index.html?ap="+localStorage.ap_id+"&beob_nicht_beurteilt=" + beob_id, "_blank");
};





/* 
	Document   : wms.js
	Created on : Feb 16, 2011, 3:25:27 PM
	Author	 : "Gavin Jackson <Gavin.Jackson@csiro.au>"

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
	var MERCATOR_RANGE = 256;
	this.pixelOrigin_ = new google.maps.Point(
		MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
	this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
	this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
}

MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
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

MercatorProjection.prototype.fromDivPixelToLatLng = function(pixel, zoom) {
	var me = this,
		origin = me.pixelOrigin_,
		scale = Math.pow(2, zoom),
		lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_,
		latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_,
		lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
	return new google.maps.LatLng(lat, lng);
};

MercatorProjection.prototype.fromDivPixelToSphericalMercator = function(pixel, zoom) {
	var me = this,
		coord = me.fromDivPixelToLatLng(pixel, zoom),
		r = 6378137.0,
		x = r * degreesToRadians(coord.lng()),
		latRad = degreesToRadians(coord.lat()),
		y = (r / 2) * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad)));
	return new google.maps.Point(x,y);
};

function loadWMS(map, baseURL, customParams){
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
		getTileUrl: function(coord, zoom) {
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

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
	for ( var i=types.length; i; ) {
		$.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
	}
}

$.event.special.mousewheel = {
	setup: function() {
		if ( this.addEventListener ) {
			for ( var i=types.length; i; ) {
				this.addEventListener( types[--i], handler, false );
			}
		} else {
			this.onmousewheel = handler;
		}
	},
	
	teardown: function() {
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
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});


function handler(event) {
	var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
	event = $.event.fix(orgEvent);
	event.type = "mousewheel";
	
	// Old school scrollwheel delta
	if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
	if ( orgEvent.detail	 ) { delta = -orgEvent.detail/3; }
	
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

window.apf.öffneUri = function() {
	'use strict';
	var uri = new Uri($(location).attr('href')),
		anchor = uri.anchor() || null,
		ap_id = uri.getQueryParamValue('ap');
    window.apf.initiiere_idealbiotop = require('./modules/initiiereIdealbiotop');
	if (ap_id) {
		// globale Variablen setzen
		window.apf.setzeWindowAp(ap_id);
		// Dem Feld im Formular den Wert zuweisen
		$("#ap_waehlen").val(ap_id);
		if (uri.getQueryParamValue('tpop')) {
			// globale Variablen setzen
			window.apf.setzeWindowPop(uri.getQueryParamValue('pop'));
			window.apf.setzeWindowTpop(uri.getQueryParamValue('tpop'));
			var tpopfeldkontr_id = uri.getQueryParamValue('tpopfeldkontr');
			if (tpopfeldkontr_id) {
				// globale Variablen setzen
				window.apf.setzeWindowTpopfeldkontr(tpopfeldkontr_id);
				// markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopfeldkontr_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_tpopfeldkontr();
			} else if (uri.getQueryParamValue('tpopfreiwkontr')) {
				// globale Variablen setzen
				window.apf.setzeWindowTpopfeldkontr(uri.getQueryParamValue('tpopfreiwkontr'));
				// markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopfreiwkontr_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				localStorage.tpopfreiwkontr = true;
				window.apf.initiiere_tpopfeldkontr();
			} else if (uri.getQueryParamValue('tpopmassn')) {
				// globale Variablen setzen
				window.apf.setzeWindowTpopmassn(uri.getQueryParamValue('tpopmassn'));
				// markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopmassn_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_tpopmassn();
			} else if (uri.getQueryParamValue('tpopber')) {
				// globale Variablen setzen
				window.apf.setzeWindowTpopber(uri.getQueryParamValue('tpopber'));
				// markieren, dass nach dem loaded-event im Tree die tpopber angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopber_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiereTpopber();
			} else if (uri.getQueryParamValue('beob_zugeordnet')) {
				// markieren, dass nach dem loaded-event im Tree die beob_zugeordnet angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.beob_zugeordnet_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				/*ausgeschaltet - funktioniert nicht! vermutlich, weil tree.php und beob_distzutpop sich in quere kommen
				// herausfinden, ob beobtyp infospezies oder evab ist
				localStorage.beob_id = uri.getQueryParamValue('beob_zugeordnet');
				if (isNaN(uri.getQueryParamValue('beob_zugeordnet'))) {
					// evab
					localStorage.beobtyp = "evab";
					window.apf.initiiere_beob("evab", localStorage.beob_id, "zugeordnet");
				} else {
					localStorage.beobtyp = "infospezies";
					window.apf.initiiere_beob("infospezies", localStorage.beob_id, "zugeordnet");
				}*/
			} else if (uri.getQueryParamValue('tpopmassnber')) {
				// globale Variablen setzen
				window.apf.setzeWindowTpopmassnber(uri.getQueryParamValue('tpopmassnber'));
				// markieren, dass nach dem loaded-event im Tree die tpopmassnber angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopmassnber_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_tpopmassnber();
			} else {
				// muss tpop sein
				// markieren, dass nach dem loaded-event im Tree die TPop angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpop_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_tpop();
			}
		} else if (uri.getQueryParamValue('pop')) {
			// globale Variablen setzen
			window.apf.setzeWindowPop(uri.getQueryParamValue('pop'));
			if (uri.getQueryParamValue('popber')) {
				// globale Variablen setzen
				window.apf.setzeWindowPopber(uri.getQueryParamValue('popber'));
				// markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.popber_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_popber();
			} else if (uri.getQueryParamValue('popmassnber')) {
				// globale Variablen setzen
				window.apf.setzeWindowPopmassnber(uri.getQueryParamValue('popmassnber'));
				// markieren, dass nach dem loaded-event im Tree die popmassnber angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.popmassnber_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_popmassnber();
			} else {
				// muss pop sein
				// markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.pop_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				localStorage.pop_id = uri.getQueryParamValue('pop');
				window.apf.initiiere_pop();
			}
		} else if (uri.getQueryParamValue('apziel')) {
			// globale Variablen setzen
			window.apf.setzeWindowApziel(uri.getQueryParamValue('apziel'));
			if (uri.getQueryParamValue('zielber')) {
				// globale Variablen setzen
				window.apf.setzeWindowZielber(uri.getQueryParamValue('zielber'));
				// markieren, dass nach dem loaded-event im Tree die zielber angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.zielber_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_zielber();
			} else {
				// muss ein apziel sein
				// markieren, dass nach dem loaded-event im Tree die apziel angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.apziel_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				localStorage.apziel_id = uri.getQueryParamValue('apziel');
				window.apf.initiiere_apziel();
			}
		} else if (uri.getQueryParamValue('erfkrit')) {
			// globale Variablen setzen
			window.apf.setzeWindowErfkrit(uri.getQueryParamValue('erfkrit'));
			// markieren, dass nach dem loaded-event im Tree die erfkrit angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.erfkrit_zeigen = true;
		} else if (uri.getQueryParamValue('jber')) {
			// globale Variablen setzen
			window.apf.setzeWindowJber(uri.getQueryParamValue('jber'));
			// markieren, dass nach dem loaded-event im Tree die jber angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.jber_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_jber();
		} else if (uri.getQueryParamValue('jber_uebersicht')) {
			// globale Variablen setzen
			window.apf.setzeWindowJberUebersicht(uri.getQueryParamValue('jber_uebersicht'));
			// markieren, dass nach dem loaded-event im Tree die jber_uebersicht angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.jber_übersicht_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_jber_uebersicht();
		} else if (uri.getQueryParamValue('ber')) {
			// globale Variablen setzen
			window.apf.setzeWindowBer(uri.getQueryParamValue('ber'));
			// markieren, dass nach dem loaded-event im Tree die ber angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.ber_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_ber();
		} else if (uri.getQueryParamValue('idealbiotop')) {
			// globale Variablen setzen
			window.apf.setzeWindowIdealbiotop(uri.getQueryParamValue('idealbiotop'));
			// markieren, dass nach dem loaded-event im Tree die idealbiotop angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.idealbiotop_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_idealbiotop();
		} else if (uri.getQueryParamValue('assozarten')) {
			// globale Variablen setzen
			window.apf.setzeWindowAssozarten(uri.getQueryParamValue('assozarten'));
			// markieren, dass nach dem loaded-event im Tree die assozarten angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.assozarten_zeigen = true;
			// NICHT direkt initiieren, weil sonst die Artliste noch nicht existiert
		} else if (uri.getQueryParamValue('beob_nicht_beurteilt')) {
			// markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.beob_nicht_beurteilt_zeigen = true;
		} else if (uri.getQueryParamValue('beob_nicht_zuzuordnen')) {
			// markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.beob_nicht_zuzuordnen_zeigen = true;
		} else {
			// muss ap sein
			// markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.ap_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			localStorage.ap_id = ap_id;
			window.apf.initiiere_ap();
		}
		window.apf.erstelle_tree(ap_id);
		$("#ap_waehlen_label").hide();
	} else {
		var exporte = uri.getQueryParamValue('exporte');
		if (exporte) {
			window.apf.initiiere_exporte(anchor);
		}
	}
};

window.apf.getInternetExplorerVersion = function() {
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

window.apf.olmap.createLayersForOlmap = function() {
    'use strict';
    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    var bing_styles_object = {
            'Aerial': 'Bing Luftbild',
            'AerialWithLabels': 'Bing Luftbild beschriftet',
            'Road': 'Bing Strassenkarte'
        },
        bing_styles = _.keys(bing_styles_object),
        bing_layers = [];
    _.each(bing_styles, function(bing_style) {
        bing_layers.push(new ol.layer.Tile({
            title: bing_styles_object[bing_style],
            kategorie: 'Welt Hintergrund',
            visible: false,
            preload: Infinity,
            source: new ol.source.BingMaps({
                //projection: new ol.proj.EPSG21781(),
                //projection: projection,
                projection: 'EPSG:21781',
                key: 'AjGOtB_ygBplpxXtKiiHtm-GERjSg9TFEoCmuBI_Yz4VWy0unRGUDo9GOZHA46Pf',
                imagerySet: bing_style
            })
        }));
    });

    var ch_ortholuftbild_layer = ga.layer.create('ch.swisstopo.swissimage');
    ch_ortholuftbild_layer.set('title', 'Luftbild CH');
    ch_ortholuftbild_layer.set('visible', false);
    ch_ortholuftbild_layer.set('kategorie', 'Hintergrund');

    var ch_lk_grau_layer = ga.layer.create('ch.swisstopo.pixelkarte-grau');
    ch_lk_grau_layer.set('title', 'Landeskarten CH grau');
    ch_lk_grau_layer.set('visible', false);
    ch_lk_grau_layer.set('kategorie', 'Hintergrund');

    var ch_lk_farbe_layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    ch_lk_farbe_layer.set('title', 'Landeskarten CH farbig');
    ch_lk_farbe_layer.set('visible', true);
    ch_lk_farbe_layer.set('kategorie', 'Hintergrund');

    var ch_siegriedkarte_layer = ga.layer.create('ch.swisstopo.hiks-siegfried');
    ch_siegriedkarte_layer.set('title', 'Siegfriedkarte 1881');
    ch_siegriedkarte_layer.set('visible', false);
    ch_siegriedkarte_layer.set('kategorie', 'Hintergrund');

    var ch_gemeinden_layer = ga.layer.create('ch.swisstopo-vd.geometa-gemeinde');
    ch_gemeinden_layer.set('title', 'Gemeinden');
    ch_gemeinden_layer.set('visible', false);
    ch_gemeinden_layer.set('kategorie', 'CH Sachinformationen');

    var ch_kantone_layer = ga.layer.create('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill');
    ch_kantone_layer.set('title', 'Kantone');
    ch_kantone_layer.set('visible', false);
    ch_kantone_layer.set('crossOrigin', null);
    ch_kantone_layer.set('kategorie', 'CH Sachinformationen');

    var ch_parzellen_layer = ga.layer.create('ch.kantone.cadastralwebmap-farbe');
    ch_parzellen_layer.set('title', 'Parzellen');
    ch_parzellen_layer.set('visible', false);
    ch_kantone_layer.set('crossOrigin', null);
    ch_parzellen_layer.set('kategorie', 'CH Sachinformationen');

    var ch_am_layer = ga.layer.create('ch.bafu.bundesinventare-amphibien');
    ch_am_layer.set('title', 'Amphibien');
    ch_am_layer.set('visible', false);
    ch_am_layer.set('kategorie', 'CH Biotopinventare');

    var ch_am_wander_layer = ga.layer.create('ch.bafu.bundesinventare-amphibien_wanderobjekte');
    ch_am_wander_layer.set('title', 'Amphibien Wanderobjekte');
    ch_am_wander_layer.set('visible', false);
    ch_am_wander_layer.set('kategorie', 'CH Biotopinventare');

    var ch_auen_layer = ga.layer.create('ch.bafu.bundesinventare-auen');
    ch_auen_layer.set('title', 'Auen');
    ch_auen_layer.set('visible', false);
    ch_auen_layer.set('kategorie', 'CH Biotopinventare');

    var ch_fm_layer = ga.layer.create('ch.bafu.bundesinventare-flachmoore');
    ch_fm_layer.set('title', 'Flachmoore');
    ch_fm_layer.set('visible', false);
    ch_fm_layer.set('kategorie', 'CH Biotopinventare');

    var ch_hm_layer = ga.layer.create('ch.bafu.bundesinventare-hochmoore');
    ch_hm_layer.set('title', 'Hochchmoore');
    ch_hm_layer.set('visible', false);
    ch_hm_layer.set('kategorie', 'CH Biotopinventare');

    var ch_tww_layer = ga.layer.create('ch.bafu.bundesinventare-trockenwiesen_trockenweiden');
    ch_tww_layer.set('title', 'Trockenwiesen und -weiden');
    ch_tww_layer.set('visible', false);
    ch_tww_layer.set('kategorie', 'CH Biotopinventare');

    var ch_vogelreservate_layer = ga.layer.create('ch.bafu.bundesinventare-vogelreservate');
    ch_vogelreservate_layer.set('title', 'Vogelreservate');
    ch_vogelreservate_layer.set('visible', false);
    ch_vogelreservate_layer.set('kategorie', 'CH Biotopinventare');

    var detailpläne_layer_source = new ol.source.GeoJSON({
        url: 'geojson/detailplaene.geojson'/*,
         myTyp: 'Detailplan'*/	// funktioniert nicht
    });
    /* funktioniert nicht:
     detailpläne_layer_source.forEachFeature(function(feature) {
     feature.setValues('myTyp', 'Detailplan');
     });*/

    var detailpläne_layer = new ol.layer.Vector({
        title: 'Detailpläne',
        opacity: 1,
        visible: false,
        kategorie: 'AP Flora',
        selectable: true,
        source: detailpläne_layer_source,
        style: window.apf.olmap.detailplanStyle()
    });

    // ausgeschaltet, da es nicht funktioniert (authorization required)
    var zh_av_layer = new ol.layer.Tile({
        title: 'Amtliche Vermessung',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//agabriel:4zC6MgjM@wms.zh.ch/avwms',
            //url: '//wms.zh.ch/avwms',
            crossOrigin: null,
            params: {
                'layers': 'liegenschaften'
            }
        })
    });

    // OL3 hat noch Probleme und bereinigt die Methoden für WFS - zuwarten
    var zh_kartierungen_layer_source = new ol.source.ServerVector({
    	//format: new ol.format.GeoJSON(),	// holt nicht mal die Daten
    	format: new ol.format.WFS({	// holt die Daten - sollte aber bald die Attrribute nicht mehr benötigen
    		featureNS: '//maps.zh.ch',
    		featureType: 'polygon'
    	}),
    	//format: new ol.format.GML(),
    	loader: function(extent, resolution, projection) {
			$.ajax({
				type: GET,
				url: '//maps.zh.ch/wfs/FnsNSWFS',
				data: {
					SERVICE: 'WFS',
					VERSION: '1.0.0',
					REQUEST: 'GetFeature',
					TYPENAME: 'lrm_veg',
					SRSNAME: 'EPSG:21781',
					bbox: extent.join(',') + ',EPSG:21781'
				},
				dataType: 'jsonp',
				jsonpCallback: 'load_zh_kartierungen_layer_source'
			});
    	},
		strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
			maxZoom: 19
		})),
		projection: 'EPSG:21781'
    });

    var load_zh_kartierungen_layer_source = function(response) {
    	//console.log('response', response);
	  	zh_kartierungen_layer_source.addFeatures(zh_kartierungen_layer_source.readFeatures(response));	// funktioniert nicht!
	};

    var zh_kartierungen_layer = new ol.layer.Vector({
        title: 'Lebensraum-Kartierungen',
        opacity: 0.7,
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: zh_kartierungen_layer_source,
        style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 255, 1.0)',
				width: 2
			})
		})
    });

    var zh_svo_farbig_layer = new ol.layer.Tile({
        title: 'SVO farbig',
        opacity: 0.7,
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
        legende_url: 'http://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr'
            }
        })
    });

    var zh_svo_grau_layer = new ol.layer.Tile({
        title: 'SVO schwarz/weiss',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
        legende_url: 'http://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen-raster&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'zonen-schutzverordnungen-raster,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr',
                'singleTile': true
            }
        })
    });

    var zh_lichte_wälder_layer = new ol.layer.Tile({
        title: 'Wälder: lichte',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
        legende_url: 'http://wms.zh.ch/FnsLWZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=objekte-lichte-waelder-kanton-zuerich&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/FnsLWZH',
            crossOrigin: null,
            params: {
                'layers': 'objekte-lichte-waelder-kanton-zuerich',
                'singleTile': true
            }
        })
    });

    // nicht eingeschaltet, da ohne Legende wenig brauchbar
    var zh_waldkartierung_layer = new ol.layer.Tile({
        title: 'Wälder: Vegetation',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        legende: true,
        legende_url: 'http://wms.zh.ch/WaldVKWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=waldgesellschaften&format=image/png&STYLE=default',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/WaldVKWMS',
            crossOrigin: null,
            params: {
                'layers': 'waldgesellschaften',
                'singleTile': true
            }
        })
    });

    // nicht im Gebrauch
    var zh_gemeinden_layer = new ol.layer.Tile({
        title: 'Kanton',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/BASISKARTEZH',
            crossOrigin: null,
            params: {
                'layers': 'grenzen,gemeindegrenzen',
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    var zh_ortholuftbild_layer_1 = new ol.layer.Tile({
        title: 'Luftbild',
        visible: false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//agabriel:4zC6MgjM@wms.zh.ch/OrthoZHWMS',
            crossOrigin: null,
            params: {
                'layers': 'orthophotos',
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    var zh_ortholuftbild_layer = new ol.layer.Tile({
        title: 'Luftbild ZH',
        visible: false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/OrthoBackgroundZH',
            crossOrigin: null,
            params: {
                'layers': 'orthoaktuell',
                'singleTile': true
            }
        })
    });

    var zh_üp_layer = new ol.layer.Tile({
        title: 'Übersichtsplan ZH',
        visible: false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: 'http://wms.zh.ch/upwms',
            crossOrigin: null,
            params: {
                'layers': 'upwms',
                'singleTile': true
            }
        })
    });

    var zh_basiskarten_layer = new ol.layer.Tile({
        title: 'Landeskarten ZH',
        visible: false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/BASISKARTEZH',
            crossOrigin: null,
            params: {
                'layers': 'wald,seen,lk500,lk200,lk100,lk50,lk25,up8,up24',
                'singleTile': true
            }
        })
    });

    var zh_höhenmodell_layer = new ol.layer.Tile({
        title: 'Höhenmodell ZH',
        visible: false,
        kategorie: 'Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/DTMBackgroundZH',
            crossOrigin: null,
            params: {
                'layers': 'dtm',
                'singleTile': true
            }
        })
    });

    // Zunächst alle Layer definieren
    var layers_prov = [
    	zh_höhenmodell_layer,
        zh_ortholuftbild_layer,
        ch_ortholuftbild_layer,
        zh_basiskarten_layer,
        ch_lk_grau_layer,
        ch_lk_farbe_layer,
        ch_siegriedkarte_layer,
        ch_parzellen_layer,
        ch_gemeinden_layer,
        ch_am_layer,
        ch_am_wander_layer,
        ch_auen_layer,
        ch_fm_layer,
        ch_hm_layer,
        ch_tww_layer,
        ch_vogelreservate_layer,
        ch_kantone_layer,
        zh_üp_layer,
        zh_svo_farbig_layer,
        zh_svo_grau_layer,
        //zh_kartierungen_layer,	// warten, das OL3 mit WFS noch nicht funktioniert
        zh_lichte_wälder_layer,
        zh_waldkartierung_layer,
        detailpläne_layer
    ];

    // bing-layers vorne setzen
    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    //var layers = layers_prov.concat(bing_layers);
    var layers = layers_prov;

    // prüfen, ob in localStorage eigene Layer existieren
    // ausgeschaltet, weil die LayerObjekte von OL3 rekursiv sind und nicht für die localStorage stringified werden können
    if (localStorage.olmap_eigene_ebenen) {
        // drag and drop geo-files
        var defaultStyle = {
            'Point': [new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,255,0,0.5)'
                    }),
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: '#ff0',
                        width: 1
                    })
                })
            })],
            'LineString': [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#f00',
                    width: 3
                })
            })],
            'Polygon': [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0,255,255,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#0ff',
                    width: 1
                })
            })],
            'MultiPoint': [new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(255,0,255,0.5)'
                    }),
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: '#f0f',
                        width: 1
                    })
                })
            })],
            'MultiLineString': [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#0f0',
                    width: 3
                })
            })],
            'MultiPolygon': [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0,0,255,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#00f',
                    width: 1
                })
            })]
        };
        var styleFunction = function(feature, resolution) {
            var featureStyleFunction = feature.getStyleFunction();
            if (featureStyleFunction) {
                return featureStyleFunction.call(feature, resolution);
            } else {
                return defaultStyle[feature.getGeometry().getType()];
            }
        };
        // diese hinzufügen
        var eigene_ebenen = JSON.parse(localStorage.olmap_eigene_ebenen),
            eigene_ebenen_layers = [];
        _.each(eigene_ebenen, function(ebene) {
            var format = new ol.format.GeoJSON(),
                features = format.readFeatures(ebene);
            //window.eigene_ebenen.push(features);
            var vectorSource = new ol.source.Vector({
                features: features
            });
            var layer = new ol.layer.Vector({
                guid: ebene.guid,
                source: vectorSource,
                style: styleFunction,
                title: ebene.title,
                kategorie: ebene.kategorie
            });
            eigene_ebenen_layers.push(layer);
        });
        layers = layers.concat(eigene_ebenen_layers);
    }

    return layers;
};

// aktualisiert eine Kopie eigener Ebenen in localStorage
// remove: wenn vorhanden, wird die Ebene entfernt
// sonst wird die enthaltene Version durch die aktuelle ersetzt
// geschrieben wird GeoJSON. Grund: Die Layerobjekte sind rekursiv und können daher nicht stringified werden
window.apf.olmap.aktualisiereEbeneInLocalStorage = function(layer, remove) {
    'use strict';
    // mit der guid kontrollieren, ob die Ebene schon existiert
    var guid = layer.get('guid'),
        index_to_remove,
        eigene_ebenen = [];

    if (localStorage.olmap_eigene_ebenen) {
        eigene_ebenen = JSON.parse(localStorage.olmap_eigene_ebenen);
    }

    if (guid) {
    	// den layer entfernen
    	// wenn er nicht entfernt werden soll, wird er im nächsten Schritt mit den aktuellen Daten ersetzt
    	eigene_ebenen = _.reject(eigene_ebenen, function(ebene) {
    		return ebene.guid && ebene.guid === guid;
    	});
        // wenn die Ebene nicht entfernt werden sollte, mit den aktuellen Daten ergänzen
        if (!remove) {
            var format = new ol.format.GeoJSON(),
                data_parsed = format.writeFeatures(layer.getSource().getFeatures());
            // alle zugefügten Eigenschaften anfügen
            data_parsed.title = layer.get('title');
            data_parsed.guid = guid;
            data_parsed.kategorie = layer.get('kategorie');
            eigene_ebenen.push(data_parsed);
        }
        try {
        	// TODO: wenn rueteren.kml importiert wurde erscheint Fehler 'Converting circular structure to JSON'
            localStorage.olmap_eigene_ebenen = JSON.stringify(eigene_ebenen);
        }
        catch (e) {
            console.log('Ebene konnte nicht in localStorage gespeichert werden. Fehlermeldung: ' + e);
            $('#eigene_layer_meldung_' + layer.get('title').replace(" ", "_"))
            	.html('Ebene kann nicht im Cache des Browsers gespeichert werden')
            	.show();
        }
    }
};

window.apf.initiiereOlmap = function() {
	'use strict';
	// Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	//OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	//var zh_bbox_1903 = new ol.Extent(669000, 222000, 717000, 284000);

	// allfällige Apflora-Ebenen entfernen
	window.apf.olmap.entferneAlleApfloraLayer();
    // allfällige Modify-Interaktion entfernen
    window.apf.olmap.entferneModifyInteractionFürTpop();

	// Karte nur aufbauen, wenn dies nicht schon passiert ist
	if (!window.apf.olmap.map) {

        window.apf.olmap.map = new ga.Map({
            target: 'ga_karten_div',
            layers: window.apf.olmap.createLayersForOlmap(),
            view: new ol.View2D({
                resolution: 4,
                center: [693000, 253000]
            })
        });

        // diverse features und Fähigkeiten ergänzen
        window.apf.olmap.addDragAndDropGeofiles();
        window.apf.olmap.addShowFeatureInfoOnClick();
        window.apf.olmap.changeCursorOverFeature();
        window.apf.olmap.initiiereLayertree();
        window.apf.olmap.addMousePositionControl();
        window.apf.olmap.addFullScreenControl();

        window.apf.olmap.map.on('change:size', function() {
            // steuern, ob das Export-Tool sichtbar ist
            // wenn es bei hoher Pixelzahl sichtbar ist, gibt es Probleme
            window.apf.olmap.blendeOlmapExportieren();
        });
	}
};

// deaktiviert Messen und Auswählen
window.apf.olmap.deactivateMenuItems = function() {
    // messen deaktivieren
    window.apf.olmap.removeMeasureInteraction();
    // Auswählen deaktivieren
    window.apf.olmap.removeSelectFeaturesInSelectableLayers();
    // allfällige popups schliessen
    window.apf.olmap.entfernePopupOverlays();
    // allfällige tooltips von ga-karten verstecken
    $('div.ga-tooltip').hide();
    // allfällige modify-interaction entfernen
    window.apf.olmap.entferneModifyInteractionFürTpop();
};

window.apf.olmap.removeSelectFeaturesInSelectableLayers = function() {
    'use strict';
    if (window.apf.olmap.map.olmap_select_interaction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.map.olmap_select_interaction);
        delete window.apf.olmap.map.olmap_select_interaction;
        window.apf.olmap.removeDragBox();
        $("#ergebnisAuswahl").hide();
    }
};

window.apf.olmap.addSelectFeaturesInSelectableLayers = function() {
    'use strict';
    window.apf.olmap.map.olmap_select_interaction = new ol.interaction.Select({
        // TODO: 'layerFilter' will soon be deprecated > change to 'layers' when deprecated
        layerFilter: function(layer) {
            return layer.get('selectable') === true;
        },
        style: function(feature, resolution) {
            switch(feature.get('myTyp')) {
                case 'pop':
                	return window.apf.olmap.popStyle(feature, resolution, true);
                    break;
                case 'tpop':
                	return window.apf.olmap.tpopStyle(feature, resolution, true);
                    break;
                case 'Detailplan':
                    return window.apf.olmap.detailplanStyleSelected(feature, resolution);
                    break;
            }
        }
        /*,
         // wenn man das feature zum zweiten mal klickt, soll es nicht mehr selected sein
         toggleCondition: function(event) {
         return event === 'click';
         }*/
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.map.olmap_select_interaction);
    // man soll auch mit dragbox selecten können
    window.apf.olmap.addDragBoxForPopTpop();
};

window.apf.olmap.getSelectedFeatures = function() {
    if (window.apf.olmap.map.olmap_select_interaction) {
        return window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
    } else {
        return [];
    }
};

window.apf.olmap.getSelectedFeaturesOfType = function(type) {
    var features_array = window.apf.olmap.getSelectedFeatures(),
        return_array = [],
        feature_type;
    if (features_array.length === 0) {
        return [];
    }
    _.each(features_array, function(feature) {
        feature_type = feature.get('myTyp');
        if (feature_type === type) {
            return_array.push(feature);
        }
    });
    return return_array;
};

window.apf.olmap.removeDragBox = function() {
    'use strict';
    if (window.apf.olmap.drag_box_interaction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.drag_box_interaction);
        //window.apf.olmap.drag_box_interaction.off('boxend');
        delete window.apf.olmap.drag_box_interaction;
    }
};

window.apf.olmap.addDragBoxForPopTpop = function() {
    'use strict';
    window.apf.olmap.drag_box_interaction = new ol.interaction.DragBox({
        /* dragbox interaction is active only if alt key is pressed */
        condition: ol.events.condition.altKeyOnly,
        /* style the box */
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.1)'
            }),
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 1],
                width: 3
            })
        })
    });
    window.apf.olmap.drag_box_interaction.on('boxend', function(event) {
        var geometry = window.apf.olmap.drag_box_interaction.getGeometry(),
            extent = geometry.getExtent(),
            layers = window.apf.olmap.map.getLayers().getArray(),
            pop_layer_nr = $('#olmap_layertree_Populationen').val(),
            pop_layer = layers[pop_layer_nr],
            tpop_layer_nr = $('#olmap_layertree_Teilpopulationen').val(),
            tpop_layer = layers[tpop_layer_nr],
            pop_layer_source = pop_layer.getSource(),
            tpop_layer_source = tpop_layer.getSource(),
            selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
        if (pop_layer.get('visible') === true) {
            pop_layer_source.forEachFeatureInExtent(extent, function (feature) {
                selected_features.push(feature);
            });
        }
        if (tpop_layer.get('visible') === true) {
            tpop_layer_source.forEachFeatureInExtent(extent, function (feature) {
                selected_features.push(feature);
            });
        }
        setTimeout(function() {
            window.apf.olmap.prüfeObPopTpopGewähltWurden();
        }, 100);
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.drag_box_interaction);
};

window.apf.olmap.addShowFeatureInfoOnClick = function() {
    'use strict';
    window.apf.olmap.map.on('singleclick', function(event) {
        var pixel = event.pixel,
            coordinate = event.coordinate;
        // nur machen, wenn nicht selektiert wird
        if (!window.apf.olmap.map.olmap_select_interaction) {
            window.apf.olmap.zeigeFeatureInfo(pixel, coordinate);
        }
        // prüfen, ob pop / tpop gewählt wurden
        // verzögern, weil die neuste selection sonst nicht erfasst wird
        setTimeout(function() {
            window.apf.olmap.prüfeObPopTpopGewähltWurden();
        }, 100);
    });
};

window.apf.olmap.prüfeObPopTpopGewähltWurden = function() {
    var pop_selected = [],
        tpop_selected = [];
    // prüfen, ob pop / tpop gewählt wurden
    pop_selected = window.apf.olmap.getSelectedFeaturesOfType('pop');
    tpop_selected = window.apf.olmap.getSelectedFeaturesOfType('tpop');
    // wenn ja: anzeigen
    if (pop_selected.length > 0 || tpop_selected.length > 0) {
        window.apf.olmap.erstelleListeDerAusgewähltenPopTPop(pop_selected, tpop_selected);
    } else {
        $("#ergebnisAuswahl").hide();
    }
};

window.apf.olmap.changeCursorOverFeature = function() {
    'use strict';
    $(window.apf.olmap.map.getViewport()).on('mousemove', function(e) {
        var pixel = window.apf.olmap.map.getEventPixel(e.originalEvent),
            hit = window.apf.olmap.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                return true;
            });
        if (hit) {
            $('#ga_karten_div').css('cursor', 'pointer');
        } else {
            $('#ga_karten_div').css('cursor', '');
        }
    });
};

window.apf.olmap.addMousePositionControl = function() {
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

window.apf.olmap.addFullScreenControl = function() {
    'use strict';
    var myFullScreenControl = new ol.control.FullScreen();
    window.apf.olmap.map.addControl(myFullScreenControl);
    // auf Deutsch beschriften
    $('#ga_karten_div').find('.ol-full-screen').find('span[role="tooltip"]').html('Vollbild wechseln');
};

window.apf.olmap.addDragAndDropGeofiles = function() {
    'use strict';
    // drag and drop geo-files
    var drag_and_drop_defaultStyle = {
        'Point': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,0,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#ff0',
                    width: 1
                })
            })
        })],
        'LineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#f00',
                width: 3
            })
        })],
        'Polygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,255,255,0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#0ff',
                width: 1
            })
        })],
        'MultiPoint': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,255,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#f0f',
                    width: 1
                })
            })
        })],
        'MultiLineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0f0',
                width: 3
            })
        })],
        'MultiPolygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,255,0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#00f',
                width: 1
            })
        })]
    };
    var drag_and_drop_styleFunction = function(feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
            return featureStyleFunction.call(feature, resolution);
        } else {
            return drag_and_drop_defaultStyle[feature.getGeometry().getType()];
        }
    };
    var drag_and_drop_interaction = new ol.interaction.DragAndDrop({
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.IGC,
            ol.format.KML,
            ol.format.TopoJSON
        ]
    });

    window.apf.olmap.map.addInteraction(drag_and_drop_interaction);

    drag_and_drop_interaction.on('addfeatures', function(event) {
        var vectorSource = new ol.source.Vector({
            features: event.features
        });
        var drag_and_drop_layer = new ol.layer.Vector({
        	guid: window.apf.erstelleGuid(),
            source: vectorSource,
            style: drag_and_drop_styleFunction,
            title: 'eigene Ebene',
            kategorie: 'Eigene Ebenen'
        });
        window.apf.olmap.map.addLayer(drag_and_drop_layer);
        var view = window.apf.olmap.map.getView();
        view.fitExtent(vectorSource.getExtent(), /** @type {ol.Size} */ (window.apf.olmap.map.getSize()));
        // layertree aktualisieren
        window.apf.olmap.initiiereLayertree('Eigene Ebenen');
        window.apf.olmap.frageNameFürEbene(drag_and_drop_layer);
    });
};

window.apf.olmap.frageNameFürEbene = function(eigene_ebene) {
    'use strict';
    var name_erfragt = $.Deferred(),
    	$eigene_ebene_name = $('#eigene_ebene_name'),
        $eigene_ebene_name_container = $('#eigene_ebene_name_container');
    // eigene Ebene global speichern, damit der eventhandler darauf zugreifen kann
    window.apf.olmap.eigene_ebene = eigene_ebene;
    $eigene_ebene_name_container
        .dialog({
            title: 'Ebene taufen',
            modal: true,
            position: {
                my: 'center',
                at: 'center',
                of: $('#ga_karten_div')
            },
            buttons: [
                {
                    text: "speichern",
                    click: function() {
                        // umbenennen
                        window.apf.olmap.nenneEbeneUm(eigene_ebene, $eigene_ebene_name.val());
                        // Namen zurücksetzen
                        $eigene_ebene_name.val('');
                        $(this).dialog( "close" );
                        name_erfragt.resolve();
                    }
                },
                {
                    text: "abbrechen",
                    click: function() {
                        $(this).dialog( "close" );
                    }
                }
            ]
        })
        .dialog('open');
    $eigene_ebene_name.on('keyup', function(event) {
        if (event.which == 13 && window.apf.olmap.eigene_ebene) {
            // enter pressed
            // umbenennen
            window.apf.olmap.nenneEbeneUm(window.apf.olmap.eigene_ebene, event.target.value);
            // Namen zurücksetzen
            $eigene_ebene_name.val('');
            $('#eigene_ebene_name_container').dialog( "close" );
            $('#GeoAdminKarte').off('keyup', '#eigene_ebene_name');
            delete window.apf.olmap.eigene_ebene;
            name_erfragt.resolve();
        }
    });
    return name_erfragt.promise();
};

window.apf.olmap.nenneEbeneUm = function(layer, title) {
    'use strict';
    layer.set('title', title);
    window.apf.olmap.initiiereLayertree('Eigene Ebenen');
    // layer in localStorage speichern
    window.apf.olmap.aktualisiereEbeneInLocalStorage(layer);
};

// baut das html für den layertree auf
// Muster:
// <li><input type="checkbox" id="olmap_layertree_Ebene 1"><label for="olmap_layertree_Ebene 1">Ebene 1</label></li><hr>
// active_kategorie: der Bereich dieser Kategorie soll offen sein
window.apf.olmap.initiiereLayertree = function(active_kategorie) {
	'use strict';
    var layertitel,
        visible,
        kategorie,
        //html_welt_hintergrund = '<h3>Welt Hintergrund</h3><div>',
        html_ch_hintergrund = '<h3>Hintergrund</h3><div>',
        html_ch_sachinfos = '<h3>CH Sachinformationen</h3><div>',
        html_ch_biotopinv = '<h3>CH Biotopinventare</h3><div>',
        html_zh_sachinfos = '<h3>ZH Sachinformationen</h3><div>',
        html_apflora = '<h3>ZH AP Flora</h3><div>',
        html_prov,
        html,
        $olmap_layertree_layers = $('#olmap_layertree_layers'),
        $ga_karten_div_accordion = $("#ga_karten_div").find(".accordion"),
        layers = window.apf.olmap.map.getLayers().getArray(),
        html_eigene_layer_text,
        html_eigene_layer = '<hr>',
        eigene_layer_zähler = 0,
        initialize_modify_layer = false,
        active,
        export_layer_select_ids = [],
        legende,
        legende_url,
        initialize_legende = false;

    html_eigene_layer_text = '<h3>Eigene Ebenen</h3>';
    html_eigene_layer_text += '<div>';
    html_eigene_layer_text += '<p>Einfach eine der folgenden Dateitypen auf die Karte ziehen:</p>';
    html_eigene_layer_text += '<ul>';
    html_eigene_layer_text += '<li>GPX</li>';
    html_eigene_layer_text += '<li>GeoJSON</li>';
    html_eigene_layer_text += '<li>IGC</li>';
    html_eigene_layer_text += '<li>KML</li>';
    html_eigene_layer_text += '<li>TopoJSON</li>';
    html_eigene_layer_text += '</ul>';
    html_eigene_layer_text += '<div id="olmap_eigene_ebenen_beta_container">';
    html_eigene_layer_text += '<p style="font-size:10px; line-height:0.9em;">Open Layers 3 ist noch in der Beta-Phase.<br>Daher funktionieren eigene Layer nicht immer fehlerfrei.</p>';
    html_eigene_layer_text += '</div>';
    html_eigene_layer_text += '<div id="olmap_neues_layer_container">';
    html_eigene_layer_text += '<input type="checkbox" class="neues_layer" id="olmap_neues_layer">';
    html_eigene_layer_text += '<label for="olmap_neues_layer" class="neues_layer_label">neue Ebene erstellen</label>';
    html_eigene_layer_text += '</div>';

    // accordion zerstören, damit es neu aufgebaut werden kann
    // um es zu zerstören muss es initiiert sein!
	$ga_karten_div_accordion
		.accordion({collapsible:true, active: false, heightStyle: 'content'})
		.accordion("destroy");

    _.each(layers, function(layer, index) {
        layertitel = layer.get('title') || '(Ebene ohne Titel)';
        visible = layer.get('visible');
        kategorie = layer.get('kategorie');
        legende = layer.get('legende') || false;
        legende_url = layer.get('legende_url') || null;

        if (layertitel !== 'messen') {
	        html_prov = '<li><input type="checkbox" class="olmap_layertree_checkbox" id="olmap_layertree_' + layertitel + '" value="' + index + '"';
	        // sichtbare Layer sollen gecheckt sein
	        if (visible) {
	            html_prov += ' checked="checked"';
	        }
	        html_prov += '>';
	        html_prov += '<label for="olmap_layertree_' + layertitel + '">' + layertitel + '</label>';
            // bei pop und tpop muss style gewählt werden können
            if (layertitel === 'Populationen') {
                html_prov += '<div class="layeroptionen">';
                html_prov += '<label for="layertree_pop_nr" class="layertree_pop_style pop_nr">Nr.</label>';
                html_prov += '<input type="checkbox" id="layertree_pop_nr" class="layertree_pop_style pop_nr" checked="checked"> ';
                html_prov += '<label for="layertree_pop_name" class="layertree_pop_style pop_name">Namen</label>';
                html_prov += '<input type="checkbox" id="layertree_pop_name" class="layertree_pop_style pop_name">';
                html_prov += '</div>';
            }
            if (layertitel === 'Teilpopulationen') {
                html_prov += '<div class="layeroptionen">';
                html_prov += '<label for="layertree_tpop_nr" class="layertree_tpop_style tpop_nr">Nr.</label>';
                html_prov += '<input type="checkbox" id="layertree_tpop_nr" class="layertree_tpop_style tpop_nr" checked="checked"> ';
                html_prov += '<label for="layertree_tpop_name" class="layertree_tpop_style tpop_name">Namen</label>';
                html_prov += '<input type="checkbox" id="layertree_tpop_name" class="layertree_tpop_style tpop_name">';
                html_prov += '</div>';
            }
            if (kategorie === 'Eigene Ebenen') {
                html_prov += '<div class="layeroptionen">';
                html_prov += '<input type="checkbox" class="modify_layer" id="modify_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="modify_layer_' + layertitel.replace(" ", "_") + '" title="Ebene bearbeiten" class="modify_layer_label"></label>';
                html_prov += '<select id="modify_layer_geom_type_' + layertitel.replace(" ", "_") + '" class="modify_layer_geom_type apf_tooltip" title="Neue Objekte zeichnen oder<br>bestehende Objekte auswählen, um sie zu verändern"><option id="modify_layer_geom_type_leerwert" value="leerwert" selected>Objekt auswählen</option><option value="Point">Punkt zeichnen</option><option value="LineString">Linie zeichnen</option><option value="Polygon">Polygon zeichnen</option></select>';
                html_prov += '<div class="non_modify_options">';
                    html_prov += '<select id="export2_layer_geom_type_' + layertitel.replace(" ", "_") + '" class="export_layer_select apf_tooltip" title="Ebene exportieren<br>Wählen Sie ein Format"><option value="leerwert" selected>exportieren</option><option value="GeoJSON">GeoJSON</option><option value="KML">KML</option><option value="GPX">GPX</option></select>';
                html_prov += '<input type="checkbox" class="rename_layer" id="rename_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="rename_layer_' + layertitel.replace(" ", "_") + '" title="Ebene umbenennen" class="rename_layer_label"></label>';
                html_prov += '<input type="checkbox" class="entferne_layer" id="entferne_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="entferne_layer_' + layertitel.replace(" ", "_") + '" title="Ebene entfernen" class="entferne_layer_label"></label>';
                html_prov += '</div>';
                html_prov += '<div id="eigene_layer_meldung_' + layertitel.replace(" ", "_") + '" class="eigene_layer_meldung"></div>';
                html_prov += '</div>';
                initialize_modify_layer = true;
                // diese ids werden gebraucht, um tooltips zu erstellen
                export_layer_select_ids.push('export2_layer_geom_type_' + layertitel.replace(" ", "_"));
            }
            if (legende && legende_url) {
            	// Symbol ergänzen
            	// beim hovern erscheint popup mit Legende
            	html_prov += '<a class="ui-icon ui-icon-info olmap_layertreee_legende" href="' + legende_url + '" target="_blank" title="' + legende_url + '"></a>';
            	initialize_legende = true;
            }
            html_prov += '</li>';
	        html_prov += '<hr>';
	        switch (kategorie) {
                /*case "Welt Hintergrund":
                    html_welt_hintergrund += html_prov;
                    break;*/
	            case "Hintergrund":
	                html_ch_hintergrund += html_prov;
	                break;
	            case "CH Sachinformationen":
	                html_ch_sachinfos += html_prov;
	                break;
	            case "CH Biotopinventare":
	                html_ch_biotopinv += html_prov;
	                break;
	            case "ZH Sachinformationen":
	                html_zh_sachinfos += html_prov;
	                break;
	            case "AP Flora":
	                html_apflora += html_prov;
	                break;
                case "Eigene Ebenen":
                    html_eigene_layer += html_prov;
                    eigene_layer_zähler++;
                    break;
	            default:
                    //html_eigene_layer += html_prov;
                    //eigene_layer_zähler++;
                    break;
	        }
	    }
    });

    // letztes <hr> abschneiden
    // aber nur, wenn layers ergänzt wurden
    // wenn keine Layers ergänzt wurden: Layertitel nicht anzeigen (nur bei html_apflora von Bedeutung)
    //html_welt_hintergrund = html_welt_hintergrund.substring(0, (html_welt_hintergrund.length - 4));
    html_ch_hintergrund = html_ch_hintergrund.substring(0, (html_ch_hintergrund.length - 4));
    html_ch_sachinfos = html_ch_sachinfos.substring(0, (html_ch_sachinfos.length - 4));
    html_ch_biotopinv = html_ch_biotopinv.substring(0, (html_ch_biotopinv.length - 4));
    html_zh_sachinfos = html_zh_sachinfos.substring(0, (html_zh_sachinfos.length - 4));
    if (eigene_layer_zähler > 0) {
        html_eigene_layer = html_eigene_layer.substring(0, (html_eigene_layer.length - 4));
    }
    if (html_apflora !== '<h3>ZH AP Flora</h3><div>') {
    	html_apflora = html_apflora.substring(0, (html_apflora.length - 4));
    } else {
    	html_apflora = '';
    }
    // unteraccordions abschliessen
    //html_welt_hintergrund += '</div>';
    html_ch_hintergrund += '</div>';
    html_ch_sachinfos += '</div>';
    html_ch_biotopinv += '</div>';
    html_zh_sachinfos += '</div>';
    html_apflora += '</div>';
    if (eigene_layer_zähler > 0) {
        html_eigene_layer_text += html_eigene_layer;
    }
    html_eigene_layer_text += '</div>';
    // alles zusammensetzen
    html = /*html_welt_hintergrund + */html_ch_hintergrund + html_ch_sachinfos + html_ch_biotopinv + html_zh_sachinfos + html_apflora + html_eigene_layer_text;
    // und einsetzen
    $olmap_layertree_layers.html(html);
    // erst jetzt initiieren, sonst stimmt die Höhe nicht
    if (active_kategorie) {
        // ohne die erste Aktivierung funktioniert es nicht
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active: false,
            heightStyle: 'content'
        });
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active: 0,
            heightStyle: 'content'
        });
        if (active_kategorie === 'Eigene Ebenen') {
            active = 5;
        }
        $('#olmap_layertree_layers').accordion({
            collapsible: true,
            active: active,
            heightStyle: 'content'
        });
    } else {
        $ga_karten_div_accordion.accordion({
            collapsible: true,
            active: false,
            heightStyle: 'content'
        });
    }

    // Maximalgrösse des Layertree begrenzen
    $olmap_layertree_layers.css('max-height', window.apf.berechneOlmapLayertreeMaxhöhe);
    // buttons initiieren
    $('.neues_layer')
        .button({
            icons: {primary: 'ui-icon-plusthick'}
        })
        .button('refresh');
    $('.export_layer_select').selectmenu();
    // jetzt tooltips erstellen
    _.each(export_layer_select_ids, function(id) {
        // give the selectmenu a tooltip
        $('#' + id + '-button').tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            items: 'span',
            content: 'Ebene exportieren<br>Wählen Sie ein Format'
        });
    });
    if (initialize_modify_layer) {
        $('.modify_layer')
            .button({
                icons: {primary: 'ui-icon-locked'},
                text: false
            })
            .button('refresh');
        $('.modify_layer_label, .export_layer_select_label, .rename_layer_label, .entferne_layer_label, .apf_tooltip')
            .tooltip({
                tooltipClass: "tooltip-styling-hinterlegt",
                content: function() {
                    return $(this).attr('title');
                }
            });
        $('.rename_layer')
            .button({
                icons: {primary: 'ui-icon-tag'},
                text: false
            })
            .button('refresh');
        $('.entferne_layer')
            .button({
                icons: {primary: 'ui-icon-closethick'},
                text: false
            })
            .button('refresh');
    }
    if (initialize_legende) {
		$(".olmap_layertreee_legende").tooltip({
			tooltipClass: "tooltip_olmap_layertree_legende"
			,position: {
				my: "right top+15"
				,at: "right bottom"
				,collision: "flipfit"
			}
			,content: function() {
				var url = $(this).attr('href');
				return "<img src='" + url + "'>";
			}
		});
		// die tooltips sind beim ersten Öffnen zu weit rechts > nicht sichtbar!
		// darum alle einmal öffnen
		// ab dem zweiten mal liegen sie am richtigen Ort
		$(".olmap_layertreee_legende").each(function() {
			$(this).tooltip('open');
			$(this).tooltip('close');
		});
	}
};

// das ist der Versuch, existierende Formulare als dialog zu öffnen
// braucht die id des Formulars
// und die id des Datensatzes, der anzuzeigen ist
window.apf.öffneFormularAlsPopup = function(formularname, id) {
    var $formularname = $('#' + formularname),
    	title;
	// titel bestimmen
	switch (formularname) {
		case 'pop':
			title = 'Population';
			break;
		case 'tpop':
			title = 'Teilpopulation';
			break;
		case 'beob':
			title = 'Beobachtung';
			break;
		default:
			title = '';
	}
    // id setzen
    localStorage[formularname + '_id'] = id;
    // formular initiieren, ohne anzuzeigen
    if (formularname === 'beob') {
    	window.apf['initiiere_' + formularname]('beob_nicht_beurteilt', id, 'nicht_beurteilt', true);
    } else {
    	window.apf['initiiere_' + formularname](true);
    }
    // dialog öffnen
    $formularname.dialog({
        close: function() {
            $formularname.dialog("destroy");
        },
      	//height: 600,
        width: 600,
        maxHeight: $('#menu').height(),
        resizable: true,
        position: {
        	my: 'left top',
        	at: 'left top',
        	of: $('#menu')
        },
        title: title
    });
    $formularname.dialog("open");
};

window.apf.olmap.detailplanStyle = function(feature, resolution) {
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

window.apf.olmap.detailplanStyleSelected = function(feature, resolution) {
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

// steuert den style von pop
// selected: mit der Maus oder drag_box markierte
window.apf.olmap.popStyle = function(feature, resolution, selected) {
    'use strict';
    
    var icon = 'img/flora_icon_braun.png',
        popid = feature.get('myId'),
	    style,
	    image_style,
        text_inhalt,
        text_style,
        stroke_color = 'white',
	    style_with_text,
	    style_without_text,
        $layertree_pop_nr = $('#layertree_pop_nr');

    // markierte: icon ist orange und Text hat roten Hintergrund
    if (selected) {
        icon = 'img/flora_icon_orange.png';
        stroke_color = 'red';
    }

    image_style = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: icon
    }));

    // text bestimmen, abhängig von der Einstellung im Layertree
    if ($layertree_pop_nr.is(':checked')) {
    	text_inhalt = feature.get('pop_nr');
    } else if ($('#layertree_pop_name').is(':checked')) {
    	text_inhalt = feature.get('pop_name');
    }

    text_style = new ol.style.Text({
        font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
        text: text_inhalt,
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: stroke_color,
            width: 7
        })
    });

    style_with_text = new ol.style.Style({
        image: image_style,
        text: text_style
    });
    style_without_text = new ol.style.Style({
        image: image_style
    });

    // style bestimmen
    if ($layertree_pop_nr.is(':checked')) {
        style = style_with_text;
    } else if ($('#layertree_pop_name').is(':checked')) {
        style = style_with_text;
    } else {
        style = style_without_text;
    }
    
    return [style];
};

// steuert den style von tpop
// tpopid_markiert: beim Aufbau des Layers werden markierte mitgegeben
// selected: mit der Maus oder drag_box markierte
// verorten: beim Verorten soll das Symbol rot sein
window.apf.olmap.tpopStyle = function(feature, resolution, selected, verorten) {
    'use strict';

    var icon = 'img/flora_icon.png',
        tpopid = feature.get('myId'),
        style,
        image_style,
        text_inhalt,
        text_style,
        stroke_color = 'white',
        style_with_text,
        style_without_text,
        $layertree_tpop_nr = $('#layertree_tpop_nr');

    // markierte: icon ist gelb
    if (selected) {
        icon = 'img/flora_icon_gelb.png';
        stroke_color = 'red';
    }

    if (verorten) {
    	icon = 'img/flora_icon_rot.png';
    }

    image_style = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: icon
    }));

    // text bestimmen, abhängig von der Einstellung im Layertree
    if ($layertree_tpop_nr.is(':checked')) {
        text_inhalt = feature.get('tpop_nr_label');
    } else if ($('#layertree_tpop_name').is(':checked')) {
        text_inhalt = feature.get('tpop_name');
    }

    text_style = new ol.style.Text({
        font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
        text: text_inhalt,
        fill: new ol.style.Fill({
            color: 'black'
        }),
        stroke: new ol.style.Stroke({
            color: stroke_color,
            width: 7
        })
    });

    style_with_text = new ol.style.Style({
        image: image_style,
        text: text_style
    });
    style_without_text = new ol.style.Style({
        image: image_style
    });

    // style bestimmen
    if ($layertree_tpop_nr.is(':checked')) {
        style = style_with_text;
    } else if ($('#layertree_tpop_name').is(':checked')) {
        style = style_with_text;
    } else {
        style = style_without_text;
    }

    return [style];
};

window.apf.olmap.messe = function(element) {
	'use strict';
    window.apf.olmap.deactivateMenuItems();
	if (element.value === 'line' && element.checked) {
		window.apf.olmap.addMeasureInteraction('LineString');
	} else if (element.value === 'polygon' && element.checked) {
		window.apf.olmap.addMeasureInteraction('Polygon');
	} else {
		window.apf.olmap.removeMeasureInteraction();
	}
};

window.apf.olmap.removeMeasureInteraction = function() {
	window.apf.olmap.entferneLayerNachName('messen');
	window.apf.olmap.map.removeInteraction(window.apf.olmap.drawMeasure);
	delete window.apf.olmap.drawMeasure;
	$("#ergebnisMessung").text("");
	$(window.apf.olmap.map.getViewport()).off('mousemove');
};

// erhält den Typ der Interaktion: 'Polygon' oder 'LineString'
window.apf.olmap.addMeasureInteraction = function(type) {
	// allfällige Resten entfernen
	window.apf.olmap.removeMeasureInteraction();
	// neu aufbauen
	var source = new ol.source.Vector();
	var messen_layer = new ol.layer.Vector({
		title: 'messen',
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 1)',
                width: 3,
                lineDash: [2, 2],
                lineCap: 'square'
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    window.apf.olmap.map.addLayer(messen_layer);

    // Currently drawed feature
    // @type {ol.Feature}
    var sketch = null;

    // Element for currently drawed feature
    // @type {Element}
    var sketchElement;

    // handle pointer move
    // @param {Event} evt
    var mouseMoveHandler = function(evt) {
        if (sketch) {
            var output,
            	geom = (sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                output = window.apf.olmap.formatArea(/** @type {ol.geom.Polygon} */ (geom));

            } else if (geom instanceof ol.geom.LineString) {
                output = window.apf.olmap.formatLength( /** @type {ol.geom.LineString} */ (geom));
            }
            sketchElement.innerHTML = output;
        }
    };

    $(window.apf.olmap.map.getViewport()).on('mousemove', mouseMoveHandler);

    window.apf.olmap.drawMeasure = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (type)
    });
    window.apf.olmap.map.addInteraction(window.apf.olmap.drawMeasure);

    window.apf.olmap.drawMeasure.on('drawstart',
        function(evt) {
            // set sketch
            sketch = evt.feature;
            sketchElement = document.createElement('li');
            var outputList = document.getElementById('ergebnisMessung');
            if (outputList.childNodes) {
                outputList.insertBefore(sketchElement, outputList.firstChild);
            } else {
                outputList.appendChild(sketchElement);
            }
        }, this);

    window.apf.olmap.drawMeasure.on('drawend',
        function(evt) {
            // unset sketch
            sketch = null;
            sketchElement = null;
        }, this);
};

/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
*/
window.apf.olmap.formatLength = function(line) {
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
window.apf.olmap.formatArea = function(polygon) {
    var area = polygon.getArea(),
    	output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
    }
    return output;
};

window.apf.olmap.wähleAus = function() {
    window.apf.olmap.deactivateMenuItems();
    window.apf.olmap.addSelectFeaturesInSelectableLayers();
};

window.apf.olmap.schliesseLayeroptionen = function() {
	'use strict';
    $("#olmap_layertree").accordion("option", "active", false);
};

window.apf.erstelleGemeindeliste = function() {
	'use strict';
	if (!window.apf.gemeinden) {
		var getGemeinden = $.ajax({
			type: 'get',
			url: 'api/gemeinden',
			dataType: 'json'
		});
		getGemeinden.always(function(data) {
			if (data) {
				// Gemeinden bereitstellen
				// Feld mit Daten beliefern
                var gemeinden = _.map(data, function(gemeinde) {
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
					change: function(event, ui) {
						window.apf.speichern(event.target);
					}
				});
			}
		});
		getGemeinden.fail(function() {
			//window.apf.melde("Fehler: Die Liste der Gemeinden konnte nicht bereitgestellt werden");
			console.log('Fehler: Die Liste der Gemeinden konnte nicht bereitgestellt werden');
		});
	}
};

window.apf.wähleAp = function(ap_id) {
	'use strict';
	if (ap_id) {
		// einen AP gewählt
		$("#ap_waehlen_label").hide();
		localStorage.ap_id = ap_id;
		if ($("[name='programm_wahl']:checked").attr("id") === "programm_neu") {
			// zuerst einen neuen Datensatz anlegen
			var insertAp = $.ajax({
				type: 'post',
				url: 'php/ap_insert.php',
				dataType: 'json',
				data: {
					"id": localStorage.ap_id,
					"user": sessionStorage.User
				}
			});
			insertAp.always(function() {
				// nachdem ein neues Programm erstellt wurde, soll nicht mehr "neu" zur Wahl stehen, sondern "alle"
				$("#programm_neu").attr("checked", false);
				$("#programm_alle").attr("checked", true);
				$("#programm_wahl").buttonset();
				// Auswahlliste für Programme updaten
				$.when(window.apf.wähleApListe("programm_alle"))
					.then(function() {
						// Strukturbaum updaten
						$.when(window.apf.erstelle_tree(localStorage.ap_id))
							.then(function() {
								// gewählte Art in Auswahlliste anzeigen
								$('#ap_waehlen').val(localStorage.ap_id);
								$('#ap_waehlen option[value =' + localStorage.ap_id + ']').attr('selected', true);
								$("#ApArtId").val(localStorage.ap_id);
								// gewählte Art in Formular anzeigen
								window.apf.initiiere_ap();
							});
				});
			});
			insertAp.fail(function() {
				//window.apf.melde("Fehler: Keine Daten für Programme erhalten");
				console.log('Fehler: Keine Daten für Programme erhalten');
			});
		} else {
			window.apf.erstelle_tree(ap_id);
			$("#ap").show();
			window.apf.initiiere_ap();
		}
	} else {
		// leeren Wert gewählt
		$("#ap_waehlen_label").html("Artförderprogramm wählen:").show();
		$("#tree").hide();
		$("#suchen").hide();
		$("#exportieren_2").hide();
		$("#hilfe").hide();
		$("#ap_loeschen").hide();
		$("#exportieren_1").show();
		$("#ap").hide();
		window.apf.zeigeFormular();
		history.replaceState({ap: "ap"}, "ap", "index.html");
	}
};

window.apf.kopiereKoordinatenInPop = function(x_koord, y_koord) {
	'use strict';
	// prüfen, ob X- und Y-Koordinaten vergeben sind
	if (x_koord > 100000 && y_koord > 100000) {
		// Koordinaten der Pop nachführen
		var update_pop = $.ajax({
			type: 'post',
			url: 'php/pop_update.php',
			dataType: 'json',
			data: {
				"id": localStorage.pop_id,
				"Feld": "PopXKoord",
				"Wert": x_koord,
				"user": sessionStorage.User
			}
		});
		update_pop.always(function() {
			var updatePop_4 = $.ajax({
				type: 'post',
				url: 'php/pop_update.php',
				dataType: 'json',
				data: {
					"id": localStorage.pop_id,
					"Feld": "PopYKoord",
					"Wert": y_koord,
					"user": sessionStorage.User
				}
			});
			updatePop_4.always(function() {
				$("#kopiereKoordinatenInPopRueckmeldung").fadeIn('slow');
				setTimeout(function() {
					$("#kopiereKoordinatenInPopRueckmeldung").fadeOut('slow');
				}, 3000);
			});
			updatePop_4.fail(function() {
				//window.apf.melde("Fehler: Y-Koordinate wurde nicht kopiert (die X-Koordinate offenbar schon)");
				console.log('Fehler: Y-Koordinate wurde nicht kopiert (die X-Koordinate offenbar schon)');
			});
		});
		update_pop.fail(function() {
			//window.apf.melde("Fehler: Koordinaten wurden nicht kopiert");
			console.log('Fehler: Koordinaten wurden nicht kopiert');
		});
	} else {
		// auffordern, die Koordinaten zu vergeben und Speichern abbrechen
		window.apf.melde("Sie müssen zuerst Koordinaten erfassen", "Koordinaten nicht kopiert");
	}
};

window.apf.prüfeAnmeldung = function() {
	'use strict';
    var $anmeldung_name = $("#anmeldung_name").val(),
        $anmeldung_passwort = $("#anmeldung_passwort").val();
	// Leserechte zurücksetzen
	delete sessionStorage.NurLesen;
	if ($anmeldung_name && $anmeldung_passwort) {
		var getAnmeldung = $.ajax({
			type: 'get',
			url: 'api/anmeldung/name=' + $anmeldung_name + '/pwd=' + $anmeldung_passwort,
			dataType: 'json'
		});
		getAnmeldung.always(function(data) {
			if (data && data.length > 0) {
				sessionStorage.User = $anmeldung_name;
				// wenn NurLesen, globale Variable setzen
				if (data[0].NurLesen === -1) {
					sessionStorage.NurLesen = true;
				}
				$("#anmeldung_rueckmeldung")
                    .html("Willkommen " + $anmeldung_name)
                    .addClass("ui-state-highlight");
				setTimeout(function() {
					$("#anmelde_dialog").dialog("close", 2000);
				}, 1000);
			} else {
				$("#anmeldung_rueckmeldung")
                    .html("Anmeldung gescheitert")
                    .addClass("ui-state-highlight");
				setTimeout(function() {
					$("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
				}, 500);
			}
		});
		getAnmeldung.fail(function() {
			window.apf.melde("Anmeldung gescheitert", "Oops!");
			//console.log('Anmeldung gescheitert');
		});
	} else {
		$("#anmeldung_rueckmeldung")
            .html("Bitte Name und Passwort ausfüllen")
            .addClass( "ui-state-highlight" );
		setTimeout(function() {
			$("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
		}, 500);
	}
};

// erwartet aktuelle Werte für jahr und typ
// erstellt den label für den Baum
window.apf.erstelleLabelFürFeldkontrolle = function(jahr, typ) {
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
window.apf.erstelleLabelFürMassnahme = function(jahr, beurteilung) {
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
window.apf.erstelleFelderFürBeob = function(data, beobtyp) {
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
	$.each(data, function(index, value) {
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

// in DOM-Objekten sind viele ID's der Name des DOM-Elements vorangestellt, damit die ID eindeutig ist
// ACHTUNG auf die Reihenfolge der Ersatzbefehle. Sonst wird z.B. in 'tpopber' 'popber' ersetzt und es bleibt 't'
window.apf.erstelleIdAusDomAttributId = function(domAttributId) {
	'use strict';
	var returnWert = domAttributId.replace('ap_ordner_pop', '').replace('ap_ordner_apziel', '').replace('ap_ordner_erfkrit', '').replace('ap_ordner_jber', '').replace('ap_ordner_ber', '').replace('ap_ordner_beob_nicht_beurteilt', '').replace('ap_ordner_beob_nicht_zuzuordnen', '').replace('idealbiotop', '').replace('ap_ordner_assozarten', '').replace('tpop_ordner_massnber', '').replace('tpop_ordner_massn', '').replace('tpopmassnber', '').replace('pop_ordner_massnber', '').replace('popmassnber', '').replace('tpop_ordner_feldkontr', '').replace('tpop_ordner_freiwkontr', '').replace('tpop_ordner_tpopber', '').replace('tpopber', '').replace('pop_ordner_popber', '').replace('popber', '').replace('tpop_ordner_beob_zugeordnet', '').replace('beob', '').replace('ber', '');
	if (domAttributId == returnWert && parseInt(returnWert) && parseInt(returnWert) != returnWert) {
		console.log('window.apf.erstelleIdAusDomAttributId meldet: erhalten ' + domAttributId + ', zurückgegeben: ' + returnWert + '. Die Regel in der function muss wohl angepasst werden');
	}
	return returnWert;
};

window.apf.zeigeBeobKoordinatenImGisBrowser = function() {
	'use strict';
	var URL,
        target,
        $beobfelder_FNS_XGIS = $("#beobfelder_FNS_XGIS"),
        $beobfelder_FNS_YGIS = $("#beobfelder_FNS_YGIS"),
        $beobfelder_COORDONNEE_FED_E = $("#beobfelder_COORDONNEE_FED_E"),
        $beobfelder_COORDONNEE_FED_N = $("#beobfelder_COORDONNEE_FED_N"),
        $TPopXKoord = $("#TPopXKoord"),
        $TPopYKoord = $("#TPopYKoord"),
        $PopXKoord = $("#PopXKoord"),
        $PopYKoord = $("#PopYKoord");
	if ($beobfelder_FNS_XGIS.val() && $beobfelder_FNS_YGIS.val()) {
		URL = "//www.maps.zh.ch/?x=" + $beobfelder_FNS_XGIS.val() + "&y=" + $beobfelder_FNS_YGIS.val() + "&scale=3000&markers=ring";
		window.open(URL, target="_blank");
	} else if ($beobfelder_COORDONNEE_FED_E.val() && $beobfelder_COORDONNEE_FED_N.val()) {
		URL = "//www.maps.zh.ch/?x=" + $beobfelder_COORDONNEE_FED_E.val() + "&y=" + $beobfelder_COORDONNEE_FED_N.val() + "&scale=3000&markers=ring";
		window.open(URL, target="_blank");
	} else if ($TPopXKoord.val() && $TPopYKoord.val()) {
		URL = "//www.maps.zh.ch/?x=" + $TPopXKoord.val() + "&y=" + $TPopYKoord.val() + "&scale=3000&markers=ring";
		window.open(URL, target="_blank");
	} else if ($PopXKoord.val() && $PopYKoord.val()) {
		URL = "//www.maps.zh.ch/?x=" + $PopXKoord.val() + "&y=" + $PopYKoord.val() + "&scale=3000&markers=ring";
		window.open(URL, target="_blank");
	} else {
		window.apf.melde("Fehler: Keine Koordinaten zum Anzeigen", "Aktion abgebrochen");
	}
};

// retourniert die Beschriftung für TPop auf Karten
// Wenn TPop mit ihrer Nummer beschriftet sein sollen
// tpop_nr und pop_nr wird übernommen
window.apf.beschrifteTPopMitNrFürKarte = function(pop_nr, tpop_nr) {
	'use strict';
	var tpop_beschriftung;
	pop_nr = pop_nr || "?";
	if (tpop_nr) {
		tpop_beschriftung = pop_nr + "/" + tpop_nr;
	} else {
		tpop_beschriftung = pop_nr + "/?";
	}
	return tpop_beschriftung;
};

//öffnet ein modal und teilt etwas mit
window.apf.melde = function(meldung, title) {
	'use strict';
    var title = title || ' ';
	$("#Meldung")
		.html(meldung)
        .attr('title', title)
		.dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
};

// zeigt während 25 Sekunden einen Hinweis an und einen Link, mit dem eine Aktion rückgängig gemacht werden kann
// erwartet die Mitteilung, was passiert ist
window.apf.frageObAktionRückgängigGemachtWerdenSoll = function(wasIstPassiert) {
	'use strict';
	// Hinweis zum rückgängig machen anzeigen
	$("#undelete_div").html(wasIstPassiert + " <a href='#' id='undelete'>Rückgängig machen?</a>");
	$(".undelete").show();
	if ($( window ).width() > 1000) {
		$("#forms").css("top", "37px");
	}
	setTimeout(function() {
		$("#undelete_div").html("");
		$(".undelete").hide();
		$("#forms").css("top", "");
	}, 30000);
};


// Baut einen neuen Knoten auf derselben Hierarchiestufe, von welcher der Befehl aufgerufen wurde
window.apf.insertNeuenNodeAufGleicherHierarchiestufe = function(aktiver_node, parent_node, strukturtyp, ds_id, beschriftung) {
	'use strict';
	var NeuerNode;
	// id global verfügbar machen
	localStorage[strukturtyp + "_id"] = ds_id;
	// letzte globale Variable entfernen
	delete window.apf[strukturtyp];
	// neuen Node bauen
	NeuerNode = $.jstree._reference(parent_node).create_node(parent_node, "last", {
		"data": beschriftung,
		"attr": {
			"id": ds_id,
			"typ": strukturtyp
		}
	});
	// allfällige Unterordner anlegen
	if (strukturtyp === "pop") {
		window.apf.insertOrdnerVonPop(NeuerNode, ds_id);
	}
	if (strukturtyp === "tpop") {
		window.apf.insertOrdnerVonTPop(NeuerNode, ds_id);
	}
	if (strukturtyp === "apziel") {
		$.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
			"data": "0 Ziel-Berichte",
			"attr": {
				"id": ds_id,
				"typ": "zielber_ordner"
			}
		});
	}

	// Parent Node-Beschriftung: Anzahl anpassen
	if (strukturtyp === "apziel") {
		var grandparent_node = $.jstree._reference(parent_node)._get_parent(parent_node);
		// grandparent Node-Beschriftung: Anzahl anpassen
		window.apf.beschrifte_ordner_apziel(grandparent_node);
		// parent Node-Beschriftung: Anzahl anpassen
		// nur, wenn es nicht der Ordner ist, der "neue AP-Ziele" heisst
		if ($.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
			window.apf.beschrifte_ordner_apzieljahr(parent_node);
		}
	} else {
		// Normalfall
		window.apf["beschrifte_ordner_"+strukturtyp](parent_node);
	}
	
	// node selecten
	$.jstree._reference(aktiver_node).deselect_all();
	$.jstree._reference(NeuerNode).select_node(NeuerNode);
	// Formular initiieren
	if (strukturtyp === "tpopfreiwkontr") {
		// der Initiierung mitteilen, dass es eine Freiwilligenkontrolle ist und keine Feldkontrolle
		localStorage.tpopfreiwkontr = true;
		// Freiwilligen-Kontrollen werden von derselben Funktion initiiert, wie Feldkontrollen
		window.apf["initiiere_tpopfeldkontr"]();
	} else {
		window.apf["initiiere_"+strukturtyp]();
	}
};

// Baut einen neuen Knoten auf der näcshttieferen Hierarchiestufe, als der Befehl aufgerufen wurde
// parent_node wird nur von Strukturtyp apziel benutzt
window.apf.insertNeuenNodeEineHierarchiestufeTiefer = function(aktiver_node, parent_node, strukturtyp, ds_id, beschriftung) {
	'use strict';
	var NeuerNode;
	// id global verfügbar machen
	localStorage[strukturtyp + "_id"] = ds_id;
	// letzte globale Variable entfernen
	delete window.apf[strukturtyp];
	if (strukturtyp === "apziel" && localStorage.apziel_von_ordner_apziel) {
		// localStorage.apziel_von_ordner_apziel sagt: apziel wird vom ordner_apziel aus angelegt > temporären Unterordner anlegen
		var neue_apziele_node = $.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
			"data": "neue AP-Ziele",
			"attr": {
				"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
				"typ": "apzieljahr"
			}
		});
		// darunter neuen Node bauen
		NeuerNode = $.jstree._reference(neue_apziele_node).create_node(neue_apziele_node, "last", {
			"data": beschriftung,
			"attr": {
				"id": ds_id,
				"typ": strukturtyp
			}
		});
		delete localStorage.apziel_von_ordner_apziel;
	} else {
		// Normalfall
		// neuen Node bauen
		NeuerNode = $.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
			"data": beschriftung,
			"attr": {
				"id": ds_id,
				"typ": strukturtyp
			}
		});
	}
	// allfällige Unterordner anlegen
	if (strukturtyp === "pop") {
		window.apf.insertOrdnerVonPop(NeuerNode, ds_id);
	}
	if (strukturtyp === "tpop") {
		window.apf.insertOrdnerVonTPop(NeuerNode, ds_id);
	}
	if (strukturtyp === "apziel") {
		$.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
			"data": "0 Ziel-Berichte",
			"attr": {
				"id": ds_id,
				"typ": "zielber_ordner"
			}
		});
		// im create_node-Event von jstree wird Jahr eingefügt und gespeichert
	}
	// Node-Beschriftung: Anzahl anpassen
	if (strukturtyp === "apziel" && localStorage.apziel_von_apzieljahr) {
		// hier ist ein Ordner zwischengeschaltet
		// Parent Node-Beschriftung: Anzahl anpassen, wenns nicht der neue Ordner ist
		if ($.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
			window.apf.beschrifte_ordner_apziel(parent_node);
		}
		// aktiver Node-Beschriftung: Anzahl anpassen
		window.apf.beschrifte_ordner_apzieljahr(aktiver_node);
		delete localStorage.apziel_von_apzieljahr;
	} else if (strukturtyp !== "jber_uebersicht") {
		window.apf["beschrifte_ordner_"+strukturtyp](aktiver_node);
	}
	// node selecten
	$.jstree._reference(aktiver_node).deselect_all();
	$.jstree._reference(NeuerNode).select_node(NeuerNode);
	// Formular initiieren
	if (strukturtyp === "tpopfreiwkontr") {
		// der Initiierung mitteilen, dass es eine Freiwilligenkontrolle ist und keine Feldkontrolle
		localStorage.tpopfreiwkontr = true;
		// Freiwilligen-Kontrollen werden von derselben Funktion initiiert, wie Feldkontrollen
		window.apf["initiiere_tpopfeldkontr"]();
	} else {
		window.apf["initiiere_"+strukturtyp]();
	}
};

// erstellt alle Unterordner des Ordners vom Typ pop
// erwartet den node des pop-ordners
window.apf.insertOrdnerVonPop = function(pop_node, pop_id) {
	'use strict';
	$.jstree._reference(pop_node).create_node(pop_node, "last", {
		"data": "Teilpopulationen",
		"attr": {
			"id": pop_id,
			"typ": "pop_ordner_tpop"
		}
	});
	$.jstree._reference(pop_node).create_node(pop_node, "last", {
		"data": "Populations-Berichte",
		"attr": {
			"id": pop_id,
			"typ": "pop_ordner_popber"
		}
	});
	$.jstree._reference(pop_node).create_node(pop_node, "last", {
		"data": "Massnahmen-Berichte",
		"attr": {
			"id": pop_id,
			"typ": "pop_ordner_massnber"
		}
	});
};

// erstellt alle Unterordner des Ordners vom Typ tpop
// erwartet den node des tpop-ordners
window.apf.insertOrdnerVonTPop = function(TPopNode, tpop_id) {
	'use strict';
	$.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Massnahmen",
		"attr": {
			"id": tpop_id,
			"typ": "tpop_ordner_massn"
		}
	});
	$.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Massnahmen-Berichte",
		"attr": {
			"id": tpop_id,
			"typ": "tpop_ordner_massnber"
		}
	});
	$.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Feldkontrollen",
		"attr": {
			"id": tpop_id,
			"typ": "tpop_ordner_feldkontr"
		}
	});
	$.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Freiwilligen-Kontrollen",
		"attr": {
			"id": tpop_id,
			"typ": "tpop_ordner_freiwkontr"
		}
	});
	$.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Teilpopulations-Berichte",
		"attr": {
			"id": tpop_id,
			"typ": "tpop_ordner_tpopber"
		}
	});
	$.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Beobachtungen",
		"attr": {
			"id": tpop_id,
			"typ": "tpop_ordner_beob_zugeordnet"
		}
	});
};

window.apf.löscheAp = function(ap_id) {
	'use strict';
	//Variable zum rückgängig machen erstellen
	window.apf.deleted = window.apf;
	window.apf.deleted.typ = "ap";
	//Artname in Textform merken
	window.apf.deleted.Artname = $("#ap_waehlen option[value='" + $("#ap_waehlen").val() + "']").text();
	var deleteAp = $.ajax({
		type: 'post',
		url: 'php/ap_delete.php',
		dataType: 'json',
		data: {
			"id": ap_id
		}
	});
	deleteAp.always(function() {
        var $exportieren_2 = $("#exportieren_2");
		delete localStorage.ap_id;
		delete window.apf.ap;
		delete localStorage.ap;
		$("#programm_neu").attr("checked", false);
		$("#programm_alle").attr("checked", true);
		$("#programm_wahl").buttonset();
		window.apf.erstelle_ap_liste("programm_alle");
		$('#ap_waehlen').val('');
		$("#ap_waehlen_label").html("Artförderprogramm wählen:").show();
		$("#tree").hide();
		$("#suchen").hide();
		$exportieren_2.hide();
		$("#hilfe").hide();
		$("#ap_loeschen").hide();
		$exportieren_2.show();
		$("#ap").hide();
		$("#forms").hide();
		//Hinweis zum rückgängig machen anzeigen
		window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das Programm der Art '" + window.apf.deleted.Artname + "' wurde gelöscht.");
		//Artname wird nicht mehr gebraucht und soll später nicht in Datensatz eingefügt werden
		delete window.apf.deleted.Artname;
		//forms muss eingeblendet sein, weil undelete_div darin ist
		window.apf.zeigeFormular("keines");
	});
	deleteAp.fail(function(data) {
		//window.apf.melde("Fehler: Das Programm wurde nicht gelöscht");
		console.log('Fehler: Das Programm wurde nicht gelöscht');
	});
};

// Stellt einen Datensatz aus window.apf.deleted wieder her
/*
** TODO
** Idee: $.data() auf #undelete nutzen
** in einen Schlüssel "undelete" einen Array von Objekten verstauen
** dann können ALLE Änderungen rückgängig gemacht werden:
** Formular zeigt Inhalt von $("#undelete").data("undelete") an
** jeder Datensatz hat Schaltfläche
** bei Klick: Ja nach Typ der Daten Wiederherstellung starten und Erfolg melden
*/
window.apf.undeleteDatensatz = function() {
	'use strict';
	var tabelle,
		data = {},
		typ,
		id;
	
	if (!window.apf.deleted) {
		window.apf.melde("Wiederherstellung gescheitert", "Fehler");
		return false;
	}
	
	//Artname wurde für die Anzeige in undelete_div gespeichert - entfernen, da kein Feld in Tabelle
	delete window.apf.deleted.Artname;
	
	// tabelle setzen
	typ = window.apf.deleted.typ;
	// typ gehört nicht zum Datensatz > löschen
	delete window.apf.deleted.typ;

	switch (typ) {
		case "ap":
			tabelle = "tblAktionsplan";
			id = window.apf.deleted.ApArtId;
			//Artname wurde für die Anzeige in undelete_div gespeichert - entfernen, da kein Feld in Tabelle
			delete window.apf.deleted.Artname;
			break;
		case "apziel":
			tabelle = "tblZiel";
			id = window.apf.deleted.ZielId;
			break;
		case "zielber":
			tabelle = "tblZielBericht";
			id = window.apf.deleted.ZielBerId;
			break;
		case "erfkrit":
			tabelle = "tblErfKrit";
			id = window.apf.deleted.ErfkritId;
			break;
		case "pop":
			tabelle = "tblPopulation";
			id = window.apf.deleted.PopId;
			break;
		case "popber":
			tabelle = "tblPopBericht";
			id = window.apf.deleted.PopBerId;
			break;
		case "popmassnber":
			tabelle = "tblPopMassnBericht";
			id = window.apf.deleted.PopMassnBerId;
			break;
		case "tpop":
			tabelle = "tblTeilpopulation";
			id = window.apf.deleted.TPopId;
			break;
		case "tpopmassn":
			tabelle = "tblTeilPopMassnahme";
			id = window.apf.deleted.TPopMassnId;
			break;
		case "tpopmassnber":
			tabelle = "tblTeilPopMassnBericht";
			id = window.apf.deleted.TPopMassnBerId;
			break;
		case "tpopber":
			tabelle = "tblTeilPopBericht";
			id = window.apf.deleted.TPopBerId;
			break;
		case "tpopfeldkontr":
		case "tpopfreiwkontr":
			tabelle = "tblTeilPopFeldkontrolle";
			id = window.apf.deleted.TPopKontrId;
			break;
		case "jber":
			tabelle = "tblJBer";
			id = window.apf.deleted.JBerId;
			break;
		case "jber_uebersicht":
			tabelle = "tblJBerUebersicht";
			id = window.apf.deleted.JbuJahr;
			break;
		case "ber":
			tabelle = "tblBer";
			id = window.apf.deleted.BerId;
			break;
		case "assozarten":
			tabelle = "tblAssozArten";
			id = window.apf.deleted.AaId;
			break;
		default:
			window.apf.melde("Wiederherstellung gescheitert", "Fehler");
	}

	// tabelle wird in php benutzt, um zu wissen, in welche Tabelle der Datensatz eingefügt werden soll
	// wird danach aus dem Felderarray entfernt
	data.tabelle = tabelle;

	// window.apf.deleted enthält alle Feldnamen - viele können leer sein
	// daher nur solche mit Werten übernehmen
    _.each(window.apf.deleted, function(feldwert, feldname) {
        if (feldwert) {
            data[feldname] = feldwert;
        }
    });

	// Datensatz hinzufügen
	var insertMultiple = $.ajax({
		type: 'post',
		url: 'php/insert_multiple.php',
		dataType: 'json',
		data: data
	});

	insertMultiple.always(function() {
		$(".undelete").hide();
		$("#forms").css("top", "");
		// ap kann nicht via Strukturbaum gewählt werden
		if (typ === "ap") {
			//Formulare ausblenden
			window.apf.zeigeFormular();
			//neu initiieren, damit die gelöschte Art gewählt werden kann
			window.apf.initiiere_index();
			// TODO: DAS TESTEN
			// Formulare blenden
			window.apf.zeigeFormular("ap");
			history.replaceState({ap: "ap"}, "ap", "index.html?ap=" + id);
		} else {
			//tree neu aufbauen
			$.when(window.apf.erstelle_tree(window.apf.olmap.erstellePopLayer))
				.then(function() {
					$("#tree").jstree("select_node", "[typ='" + typ + "']#" + id);
				});
		}
	});

	insertMultiple.fail(function() {
		//window.apf.melde("Fehler: Wiederherstellung gescheitert");
		console.log('Fehler: Wiederherstellung gescheitert');
	});
};

window.apf.olmap.exportiereKarte = function(event) {
	'use strict';
	var exportPNGElement = document.getElementById('olmap_exportieren');
	if ('download' in exportPNGElement) {
	  	exportPNGElement.addEventListener('click', function(e) {
		    window.apf.olmap.map.once('postcompose', function(event) {
	    		var canvas = event.context.canvas;
	    		exportPNGElement.href = canvas.toDataURL('image/png');
		    });
	    	window.apf.olmap.map.renderSync();
	  	}, false);
        if (!window.apf.olmap.recentlyClicked) {
            // beim ersten mal soll der Event gleich wiederholt werden
            window.apf.olmap.recentlyClicked = true;
            // warten, sonst kommen zwei Downloads
            setTimeout(function() {
                exportPNGElement.click();
            }, 200);
        }
	} else {
		var info = 'Der Download ist nur möglich, wenn Ihr Browser das moderne Download-Attribut unterstützt <a href="http://caniuse.com/#feat=download">(hier eine aktuelle Liste der unterstützenden Browser)</a>';
		window.apf.melde(info, "Export abgebrochen");
	}
};

// damit kann man die verbleibende Anzahl Zeichen, die in einem Feld erfasst werden, anzeigen
// Quelle: https://www.scriptiny.com/2012/09/jquery-input-textarea-limiter/
(function($) {
	$.fn.extend( {
		limiter: function(limit, elem) {
			$(this).on("keyup focus", function() {
				setCount(this, elem);
			});
			function setCount(src, elem) {
				var chars = src.value.length;
				if (chars > limit) {
					src.value = src.value.substr(0, limit);
					chars = limit;
				}
				elem.html( limit - chars );
			}
			setCount($(this)[0], elem);
		}
	});
})(jQuery);

// erstellt einen guid
// Quelle: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
window.apf.erstelleGuid = function() {
	'use strict';
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};
},{"./modules/configuration":4,"./modules/initiiereIdealbiotop":6}],2:[function(require,module,exports){
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		},
    /**
     * Get the ISO 8601 week number
     * Based on comments from
     * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
     */
    getWeek = function (date) {
      // Remove time components of date
      var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Change date to Thursday same week
      targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

      // Take January 4th as it is always in week 1 (see ISO 8601)
      var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

      // Change date to Thursday same week
      firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

      // Check if daylight-saving-time-switch occured and correct for it
      var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
      targetThursday.setHours(targetThursday.getHours() - ds);

      // Number of weeks between target Thursday and first Thursday
      var weekDiff = (targetThursday - firstThursday) / (86400000*7);
      return 1 + Math.floor(weekDiff);
    },

    /**
     * Get ISO-8601 numeric representation of the day of the week
     * 1 (for Monday) through 7 (for Sunday)
     */

    getDayOfWeek = function(date){
    	var dow = date.getDay();
    	if(dow === 0) dow = 7;
    	return dow;
    };

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc, gmt) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		date = date || new Date;

    if(!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date)) {
      throw TypeError("Invalid date");
    }

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc/gmt argument via the mask
		var maskSlice = mask.slice(0, 4);
		if (maskSlice == "UTC:" || maskSlice == "GMT:") {
			mask = mask.slice(4);
			utc = true;
			if (maskSlice == "GMT:") {
				gmt = true;
			}
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			W = getWeek(date),
			N = getDayOfWeek(date),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(Math.round(L / 10)),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    gmt ? "GMT" : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
				W:    W,
				N:    N
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

/*
// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
*/

if (typeof exports !== "undefined") {
  module.exports = dateFormat;
}

},{}],3:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android < 4.0, iOS < 6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	// Support: Windows Web Apps (WWA)
	// `name` and `type` need .setAttribute for WWA
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE9-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') in IE9, see #12537
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],4:[function(require,module,exports){
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
},{"./dbPass.json":5}],5:[function(require,module,exports){
module.exports={
    "user": "alexande",
    "pass": "y3oYksFsQL49es9x"
}
},{}],6:[function(require,module,exports){
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
    getIdealbiotop.done(function(data) {
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

            // null zurückgekommen > Datensatz schaffen
            var insertIdealbiotop = $.ajax({
                type: 'post',
                url: '/api/insert/tabelle=tblIdealbiotop/feld=IbApArtId/wert=' + localStorage.ap_id + '/user=' + sessionStorage.User,
                dataType: 'json'
            });
            insertIdealbiotop.done(function(data) {
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
},{"dateformat":2,"jquery":3}]},{},[1]);
