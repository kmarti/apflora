// benötigte globale Variabeln initialisieren
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

	// tooltip: Klasse zuweisen, damit gestylt werden kann
	//$("#label_karteSchieben, #label_distanzMessen, #label_flaecheMessen, #label_mitPolygonWaehlen").tooltip({tooltipClass: "tooltip-styling-nur-text"});
	$("#label_karteSchieben, #label_distanzMessen, #label_flaecheMessen, #label_mitPolygonWaehlen").tooltip({tooltipClass: "tooltip-styling-hinterlegt"});

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
		getAp.done(function(data) {
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
					getAdressen.done(function(data2) {
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
	getAp.done(function(data) {
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
		getArtliste.done(function(data) {
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

window.apf.initiiere_pop = function() {
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
	getPop.done(function(data) {
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
			window.apf.zeigeFormular("pop");
			history.replaceState({pop: "pop"}, "pop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$PopName.val()) {
                $PopNr.focus();
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
	getPop.done(function(data) {
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
	getApZiel.done(function(data) {
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
	getApziel.done(function(data) {
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
	getZielBer.done(function(data) {
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
	getZielber.done(function(data) {
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
	getErfkrit.done(function(data) {
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
	getErfkrit.done(function(data) {
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
	getJber.done(function(data) {
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
				getAdressen.done(function(data2) {
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
	getJber.done(function(data) {
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
	getJberÜbersicht.done(function(data) {
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
	getJberUebersicht.done(function(data) {
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
	getBer.done(function(data) {
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
	getBer.done(function(data) {
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
	getIdealbiotop.done(function(data) {
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
			insertIdealbiotop.done(function(data) {
				localStorage.idealbiotop_id = data.IbApArtId;
				window.apf.initiiere_idealbiotop();
			});
			insertIdealbiotop.fail(function(data) {
				window.apf.melde("Fehler: Kein Idealbiotop erstellt");
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
	getIdealbiotop.done(function(data) {
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
	getAssozarten.done(function(data) {
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
	getPopmassnber.done(function(data) {
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
	getPopmassnber.done(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// popmassnber bereitstellen
			window.apf.popmassnber = data;
		}
	});
};

window.apf.initiiere_tpop = function() {
	'use strict';
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
        }),
        $TPopFlurname = $("#TPopFlurname");
	getTPop.done(function(data) {
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
				getAdressen.done(function(data2) {
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
			window.apf.zeigeFormular("tpop");
			history.replaceState({tpop: "tpop"}, "tpop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id);
			// bei neuen Datensätzen Fokus steuern
			if (!$TPopFlurname.val()) {
				$('#TPopNr').focus();
			}
		}
	});
	getTPop.fail(function() {
		window.apf.melde('Fehler: keine Daten für die Teilpopulation erhalten');
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
	getTPop.done(function(data) {
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
	getPopber.done(function(data) {
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
	getPopber.done(function(data) {
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
	getTpopfeldkontr.done(function(data) {
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
				getAdressen.done(function(data2) {
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
				getTpopfeldkontrZaehleinheit.done(function(data3) {
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
					getLrDelarze.done(function(data4) {
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
				getIdealbiotopübereinst.done(function(data5) {
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
	getTpopfeldkontr.done(function(data) {
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
	getTPopMassn.done(function(data) {
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
				getTPopMassnTyp.done(function(data2) {
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
				getAdressen.done(function(data2) {
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
	getTPopMassn.done(function(data) {
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
	getTPopMassnBer.done(function(data) {
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
	getTPopMassnBer.done(function(data) {
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
	getTPopBer.done(function(data) {
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
	getTPopBer.done(function(data) {
		// Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
		if (data) {
			// tpopber bereitstellen
			window.apf.tpopber = data;
		}
	});
};

window.apf.initiiere_beob = function(beobtyp, beobid, beob_status) {
	'use strict';
	// beob_status markiert, ob die Beobachtung:
	// - schon zugewiesen ist (zugeordnet)
	// - noch nicht beurteilt ist (nicht_beurteilt)
	// - nicht zuzuordnen ist (nicht_zuzuordnen)
	// beob_status muss gespeichert werden, damit bei Datenänderungen bekannt ist, ob ein bestehender Datensatz bearbeitet oder ein neuer geschaffen werden muss
	localStorage.beob_status = beob_status;
	// sicherstellen, dass beobtyp immer bekannt ist
	localStorage.beobtyp = beobtyp;
	// beobid hat 'beob' vorangestellt - entfernen!
	beobid = beobid.replace('beob', '');
	// beobid bereitstellen
	localStorage.beob_id = beobid;

	var url, url_distzutpop;
	if (!beobid) {
		// es fehlen benötigte Daten > eine Ebene höher
		if (beob_status === "nicht_beurteilt" || beob_status === "nicht_zuzuordnen") {
			window.apf.initiiere_ap();
		} else {
			window.apf.initiiere_pop();
		}
		return;
	}
	
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

	getBeob.done(function(data_beob) {
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
			getDistZuTPop.done(function(data) {
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
						getBeobZuordnung.done(function(data) {
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
							window.apf.zeigeFormular("beob");
							if (beob_status === "zugeordnet") {
								history.replaceState({beob_zugeordnet: "beob_zugeordnet"}, "beob_zugeordnet", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&beob_zugeordnet=" + beobid);
							} else if (beob_status === "nicht_zuzuordnen") {
								history.replaceState({beob_nicht_zuzuordnen: "beob_nicht_zuzuordnen"}, "beob_nicht_zuzuordnen", "index.html?ap=" + localStorage.ap_id + "&beob_nicht_zuzuordnen=" + beobid);
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
						window.apf.zeigeFormular("beob");
						history.replaceState({beob_nicht_beurteilt: "beob_nicht_beurteilt"}, "beob_nicht_beurteilt", "index.html?ap=" + localStorage.ap_id + "&beob_nicht_beurteilt=" + beobid);
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
				// auswählen deaktivieren und allfällige Liste ausblenden
				$("#mitPolygonWaehlen").button({ disabled: false });
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
			$("#tree").css("max-height", $(window).height() - 145);
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
    var lyt_max_height = window.apf.berechneOlmapLayertreeMaxhöhe;
	// Formulare sind unbegrenzt hoch aber Karten sollen das nicht sein
	if (window.apf.kartenhöhe_manuell) {
		$("#forms").height($(window).height() - 17);
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
	getApliste.done(function(data) {
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
				fügePopEin.done(function() {
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
					window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
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
				fügeTPopEin.done(function() {
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
					window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
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
				fügeTPopEin_2.done(function() {
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
					window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
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
				fügeTPopEin_3.done(function() {
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
					window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
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
				fügeTPopEin_4.done(function() {
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
					window.apf.melde("Fehler: Die Teilpopulation wurde nicht verschoben");
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
				fügeTPopMassnEin.done(function() {
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
					window.apf.melde("Fehler: Die Massnahme wurde nicht verschoben");
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
				fügeTPopMassnEin_2.done(function() {
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
					window.apf.melde("Fehler: Die Massnahme wurde nicht verschoben");
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
				fügeTPopFeldkontrEin.done(function() {
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
					window.apf.melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
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
				fügeTPopFeldkontrEin_2.done(function() {
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
					window.apf.melde("Fehler: Die Feldkontrolle wurde nicht verschoben");
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
				fügeTPopFeldkontrEin_3.done(function() {
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
					window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
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
				fügeTPopFeldkontrEin_4.done(function() {
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
					window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
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
				ordneBeobachtungZu.done(function() {
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
					window.apf.melde("Fehler: Die Beobachtung wurde nicht auf 'nicht beurteilt' gesetzt");
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
				ordneBeobachtungZu_2.done(function() {
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
					window.apf.melde("Fehler: Die Beobachtung wurde nicht verschoben");
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
				ordneBeobachtungZu_3.done(function() {
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
					setzeTpopid.done(function() {
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
					window.apf.melde("Fehler: Die Beobachtung wurde nicht verschoben");
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
				insertZuordnung.done(function() {
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
					updateBeob.done(function() {
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
						window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
					});
				});
				insertZuordnung.fail(function() {
					window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
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
				insertZuordnung_2.done(function() {
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
					updateBeob_2.done(function() {
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
					window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
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
				deleteZuordnung.done(function() {
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
					window.apf.melde("Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt");
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
				updateBeob_3.done(function() {
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
					updateBeob_4.done(function() {
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
						window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
					});
				});
				updateBeob_3.fail(function() {
					window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
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
					insertPop.done(function(id) {
						var strukturtyp = "pop",
							beschriftung = "neue Population";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPop.fail(function() {
						window.apf.melde("Fehler: Keine neue Population erstellt");
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
					getPopsChKarte.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigePopAufOlmap(data);
						} else {
							window.apf.melde("Die Population hat keine Koordinaten");
						}
					});
					getPopsChKarte.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getApKarte.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
						}
					});
					getApKarte.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					updatePop.done(function() {
						// Baum neu aufbauen
						$.when(window.apf.erstelle_tree(window.apf.erstelleIdAusDomAttributId($(aktiver_node).attr("id"))))
							.then(function() {
								// dann den eingefügten Node wählen
								$("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id); 
							});
						// einfügen soll nicht mehr angezeigt werden
						delete window.apf.pop_zum_verschieben_gemerkt;
						// nicht mehr benötigte Variabeln entfernen
						delete window.apf.pop_bezeichnung;
						delete window.apf.pop_id;
					});
					updatePop.fail(function() {
						window.apf.melde("Fehler: Die Population wurde nicht verschoben");
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
					insertApziel.done(function(id) {
						var strukturtyp = "apziel",
							beschriftung = "neues Ziel";
						// mitteilen, dass von ganz oben ein apziel erstellt wird und daher noch ein Zwischenordner erstellt werden muss
						localStorage.apziel_von_ordner_apziel = true;
						// zur Sicherheit den anderen Zeiger löschen
						delete localStorage.apziel_von_apzieljahr;
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertApziel.fail(function() {
						window.apf.melde("Fehler: Keine neues AP-Ziel erstellt");
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
					insertApziel_2.done(function(id) {
						var strukturtyp = "apziel",
							beschriftung = "neues Ziel";
						localStorage.apziel_von_apzieljahr = true;
						// zur Sicherheit den anderen Zeiger löschen
						delete localStorage.apziel_von_ordner_apziel;
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertApziel_2.fail(function() {
						window.apf.melde("Fehler: Keine neues Ziel erstellt");
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
					insertApziel_3.done(function(id) {
						var strukturtyp = "apziel",
							beschriftung = "neues Ziel";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertApziel_3.fail(function() {
						window.apf.melde("Fehler: Kein neues AP-Ziel erstellt");
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
								deleteApziel.done(function() {
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
									window.apf.melde("Fehler: Das AP-Ziel wurde nicht gelöscht");
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
					insertZielber.done(function(id) {
						var strukturtyp = "zielber",
							beschriftung = "neuer Ziel-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertZielber.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
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
					insertZielber_2.done(function(id) {
						var strukturtyp = "zielber",
							beschriftung = "neuer Ziel-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertZielber_2.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Ziel-Bericht erstellt");
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
								deleteZielber.done(function() {
									delete localStorage.zielber_id;
									delete window.apf.zielber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_zielber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Ziel-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteZielber.fail(function() {
									window.apf.melde("Fehler: Der Ziel-Bericht wurde nicht gelöscht");
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
					insertErfkrit.done(function(id) {
						var strukturtyp = "erfkrit",
							beschriftung = "neues Erfolgskriterium";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertErfkrit.fail(function() {
						window.apf.melde("Fehler: Kein neues Erfolgskriterium erstellt");
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
					insertErfkrit_2.done(function(id) {
						var strukturtyp = "erfkrit",
							beschriftung = "neues Erfolgskriterium";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertErfkrit_2.fail(function() {
						window.apf.melde("Fehler: Kein neues Erfolgskriterium erstellt");
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
								deleteErfkrit.done(function() {
									delete localStorage.erfkrit_id;
									delete window.apf.erfkrit;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_erfkrit(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Das Erfolgskriterium '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteErfkrit.fail(function() {
									window.apf.melde("Fehler: Das Erfolgskriterium wurde nicht gelöscht");
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
					insertJber.done(function(id) {
						var strukturtyp = "jber",
							beschriftung = "neuer AP-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertJber.fail(function() {
						window.apf.melde("Fehler: Keinen neuen AP-Bericht erstellt");
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
					insertJber_2.done(function(id) {
						var strukturtyp = "jber",
							beschriftung = "neuer AP-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertJber_2.fail(function() {
						window.apf.melde("Fehler: Keinen neuen AP-Bericht erstellt");
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
								deleteJber.done(function() {
									delete localStorage.jber_id;
									delete window.apf.jber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_jber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der AP-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteJber.fail(function() {
									window.apf.melde("Fehler: Der AP-Bericht wurde nicht gelöscht");
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
					insertJberUebersicht.done(function(data) {
						var strukturtyp = "jber_uebersicht",
							ds_id = $.jstree._reference(aktiver_node).get_text(aktiver_node),
							beschriftung = "neue Übersicht zu allen Arten";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, ds_id, beschriftung);
					});
					insertJberUebersicht.fail(function() {
						window.apf.melde("Fehler: Keine Übersicht zu allen Arten erstellt");
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
								deleteJberUebersicht.done(function() {
									delete localStorage.jber_uebersicht_id;
									delete window.apf.jber_übersicht;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Übersicht für den AP-Bericht des Jahrs \"" + window.apf.deleted.JbuJahr + "\" wurde gelöscht.");
								});
								deleteJberUebersicht.fail(function() {
									window.apf.melde("Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht");
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
					insertBer.done(function(id) {
						var strukturtyp = "ber",
							beschriftung = "neuer Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertBer.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Bericht erstellt");
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
					insertBer_2.done(function(id) {
						var strukturtyp = "ber",
							beschriftung = "neuer Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertBer_2.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Bericht erstellt");
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
								deleteBer.done(function() {
									delete localStorage.ber_id;
									delete window.apf.ber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_ber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteBer.fail(function() {
									window.apf.melde("Fehler: Der Bericht wurde nicht gelöscht");
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
					insertAssozarten.done(function(id) {
						var strukturtyp = "assozarten",
							beschriftung = "neue assoziierte Art";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertAssozarten.fail(function() {
						window.apf.melde("Fehler: keine assoziierte Art erstellt");
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
					insertAssozarten_2.done(function(id) {
						var strukturtyp = "assozarten",
							beschriftung = "neue assoziierte Art";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertAssozarten_2.fail(function() {
						window.apf.melde("Fehler: Keine assoziierte Art erstellt");
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
								deleteAssozarten.done(function() {
									delete localStorage.assozarten_id;
									delete window.apf.assozarten;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_assozarten(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die assoziierte Art '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteAssozarten.fail(function() {
									window.apf.melde("Fehler: Die assoziierte Art wurde nicht gelöscht");
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
					insertPop_2.done(function(id) {
						var strukturtyp = "pop",
							beschriftung = "neue Population";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPop_2.fail(function() {
						window.apf.melde("Fehler: Keine neue Population erstellt");
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
								deletePop.done(function() {
									delete localStorage.pop_id;
									delete window.apf.pop;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_pop(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Population '" + bezeichnung + "' wurde gelöscht.");
								});
								deletePop.fail(function() {
									window.apf.melde("Fehler: Die Population wurde nicht gelöscht");
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
					getPopChKarte_2.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigePopAufOlmap(data);
						} else {
							window.apf.melde("Die Population hat keine Koordinaten");
						}
					});
					getPopChKarte_2.fail(function() {
						window.apf.melde("Fehler: Keine Populationen erhalten");
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
					getPopKarte.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
						}
					});
					getPopKarte.fail(function() {
						window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
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
					updatePop_2.done(function() {
						// Baum wieder aufbauen
						$.when(window.apf.erstelle_tree(apartid))
							.then(function() {
								// dann den eingefügten Node wählen
								$("#tree").jstree("select_node", "[typ='pop']#" + popid); 
							});
						// einfügen soll nicht mehr angezeigt werden
						delete window.apf.pop_zum_verschieben_gemerkt;
						// nicht mehr benötigte Variabeln entfernen
						delete window.apf.pop_bezeichnung;
						delete window.apf.pop_id;
					});
					updatePop_2.fail(function() {
						window.apf.melde("Fehler: Die Population wurde nicht verschoben");
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
					insertTPop.done(function(id) {
						var strukturtyp = "tpop",
							beschriftung = "neue Teilpopulation";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPop.fail(function() {
						window.apf.melde("Fehler: Keine neue Teilpopulation erstellt");
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
					getTpopsKarte.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigeTPopAufOlmap(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
						}
					});
					getTpopsKarte.fail(function() {
						window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
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
					getPopKarte_2.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Es gibt keine Teilpopulation mit Koordinaten");
						}
					});
					getPopKarte_2.fail(function() {
						window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
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
					insertTPop_2.done(function(id) {
						var strukturtyp = "tpop",
							beschriftung = "neue Teilpopulation";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPop_2.fail(function() {
						window.apf.melde("Fehler: Keine neue Teilpopulation erstellt");
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
								deleteTPop.done(function() {
									delete localStorage.tpop_id;
									delete window.apf.tpop;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpop(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Teilpopulation '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPop.fail(function() {
									window.apf.melde("Fehler: Die Teilpopulation wurde nicht gelöscht");
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
					getTPopKarte_2.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.zeigeTPopAufOlmap(data);
						} else {
							window.apf.melde("Die Teilpopulation hat keine Koordinaten");
						}
					});
					getTPopKarte_2.fail(function() {
						window.apf.melde("Fehler: Keine Teilpopulationen erhalten");
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
					getTPop_2.done(function(data) {
						window.apf.verorteTPopAufOlmap(data);
					});
					getTPop_2.fail(function() {
						window.apf.melde("Fehler: Keine Teilpopulation erhalten");
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
					getTPopKarte_3.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPop(data);
						} else {
							window.apf.melde("Die Teilpopulation hat keine Koordinaten");
						}
					});
					getTPopKarte_3.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getTPop_3.done(function(data) {
						window.apf.gmap.verorteTPop(data);
					});
					getTPop_3.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getTPop_4.done(function(data) {
						window.apf.tpop_objekt_kopiert = data;
					});
					getTPop_4.fail(function() {
						window.apf.melde("Fehler: Die Teilpopulation wurde nicht kopiert");
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
					insertPopber.done(function(id) {
						var strukturtyp = "popber",
							beschriftung = "neuer Populations-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopber.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Populations-Bericht erstellt");
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
					insertPopber_2.done(function(id) {
						var strukturtyp = "popber",
							beschriftung = "neuer Populations-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopber_2.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Populations-Bericht erstellt");
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
								deletePopber.done(function() {
									delete localStorage.popber_id;
									delete window.apf.popber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_popber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Populations-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deletePopber.fail(function() {
									window.apf.melde("Fehler: Der Populations-Bericht wurde nicht gelöscht");
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
					insertPopMassnBer.done(function(id) {
						var strukturtyp = "popmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopMassnBer.fail(function() {
						window.apf.melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
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
					insertPopMassnBer_2.done(function(id) {
						var strukturtyp = "popmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertPopMassnBer_2.fail(function() {
						window.apf.melde("Fehler: Es wurde kein neuer Massnahmen-Bericht erstellt");
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
								deletePopMassnBer.done(function() {
									delete localStorage.popmassnber_id;
									delete window.apf.popmassnber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_popmassnber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deletePopMassnBer.fail(function() {
									window.apf.melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
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
					insertTPopFeldKontr.done(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = "neue Feldkontrolle";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr.fail(function() {
						window.apf.melde("Fehler: Keine neue Feldkontrolle erstellt");
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
					insertTPopFeldKontrKopie.done(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie.fail(function() {
						window.apf.melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
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
					insertTPopFeldKontr_2.done(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = "neue Feldkontrolle";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr_2.fail(function() {
						window.apf.melde("Fehler: Keine neue Feldkontrolle erstellt");
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
								deleteTPopFeldKontr.done(function() {
									delete localStorage.tpopfeldkontr_id;
									delete window.apf.tpopfeldkontr;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopfeldkontr(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Feldkontrolle '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopFeldKontr.fail(function() {
									window.apf.melde("Fehler: Die Feldkontrolle wurde nicht gelöscht");
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
						window.apf.melde("Fehler: Das kopierte Biotop wurde nicht eingefügt");
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
					getTPopFeldkontr_2.done(function(data) {
						window.apf.tpopfeldkontr_objekt_kopiert = data;
					});
					getTPopFeldkontr_2.fail(function() {
						window.apf.melde("Fehler: Die Feldkontrolle wurde nicht kopiert");
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
					insertTPopFeldKontrKopie_2.done(function(id) {
						var strukturtyp = "tpopfeldkontr",
							beschriftung = window.apf.erstelleLabelFürFeldkontrolle(window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.apf.tpopfeldkontr_objekt_kopiert.TPopKontrTyp);
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie_2.fail(function() {
						window.apf.melde("Fehler: Die Feldkontrolle wurde nicht erstellt");
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
					insertTPopFeldKontr_3.done(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = "neue Freiwilligen-Kontrolle";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr_3.fail(function() {
						window.apf.melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
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
					insertTPopFeldKontrKopie_3.done(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie_3.fail(function() {
						window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
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
					insertTPopFeldKontr_4.done(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = "neue Freiwilligen-Kontrolle";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontr_4.fail(function() {
						window.apf.melde("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
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
								deleteTPopFeldKontr_2.done(function() {
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
									window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht");
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
					getTPopFeldkontr_3.done(function(data) {
						window.apf.tpopfreiwkontr_objekt_kopiert = data;
					});
					getTPopFeldkontr_3.fail(function() {
						window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert");
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
					insertTPopFeldKontrKopie_4.done(function(id) {
						var strukturtyp = "tpopfreiwkontr",
							beschriftung = window.apf.tpopfreiwkontr_objekt_kopiert.TPopKontrJahr;
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopFeldKontrKopie_4.fail(function() {
						window.apf.melde("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
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
					insertTPopMassn.done(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = "neue Massnahme";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassn.fail(function() {
						window.apf.melde("Fehler: Keine neue Massnahme erstellt");
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
					insertTPopMassnKopie.done(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassnKopie.fail(function() {
						window.apf.melde("Fehler: Die Massnahme wurde nicht erstellt");
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
					insertTPopMassn_2.done(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = "neue Massnahme";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassn_2.fail(function() {
						window.apf.melde("Fehler: Keine neue Massnahme erstellt");
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
								deleteTPopMassn.done(function() {
									delete localStorage.tpopmassn_id;
									delete window.apf.tpopmassn;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopmassn(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Die Massnahme '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopMassn.fail(function() {
									window.apf.melde("Fehler: Die Massnahme wurde nicht gelöscht");
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
					getTPopMassn_2.done(function(data) {
						window.apf.tpopmassn_objekt_kopiert = data;
						// den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
						window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = "";
						if ($TPopMassnTypChecked.text()) {
							window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = $TPopMassnTypChecked.text();
						}
					});
					getTPopMassn_2.fail(function() {
						window.apf.melde("Fehler: Die Massnahme wurde nicht kopiert");
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
					insertTPopMassnKopie_2.done(function(id) {
						var strukturtyp = "tpopmassn",
							beschriftung = window.apf.erstelleLabelFürMassnahme(window.apf.tpopmassn_objekt_kopiert.TPopMassnJahr, window.apf.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt);
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassnKopie_2.fail(function() {
						window.apf.melde("Fehler: Die Massnahme wurde nicht erstellt");
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
					insertTPopBer.done(function(id) {
						var strukturtyp = "tpopber",
							beschriftung = "neuer Teilpopulations-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopBer.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
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
					insertTPopBer_2.done(function(id) {
						var strukturtyp = "tpopber",
							beschriftung = "neuer Teilpopulations-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopBer_2.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
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
								deleteTPopBer.done(function() {
									delete localStorage.tpopber_id;
									delete window.apf.tpopber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_tpopber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Teilpopulations-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopBer.fail(function() {
									window.apf.melde("Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht");
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
					getBeobKarte.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPopBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtungen mit Koordinaten");
						}
					});
					getBeobKarte.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_2.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeTPopBeob(data);
						} else {
							window.apf.melde("Die Beobachtung hat keine Koordinaten");
						}
					});
					getBeobKarte_2.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_3.done(function(beob) {
						if (beob.rows.length > 0) {
							var getApKarte = $.ajax({
								type: 'get',
								url: 'php/ap_karte.php',
								dataType: 'json',
								data: {
									"id": localStorage.ap_id
								}
							});
							getApKarte.done(function(tpop) {
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
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					insertTPopMassnBer.done(function(id) {
						var strukturtyp = "tpopmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassnBer.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
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
					insertTPopMassBer_2.done(function(id) {
						var strukturtyp = "tpopmassnber",
							beschriftung = "neuer Massnahmen-Bericht";
						window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, id, beschriftung);
					});
					insertTPopMassBer_2.fail(function() {
						window.apf.melde("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
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
								deleteTPopMassnBer.done(function() {
									delete localStorage.tpopmassnber_id;
									delete window.apf.tpopmassnber;
									$.jstree._reference(aktiver_node).delete_node(aktiver_node);
									// Parent Node-Beschriftung: Anzahl anpassen
									window.apf.beschrifte_ordner_popmassnber(parent_node);
									// Hinweis zum rückgängig machen anzeigen
									window.apf.frageObAktionRückgängigGemachtWerdenSoll("Der Massnahmen-Bericht '" + bezeichnung + "' wurde gelöscht.");
								});
								deleteTPopMassnBer.fail(function() {
									window.apf.melde("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
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
					getBeobKarte_4.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
						}
					});
					getBeobKarte_4.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_5.done(function(beob) {
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
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_6.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
						}
					});
					getBeobKarte_6.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_7.done(function(beob) {
						if (beob.rows.length > 0) {
							var getApKarte_2 = $.ajax({
								type: 'get',
								url: 'php/ap_karte.php',
								dataType: 'json',
								data: {
									"id": window.apf.erstelleIdAusDomAttributId($(parent_node).attr("id"))
								}
							});
							getApKarte_2.done(function(tpop) {
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
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_8.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
						}
					});
					getBeobKarte_8.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
					getBeobKarte_9.done(function(data) {
						if (data.rows.length > 0) {
							window.apf.gmap.zeigeBeob(data);
						} else {
							window.apf.melde("Es gibt keine Beobachtung mit Koordinaten");
						}
					});
					getBeobKarte_9.fail(function() {
						window.apf.melde("Fehler: Keine Daten erhalten");
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
	insertTPopKopie.done(function(id) {
		var strukturtyp = "tpop",
			beschriftung = window.apf.tpop_objekt_kopiert.TPopFlurname;
		if (window.apf.tpop_objekt_kopiert.TPopNr) {
			beschriftung = window.apf.tpop_objekt_kopiert.TPopNr + ': ' + window.apf.tpop_objekt_kopiert.TPopFlurname
		}
		window.apf.insertNeuenNodeEineHierarchiestufeTiefer(aktiver_node, "", strukturtyp, id, beschriftung);
	});
	insertTPopKopie.fail(function() {
		window.apf.melde("Fehler: Die Teilpopulation wurde nicht erstellt");
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
	insertPopKopie_2.done(function(pop_id) {
		var strukturtyp = "pop",
			beschriftung = window.apf.pop_objekt_kopiert.PopNr + " " + window.apf.pop_objekt_kopiert.PopName;
		window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, pop_id, beschriftung);
	});
	insertPopKopie_2.fail(function() {
		window.apf.melde("Fehler: Die Population wurde nicht erstellt");
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
	insertTPopKopie_2.done(function(tpop_id) {
		var strukturtyp = "tpop",
			beschriftung = window.apf.tpop_objekt_kopiert.TPopNr + " " + window.apf.tpop_objekt_kopiert.TPopFlurname;
		window.apf.insertNeuenNodeAufGleicherHierarchiestufe(aktiver_node, parent_node, strukturtyp, tpop_id, beschriftung);
	});
	insertTPopKopie_2.fail(function() {
		window.apf.melde("Fehler: Die Teilpopulation wurde nicht erstellt");
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
		updateFormular.done(function() {
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
			window.apf.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
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
        gmap,
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
	gmap = new google.maps.Map(document.getElementById("google_karten_div"), options);
	window.apf.gmap = gmap;
	bounds = new google.maps.LatLngBounds();
	// für alle TPop Marker erstellen
	markers = [];
    _.each(tpop_liste.rows, function(tpop) {
        tpop_id = tpop.TPopId;
        tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(tpop.PopNr, tpop.TPopNr);
        latlng2 = new google.maps.LatLng(tpop.Lat, tpop.Lng);
        if (anz_tpop === 1) {
            // gmap.fitbounds setzt zu hohen zoom, wenn nur eine TPop Koordinaten hat > verhindern
            latlng = latlng2;
        } else {
            // Kartenausschnitt um diese Koordinate erweitern
            bounds.extend(latlng2);
        }
        marker = new MarkerWithLabel({
            map: gmap,
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
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListener(gmap, marker, contentString);
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
	    url: '//www.apflora.ch/kml/rueteren.kmz',
	    preserveViewport: true
	});
	window.apf.google_karte_detailpläne.setMap(null);
	marker_cluster = new MarkerClusterer(gmap, markers, marker_options);
	if (anz_tpop === 1) {
		// gmap.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		gmap.setCenter(latlng);
		gmap.setZoom(18);
	} else {
		// Karte auf Ausschnitt anpassen
		gmap.fitBounds(bounds);
	}
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(gmap, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(contentString);
			infowindow.open(gmap, marker);
		});
	}
};

window.apf.olmap.getLayersByName = function() {
	var layer_objekt_array = window.apf.olmap.map.getLayers().getArray(),
		layers = _.map(layer_objekt_array, function(layer_objekt) {
			if (layer_objekt.values_ && layer_objekt.values_.title) {
	 			return layer_objekt.values_.title;
			}
		});
	return layers;
};

window.apf.olmap.entferneAlleApfloraLayer = function() {
	'use strict';
	if (window.apf.olmap && window.apf.olmap.map) {
		// getLayers retourniert ein Objekt!!!
		// um die eigentlichen Layers zu erhalten, muss man .getLayers().getArray() aufrufen!!!
		var layers_array = window.apf.olmap.map.getLayers().getArray(),
			kategorie,
			zu_löschende_layer = [];
		// zuerst nur einen Array mit den zu löschenden Layern erstellen
		// wenn man sofort löscht, wird nur der erste entfernt!
		_.each(layers_array, function(layer, index) {
			kategorie = layer.get('kategorie');
			if (kategorie && kategorie === 'AP Flora') {
				zu_löschende_layer.push(layer);
			}
		});
		_.each(zu_löschende_layer, function(layer) {
			window.apf.olmap.map.removeLayer(layer);
		});
		window.apf.olmap.initiiereLayertree();
	}
}

window.apf.verorteTPopAufOlmap = function(TPop) {
	'use strict';
	var bounds,
        x_max,
        x_min,
        y_max,
        y_min;
	$.when(window.apf.zeigeFormular("GeoAdminKarte"))
		.then(function() {
			$("#mitPolygonWaehlen").button({ disabled: true });

			// bound eröffnen
			// bounds bestimmen
			if (TPop && TPop.TPopXKoord && TPop.TPopYKoord) {
				// bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
				x_max = parseInt(TPop.TPopXKoord) + 300;
				x_min = parseInt(TPop.TPopXKoord) - 300;
				y_max = parseInt(TPop.TPopYKoord) + 300;
				y_min = parseInt(TPop.TPopYKoord) - 300;
                bounds = [x_max, y_max, x_min, y_min];
				// marker aufbauen
				window.apf.olmap.erstelleTPopulation(TPop);
				// alle Layeroptionen schliessen
				window.apf.olmap.schliesseLayeroptionen();
			} else {
				// sonst Kanton ZH anzeigen
                bounds = [689000, 264000, 697000, 242000];
			}
			
			// Karte zum richtigen Ausschnitt zoomen
			window.apf.olmap.map.updateSize();
            window.apf.olmap.map.getView().fitExtent(bounds, window.apf.olmap.map.getSize());
			window.apf.olmap.schliesseLayeroptionen();

			// jetzt einen Handler für den Klick aufbauen
			OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {				
				defaultHandlerOptions: {
					'single': true,
					'double': false,
					'pixelTolerance': 0,
					'stopSingle': false,
					'stopDouble': false
				},

				initialize: function(options) {
					this.handlerOptions = OpenLayers.Util.extend(
						{}, this.defaultHandlerOptions
					);
					OpenLayers.Control.prototype.initialize.apply(
						this, arguments
					);
					this.handler = new OpenLayers.Handler.Click(
						this, {
							'click': this.trigger
						}, this.handlerOptions
					);
					// letzten Klick-Handler deaktivieren, sonst wird für jede Verortung ein neuer event-handler aufgebaut
					if (window.apf.olmap.LetzterKlickHandler) {
						window.apf.olmap.LetzterKlickHandler.deactivate();
					}
					// Klick-Handler in Variable speichern, damit er beim nächsten Aufruf deaktiviert werden kann
					window.apf.olmap.LetzterKlickHandler = this;
				},

				trigger: function(e) {
					var lonlat = window.apf.olmap.getLonLatFromPixel(e.xy);
					// x und y merken
					TPop.TPopXKoord = lonlat.lon;
					TPop.TPopYKoord = lonlat.lat;
					// Datensatz updaten
					var updateTPop = $.ajax({
						type: 'post',
						url: 'php/tpop_update.php',
						dataType: 'json',
						data: {
							"id": localStorage.tpop_id,
							"Feld": "TPopXKoord",
							"Wert": TPop.TPopXKoord,
							"user": sessionStorage.User
						}
					});
					updateTPop.done(function() {
						var updateTPop_2 = $.ajax({
							type: 'post',
							url: 'php/tpop_update.php',
							dataType: 'json',
							data: {
								"id": localStorage.tpop_id,
								"Feld": "TPopYKoord",
								"Wert": TPop.TPopYKoord,
								"user": sessionStorage.User
							}
						});
						updateTPop_2.done(function() {
							// markerebenen entfernen
							window.apf.olmap.entferneAlleApfloraLayer();
							// alten listener entfernen, neuer wird mit dem nächsten Befehl erstellt 
							window.apf.olmap.removeControl(click);
							// markerebene neu aufbauen
							window.apf.olmap.erstelleTPopulation(TPop);
						});
					});
				}

			});

			var click = new OpenLayers.Control.Click();
			window.apf.olmap.addControl(click);
			click.activate();
		});
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
	// falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
	if (window.apf.olmap.LetzterKlickHandler) {
		window.apf.olmap.LetzterKlickHandler.deactivate();
	}
	// wenn layer "Populationen" sichtbar ist, sichtbar behalten
	var overlay_pop_visible = window.apf.olmap.istLayerSichtbarNachName("Populationen");
	// wenn layer "Populationen Namen" sichtbar ist, sichtbar behalten
	var overlay_popnr_visible = window.apf.olmap.istLayerSichtbarNachName("Populationen Nummern");
	
	var markierte_tpop = window.apf.olmap.wähleAusschnittFürÜbergebeneTPop(TPopListeMarkiert);

	// Grundkarte aufbauen
	$.when(window.apf.zeigeFormular("GeoAdminKarte"))
		.then(function() {
			// Karte zum richtigen Ausschnitt zoomen
			// aber nur, wenn keine Auswahl aktiv
			if (window.apf.olmap.auswahlPolygonLayer && window.apf.olmap.auswahlPolygonLayer.features.length > 0) {
				// Auswahl aktiv, Zoomstufe belassen
			} else {
				window.apf.olmap.map.updateSize();
                window.apf.olmap.map.getView().fitExtent(markierte_tpop.bounds, window.apf.olmap.map.getSize());
			}
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

			getTPopKarteAlle.done(function(TPopListe) {
				$.when(
					// Layer für Symbole und Beschriftung erstellen
					window.apf.olmap.erstelleTPopNr(TPopListe, markierte_tpop.tpopid_markiert, true),
					window.apf.olmap.erstelleTPopNamen(TPopListe, markierte_tpop.tpopid_markiert, false),
					window.apf.olmap.erstelleTPopSymbole(TPopListe, markierte_tpop.tpopid_markiert, true),
					// alle Pop holen
					window.apf.olmap.zeigePopInTPop(overlay_pop_visible, overlay_popnr_visible)
				)
				.then(function() {
					// layertree neu aufbauen
					window.apf.olmap.initiiereLayertree();
				});
			});

			getTPopKarteAlle.fail(function() {
				window.apf.melde("Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden");
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

			getTPopKarteAlle_2.done(function(TPopListe) {
				$.when(
					// Layer für Symbole und Beschriftung erstellen
					window.apf.olmap.erstelleTPopNr(TPopListe, null, false),
					window.apf.olmap.erstelleTPopNamen(TPopListe, null, false),
					window.apf.olmap.erstelleTPopSymbole(TPopListe, null, false),
					// alle Pop holen, symbole und nr sichtbar schalten, Markierung übergeben
					window.apf.olmap.zeigePopInTPop(true, true, markierte_pop.popid_markiert)
				)
				.then(function() {
					// layertree neu aufbauen
					window.apf.olmap.initiiereLayertree();
				});
			});

			getTPopKarteAlle_2.fail(function() {
				window.apf.melde("Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden");
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
	if (tpop_liste_markiert.rows.length > 0) {
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
	if (pop_liste_markiert.rows.length > 0) {
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
	getPopKarteAlle.done(function(PopListe) {
		// Layer für Symbole und Beschriftung erstellen
		$.when(
			window.apf.olmap.erstellePopNr(PopListe, overlay_popnr_visible),
			window.apf.olmap.erstellePopNamen(PopListe),
			window.apf.olmap.erstellePopSymbole(PopListe, popid_markiert, overlay_pop_visible)
		)
		.then(function() {
			// layertree neu aufbauen
			window.apf.olmap.initiiereLayertree();
			pop_gezeigt.resolve();
		});
	});
	getPopKarteAlle.fail(function() {
		window.apf.melde("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
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
		window.apf.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
	});
};

// nimmt drei Variabeln entgegen: 
// TPopListe: Die Liste der darzustellenden Teilpopulationen
// tpopid_markiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll
window.apf.olmap.erstelleTPopSymbole = function(tpop_liste, tpopid_markiert, visible) {
	'use strict';
	var tpopsymbole_erstellt = $.Deferred(),
        markers = [],
        marker,
        marker_style,
        marker_style_markiert,
        my_label,
        my_flurname,
        popup_content,
        tpop_layer;

	// styles für overlay_top definieren
	marker_style_markiert = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/flora_icon_gelb.png'
  		}))
	});
	marker_style = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/flora_icon.png'
  		}))
	});

	if (visible === null) {
		visible = true;
	}

	// alt:
	/*window.overlay_tpop = new OpenLayers.Layer.Vector('Teilpopulationen', {
		filter: '',	// ist wohl nicht nötig und nützt auch nichts, um später einen Filter anzufügen
		// popup bei select
		eventListeners: {
			'featureselected': function(evt) {
				window.apf.gmap.onFeatureSelect(evt.feature);
			},
			'featureunselected': function(evt) {
				window.apf.gmap.onFeatureUnselect(evt.feature);
			}
		},
		// normal = grün, markiert = gelb
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': selectStyle
		}),
		// ermöglicht, dass die markierte TPop über den anderen angezeigt wird
		rendererOptions: {
			zIndexing: true
		},
		visibility: visible
	});*/

    _.each(tpop_liste.rows, function(tpop) {
        my_flurname = tpop.TPopFlurname || '(kein Flurname)';
        popup_content = '<p>Population: ' + tpop.PopName + '</p>'+
            '<p>Teilpopulation: ' + my_flurname + '</p>'+
            '<p>Koordinaten: ' + tpop.TPopXKoord + ' / ' + tpop.TPopYKoord + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>";

        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        if (tpop.PopNr && tpop.TPopNr) {
            my_label = tpop.PopNr + '/' + tpop.TPopNr;
        } else if (tpop.PopNr) {
            my_label = tpop.PopNr + '/?';
        } else if (tpop.TPopNr) {
            my_label = '?/' + tpop.TPopNr;
        } else {
            my_label = '?/?';
        }

        // Marker erstellen...
        marker = new ol.Feature({
    		geometry: new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]),
			name: my_flurname,
			popup_content: popup_content,
			popup_title: tpop.Artname,
			// koordinaten werden benötigt damit das popup am richtigen Ort verankert wird
			xkoord: tpop.TPopXKoord,
			ykoord: tpop.TPopYKoord,
			myTyp: 'tpop',
			myId: tpop.TPopId
    	});
    	// gewählte erhalten anderen style
        if (tpopid_markiert && tpopid_markiert.indexOf(tpop.TPopId) !== -1) {
        	marker.setStyle(marker_style_markiert);
        } else {
        	marker.setStyle(marker_style);
        }

        // ...und in Array speichern
        markers.push(marker);
    });

	// layer für Marker erstellen
	tpop_layer = new ol.layer.Vector({
		title: 'Teilpopulationen',
		source: new ol.source.Vector({
				features: markers
			})
	});
    tpop_layer.set('visible', visible);
    tpop_layer.set('kategorie', 'AP Flora');
    window.apf.olmap.map.addLayer(tpop_layer);

    // TODO: marker sollen verschoben werden können

    /* alt:
	// die marker sollen verschoben werden können
	var dragControl = new OpenLayers.Control.DragFeature(window.overlay_tpop, {
		onStart: function(feature) {
			// TO DO: Variable zum rückgängig machen erstellen
			//window.tpop_vorher = {};
			//tpop_vorher.TPopXKoord = feature.geometry.x;
			//tpop_vorher.TPopYKoord = feature.geometry.y;
			//tpop_vorher.TPopId = feature.attributes.myId;
			// meldung anzeigen, wie bei anderen Wiederherstellungen
			// wenn wiederherstellen: function verschiebeTPop(id, x, y)
			
			// allfällig geöffnete Popups schliessen - ist unschön, wenn die offen bleiben
			window.selectControlTPop.unselectAll();
		},
		onComplete: function(feature) {
			// nur zulassen, wenn Schreibrechte bestehen
			if (sessionStorage.NurLesen) {
				$("#Meldung")
                    .html("Sie haben keine Schreibrechte")
                    .dialog({
                        modal: true,
                        buttons: {
                            Ok: function() {
                                $(this).dialog("close");
                                // overlay entfernen...
                                if (window.apf.olmap.getLayersByName('Teilpopulationen')) {
                                    var layers = window.apf.olmap.getLayersByName('Teilpopulationen');
                                    _.each(layers, function(layer) {
                                        window.apf.olmap.map.removeLayer(layer);
                                    });
                                }
                                // ...und neu erstellen
                                window.apf.olmap.erstelleTPopSymbole(tpop_liste, tpopid_markiert, true);
                            }
                        }
                    });
				return;
			}
			// Verschieben muss bestätigt werden
			// Mitteilung formulieren. Gewählte hat keinen label und tooltip ist wie sonst label
			if (feature.attributes.label) {
				$("#loeschen_dialog_mitteilung").html("Sie verschieben die Teilpopulation " + feature.attributes.label + ", " + feature.attributes.tooltip);
			} else {
				$("#loeschen_dialog_mitteilung").html("Sie verschieben die Teilpopulation " + feature.attributes.tooltip);
			}
			$("#loeschen_dialog").dialog({
				resizable: false,
				height:'auto',
				width: 500,
				modal: true,
				buttons: {
					"ja, verschieben!": function() {
						$(this).dialog("close");
						// neue Koordinaten speichern
						// x und y merken
						TPop.TPopXKoord = feature.geometry.x;
						TPop.TPopYKoord = feature.geometry.y;
						// Datensatz updaten
						window.apf.speichereWert('tpop', feature.attributes.myId, 'TPopXKoord', TPop.TPopXKoord);
						window.apf.speichereWert('tpop', feature.attributes.myId, 'TPopYKoord', TPop.TPopYKoord);
						// jetzt alle marker entfernen...
						window.apf.olmap.entferneAlleApfloraLayer();
						// ...und neu aufbauen
						// dazu die tpopliste neu abrufen, da Koordinaten geändert haben! tpopid_markiert bleibt gleich
						var getTPopKarteAlle_3 = $.ajax({
							type: 'get',
							url: 'php/tpop_karte_alle.php',
							dataType: 'json',
							data: {
								"ApArtId": window.apf.ap.ApArtId
							}
						});
						getTPopKarteAlle_3.done(function(TPopListe) {
							window.apf.olmap.erstelleTPopNr(TPopListe, tpopid_markiert);
							window.apf.olmap.erstelleTPopNamen(TPopListe, tpopid_markiert);
							window.apf.olmap.erstelleTPopSymbole(TPopListe, tpopid_markiert, true);
						});
						getTPopKarteAlle_3.fail(function() {
							window.apf.melde("Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden");
						});
					},
					"nein, nicht verschieben": function() {
						$(this).dialog("close");
						// overlay entfernen...
						if (window.apf.olmap.getLayersByName('Teilpopulationen')) {
							var layers = window.apf.olmap.getLayersByName('Teilpopulationen');
                            _.each(layers, function(layer) {
                                window.apf.olmap.map.removeLayer(layer);
                            });
						}
						// ...und neu erstellen
						window.apf.olmap.erstelleTPopSymbole(tpop_liste, tpopid_markiert, true);
					}
				}
			});
		}
	});

	// selectfeature (Infoblase) soll nicht durch dragfeature blockiert werden
	// Quelle: //stackoverflow.com/questions/6953907/make-marker-dragable-and-clickable
	dragControl.handlers['drag'].stopDown = false;
	dragControl.handlers['drag'].stopUp = false;
	dragControl.handlers['drag'].stopClick = false;
	dragControl.handlers['feature'].stopDown = false;
	dragControl.handlers['feature'].stopUp = false;
	dragControl.handlers['feature'].stopClick = false;

	// dragControl einschalten
	window.apf.olmap.addControl(dragControl);
	dragControl.activate();

	// overlay zur Karte hinzufügen
	window.apf.olmap.addLayer(overlay_tpop);

	// SelectControl erstellen (mit dem Eventlistener öffnet das die Infoblase) und zur Karte hinzufügen
	window.selectControlTPop = new OpenLayers.Control.SelectFeature(overlay_tpop, {clickout: true});
	window.apf.olmap.addControl(window.selectControlTPop);
	window.selectControlTPop.activate();

	// mit Polygon auswählen, nur wenn noch nicht existent
	if (!window.apf.olmap.auswahlPolygonLayer) {
		window.apf.olmap.auswahlPolygonLayer = new OpenLayers.Layer.Vector("Auswahl-Polygon", {
			projection: new OpenLayers.Projection("EPSG:21781"), 
			displayInLayerSwitcher: false
		});
		window.apf.olmap.addLayer(auswahlPolygonLayer);
	}
	// drawControl erstellen, nur wenn noch nicht existent
	if (!window.drawControl) {
		window.drawControl = new OpenLayers.Control.DrawFeature(auswahlPolygonLayer, OpenLayers.Handler.Polygon);
		drawControl.events.register("featureadded", this, function(event) {
			window.PopTPopAuswahlFilter = new OpenLayers.Filter.Spatial({ 
				type: OpenLayers.Filter.Spatial.INTERSECTS, 
				value: event.feature.geometry
			});
			// Teilpopulationen: Auswahl ermitteln und einen Array von ID's in window.apf.tpop_array speichern
			window.apf.erstelleTPopAuswahlArrays();
			// Populationen: Auswahl ermitteln und einen Array von ID's in window.apf.pop_array speichern
			window.apf.erstellePopAuswahlArrays();
			// Liste erstellen, welche die Auswahl anzeigt, Pop/TPop verlinkt und Exporte anbietet
			window.apf.erstelleListeDerAusgewaehltenPopTPop();

			// control deaktivieren
			window.drawControl.deactivate();
			// Schaltfläche Karte schieben aktivieren
			$("#karteSchieben")
                .attr("checked", true)
                .button("enable").button("refresh");
		});
		window.apf.olmap.addControl(drawControl);
	}*/

	tpopsymbole_erstellt.resolve();
	return tpopsymbole_erstellt.promise();
};

window.apf.erstelleTPopAuswahlArrays = function() {
	'use strict';
	// Teilpopulationen: Auswahl ermitteln und einen Array von ID's in window.apf.tpop_array speichern
	window.apf.tpop_array = [];
	window.apf.tpop_id_array = [];
	if (overlay_tpop.visibility === true) {
		$.each(overlay_tpop.features, function() {
			if (window.PopTPopAuswahlFilter.evaluate(this)) {
				window.apf.tpop_array.push(this.attributes);
				window.apf.tpop_id_array.push(parseInt(this.attributes.myId));
			}
		});
		window.apf.tpop_array.sort(window.apf.vergleicheTPopZumSortierenNachTooltip);
	}
};

window.apf.erstellePopAuswahlArrays = function() {
	'use strict';
	// Populationen: Auswahl ermitteln und einen Array von ID's in window.apf.pop_array speichern
	window.apf.pop_array = [];
	window.apf.pop_id_array = [];
	if (overlay_pop.visibility === true) {
		$.each(overlay_pop.features, function() {
			if (window.PopTPopAuswahlFilter.evaluate(this)) {
				window.apf.pop_array.push(this.attributes);
				window.apf.pop_id_array.push(parseInt(this.attributes.myId));
			}
		});
		window.apf.pop_array.sort(window.apf.vergleicheTPopZumSortierenNachTooltip);
	}
};

window.apf.erstelleListeDerAusgewaehltenPopTPop = function() {
	'use strict';
	// rückmelden, welche Objekte gewählt wurden
	var rückmeldung = "";
	if (window.apf.pop_array.length > 0) {
		if (window.apf.tpop_array.length > 0) {
			// tpop und pop betitteln
			rückmeldung += "<p class='ergebnisAuswahlListeTitel'>" + window.apf.pop_array.length + " Populationen: </p>";
		}
		rückmeldung += "<table>";
        _.each(window.apf.pop_array, function(pop) {
            rückmeldung += "<tr><td><a href=\"#\" onclick=\"window.apf.öffnePop('" + pop['myId'] + "')\">";
            rückmeldung += pop['label'] + ":<\/a></td><td><a href=\"#\" onclick=\"window.apf.öffnePop('" + pop['myId'] + "')\">" + pop.tooltip + "<\/a></td></tr>";
        });
		rückmeldung += "</table>";
	}
	if (window.apf.tpop_array.length > 0) {
		if (window.apf.pop_array.length > 0) {
			// tpop und pop betitteln
			rückmeldung += "<p class='ergebnisAuswahlListeTitel ergebnisAuswahlListeTitelTPop'>" + window.apf.tpop_array.length + " Teilpopulationen: </p>";
		}
		rückmeldung += "<table>";
        _.each(window.apf.tpop_array, function(tpop) {
            rückmeldung += "<tr><td><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + window.apf.tpop_array[i]['myId'] + "')\">";
            rückmeldung += window.apf.tpop_array[i]['label'] + ":<\/a></td><td><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + window.apf.tpop_array[i]['myId'] + "')\">";
            rückmeldung += window.apf.tpop_array[i].tooltip + "<\/a></td></tr>";
        });
		rückmeldung += "</table>";
	}
	// Höhe der Meldung begrenzen. Leider funktioniert maxHeight nicht
	var height = "auto";
	if (window.apf.tpop_array.length > 25) {
		height = 650;
	}

	// Listentitel erstellen
	var listentitel,
		exportieren = "Exportieren: ",
		exportierenPop = "<a href='#' class='export_pop'>Populationen</a>",
		exportierenTPop = "<a href='#' class='export_tpop'>Teilpopulationen</a>, <a href='#' class='export_kontr'>Kontrollen</a>, <a href='#' class='export_massn'>Massnahmen</a>";
	if (window.apf.pop_array.length > 0 && window.apf.tpop_array.length > 0) {
		listentitel = "Gewählt wurden " + window.apf.pop_array.length + " Populationen und " + window.apf.tpop_array.length + " Teilpopulationen";
		exportieren += exportierenPop + ", " + exportierenTPop;
	} else if (window.apf.pop_array.length > 0) {
		listentitel = "Gewählt wurden " + window.apf.pop_array.length + " Populationen:";
		exportieren += exportierenPop;
	} else if (window.apf.tpop_array.length > 0) {
		listentitel = "Gewählt wurden " + window.apf.tpop_array.length + " Teilpopulationen:";
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
			//overlay.getElement().clear();
		}
	});
	_.each(zu_löschender_overlay, function(overlay) {
		window.apf.olmap.map.removeOverlay(overlay);
	});
}

window.apf.olmap.zeigeFeatureInfo = function(pixel, coordinate) {
	var features = window.apf.olmap.sucheFeatures(pixel),
		feature = features[0],
		overlay,
		popup_id,
		popup_id_array = [],
		koordinaten;
	if (feature) {
		// coordinate ist, wo der Benutzer geklickt hat
		// das ist ungenau
		// daher die Koordinaten des features verwenden, wenn verfügbar
		if (feature.get('xkoord') && feature.get('ykoord')) {
			koordinaten = [feature.get('xkoord'), feature.get('ykoord')];
		} else {
			koordinaten = coordinate;
		}
		// zuerst mit gtip einen popup erzeugen
		$('.olmap_popup').each(function() {
			$(this).qtip({
				content: {
		            text: feature.get('popup_content'),
		            title: feature.get('popup_title'),
		            button: 'Close'
		        },
		        style: {
		            // Use the jQuery UI widget classes
		            widget: true,
		            // Remove the default styling
		            def: false,
		            width: 250,
			        tip: {
			        	width: 12,
			        	height: 20
			        }
		        },
		        position: {
		            my: 'top left',
		            at: 'bottom right',
		            target: $(this)
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
		$('.qtip').each(function() {
			$(this).qtip('destroy', true);
		});
	}
};

// übernimmt drei Variabeln: PopListe ist das Objekt mit den Populationen
// popid_array der Array mit den ausgewählten Pop
// visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)
window.apf.olmap.erstellePopSymbole = function(popliste, popid_markiert, visible) {
	'use strict';
	var pop_symbole_erstellt = $.Deferred(),
        markers = [],
        marker,
        marker_style,
        marker_style_markiert,
        my_label,
        my_name,
        popup_content,
        pop_layer;

	// styles für overlay_pop definieren
	marker_style_markiert = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/flora_icon_orange.png'
  		}))
	});
	marker_style = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/flora_icon_braun.png'
  		}))
	});

	if (visible === null) {
		visible = true;
	}

	/* alt:
	// overlay layer für Marker vorbereiten
	window.overlay_pop = new OpenLayers.Layer.Vector('Populationen', {
		// popup bei select
		eventListeners: {
			'featureselected': function(evt) {
				window.apf.gmap.onFeatureSelect(evt.feature);
			},
			'featureunselected': function(evt) {
				window.apf.gmap.onFeatureUnselect(evt.feature);
			}
		},
		// normal = braun, markiert = orange
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': selectStyle
		}),
		// ermöglicht, dass die markierte Pop über den anderen angezeigt wird
		rendererOptions: {
			zIndexing: true
		},
		visibility: visible
	});*/

    _.each(popliste.rows, function(pop) {
        my_name = pop.PopName || '(kein Name)';
        popup_content = '<p>Koordinaten: ' + pop.PopXKoord + ' / ' + pop.PopYKoord + '</p>'+
            "<p><a href=\"#\" onclick=\"window.apf.öffnePop('" + pop.PopId + "')\">Formular öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffnePopInNeuemTab('" + pop.PopId + "')\">Formular in neuem Fenster öffnen<\/a></p>";

        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        if (pop.PopNr) {
            my_label = pop.PopNr;
        } else {
            my_label = '?';
        }

        // marker erstellen...
        marker = new ol.Feature({
    		geometry: new ol.geom.Point([pop.PopXKoord, pop.PopYKoord]),
			name: my_name,
			popup_content: popup_content,
			popup_title: my_name,
			// Koordinaten werden gebraucht, damit das popup richtig platziert werden kann
			xkoord: pop.PopXKoord,
			ykoord: pop.PopYKoord,
			myTyp: 'pop',
			myId: pop.PopId
    	});

        // gewählte erhalten style gelb und zuoberst
        if (popid_markiert && popid_markiert.indexOf(pop.PopId) !== -1) {
        	marker.setStyle(marker_style_markiert);
        } else {
        	marker.setStyle(marker_style);
        }

        // marker in Array speichern
        markers.push(marker);
    });

	// layer für Marker erstellen
	pop_layer = new ol.layer.Vector({
		title: 'Populationen',
		source: new ol.source.Vector({
			features: markers
		})
	});
    pop_layer.set('visible', visible);
    pop_layer.set('kategorie', 'AP Flora');
    window.apf.olmap.map.addLayer(pop_layer);

    // TODO: marker sollen verschoben werden können

    /* alt:
	// die marker sollen verschoben werden können
	var dragControl = new OpenLayers.Control.DragFeature(overlay_pop, {
		onStart: function(feature) {
			// allfällig geöffnete Popups schliessen - ist unschön, wenn die offen bleiben
			window.selectControlPop.unselectAll();
		},
		onComplete: function(feature) {
			// nur zulassen, wenn Schreibrechte bestehen
			if (sessionStorage.NurLesen) {
				$("#Meldung")
                    .html("Sie haben keine Schreibrechte")
                    .dialog({
                        modal: true,
                        buttons: {
                            Ok: function() {
                                $(this).dialog("close");
                                // overlay entfernen...
                                if (window.apf.olmap.getLayersByName('Populationen')) {
                                    var layers = window.apf.olmap.getLayersByName('Populationen');
                                    _.each(layers, function(layer) {
                                        window.apf.olmap.map.removeLayer(layer);
                                    });
                                }
                                // ...und neu erstellen
                                window.apf.olmap.erstellePopSymbole(popliste, popid_markiert, visible);
                            }
                        }
                    });
				return;
			}
			// Verschieben muss bestätigt werden
			// Mitteilung formulieren. Gewählte hat keinen label und tooltip ist wie sonst label
			if (feature.attributes.label) {
				$("#loeschen_dialog_mitteilung").html("Sie verschieben die Population " + feature.attributes.label + ", " + feature.attributes.tooltip);
			} else {
				$("#loeschen_dialog_mitteilung").html("Sie verschieben die Population " + feature.attributes.tooltip);
			}
			$("#loeschen_dialog").dialog({
				resizable: false,
				height:'auto',
				width: 500,
				modal: true,
				buttons: {
					"ja, verschieben!": function() {
						$(this).dialog("close");
						// neue Koordinaten speichern
						// x und y merken
						Pop.PopXKoord = feature.geometry.x;
						Pop.PopYKoord = feature.geometry.y;
						// Datensatz updaten
						window.apf.speichereWert('pop', feature.attributes.myId, 'PopXKoord', Pop.PopXKoord);
						window.apf.speichereWert('pop', feature.attributes.myId, 'PopYKoord', Pop.PopYKoord);
						// jetzt alle marker entfernen...
						window.apf.olmap.entferneAlleApfloraLayer();
						// ...und neu aufbauen
						// dazu die popliste neu abrufen, da Koordinaten geändert haben! popid_markiert bleibt gleich
						var getPopKarteAlle_2 = $.ajax({
							type: 'get',
							url: 'php/pop_karte_alle.php',
							dataType: 'json',
							data: {
								"ApArtId": window.apf.olmap.erstellePopSymbole
							}
						});
						getPopKarteAlle_2.done(function(PopListe) {
							window.apf.olmap.erstellePopNr(PopListe, true);
							window.apf.olmap.erstellePopNamen(PopListe);
							window.apf.olmap.erstellePopSymbole(PopListe, popid_markiert, true);
						});
						getPopKarteAlle_2.fail(function() {
							window.apf.melde("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
						});
					},
					"nein, nicht verschieben": function() {
						$(this).dialog("close");
						// overlay entfernen...
						if (window.apf.olmap.getLayersByName('Populationen')) {
							var layers = window.apf.olmap.getLayersByName('Populationen');
                            _.each(layers, function(layer) {
                                window.apf.olmap.map.removeLayer(layer);
                            });
						}
						// ...und neu erstellen
						window.apf.olmap.erstellePopSymbole(popliste, popid_markiert, true);
					}
				}
			});
		}
	});

	// selectfeature (Infoblase) soll nicht durch dragfeature blockiert werden
	// Quelle: //stackoverflow.com/questions/6953907/make-marker-dragable-and-clickable
	dragControl.handlers['drag'].stopDown = false;
	dragControl.handlers['drag'].stopUp = false;
	dragControl.handlers['drag'].stopClick = false;
	dragControl.handlers['feature'].stopDown = false;
	dragControl.handlers['feature'].stopUp = false;
	dragControl.handlers['feature'].stopClick = false;

	// dragControl einschalten
	window.apf.olmap.addControl(dragControl);
	dragControl.activate();

	// overlay zur Karte hinzufügen
	window.apf.olmap.addLayer(overlay_pop);

	// SelectControl erstellen (mit dem Eventlistener öffnet das die Infoblase) und zur Karte hinzufügen
	window.selectControlPop = new OpenLayers.Control.SelectFeature(overlay_pop, {clickout: true});
	window.apf.olmap.addControl(window.selectControlPop);
	window.selectControlPop.activate();*/
	pop_symbole_erstellt.resolve();
	return pop_symbole_erstellt.promise();
};

window.apf.olmap.erstellePopNr = function(pop_liste, visible) {
	'use strict';

	if (visible === null) {
		visible = true;
	}

	var pop_nr_erstellt = $.Deferred(),
        pop_nr_layer,
        markers = [],
		marker,
        marker_style;

    // styles für pop_namen_layer definieren
	marker_style = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/leer.png'
  		}))
	});

    _.each(pop_liste.rows, function(pop) {
        // marker erstellen...
        marker = new ol.Feature({
    		geometry: new ol.geom.Point([pop.PopXKoord, pop.PopYKoord]),
			name: pop.PopNr.toString() || '?'
    	});
    	marker.setStyle(marker_style);

    	// ...und in Array speichern
        markers.push(marker);
    });

    // layer für Marker erstellen
	pop_nr_layer = new ol.layer.Vector({
		title: 'Populationen Nummern',
		source: new ol.source.Vector({
				features: markers
			}),
		style: (function() {
		  	var textStroke = new ol.style.Stroke({
		    	color: 'white',
		    	width: 7
		  	});
		  	var textFill = new ol.style.Fill({
		    	color: 'black'
		  	});
		  	return function(feature, resolution) {
			    return [new ol.style.Style({
			      	text: new ol.style.Text({
			      		font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
			        	text: feature.get('name'),
			        	fill: textFill,
			        	stroke: textStroke
			      	})
		    	})];
			};
		})()
	});

    pop_nr_layer.set('visible', visible);
    pop_nr_layer.set('kategorie', 'AP Flora');
    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(pop_nr_layer);

	pop_nr_erstellt.resolve();
	return pop_nr_erstellt.promise();
};

window.apf.olmap.erstellePopNamen = function(pop_liste) {
	'use strict';
	var pop_namen_erstellt = $.Deferred(),
		pop_namen_layer,
		markers = [],
		marker,
		marker_style;

	// styles für pop_namen_layer definieren
	marker_style = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/leer.png'
  		}))
	});

    _.each(pop_liste.rows, function(pop) {
        // marker erstellen...
        marker = new ol.Feature({
    		geometry: new ol.geom.Point([pop.PopXKoord, pop.PopYKoord]),
			name: pop.PopName || '(kein Name)'
    	});
    	marker.setStyle(marker_style);

        // ...und in Array speichern
        markers.push(marker);
    });

    // layer für Marker erstellen
	pop_namen_layer = new ol.layer.Vector({
		title: 'Populationen Namen',
		source: new ol.source.Vector({
				features: markers
			}),
		style: (function() {
		  	var textStroke = new ol.style.Stroke({
		    	color: 'white',
		    	width: 7
		  	});
		  	var textFill = new ol.style.Fill({
		    	color: 'black'
		  	});
		  	return function(feature, resolution) {
			    return [new ol.style.Style({
			      	text: new ol.style.Text({
			      		font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
			        	text: feature.get('name'),
			        	fill: textFill,
			        	stroke: textStroke
			      	})
		    	})];
			};
		})()
	});
	pop_namen_layer.set('visible', false);
    pop_namen_layer.set('kategorie', 'AP Flora');

    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(pop_namen_layer);

	pop_namen_erstellt.resolve();
	return pop_namen_erstellt.promise();
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

// nimmt drei Variabeln entgegen: 
// TPopListe: Die Liste der darzustellenden Teilpopulationen
// tpopid_markiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll
window.apf.olmap.erstelleTPopNr = function(tpop_liste, tpopid_markiert, visible) {
	'use strict';

	if (visible === null) {
		visible = true;
	}

	var tpopnr_erstellt = $.Deferred(),
		tpop_nr_layer,
		markers = [],
		marker,
		marker_style,
		my_label;

	// styles definieren
	marker_style = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/leer.png'
  		}))
	});

    _.each(tpop_liste.rows, function(tpop) {
        // tooltip bzw. label vorbereiten: nullwerte ausblenden
        if (tpop.PopNr && tpop.TPopNr) {
            my_label = tpop.PopNr + '/' + tpop.TPopNr;
        } else if (tpop.PopNr) {
            my_label = tpop.PopNr + '/?';
        } else if (tpop.TPopNr) {
            my_label = '?/' + tpop.TPopNr;
        } else {
            my_label = '?/?';
        }

        // marker erstellen...
        marker = new ol.Feature({
    		geometry: new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]),
			name: my_label
    	});
    	marker.setStyle(marker_style);

        // ...und in Array speichern
        markers.push(marker);
    });

    // layer für Marker erstellen
	tpop_nr_layer = new ol.layer.Vector({
		title: 'Teilpopulationen Nummern',
		source: new ol.source.Vector({
				features: markers
			}),
		style: (function() {
		  	var textStroke = new ol.style.Stroke({
		    	color: 'white',
		    	width: 7
		  	});
		  	var textFill = new ol.style.Fill({
		    	color: 'black'
		  	});
		  	return function(feature, resolution) {
			    return [new ol.style.Style({
			      	text: new ol.style.Text({
			      		font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
			        	text: feature.get('name'),
			        	fill: textFill,
			        	stroke: textStroke
			      	})
		    	})];
			};
		})()
	});
    tpop_nr_layer.set('visible', visible);
    tpop_nr_layer.set('kategorie', 'AP Flora');
    
    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(tpop_nr_layer);

	tpopnr_erstellt.resolve();
	return tpopnr_erstellt.promise();
};

// nimmt drei Variabeln entgegen: 
// TPopListe: Die Liste der darzustellenden Teilpopulationen
// tpopid_markiert: die ID der zu markierenden TPop
// visible: Ob das Layer sichtbar sein soll (wird offenbar nicht gebraucht)
window.apf.olmap.erstelleTPopNamen = function(tpop_liste, tpopid_markiert, visible) {
	'use strict';

	if (visible === null) {
		visible = true;
	}

	var tpopnamen_erstellt = $.Deferred(),
		tpop_namen_layer,
		markers = [],
		marker,
		marker_style;

	// styles für pop_namen_layer definieren
	marker_style = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 1,
		    src: 'img/leer.png'
  		}))
	});

    _.each(tpop_liste.rows, function(tpop) {
    	// marker erstellen...
        marker = new ol.Feature({
    		geometry: new ol.geom.Point([tpop.TPopXKoord, tpop.TPopYKoord]),
			name: tpop.TPopFlurname || '(kein Name)'
    	});
    	marker.setStyle(marker_style);

        // ...und in Array speichern
        markers.push(marker);
    });

    // layer für Marker erstellen
	tpop_namen_layer = new ol.layer.Vector({
		title: 'Teilpopulationen Namen',
		source: new ol.source.Vector({
				features: markers
			}),
		style: (function() {
		  	var textStroke = new ol.style.Stroke({
		    	color: 'white',
		    	width: 7
		  	});
		  	var textFill = new ol.style.Fill({
		    	color: 'black'
		  	});
		  	return function(feature, resolution) {
			    return [new ol.style.Style({
			      	text: new ol.style.Text({
			      		font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
			        	text: feature.get('name'),
			        	fill: textFill,
			        	stroke: textStroke
			      	})
		    	})];
			};
		})()
	});
	tpop_namen_layer.set('visible', visible);
    tpop_namen_layer.set('kategorie', 'AP Flora');

    // ...und der Karte hinzufügen
    window.apf.olmap.map.addLayer(tpop_namen_layer);

	tpopnamen_erstellt.resolve();
	return tpopnamen_erstellt.promise();
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
        gmap,
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
	gmap = new google.maps.Map(document.getElementById("google_karten_div"), options);
	window.apf.gmap.map = gmap;
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
            map: gmap,
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
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + tpop.TPopId + "')\">Formular öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + tpop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListener(gmap, marker_tpop, contentstring_tpop);
    });
	marker_options_tpop = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m8.png",
				width: 53
			}]
	};
	marker_cluster_tpop = new MarkerClusterer(gmap, markers_tpop, marker_options_tpop);
	
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(gmap, markerTPop, contentStringTPop) {
		google.maps.event.addListener(markerTPop, 'click', function() {
			infowindow_tpop.setContent(contentStringTPop);
			infowindow_tpop.open(gmap, markerTPop);
		});
	}

	// für alle Beob Marker erstellen
	window.markersBeob = [];
    _.each(beob_liste.rows, function(beob) {
        datum = beob.Datum;
        latlng2 = new google.maps.LatLng(beob.Lat, beob.Lng);
        if (anz_beob === 1) {
            // gmap.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
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
            map: gmap,
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
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeob('" + beob.NO_NOTE + "')\">Formular öffnen<\/a></p>"+
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeobInNeuemTab('" + beob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
            '</div>'+
            '</div>';
        makeListenerBeob(gmap, marker_beob, contentstring_beob);
    });
	// KEIN MARKERCLUSTERER: er verhindert das Entfernen einzelner Marker!
	// ausserdem macht er es schwierig, eng liegende Marker zuzuordnen
	
	// diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListenerBeob(gmap, markerBeob, contentStringBeob) {
		google.maps.event.addListener(markerBeob, 'click', function() {
			infowindow_beob.setContent(contentStringBeob);
			infowindow_beob.open(gmap, markerBeob);
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
			BeobNächsteTPop.done(function(data) {
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
				window.apf.melde("Fehler: Die Beobachtung wurde nicht zugeordnet");
			});
		});
	}

	if (anz_tpop + anz_beob === 1) {
		// gmap.fitbounds setzt zu hohen zoom, wenn nur ein Punkt dargestellt wird > verhindern
		gmap.setCenter(latlng);
		gmap.setZoom(18);
	} else {
		// Karte auf Ausschnitt anpassen
		gmap.fitBounds(bounds);
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
            "<p><a href=\"#\" onclick=\"window.apf.öffneBeob('" + beob.NO_NOTE + "')\">Formular öffnen<\/a></p>"+
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
            "<p><a href=\"#\" onclick=\"window.apf.öffneTPopBeob('" + tpop_beob.NO_NOTE + "')\">Formular öffnen<\/a></p>"+
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

window.apf.gmap.verorteTPop = function(TPop) {
	'use strict';
	var anzTPop,
        infowindow,
        lat,
        lng,
        latlng,
        ZoomLevel,
        options,
        map,
        mapcanvas,
        verorted,
        TPopId,
        latlng2,
        marker,
        contentString,
        mcOptions,
        markerCluster,
        tpop_beschriftung,
        myFlurname;
	// vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	window.apf.zeigeFormular("google_karte");
	window.apf.gmap.markers_array = [];
	infowindow = new google.maps.InfoWindow();
	if (TPop && TPop.TPopXKoord && TPop.TPopYKoord) {
		// Wenn Koordinaten vorhanden, Lat und Lng ergänzen
		lat = window.apf.CHtoWGSlat(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
		lng = window.apf.CHtoWGSlng(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
		ZoomLevel = 15;
		verorted = true;
	} else {
		// sonst auf Zürich zentrieren
		lat = 47.360566;
		lng = 8.542829;
		ZoomLevel = 12;
		verorted = false;
	}
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: ZoomLevel,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	mapcanvas = $('#google_karten_div');
	map = new google.maps.Map(mapcanvas[0],options);
	window.apf.gmap.map = map;
	if (verorted === true) {
		tpop_beschriftung = window.apf.beschrifteTPopMitNrFürKarte(TPop.PopNr, TPop.TPopNr);
		marker = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: tpop_beschriftung,
			icon: "img/flora_icon_rot.png",
			draggable: true
		});
		// Marker in Array speichern, damit er gelöscht werden kann
		window.apf.gmap.markers_array.push(marker); 
		myFlurname = TPop.TPopFlurname || '(kein Flurname)';
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + myFlurname + '</h3>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + TPop.TPopId + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"window.apf.öffneTPopInNeuemTab('" + TPop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
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
		google.maps.event.addListener(marker, "dragend", function(event) {
			window.apf.gmap.SetLocationTPop(event.latLng, map, marker, TPop);
		});
	}
	google.maps.event.addListener(map, 'click', function(event) {
		window.apf.gmap.clearMarkers(event.latLng, map, marker, TPop);
	});
};

window.apf.gmap.clearMarkers = function(location, map, marker, TPop) {
	'use strict';
	var title;
	// title muss String sein
	if (TPop && TPop.TPopFlurname) {
		title = TPop.TPopFlurname;
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
		window.apf.gmap.SetLocationTPop(event.latLng, map, marker, TPop);
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
	updateTPop_3.done(function() {
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
		updateTPop_4.done(function() {
			window.apf.gmap.clearInfoWindows();
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<div id="bodyContent" class="GmInfowindow">'+
				'<h3>' + title + '</h3>'+
				'<p>Koordinaten: ' + X + ' / ' + Y + '</p>'+
				"<p><a href=\"#\" onclick=\"window.apf.öffneTPop('" + localStorage.tpop_id + "')\">Formular öffnen<\/a></p>"+
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
			window.apf.melde("Fehler: Die Y-Koordinate wurde nicht übernommen (die X-Koordinate offenbar schon");
		});
	});
	updateTPop_3.fail(function() {
		window.apf.melde("Fehler: Die Koordinaten wurden nicht übernommen");
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
		// globale Variabeln setzen
		window.apf.setzeWindowAp(ap_id);
		// Dem Feld im Formular den Wert zuweisen
		$("#ap_waehlen").val(ap_id);
		if (uri.getQueryParamValue('tpop')) {
			// globale Variabeln setzen
			window.apf.setzeWindowPop(uri.getQueryParamValue('pop'));
			window.apf.setzeWindowTpop(uri.getQueryParamValue('tpop'));
			var tpopfeldkontr_id = uri.getQueryParamValue('tpopfeldkontr');
			if (tpopfeldkontr_id) {
				// globale Variabeln setzen
				window.apf.setzeWindowTpopfeldkontr(tpopfeldkontr_id);
				// markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopfeldkontr_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_tpopfeldkontr();
			} else if (uri.getQueryParamValue('tpopfreiwkontr')) {
				// globale Variabeln setzen
				window.apf.setzeWindowTpopfeldkontr(uri.getQueryParamValue('tpopfreiwkontr'));
				// markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopfreiwkontr_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				localStorage.tpopfreiwkontr = true;
				window.apf.initiiere_tpopfeldkontr();
			} else if (uri.getQueryParamValue('tpopmassn')) {
				// globale Variabeln setzen
				window.apf.setzeWindowTpopmassn(uri.getQueryParamValue('tpopmassn'));
				// markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.tpopmassn_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_tpopmassn();
			} else if (uri.getQueryParamValue('tpopber')) {
				// globale Variabeln setzen
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
				// globale Variabeln setzen
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
			// globale Variabeln setzen
			window.apf.setzeWindowPop(uri.getQueryParamValue('pop'));
			if (uri.getQueryParamValue('popber')) {
				// globale Variabeln setzen
				window.apf.setzeWindowPopber(uri.getQueryParamValue('popber'));
				// markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
				// Die Markierung wird im load-Event wieder entfernt
				window.apf.popber_zeigen = true;
				// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				window.apf.initiiere_popber();
			} else if (uri.getQueryParamValue('popmassnber')) {
				// globale Variabeln setzen
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
			// globale Variabeln setzen
			window.apf.setzeWindowApziel(uri.getQueryParamValue('apziel'));
			if (uri.getQueryParamValue('zielber')) {
				// globale Variabeln setzen
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
			// globale Variabeln setzen
			window.apf.setzeWindowErfkrit(uri.getQueryParamValue('erfkrit'));
			// markieren, dass nach dem loaded-event im Tree die erfkrit angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.erfkrit_zeigen = true;
		} else if (uri.getQueryParamValue('jber')) {
			// globale Variabeln setzen
			window.apf.setzeWindowJber(uri.getQueryParamValue('jber'));
			// markieren, dass nach dem loaded-event im Tree die jber angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.jber_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_jber();
		} else if (uri.getQueryParamValue('jber_uebersicht')) {
			// globale Variabeln setzen
			window.apf.setzeWindowJberUebersicht(uri.getQueryParamValue('jber_uebersicht'));
			// markieren, dass nach dem loaded-event im Tree die jber_uebersicht angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.jber_übersicht_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_jber_uebersicht();
		} else if (uri.getQueryParamValue('ber')) {
			// globale Variabeln setzen
			window.apf.setzeWindowBer(uri.getQueryParamValue('ber'));
			// markieren, dass nach dem loaded-event im Tree die ber angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.ber_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_ber();
		} else if (uri.getQueryParamValue('idealbiotop')) {
			// globale Variabeln setzen
			window.apf.setzeWindowIdealbiotop(uri.getQueryParamValue('idealbiotop'));
			// markieren, dass nach dem loaded-event im Tree die idealbiotop angezeigt werden soll 
			// Die Markierung wird im load-Event wieder entfernt
			window.apf.idealbiotop_zeigen = true;
			// direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			window.apf.initiiere_idealbiotop();
		} else if (uri.getQueryParamValue('assozarten')) {
			// globale Variabeln setzen
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

window.apf.onfeatureselectDetailpläneShp = function(feature) {
	'use strict';
	var popup = new OpenLayers.Popup.FramedCloud(
			feature.attributes.OBJECTID,
			feature.geometry.getBounds().getCenterLonLat(),
			null,
			"<div style='font-size:.8em; font-weight:bold'>Detailplan<br></div>" 
				+ "<div style='font-size:.8em;'>ObjektId: "
				+ feature.attributes.OBJECTID + "<br>Bemerkun_1: "
			 	+ feature.attributes.Bemerkun_1 + "<br>Fläche: "
			 	+ feature.attributes.Fläche + "</div>",
			null,
			true
		);
	feature.popup = popup;
	window.apf.olmap.addPopup(popup);
};

window.apf.onfeatureunselectDetailpläneShp = function(feature) {
	'use strict';
	window.apf.olmap.removePopup(feature.popup);
};

window.apf.initiiereOlmap = function() {
	'use strict';
	// Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	//OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	//var zh_bbox_1903 = new ol.Extent(669000, 222000, 717000, 284000);

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

    var zh_svo_farbig_layer = new ol.layer.Tile({
            title: 'SVO farbig',
            source: new ol.source.TileWMS({
                url: '//wms.zh.ch/FnsSVOZHWMS',
                //crossOrigin: 'anonymous',
                params: {
                    'layers': 'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr',
                    'transparent': true,
                    'visibility': false,
                    //'singleTile': true,
                    'opacity': 0.7
                }
            })
        });
    	zh_svo_farbig_layer.set('visible', false);
        zh_svo_farbig_layer.set('kategorie', 'ZH Sachinformationen');

    var zh_svo_grau_layer = new ol.layer.Tile({
            title: 'SVO schwarz/weiss',
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
    	zh_svo_grau_layer.set('visible', false);
        zh_svo_grau_layer.set('kategorie', 'ZH Sachinformationen');

    // error 401 (Authorization required)
    var zh_lichte_wälder_layer = new ol.layer.Tile({
            title: 'Lichte Wälder',
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
    	zh_lichte_wälder_layer.set('visible', false);
        zh_lichte_wälder_layer.set('kategorie', 'ZH Sachinformationen');

    // error 401 (Authorization required)
    var zh_ortholuftbild_layer = new ol.layer.Tile({
            title: 'Luftbild',
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
    	zh_ortholuftbild_layer.set('visible', false);
        zh_ortholuftbild_layer.set('kategorie', 'ZH Hintergrund');

    // error 401 (Authorization required)
    var zh_ortholuftbild2_layer = new ol.layer.Tile({
            title: 'Luftbild 2',
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
        zh_ortholuftbild2_layer.set('visible', false);
        zh_ortholuftbild2_layer.set('kategorie', 'ZH Hintergrund');

    // error 401 (Authorization required)
    var zh_höhenmodell_layer = new ol.layer.Tile({
            title: 'Höhenmodell',
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
        zh_höhenmodell_layer.set('visible', false);
        zh_höhenmodell_layer.set('kategorie', 'ZH Sachinformationen');

	// Zunächst alle Layer definieren
    var layers = [
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
        zh_svo_grau_layer
    ];
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


    /*  name_layer = new ol.layer.Tile({
            title: '',
            source: new ol.source.TileWMS({
                url: '',
                params: {
                    'layers': '',
                    'transparent': true,
                    'isBaseLayer': false,
                    'visibility': false,
                    'singleTile': true
                }
            })
        })*/

	// allfällige Apflora-Ebenen entfernen
	window.apf.olmap.entferneAlleApfloraLayer();

	// Karte nur aufbauen, wenn dies nicht schon passiert ist
	if (!window.apf.olmap.map) {
        window.apf.olmap.map = new ga.Map({
            target: 'ga_karten_div',
            layers: layers,
            view: new ol.View2D({
                resolution: 4,    // ehem: zoom 4
                center: [693000, 253000]
            })
        });

		window.apf.olmap.map.on('singleclick', function(event) {
			console.log('click on map');
			var pixel = event.pixel,
				coordinate = event.coordinate;
			window.apf.olmap.zeigeFeatureInfo(pixel, coordinate);
		});

		// change mouse cursor when over marker
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

        window.apf.olmap.initiiereLayertree();

        //Mouse Position
        var mousePositionControl = new ol.control.MousePosition({
            //This is the format we want the coordinate in
            //The number argument in createStringXY is the number of decimal places
            coordinateFormat: ol.coordinate.createStringXY(0),
            projection: "EPSG:21781",
            undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate
        });
        window.apf.olmap.map.addControl(mousePositionControl);

        //Full Screen
        var myFullScreenControl = new ol.control.FullScreen();
        window.apf.olmap.map.addControl(myFullScreenControl);
        // auf Deutsch beschriften
        $('#ga_karten_div').find('.ol-full-screen').find('span[role="tooltip"]').html('Vollbild wechseln');

		// Layer für detailpläne aufbauen
		// aber nur beim ersten mal

		if (!window.detailplaene_shp) {
            // TODO: mit OL3 machen
			/*
             var detailplaene_stylemap = new OpenLayers.StyleMap({
             "default": new OpenLayers.Style({
             fillColor: "#fa3a0f",
             fillOpacity: 0,
             strokeColor: "#fa3a0f",
             strokeOpacity: 1,
             strokeWidth: 1
             }),
             "select": new OpenLayers.Style({
             fillColor: "#fa3a0f",
             fillOpacity: 0.3,
             strokeColor: "#fa3a0f",
             strokeOpacity: 1,
             strokeWidth: 1
             })
             });

             // erst daten auslesen
             var detailplaene_shapefile = new Shapefile({
				shp: "shp/detailplaene.shp",
				dbf: "shp/detailplaene.dbf"
			}, function(data) {
				// vektorlayer schaffen
				window.detailplaene_shp = new ol.layer.Vector("Detailpläne", {
					styleMap: detailplaene_stylemap,
					eventListeners: {
						"featureselected": function(evt) {
							console.log("feature selected");
							window.apf.onfeatureselectDetailpläneShp(evt.feature);
						},
						"featureunselected": function(evt) {
							window.apf.onfeatureunselectDetailpläneShp(evt.feature);
						}
					}
				});
				// Informationen in GeoJSON bereitstellen
				var parser = new OpenLayers.Format.GeoJSON();
				var detailplaene_popup_features = parser.read(data.geojson);
				window.detailplaene_shp.addFeatures(detailplaene_popup_features);
				// Layer hinzufügen
				window.apf.olmap.addLayer(window.detailplaene_shp);
				// select feature controll für detailpläne schaffen
				var detailplaene_selector = new OpenLayers.Control.SelectFeature(window.detailplaene_shp, {
					clickout: true
				});
				window.apf.olmap.addControl(detailplaene_selector);
				detailplaene_selector.activate();
			});*/
		}




		// messen
		// style the sketch fancy
        // TODO: auf ol3 upgraden
		/*var sketchSymbolizers = {
			"Point": {
				pointRadius: 4,
				graphicName: "square",
				fillColor: "white",
				fillOpacity: 0.4,
				strokeWidth: 1,
				strokeOpacity: 1,
				//strokeColor: "#333333"
				strokeColor: "red"
			},
			"Line": {
				strokeWidth: 3,
				strokeOpacity: 1,
				strokeColor: "red",
				strokeDashstyle: "dash"
			},
			"Polygon": {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: "red",
				fillColor: "red",
				fillOpacity: 0.3
			}
		};*/

		/*var style = new OpenLayers.Style();
		style.addRules([
			new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);
		var styleMap = new OpenLayers.StyleMap({"default": style});*/

		// TODO: Neue version measure controls einfügen

		/*measureControls = {
			line: new OpenLayers.Control.Measure(
				OpenLayers.Handler.Path, {
					persist: true,
					handlerOptions: {
						layerOptions: {
							styleMap: styleMap
						}
					}
				}
			),
			polygon: new OpenLayers.Control.Measure(
				OpenLayers.Handler.Polygon, {
					persist: true,
					handlerOptions: {
						layerOptions: {
							styleMap: styleMap
						}
					}
				}
			)
		};
		
		var controlMessung;
		for(var key in measureControls) {
			controlMessung = measureControls[key];
			controlMessung.events.on({
				"measure": window.apf.handleMeasurements,
				"measurepartial": window.apf.handleMeasurements
			});
			window.apf.olmap.addControl(controlMessung);
		}*/
	}
	$('#karteSchieben').checked = true;	// scheint nicht zu funktionieren?
};

// baut das html für den layertree auf
// Muster:
// <li><input type="checkbox" id="olmap_layertree_Ebene 1"><label for="olmap_layertree_Ebene 1">Ebene 1</label></li><hr>
window.apf.olmap.initiiereLayertree = function() {
	'use strict';
    var layertitel,
        visible,
        kategorie,
        html_ch_hintergrund = '<h3>CH Hintergrund</h3><div>',
        html_ch_sachinfos = '<h3>CH Sachinformationen</h3><div>',
        html_ch_biotopinv = '<h3>CH Biotopinventare</h3><div>',
        html_zh_sachinfos = '<h3>ZH Sachinformationen</h3><div>',
        html_apflora = '<h3>ZH AP Flora</h3><div>',
        html_prov,
        html,
        $olmap_layertree_layers = $('#olmap_layertree_layers'),
        $ga_karten_div_accordion = $("#ga_karten_div").find(".accordion"),
        layers = window.apf.olmap.map.getLayers().getArray();

    // accordion zerstören, damit es neu aufgebaut werden kann
    // um es zu zerstören muss es initiiert sein!
	$ga_karten_div_accordion
		.accordion({collapsible:true, active: false, heightStyle: 'content'})
		.accordion("destroy");

    _.each(layers, function(layer, index) {
        layertitel = layer.get('title');
        visible = layer.get('visible');
        kategorie = layer.get('kategorie');
        html_prov = '<li><input type="checkbox" class="olmap_layertree_checkbox" id="olmap_layertree_' + layertitel + '" value="' + index + '"';
        // sichtbare Layer sollen gecheckt sein
        if (visible) {
            html_prov += ' checked="checked"';
        }
        html_prov += '>';
        html_prov += '<label for="olmap_layertree_' + layertitel + '">' + layertitel + '</label></li>';
        html_prov += '<hr>';
        switch (kategorie) {
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
            default:
                html_zh_sachinfos += html_prov;
        }
    });
    // letztes <hr> abschneiden
    // aber nur, wenn layers ergänzt wurden
    // wenn keine Layers ergänzt wurden: Layertitel nicht anzeigen (nur bei html_apflora von Bedeutung)
    html_ch_hintergrund = html_ch_hintergrund.substring(0, (html_ch_hintergrund.length - 4));
    html_ch_sachinfos = html_ch_sachinfos.substring(0, (html_ch_sachinfos.length - 4));
    html_ch_biotopinv = html_ch_biotopinv.substring(0, (html_ch_biotopinv.length - 4));
    html_zh_sachinfos = html_zh_sachinfos.substring(0, (html_zh_sachinfos.length - 4));
    if (html_apflora !== '<h3>ZH AP Flora</h3><div>') {
    	html_apflora = html_apflora.substring(0, (html_apflora.length - 4));
    } else {
    	html_apflora = '';
    }
    // unteraccordions abschliessen
    html_ch_hintergrund += '</div>';
    html_ch_sachinfos += '</div>';
    html_ch_biotopinv += '</div>';
    html_zh_sachinfos += '</div>';
    html_apflora += '</div>';
    // alles zusammensetzen
    html = html_ch_hintergrund + html_ch_sachinfos + html_ch_biotopinv + html_zh_sachinfos + html_apflora;
    // und einsetzen
    $olmap_layertree_layers.html(html);
    // erst jetzt initiieren, sonst stimmt die Höhe nicht
    $ga_karten_div_accordion.accordion({collapsible:true, active: false, heightStyle: 'content'});
    // Maximalgrösse des Layertree begrenzen
    $olmap_layertree_layers.css('max-height', window.apf.berechneOlmapLayertreeMaxhöhe);
};

window.apf.olmap.addInteraction = function() {
    var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
    draw = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (type)
    });
    window.apf.olmap.map.addInteraction(draw);

    draw.on('drawstart',
        function(evt) {
            // set sketch
            sketch = evt.feature;
            sketchElement = document.createElement('li');
            var outputList = document.getElementById('measureOutput');

            if (outputList.childNodes) {
                outputList.insertBefore(sketchElement, outputList.firstChild);
            } else {
                outputList.appendChild(sketchElement);
            }
        }, this);

    draw.on('drawend',
        function(evt) {
            // unset sketch
            sketch = null;
            sketchElement = null;
        }, this);
};

// wird offenbar nicht benutzt
window.apf.wähleMitPolygon = function() {
	'use strict';
    // TODO: Auf OL3 upgraden
	// den vorbereiteten drawControl aktivieren
	window.drawControl.activate();
	// allfällige Messung deaktivieren
	measureControls['line'].deactivate();
	measureControls['polygon'].deactivate();
	// allfällige bisherige Auswahl entfernen
	window.apf.olmap.auswahlPolygonLayer.removeAllFeatures();
	// allfälliges Ergebnisfenster ausblenden
	$("#ergebnisAuswahl").css("display", "none");
	delete window.apf.tpop_id_array;
	delete window.tpop_id_liste;
};

window.apf.olmap.schliesseLayeroptionen = function() {
	'use strict';
    $("#olmap_layertree").accordion("option", "active", false);
};

window.apf.handleMeasurements = function(event) {
	'use strict';
    // TODO: auf OL3 portieren
	var geometry = event.geometry;
	var units = event.units;
	var order = event.order;
	var measure = event.measure;
	var element = document.getElementById('ergebnisMessung');
	var out = "";
	if(order == 1) {
		out += measure.toFixed(3) + " " + units;
	} else {
		out += measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
	}
	element.innerHTML = out;
};

window.apf.messe = function(element) {
	'use strict';
    // TODO: auf OL3 portieren
	for(key in measureControls) {
		var controlMessung = measureControls[key];
		if(element.value == key && element.checked) {
			controlMessung.activate();
		} else {
			controlMessung.deactivate();
			$("#ergebnisMessung").text("");
		}
	}
	// einen allfällig aktiven drawControl deaktivieren
	window.apf.deaktiviereGeoAdminAuswahl();
	// und allfällig verbliebene Auswahlpolygone entfernen
	window.apf.olmap.auswahlPolygonLayer.removeAllFeatures();
};

window.apf.erstelleGemeindeliste = function() {
	'use strict';
	if (!window.Gemeinden) {
		var getGemeinden = $.ajax({
			type: 'get',
			url: 'php/gemeinden.php',
			dataType: 'json'
		});
		getGemeinden.done(function(data) {
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
			window.apf.melde("Fehler: Die Liste der Gemeinden konnte nicht bereitgestellt werden");
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
			insertAp.done(function() {
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
				window.apf.melde("Fehler: Keine Daten für Programme erhalten");
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

window.apf.kopiereKoordinatenInPop = function(TPopXKoord, TPopYKoord) {
	'use strict';
	// prüfen, ob X- und Y-Koordinaten vergeben sind
	if (TPopXKoord > 100000 && TPopYKoord > 100000) {
		// Koordinaten der Pop nachführen
		var updatePop_3 = $.ajax({
			type: 'post',
			url: 'php/pop_update.php',
			dataType: 'json',
			data: {
				"id": localStorage.pop_id,
				"Feld": "PopXKoord",
				"Wert": TPopXKoord,
				"user": sessionStorage.User
			}
		});
		updatePop_3.done(function() {
			var updatePop_4 = $.ajax({
				type: 'post',
				url: 'php/pop_update.php',
				dataType: 'json',
				data: {
					"id": localStorage.pop_id,
					"Feld": "PopYKoord",
					"Wert": TPopYKoord,
					"user": sessionStorage.User
				}
			});
			updatePop_4.done(function() {
				$("#kopiereKoordinatenInPopRueckmeldung").fadeIn('slow');
				setTimeout(function() {
					$("#kopiereKoordinatenInPopRueckmeldung").fadeOut('slow');
				}, 3000);
			});
			updatePop_4.fail(function() {
				window.apf.melde("Fehler: Y-Koordinate wurde nicht kopiert (die X-Koordinate offenbar schon");
			});
		});
		updatePop_3.fail(function() {
			window.apf.melde("Fehler: Koordinaten wurden nicht kopiert");
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
		getAnmeldung.done(function(data) {
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
		window.apf["window.apf.initiiere_tpopfeldkontr"]();
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
		window.apf["window.apf.initiiere_tpopfeldkontr"]();
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
	deleteAp.done(function() {
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
		window.apf.melde("Fehler: Das Programm wurde nicht gelöscht");
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

	insertMultiple.done(function() {
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
			$.when(window.apf.erstelle_tree(window.apf.olmap.erstellePopSymbole))
				.then(function() {
					$("#tree").jstree("select_node", "[typ='" + typ + "']#" + id);
				});
		}
	});

	insertMultiple.fail(function() {
		window.apf.melde("Fehler: Wiederherstellung gescheitert");
	});
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

/*435 Zeilen lang
* jQuery File Download Plugin v1.4.2 
*
* //www.johnculviner.com
*
* Copyright (c) 2013 - John Culviner
*
* Licensed under the MIT license:
*   //www.opensource.org/licenses/mit-license.php
*
* !!!!NOTE!!!!
* You must also write a cookie in conjunction with using this plugin as mentioned in the orignal post:
* //johnculviner.com/jquery-file-download-plugin-for-ajax-like-feature-rich-file-downloads/
* !!!!NOTE!!!!
*/

(function($, window){
	// i'll just put them here to get evaluated on script load
	var htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
	var htmlSpecialCharsPlaceHolders = {
				'<': 'lt;',
				'>': 'gt;',
				'&': 'amp;',
				'\r': "#13;",
				'\n': "#10;",
				'"': 'quot;',
				"'": 'apos;' /*single quotes just to be safe*/
	};

$.extend({
    //
    //$.fileDownload('/path/to/url/', options)
    //  see directly below for possible 'options'
    fileDownload: function(fileUrl, options) {

        //provide some reasonable defaults to any unspecified options below
        var settings = $.extend({

            //
            //Requires jQuery UI: provide a message to display to the user when the file download is being prepared before the browser's dialog appears
            //
            preparingMessageHtml: null,

            //
            //Requires jQuery UI: provide a message to display to the user when a file download fails
            //
            failMessageHtml: null,

            //
            //the stock android browser straight up doesn't support file downloads initiated by a non GET: //code.google.com/p/android/issues/detail?id=1780
            //specify a message here to display if a user tries with an android browser
            //if jQuery UI is installed this will be a dialog, otherwise it will be an alert
            //
            androidPostUnsupportedMessageHtml: "Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.",

            //
            //Requires jQuery UI: options to pass into jQuery UI Dialog
            //
            dialogOptions: { modal: true },

            //
            //a function to call while the dowload is being prepared before the browser's dialog appears
            //Args:
            //  url - the original url attempted
            //
            prepareCallback: function(url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  url - the original url attempted
            //
            successCallback: function(url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  responseHtml    - the html that came back in response to the file download. this won't necessarily come back depending on the browser.
            //                      in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
            //                      server's error message with a "helpful" IE built in message
            //  url             - the original url attempted
            //
            failCallback: function(responseHtml, url) { },

            //
            // the HTTP method to use. Defaults to "GET".
            //
            httpMethod: "GET",

            //
            // if specified will perform a "httpMethod" request to the specified 'fileUrl' using the specified data.
            // data must be an object (which will be $.param serialized) or already a key=value param string
            //
            data: null,

            //
            //a period in milliseconds to poll to determine if a successful file download has occured or not
            //
            checkInterval: 100,

            //
            //the cookie name to indicate if a file download has occured
            //
            cookieName: "fileDownload",

            //
            //the cookie value for the above name to indicate that a file download has occured
            //
            cookieValue: "true",

            //
            //the cookie path for above name value pair
            //
            cookiePath: "/",

            //
            //the title for the popup second window as a download is processing in the case of a mobile browser
            //
            popupWindowTitle: "Initiating file download...",

            //
            //Functionality to encode HTML entities for a POST, need this if data is an object with properties whose values contains strings with quotation marks.
            //HTML entity encoding is done by replacing all &,<,>,',",\r,\n characters.
            //Note that some browsers will POST the string htmlentity-encoded whilst others will decode it before POSTing.
            //It is recommended that on the server, htmlentity decoding is done irrespective.
            //
            encodeHTMLEntities: true
            
        }, options);

        var deferred = new $.Deferred();

        //Setup mobile browser detection: Partial credit: //detectmobilebrowser.com/
        var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

        var isIos;                  //has full support of features in iOS 4.0+, uses a new window to accomplish this.
        var isAndroid;              //has full support of GET features in 4.0+ by using a new window. Non-GET is completely unsupported by the browser. See above for specifying a message.
        var isOtherMobileBrowser;   //there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

        if (/ip(ad|hone|od)/.test(userAgent)) {

            isIos = true;

        } else if (userAgent.indexOf('android') !== -1) {

            isAndroid = true;

        } else {

            isOtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

        }

        var httpMethodUpper = settings.httpMethod.toUpperCase();

        if (isAndroid && httpMethodUpper !== "GET") {
            //the stock android browser straight up doesn't support file downloads initiated by non GET requests: //code.google.com/p/android/issues/detail?id=1780

            if ($().dialog) {
                $("<div>").html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);
            } else {
                alert(settings.androidPostUnsupportedMessageHtml);
            }

            return deferred.reject();
        }

        var $preparingDialog = null;

        var internalCallbacks = {

            onPrepare: function(url) {

                //wire up a jquery dialog to display the preparing message if specified
                if (settings.preparingMessageHtml) {

                    $preparingDialog = $("<div>").html(settings.preparingMessageHtml).dialog(settings.dialogOptions);

                } else if (settings.prepareCallback) {

                    settings.prepareCallback(url);

                }

            },

            onSuccess: function(url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }

                settings.successCallback(url);

                deferred.resolve(url);
            },

            onFail: function(responseHtml, url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                }

                //wire up a jquery dialog to display the fail message if specified
                if (settings.failMessageHtml) {
                    $("<div>").html(settings.failMessageHtml).dialog(settings.dialogOptions);
                }

                settings.failCallback(responseHtml, url);
                
                deferred.reject(responseHtml, url);
            }
        };

        internalCallbacks.onPrepare(fileUrl);

        //make settings.data a param string if it exists and isn't already
        if (settings.data !== null && typeof settings.data !== "string") {
            settings.data = $.param(settings.data);
        }


        var $iframe,
            downloadWindow,
            formDoc,
            $form;

        if (httpMethodUpper === "GET") {

            if (settings.data !== null) {
                //need to merge any fileUrl params with the data object

                var qsStart = fileUrl.indexOf('?');

                if (qsStart !== -1) {
                    //we have a querystring in the url

                    if (fileUrl.substring(fileUrl.length - 1) !== "&") {
                        fileUrl = fileUrl + "&";
                    }
                } else {

                    fileUrl = fileUrl + "?";
                }

                fileUrl = fileUrl + settings.data;
            }

            if (isIos || isAndroid) {

                downloadWindow = window.open(fileUrl);
                downloadWindow.document.title = settings.popupWindowTitle;
                window.focus();

            } else if (isOtherMobileBrowser) {

                window.location(fileUrl);

            } else {

                //create a temporary iframe that is used to request the fileUrl as a GET request
                $iframe = $("<iframe>")
                    .hide()
                    .prop("src", fileUrl)
                    .appendTo("body");
            }

        } else {

            var formInnerHtml = "";

            if (settings.data !== null) {

                $.each(settings.data.replace(/\+/g, ' ').split("&"), function() {

                    var kvp = this.split("=");

                    var key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
                    if (key) {
                        var value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);
                    formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '" />';
                    }
                });
            }

            if (isOtherMobileBrowser) {

                $form = $("<form>").appendTo("body");
                $form.hide()
                    .prop('method', settings.httpMethod)
                    .prop('action', fileUrl)
                    .html(formInnerHtml);

            } else {

                if (isIos) {

                    downloadWindow = window.open("about:blank");
                    downloadWindow.document.title = settings.popupWindowTitle;
                    formDoc = downloadWindow.document;
                    window.focus();

                } else {

                    $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");
                    formDoc = getiframeDocument($iframe);
                }

                formDoc.write("<html><head></head><body><form method='" + settings.httpMethod + "' action='" + fileUrl + "'>" + formInnerHtml + "</form>" + settings.popupWindowTitle + "</body></html>");
                $form = $(formDoc).find('form');
            }

            $form.submit();
        }


        //check if the file download has completed every checkInterval ms
        setTimeout(checkFileDownloadComplete, settings.checkInterval);


        function checkFileDownloadComplete() {

            //has the cookie been written due to a file download occuring?
            if (document.cookie.indexOf(settings.cookieName + "=" + settings.cookieValue) != -1) {

                //execute specified callback
                internalCallbacks.onSuccess(fileUrl);

                //remove the cookie and iframe
                document.cookie = settings.cookieName + "=; expires=" + new Date(1000).toUTCString() + "; path=" + settings.cookiePath;

                cleanUp(false);

                return;
            }

            //has an error occured?
            //if neither containers exist below then the file download is occuring on the current window
            if (downloadWindow || $iframe) {

                //has an error occured?
                try {

                    var formDoc = downloadWindow ? downloadWindow.document : getiframeDocument($iframe);

                    if (formDoc && formDoc.body != null && formDoc.body.innerHTML.length) {

                        var isFailure = true;

                        if ($form && $form.length) {
                            var $contents = $(formDoc.body).contents().first();

                            if ($contents.length && $contents[0] === $form[0]) {
                                isFailure = false;
                            }
                        }

                        if (isFailure) {
                            internalCallbacks.onFail(formDoc.body.innerHTML, fileUrl);

                            cleanUp(true);

                            return;
                        }
                    }
                }
                catch (err) {

                    //500 error less than IE9
                    internalCallbacks.onFail('', fileUrl);

                    cleanUp(true);

                    return;
                }
            }


            //keep checking...
            setTimeout(checkFileDownloadComplete, settings.checkInterval);
        }

        //gets an iframes document in a cross browser compatible manner
        function getiframeDocument($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
        }

        function cleanUp(isFailure) {

            setTimeout(function() {

                if (downloadWindow) {

                    if (isAndroid) {
                        downloadWindow.close();
                    }

                    if (isIos) {
                        if (downloadWindow.focus) {
                            downloadWindow.focus(); //ios safari bug doesn't allow a window to be closed unless it is focused
                            if (isFailure) {
                                downloadWindow.close();
                            }
                        }
                    }
                }
                
                //iframe cleanup appears to randomly cause the download to fail
                //not doing it seems better than failure...
                //if ($iframe) {
                //    $iframe.remove();
                //}

            }, 0);
        }


        function htmlSpecialCharsEntityEncode(str) {
            return str.replace(htmlSpecialCharsRegEx, function(match) {
                return '&' + htmlSpecialCharsPlaceHolders[match];
        	});
        }

        return deferred.promise();
    }
});

})(jQuery, this);