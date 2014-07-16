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
			url: 'php/ap.php',
			dataType: 'json',
			data: {
				"id": localStorage.ap_id
			}
		});
		getAp.always(function(data) {
			// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				// ap bereitstellen
				window.apf.ap = data;
				// Felder mit Daten beliefern
				$("#ApStatus" + data.ApStatus).prop("checked", true);
				$("#ApUmsetzung" + data.ApUmsetzung).prop("checked", true);
				$("#ApJahr").val(data.ApJahr);
				$("#ApArtwert").val(data.ApArtwert);
				$("#Artname").val(data.Artname);
				// ApBearb: Daten holen - oder vorhandene nutzen
				if (!window.apf.adressen_html) {
					var getAdressen = $.ajax({
						type: 'get',
						url: 'php/adressen.php',
						dataType: 'json'
					});
					getAdressen.always(function(data2) {
						if (data2) {
							// Feld mit Daten beliefern
							var html;
							html = "<option></option>";
                            _.each(data2.rows, function(adresse) {
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
		url: 'php/ap.php',
		dataType: 'json',
		data: {
			"id": localStorage.ap_id
		}
	});
	getAp.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// ap bereitstellen
			window.apf.ap = data;
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
			url: 'php/artliste.php',
			dataType: 'json'
		});
		getArtliste.always(function(data) {
			var html;
			html = "<option></option>";
            _.each(data.rows, function(art) {
                html += "<option value=\"" + art.id + "\">" + art.Artname + "</option>";
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
					url: 'php/adressen.php',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// adressen bereitstellen
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2.rows, function(adresse) {
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

window.apf.initiiere_idealbiotop = function() {
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
            url: 'php/idealbiotop.php',
            dataType: 'json',
            data: {
                "id": localStorage.ap_id
            }
        }),
        $IbErstelldatum = $("#IbErstelldatum");
	getIdealbiotop.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// idealbiotop bereitstellen
			localStorage.idealbiotop_id = data.IbApArtId;
			window.apf.idealbiotop = data;
			// Felder mit Daten beliefern
			if (data.IbErstelldatum !== "01.01.1970") {
				// php macht aus einem Nullwert im Datum den 1.1.1970!!!
				$("#IbErstelldatum").val(data.IbErstelldatum);
			}
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
				url: 'php/idealbiotop_insert.php',
				dataType: 'json',
				data: {
					"id": localStorage.ap_id,
					"user": sessionStorage.User
				}
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

// setzt window.apf.idealbiotop und localStorage.idealbiotop_id
// wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
window.apf.setzeWindowIdealbiotop = function(id) {
	'use strict';
	localStorage.idealbiotop_id = id;
	var getIdealbiotop = $.ajax({
		type: 'get',
		url: 'php/idealbiotop.php',
		dataType: 'json',
		data: {
			"id": localStorage.idealbiotop_id
		}
	});
	getIdealbiotop.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// idealbiotop bereitstellen
			window.apf.idealbiotop = data;
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
            url: 'php/assozarten.php',
            dataType: 'json',
            data: {
                "id": localStorage.assozarten_id
            }
        }),
        $AaSisfNr = $("#AaSisfNr");
	getAssozarten.always(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// assozarten bereitstellen
			window.apf.assozarten = data;
			// Felder mit Daten beliefern
            $AaSisfNr.val(data.AaSisfNr);
			$("#AaBem").val(data.AaBem);
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
		url: 'php/assozarten.php',
		dataType: 'json',
		data: {
			"id": localStorage.assozarten_id
		}
	});
	getAssozarten.always(function(data) {
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
					url: 'php/adressen.php',
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
                        _.each(data2.rows, function(adresse) {
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
					url: 'php/adressen.php',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2.rows, function(adresse) {
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
					url: 'php/adressen.php',
					dataType: 'json'
				});
				getAdressen.always(function(data2) {
					if (data2) {
						// Feld mit Daten beliefern
						var html;
						html = "<option></option>";
                        _.each(data2.rows, function(adresse) {
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
			url: 'php/apliste.php',
			dataType: 'json',
			data: {
				"programm": programm
			}
		});
	getApliste.always(function(data) {
		var html;
		html = "<option></option>";
        _.each(data.rows, function(ap) {
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
				"url": "php/tree.php",
				"progressive_render": true,
				"data" : function(n) {
					return {
						id : ApArtId
					};
				}
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
							window.apf.melde("Die Population hat keine Koordinaten");
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
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
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
						url: 'php/assozarten_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						}
					});
					insertAssozarten.always(function(id) {
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
						url: 'php/assozarten_insert.php',
						dataType: 'json',
						data: {
							"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "assozarten",
							"user": sessionStorage.User
						}
					});
					insertAssozarten_2.always(function(id) {
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
									url: 'php/assozarten_delete.php',
									dataType: 'json',
									data: {
										"id": window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									}
								});
								deleteAssozarten.always(function() {
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
							window.apf.melde("Die Population hat keine Koordinaten");
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
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
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
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
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
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
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
							window.apf.melde("Die Teilpopulation hat keine Koordinaten");
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
							window.apf.melde("Die Teilpopulation hat keine Koordinaten");
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
							window.apf.melde("Es gibt keine Beobachtungen mit Koordinaten");
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
							window.apf.melde("Die Beobachtung hat keine Koordinaten");
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
							window.apf.melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen");
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
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
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
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
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
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
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
							window.apf.melde("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen");
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
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
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
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
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
			window.apf.melde("Sie haben keine Schreibrechte");
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
	var Feldtyp,
        Formular,
        Feldname,
        Feldwert,
        Objekt,
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
        $BerTitel = $("#BerTitel");
	if (window.apf.prüfeSchreibvoraussetzungen()) {
		Formular = $(that).attr("formular");
		Feldname = that.name;
		Feldtyp = $(that).attr("type") || null;
		// Feldwert ermitteln
		if (Feldtyp && Feldtyp === "checkbox") {
			Feldwert = $('input:checkbox[name=' + Feldname + ']:checked').val();
		} else if (Feldtyp && Feldtyp === "radio") {
			Feldwert = $('input:radio[name=' + Feldname + ']:checked').val();
		} else {
			// textarea, input, select
			Feldwert = $("#" + Feldname).val();
		}
		// ja/nein Felder zu boolean umbauen
		if (Feldname === "PopHerkunftUnklar" || Feldname === "TPopHerkunftUnklar" || Feldname === "TPopMassnPlan" || Feldname === "TPopKontrPlan") {
			if (Feldwert) {
				Feldwert = 1;
			} else {
				Feldwert = "";
			}
		}
		if (Feldname === "BeobBemerkungen" && localStorage.beob_status === "nicht_beurteilt") {
			// hier soll nicht gespeichert werden
			$("#BeobBemerkungen").val("");
			window.apf.melde("Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich");
			return;
		}
		var updateFormular = $.ajax({
			type: 'post',
			url: 'php/' + Formular + '_update.php',
			dataType: 'json',
			data: {
				"id": localStorage[Formular + "_id"],
				"Feld": Feldname,
				"Wert": Feldwert,
				"user": sessionStorage.User
			}
		});
		updateFormular.always(function() {
			// Variable für Objekt nachführen
			window.apf[Formular][Feldname] = Feldwert;
			// Wenn ApArtId verändert wurde: Formular aktualisieren
			if (Feldname === "ApArtId" && Feldwert) {
				window.apf.wähleAp(Feldwert);
				return;
			}
			// Wenn in feldkontr Datum erfasst, auch Jahr speichern
			if (Feldname === "TPopKontrDatum" && Feldwert) {
				Objekt = {};
				Objekt.name = "TPopKontrJahr";
				Objekt.formular = "tpopfeldkontr";
				window.apf.speichern(Objekt);
			}
			// dito bei tpopmassn
			if (Feldname === "TPopMassnDatum" && Feldwert) {
				Objekt = {};
				Objekt.name = "TPopMassnJahr";
				Objekt.formular = "tpopmassn";
				window.apf.speichern(Objekt);
			}
			// wenn in TPopKontrZaehleinheit 1 bis 3 ein Leerwert eingeführt wurde
			// sollen auch die Felder TPopKontrMethode 1 bis 3 und TPopKontrAnz 1 bis 3 Leerwerte erhalten
			if (!Feldwert) {
				if (Feldname === "TPopKontrZaehleinheit1") {
					// UI aktualisieren
					if (window.apf.tpopfeldkontr.TPopKontrMethode1) {
						$("#TPopKontrMethode1" + window.apf.tpopfeldkontr.TPopKontrMethode1).prop("checked", false);
					}
					$("#TPopKontrAnz1").val("");
					// Datenbank aktualisieren
					// Feld TPopKontrMethode1
					Objekt = {};
					Objekt.name = "TPopKontrMethode1";
					Objekt.formular = Formular;
					window.apf.speichern(Objekt);
					// Feld TPopKontrAnz1
					Objekt = {};
					Objekt.name = "TPopKontrAnz1";
					Objekt.formular = Formular;
					window.apf.speichern(Objekt);
				}
				if (Feldname === "TPopKontrZaehleinheit2") {
					// UI aktualisieren
					if (window.apf.tpopfeldkontr.TPopKontrMethode2) {
						$("#TPopKontrMethode2" + window.apf.tpopfeldkontr.TPopKontrMethode2).prop("checked", false);
					}
					$("#TPopKontrAnz2").val("");
					// Datenbank aktualisieren
					// Feld TPopKontrMethode2
					Objekt = {};
					Objekt.name = "TPopKontrMethode2";
					Objekt.formular = Formular;
					window.apf.speichern(Objekt);
					// Feld TPopKontrAnz2
					Objekt = {};
					Objekt.name = "TPopKontrAnz2";
					Objekt.formular = Formular;
					window.apf.speichern(Objekt);
				}
				if (Feldname === "TPopKontrZaehleinheit3") {
					// UI aktualisieren
					if (window.apf.tpopfeldkontr.TPopKontrMethode3) {
						$("#TPopKontrMethode3" + window.apf.tpopfeldkontr.TPopKontrMethode3).prop("checked", false);
					}
					$("#TPopKontrAnz3").val("");
					// Datenbank aktualisieren
					// Feld TPopKontrMethode3
					Objekt = {};
					Objekt.name = "TPopKontrMethode3";
					Objekt.formular = Formular;
					window.apf.speichern(Objekt);
					// Feld TPopKontrAnz3
					Objekt = {};
					Objekt.name = "TPopKontrAnz3";
					Objekt.formular = Formular;
					window.apf.speichern(Objekt);
				}
			}
		});
		updateFormular.fail(function() {
			//window.apf.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
			console.log('Fehler: Die letzte Änderung wurde nicht gespeichert');
		});
		// nodes im Tree updaten, wenn deren Bezeichnung ändert
		switch(Feldname) {
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
				if (Feldwert) {
					zielbeschriftung = Feldwert;
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
				if (Feldwert) {
					jberbeschriftung = Feldwert;
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
				if (Feldwert) {
					aabeschriftung = $("#AaSisfNr option[value='" + Feldwert + "']").text();
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
		zu_löschende_layer = [],
		layername;
	_.each(layers_array, function(layer) {
		layername = layer.get('title');
		if (layername === name) {
			zu_löschende_layer.push(layer);
		}
	});
	_.each(zu_löschende_layer, function(layer) {
		window.apf.olmap.map.removeLayer(layer);
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

window.apf.olmap.entferneModifyInteractionFürTepop = function() {
    'use strict';
    if (window.apf.olmap.modify_interaction) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modify_interaction);
        delete window.apf.olmap.modify_interaction;
    }
};

window.apf.olmap.erstelleModifyInteractionFürTPop = function() {
    'use strict';
    // allfällige bestehende Interaction entfernen
    window.apf.olmap.entferneModifyInteractionFürTepop();
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

window.apf.olmap.entferneModifyInteractionFürVectorLayer = function() {
    'use strict';
    if (window.apf.olmap.modify_interaction_für_vectorlayer) {
        window.apf.olmap.map.removeInteraction(window.apf.olmap.modify_interaction_für_vectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.select_interaction_für_vectorlayer);
        window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
        delete window.apf.olmap.modify_interaction_für_vectorlayer;
        delete window.apf.olmap.select_interaction_für_vectorlayer;
        delete window.apf.olmap.draw_interaction_für_vectorlayer;
    }
};

window.apf.olmap.erstelleModifyInteractionFürVectorLayer = function(vectorlayer) {
    'use strict';

    function addDrawInteraction() {
        if (type_select.val()) {
            window.apf.olmap.draw_interaction_für_vectorlayer = new ol.interaction.Draw({
                source: vectorlayer.getSource(),
                type: /** @type {ol.geom.GeometryType} */ (type_select.val())
            });
            window.apf.olmap.map.addInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
            // bei 'drawend' würde man Änderungen in die DB schreiben
            window.apf.olmap.draw_interaction_für_vectorlayer.on('drawend', function(event) {
                console.log('neues Objekt gezeichnet');
                var id = _.uniqueId();
                event.feature.setId(id);
                window.apf.olmap.modified_features = window.apf.olmap.modified_features || [];
                // id in modified_features ergänzen
                window.apf.olmap.modified_features = _.union(window.apf.olmap.modified_features, [id]);
            });
        }
    }

    if (vectorlayer === 'neuer_layer') {
        vectorlayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            title: 'neue Ebene',
            kategorie: 'Eigene Ebenen'
            //projection: 'EPSG:21781',
            //projection: 'EPSG:3857'
        });
        window.apf.olmap.map.addLayer(vectorlayer);
        // umbenennen, dann ModifyInteraction erstellen
        $.when(window.apf.olmap.frageNameFürEbene(vectorlayer))
            .then(function() {
                window.apf.olmap.erstelleModifyInteractionFürVectorLayer(vectorlayer);
            });
    } else {
        var layer_title = vectorlayer.get('title'),
            type_select = $('#modify_layer_geom_type_' + layer_title.replace(" ", "_")),
            source = vectorlayer.getSource(),
            features = vectorlayer.getSource().getFeatures();

        // neue features sollen eine id erhalten
        source.on('addFeature', function(event) {
            var feature = event.element;
            feature.setId(_.uniqueId());
            console.log('neues feature hat id = ' + feature.getId());
            // neues feature müsste jetzt gespeichert werden
        });

        // allfällige bestehende Interaction entfernen
        window.apf.olmap.entferneModifyInteractionFürVectorLayer();

        window.apf.olmap.select_interaction_für_vectorlayer = new ol.interaction.Select({
            layers: function(layer) {
                return layer.get('title') === layer_title;
            }
        });

        window.apf.olmap.modify_interaction_für_vectorlayer_features = window.apf.olmap.select_interaction_für_vectorlayer.getFeatures();

        window.apf.olmap.modify_interaction_für_vectorlayer_features.on('add', function(event) {
            console.log('feature added to selection');
            // now listen if the feature is changed
            var feature = event.element,
                feature_id = feature.getId();
            // wenn jemand eine eigene Ebene ergänzt hat, kann es sein, dass die features keine id's haben
            // also wenn nötig ergänzen
            if (!feature_id) {
                feature.setId(_.uniqueId());
            }
            console.log('feature mi id = ' + feature.getId() + ' wurde gewählt');
            feature.on('change', function(event) {
                var feature = event.target,
                    feature_id = feature.getId();
                console.log('feature with id ' + feature_id + ' was changed');
                window.apf.olmap.modified_features = window.apf.olmap.modified_features || [];
                // id in modified_features ergänzen
                window.apf.olmap.modified_features = _.union(window.apf.olmap.modified_features, [feature_id]);
            });

            // listen to pressing of delete key, then delete selected features
            $(document).on('keyup', function(event) {
                if (event.keyCode == 46) {
                    console.log('delete selected features');
                    // feature aus select_interaction entfernen
                    // TODO: alle aus window.apf.olmap.modified_features entfernen

                    var vectorlayer_features = vectorlayer.getSource().getFeatures();
                    window.apf.olmap.modify_interaction_für_vectorlayer_features.forEach(function(selected_feature) {
                        var selected_feature_id = selected_feature.getId();
                        window.apf.olmap.modify_interaction_für_vectorlayer_features.remove(selected_feature);
                        // feature aus source entfernen
                        vectorlayer_features.forEach(function(source_feature) {
                            var source_feature_id = source_feature.getId();
                            if (source_feature_id === selected_feature_id) {
                                console.log('feature mit id ' + source_feature_id + ' wird aus vectorlayer_features entfernt');
                                //vectorlayer_features.remove(source_feature);
                                vectorlayer.getSource().removeFeature(source_feature);
                            }
                        });
                    });
                    $(document).off('keyup');
                }
            })
        });
        window.apf.olmap.modify_interaction_für_vectorlayer_features.on('remove', function(event) {
            var feature = event.element,
                feature_id = feature.getId(),
                feature_index = window.apf.olmap.modified_features.indexOf(feature_id);
            console.log('feature with id ' + feature_id + ' was removed from selection');
            if (feature_index > -1) {
                console.log('dieses feature wurde verändert und muss jetzt gespeichert werden');
                // erst wieder speichern, wenn neu verändert wurde
                window.apf.olmap.modified_features.splice(feature_index, 1);
            }
            // stop listening to change on this feature
            //feature.off('change');    'undefined is not a function'
        });

        window.apf.olmap.modify_interaction_für_vectorlayer = new ol.interaction.Modify({
            features: window.apf.olmap.modify_interaction_für_vectorlayer_features,
            // the SHIFT key must be pressed to delete vertices, so
            // that new vertices can be drawn at the same position
            // of existing vertices
            deleteCondition: function(event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });

        type_select.on('change', function(event) {
            window.apf.olmap.map.removeInteraction(window.apf.olmap.draw_interaction_für_vectorlayer);
            addDrawInteraction();
        });

        addDrawInteraction();
        window.apf.olmap.map.addInteraction(window.apf.olmap.select_interaction_für_vectorlayer);
        window.apf.olmap.map.addInteraction(window.apf.olmap.modify_interaction_für_vectorlayer);
    }
};

window.apf.olmap.exportiereAlsGeojson = function(layer) {
    'use strict';
    var format = new ol.format.GeoJSON(),
    	//format = new ol.format.KML(),
    	//format = new ol.format.GPX(),
        all_features = layer.getSource().getFeatures(),
        data = JSON.stringify(format.writeFeatures(all_features)),
        //data = format.writeFeatures(all_features),
        layer_name = layer.get('title') + '.geojson' || 'Eigene_Ebene.geojson';
    window.apf.download(layer_name, data);
};

window.apf.download = function(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
};

window.apf.olmap.istLayerSichtbarNachName = function(layername) {
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

    if (window.apf.olmap.map.olmap_select_interaction && popid_markiert) {
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
    ch_ortholuftbild_layer.set('title', 'Luftbild');
    ch_ortholuftbild_layer.set('visible', false);
    ch_ortholuftbild_layer.set('kategorie', 'CH Hintergrund');

    var ch_lk_grau_layer = ga.layer.create('ch.swisstopo.pixelkarte-grau');
    ch_lk_grau_layer.set('title', 'Landeskarten grau');
    ch_lk_grau_layer.set('visible', false);
    ch_lk_grau_layer.set('kategorie', 'CH Hintergrund');

    var ch_lk_farbe_layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    ch_lk_farbe_layer.set('title', 'Landeskarten farbig');
    ch_lk_farbe_layer.set('visible', true);
    ch_lk_farbe_layer.set('kategorie', 'CH Hintergrund');

    var ch_siegriedkarte_layer = ga.layer.create('ch.swisstopo.hiks-siegfried');
    ch_siegriedkarte_layer.set('title', 'Siegfriedkarte 1881');
    ch_siegriedkarte_layer.set('visible', false);
    ch_siegriedkarte_layer.set('kategorie', 'CH Hintergrund');

    var ch_gemeinden_layer = ga.layer.create('ch.swisstopo-vd.geometa-gemeinde');
    ch_gemeinden_layer.set('title', 'Gemeinden');
    ch_gemeinden_layer.set('visible', false);
    ch_gemeinden_layer.set('kategorie', 'CH Sachinformationen');

    var ch_kantone_layer = ga.layer.create('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill');
    ch_kantone_layer.set('title', 'Kantone');
    ch_kantone_layer.set('visible', false);
    ch_kantone_layer.set('kategorie', 'CH Sachinformationen');

    var ch_parzellen_layer = ga.layer.create('ch.kantone.cadastralwebmap-farbe');
    ch_parzellen_layer.set('title', 'Parzellen');
    ch_parzellen_layer.set('visible', false);
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

    var zh_svo_farbig_layer = new ol.layer.Tile({
        title: 'SVO farbig',
        opacity: 0.7,
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            //crossOrigin: 'anonymous',
            params: {
                'layers': 'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr'
            }
        })
    });

    var zh_svo_grau_layer = new ol.layer.Tile({
        title: 'SVO schwarz/weiss',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//wms.zh.ch/FnsSVOZHWMS',
            //crossOrigin: 'anonymous',
            params: {
                'layers': 'zonen-schutzverordnungen-raster,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr',
                'transparent': true,
                'visibility': false,
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    var zh_lichte_wälder_layer = new ol.layer.Tile({
        title: 'Lichte Wälder',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/FnsLWZH',
            crossOrigin: 'anonymous',
            params: {
                'layers': 'objekte-lichte-waelder-kanton-zuerich',
                'transparent': true,
                'visibility': false,
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    var zh_ortholuftbild_layer = new ol.layer.Tile({
        title: 'Luftbild',
        visible: false,
        kategorie: 'ZH Hintergrund',
        source: new ol.source.TileWMS({
            url: '//agabriel:4zC6MgjM@wms.zh.ch/OrthoZHWMS',
            crossOrigin: 'anonymous',
            params: {
                'layers': 'orthophotos',
                'isBaseLayer': true,
                'visibility': false,
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    var zh_ortholuftbild2_layer = new ol.layer.Tile({
        title: 'Luftbild 2',
        visible: false,
        kategorie: 'ZH Hintergrund',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/OrthoBackgroundZH',
            crossOrigin: 'anonymous',
            params: {
                'layers': 'orthoaktuell',
                'isBaseLayer': true,
                'visibility': false,
                'singleTile': true
            }
        })
    });

    // error 401 (Authorization required)
    var zh_höhenmodell_layer = new ol.layer.Tile({
        title: 'Höhenmodell',
        visible: false,
        kategorie: 'ZH Sachinformationen',
        source: new ol.source.TileWMS({
            url: '//maps.zh.ch/wms/DTMBackgroundZH',
            crossOrigin: 'anonymous',
            params: {
                'layers': 'dtm',
                'isBaseLayer': true,
                'visibility': false,
                'singleTile': true
            }
        })
    });

    // Zunächst alle Layer definieren
    var layers_prov = [
        ch_ortholuftbild_layer,
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
        zh_svo_farbig_layer,
        zh_svo_grau_layer,
        detailpläne_layer
    ];

    // bing-layers vorne setzen
    // bing-maps wäre schön
    // ol3 can't reproject raster tiles yet though
    // daher werden die Layer noch nicht angezeigt
    //var layers = layers_prov.concat(bing_layers);
    var layers = layers_prov;

    /*layers = [

        new ol.layer.Tile({
            title: 'Landeskarten sw',
            source: new ol.source.TileWMS({
                url: '//agabriel:4zC6MgjM@wms.zh.ch/RasterWMS',
                params: {
                    'layers': 'up24,up8,lk25,lk50,lk100,lk200,lk500',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: 'Landeskarten überlagernd',
            source: new ol.source.TileWMS({
                url: '//maps.zh.ch/wms/BASISKARTEZH',
                params: {
                    'layers': 'lk500,lk200,lk100,lk50,lk25,up8,up24',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: 'Landeskarten ohne Luftbild',
            source: new ol.source.TileWMS({
                url: '//maps.zh.ch/wms/BASISKARTEZH',
                params: {
                    'layers': 'wald,seen,lk500,lk200,lk100,lk50,lk25,up8,up24',
                    'transparent': false,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: 'ZH Gemeinden',
            source: new ol.source.TileWMS({
                url: '//maps.zh.ch/wms/BASISKARTEZH',
                params: {
                    'layers': 'grenzen,gemeindegrenzen',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: 'Übersichtsplan Kt. Zürich',
            source: new ol.source.TileWMS({
                url: '//wms.zh.ch/upwms',
                params: {
                    'layers': 'upwms',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true,
                    'minScale': 22000,
                    'maxScale': 1
                }
            })
        }),
        new ol.layer.Tile({
            title: 'ZH Parzellen',
            source: new ol.source.TileWMS({
                url: '//wms.zh.ch/avwms',
                params: {
                    'layers': 'Liegenschaften',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: 'ZH Parzellen-Nummern',
            source: new ol.source.TileWMS({
                url: '//wms.zh.ch/avwms',
                params: {
                    'layers': 'OSNR',
                    'transparent': true,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Vector({
            title: 'ZH Verträge',
            source: new ol.source.TileWMS({
                url: '//agabriel:4zC6MgjM@maps.zh.ch/wfs/FnsVertraegeWFS',
                params: {
                    'layers': '',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: 'ZH Waldgesellschaften',
            source: new ol.source.TileWMS({
                url: '//agabriel:4zC6MgjM@wms.zh.ch/WaldVKoverlayZH',
                params: {
                    'layers': 'waldgesellschaften,beschriftung-einheit-nach-ek72',
                    'transparent': true,
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: "Landeskarten_farbig",
            source: new ol.source.TileWMS({
                url: '//wms.geo.admin.ch?',
                params: {
                    'layers': 'ch.swisstopo.pixelkarte-farbe',
                    'srs': 'EPSG:21781',
                    'format': 'png',
                    'visibility': false,
                    'singleTile': true
                }
            })
        }),
        new ol.layer.Tile({
            title: "Landeskarte 1:1'000'000",
            source: new ol.source.TileWMS({
                url: '//wms.geo.admin.ch?',
                params: {
                    'layers': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                    'srs': 'EPSG:21781',
                    'format': 'png',
                    'visibility': false,
                    'singleTile': true
                }
            })
        })
    ];*/

    /*var zh_verträge_layer = new ol.layer.Vector("ZH Verträge", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        protocol: new OpenLayers.Protocol.WFS.v1_1_0({
            url:  "//agabriel:4zC6MgjM@maps.zh.ch/wfs/FnsVertraegeWFS",
            featureType: "vertraege_f",
            featureNs: "//www.opengis.net/gml"
            //featureNs: "//www.intergraph.com/geomedia/gml"
        })
    })*/

    return layers;
};

window.apf.initiiereOlmap = function() {
	'use strict';
	// Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	//OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	//var zh_bbox_1903 = new ol.Extent(669000, 222000, 717000, 284000);

	// allfällige Apflora-Ebenen entfernen
	window.apf.olmap.entferneAlleApfloraLayer();
    // allfällige Modify-Interaktion entfernen
    window.apf.olmap.entferneModifyInteractionFürTepop();

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
    window.apf.olmap.entferneModifyInteractionFürTepop();
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
    window.apf.olmap.addDragBox();
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

window.apf.olmap.addDragBox = function() {
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
    /*window.apf.olmap.map.on('click', function() {
        var selected_features = window.apf.olmap.map.olmap_select_interaction.getFeatures().getArray();
        selected_features.clear();
    });*/
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
            features: event.features,
            projection: event.projection
        });
        var drag_and_drop_layer = new ol.layer.Vector({
            source: vectorSource,
            style: drag_and_drop_styleFunction,
            title: 'eigene Ebene',
            kategorie: 'Eigene Ebenen'
        });
        window.apf.olmap.map.addLayer(drag_and_drop_layer);
        var view = window.apf.olmap.map.getView();
        view.fitExtent(vectorSource.getExtent(), /** @type {ol.Size} */ (window.apf.olmap.map.getSize()));
        // layertree aktualisieren
        window.apf.olmap.initiiereLayertree();
        window.apf.olmap.frageNameFürEbene(drag_and_drop_layer);
        // layer in localStorage speichern
        //localStorage.olmap_eigene_ebenen = localStorage.olmap_eigene_ebenen || [];
        //localStorage.olmap_eigene_ebenen.push(drag_and_drop_layer);
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
    window.apf.olmap.initiiereLayertree();
};

// baut das html für den layertree auf
// Muster:
// <li><input type="checkbox" id="olmap_layertree_Ebene 1"><label for="olmap_layertree_Ebene 1">Ebene 1</label></li><hr>
window.apf.olmap.initiiereLayertree = function() {
	'use strict';
    var layertitel,
        visible,
        kategorie,
        //html_welt_hintergrund = '<h3>Welt Hintergrund</h3><div>',
        html_ch_hintergrund = '<h3>CH Hintergrund</h3><div>',
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
        initialize_modify_layer = false;

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
    html_eigene_layer_text += '<label for="olmap_neues_layer" title="neue Ebene erstellen" class="neues_layer_label">neue Ebene</label>';
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
                html_prov += '<select id="modify_layer_geom_type_' + layertitel.replace(" ", "_") + '" class="modify_layer_geom_type apf_tooltip" title="Neue Objekte als:"><option value="" selected>(keine)</option><option value="Point">Punkt</option><option value="LineString">Linie</option><option value="Polygon">Polygon</option></select>';
                html_prov += '<input type="checkbox" class="export_layer" id="export_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="export_layer_' + layertitel.replace(" ", "_") + '" title="Ebene als GeoJSON exportieren" class="export_layer_label"></label>';
                html_prov += '<input type="checkbox" class="rename_layer" id="rename_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="rename_layer_' + layertitel.replace(" ", "_") + '" title="Ebene umbenennen" class="rename_layer_label"></label>';
                html_prov += '<input type="checkbox" class="entferne_layer" id="entferne_layer_' + layertitel.replace(" ", "_") + '">';
                html_prov += '<label for="entferne_layer_' + layertitel.replace(" ", "_") + '" title="Ebene entfernen" class="entferne_layer_label"></label>';
                html_prov += '</div>';
                initialize_modify_layer = true;
            }
            html_prov += '</li>';
	        html_prov += '<hr>';
	        switch (kategorie) {
                /*case "Welt Hintergrund":
                    html_welt_hintergrund += html_prov;
                    break;*/
	            case "CH Hintergrund":
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
    $ga_karten_div_accordion.accordion({collapsible:true, active: false, heightStyle: 'content'});
    // Maximalgrösse des Layertree begrenzen
    $olmap_layertree_layers.css('max-height', window.apf.berechneOlmapLayertreeMaxhöhe);
    // buttons initiieren
    $('.neues_layer')
        .button({
            icons: {primary: 'ui-icon-plusthick'}
        })
        .button('refresh');
    $('.neues_layer_label')
        .tooltip({
            tooltipClass: "tooltip-styling-hinterlegt",
            content: function() {
                return $(this).attr('title');
            }
        });
    if (initialize_modify_layer) {
        $('.modify_layer')
            .button({
                icons: {primary: 'ui-icon-locked'},
                text: false
            })
            .button('refresh');
        $('.modify_layer_label, .export_layer_label, .rename_layer_label, .entferne_layer_label, .apf_tooltip')
            .tooltip({
                tooltipClass: "tooltip-styling-hinterlegt",
                content: function() {
                    return $(this).attr('title');
                }
            });
        $('.export_layer')
            .button({
                icons: {primary: 'ui-icon-arrowthickstop-1-s'},
                text: false
            })
            .button('refresh');
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
	if (!window.Gemeinden) {
		var getGemeinden = $.ajax({
			type: 'get',
			url: 'php/gemeinden.php',
			dataType: 'json'
		});
		getGemeinden.always(function(data) {
			if (data) {
				// Gemeinden bereitstellen
				// Feld mit Daten beliefern
                var gemeinden = _.map(data.rows, function(gemeinde) {
                    if (gemeinde.GmdName) {
                        return gemeinde.GmdName;
                    }
                });
				window.Gemeinden = gemeinden;
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
		window.apf.melde("Sie müssen zuerst Koordinaten erfassen");
	}
};

window.apf.prüfeAnmeldung = function() {
	'use strict';
	// Leserechte zurücksetzen
	delete sessionStorage.NurLesen;
	if ($("#anmeldung_name").val() && $("#anmeldung_passwort").val()) {
		var getAnmeldung = $.ajax({
			type: 'get',
			url: 'php/anmeldung.php',
			dataType: 'json',
			data: {
				"Name": $("#anmeldung_name").val(),
				"pwd": $("#anmeldung_passwort").val()
			}
		});
		getAnmeldung.always(function(data) {
			if (data && data.anzUser > 0) {
				sessionStorage.User = $("#anmeldung_name").val();
				// wenn NurLesen, globale Variable setzen
				if (data.NurLesen && data.NurLesen === -1) {
					sessionStorage.NurLesen = true;
				}
				$("#anmeldung_rueckmeldung")
                    .html("Willkommen " + $("#anmeldung_name")
                        .val())
                    .addClass("ui-state-highlight");
				setTimeout(function() {
					$("#anmelde_dialog").dialog("close", 2000);
				}, 1000);
			} else {
				alert("Anmeldung gescheitert");
				$("#anmeldung_rueckmeldung")
                    .html("Anmeldung gescheitert")
                    .addClass("ui-state-highlight");
				setTimeout(function() {
					$("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
				}, 500);
			}
		});
		getAnmeldung.fail(function() {
			window.apf.melde("Anmeldung gescheitert");
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
		window.apf.melde("Fehler: Keine Koordinaten zum Anzeigen");
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
window.apf.melde = function(meldung) {
	'use strict';
	$("#Meldung")
		.html(meldung)
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
		window.apf.melde("Fehler: Wiederherstellung gescheitert");
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
			window.apf.melde("Fehler: Wiederherstellung gescheitert");
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
		window.apf.melde(info);
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