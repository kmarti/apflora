function initiiere_index() {
	console.log("function initiiere_index wird ausgeführt");
	//Versuch, damit $.ajax auch in IE funktioniert
	//jQuery hängt an jede Anfrage ein &_= und Zufahlszahl
	//$.ajaxSetup({cache:false})	//	AUSGESCHALTET, WEIL TPOPFELDKONTR_UPDATE_MULTIPLE.PHP NICHT MEHR FUNKTIONIERTE (UND MEHR?)

	//jQuery ui widgets initiieren
	$("#programm_wahl").buttonset({
		create: function() {
			//erst jetzt einblenden, weil sonst die normalen checkboxen aufblitzen
			$("#programm_wahl").show();
		}
	});
	$("#messen").buttonset();
	$("button").button();
	$("#tpopfeldkontr_tabs").tabs();

	//tooltip: Klasse zuweisen, damit gestylt werden kann
	//$("#label_karteSchieben, #label_distanzMessen, #label_flaecheMessen, #label_mitPolygonWaehlen").tooltip({tooltipClass: "tooltip-styling-nur-text"});
	$("#label_karteSchieben, #label_distanzMessen, #label_flaecheMessen, #label_mitPolygonWaehlen").tooltip({tooltipClass: "tooltip-styling-hinterlegt"});

	//Gemeindeliste erstellen (wenn nötig)
	erstelleGemeindeliste();

	//Datumsfelder: Widget initiieren
	var Monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	var wochentageKurz = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
	var wochentageLang = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
	$("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: Monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });
	$("#TPopMassnDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopMassnJahr", altFormat: "yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: Monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });
	$("#JBerDatum, #UfErstelldatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0, showOn: "button", buttonImage: "style/images/calendar.gif", buttonImageOnly: true, monthNames: Monate, dayNamesMin: wochentageKurz, dayNames: wochentageLang, firstDay: 1 });

	//Variabeln setzen für Formular Feldkontrollen, hier damit nur ein mal
	window.feldliste_feldkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrTyp', 'TPopKontrJungpfl', 'TPopKontrVitalitaet', 'TPopKontrUeberleb', 'TPopKontrEntwicklung', 'TPopKontrUrsach', 'TPopKontrUrteil', 'TPopKontrAendUms', 'TPopKontrAendKontr', 'TPopKontrGuid', 'TPopKontrFlaeche', 'TPopKontrVegTyp', 'TPopKontrKonkurrenz', 'TPopKontrMoosschicht', 'TPopKontrKrautschicht', 'TPopKontrStrauchschicht', 'TPopKontrBaumschicht', 'TPopKontrBodenTyp', 'TPopKontrBodenKalkgehalt', 'TPopKontrBodenDurchlaessigkeit', 'TPopKontrBodenHumus', 'TPopKontrBodenNaehrstoffgehalt', 'TPopKontrBodenAbtrag', 'TPopKontrWasserhaushalt', 'TPopKontrHandlungsbedarf', 'TPopKontrIdealBiotopUebereinst', 'TPopKontrLeb', 'TPopKontrLebUmg'];
	window.feldliste_freiwkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrPlan', 'TPopKontrUebFlaeche', 'TPopKontrUebPfl', 'TPopKontrNaBo', 'TPopKontrJungPflJN', 'TPopKontrVegHoeMax', 'TPopKontrVegHoeMit', 'TPopKontrGefaehrdung', 'TPopKontrGuid'];

	//Auswahllisten aufbauen
	$("#ap_loeschen").hide();
	erstelle_ApArtId_liste();

	//HIER WIRD IN FIREFOX EINE ENDLOSSCHLAUFE AUSGELÖST
	$.when(waehle_ap_liste("programm_alle"))
		.then(function() {
			//falls eine Unteradresse angewählt wurde, diese öffnen
			oeffneUri();
		});
}

function initiiere_ap() {
	if (!localStorage.ap_id) {
		//es fehlen benötigte Daten > zurück zum Anfang
		//LIEGT HIER DER WURM BEGRABEN?
		//initiiere_index();  //ACHTUNG, DIESE ZEILE VERURSACHTE STARTABSTÜRZE IN FIREFOX UND ZT OFFENBAR AUCH IN CHROME, DA REKURSIV IMMER WIEDER INITIIERE_INDEX AUFGERUFEN WURDE
		//history.replaceState({ap: "keinap"}, "keinap", "index.html");
		return;
	}
	//Programm-Wahl konfigurieren
	var programm_wahl;
	programm_wahl = $("[name='programm_wahl']:checked").attr("id");
	//Felder zurücksetzen
	leereFelderVonFormular("ap");
	//Wenn ein ap ausgewählt ist: Seine Daten anzeigen
	if ($("#ap_waehlen").val() && programm_wahl !== "programm_neu") {
		//Daten für den ap aus der DB holen
		$.ajax({
			url: 'php/ap.php',
			dataType: 'json',
			data: {
				"id": localStorage.ap_id
			},
			success: function (data) {
				//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
				if (data) {
					//ap bereitstellen
					window.ap = data;
					//Felder mit Daten beliefern
					$("#ApStatus" + data.ApStatus).prop("checked", true);
					$("#ApUmsetzung" + data.ApUmsetzung).prop("checked", true);
					$("#ApArtId").val(data.ApArtId);
					$("#ApJahr").val(data.ApJahr);
					$("#ApArtwert").val(data.ApArtwert);
					//ApBearb: Daten holen - oder vorhandene nutzen
					if (!window.adressen_html) {
						$.ajax({
							url: 'php/adressen.php',
							dataType: 'json',
							success: function (data2) {
								if (data2) {
									//ap bereitstellen
									//Feld mit Daten beliefern
									var html;
									html = "<option></option>";
									//for (i in data2.rows) {
									for (var i = 0; i < data2.rows.length; i++) {
										html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
									}
									window.adressen_html = html;
									$("#ApBearb").html(html);
									$("#ApBearb").val(window.ap.ApBearb);
								}
							}
						});
					} else {
						$("#ApBearb").html(window.adressen_html);
						$("#ApBearb").val(window.ap.ApBearb);
					}
					//Formulare blenden
					zeigeFormular("ap");
					history.replaceState({ap: "ap"}, "ap", "index.html?ap=" + data.ApArtId);
				}
			}
		});
	} else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
		$("#ApArtId").val($("#ap_waehlen").val());
		//Formulare blenden
		zeigeFormular("ap");
	}
}

//setzt window.ap und localStorage.ap_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowAp(id) {
	localStorage.ap_id = id;
	$.ajax({
			url: 'php/ap.php',
			dataType: 'json',
			data: {
				"id": localStorage.ap_id
			},
			success: function (data) {
				//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
				if (data) {
					//ap bereitstellen
					window.ap = data;
				}
			}
		});
}

//wird benutzt von Formular pop
//baut für das select $("#ApArtId") eine Artliste auf
function erstelle_ApArtId_liste() {
	if (!window.artliste_html) {
		$.ajax({
			url: 'php/artliste.php',
			dataType: 'json',
			success: function (data) {
				var html;
				html = "<option></option>";
				//for (i in data.rows) {
				for (var i = 0; i < data.rows.length; i++) {
					html += "<option value=\"" + data.rows[i].id + "\">" + data.rows[i].Artname + "</option>";
				}
				window.artliste_html = html;
				$("#ApArtId").html(html);
				$("#AaSisfNr").html(html);
				return html;
			}
		});
	} else {
		$("#ApArtId").html(window.artliste_html);
		$("#AaSisfNr").html(window.artliste_html);
		return window.artliste_html;
	}
}

function initiiere_pop() {
	if (!localStorage.pop_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("pop");
	//Daten für die pop aus der DB holen
	$.ajax({
		url: 'php/pop.php',
		dataType: 'json',
		data: {
			"id": localStorage.pop_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.pop = data;
				//Felder mit Daten beliefern
				$("#PopHerkunft" + data.PopHerkunft).prop("checked", true);
				if (data.PopHerkunftUnklar == 1) {
					$("#PopHerkunftUnklar").prop("checked", true);
				} else {
					$("#PopHerkunftUnklar").prop("checked", false);
				}
				$("#PopHerkunftUnklarBegruendung").val(data.PopHerkunftUnklarBegruendung);
				$("#PopHerkunftUnklarBegruendung").limiter(255, $("#PopHerkunftUnklarBegruendung_limit"));
				$("#PopName").val(data.PopName);
				$("#PopName").limiter(150, $("#PopName_limit"));
				$("#PopNr").val(data.PopNr);
				$("#PopBekanntSeit").val(data.PopBekanntSeit);
				$("#PopXKoord").val(data.PopXKoord);
				$("#PopYKoord").val(data.PopYKoord);
				//Formulare blenden
				zeigeFormular("pop");
				history.replaceState({pop: "pop"}, "pop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#PopName").val()) {
					$("#PopNr").focus();
				}
			}
		}
	});
}

//setzt window.pop und localStorage.pop_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowPop(id) {
	localStorage.pop_id = id;
	$.ajax({
			url: 'php/pop.php',
			dataType: 'json',
			data: {
				"id": localStorage.pop_id
			},
			success: function (data) {
				//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
				if (data) {
					//pop bereitstellen
					window.pop = data;
				}
			}
		});
}

function initiiere_apziel() {
	if (!localStorage.apziel_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	var apziel_initiiert = $.Deferred();
	//Felder zurücksetzen
	leereFelderVonFormular("apziel");
	//Daten für die apziel aus der DB holen
	$.ajax({
		url: 'php/apziel.php',
		dataType: 'json',
		data: {
			"id": localStorage.apziel_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.apziel = data;
				//Felder mit Daten beliefern
				$("#ZielJahr").val(data.ZielJahr);
				$("#ZielTyp" + data.ZielTyp).prop("checked", true);
				$("#ZielBezeichnung").val(data.ZielBezeichnung);
				//Formulare blenden
				zeigeFormular("apziel");
				history.replaceState({apziel: "apziel"}, "apziel", "index.html?ap=" + localStorage.ap_id + "&apziel=" + localStorage.apziel_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ZielJahr").val()) {
					$("#ZielJahr").focus();
				}
				apziel_initiiert.resolve();
			}
		}
	});
	return apziel_initiiert.promise();
}

//setzt window.apziel und localStorage.apziel_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowApziel(id) {
	localStorage.apziel_id = id;
	$.ajax({
		url: 'php/apziel.php',
		//url: 'http://www.apflora.barbalex.ch/php/apziel.php',
		dataType: 'json',
		data: {
			"id": localStorage.apziel_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//apziel bereitstellen
				window.apziel = data;
			}
		}
	});
}

function initiiere_zielber() {
	if (!localStorage.zielber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("zielber");
	//Daten für die zielber aus der DB holen
	$.ajax({
		url: 'php/zielber.php',
		dataType: 'json',
		data: {
			"id": localStorage.zielber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.zielber = data;
				//Felder mit Daten beliefern
				$("#ZielBerJahr").val(data.ZielBerJahr);
				$("#ZielBerErreichung").val(data.ZielBerErreichung);
				$("#ZielBerTxt").val(data.ZielBerTxt);
				//Formulare blenden
				zeigeFormular("zielber");
				history.replaceState({zielber: "zielber"}, "zielber", "index.html?ap=" + localStorage.ap_id + "&apziel=" + localStorage.apziel_id + "&zielber=" + localStorage.zielber_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ZielBerJahr").val()) {
					$("#ZielBerJahr").focus();
				}
			}
		}
	});
}

//setzt window.zielber und localStorage.zielber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowZielber(id) {
	localStorage.zielber_id = id;
	$.ajax({
		url: 'php/zielber.php',
		dataType: 'json',
		data: {
			"id": localStorage.zielber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//zielber bereitstellen
				window.zielber = data;
			}
		}
	});
}

function initiiere_erfkrit() {
	if (!localStorage.erfkrit_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("erfkrit");
	//Daten für die erfkrit aus der DB holen
	$.ajax({
		url: 'php/erfkrit.php',
		dataType: 'json',
		data: {
			"id": localStorage.erfkrit_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.erfkrit = data;
				//Felder mit Daten beliefern
				$("#ErfkritErreichungsgrad" + data.ErfkritErreichungsgrad).prop("checked", true);
				$("#ErfkritTxt").val(data.ErfkritTxt);
				$("#ErfkritTxt").limiter(255, $("#ErfkritTxt_limit"));
				//Formulare blenden
				zeigeFormular("erfkrit");
				history.replaceState({erfkrit: "erfkrit"}, "erfkrit", "index.html?ap=" + localStorage.ap_id + "&erfkrit=" + localStorage.erfkrit_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ErfkritErreichungsgrad").val()) {
					$("#ErfkritErreichungsgrad").focus();
				}
			}
		}
	});
}

//setzt window.erfkrit und localStorage.erfkrit_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowErfkrit(id) {
	localStorage.erfkrit_id = id;
	$.ajax({
		url: 'php/erfkrit.php',
		dataType: 'json',
		data: {
			"id": localStorage.erfkrit_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//erfkrit bereitstellen
				window.erfkrit = data;
			}
		}
	});
}

function initiiere_jber() {
	if (!localStorage.jber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("jber");
	//Daten für die jber aus der DB holen
	$.ajax({
		url: 'php/jber.php',
		dataType: 'json',
		data: {
			"id": localStorage.jber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.jber = data;
				//Felder mit Daten beliefern
				$("#JBerJahr").val(data.JBerJahr);
				$("#JBerSituation").val(data.JBerSituation);
				$("#JBerVergleichVorjahrGesamtziel").val(data.JBerVergleichVorjahrGesamtziel);
				$("#JBerBeurteilung" + data.JBerBeurteilung).prop("checked", true);
				//escapen, + und - werden sonst verändert
				$("#JBerVeraenGegenVorjahr\\" + data.JBerVeraenGegenVorjahr).prop("checked", true);
				$("#JBerAnalyse").val(data.JBerAnalyse);
				$("#JBerAnalyse").limiter(255, $("#JBerAnalyse_limit"));
				$("#JBerUmsetzung").val(data.JBerUmsetzung);
				$("#JBerErfko").val(data.JBerErfko);
				$("#JBerATxt").val(data.JBerATxt);
				$("#JBerBTxt").val(data.JBerBTxt);
				$("#JBerCTxt").val(data.JBerCTxt);
				$("#JBerDTxt").val(data.JBerDTxt);
				if (data.JBerDatum !== "01.01.1970") {
					//php macht aus einem Nullwert im Datum den 1.1.1970!!!
					$("#JBerDatum").val(data.JBerDatum);
				} else {
					$("#JBerDatum").val("");
				}
				//JBerBearb: Daten holen - oder vorhandene nutzen
				if (!window.adressen_html) {
					$.ajax({
						url: 'php/adressen.php',
						dataType: 'json',
						success: function (data2) {
							if (data2) {
								//ap bereitstellen
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data2.rows) {
								for (var i = 0; i < data2.rows.length; i++) {
									html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
								}
								window.adressen_html = html;
								$("#JBerBearb").html(html);
								$("#JBerBearb").val(window.jber.JBerBearb);
							}
						}
					});
				} else {
					$("#JBerBearb").html(window.adressen_html);
					$("#JBerBearb").val(window.jber.JBerBearb);
				}
				//Formulare blenden
				zeigeFormular("jber");
				history.replaceState({jber: "jber"}, "jber", "index.html?ap=" + localStorage.ap_id + "&jber=" + localStorage.jber_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#JBerJahr").val()) {
					$("#JBerJahr").focus();
				}
			}
		}
	});
}

//setzt window.jber und localStorage.jber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowJber(id) {
	localStorage.jber_id = id;
	$.ajax({
		url: 'php/jber.php',
		dataType: 'json',
		data: {
			"id": localStorage.jber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//jber bereitstellen
				window.jber = data;
			}
		}
	});
}

function initiiere_jber_uebersicht() {
	if (!localStorage.jber_uebersicht_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("jber_uebersicht");
	//Daten für die jber_uebersicht aus der DB holen
	$.ajax({
		url: 'php/jber_uebersicht.php',
		dataType: 'json',
		data: {
			"JbuJahr": localStorage.jber_uebersicht_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.jber_uebersicht = data;
				//Felder mit Daten beliefern
				$("#JbuJahr").val(data.JbuJahr);
				$("#JbuBemerkungen").val(data.JbuBemerkungen);
				//FitToContent("Bemerkungen", document.documentElement.clientHeight);
				//Formulare blenden
				zeigeFormular("jber_uebersicht");
				history.replaceState({jber_uebersicht: "jber_uebersicht"}, "jber_uebersicht", "index.html?ap=" + localStorage.ap_id + "&jber_uebersicht=" + localStorage.jber_uebersicht_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#JbuJahr").val()) {
					$("#JbuJahr").focus();
				}
			}
		}
	});
}

//setzt window.jber_uebersicht und localStorage.jber_uebersicht_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowJberUebersicht(id) {
	localStorage.jber_uebersicht_id = id;
	$.ajax({
		url: 'php/jber_uebersicht.php',
		dataType: 'json',
		data: {
			"id": localStorage.jber_uebersicht_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//jber_uebersicht bereitstellen
				window.jber_uebersicht = data;
			}
		}
	});
}

function initiiere_ber() {
	if (!localStorage.ber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("ber");
	//Daten für die ber aus der DB holen
	$.ajax({
		url: 'php/ber.php',
		dataType: 'json',
		data: {
			"id": localStorage.ber_id
		},
		success: function (data) {
			var tempUrl;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.ber = data;
				//Felder mit Daten beliefern
				$("#BerAutor").val(data.BerAutor);
				$("#BerJahr").val(data.BerJahr);
				$("#BerTitel").val(data.BerTitel);
				$("#BerTitel").limiter(255, $("#BerTitel_limit"));
				$("#BerURL").val(data.BerURL);
				$("#BerURL").limiter(255, $("#BerURL_limit"));
				//URL-Link initialisieren, wird bei Änderung der URL in index.html angepasst
				$('#BerURLHref').attr('onClick', "window.open('" + data.BerURL + "', target='_blank')");
				//Formulare blenden
				zeigeFormular("ber");
				history.replaceState({ber: "ber"}, "ber", "index.html?ap=" + localStorage.ap_id + "&ber=" + localStorage.ber_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#BerAutor").val()) {
					$("#BerAutor").focus();
				} else if (!$("#BerJahr").val()) {
					$("#BerJahr").focus();
				} else if (!$("#BerTitel").val()) {
					$("#BerTitel").focus();
				} else if (!$("#BerURL").val()) {
					$("#BerURL").focus();
				}
			}
		}
	});
}

//setzt window.ber und localStorage.ber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowBer(id) {
	localStorage.ber_id = id;
	$.ajax({
		url: 'php/ber.php',
		dataType: 'json',
		data: {
			"id": localStorage.ber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ber bereitstellen
				window.ber = data;
			}
		}
	});
}

function initiiere_umwfakt() {
	if (!localStorage.ap_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("umwfakt");
	//Daten für die umwfakt aus der DB holen
	$.ajax({
		url: 'php/umwfakt.php',
		dataType: 'json',
		data: {
			"id": localStorage.ap_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//umwfakt bereitstellen
				localStorage.umwfakt_id = data.UfApArtId;
				window.umwfakt = data;
				//Felder mit Daten beliefern
				if (data.UfErstelldatum !== "01.01.1970") {
					//php macht aus einem Nullwert im Datum den 1.1.1970!!!
					$("#UfErstelldatum").val(data.UfErstelldatum);
				}
				$("#UfHoehenlage").val(data.UfHoehenlage);
				$("#UfRegion").val(data.UfRegion);
				$("#UfExposition").val(data.UfExposition);
				$("#UfBesonnung").val(data.UfBesonnung);
				$("#UfHangneigung").val(data.UfHangneigung);
				$("#UfBodenTyp").val(data.UfBodenTyp);
				$("#UfBodenKalkgehalt").val(data.UfBodenKalkgehalt);
				$("#UfBodenDurchlaessigkeit").val(data.UfBodenDurchlaessigkeit);
				$("#UfBodenHumus").val(data.UfBodenHumus);
				$("#UfBodenNaehrstoffgehalt").val(data.UfBodenNaehrstoffgehalt);
				$("#UfWasserhaushalt").val(data.UfWasserhaushalt);
				$("#UfKonkurrenz").val(data.UfKonkurrenz);
				$("#UfMoosschicht").val(data.UfMoosschicht);
				$("#UfKrautschicht").val(data.UfKrautschicht);
				$("#UfStrauchschicht").val(data.UfStrauchschicht);
				$("#UfBaumschicht").val(data.UfBaumschicht);
				$("#UfBemerkungen").val(data.UfBemerkungen);
				//Formulare blenden
				zeigeFormular("umwfakt");
				history.replaceState({umwfakt: "umwfakt"}, "umwfakt", "index.html?ap=" + localStorage.ap_id + "&umwfakt=" + localStorage.umwfakt_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#UfErstelldatum").val()) {
					$("#UfErstelldatum").focus();
				}
			} else {
				//nur aktualisieren, wenn Schreibrechte bestehen
				if (sessionStorage.NurLesen) {
					$("#Meldung").html("Sie haben keine Schreibrechte");
					$("#Meldung").dialog({
						modal: true,
						buttons: {
							Ok: function() {
								$(this).dialog("close");
							}
						}
					});
					return;
				}
				//null zurückgekommen > Datesatz schaffen
				$.ajax({
					url: 'php/umwfakt_insert.php',
					dataType: 'json',
					data: {
						"id": localStorage.ap_id,
						"user": sessionStorage.User
					},
					success: function (data) {
						localStorage.umwfakt_id = data.UfApArtId;
						initiiere_umwfakt();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Kein Idealbiotop erstellt");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		},
		error: function () {
			//nichts machen, sonst gibt es eine Endlosschlaufe
		}
	});
}

//setzt window.umwfakt und localStorage.umwfakt_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowUmwfakt(id) {
	localStorage.umwfakt_id = id;
	$.ajax({
		url: 'php/umwfakt.php',
		dataType: 'json',
		data: {
			"id": localStorage.umwfakt_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//umwfakt bereitstellen
				window.umwfakt = data;
			}
		}
	});
}

function initiiere_assozarten() {
	if (!localStorage.assozarten_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("assozarten");
	//Daten für die assozarten aus der DB holen
	$.ajax({
		url: 'php/assozarten.php',
		dataType: 'json',
		data: {
			"id": localStorage.assozarten_id
		},
		success: function (data) {
			var tempUrl;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.assozarten = data;
				//Felder mit Daten beliefern
				$("#AaSisfNr").val(data.AaSisfNr);
				$("#AaBem").val(data.AaBem);
				//Formulare blenden
				zeigeFormular("assozarten");
				history.replaceState({assozarten: "assozarten"}, "assozarten", "index.html?ap=" + localStorage.ap_id + "&assozarten=" + localStorage.assozarten_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#AaSisfNr").val()) {
					$("#AaSisfNr").focus();
				}
			}
		}
	});
}

//setzt window.assozarten und localStorage.assozarten_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowAssozarten(id) {
	localStorage.assozarten_id = id;
	$.ajax({
		url: 'php/assozarten.php',
		dataType: 'json',
		data: {
			"id": localStorage.assozarten_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//assozarten bereitstellen
				window.assozarten = data;
			}
		}
	});
}

function initiiere_popmassnber() {
	if (!localStorage.popmassnber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("popmassnber");
	//Daten für die pop aus der DB holen
	$.ajax({
		url: 'php/popmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popmassnber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.popmassnber = data;
				//Felder mit Daten beliefern
				$("#PopMassnBerJahr").val(data.PopMassnBerJahr);
				$("#PopMassnBerErfolgsbeurteilung" + data.PopMassnBerErfolgsbeurteilung).prop("checked", true);
				$("#PopMassnBerTxt").val(data.PopMassnBerTxt);
				//Formulare blenden
				zeigeFormular("popmassnber");
				history.replaceState({popmassnber: "popmassnber"}, "popmassnber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&popmassnber=" + localStorage.popmassnber_id);
				//bei neuen Datensätzen Fokus steuern
				$('#PopMassnBerJahr').focus();
			}
		}
	});
}

//setzt window.popmassnber und localStorage.popmassnber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowPopmassnber(id) {
	localStorage.popmassnber_id = id;
	$.ajax({
		url: 'php/popmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popmassnber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//popmassnber bereitstellen
				window.popmassnber = data;
			}
		}
	});
}

function initiiere_tpop() {
	if (!localStorage.tpop_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpop");
	//Daten für die pop aus der DB holen
	$.ajax({
		url: 'php/tpop.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpop_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.tpop = data;
				//Felder mit Daten beliefern
				$("#TPopFlurname").val(data.TPopFlurname);
				$("#TPopFlurname").limiter(255, $("#TPopFlurname_limit"));
				$("#TPopNr").val(data.TPopNr);
				$("#TPopHerkunft" + data.TPopHerkunft).prop("checked", true);
				if (data.TPopHerkunftUnklar == 1) {
					$("#TPopHerkunftUnklar").prop("checked", true);
				} else {
					$("#TPopHerkunftUnklar").prop("checked", false);
				}
				$("#TPopHerkunftUnklarBegruendung").val(data.TPopHerkunftUnklarBegruendung);
				$("#TPopHerkunftUnklarBegruendung").limiter(255, $("#TPopHerkunftUnklarBegruendung_limit"));
				$("#TPopApBerichtRelevant" + data.TPopApBerichtRelevant).prop("checked", true);
				$("#TPopBekanntSeit").val(data.TPopBekanntSeit);
				$("#TPopGemeinde").val(data.TPopGemeinde);
				$("#TPopGemeinde").limiter(255, $("#TPopGemeinde_limit"));
				$("#TPopXKoord").val(data.TPopXKoord);
				$("#TPopYKoord").val(data.TPopYKoord);
				$("#TPopRadius").val(data.TPopRadius);
				$("#TPopHoehe").val(data.TPopHoehe);
				$("#TPopExposition").val(data.TPopExposition);
				$("#TPopExposition").limiter(50, $("#TPopExposition_limit"));
				$("#TPopKlima").val(data.TPopKlima);
				$("#TPopKlima").limiter(50, $("#TPopKlima_limit"));
				$("#TPopNeigung").val(data.TPopNeigung);
				$("#TPopNeigung").limiter(50, $("#TPopNeigung_limit"));
				$("#TPopBeschr").val(data.TPopBeschr);
				$("#TPopBeschr").limiter(255, $("#TPopBeschr_limit"));
				$("#TPopKatNr").val(data.TPopKatNr);
				$("#TPopKatNr").limiter(255, $("#TPopKatNr_limit"));
				$("#TPopEigen").val(data.TPopEigen);
				$("#TPopEigen").limiter(255, $("#TPopEigen_limit"));
				$("#TPopKontakt").val(data.TPopKontakt);
				$("#TPopKontakt").limiter(255, $("#TPopKontakt_limit"));
				$("#TPopNutzungszone").val(data.TPopNutzungszone);
				$("#TPopNutzungszone").limiter(255, $("#TPopNutzungszone_limit"));
				$("#TPopBewirtschafterIn").val(data.TPopBewirtschafterIn);
				$("#TPopBewirtschafterIn").limiter(255, $("#TPopBewirtschafterIn_limit"));
				$("#TPopBewirtschaftung").val(data.TPopBewirtschaftung);
				$("#TPopBewirtschaftung").limiter(255, $("#TPopBewirtschaftung_limit"));
				$("#TPopTxt").val(data.TPopTxt);
				//für select Daten holen - oder vorhandene nutzen
				if (!window.adressen_html) {
					$.ajax({
						url: 'php/adressen.php',
						dataType: 'json',
						success: function (data2) {
							if (data2) {
								//ap bereitstellen
								window.adressen = data2;
								localStorage.adressen = JSON.stringify(data2);
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data2.rows) {
								for (var i = 0; i < data2.rows.length; i++) {
									html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
								}
								window.adressen_html = html;
								$("#TPopVerantw").html(html);
								$("#TPopVerantw").val(window.tpop.TPopVerantw);
							}
						}
					});
				} else {
					$("#TPopVerantw").html(window.adressen_html);
					$("#TPopVerantw").val(window.tpop.TPopVerantw);
				}
				//Formulare blenden
				zeigeFormular("tpop");
				history.replaceState({tpop: "tpop"}, "tpop", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id);
				//bei neuen Datensätzen Fokus steuern
				if (!$("#TPopFlurname").val()) {
					$('#TPopNr').focus();
				}
			}
		}
	});
}

//setzt window.tpop und localStorage.tpop_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowTpop(id) {
	localStorage.tpop_id = id;
	$.ajax({
		url: 'php/tpop.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpop_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpop bereitstellen
				window.tpop = data;
			}
		}
	});
}

function initiiere_popber() {
	if (!localStorage.popber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("popber");
	//Daten für die popber aus der DB holen
	$.ajax({
		url: 'php/popber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.popber = data;
				//Felder mit Daten beliefern
				$("#PopBerJahr").val(data.PopBerJahr);
				$("#PopBerEntwicklung" + data.PopBerEntwicklung).prop("checked", true);
				$("#PopBerTxt").val(data.PopBerTxt);
				//Formulare blenden
				zeigeFormular("popber");
				history.replaceState({tpopber: "popber"}, "popber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&popber=" + localStorage.popber_id);
				//bei neuen Datensätzen Fokus steuern
				$('#PopBerJahr').focus();
			}
		}
	});
}

//setzt window.popber und localStorage.popber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowPopber(id) {
	localStorage.popber_id = id;
	$.ajax({
		url: 'php/popber.php',
		dataType: 'json',
		data: {
			"id": localStorage.popber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//popber bereitstellen
				window.popber = data;
			}
		}
	});
}

function initiiere_tpopfeldkontr() {
	//wird gemeinsam für Feld- und Freiwilligenkontrollen verwendet
	//Feldkontrollen: Felder der Freiwilligenkontrollen ausblenden
	//Freiwilligenkontrollen: Felder der Feldkontrollen ausblenen plus Register Biotop
	if (!localStorage.tpopfeldkontr_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpopfeldkontr");
	//alle Felder ausblenden. Später werden die benötigten eingeblendet
	$('.feld_tpopfeldkontr').each(function() {
		$(this).hide();
	});
	//Daten für die tpopfeldkontr aus der DB holen
	$.ajax({
		url: 'php/tpopfeldkontr.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopfeldkontr_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.tpopfeldkontr = data;
				//gemeinsame Felder
				//mit Daten beliefern
				$("#TPopKontrJahr").val(data.TPopKontrJahr);
				if (data.TPopKontrDatum !== "01.01.1970") {
					//php macht aus einem Nullwert im Datum den 1.1.1970!!!
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
				//TPopKontrBearb: Daten holen - oder vorhandene nutzen
				if (!window.adressen_html) {
					$.ajax({
						url: 'php/adressen.php',
						dataType: 'json',
						success: function (data2) {
							if (data2) {
								//ap bereitstellen
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data2.rows) {
								for (var i = 0; i < data2.rows.length; i++) {
									html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
								}
								window.adressen_html = html;
								$("#TPopKontrBearb").html(html);
								$("#TPopKontrBearb").val(window.tpopfeldkontr.TPopKontrBearb);
							}
						}
					});
				} else {
					$("#TPopKontrBearb").html(window.adressen_html);
					$("#TPopKontrBearb").val(window.tpopfeldkontr.TPopKontrBearb);
				}
				//für 3 selectfelder TPopKontrZaehleinheit Daten holen - oder vorhandene nutzen
				if (!window.TPopKontrZaehleinheit_html) {
					$.ajax({
						url: 'php/tpopfeldkontr_zaehleinheit.php',
						dataType: 'json',
						success: function (data3) {
							if (data3) {
								//ap bereitstellen
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data3.rows) {
								for (var i = 0; i < data3.rows.length; i++) {
									html += "<option value=\"" + data3.rows[i].id + "\">" + data3.rows[i].ZaehleinheitTxt + "</option>";
								}
								window.TPopKontrZaehleinheit_html = html;
								//alle 3 Felder setzen
								$("#TPopKontrZaehleinheit1").html(html);
								$("#TPopKontrZaehleinheit1").val(window.tpopfeldkontr.TPopKontrZaehleinheit1);
								$("#TPopKontrZaehleinheit2").html(html);
								$("#TPopKontrZaehleinheit2").val(window.tpopfeldkontr.TPopKontrZaehleinheit2);
								$("#TPopKontrZaehleinheit3").html(html);
								$("#TPopKontrZaehleinheit3").val(window.tpopfeldkontr.TPopKontrZaehleinheit3);
							}
						}
					});
				} else {
					//alle 3 Felder setzen
					$("#TPopKontrZaehleinheit1").html(window.TPopKontrZaehleinheit_html);
					$("#TPopKontrZaehleinheit1").val(window.tpopfeldkontr.TPopKontrZaehleinheit1);
					$("#TPopKontrZaehleinheit2").html(window.TPopKontrZaehleinheit_html);
					$("#TPopKontrZaehleinheit2").val(window.tpopfeldkontr.TPopKontrZaehleinheit2);
					$("#TPopKontrZaehleinheit3").html(window.TPopKontrZaehleinheit_html);
					$("#TPopKontrZaehleinheit3").val(window.tpopfeldkontr.TPopKontrZaehleinheit3);
				}
				//Felder, die nur in der Feldkontrolle vorkommen
				if (!localStorage.tpopfreiwkontr) {
					$("#TPopKontrTyp" + data.TPopKontrTyp).prop("checked", true);
					$("#TPopKontrJungpfl").val(data.TPopKontrJungpfl);
					$("#TPopKontrVitalitaet").val(data.TPopKontrVitalitaet);
					$("#TPopKontrVitalitaet").limiter(255, $("#TPopKontrVitalitaet_limit"));
					$("#TPopKontrUeberleb").val(data.TPopKontrUeberleb);
					$("#TPopKontrEntwicklung" + data.TPopKontrEntwicklung).prop("checked", true);
					$("#TPopKontrUrsach").val(data.TPopKontrUrsach);
					$("#TPopKontrUrsach").limiter(255, $("#TPopKontrUrsach_limit"));
					$("#TPopKontrUrteil").val(data.TPopKontrUrteil);
					$("#TPopKontrUrteil").limiter(255, $("#TPopKontrUrteil_limit"));
					$("#TPopKontrAendUms").val(data.TPopKontrAendUms);
					$("#TPopKontrAendUms").limiter(255, $("#TPopKontrAendUms_limit"));
					$("#TPopKontrAendKontr").val(data.TPopKontrAendKontr);
					$("#TPopKontrAendKontr").limiter(255, $("#TPopKontrAendKontr_limit"));
					//Biotop
					$("#TPopKontrFlaeche").val(data.TPopKontrFlaeche);
					$("#TPopKontrVegTyp").val(data.TPopKontrVegTyp);
					$("#TPopKontrVegTyp").limiter(100, $("#TPopKontrVegTyp_limit"));
					$("#TPopKontrKonkurrenz").val(data.TPopKontrKonkurrenz);
					$("#TPopKontrKonkurrenz").limiter(100, $("#TPopKontrKonkurrenz_limit"));
					$("#TPopKontrMoosschicht").val(data.TPopKontrMoosschicht);
					$("#TPopKontrMoosschicht").limiter(100, $("#TPopKontrMoosschicht_limit"));
					$("#TPopKontrKrautschicht").val(data.TPopKontrKrautschicht);
					$("#TPopKontrKrautschicht").limiter(100, $("#TPopKontrKrautschicht_limit"));
					$("#TPopKontrStrauchschicht").val(data.TPopKontrStrauchschicht);
					$("#TPopKontrStrauchschicht").limiter(255, $("#TPopKontrStrauchschicht_limit"));
					$("#TPopKontrBaumschicht").val(data.TPopKontrBaumschicht);
					$("#TPopKontrBaumschicht").limiter(100, $("#TPopKontrBaumschicht_limit"));
					$("#TPopKontrBodenTyp").val(data.TPopKontrBodenTyp);
					$("#TPopKontrBodenTyp").limiter(255, $("#TPopKontrBodenTyp_limit"));
					$("#TPopKontrBodenKalkgehalt").val(data.TPopKontrBodenKalkgehalt);
					$("#TPopKontrBodenKalkgehalt").limiter(100, $("#TPopKontrBodenKalkgehalt_limit"));
					$("#TPopKontrBodenDurchlaessigkeit").val(data.TPopKontrBodenDurchlaessigkeit);
					$("#TPopKontrBodenDurchlaessigkeit").limiter(100, $("#TPopKontrBodenDurchlaessigkeit_limit"));
					$("#TPopKontrBodenHumus").val(data.TPopKontrBodenHumus);
					$("#TPopKontrBodenHumus").limiter(100, $("#TPopKontrBodenHumus_limit"));
					$("#TPopKontrBodenNaehrstoffgehalt").val(data.TPopKontrBodenNaehrstoffgehalt);
					$("#TPopKontrBodenNaehrstoffgehalt").limiter(100, $("#TPopKontrBodenNaehrstoffgehalt_limit"));
					$("#TPopKontrBodenAbtrag").val(data.TPopKontrBodenAbtrag);
					$("#TPopKontrBodenAbtrag").limiter(255, $("#TPopKontrBodenAbtrag_limit"));
					$("#TPopKontrWasserhaushalt").val(data.TPopKontrWasserhaushalt);
					$("#TPopKontrWasserhaushalt").limiter(255, $("#TPopKontrWasserhaushalt_limit"));
					$("#TPopKontrHandlungsbedarf").val(data.TPopKontrHandlungsbedarf);
					$("#TPopKontrIdealBiotopUebereinst" + data.TPopKontrIdealBiotopUebereinst).prop("checked", true);
					//TPopKontrLeb: Daten holen - oder vorhandene nutzen
					if (!window.lrdelarze_html) {
						$.ajax({
							url: 'php/lrdelarze.php',
							dataType: 'json',
							success: function (data4) {
								if (data4) {
									//ap bereitstellen
									//Feld mit Daten beliefern
									var html;
									html = "<option></option>";
									//for (i in data4.rows) {
									for (var i = 0; i < data4.rows.length; i++) {
										html += "<option value=\"" + data4.rows[i].id + "\">" + data4.rows[i].Einheit + "</option>";
									}
									window.lrdelarze_html = html;
									$("#TPopKontrLeb").html(html);
									$("#TPopKontrLeb").val(window.tpopfeldkontr.TPopKontrLeb);
									$("#TPopKontrLebUmg").html(html);
									$("#TPopKontrLebUmg").val(window.tpopfeldkontr.TPopKontrLebUmg);
								}
							}
						});
					} else {
						$("#TPopKontrLeb").html(window.lrdelarze_html);
						$("#TPopKontrLeb").val(window.tpopfeldkontr.TPopKontrLeb);
						$("#TPopKontrLebUmg").html(window.lrdelarze_html);
						$("#TPopKontrLebUmg").val(window.tpopfeldkontr.TPopKontrLebUmg);
					}
				}
				//TPopKontrIdealBiotopUebereinst: Daten holen - oder vorhandene nutzen
				if (!window.IdealBiotopÜbereinst_html) {
					$.ajax({
						url: 'php/idealbiotopuebereinst.php',
						dataType: 'json',
						success: function (data5) {
							if (data5) {
								//ap bereitstellen
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data5.rows) {
								for (var i = 0; i < data5.rows.length; i++) {
									html += "<option value=\"" + data5.rows[i].id + "\">" + data5.rows[i].DomainTxt + "</option>";
								}
								window.IdealBiotopÜbereinst_html = html;
								$("#TPopKontrIdealBiotopUebereinst").html(html);
								$("#TPopKontrIdealBiotopUebereinst").val(window.tpopfeldkontr.TPopKontrIdealBiotopUebereinst);
							}
						}
					});
				} else {
					$("#TPopKontrIdealBiotopUebereinst").html(window.IdealBiotopÜbereinst_html);
					$("#TPopKontrIdealBiotopUebereinst").val(window.tpopfeldkontr.TPopKontrIdealBiotopUebereinst);
				}
				//Felder, die nur in freiwkontr vorkommen
				if (localStorage.tpopfreiwkontr) {
					if (data.TPopKontrPlan == 1) {
						$("#TPopKontrPlan").prop("checked", true);
					} else {
						$("#TPopKontrPlan").prop("checked", false);
					}
					$("#TPopKontrUebFlaeche").val(data.TPopKontrUebFlaeche);
					$("#TPopKontrUebPfl").val(data.TPopKontrUebPfl);
					$("#TPopKontrNaBo").val(data.TPopKontrNaBo);
					$("#TPopKontrJungPflJN_ja").prop("checked", false);
					$("#TPopKontrJungPflJN_nein").prop("checked", false);
					$("#TPopKontrJungPflJN_leer").prop("checked", false);
					if (data.TPopKontrJungPflJN == 1) {
						$("#TPopKontrJungPflJN_ja").prop("checked", true);
					} else if (data.TPopKontrJungPflJN == 0) {
						$("#TPopKontrJungPflJN_nein").prop("checked", true);
					} else {
						$("#TPopKontrJungPflJN_leer").prop("checked", true);
					}
					$("#TPopKontrVegHoeMax").val(data.TPopKontrVegHoeMax);
					$("#TPopKontrVegHoeMit").val(data.TPopKontrVegHoeMit);
					$("#TPopKontrGefaehrdung").val(data.TPopKontrGefaehrdung);
					$("#TPopKontrGefaehrdung").limiter(255, $("#TPopKontrGefaehrdung_limit"));
				}
				//fieldcontain-divs der benötigten Felder einblenden
				if (localStorage.tpopfreiwkontr) {
					for (var h = 0; h < feldliste_freiwkontr.length; h++) {
						$("#fieldcontain_" + feldliste_freiwkontr[h]).show();
					}
				} else {
					for (var g = 0; g < feldliste_feldkontr.length; g++) {
						$("#fieldcontain_" + feldliste_feldkontr[g]).show();
					}
				}
				//Formulare blenden
				zeigeFormular("tpopfeldkontr");
				if (!localStorage.tpopfreiwkontr) {
					history.replaceState({tpopfeldkontr: "tpopfeldkontr"}, "tpopfeldkontr", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopfeldkontr=" + localStorage.tpopfeldkontr_id);
				} else {
					history.replaceState({tpopfreiwkontr: "tpopfreiwkontr"}, "tpopfreiwkontr", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopfreiwkontr=" + localStorage.tpopfeldkontr_id);
				}
				//Register in Feldkontr blenden
				if (localStorage.tpopfreiwkontr) {
					$("#tpopfeldkontr_tabs_biotop").hide();
					$("#biotop_tab_li").hide();
					$("#tpopfeldkontr_tabs").tabs("option", "active", 0);
				} else {
					//$("#tpopfeldkontr_tabs_biotop").activate();
					$("#tpopfeldkontr_tabs_biotop").show();
					//$("#biotop_tab_li").activate();
					$("#biotop_tab_li").show();
					//Dieses Element wird fälschlicherweise in Entwicklung eingeblendet
					//keine Ahnung wieso
					//ausblenden!
					$("#tpopfeldkontr_tabs_biotop").hide();
				}
				//Fokus steuern
				$("#TPopKontrJahr").focus();
				$(window).scrollTop(0);
			}
		}
	});
}

//setzt window.tpopfeldkontr und localStorage.tpopfeldkontr_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowTpopfeldkontr(id) {
	localStorage.tpopfeldkontr_id = id;
	$.ajax({
		url: 'php/tpopfeldkontr.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopfeldkontr_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopfeldkontr bereitstellen
				window.tpopfeldkontr = data;
			}
		}
	});
}

function initiiere_tpopmassn() {
	if (!localStorage.tpopmassn_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpopmassn");
	//Daten für die pop aus der DB holen
	$.ajax({
		url: 'php/tpopmassn.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassn_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.tpopmassn = data;
				//Felder mit Daten beliefern
				//für select TPopMassnTyp Daten holen - oder vorhandene nutzen
				if (!window.tpopmassntyp_html) {
					$.ajax({
						url: 'php/tpopmassn_typ.php',
						dataType: 'json',
						success: function (data2) {
							if (data2) {
								//ap bereitstellen
								window.tpopmassn_typ = data2;
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data2.rows) {
								for (var i = 0; i < data2.rows.length; i++) {
									html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].MassnTypTxt + "</option>";
								}
								window.tpopmassntyp_html = html;
								$("#TPopMassnTyp").html(html);
								$("#TPopMassnTyp").val(window.tpopmassn.TPopMassnTyp);
							}
						}
					});
				} else {
					$("#TPopMassnTyp").html(window.tpopmassntyp_html);
					$("#TPopMassnTyp").val(window.tpopmassn.TPopMassnTyp);
				}
				$("#TPopMassnTxt").val(data.TPopMassnTxt);
				$("#TPopMassnTxt").limiter(255, $("#TPopMassnTxt_limit"));
				$("#TPopMassnJahr").val(data.TPopMassnJahr);
				if (data.TPopMassnDatum !== "01.01.1970") {
					//php macht aus einem Nullwert im Datum den 1.1.1970!!!
					$("#TPopMassnDatum").val(data.TPopMassnDatum);
				} else {
					$("#TPopMassnDatum").val("");
				}
				//TPopMassnBearb: Daten holen - oder vorhandene nutzen
				if (!window.adressen_html) {
					$.ajax({
						url: 'php/adressen.php',
						dataType: 'json',
						success: function (data2) {
							if (data2) {
								//ap bereitstellen
								//Feld mit Daten beliefern
								var html;
								html = "<option></option>";
								//for (i in data2.rows) {
								for (var i = 0; i < data2.rows.length; i++) {
									html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
								}
								window.adressen_html = html;
								$("#TPopMassnBearb").html(html);
								$("#TPopMassnBearb").val(window.tpopmassn.TPopMassnBearb);
							}
						}
					});
				} else {
					$("#TPopMassnBearb").html(window.adressen_html);
					$("#TPopMassnBearb").val(window.tpopmassn.TPopMassnBearb);
				}
				$("#TPopMassnBemTxt").val(data.TPopMassnBemTxt);
				if (data.TPopMassnPlan == 1) {
					$("#TPopMassnPlan").prop("checked", true);
				} else {
					$("#TPopMassnPlan").prop("checked", false);
				}
				$("#TPopMassnPlanBez").val(data.TPopMassnPlanBez);
				$("#TPopMassnPlanBez").limiter(255, $("#TPopMassnPlanBez_limit"));
				$("#TPopMassnFlaeche").val(data.TPopMassnFlaeche);
				$("#TPopMassnAnsiedForm").val(data.TPopMassnAnsiedForm);
				$("#TPopMassnAnsiedForm").limiter(255, $("#TPopMassnAnsiedForm_limit"));
				$("#TPopMassnAnsiedPflanzanordnung").val(data.TPopMassnAnsiedPflanzanordnung);
				$("#TPopMassnAnsiedPflanzanordnung").limiter(255, $("#TPopMassnAnsiedPflanzanordnung_limit"));
				$("#TPopMassnMarkierung").val(data.TPopMassnMarkierung);
				$("#TPopMassnMarkierung").limiter(255, $("#TPopMassnMarkierung_limit"));
				$("#TPopMassnAnsiedAnzTriebe").val(data.TPopMassnAnsiedAnzTriebe);
				$("#TPopMassnAnsiedAnzPfl").val(data.TPopMassnAnsiedAnzPfl);
				$("#TPopMassnAnzPflanzstellen").val(data.TPopMassnAnzPflanzstellen);
				//für TPopMassnAnsiedWirtspfl Artliste bereitstellen
				if (!window.artliste_html) {
					$.ajax({
						url: 'php/artliste.php',
						dataType: 'json',
						success: function (data) {
							var html;
							html = "<option></option>";
							//for (i in data.rows) {
							for (var i = 0; i < data.rows.length; i++) {
								html += "<option value=\"" + data.rows[i].id + "\">" + data.rows[i].Artname + "</option>";
							}
							window.artliste_html = html;
							$("#TPopMassnAnsiedWirtspfl").html(html);
							$("#TPopMassnAnsiedWirtspfl").val(data.TPopMassnAnsiedWirtspfl);
						}
					});
				} else {
					$("#TPopMassnAnsiedWirtspfl").html(window.artliste_html);
					$("#TPopMassnAnsiedWirtspfl").val(data.TPopMassnAnsiedWirtspfl);
				}
				$("#TPopMassnAnsiedHerkunftPop").val(data.TPopMassnAnsiedHerkunftPop);
				$("#TPopMassnAnsiedHerkunftPop").limiter(255, $("#TPopMassnAnsiedHerkunftPop_limit"));
				$("#TPopMassnAnsiedDatSamm").val(data.TPopMassnAnsiedDatSamm);
				$("#TPopMassnAnsiedDatSamm").limiter(50, $("#TPopMassnAnsiedDatSamm_limit"));
				$("#TPopMassnGuid").val(data.TPopMassnGuid);
				//Formulare blenden
				zeigeFormular("tpopmassn");
				history.replaceState({tpopmassn: "tpopmassn"}, "tpopmassn", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopmassn=" + localStorage.tpopmassn_id);
				//bei neuen Datensätzen Fokus steuern
				$('#TPopMassnJahr').focus();
			}
		}
	});
}

//setzt window.tpopmassn und localStorage.tpopmassn_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowTpopmassn(id) {
	localStorage.tpopmassn_id = id;
	$.ajax({
		url: 'php/tpopmassn.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassn_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopmassn bereitstellen
				window.tpopmassn = data;
			}
		}
	});
}

function initiiere_tpopmassnber() {
	if (!localStorage.tpopmassnber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpopmassnber");
	//Daten für die pop aus der DB holen
	$.ajax({
		url: 'php/tpopmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassnber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.tpopmassnber = data;
				//Felder mit Daten beliefern
				$("#TPopMassnBerJahr").val(data.TPopMassnBerJahr);
				$("#TPopMassnBerErfolgsbeurteilung" + data.TPopMassnBerErfolgsbeurteilung).prop("checked", true);
				$("#TPopMassnBerTxt").val(data.TPopMassnBerTxt);
				//Formulare blenden
				zeigeFormular("tpopmassnber");
				history.replaceState({tpopmassnber: "tpopmassnber"}, "tpopmassnber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopmassnber=" + localStorage.tpopmassnber_id);
				//bei neuen Datensätzen Fokus steuern
				$('#TPopMassnBerJahr').focus();
			}
		}
	});
}

//setzt window.tpopmassnber und localStorage.tpopmassnber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowTpopmassnber(id) {
	localStorage.tpopmassnber_id = id;
	$.ajax({
		url: 'php/tpopmassnber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopmassnber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopmassnber bereitstellen
				window.tpopmassnber = data;
			}
		}
	});
}

function initiiere_tpopber() {
	if (!localStorage.tpopber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpopber");
	//Daten für die tpopber aus der DB holen
	$.ajax({
		url: 'php/tpopber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopber bereitstellen
				window.tpopber = data;
				//Felder mit Daten beliefern
				$("#TPopBerJahr").val(data.TPopBerJahr);
				$("#TPopBerEntwicklung" + data.TPopBerEntwicklung).prop("checked", true);
				$("#TPopBerTxt").val(data.TPopBerTxt);
				//Formulare blenden
				zeigeFormular("tpopber");
				history.replaceState({tpopber: "tpopber"}, "tpopber", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&tpopber=" + localStorage.tpopber_id);
				//bei neuen Datensätzen Fokus steuern
				$('#TPopBerJahr').focus();
			}
		}
	});
}

//setzt window.tpopber und localStorage.tpopber_id
//wird benötigt, wenn beim App-Start direkt ein deep link geöffnet wird
function setzeWindowTpopber(id) {
	localStorage.tpopber_id = id;
	$.ajax({
		url: 'php/tpopber.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopber bereitstellen
				window.tpopber = data;
			}
		}
	});
}

function initiiere_beob(beobtyp, beobid, beob_status) {
	//beob_status markiert, ob die Beobachtung:
	//- schon zugewiesen ist (zugeordnet)
	//- noch nicht beurteilt ist (nicht_beurteilt)
	//- nicht zuzuordnen ist (nicht_zuzuordnen)
	//beob_status muss gespeichert werden, damit bei Datenänderungen bekannt ist, ob ein bestehender Datensatz bearbeitet oder ein neuer geschaffen werden muss
	localStorage.beob_status = beob_status;
	//sicherstellen, dass beobtyp immer bekannt ist
	localStorage.beobtyp = beobtyp;
	//beobid hat 'beob' vorangestellt - entfernen!
	beobid = beobid.replace('beob', '');
	//beobid bereitstellen
	localStorage.beob_id = beobid;

	var url, url_distzutpop;
	if (!beobid) {
		//es fehlen benötigte Daten > eine Ebene höher
		if (beob_status === "nicht_beurteilt" || beob_status === "nicht_zuzuordnen") {
			initiiere_ap();
		} else {
			initiiere_pop();
		}
		return;
	}
	
	//EvAB oder Infospezies? > entsprechende url zusammensetzen
	url = 'php/beob_' + beobtyp + '.php';
	
	//Daten für die beob aus der DB holen
	$.ajax({
		url: url,
		dataType: 'json',
		data: {
			"id": beobid
		},
		success: function (data_beob) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data_beob) {

				//boebfelder bereitstellen
				var html_beobfelder = erstelleFelderFuerBeob(data_beob, beobtyp);
				$("#beob_table").html(html_beobfelder);
				
				//Abstand zu TPop aus der DB holen
				url_distzutpop = 'php/beob_distzutpop_' + beobtyp + '.php';
				$.ajax({
					url: url_distzutpop,
					dataType: 'json',
					data: {
						"beobid": beobid
					},
					success: function (data) {
						//Tabellenzeile beginnen
						var html_distzutpop = '<tr class="fieldcontain DistZuTPop"><td class="label"><label id="DistZuTPop_label" for="DistZuTPop">Einer Teilpopulation zuordnen:</label></td><td class="Datenfelder"><div class="Datenfelder" id="DistZuTPop_Felder">';
						if (data) {
							for (var i=0; i < data.length; i++) {
								if (i>0) {
									html_distzutpop += "<br>";
								}
								html_distzutpop += '<input type="radio" name="DistZuTPop" id="DistZuTPop';
								html_distzutpop += data[i].TPopId;
								html_distzutpop += '" class="DistZuTPop" formular="beob" value="';
								html_distzutpop += data[i].TPopId;
								html_distzutpop += '" DistZuTPop="';
								html_distzutpop += data[i].DistZuTPop;
								html_distzutpop += '">';
								//Wenn TPop keine Koordinaten haben, dies anzeigen und Anzeige von NAN verhindern
								if (parseInt(data[i].DistZuTPop, 10) >= 0) {
									html_distzutpop += parseInt(data[i].DistZuTPop) + "m: " + data[i].TPopFlurname;
								} else {
									html_distzutpop += data[i].TPopFlurname;
								}
							}
							//Tabellenzeile abschliessen
							html_distzutpop += '</div></td></tr>';

							//distzutpop bereitstellen
							$("#beob_zuordnungsfelder").html(html_distzutpop);

							$("#BeobBemerkungen").attr("placeholder", "");

							if (beob_status !== "nicht_beurteilt") {
								//Daten der Zuordnung holen
								$.ajax({
									url: 'php/beob_zuordnung.php',
									dataType: 'json',
									data: {
										"id": beobid
									},
									success: function (data) {
										//Felder mit Daten beliefern
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

										//Formulare blenden
										zeigeFormular("beob");
										if (beob_status === "zugeordnet") {
											history.replaceState({beob_zugeordnet: "beob_zugeordnet"}, "beob_zugeordnet", "index.html?ap=" + localStorage.ap_id + "&pop=" + localStorage.pop_id + "&tpop=" + localStorage.tpop_id + "&beob_zugeordnet=" + beobid);
										} else if (beob_status === "nicht_zuzuordnen") {
											history.replaceState({beob_nicht_zuzuordnen: "beob_nicht_zuzuordnen"}, "beob_nicht_zuzuordnen", "index.html?ap=" + localStorage.ap_id + "&beob_nicht_zuzuordnen=" + beobid);
										}
									}
								});
							} else {
								//beob_status ist "nicht beurteilt"
								$("#BeobNichtBeurteilt").prop("checked", true);
								$("#BeobNichtZuordnen").prop("checked", false);
								//allfällige im letzen beob enthaltene Werte entfernen
								$("#BeobBemerkungen").val("");
								$("#BeobBemerkungen").attr("placeholder", "Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich");
								//Formulare blenden
								zeigeFormular("beob");
								history.replaceState({beob_nicht_beurteilt: "beob_nicht_beurteilt"}, "beob_nicht_beurteilt", "index.html?ap=" + localStorage.ap_id + "&beob_nicht_beurteilt=" + beobid);
							}
						}
					}
				});
			}
		}
	});
}

function initiiere_exporte(anchor) {
	$("#testart_div").hide();
	$("#forms_titelzeile").hide();
	zeigeFormular("exporte");
	history.replaceState({ex: "ex"}, "ex", "index.html?exporte=true");
	if (anchor) {
		location.hash = "#" + anchor;
	}
}

//managed die Sichtbarkeit von Formularen
//wird von allen initiiere_-Funktionen verwendet
//wird ein Formularname übergeben, wird dieses Formular gezeigt
//und alle anderen ausgeblendet
//zusätzlich wird die Höhe von textinput-Feldern an den Textinhalt angepasst
function zeigeFormular(Formularname) {
	var formular_angezeigt = $.Deferred();
	//zuerst alle Formulare ausblenden
	$("#forms").hide();
	$('form').each(function() {
		$(this).hide();
	});
	//Karten sind in div statt form
	$('.karte').each(function() {
		$(this).hide();
	});

	//damit kann bei Grössenänderung die Formularhöhe von Karten gemanagt werden
	window.kartenhoehe_manuell = false;
	//höhe von forms auf auto setzen, weil dies von den Kartenansichten verändert wird
	$("#forms").height('auto');
	$("#testart_div").hide();
	$("#forms_titelzeile").hide();
	//Titelzeile anzeigen, weil sie für die Kartenanzeige entfernt wird
	//$("#forms_titelzeile").css("display", "inline-block");
	//Bei Testarten Hinweis anzeigen
	if ($("#ap_waehlen").val()) {
		//titelzeile inline, sonst gibt es einen unschönen Abstand nach oben
		//$("#forms_titelzeile").css("display", "inline");
		$("#forms_titelzeile").css("display", "none");
		if ($("#ap_waehlen").val() <= 150 && Formularname !== "jber_uebersicht" && Formularname !== "exporte" && Formularname !== "GeoAdminKarte") {
			$("#testart_div").css("color", "#03970F");
			//titelzeile inline-block, sonst werden Tabs nach rechts verschoben
			$("#forms_titelzeile").css("display", "inline-block");
			$("#testart_div").show();
			//$("#forms_titelzeile").show();
			$("#testart_div").html("Das ist eine Testart - hier kann man alles ausprobieren!");
		} else if ($("#ap_waehlen").val() <= 150 && Formularname === "jber_uebersicht") {
			$("#testart_div").css("color", "#DF0303");
			$("#forms_titelzeile").css("display", "inline-block");
			$("#testart_div").show();
			//$("#forms_titelzeile").show();
			$("#testart_div").html("Vorsicht: Die Übericht ist für alle Arten, daher HIER NICHT TESTEN");
		}
	}

	if (Formularname) {
		$("#forms").show();
		$("#ap_loeschen").show();
		if (Formularname === "google_karte" || Formularname === "GeoAdminKarte") {
			//Titelzeile entfernen
			$("#forms_titelzeile").css("display", "none");
			//höhe einstellen
			$("#" + Formularname).css("height", $(window).height()-17 + "px");
			//markieren, dass die Formularhöhe anders gesetzt werden soll
			window.kartenhoehe_manuell = true;
			setzeKartenhoehe();
			$("#" + Formularname).show();
			if (Formularname === "GeoAdminKarte") {
				//auswählen deaktivieren und allfällige Liste ausblenden
				$("#mitPolygonWaehlen").button({ disabled: false });
				initiiereGeoAdminKarte();
			}
		} else {
			$("#forms").css("background-color", "#FFE")
			$('form').each(function() {
				$(this).hide();
				if ($(this).attr("id") === Formularname) {
					$(this).show();
					$('textarea').each(function () {
						FitToContent(this, document.documentElement.clientHeight);
					});
				}
			});
			$(window).scrollTop(0);
		}
		formular_angezeigt.resolve();
	}
	return formular_angezeigt.promise();
}

//leert alle Felder und stellt ihre Breite ein
function leereFelderVonFormular(Formular) {
	$('#' + Formular + ' input[type="text"]').each(function(){
		$(this).val("");
	});
	$('#' + Formular + ' input[type="radio"]:checked').each(function(){
		$(this).prop('checked', false);
	});
	$('#' + Formular + ' select').each(function(){
		$(this).val("");
	});
}

//begrenzt die maximale Höhe des Baums auf die Seitenhöhe, wenn nötig
function setzeTreehoehe() {
	if ($(window).width() > 1000) {
		if (($(".jstree-no-icons").height() + 157) > $(window).height()) {
			$("#tree").css("max-height", $(window).height() - 145);
		}
	} else {
		//Spalten sind untereinander. Baum 75px weniger hoch, damit Formulare immer erreicht werden können
		if (($(".jstree-no-icons").height() + 157) > $(window).height()-75) {
			$("#tree").css("max-height", $(window).height() - 220);
		}
	}
}

function setzeKartenhoehe() {
	//Formulare sind unbegrenzt hoch aber Karten sollen das nicht sein
	if (window.kartenhoehe_manuell) {
		$("#forms").height($(window).height() - 17);
		if (typeof window.api !== "undefined" && window.api.map) {
			//$("#GeoAdminKarte").height($(window).height() - 17);
			window.api.map.updateSize();
		}
		if (typeof google !== "undefined" && google.maps && typeof map !== "undefined") {
			//$("#google_karte").height($(window).height() - 17);
			google.maps.event.trigger(map, 'resize');
		}
	} else {
		$("#forms").height('auto');
	}
}

(function($) {
	$.fn.hasScrollBar = function() {
		return this.get(0).scrollHeight > this.height();
	}
})(jQuery);

//setzt die Höhe von textareas so, dass der Text genau rein passt
function FitToContent(id, maxHeight) {
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
}

function erstelle_ap_liste(programm) {
	var apliste_erstellt = $.Deferred();
	$.ajax({
		url: 'php/apliste.php?programm=' + programm,
		dataType: 'json',
		success: function (data) {
			var html;
			html = "<option></option>";
			for (var i = 0; i < data.rows.length; i++) {
				html += "<option value=\"" + data.rows[i].id + "\">" + data.rows[i].ap_name + "</option>";
			}
			$("#ap_waehlen").html(html);
			apliste_erstellt.resolve();
		}
	});
	return apliste_erstellt.promise();
}

function waehle_ap_liste(programm) {
	var apliste_gewaehlt = $.Deferred();
	$("#ap_waehlen_label").html("Daten werden aufbereitet...");
	$("#ap_waehlen").html("");
	$("#ap").hide();
	$("#forms").hide();
	$('#tree').hide();
	$("#suchen").hide();
	$("#hilfe").hide();
	$("#ap_loeschen").hide();
	$("#ap_waehlen").val("");
	initiiere_ap();
	$.when(erstelle_ap_liste(programm))
		.then(function() {
			if ($("[name='programm_wahl']:checked").attr("id") === "programm_neu") {
				$("#ap_waehlen_label").html("Art für neues Förderprogramm wählen:");
			} else if ($("[name='programm_wahl']:checked").attr("id") === "programm_ap") {
				$("#ap_waehlen_label").html("Aktionsplan wählen:");
			} else {
				$("#ap_waehlen_label").html("Artförderprogramm wählen:");
			}
			$("#ap_waehlen_label").show();
			apliste_gewaehlt.resolve();
		});
	return apliste_gewaehlt.promise();
}

function erstelle_tree(ApArtId) {
	var jstree_erstellt = $.Deferred();
	$("#tree").jstree( {
		"json_data": {
			"ajax": {
				"url": "php/tree.php",
				"progressive_render": true,
				"data" : function (n) {
					return {
						id : ApArtId
					};
				}
			}
		},
		"core": {
			"open_parents": true,	//wird ein node programmatisch geöffnet, öffnen sich alle parents
			"strings": {	//Deutsche Übersetzungen
				"loading": "hole Daten...",
				"new_node": "neuer Knoten"
			},
		},
		"ui": {
			"select_limit": 1,	//nur ein Datensatz kann aufs mal gewählt werden
			"selected_parent_open": true,	//wenn Code einen node wählt, werden alle parents geöffnet
			"select_prev_on_delete": true
		},
		"search": {
			"case_insensitive": true
		},
		"sort": function (a, b) {
			if ($(a).attr("sort") && $(b).attr("sort")) {
				return parseInt($(a).attr("sort"), 10) > parseInt($(b).attr("sort"), 10) ? 1 : -1;
			}
		},
		"themes": {
			"icons": false
		},
		"contextmenu": {
			"items": treeKontextmenu,
			"select_node": true
		},
		"crrm": {
			"move": {
				"default_position": "first",
				"check_move": function (m) {
					//hier wird bestimmt, welche drag-drop-Kombinationen zulässig sind
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
			"valid_children": ["ap_ordner_pop", "ap_ordner_apziel", "ap_ordner_erfkrit", "ap_ordner_jber", "ap_ordner_ber", "ap_ordner_beob_nicht_beurteilt", "ap_ordner_beob_nicht_zuzuordnen", "umwfakt", "ap_ordner_assozarten"],
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
				"umwfakt": {
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
		//"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "dnd", "types"]   //dnd ausgeschaltet, weil es Speichern verhindert im letzten Feld vor Klick in Baum
	})
	.show()
	.bind("loaded.jstree", function (event, data) {
		jstree_erstellt.resolve();
		setzeTreehoehe();
		$("#suchen").show();
		$("#hilfe").show();
		if (window.pop_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese Pop geöffnet wird
			delete window.pop_zeigen;
		}
		if (window.popber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='popber']#" + localStorage.popber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese Popber geöffnet wird
			delete window.popber_zeigen;
		}
		if (window.popmassnber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='popmassnber']#" + localStorage.popmassnber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese popmassnber geöffnet wird
			delete window.popmassnber_zeigen;
		}
		if (window.tpop_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='tpop']#" + localStorage.tpop_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese TPop geöffnet wird
			delete window.tpop_zeigen;
		}
		if (window.tpopfeldkontr_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='tpopfeldkontr']#" + localStorage.tpopfeldkontr_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfeldkontr geöffnet wird
			delete window.tpopfeldkontr_zeigen;
		}
		if (window.tpopfreiwkontr_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='tpopfreiwkontr']#" + localStorage.tpopfeldkontr_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopfreiwkontr geöffnet wird
			delete window.tpopfreiwkontr_zeigen;
		}
		if (window.tpopmassn_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='tpopmassn']#" + localStorage.tpopmassn_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassn geöffnet wird
			delete window.tpopmassn_zeigen;
		}
		if (window.tpopber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='tpopber']#" + localStorage.tpopber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopber geöffnet wird
			delete window.tpopber_zeigen;
		}
		if (window.beob_zugeordnet_zeigen) {
			jQuery("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese beob_zugeordnet geöffnet wird
			delete window.beob_zugeordnet_zeigen;
		}
		if (window.tpopmassnber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='tpopmassnber']#" + localStorage.tpopmassnber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese tpopmassnber geöffnet wird
			delete window.tpopmassnber_zeigen;
		}
		if (window.apziel_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='apziel']#" + localStorage.apziel_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese apziel geöffnet wird
			delete window.apziel_zeigen;
		}
		if (window.zielber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='zielber']#" + localStorage.zielber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese zielber geöffnet wird
			delete window.zielber_zeigen;
		}
		if (window.erfkrit_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='erfkrit']#" + localStorage.erfkrit_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese erfkrit geöffnet wird
			delete window.erfkrit_zeigen;
		}
		if (window.jber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='jber']#" + localStorage.jber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese jber geöffnet wird
			delete window.jber_zeigen;
		}
		if (window.jber_uebersicht_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='jber_uebersicht']#" + localStorage.jber_uebersicht_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese jber_uebersicht geöffnet wird
			delete window.jber_uebersicht_zeigen;
		}
		if (window.ber_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='ber']#" + localStorage.ber_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese ber geöffnet wird
			delete window.ber_zeigen;
		}
		if (window.umwfakt_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='umwfakt']#" + localStorage.umwfakt_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese umwfakt geöffnet wird
			delete window.umwfakt_zeigen;
		}
		if (window.assozarten_zeigen) {
			jQuery("#tree").jstree("select_node", "[typ='assozarten']#" + localStorage.assozarten_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese assozarten geöffnet wird
			delete window.assozarten_zeigen;
		}
		if (window.beob_nicht_beurteilt_zeigen) {
			jQuery("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
			delete window.beob_nicht_beurteilt_zeigen;
		}
		if (window.beob_nicht_zuzuordnen_zeigen) {
			jQuery("#tree").jstree("select_node", "#beob" + localStorage.beob_id);
			//diese Markierung entfernen, damit das nächste mal nicht mehr diese beob geöffnet wird
			delete window.beob_nicht_zuzuordnen_zeigen;
		}
		if (window.ap_zeigen) {
			initiiere_ap();
			//diese Markierung entfernen, damit das nächste mal nicht mehr dieser AP geöffnet wird
			delete window.ap_zeigen;
		}
	})
	//auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
	.hammer().bind("hold doubletap", function (event) {
		//auf PC's verhindern: Menu erscheint sonst beim Scrollen
		if ($(window).width() < 1000) {
			setTimeout(function() {
				jQuery("#tree").jstree('get_selected').children('a').trigger('contextmenu');
			}, 500);
		}
	})
	.bind("select_node.jstree", function (e, data) {
		var node;	
		delete localStorage.tpopfreiwkontr;	//Erinnerung an letzten Klick im Baum löschen
		node = data.rslt.obj;
		var node_typ = node.attr("typ");
		//in der ID des Nodes enthaltene Texte müssen entfernt werden
		var node_id = erstelleIdAusDomAttributId(node.attr("id"));
		jQuery.jstree._reference(node).open_node(node);
		if (node_typ.slice(0, 3) === "ap_" || node_typ === "apzieljahr") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ap").is(':visible') || localStorage.ap_id !== node_id) {
				localStorage.ap_id = node_id;
				delete localStorage.pop_id;
				initiiere_ap();
			}
		} else if (node_typ === "pop" || node_typ.slice(0, 4) === "pop_") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#pop").is(':visible') || localStorage.pop_id !== node_id) {
				localStorage.pop_id = node_id;
				initiiere_pop();
			}
		} else if (node_typ === "apziel" || node_typ === "zielber_ordner") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#apziel").is(':visible') || localStorage.apziel_id !== node_id) {
				localStorage.apziel_id = node_id;
				initiiere_apziel();
			}
		} else if (node_typ === "zielber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#zielber").is(':visible') || localStorage.zielber_id !== node_id) {
				localStorage.zielber_id = node_id;
				initiiere_zielber();
			}
		} else if (node_typ === "erfkrit") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#erfkrit").is(':visible') || localStorage.erfkrit_id !== node_id) {
				localStorage.erfkrit_id = node_id;
				initiiere_erfkrit();
			}
		} else if (node_typ === "jber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#jber").is(':visible') || localStorage.jber_id !== node_id) {
				localStorage.jber_id = node_id;
				initiiere_jber();
			}
		} else if (node_typ === "jber_uebersicht") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#jber_uebersicht").is(':visible') || localStorage.jber_uebersicht_id !== node_id) {
				localStorage.jber_uebersicht_id = node_id;
				initiiere_jber_uebersicht();
			}
		} else if (node_typ === "ber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ber").is(':visible') || localStorage.ber_id !== node_id) {
				localStorage.ber_id = node_id;
				initiiere_ber();
			}
		} else if (node_typ === "umwfakt") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#umwfakt").is(':visible')) {
				//eigene id nicht nötig
				//1:1 mit ap verbunden, gleich id
				//wenn noch kein Datensatz existiert erstellt ihn initiiere_umwfakt
				initiiere_umwfakt();
			}
		} else if (node_typ === "assozarten") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#assozarten").is(':visible') || localStorage.assozarten_id !== node_id) {
				localStorage.assozarten_id = node_id;
				initiiere_assozarten();
			}
		} else if (node_typ === "popber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#popber").is(':visible') || localStorage.popber_id !== node_id) {
				localStorage.popber_id = node_id;
				initiiere_popber();
			}
		} else if (node_typ === "popmassnber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#popmassnber").is(':visible') || localStorage.popmassnber_id !== node_id) {
				localStorage.popmassnber_id = node_id;
				initiiere_popmassnber();
			}
		} else if (node_typ === "tpop" || node_typ.slice(0, 5) === "tpop_") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpop").is(':visible') || localStorage.tpop_id !== node_id) {
				localStorage.tpop_id = node_id;
				initiiere_tpop();
			}
		} else if (node_typ === "tpopfeldkontr") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node_id) {
				localStorage.tpopfeldkontr_id = node_id;
				initiiere_tpopfeldkontr();
			}
		} else if (node_typ === "tpopfreiwkontr") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node_id) {
				localStorage.tpopfeldkontr_id = node_id;
				localStorage.tpopfreiwkontr = true;
				initiiere_tpopfeldkontr();
			}
		} else if (node_typ === "tpopmassn") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassn").is(':visible') || localStorage.tpopmassn_id !== node_id) {
				localStorage.tpopmassn_id = node_id;
				initiiere_tpopmassn();
			}
		} else if (node_typ === "tpopber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopber").is(':visible') || localStorage.tpopber_id !== node_id) {
				localStorage.tpopber_id = node_id;
				initiiere_tpopber();
			}
		} else if (node_typ === "beob_zugeordnet") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "zugeordnet") {
				localStorage.beob_id = node_id;
				localStorage.beobtyp = node.attr("beobtyp");
				initiiere_beob(node.attr("beobtyp"), node_id, "zugeordnet");
			}
		} else if (node_typ === "beob_nicht_beurteilt") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "nicht_beurteilt") {
				localStorage.beob_id = node_id;
				localStorage.beobtyp = node.attr("beobtyp");
				//den Beobtyp mitgeben
				initiiere_beob(node.attr("beobtyp"), node_id, "nicht_beurteilt");
			}
		} else if (node_typ === "beob_nicht_zuzuordnen") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.beob_id !== node_id || localStorage.beob_status !== "nicht_zuzuordnen") {
				localStorage.beob_id = node_id;
				localStorage.beobtyp = node.attr("beobtyp");
				//den Beobtyp mitgeben
				initiiere_beob(node.attr("beobtyp"), node_id, "nicht_zuzuordnen");
			}
		} else if (node_typ === "tpopmassnber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnber_id !== node_id) {
				localStorage.tpopmassnber_id = node_id;
				initiiere_tpopmassnber();
			}
		}
	})
	.bind("after_open.jstree", function (e, data) {
		setzeTreehoehe();
	})
	.bind("after_close.jstree", function (e, data) {
		setzeTreehoehe();
	})
	.bind("prepare_move.jstree", function (e, data) {
		//herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
		window.herkunft_parent_node = jQuery.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
	})
	.bind("create_node.jstree", function (e, data) {
		if (data.rslt.parent[0].attributes.typ.nodeValue === "apzieljahr") {
			$("#ZielJahr").val(data.rslt.parent[0].innerText.slice(1, 5));
			var Objekt = {};
			Objekt.name = "ZielJahr";
			Objekt.formular = "apziel";
			speichern(Objekt);
			$("#ZielJahr").focus();
		}
	})
	.bind("move_node.jstree", function (e, data) {
		var herkunft_node, herkunft_node_id, herkunft_node_typ, ziel_node, ziel_node_id, ziel_node_typ, ziel_parent_node, ziel_parent_node_id;
		
		//nur aktualisieren, wenn Schreibrechte bestehen
		if (sessionStorage.NurLesen) {
			$("#Meldung").html("Sie haben keine Schreibrechte");
			$("#Meldung").dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog("close");
					}
				}
			});
			return;
		}

		//Variabeln setzen
		herkunft_node = data.rslt.o;
		herkunft_node_id = erstelleIdAusDomAttributId($(herkunft_node).attr("id"));
		herkunft_node_typ = herkunft_node.attr("typ");
		ziel_node = data.rslt.r;
		ziel_node_id = erstelleIdAusDomAttributId($(ziel_node).attr("id"));
		ziel_node_typ = ziel_node.attr("typ");
		ziel_parent_node = jQuery.jstree._reference(data.rslt.r)._get_parent(data.rslt.r);
		if ($(ziel_parent_node).attr("id")) {
			ziel_parent_node_id = erstelleIdAusDomAttributId($(ziel_parent_node).attr("id"));
		}

		if (herkunft_node_typ === "pop") {
			if (ziel_node_typ === "pop") {
				$.ajax({
					url: 'php/pop_einfuegen.php',		//TO DO: PHP
					dataType: 'json',
					data: {
						"ap_art_id": ziel_parent_node_id,
						"pop_id": ziel_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_ap_ordner_pop(ziel_parent_node);
						beschrifte_ap_ordner_pop(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(ziel_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.pop_id = herkunft_node_id;
						delete window.pop;
						delete window.pop_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_pop();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "tpop") {
				$.ajax({
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_parent_node_id,
						"tpop_id": ziel_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_pop_ordner_tpop(ziel_parent_node);
						beschrifte_pop_ordner_tpop(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(ziel_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpop_id = herkunft_node_id;
						delete window.tpop;
						delete window.tpop_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpop();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "pop_ordner_tpop") {
				$.ajax({
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_node_id,
						"tpop_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_pop_ordner_tpop(ziel_node);
						beschrifte_pop_ordner_tpop(window.herkunft_parent_node);
						//select steuern
						jQuery.jstree._reference(ziel_node).deselect_all();
						jQuery.jstree._reference(ziel_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpop_id = herkunft_node_id;
						delete window.tpop;
						delete window.tpop_node_ausgeschnitten;
						initiiere_tpop();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "tpop") {
			if (ziel_node_typ === "tpop") {
				$.ajax({
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_parent_node_id,
						"tpop_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_pop_ordner_tpop(ziel_parent_node);
						beschrifte_pop_ordner_tpop(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(ziel_parent_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpop_id = herkunft_node_id;
						delete window.tpop;
						delete window.tpop_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpop();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "pop_ordner_tpop") {
				$.ajax({
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": ziel_node_id,
						"tpop_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_pop_ordner_tpop(ziel_node);
						beschrifte_pop_ordner_tpop(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpop_id = herkunft_node_id;
						delete window.tpop;
						delete window.tpop_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpop();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "tpopmassn") {
			if (ziel_node_typ === "tpopmassn") {
				$.ajax({
					url: 'php/tpopmassn_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_parent_node_id,
						"tpopmassn_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_massn(ziel_parent_node);
						beschrifte_tpop_ordner_massn(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(ziel_parent_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopmassn_id = herkunft_node_id;
						delete window.tpopmassn;
						delete window.tpopmassn_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpopmassn();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Massnahme wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "tpop_ordner_massn") {
				$.ajax({
					url: 'php/tpopmassn_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_node_id,
						"tpopmassn_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_massn(ziel_node);
						beschrifte_tpop_ordner_massn(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopmassn_id = herkunft_node_id;
						delete window.tpopmassn;
						delete window.tpopmassn_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpopmassn();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Massnahme wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "tpopfeldkontr") {
			if (ziel_node_typ === "tpopfeldkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_parent_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_feldkontr(ziel_parent_node);
						beschrifte_tpop_ordner_feldkontr(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopfeldkontr_id = herkunft_node_id;
						delete window.tpopfeldkontr;
						delete window.tpopfeldkontr_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpopfeldkontr();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Feldkontrolle wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "tpop_ordner_feldkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_feldkontr(ziel_node);
						beschrifte_tpop_ordner_feldkontr(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopfeldkontr_id = herkunft_node_id;
						delete window.tpopfeldkontr;
						delete window.tpopfeldkontr_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpopfeldkontr();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Feldkontrolle wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "tpopfreiwkontr") {
			if (ziel_node_typ === "tpopfreiwkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_parent_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_freiwkontr(ziel_parent_node);
						beschrifte_tpop_ordner_freiwkontr(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopfeldkontr_id = herkunft_node_id;
						delete window.tpopfeldkontr;
						delete window.tpopfreiwkontr_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						localStorage.tpopfreiwkontr = true;
						initiiere_tpopfeldkontr();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "tpop_ordner_freiwkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": ziel_node_id,
						"tpopfeldkontr_id": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_freiwkontr(ziel_node);
						beschrifte_tpop_ordner_freiwkontr(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopfeldkontr_id = herkunft_node_id;
						delete window.tpopfeldkontr;
						delete window.tpopfreiwkontr_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						localStorage.tpopfreiwkontr = true;
						initiiere_tpopfeldkontr();
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Freiwilligen-Kontrolle wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "beob_zugeordnet") {
			//zugeordnet
			if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
				//zugeordnet > nicht beurteilt
				$.ajax({
					url: 'php/beob_zuordnung_delete.php',
					dataType: 'json',
					data: {
						"id": herkunft_node_id
					},
					success: function() {
						//typ des nodes anpassen
						herkunft_node.attr("typ", "beob_nicht_beurteilt");
						localStorage.beobtyp = "beob_nicht_beurteilt";
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						if (ziel_node_typ === "beob_nicht_beurteilt") {
							beschrifte_ap_ordner_beob_nicht_beurteilt(ziel_parent_node);
						} else {
							beschrifte_ap_ordner_beob_nicht_beurteilt(ziel_node);
						}
						beschrifte_tpop_ordner_beob_zugeordnet(window.herkunft_parent_node);
						//beob initiieren
						initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_beurteilt");
						//Variablen aufräumen
						delete window.beob_zugeordnet_node_ausgeschnitten;
						delete window.herkunft_parent_node;
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Beobachtung wurde nicht zugeordnet");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
				//zugeordnet > zugeordnet
				var neue_tpop_id;
				if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
					neue_tpop_id = ziel_node_id;
				} else {
					neue_tpop_id = ziel_parent_node_id;
				}
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": localStorage.beob_id,
						"Feld": "TPopId",
						"Wert": neue_tpop_id,
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
							beschrifte_tpop_ordner_beob_zugeordnet(ziel_node);
						} else {
							beschrifte_tpop_ordner_beob_zugeordnet(ziel_parent_node);
						}
						beschrifte_tpop_ordner_beob_zugeordnet(window.herkunft_parent_node);
						//selection steuern
						if (!localStorage.karte_fokussieren) {
							initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
						} else {
							delete localStorage.karte_fokussieren;
						}
						//Variablen aufräumen
						delete window.beob_zugeordnet_node_ausgeschnitten;
						delete window.herkunft_parent_node;
					},
					error: function () {
						$("#Meldung").html("Fehler: Die Beobachtung wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
				//zugeordnet > nicht zuzuordnen
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": herkunft_node_id,
						"Feld": "BeobNichtZuordnen",
						"Wert": 1,
						"user": sessionStorage.User
					},
					success: function() {
						//TPopId null setzen
						$.ajax({
							url: 'php/beob_update.php',
							dataType: 'json',
							data: {
								"id": herkunft_node_id,
								"Feld": "TPopId",
								"Wert": "",
								"user": sessionStorage.User
							},
							error: function() {
								console.log("fehler beim Leeren von TPopId");
							}
						}).done(function() {
							//aus unerfindlichen Gründen läuft der success callback nicht, darum done
							//typ des nodes anpassen
							herkunft_node.attr("typ", "beob_nicht_zuzuordnen");
							localStorage.beobtyp = "beob_nicht_zuzuordnen";
							//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
							if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
								beschrifte_ap_ordner_beob_nicht_zuzuordnen(ziel_node);
							} else {
								beschrifte_ap_ordner_beob_nicht_zuzuordnen(ziel_parent_node);
							}
							beschrifte_tpop_ordner_beob_zugeordnet(window.herkunft_parent_node);
							//Beob initiieren
							initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_zuzuordnen");
							//Variablen aufräumen
							delete window.beob_node_ausgeschnitten;
							delete window.herkunft_parent_node;
						});
					},
					error: function() {
						$("#Meldung").html("Fehler: Die Beobachtung wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "beob_nicht_beurteilt") {
			//nicht beurteilt
			if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
				//nicht beurteilt > zugeordnet
				var neue_tpop_id;
				if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
					neue_tpop_id = ziel_node_id;
				} else {
					neue_tpop_id = ziel_parent_node_id;
				}
				//Zuerst eine neue Zuordnung erstellen
				$.ajax({
					url: 'php/beob_zuordnung_insert.php',
					dataType: 'json',
					data: {
						"no_note": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function() {
						//jetzt aktualisieren
						$.ajax({
							url: 'php/beob_update.php',
							dataType: 'json',
							data: {
								"id": herkunft_node_id,
								"Feld": "TPopId",
								"Wert": neue_tpop_id,
								"user": sessionStorage.User
							},
							success: function () {
								//typ des nodes anpassen
								herkunft_node.attr("typ", "beob_zugeordnet");
								localStorage.beobtyp = "beob_zugeordnet";
								//Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
								beschrifte_ap_ordner_beob_nicht_beurteilt(window.herkunft_parent_node);
								if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
									beschrifte_tpop_ordner_beob_zugeordnet(ziel_node);
								} else {
									beschrifte_tpop_ordner_beob_zugeordnet(ziel_parent_node);
								}
								//selection steuern
								if (!localStorage.karte_fokussieren) {
									initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
								} else {
									delete localStorage.karte_fokussieren;
								}
								//Variablen aufräumen
								delete window.beob_node_ausgeschnitten;
								delete window.herkunft_parent_node;
							},
							error: function (data) {
								$("#Meldung").html("Fehler: Die Beobachtung wurde nicht verschoben");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						});
					}
				});
			}
			if (ziel_node_typ === "beob_nicht_zuzuordnen" || ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
				//nicht beurteilt > nicht zuordnen
				$.ajax({
					url: 'php/beob_zuordnung_insert.php',
					dataType: 'json',
					data: {
						"no_note": herkunft_node_id,
						"user": sessionStorage.User
					},
					success: function() {
						//jetzt aktualisieren
						$.ajax({
							url: 'php/beob_update.php',
							dataType: 'json',
							data: {
								"id": herkunft_node_id,
								"Feld": "BeobNichtZuordnen",
								"Wert": 1,
								"user": sessionStorage.User
							},
							success: function() {
								//typ des nodes anpassen
								$(herkunft_node).attr("typ", "beob_nicht_zuzuordnen");
								localStorage.beobtyp = "beob_nicht_zuzuordnen";
								//Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
								beschrifte_ap_ordner_beob_nicht_beurteilt(window.herkunft_parent_node);
								if (ziel_node_typ === "ap_ordner_beob_nicht_zuzuordnen") {
									beschrifte_ap_ordner_beob_nicht_zuzuordnen(ziel_node);
								} else {
									beschrifte_ap_ordner_beob_nicht_zuzuordnen(ziel_parent_node);
								}
								//Beob initiieren
								initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_zuzuordnen");
								//Variablen aufräumen
								delete window.beob_node_ausgeschnitten;
								delete window.herkunft_parent_node;
							},
							error: function() {
								console.log("fehler beim Leeren von TPopId");
							}
						});
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Beobachtung wurde nicht verschoben");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
		}
		if (herkunft_node_typ === "beob_nicht_zuzuordnen") {
			//nicht zuzuordnen
			if (ziel_node_typ === "beob_nicht_beurteilt" || ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
				//nicht zuzuordnen > nicht beurteilt
				$.ajax({
					url: 'php/beob_zuordnung_delete.php',
					dataType: 'json',
					data: {
						"id": herkunft_node_id
					},
					success: function() {
						//typ des nodes anpassen
						$(herkunft_node).attr("typ", "beob_nicht_beurteilt");
						localStorage.beobtyp = "beob_nicht_beurteilt";
						//Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
						beschrifte_ap_ordner_beob_nicht_zuzuordnen(window.herkunft_parent_node);
						if (ziel_node_typ === "ap_ordner_beob_nicht_beurteilt") {
							beschrifte_ap_ordner_beob_nicht_beurteilt(ziel_node);
						} else {
							beschrifte_ap_ordner_beob_nicht_beurteilt(ziel_parent_node);
						}
						//selektieren
						initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "nicht_beurteilt");
						//Variablen aufräumen
						delete window.beob_node_ausgeschnitten;
						delete window.herkunft_parent_node;
					},
					error: function (data) {
						$("#Meldung").html("Fehler: Die Zuordnung der Beobachtung wurde nicht entfernt");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			}
			if (ziel_node_typ === "beob_zugeordnet" || ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
				//nicht zuzuordnen > zugeordnet
				var neue_tpop_id;
				if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
					neue_tpop_id = ziel_node_id;
				} else {
					neue_tpop_id = ziel_parent_node_id;
				}
				$.ajax({
					url: 'php/beob_update.php',
						dataType: 'json',
						data: {
							"id": herkunft_node_id,
							"Feld": "BeobNichtZuordnen",
							"Wert": "",
							"user": sessionStorage.User
					},
					success: function() {
						$.ajax({
							url: 'php/beob_update.php',
							dataType: 'json',
							data: {
								"id": herkunft_node_id,
								"Feld": "TPopId",
								"Wert": neue_tpop_id,
								"user": sessionStorage.User
							},
							success: function () {
								//typ des nodes anpassen
								$(herkunft_node).attr("typ", "beob_zugeordnet");
								localStorage.beobtyp = "beob_zugeordnet";
								//Parent Node-Beschriftung am Herkunft- und Zielort: Anzahl anpassen
								beschrifte_ap_ordner_beob_nicht_zuzuordnen(window.herkunft_parent_node);
								if (ziel_node_typ === "tpop_ordner_beob_zugeordnet") {
									beschrifte_tpop_ordner_beob_zugeordnet(ziel_node);
								} else {
									beschrifte_tpop_ordner_beob_zugeordnet(ziel_parent_node);
								}
								//selection steuern
								initiiere_beob(herkunft_node.attr("beobtyp"), herkunft_node_id, "zugeordnet");
								//Variablen aufräumen
								delete window.beob_node_ausgeschnitten;
								delete window.herkunft_parent_node;
							},
							error: function (data) {
								$("#Meldung").html("Fehler: Die Beobachtung wurde nicht verschoben");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						});
					}
				});
			}
		}
	})
	return jstree_erstellt.promise();
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_pop(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Populationen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_apziel(node) {
	var anz, anzTxt;
	anz = 0;
	$(jQuery.jstree._reference(node)._get_children(node)).each(function(index) {
		$($(this).find("> ul > li")).each(function(index) {
			anz += 1;
		});
	});
	anzTxt = "AP-Ziele (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_apzieljahr(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = jQuery.jstree._reference(node).get_text(node).slice(0, 6);
	anzTxt += anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_zielber_ordner(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Ziel-Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_erfkrit(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "AP-Erfolgskriterien (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_jber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "AP-Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_ber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_assozarten(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "assoziierte Arten (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Populationen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop_ordner_tpop(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Teilpopulationen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop_ordner_popber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Populations-Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop_ordner_massnber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Massnahmen-Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_massn(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Massnahmen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_massnber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Massnahmen-Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_tpopber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Teilpopulations-Berichte (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_feldkontr(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Feldkontrollen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_freiwkontr(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Freiwilligen-Kontrollen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_beob_zugeordnet(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "Beobachtungen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_beob_nicht_beurteilt(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "nicht beurteilte Beobachtungen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_beob_nicht_zuzuordnen(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = "nicht zuzuordnende Beobachtungen (" + anz + ")";
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

function treeKontextmenu(node) {
	var items, aktiver_node, parent_node, grandparent_node, neue_apziele_node;
	//relevante nodes zwischenspeichern
	//aktiver_node = node;	 das hat auch funktioniert
	aktiver_node = jQuery("#tree").jstree('get_selected');
	aktiver_nodeText = jQuery.jstree._reference(aktiver_node).get_text(aktiver_node);
	//parent nur ermitteln, wenn parents exisiteren - sonst gibt es einen Fehler
	if ($(aktiver_node).attr("typ").slice(0, 9) !== "ap_ordner" && $(aktiver_node).attr("typ") !== "umwfakt") {
		parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
		parent_nodeText = jQuery.jstree._reference(parent_node).get_text(parent_node);
	}
	switch($(aktiver_node).attr("typ")) {
	case "ap_ordner_pop":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function () {
					jQuery.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neue Population",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "pop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.pop_id = data;
							delete window.pop;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Population",
								"attr": {
									"id": data,
									"typ": "pop"
								}
							});
							//jetzt alle Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Teilpopulationen",
								"attr": {
									"id": data,
									"typ": "pop_ordner_tpop"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Populations-Berichte",
								"attr": {
									"id": data,
									"typ": "pop_ordner_popber"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Massnahmen-Berichte",
								"attr": {
									"id": data,
									"typ": "pop_ordner_massnber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_pop(aktiver_node);
							//nodes selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular aufbauen
							initiiere_pop();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Population erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GeoAdminMaps": {
				"label": "auf CH-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_gelb.png",
				"action": function () {
					$.ajax({
						url: 'php/pops_ch_karte.php',
						dataType: 'json',
						data: {
							"ApArtId": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigePopAufGeoAdmin(data);
							} else {
								$("#Meldung").html("Die Population hat keine Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/ap_karte.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Teilpopulation mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (window.pop_zum_verschieben_gemerkt) {
			items.einfuegen = {
				"label": "'" + window.pop_bezeichnung + "' einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					//db aktualisieren
					$.ajax({
						url: 'php/pop_update.php',
						dataType: 'json',
						data: {
							"id": window.pop_id,
							"Feld": "ApArtId",
							"Wert": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function () {
							//Baum neu aufbauen
							$.when(erstelle_tree(erstelleIdAusDomAttributId($(aktiver_node).attr("id"))))
								.then(function() {
									//dann den eingefügten Node wählen
									$("#tree").jstree("select_node", "[typ='pop']#" + localStorage.pop_id); 
								});
							//einfügen soll nicht mehr angezeigt werden
							delete window.pop_zum_verschieben_gemerkt;
							//nicht mehr benötigte Variabeln entfernen
							delete window.pop_bezeichnung;
							delete window.pop_id;
						},
						error: function (data) {
							var Meldung;
							Meldung = JSON.stringify(data);
							$("#Meldung").html(data.responseText);
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		};
		return items;
	case "ap_ordner_apziel":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function () {
					jQuery.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//temporären Unterordner anlegen
					neue_apziele_node = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
						"data": "neue AP-Ziele",
						"attr": {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "apzieljahr"
						}
					});
					$.ajax({
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "apziel",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.apziel_id = data;
							delete window.apziel;
							NeuerNode = jQuery.jstree._reference(neue_apziele_node).create_node(neue_apziele_node, "last", {
								"data": "neues Ziel",
								"attr": {
									"id": data,
									"typ": "apziel"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_apziel(aktiver_node);
							//node selektieren
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//jetzt Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "0 Ziel-Berichte",
								"attr": {
									"id": data,
									"typ": "zielber_ordner"
								}
							});
							initiiere_apziel();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neues AP-Ziel erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "apzieljahr":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function () {
					jQuery.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax( {
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "apziel",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.apziel_id = data;
							delete window.apziel;
							delete localStorage.apziel;

							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neues Ziel",
								"attr": {
									"id": data,
									"typ": "apziel"
								}
							});

							//Parent Node-Beschriftung: Anzahl anpassen, wenns nicht der neue Ordner ist
							if (jQuery.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
								beschrifte_ap_ordner_apziel(parent_node);
							}
							//aktiver Node-Beschriftung: Anzahl anpassen
							beschrifte_apzieljahr(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							
							//jetzt Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "0 Ziel-Berichte",
								"attr": {
									"id": data,
									"typ": "zielber_ordner"
								}
							});
							
							//im create_node-Event von jstree wird Jahr eingefügt und gespeichert
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neues Ziel erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "apziel":
		items = {
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					grandparent_node = jQuery.jstree._reference(parent_node)._get_parent(parent_node);
					$.ajax( {
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(grandparent_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.apziel_id = data;
							delete window.apziel;
							delete localStorage.apziel;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neues Ziel",
								"attr": {
									"id": data,
									"typ": "apziel"
								}
							});
							//grandparent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_apziel(grandparent_node);
							//parent Node-Beschriftung: Anzahl anpassen
							//nur, wenn es nicht der Ordner ist, der "neue AP-Ziele" heisst
							if (jQuery.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
								beschrifte_apzieljahr(parent_node);
							}
							//node selecten
							jQuery.jstree._reference(parent_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//jetzt Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "0 Ziel-Berichte",
								"attr": {
									"id": data,
									"typ": "zielber_ordner"
								}
							});
							initiiere_apziel();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Kein neues AP-Ziel erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Das Ziel \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" und alle darunter befindlichen Knoten werden unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/apziel_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.apziel_id;
										delete window.apziel;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//grandparent Node-Beschriftung: Anzahl anpassen
										grandparent_node = jQuery.jstree._reference(parent_node)._get_parent(parent_node);
										beschrifte_ap_ordner_apziel(grandparent_node);
										//parent Node-Beschriftung: Anzahl anpassen
										if (jQuery.jstree._reference(parent_node).get_text(parent_node) !== "neue AP-Ziele") {
											beschrifte_apzieljahr(parent_node);
										}
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Das AP-Ziel wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "zielber_ordner":
		items = {
			"neu": {
				"label": "neuer Ziel-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/zielber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.zielber_id = data;
							delete window.zielber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer Ziel-Bericht",
								"attr": {
									"id": data,
									"typ": "zielber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_zielber_ordner(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//formular initiieren
							initiiere_zielber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen Ziel-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "zielber":
		items = {
			"neu": {
				"label": "neuer Ziel-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/zielber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "zielber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.zielber_id = data;
							delete window.zielber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neuer Ziel-Bericht",
								"attr": {
									"id": data,
									"typ": "zielber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_zielber_ordner(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//formular initiieren
							initiiere_zielber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen Ziel-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Ziel-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/zielber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.zielber_id;
										delete window.zielber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_zielber_ordner(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der Ziel-Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_erfkrit":
		items = {
			"neu": {
				"label": "neues Erfolgskriterium",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/erfkrit_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.erfkrit_id = data;
							delete window.erfkrit;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neues Erfolgskriterium",
								"attr": {
									"id": data,
									"typ": "erfkrit"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_erfkrit(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_erfkrit();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Kein neues Erfolgskriterium erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "erfkrit":
		items = {
			"neu": {
				"label": "neues Erfolgskriterium",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/erfkrit_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "erfkrit",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.erfkrit_id = data;
							delete window.erfkrit;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neues Erfolgskriterium",
								"attr": {
									"id": data,
									"typ": "erfkrit"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_erfkrit(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_erfkrit();
						},
						error: function () {
							$("#Meldung").html("Fehler: Kein neues Erfolgskriterium erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Das Erfolgskriterium \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/erfkrit_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.erfkrit_id;
										delete window.erfkrit;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_ap_ordner_erfkrit(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Das Erfolgskriterium wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_jber":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function () {
					jQuery.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neuer AP-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/jber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.jber_id = data;
							delete window.jber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer AP-Bericht",
								"attr": {
									"id": data,
									"typ": "jber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_jber(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_jber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen AP-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "jber":
		items = {
			"neu": {
				"label": "neuer AP-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/jber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "jber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.jber_id = data;
							delete window.jber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "Neuer AP-Bericht",
								"attr": {
									"id": data,
									"typ": "jber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_jber(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_jber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen AP-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der AP-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								//Variable zum rückgängig machen erstellen
								window.deleted = window.jber;
								window.deleted.typ = "jber";
								$.ajax({
									url: 'php/jber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.jber_id;
										delete window.jber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_ap_ordner_jber(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("AP-Bericht '" + window.deleted.JBerJahr + "' wurde gelöscht. <a href='#' id='undelete'>Rückgängig machen?</a>");
										$("#undelete_div").show();
										$("#forms_titelzeile").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
											$("#forms_titelzeile").hide();
										}, 25000);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der AP-Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		//Wenn noch keine existiert, kann einen neue Übersicht zu allen Arten erstellt werden
		if (jQuery.jstree._reference(aktiver_node)._get_children(aktiver_node).length === 0) {
			items.neu_jber_uebersicht = {
				"label": "neue Übersicht zu allen Arten",
				"separator_before": true,
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/jber_uebersicht_insert.php',
						dataType: 'json',
						data: {
							"JbuJahr": jQuery.jstree._reference(aktiver_node).get_text(aktiver_node),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.jber_uebersicht_id = jQuery.jstree._reference(aktiver_node).get_text(aktiver_node);
							delete window.jber_uebersicht;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Übersicht zu allen Arten",
								"attr": {
									"id": jQuery.jstree._reference(aktiver_node).get_text(aktiver_node),
									"typ": "jber_uebersicht"
								}
							});
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_jber_uebersicht();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keine Übersicht zu allen Arten erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Übersicht zu allen Arten wird unwiederbringlich gelöscht");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/jber_uebersicht_delete.php',
									dataType: 'json',
									data: {
										"jahr": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.jber_uebersicht_id;
										delete window.jber_uebersicht;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_ber":
		items = {
			"neu": {
				"label": "neuer Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/ber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.ber_id = data;
							delete window.ber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer Bericht",
								"attr": {
									"id": data,
									"typ": "ber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_ber(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_ber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/ber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "ber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.ber_id = data;
							delete window.ber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "Neuer Bericht",
								"attr": {
									"id": data,
									"typ": "ber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_ber(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_ber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/ber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.ber_id;
										delete window.ber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_ap_ordner_ber(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_assozarten":
		items = {
			"neu": {
				"label": "neue assoziierte Art",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/assozarten_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.assozarten_id = data;
							delete window.assozarten;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue assoziierte Art",
								"attr": {
									"id": data,
									"typ": "assozarten"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_assozarten(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_assozarten();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: keine assoziierte Art erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "assozarten":
		items = {
			"neu": {
				"label": "neue assoziierte Art",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/assozarten_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "assozarten",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.assozarten_id = data;
							delete window.assozarten;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue assoziierte Art",
								"attr": {
									"id": data,
									"typ": "assozarten"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_assozarten(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_assozarten();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keine assoziierte Art erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die assoziierte Art \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/assozarten_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.assozarten_id;
										delete window.assozarten;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_ap_ordner_assozarten(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die assoziierte Art wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});			
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "pop":
		items = {
			"neu": {
				"label": "neue Population",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax( {
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "pop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.pop_id = data;
							delete window.pop;
							delete localStorage.pop;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue Population",
								"attr": {
									"id": data,
									"typ": "pop"
								}
							});
							//jetzt alle Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Teilpopulationen",
								"attr": {
									"id": data,
									"typ": "pop_ordner_tpop"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Populations-Berichte",
								"attr": {
									"id": data,
									"typ": "pop_ordner_popber"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Massnahmen-Berichte",
								"attr": {
									"id": data,
									"typ": "pop_ordner_massnber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_pop(parent_node);
							//node selecten
							jQuery.jstree._reference(parent_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_pop();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Population erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Population \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" und alle darunter befindlichen Knoten werden gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								//Variable zum rückgängig machen erstellen
								window.deleted = window.pop;
								window.deleted.typ = "pop";
								$.ajax({
									url: 'php/pop_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.pop_id;
										delete window.pop;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_ap_ordner_pop(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("Population '" + window.deleted.PopName + "' wurde gelöscht. <a href='#' id='undelete'>Rückgängig machen?</a>");
										$("#undelete_div").show();
										$("#forms_titelzeile").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
											$("#forms_titelzeile").hide();
										}, 25000);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die Population wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
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
				"action": function () {
					$.ajax({
						url: 'php/pop_ch_karte.php',
						dataType: 'json',
						data: {
							"pop_id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigePopAufGeoAdmin(data);
							} else {
								$("#Meldung").html("Die Population hat keine Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/pop_karte.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Teilpopulation mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.pop_zum_verschieben_gemerkt) {
			items.ausschneiden = {
				"label": "zum Verschieben merken",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//Jetzt die PopId merken - ihr muss danach eine andere ApArtId zugeteilt werden
					window.pop_id = erstelleIdAusDomAttributId($(aktiver_node).attr("id"));
					//merken, dass ein node ausgeschnitten wurde
					window.pop_zum_verschieben_gemerkt = true;
					//und wie er heisst (um es später im Kontextmenü anzuzeigen)
					window.pop_bezeichnung = $("#PopNr").val() + " " + $("#PopName").val();

				}
			}
		}
		if (window.pop_zum_verschieben_gemerkt) {
			items.einfuegen = {
				"label": "'" + window.pop_bezeichnung + "' einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var popid = window.pop_id;
					var apartid = erstelleIdAusDomAttributId($(parent_node).attr("id"));
					//db aktualisieren
					$.ajax({
						url: 'php/pop_update.php',
						dataType: 'json',
						data: {
							"id": popid,
							"Feld": "ApArtId",
							"Wert": apartid,
							"user": sessionStorage.User
						},
						success: function () {
							//Baum wieder aufbauen
							$.when(erstelle_tree(apartid))
								.then(function() {
									//dann den eingefügten Node wählen
									$("#tree").jstree("select_node", "[typ='pop']#" + popid); 
								});
							//einfügen soll nicht mehr angezeigt werden
							delete window.pop_zum_verschieben_gemerkt;
							//nicht mehr benötigte Variabeln entfernen
							delete window.pop_bezeichnung;
							delete window.pop_id;
						},
						error: function (data) {
							var Meldung;
							Meldung = JSON.stringify(data);
							$("#Meldung").html(data.responseText);
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		};
		return items;
	case "pop_ordner_tpop":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function () {
					jQuery.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neue Teilpopulation",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "tpop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpop_id = data;
							delete window.tpop;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Teilpopulation",
								"attr": {
									"id": data,
									"typ": "tpop"
								}
							});
							//jetzt alle Unterordner anlegen
							erstelleUnterordnerFuerTPop(NeuerNode);
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_pop_ordner_tpop(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpop();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Teilpopulation erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GeoAdminMaps": {
				"label": "auf CH-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon_gelb.png",
				"action": function () {
					$.ajax({
						url: 'php/tpops_karte.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopAufGeoAdmin(data);
							} else {
								$("#Meldung").html("Es gibt keine Teilpopulation mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/pop_karte.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Teilpopulation mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (window.tpop_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpop_node_ausgeschnitten).get_text(window.tpop_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(aktiver_node).move_node(window.tpop_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.tpop_node_kopiert) {
			var label = "";
			if (window.window.tpop_objekt_kopiert.TPopNr) {
				label += window.window.tpop_objekt_kopiert.TPopNr;
			} else {
				label += "(keine Nr.)";
			}
			label += ": ";
			if (window.window.tpop_objekt_kopiert.TPopFlurname) {
				label += window.window.tpop_objekt_kopiert.TPopFlurname;
			} else {
				label += "(kein Flurname)";
			}
			items.einfuegen = {
				//"label": jQuery.jstree._reference(window.tpop_node_kopiert).get_text(window.tpop_node_kopiert) + " einfügen",
				"label": label + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					tpop_kopiert_in_pop_ordner_tpop_einfuegen(aktiver_node);
				}
			}
		}
		return items;
	case "tpop":
		items = {
			"untergeordneteKnotenOeffnen": {
				"label": "untergeordnete Knoten öffnen",
				"icon": "style/images/tree16x16.png",
				"action": function () {
					jQuery.jstree._reference(node).open_all(node);
				}
			},
			"neu": {
				"label": "neue Teilpopulation",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpop_id = data;
							delete window.tpop;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue Teilpopulation",
								"attr": {
									"id": data,
									"typ": "tpop"
								}
							});
							//jetzt alle Unterordner anlegen
							erstelleUnterordnerFuerTPop(NeuerNode);
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_pop_ordner_tpop(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpop();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keine neue Teilpopulation erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Teilpopulation \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" und alle darunter befindlichen Knoten werden gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								//Variable zum rückgängig machen erstellen
								window.deleted = window.tpop;
								window.deleted.typ = "tpop";
								//löschen
								$.ajax({
									url: 'php/tpop_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.tpop_id;
										delete window.tpop;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_pop_ordner_tpop(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("Teilpopulation '" + window.deleted.TPopFlurname + "' wurde gelöscht. <a href='#' id='undelete'>Rückgängig machen?</a>");
										$("#undelete_div").show();
										$("#forms_titelzeile").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
											$("#forms_titelzeile").hide();
										}, 25000);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
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
				"action": function () {
					$.ajax({
						url: 'php/tpop_karte.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopAufGeoAdmin(data);
							} else {
								$("#Meldung").html("Die Teilpopulation hat keine Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"verortenGeoAdmin": {
				"label": "auf CH/ZH-Karten verorten",
				"separator_before": true,
				"icon": "style/images/flora_icon_rot.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpop.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							verorteTPopAufGeoAdmin(data);
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMaps": {
				"label": "auf Google-Karten zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/tpop_karte.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopAufKarte(data);
							} else {
								$("#Meldung").html("Die Teilpopulation hat keine Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},		
			"verorten": {
				"label": "auf Google-Karten verorten",
				"separator_before": true,
				"icon": "style/images/flora_icon_rot.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpop.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							verorteTPopAufKarte(data);
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function () {
					zeigeBeobKoordinatenImGisBrowser();
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (!window.tpop_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpop_node_ausgeschnitten = aktiver_node;
					//es macht keinen Sinn mehr, den kopierten node zu behalten
					//und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.tpop_node_kopiert;
					delete window.tpop_objekt_kopiert;
				}
			}
		}
		if (!window.tpop_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpop_node_kopiert = aktiver_node;
					//Daten des Objekts holen
					$.ajax({
						url: 'php/tpop.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(window.tpop_node_kopiert).attr("id"))
						},
						success: function (data) {
							window.tpop_objekt_kopiert = data;
						},
						error: function () {
							$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht kopiert");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		}
		if (window.tpop_node_kopiert) {
			var label = "";
			if (window.tpop_objekt_kopiert.TPopNr) {
				label += window.tpop_objekt_kopiert.TPopNr;
			} else {
				label += "(keine Nr.)";
			}
			label += ": ";
			if (window.tpop_objekt_kopiert.TPopFlurname) {
				label += window.tpop_objekt_kopiert.TPopFlurname;
			} else {
				label += "(kein Flurname)";
			}
			items.einfuegen = {
				"label": label + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					tpop_kopiert_in_pop_ordner_tpop_einfuegen(parent_node);
				}
			}
		}
		if (window.tpop_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpop_node_ausgeschnitten).get_text(window.tpop_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.tpop_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		};
		return items;
	case "pop_ordner_popber":
		items = {
			"neu": {
				"label": "neuer Populations-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/popber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.popber_id = data;
							delete window.popber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer Populations-Bericht",
								"attr": {
									"id": localStorage.popber_id,
									"typ": "popber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_pop_ordner_popber(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_popber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen Populations-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "popber":
		items = {
			"neu": {
				"label": "neuer Populations-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/popber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "popber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode
							localStorage.popber_id = data;
							delete window.popber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neuer Populations-Bericht",
								"attr": {
									"id": data,
									"typ": "popber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_pop_ordner_popber(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_popber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen Populations-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Der Populations-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/popber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.popber_id;
										delete window.popber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_pop_ordner_popber(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der Populations-Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "pop_ordner_massnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/popmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.popmassnber_id = data;
							delete window.popmassnber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer Massnahmen-Bericht",
								"attr": {
									"id": localStorage.popmassnber_id,
									"typ": "popmassnber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_pop_ordner_massnber(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_popmassnber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "popmassnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/popmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "popmassnber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.popmassnber_id = data;
							delete window.popmassnber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neuer Massnahmen-Bericht",
								"attr": {
									"id": data,
									"typ": "popmassnber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_pop_ordner_massnber(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_popmassnber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/popmassnber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.popmassnber_id;
										delete window.popmassnber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_pop_ordner_massnber(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "tpop_ordner_feldkontr":
		items = {
			"neu": {
				"label": "neue Feldkontrolle",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Feldkontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_feldkontr(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Feldkontrolle erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (window.tpopfeldkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_ausgeschnitten).get_text(window.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(aktiver_node).move_node(window.tpopfeldkontr_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.tpopfeldkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_kopiert).get_text(window.tpopfeldkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//User und neue TPopId mitgeben
					dataUrl = "?user=" + sessionStorage.User + "&TPopId=" + erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + "&TPopKontrId=" + erstelleIdAusDomAttributId($(window.tpopfeldkontr_node_kopiert).attr("id"));
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopfeldkontr_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": erstelleLabelFuerFeldkontrolle(window.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.tpopfeldkontr_objekt_kopiert.TPopKontrTyp),
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_feldkontr(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Die Feldkontrolle wurde nicht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue Feldkontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_feldkontr(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Feldkontrolle erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "Feldkontrolle löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Die Feldkontrolle \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								//Variable zum rückgängig machen erstellen
								window.deleted = window.tpopfeldkontr;
								window.deleted.typ = "tpopfeldkontr";
								$.ajax({
									url: 'php/tpopfeldkontr_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.tpopfeldkontr_id;
										delete window.tpopfeldkontr;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_tpop_ordner_feldkontr(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("Feldkontrolle '" + window.deleted.TPopKontrJahr + ": " + window.deleted.TPopKontrTyp + "' wurde gelöscht. <a href='#' id='undelete'>Rückgängig machen?</a>");
										$("#undelete_div").show();
										$("#forms_titelzeile").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
											$("#forms_titelzeile").hide();
										}, 25000);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die Feldkontrolle wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			},
			"biotop_kopieren": {
				"label": "Biotop kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					delete window.feldkontr_biotop;
					window.feldkontr_biotop = {};
					if ($("#TPopKontrFlaeche").val()) {
						window.feldkontr_biotop.TPopKontrFlaeche = $("#TPopKontrFlaeche").val();
					}
					if ($("#TPopKontrLeb").val()) {
						window.feldkontr_biotop.TPopKontrLeb = $("#TPopKontrLeb").val();
					}
					if ($("#TPopKontrLebUmg").val()) {
						window.feldkontr_biotop.TPopKontrLebUmg = $("#TPopKontrLebUmg").val();
					}
					if ($("#TPopKontrVegTyp").val()) {
						window.feldkontr_biotop.TPopKontrVegTyp = $("#TPopKontrVegTyp").val();
					}
					if ($("#TPopKontrKonkurrenz").val()) {
						window.feldkontr_biotop.TPopKontrKonkurrenz = $("#TPopKontrKonkurrenz").val();
					}
					if ($("#TPopKontrMoosschicht").val()) {
						window.feldkontr_biotop.TPopKontrMoosschicht = $("#TPopKontrMoosschicht").val();
					}
					if ($("#TPopKontrKrautschicht").val()) {
						window.feldkontr_biotop.TPopKontrKrautschicht = $("#TPopKontrKrautschicht").val();
					}
					if ($("#TPopKontrStrauchschicht").val()) {
						window.feldkontr_biotop.TPopKontrStrauchschicht = $("#TPopKontrStrauchschicht").val();
					}
					if ($("#TPopKontrBaumschicht").val()) {
						window.feldkontr_biotop.TPopKontrBaumschicht = $("#TPopKontrBaumschicht").val();
					}
					if ($("#TPopKontrBodenTyp").val()) {
						window.feldkontr_biotop.TPopKontrBodenTyp = $("#TPopKontrBodenTyp").val();
					}
					if ($("#TPopKontrBodenKalkgehalt").val()) {
						window.feldkontr_biotop.TPopKontrBodenKalkgehalt = $("#TPopKontrBodenKalkgehalt").val();
					}
					if ($("#TPopKontrBodenDurchlaessigkeit").val()) {
						window.feldkontr_biotop.TPopKontrBodenDurchlaessigkeit = $("#TPopKontrBodenDurchlaessigkeit").val();
					}
					if ($("#TPopKontrBodenHumus").val()) {
						window.feldkontr_biotop.TPopKontrBodenHumus = $("#TPopKontrBodenHumus").val();
					}
					if ($("#TPopKontrBodenNaehrstoffgehalt").val()) {
						window.feldkontr_biotop.TPopKontrBodenNaehrstoffgehalt = $("#TPopKontrBodenNaehrstoffgehalt").val();
					}
					if ($("#TPopKontrBodenAbtrag").val()) {
						window.feldkontr_biotop.TPopKontrBodenAbtrag = $("#TPopKontrBodenAbtrag").val();
					}
					if ($("#TPopKontrWasserhaushalt").val()) {
						window.feldkontr_biotop.TPopKontrWasserhaushalt = $("#TPopKontrWasserhaushalt").val();
					}
					if ($("#TPopKontrHandlungsbedarf").val()) {
						window.feldkontr_biotop.TPopKontrHandlungsbedarf = $("#TPopKontrHandlungsbedarf").val();
					}
				}
			}
		};
		if (window.feldkontr_biotop) {
			items.biotop_einfuegen = {
				"label": "Biotop einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var url_string = "?id=" + erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + "&user=" + sessionStorage.User;
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					for (i in window.feldkontr_biotop) {
					//for (var i = 0; i < window.feldkontr_biotop.length; i++) {
						$("#" + i).val(window.feldkontr_biotop[i]);
						url_string += "&" + i + "=" + window.feldkontr_biotop[i];
					}
					//jetzt alles speichern
					$.ajax({
						url: 'php/tpopfeldkontr_update_multiple.php' + url_string,
						dataType: 'json',
						success: function () {
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Das kopierte Biotop wurde nicht in der Datenbank gespeichert");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		}
		if (!window.tpopfeldkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "Feldkontrolle ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpopfeldkontr_node_ausgeschnitten = aktiver_node;
					//es macht keinen Sinn mehr, den kopierten node zu behalten
					//und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.tpopfeldkontr_node_kopiert;
					delete window.tpopfeldkontr_objekt_kopiert;
				}
			}
		}
		if (!window.tpopfeldkontr_node_ausgeschnitten) {
			items.kopieren = {
				"label": "Feldkontrolle kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpopfeldkontr_node_kopiert = aktiver_node;
					//Daten des Objekts holen
					$.ajax({
						url: 'php/tpopfeldkontr.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(window.tpopfeldkontr_node_kopiert).attr("id"))
						},
						success: function (data) {
							window.tpopfeldkontr_objekt_kopiert = data;
						},
						error: function () {
							$("#Meldung").html("Fehler: Die Feldkontrolle wurde nicht kopiert");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		}
		if (window.tpopfeldkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_ausgeschnitten).get_text(window.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.tpopfeldkontr_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		if (window.tpopfeldkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_kopiert).get_text(window.tpopfeldkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//User und neue TPopId mitgeben
					dataUrl = "?user=" + sessionStorage.User + "&TPopId=" + erstelleIdAusDomAttributId($(parent_node).attr("id")) + "&TPopKontrId=" + erstelleIdAusDomAttributId($(window.tpopfeldkontr_node_kopiert).attr("id"));
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopfeldkontr_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": erstelleLabelFuerFeldkontrolle(window.tpopfeldkontr_objekt_kopiert.TPopKontrJahr, window.tpopfeldkontr_objekt_kopiert.TPopKontrTyp),
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_feldkontr(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Die Feldkontrolle wurde nicht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User,
							"TPopKontrTyp": "Freiwilligen-Erfolgskontrolle"
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							localStorage.tpopfreiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Freiwilligen-Kontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_freiwkontr(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (window.tpopfreiwkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_ausgeschnitten).get_text(window.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(aktiver_node).move_node(window.tpopfreiwkontr_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.tpopfreiwkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_kopiert).get_text(window.tpopfreiwkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//User und neue TPopId mitgeben
					dataUrl = "?user=" + sessionStorage.User + "&TPopId=" + erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + "&TPopKontrId=" + erstelleIdAusDomAttributId($(window.tpopfreiwkontr_node_kopiert).attr("id"));
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopfeldkontr_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							localStorage.tpopfreiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": tpopfreiwkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_freiwkontr(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							localStorage.tpopfreiwkontr = true;
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"user": sessionStorage.User,
							"TPopKontrTyp": "Freiwilligen-Erfolgskontrolle"
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue Freiwilligen-Kontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_freiwkontr(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							localStorage.tpopfreiwkontr = "true";
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Freiwilligen-Kontrolle erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Die Freiwilligen-Kontrolle \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								//Variable zum rückgängig machen erstellen
								window.deleted = window.tpopfeldkontr;
								window.deleted.typ = "tpopfreiwkontr";
								$.ajax({
									url: 'php/tpopfeldkontr_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.tpopfeldkontr_id;
										delete localStorage.tpopfreiwkontr;
										delete window.tpopfeldkontr;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_tpop_ordner_freiwkontr(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("Freiwilligen-Kontrolle '" + window.deleted.TPopKontrJahr + "' wurde gelöscht. <a href='#' id='undelete'>Rückgängig machen?</a>");
										$("#undelete_div").show();
										$("#forms_titelzeile").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
											$("#forms_titelzeile").hide();
										}, 25000);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die Freiwilligen-Kontrolle wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.tpopfreiwkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpopfreiwkontr_node_ausgeschnitten = aktiver_node;
					//es macht keinen Sinn mehr, den kopierten node zu behalten
					//und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.tpopfreiwkontr_node_kopiert;
					delete window.tpopfreiwkontr_objekt_kopiert;
				}
			}
		}
		if (!window.tpopfreiwkontr_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpopfreiwkontr_node_kopiert = aktiver_node;
					//Daten des Objekts holen
					$.ajax({
						url: 'php/tpopfeldkontr.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(window.tpopfreiwkontr_node_kopiert).attr("id"))
						},
						success: function (data) {
							tpopfreiwkontr_objekt_kopiert = data;
						},
						error: function () {
							$("#Meldung").html("Fehler: Die Freiwilligen-Kontrolle wurde nicht kopiert");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		}
		if (window.tpopfreiwkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_ausgeschnitten).get_text(window.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.tpopfreiwkontr_node_ausgeschnitten, parent_node, "first", false);
					localStorage.tpopfreiwkontr = true;
				}
			}
		}
		if (window.tpopfreiwkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_kopiert).get_text(window.tpopfreiwkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					//User und neue TPopId mitgeben
					dataUrl = "?user=" + sessionStorage.User + "&TPopId=" + erstelleIdAusDomAttributId($(parent_node).attr("id")) + "&TPopKontrId=" + erstelleIdAusDomAttributId($(window.tpopfreiwkontr_node_kopiert).attr("id"));
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopfeldkontr_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": tpopfreiwkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_freiwkontr(parent_node);
							//node selectieren
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							localStorage.tpopfreiwkontr = true;
							initiiere_tpopfeldkontr();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Die Freiwilligen-Kontrolle wurde nicht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopmassn_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Massnahme",
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_massn(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopmassn();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Massnahme erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (window.tpopmassn_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_ausgeschnitten).get_text(window.tpopmassn_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(aktiver_node).move_node(window.tpopmassn_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.tpopmassn_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_kopiert).get_text(window.tpopmassn_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					var dataUrl;
					//User und neue TPopId mitgeben
					dataUrl = "?user=" + sessionStorage.User + "&TPopId=" + erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + "&TPopMassnId=" + erstelleIdAusDomAttributId($(window.tpopmassn_node_kopiert).attr("id"));
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopmassn_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": erstelleLabelFuerMassnahme(window.tpopmassn_objekt_kopiert.TPopMassnJahr, window.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt),
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});

							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_massn(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopmassn();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Die Massnahme wurde nicht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopmassn_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue Massnahme",
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_massn(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopmassn();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keine neue Massnahme erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Die Massnahme \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								//Variable zum rückgängig machen erstellen
								window.deleted = window.tpopmassn;
								window.deleted.typ = "tpopmassn";
								$.ajax({
									url: 'php/tpopmassn_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.tpopmassn_id;
										delete window.tpopmassn;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_tpop_ordner_massn(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("Massnahme '" + window.deleted.TPopMassnJahr + ": " + window.deleted.TPopMassnTyp + "' wurde gelöscht. <a href='#' id='undelete'>Wiederherstellen?</a>");
										$("#undelete_div").show();
										$("#forms_titelzeile").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
											$("#forms_titelzeile").hide();
										}, 25000);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Die Massnahme wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.tpopmassn_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpopmassn_node_ausgeschnitten = aktiver_node;
					//es macht keinen Sinn mehr, den kopierten node zu behalten
					//und stellt sicher, dass nun der ausgeschnittene mit "einfügen" angeboten wird
					delete window.tpopmassn_node_kopiert;
					delete window.tpopmassn_objekt_kopiert;
				}
			}
		}
		if (!window.tpopmassn_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.tpopmassn_node_kopiert = aktiver_node;
					//Daten des Objekts holen
					$.ajax({
						url: 'php/tpopmassn.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(window.tpopmassn_node_kopiert).attr("id"))
						},
						success: function (data) {
							window.tpopmassn_objekt_kopiert = data;
							//den Beurteilungstext holen - ist nur mühsam aus der DB zu holen
							window.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = "";
							if ($("#TPopMassnTyp option:checked").text()) {
								window.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt = $("#TPopMassnTyp option:checked").text();
							}
						},
						error: function () {
							$("#Meldung").html("Fehler: Die Massnahme wurde nicht kopiert");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		}
		if (window.tpopmassn_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_ausgeschnitten).get_text(window.tpopmassn_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.tpopmassn_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		if (window.tpopmassn_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_kopiert).get_text(window.tpopmassn_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					var dataUrl;
					//User und neue TPopId mitgeben
					dataUrl = "?user=" + sessionStorage.User + "&TPopId=" + erstelleIdAusDomAttributId($(parent_node).attr("id")) + "&TPopMassnId=" + erstelleIdAusDomAttributId($(window.tpopmassn_node_kopiert).attr("id"));
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopmassn_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": erstelleLabelFuerMassnahme(window.tpopmassn_objekt_kopiert.TPopMassnJahr, window.tpopmassn_objekt_kopiert.TPopMassnBerErfolgsbeurteilung_txt),
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_massn(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopmassn();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Die Massnahme wurde nicht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
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
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopber_id = data;
							delete window.tpopber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer Teilpopulations-Bericht",
								"attr": {
									"id": localStorage.tpopber_id,
									"typ": "tpopber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_tpopber(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "tpopber":
		items = {
			"neu": {
				"label": "neuer Teilpopulations-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopber_id = data;
							delete window.tpopber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neuer Teilpopulations-Bericht",
								"attr": {
									"id": data,
									"typ": "tpopber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_tpopber(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen Teilpopulations-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Der Teilpopulations-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/tpopber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.tpopber_id;
										delete window.tpopber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_tpop_ordner_tpopber(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der Teilpopulations-Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
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
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"tpop_id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopBeobAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Beobachtungen mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			}
		};
		if (window.beob_zugeordnet_node_ausgeschnitten) {
			items = {};
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.beob_zugeordnet_node_ausgeschnitten).get_text(window.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(aktiver_node).move_node(window.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first", false);
				}
			}
		}
		if (window.beob_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.beob_node_ausgeschnitten).get_text(window.beob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.beob_node_ausgeschnitten, aktiver_node, "first");
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
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeTPopBeobAufKarte(data);
							} else {
								$("#Meldung").html("Die Beobachtung hat keine Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMapsMitTPopTPopBeob": {
				"label": "auf Luftbild einer neuen<br>&nbsp;&nbsp;&nbsp;Teilpopulation zuordnen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (beob) {
							if (beob.rows.length > 0) {
								$.ajax({
									url: 'php/ap_karte.php',
									dataType: 'json',
									data: {
										"id": localStorage.ap_id
									},
									success: function (tpop) {
										if (tpop.rows.length > 0) {
											zeigeBeobUndTPopAufKarte(beob, tpop);
										} else {
											zeigeBeobAufKarte(beob);
										}
									}
								});
							} else {
								$("#Meldung").html("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function () {
					zeigeBeobKoordinatenImGisBrowser();
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.beob_zugeordnet_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.beob_zugeordnet_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen_beob_zugeordnet = {
				"label": jQuery.jstree._reference(window.beob_zugeordnet_node_ausgeschnitten).get_text(window.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.beob_zugeordnet_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		if (window.beob_node_ausgeschnitten) {
			items.einfuegen_beob = {
				"label": jQuery.jstree._reference(window.beob_node_ausgeschnitten).get_text(window.beob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.beob_node_ausgeschnitten, parent_node, "first", false);
				}
			}
		}
		return items;
	case "tpop_ordner_massnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassnber_id = data;
							delete window.tpopmassnber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer Massnahmen-Bericht",
								"attr": {
									"id": localStorage.tpopmassnber_id,
									"typ": "tpopmassnber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_massnber(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopmassnber();
						},
						error: function () {
							$("#Meldung").html("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "tpopmassnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$.ajax({
						url: 'php/tpopmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": erstelleIdAusDomAttributId($(parent_node).attr("id")),
							"typ": "tpopmassnber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassnber_id = data;
							delete window.tpopmassnber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neuer Massnahmen-Bericht",
								"attr": {
									"id": data,
									"typ": "tpopmassnber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_tpop_ordner_massnber(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_tpopmassnber();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Keinen neuen Massnahmen-Bericht erstellt");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"loeschen": {
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					$("#loeschen_dialog_mitteilung").html("Der Massnahmen-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/tpopmassnber_delete.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function () {
										delete localStorage.tpopmassnber_id;
										delete window.tpopmassnber;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_tpop_ordner_massnber(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Der Massnahmen-Bericht wurde nicht gelöscht");
										$("#Meldung").dialog({
											modal: true,
											buttons: {
												Ok: function() {
													$(this).dialog("close");
												}
											}
										});
									}
								});
							},
							"abbrechen": function() {
								$(this).dialog("close");
							}
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
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
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"apart_id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeBeobAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Beobachtung mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMapsMitTPop": {
				"label": "auf Luftbild Teilpopulationen<br>&nbsp;&nbsp;&nbsp;zuordnen<br>&nbsp;&nbsp;&nbsp;Tipp: Beobachtungen auf<br>&nbsp;&nbsp;&nbsp;Teilpopulationen ziehen!",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"apart_id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (beob) {
							if (beob.rows.length > 0) {
								$.ajax({
									url: 'php/ap_karte.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
									},
									success: function (tpop) {
										if (tpop.rows.length > 0) {
											zeigeBeobUndTPopAufKarte(beob, tpop);
										} else {
											zeigeBeobAufKarte(beob);
										}
									}
								});
							} else {
								$("#Meldung").html("Es gibt keine Beobachtung mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (window.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.beob_zugeordnet_node_ausgeschnitten).get_text(window.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first");
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
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeBeobAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Beobachtung mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GoogleMapsMitTPopBeob": {
				"label": "auf Luftbild einer Teilpopulation<br>&nbsp;&nbsp;&nbsp;zuordnen",
				"separator_before": true,
				"icon": "style/images/flora_icon_violett.png",
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (beob) {
							if (beob.rows.length > 0) {
								$.ajax({
									url: 'php/ap_karte.php',
									dataType: 'json',
									data: {
										"id": erstelleIdAusDomAttributId($(parent_node).attr("id"))
									},
									success: function (tpop) {
										if (tpop.rows.length > 0) {
											zeigeBeobUndTPopAufKarte(beob, tpop);
										} else {
											zeigeBeobAufKarte(beob);
										}
									}
								});
							} else {
								$("#Meldung").html("Die Beobachtung hat keine Koordinaten<br>Bitte im Formular zuordnen");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function () {
					zeigeBeobKoordinatenImGisBrowser();
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (!window.beob_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.beob_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.beob_zugeordnet_node_ausgeschnitten).get_text(window.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.beob_zugeordnet_node_ausgeschnitten, parent_node, "first");
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
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"apart_id": erstelleIdAusDomAttributId($(aktiver_node).attr("id")),
							"nicht_zuzuordnen": "1"
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeBeobAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Beobachtung mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (window.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.beob_zugeordnet_node_ausgeschnitten).get_text(window.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.beob_zugeordnet_node_ausgeschnitten, aktiver_node, "first");
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
				"action": function () {
					$.ajax({
						url: 'php/beob_karte.php',
						dataType: 'json',
						data: {
							"beobid": erstelleIdAusDomAttributId($(aktiver_node).attr("id"))
						},
						success: function (data) {
							if (data.rows.length > 0) {
								zeigeBeobAufKarte(data);
							} else {
								$("#Meldung").html("Es gibt keine Beobachtung mit Koordinaten");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						},	
						error: function (data) {
							$("#Meldung").html("Fehler: Keine Daten erhalten");
							$("#Meldung").dialog({
								modal: true,
								buttons: {
									Ok: function() {
										$(this).dialog("close");
									}
								}
							});
						}
					});
				}
			},
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function () {
					zeigeBeobKoordinatenImGisBrowser();
				}
			},
			"Exporte": {
				"label": "exportieren",
				"separator_before": true,
				"icon": "style/images/download.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (!window.beob_node_ausgeschnitten) {
			items.ausschneiden = {
				//"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					//nur aktualisieren, wenn Schreibrechte bestehen
					if (sessionStorage.NurLesen) {
						$("#Meldung").html("Sie haben keine Schreibrechte");
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
						return;
					}
					window.beob_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.beob_zugeordnet_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.beob_zugeordnet_node_ausgeschnitten).get_text(window.beob_zugeordnet_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.beob_zugeordnet_node_ausgeschnitten, parent_node, "first");
				}
			}
		}
		return items;
	}
}

function tpop_kopiert_in_pop_ordner_tpop_einfuegen(aktiver_node) {
	var dataUrl;
	//nur aktualisieren, wenn Schreibrechte bestehen
	if (sessionStorage.NurLesen) {
		$("#Meldung").html("Sie haben keine Schreibrechte");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
		return;
	}

	//User und neue PopId mitgeben
	dataUrl = "?user=" + sessionStorage.User + "&PopId=" + erstelleIdAusDomAttributId($(aktiver_node).attr("id")) + "&TPopId=" + erstelleIdAusDomAttributId($(window.tpop_node_kopiert).attr("id"));
	//und an die DB schicken
	$.ajax({
		url: 'php/tpop_insert_kopie.php' + dataUrl,
		dataType: 'json',
		success: function (data) {
			var NeuerNode;
			var node_data = window.tpop_objekt_kopiert.TPopFlurname;
			if (window.tpop_objekt_kopiert.TPopNr) {
				node_data = window.tpop_objekt_kopiert.TPopNr + ': ' + window.tpop_objekt_kopiert.TPopFlurname
			}
			localStorage.tpop_id = data;
			delete window.tpop;
			NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
				"data": node_data,
				"attr": {
					"id": data,
					"typ": "tpop"
				}
			});
			//Node-Beschriftung: Anzahl anpassen
			beschrifte_pop_ordner_tpop(aktiver_node);
			//node selecten
			jQuery.jstree._reference(aktiver_node).deselect_all();
			jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
			//Hierarchisch tiefere Nodes aufbauen
			erstelleUnterordnerFuerTPop(NeuerNode);
			//Formular initiieren
			initiiere_tpop();
		},
		error: function (data) {
			$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht erstellt");
			$("#Meldung").dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog("close");
					}
				}
			});
		}
	});
}

function pop_kopiert_in_pop_einfuegen(aktiver_node, parent_node) {
	var dataUrl;
	//nur aktualisieren, wenn Schreibrechte bestehen
	if (sessionStorage.NurLesen) {
		$("#Meldung").html("Sie haben keine Schreibrechte");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
		return;
	}
	//drop kennt den parent nicht
	if (!parent_node) {
		parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
	}
	//User und neue ApArtId mitgeben
	dataUrl = "?MutWer=" + sessionStorage.User + "&ApArtId=" + erstelleIdAusDomAttributId($(parent_node).attr("id"));
	//die alten id's entfernen
	delete window.pop_objekt_kopiert.ApArtId;
	delete window.pop_objekt_kopiert.PopId;
	//das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.pop_objekt_kopiert.MutWann;
	delete window.pop_objekt_kopiert.MutWer;
	//alle verbliebenen Felder an die url hängen
	for (i in window.pop_objekt_kopiert) {
	//for (var i = 0; i < window.pop_objekt_kopiert.length; i++) {
		//Nullwerte ausschliessen
		if (window.pop_objekt_kopiert[i] !== null) {
			dataUrl += "&" + i + "=" + window.pop_objekt_kopiert[i];
		}
	}
	//und an die DB schicken
	$.ajax({
		url: 'php/pop_insert_kopie.php' + dataUrl,
		dataType: 'json',
		success: function (data) {
			var NeuerNode;
			localStorage.pop_id = data;
			delete window.pop;
			NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
				"data": window.pop_objekt_kopiert.PopNr + " " + window.pop_objekt_kopiert.PopName,
				"attr": {
					"id": data,
					"typ": "pop"
				}
			});
			//Parent Node-Beschriftung: Anzahl anpassen
			beschrifte_ap_ordner_pop(parent_node);
			//node selecten
			jQuery.jstree._reference(aktiver_node).deselect_all();
			jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
			//Formular initiieren
			initiiere_pop();
		},
		error: function (data) {
			$("#Meldung").html("Fehler: Die Population wurde nicht erstellt");
			$("#Meldung").dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog("close");
					}
				}
			});
		}
	});
}

function tpop_kopiert_in_tpop_einfuegen(aktiver_node, parent_node) {
	var dataUrl;
	//nur aktualisieren, wenn Schreibrechte bestehen
	if (sessionStorage.NurLesen) {
		$("#Meldung").html("Sie haben keine Schreibrechte");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
		return;
	}
	//drop kennt den parent nicht
	if (!parent_node) {
		parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
	}
	//User und neue PopId mitgeben
	dataUrl = "?MutWer=" + sessionStorage.User + "&PopId=" + erstelleIdAusDomAttributId($(parent_node).attr("id"));
	//die alten id's entfernen
	delete window.tpop_objekt_kopiert.PopId;
	delete window.tpop_objekt_kopiert.TPopId;
	//das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.tpop_objekt_kopiert.MutWann;
	delete window.tpop_objekt_kopiert.MutWer;
	//alle verbliebenen Felder an die url hängen
	for (i in window.tpop_objekt_kopiert) {
	//for (var i = 0; i < window.tpop_objekt_kopiert.length; i++) {
		//Nullwerte ausschliessen
		if (window.tpop_objekt_kopiert[i] !== null) {
			dataUrl += "&" + i + "=" + window.tpop_objekt_kopiert[i];
		}
	}
	//und an die DB schicken
	$.ajax({
		url: 'php/tpop_insert_kopie.php' + dataUrl,
		dataType: 'json',
		success: function (data) {
			var NeuerNode;
			localStorage.tpop_id = data;
			delete window.tpop;
			NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
				"data": window.tpop_objekt_kopiert.TPopNr + " " + window.tpop_objekt_kopiert.TPopFlurname,
				"attr": {
					"id": data,
					"typ": "tpop"
				}
			});
			//Parent Node-Beschriftung: Anzahl anpassen
			beschrifte_pop_ordner_tpop(parent_node);
			//node selecten
			jQuery.jstree._reference(aktiver_node).deselect_all();
			jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
			//Formular initiieren
			initiiere_tpop();
		},
		error: function (data) {
			$("#Meldung").html("Fehler: Die Teilpopulation wurde nicht erstellt");
			$("#Meldung").dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog("close");
					}
				}
			});
		}
	});
}

function pruefeLesevoraussetzungen() {
	//kontrollieren, ob der User offline ist
	if (!navigator.onLine) {
		console.log('offline');
		$("#offline_dialog").show();
		$("#offline_dialog").dialog({
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
}

function pruefeSchreibvoraussetzungen() {
	//kontrollieren, ob der User offline ist
	if (sessionStorage.NurLesen) {
		//nur speichern, wenn Schreibrechte bestehen
		$("#Meldung").html("Sie haben keine Schreibrechte");
		$("#Meldung").dialog({
			modal: true,
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
}

//wird von allen Formularen benutzt
//speichert den Wert eines Feldes in einem Formular
//übernimmt das Objekt, in dem geändert wurde
function speichern(that) {
	var Feldtyp, Formular, Feldname, Feldjson, Feldwert, Querystring, Objekt;
	if (pruefeSchreibvoraussetzungen()) {
		Formular = $(that).attr("formular");
		Feldname = that.name;
		Feldtyp = $(that).attr("type") || null;
		//Feldwert ermitteln
		if (Feldtyp && Feldtyp === "checkbox") {
			Feldwert = $('input:checkbox[name=' + Feldname + ']:checked').val();
		} else if (Feldtyp && Feldtyp === "radio") {
			Feldwert = $('input:radio[name=' + Feldname + ']:checked').val();
		} else {
			//textarea, input, select
			Feldwert = $("#" + Feldname).val();
		}
		//ja/nein Felder zu boolean umbauen
		if (Feldname === "PopHerkunftUnklar" || Feldname === "TPopHerkunftUnklar" || Feldname === "TPopMassnPlan" || Feldname === "TPopKontrPlan") {
			if (Feldwert) {
				Feldwert = 1;
			} else {
				Feldwert = "";
			}
		}
		if (Feldname === "BeobBemerkungen" && localStorage.beob_status === "nicht_beurteilt") {
			//hier soll nicht gespeichert werden
			$("#BeobBemerkungen").val("");
			$("#Meldung").html("Bemerkungen sind nur in zugeordneten oder nicht zuzuordnenden Beobachtungen möglich");
			$("#Meldung").dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog("close");
					}
				}
			});
			return;
		}
		$.ajax({
			url: 'php/' + Formular + '_update.php',
			dataType: 'json',
			data: {
				"id": localStorage[Formular + "_id"],
				"Feld": Feldname,
				"Wert": Feldwert,
				"user": sessionStorage.User
			},
			success: function () {
				//Variable für Objekt nachführen
				window[Formular][Feldname] = Feldwert;
				//Wenn in feldkontr Datum erfasst, auch Jahr speichern
				if (Feldname === "TPopKontrDatum" && Feldwert) {
					Objekt = {};
					Objekt.name = "TPopKontrJahr";
					Objekt.formular = "tpopfeldkontr";
					speichern(Objekt);
				}
				//dito bei tpopmassn
				if (Feldname === "TPopMassnDatum" && Feldwert) {
					Objekt = {};
					Objekt.name = "TPopMassnJahr";
					Objekt.formular = "tpopmassn";
					speichern(Objekt);
				}
				//wenn in TPopKontrZaehleinheit 1 bis 3 ein Leerwert eingeführt wurde
				//sollen auch die Felder TPopKontrMethode 1 bis 3 und TPopKontrAnz 1 bis 3 Leerwerte erhalten
				if (!Feldwert) {
					if (Feldname === "TPopKontrZaehleinheit1") {
						//UI aktualisieren
						if (window.tpopfeldkontr.TPopKontrMethode1) {
							$("#TPopKontrMethode1" + window.tpopfeldkontr.TPopKontrMethode1).prop("checked", false);
						}
						$("#TPopKontrAnz1").val("");
						//Datenbank aktualisieren
						//Feld TPopKontrMethode1
						Objekt = {};
						Objekt.name = "TPopKontrMethode1";
						Objekt.formular = Formular;
						speichern(Objekt);
						//Feld TPopKontrAnz1
						Objekt = {};
						Objekt.name = "TPopKontrAnz1";
						Objekt.formular = Formular;
						speichern(Objekt);
					}
					if (Feldname === "TPopKontrZaehleinheit2") {
						//UI aktualisieren
						if (window.tpopfeldkontr.TPopKontrMethode2) {
							$("#TPopKontrMethode2" + window.tpopfeldkontr.TPopKontrMethode2).prop("checked", false);
						}
						$("#TPopKontrAnz2").val("");
						//Datenbank aktualisieren
						//Feld TPopKontrMethode2
						Objekt = {};
						Objekt.name = "TPopKontrMethode2";
						Objekt.formular = Formular;
						speichern(Objekt);
						//Feld TPopKontrAnz2
						Objekt = {};
						Objekt.name = "TPopKontrAnz2";
						Objekt.formular = Formular;
						speichern(Objekt);
					}
					if (Feldname === "TPopKontrZaehleinheit3") {
						//UI aktualisieren
						if (window.tpopfeldkontr.TPopKontrMethode3) {
							$("#TPopKontrMethode3" + window.tpopfeldkontr.TPopKontrMethode3).prop("checked", false);
						}
						$("#TPopKontrAnz3").val("");
						//Datenbank aktualisieren
						//Feld TPopKontrMethode3
						Objekt = {};
						Objekt.name = "TPopKontrMethode3";
						Objekt.formular = Formular;
						speichern(Objekt);
						//Feld TPopKontrAnz3
						Objekt = {};
						Objekt.name = "TPopKontrAnz3";
						Objekt.formular = Formular;
						speichern(Objekt);
					}
				}
			},
			error: function (data) {
				var Meldung;
				Meldung = JSON.stringify(data);
				$("#Meldung").html(data.responseText);
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			}
		});
		//nodes im Tree updaten, wenn deren Bezeichnung ändert
		switch(Feldname) {
			case "PopNr":
			case "PopName":
				var popbeschriftung;
				if ($("#PopName").val() && $("#PopNr").val()) {
					popbeschriftung = $("#PopNr").val() + ": " + $("#PopName").val();
				} else if ($("#PopName").val()) {
					popbeschriftung = "(keine Nr): " + $("#PopName").val();
				} else if ($("#PopNr").val()) {
					popbeschriftung = $("#PopNr").val() + ": (kein Name)";
				} else {
					popbeschriftung = "(keine Nr, kein Name)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_pop'] #" + localStorage.pop_id, popbeschriftung);
				break;
			case "PopBerJahr":
			case "PopBerEntwicklung":
				var popberbeschriftung;
				if ($("#PopBerJahr").val() && $("#spanPopBerEntwicklung" + $('input[name="PopBerEntwicklung"]:checked').val()).text()) {
					popberbeschriftung = $("#PopBerJahr").val() + ": " + $("#spanPopBerEntwicklung" + $('input[name="PopBerEntwicklung"]:checked').val()).text();
				} else if ($("#PopBerJahr").val()) {
					popberbeschriftung = $("#PopBerJahr").val() + ": (kein Status)";
				} else if ($("#spanPopBerEntwicklung" + $('input[name="PopBerEntwicklung"]:checked').val()).text()) {
					popberbeschriftung = "(kein Jahr): " + $("#spanPopBerEntwicklung" + $('input[name="PopBerEntwicklung"]:checked').val()).text();
				} else {
					popberbeschriftung = "(kein Jahr): (kein Status)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_popber'] #" + localStorage.popber_id, popberbeschriftung);
				break;
			case "PopMassnBerJahr":
			case "PopMassnBerErfolgsbeurteilung":
				var popmassnberbeschriftung;
				if ($("#PopMassnBerJahr").val() && $("#spanPopMassnBerErfolgsbeurteilung" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').val()).text()) {
					popmassnberbeschriftung = $("#PopMassnBerJahr").val() + ": " + $("#spanPopMassnBerErfolgsbeurteilung" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').val()).text();
				} else if ($("#PopMassnBerJahr").val()) {
					popmassnberbeschriftung = $("#PopMassnBerJahr").val() + ": (nicht beurteilt)";
				} else if ($("#spanPopMassnBerErfolgsbeurteilung" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').val()).text()) {
					popmassnberbeschriftung = "(kein Jahr): " + $("#spanPopMassnBerErfolgsbeurteilung" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').val()).text();
				} else {
					popmassnberbeschriftung = "(kein Jahr): (nicht beurteilt)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_massnber'] #" + localStorage.popmassnber_id, popmassnberbeschriftung);
				break;
			case "TPopNr":
			case "TPopFlurname":
				var tpopbeschriftung;
				if ($("#TPopNr").val() && $("#TPopFlurname").val()) {
					tpopbeschriftung = $("#TPopNr").val() + ": " + $("#TPopFlurname").val();
				} else if ($("#TPopFlurname").val()) {
					tpopbeschriftung = "(keine Nr): " + $("#TPopFlurname").val();
				} else if ($("#TPopNr").val()) {
					tpopbeschriftung = $("#TPopNr").val() + ": (kein Flurname)";
				} else {
					tpopbeschriftung = "(keine Nr, kein Flurname)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_tpop'] #" + localStorage.tpop_id, tpopbeschriftung);
				break;
			case "TPopKontrTyp":
			case "TPopKontrJahr":
				//wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
				var tpopkontrjahr = "(kein Jahr)",
					tpopfeldkontr_label = erstelleLabelFuerFeldkontrolle($("#TPopKontrJahr").val(), $("#spanTPopKontrTyp" + $('input[name="TPopKontrTyp"]:checked').val()).text());
				if ($("#TPopKontrJahr").val()) {
					tpopkontrjahr = $("#TPopKontrJahr").val();
				}
				if (localStorage.tpopfreiwkontr) {
					jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_freiwkontr'] #" + localStorage.tpopfeldkontr_id, tpopkontrjahr);
				} else {
					jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_feldkontr'] #" + localStorage.tpopfeldkontr_id, tpopfeldkontr_label);
				}
				break;
			case "TPopBerJahr":
			case "TPopBerEntwicklung":
				//wenn kein Jahr/Entwicklung gewählt: "(kein Jahr/Entwicklung)"
				var tpopberjahr, tpopberentwicklung;
				if ($("#TPopBerJahr").val()) {
					tpopberjahr = $("#TPopBerJahr").val();
				} else {
					tpopberjahr = "(kein Jahr)";
				}
				if ($("#spanTPopBerEntwicklung" + $('input[name="TPopBerEntwicklung"]:checked').val()).text()) {
					tpopberentwicklung = $("#spanTPopBerEntwicklung" + $('input[name="TPopBerEntwicklung"]:checked').val()).text();
				} else {
					tpopberentwicklung = "(keine Beurteilung)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_tpopber'] #" + localStorage.tpopber_id, tpopberjahr + ": " + tpopberentwicklung);
				break;
			case "TPopMassnJahr":
			case "TPopMassnTyp":
				//wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
				var tpopmassnbezeichnung;
				if ($("#TPopMassnJahr").val() && $("#TPopMassnTyp option:checked").text()) {
					tpopmassnbezeichnung = $("#TPopMassnJahr").val() + ": " + $("#TPopMassnTyp option:checked").text();
				} else if ($("#TPopMassnJahr").val()) {
					tpopmassnbezeichnung = $("#TPopMassnJahr").val() + ": (kein Typ)";
				} else if ($("#TPopMassnTyp option:checked").text()) {
					tpopmassnbezeichnung = "(kein Jahr): " + $("#TPopMassnTyp option:checked").text();
				} else {
					tpopmassnbezeichnung = "(kein Jahr): (kein Typ)";
				}
				tpopmassnbezeichnung = erstelleLabelFuerMassnahme($("#TPopMassnJahr").val(), $("#TPopMassnTyp option:checked").text());
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_massn'] #" + localStorage.tpopmassn_id, tpopmassnbezeichnung);
				break;
			case "TPopMassnBerJahr":
			case "TPopMassnBerErfolgsbeurteilung":
				//wenn kein Jahr/Beurteilung: "(kein Jahr/Beurteilung)"
				var tpopmassberbeschriftung;
				if ($("#TPopMassnBerJahr").val() && $("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text()) {
					tpopmassberbeschriftung = $("#TPopMassnBerJahr").val() + ": " + $("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text();
				} else if ($("#TPopMassnBerJahr").val()) {
					tpopmassberbeschriftung = $("#TPopMassnBerJahr").val() + ": (keine Beurteilung)";
				} else if ($("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text()) {
					tpopmassberbeschriftung = "(kein Jahr): " + $("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text();
				} else {
					tpopmassberbeschriftung = "(kein Jahr): (keine Beurteilung)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_massnber'] #" + localStorage.tpopmassnber_id, tpopmassberbeschriftung);
				break;
			case "ZielBezeichnung":
				var zielbeschriftung;
				if (Feldwert) {
					zielbeschriftung = Feldwert;
				} else {
					zielbeschriftung = "(Ziel nicht beschrieben)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='apzieljahr'] #" + localStorage.apziel_id, zielbeschriftung);
				break;
			case "ZielBerJahr":
			case "ZielBerErreichung":
				var zielberbeschriftung;
				if ($("#ZielBerJahr").val() && $("#ZielBerErreichung").val()) {
					zielberbeschriftung = $("#ZielBerJahr").val() + ": " + $("#ZielBerErreichung").val();
				} else if ($("#ZielBerJahr").val()) {
					zielberbeschriftung = $("#ZielBerJahr").val() + ": (keine Beurteilung)";
				} else if ($("#ZielBerErreichung").val()) {
					zielberbeschriftung = "(kein Jahr): " + $("#ZielBerErreichung").val();
				} else {
					zielberbeschriftung = "(kein Jahr): (keine Beurteilung)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='zielber_ordner'] #" + localStorage.zielber_id, zielberbeschriftung);
				break;
			case "ErfkritErreichungsgrad":
			case "ErfkritTxt":
				var erfkritbeschriftung;
				if ($("#SpanErfkritErreichungsgrad" + $("input:radio[name='ErfkritErreichungsgrad']:checked").val()).text() && $("#ErfkritTxt").val()) {
					erfkritbeschriftung = $("#SpanErfkritErreichungsgrad" + $("input:radio[name='ErfkritErreichungsgrad']:checked").val()).text() + ": " + $("#ErfkritTxt").val();
				} else if ($("#SpanErfkritErreichungsgrad" + $("input:radio[name='ErfkritErreichungsgrad']:checked").val()).text()) {
					erfkritbeschriftung = $("#SpanErfkritErreichungsgrad" + $("input:radio[name='ErfkritErreichungsgrad']:checked").val()).text() + ": (kein Kriterium)";
				} else if ($("#ErfkritTxt").val()) {
					erfkritbeschriftung = "(keine Beurteilung): " + $("#ErfkritTxt").val();
				} else {
					erfkritbeschriftung = "(keine Beurteilung): (kein Kriterium)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_erfkrit'] #" + localStorage.erfkrit_id, erfkritbeschriftung);
				break;
			case "JBerJahr":
				var jberbeschriftung;
				if (Feldwert) {
					jberbeschriftung = Feldwert;
				} else {
					jberbeschriftung = "(kein Jahr)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_jber'] #" + localStorage.jber_id, jberbeschriftung);
				break;
			case "BerTitel":
			case "BerJahr":
				var berbeschriftung;
				if ($("#BerJahr").val() && $("#BerTitel").val()) {
					berbeschriftung = $("#BerJahr").val() + ": " + $("#BerTitel").val();
				} else if ($("#BerJahr").val()) {
					berbeschriftung = $("#BerJahr").val() + ": (kein Titel)";
				} else if ($("#BerTitel").val()) {
					berbeschriftung = "(kein Jahr): " + $("#BerTitel").val();
				} else {
					berbeschriftung = "(kein Jahr): (kein Titel)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_ber'] #" + localStorage.ber_id, berbeschriftung);
				break;
			case "AaSisfNr":
				var aabeschriftung;
				if (Feldwert) {
					aabeschriftung = $("#AaSisfNr option[value='" + Feldwert + "']").text();
				} else {
					aabeschriftung = "(kein Artname)";
				}
				jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_assozarten'] #" + localStorage.assozarten_id, aabeschriftung);
				break;
		}
	}
}

(function ($) {
	// friendly helper http://tinyurl.com/6aow6yn
	//Läuft durch alle Felder im Formular
	//Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
	//nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
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

//wandelt decimal degrees (vom GPS) in WGS84 um
function DdInWgs84BreiteGrad(Breite) {
	var BreiteGrad;
 	BreiteGrad = Math.floor(Breite);
	return BreiteGrad;
}

function DdInWgs84BreiteMin(Breite) {
	var BreiteGrad, BreiteMin;
 	BreiteGrad = Math.floor(Breite);
	BreiteMin = Math.floor((Breite-BreiteGrad)*60);
	return BreiteMin;
}

function DdInWgs84BreiteSec(Breite) {
	var BreiteGrad, BreiteMin, BreiteSec;
 	BreiteGrad = Math.floor(Breite);
	BreiteMin = Math.floor((Breite-BreiteGrad)*60);
	BreiteSec =  (Math.round((((Breite - BreiteGrad) - (BreiteMin/60)) * 60 * 60) * 100) / 100);
	return BreiteSec;
}

function DdInWgs84LaengeGrad(Laenge) {
	var LaengeGrad;
	LaengeGrad = Math.floor(Laenge);
	return LaengeGrad;
}

function DdInWgs84LaengeMin(Laenge) {
	var LaengeGrad, LaengeMin;
	LaengeGrad = Math.floor(Laenge);
	LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
	return LaengeMin;
}

function DdInWgs84LaengeSec(Laenge) {
	var LaengeGrad, LaengeMin, LaengeSec;
	LaengeGrad = Math.floor(Laenge);
	LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
	LaengeSec = (Math.round((((Laenge - LaengeGrad) - (LaengeMin/60)) * 60 * 60) * 100 ) / 100);
	return LaengeSec;
}

// Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
function Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
	var lat_aux, lng_aux;
	// Converts degrees dec to sex
	lat = BreiteSec + BreiteMin*60 + BreiteGrad*3600;
	lng = LaengeSec + LaengeMin*60 + LaengeGrad*3600;
  
	// Axiliary values (% Bern)
	lat_aux = (lat - 169028.66)/10000;
	lng_aux = (lng - 26782.5)/10000;

	x = 200147.07
	  + 308807.95 * lat_aux 
	  +   3745.25 * Math.pow(lng_aux,2)
	  +	 76.63 * Math.pow(lat_aux,2)
	  -	194.56 * Math.pow(lng_aux,2) * lat_aux
	  +	119.79 * Math.pow(lat_aux,3);
 
	return x;
}

//Wandelt WGS84 in CH-Landeskoordinaten um
function Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
	var lat_aux, lng_aux;
	// Converts degrees dec to sex
	lat = BreiteSec + BreiteMin*60 + BreiteGrad*3600;
	lng = LaengeSec + LaengeMin*60 + LaengeGrad*3600;

	// Axiliary values (% Bern)
	lat_aux = (lat - 169028.66)/10000;
	lng_aux = (lng - 26782.5)/10000;

	// Process Y
	y = 600072.37 
	   + 211455.93 * lng_aux 
	   -  10938.51 * lng_aux * lat_aux
	   -	  0.36 * lng_aux * Math.pow(lat_aux,2)
	   -	 44.54 * Math.pow(lng_aux,3);
	
	return y;
}

//wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
function DdInChX(Breite, Laenge) {
	var BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec, x;
	BreiteGrad = DdInWgs84BreiteGrad(Breite);
	BreiteMin = DdInWgs84BreiteMin(Breite);
	BreiteSec = DdInWgs84BreiteSec(Breite);
	LaengeGrad = DdInWgs84LaengeGrad(Laenge);
	LaengeMin = DdInWgs84LaengeMin(Laenge);
	LaengeSec = DdInWgs84LaengeSec(Laenge);
	x = Math.floor(Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return x;
}

function DdInChY(Breite, Laenge) {
	var BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec, y;
	BreiteGrad = DdInWgs84BreiteGrad(Breite);
	BreiteMin = DdInWgs84BreiteMin(Breite);
	BreiteSec = DdInWgs84BreiteSec(Breite);
	LaengeGrad = DdInWgs84LaengeGrad(Laenge);
	LaengeMin = DdInWgs84LaengeMin(Laenge);
	LaengeSec = DdInWgs84LaengeSec(Laenge);
	y = Math.floor(Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return y;
}

//von CH-Landeskoord zu DecDeg

// Convert CH y/x to WGS lat
function CHtoWGSlat(y, x) {
	// Converts militar to civil and to unit = 1000km
	var y_aux, x_aux;
	// Axiliary values (% Bern)
	y_aux = (y - 600000)/1000000;
	x_aux = (x - 200000)/1000000;

	// Process lat
	lat = 16.9023892
		 +  3.238272 * x_aux
		 -  0.270978 * Math.pow(y_aux,2)
		 -  0.002528 * Math.pow(x_aux,2)
		 -  0.0447   * Math.pow(y_aux,2) * x_aux
		 -  0.0140   * Math.pow(x_aux,3);
	
	// Unit 10000" to 1 " and converts seconds to degrees (dec)
	lat = lat * 100/36;
	return lat;
}

// Convert CH y/x to WGS long
function CHtoWGSlng(y, x) {
	// Converts militar to civil and to unit = 1000km
	var y_aux, x_aux;
	// Axiliary values (% Bern)
	y_aux = (y - 600000)/1000000;
	x_aux = (x - 200000)/1000000;

	// Process long
	lng = 2.6779094
		+ 4.728982 * y_aux
		+ 0.791484 * y_aux * x_aux
		+ 0.1306   * y_aux * Math.pow(x_aux,2)
		- 0.0436   * Math.pow(y_aux,3);
	
	// Unit 10000" to 1 " and converts seconds to degrees (dec)
	lng = lng * 100/36;
	return lng;
}

function zeigeTPopAufKarte(TPopListe) {
	window.TPopListe = TPopListe;
	var anzTPop, infowindow, TPop, tpop_beschriftung, lat, lng, latlng, options, map, bounds, markers, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, myFlurname;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("google_karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	infowindow = new google.maps.InfoWindow();
	//TPopListe bearbeiten:
	//Objekte löschen, die keine Koordinaten haben
	//Lat und Lng ergänzen
	for (var v = 0; v < TPopListe.rows.length; v++) {
		TPop = TPopListe.rows[v];
		if (!TPop.TPopXKoord || !TPop.TPopYKoord) {
			delete TPop;
		} else {
			TPop.Lat = CHtoWGSlat(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
			TPop.Lng = CHtoWGSlng(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
		}
	}
	//TPop zählen
	anzTPop = TPopListe.rows.length;
	//Karte mal auf Zürich zentrieren, falls in den TPopListe.rows keine Koordinaten kommen
	//auf die die Karte ausgerichtet werden kann
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
	window.map = map;
	bounds = new google.maps.LatLngBounds();
	//für alle TPop Marker erstellen
	markers = [];
	for (var u = 0; u < TPopListe.rows.length; u++) {
		TPop = TPopListe.rows[u];
		TPopId = TPop.TPopId;
		tpop_beschriftung = beschrifteTPopMitNrFuerKarte(TPop.PopNr, TPop.TPopNr);
		latlng2 = new google.maps.LatLng(TPop.Lat, TPop.Lng);
		if (anzTPop === 1) {
			//map.fitbounds setzt zu hohen zoom, wenn nur eine TPop Koordinaten hat > verhindern
			latlng = latlng2;
		} else {
			//Kartenausschnitt um diese Koordinate erweitern
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
		myFlurname = TPop.TPopFlurname || '(kein Flurname)';
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + TPop.Artname + '</h3>'+
			'<p>Population: ' + TPop.PopName + '</p>'+
			'<p>TPop: ' + myFlurname + '</p>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + TPop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		makeListener(map, marker, contentString);
	}
	mcOptions = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m8.png",
				width: 53
			}]
	};
	//globale Variable verwenden, damit ein Klick auf die Checkbox die Ebene einblenden kann
	window.google_karte_detailplaene = new google.maps.KmlLayer({
	    url: 'http://www.barbalex.ch/apflora/kml/rueteren.kmz',
	    preserveViewport: true
	});
	google_karte_detailplaene.setMap(null);
	markerCluster = new MarkerClusterer(map, markers, mcOptions);
	if (anzTPop === 1) {
		//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		//Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
	//diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.setContent(contentString);
			infowindow.open(map,marker);
		});
	}
}

function entferneTPopMarkerEbenen() {
	var layername = ["Teilpopulation", "Teilpopulationen", "Teilpopulationen Nummern", "Teilpopulationen Namen"];
	//nur möglich, wenn api und map existieren
	if (typeof window.api !== "undefined") {
		if (window.api.map !== "undefined") {
			for (i in layername) {
				if (window.api.map.getLayersByName(layername[i])) {
					var layers = window.api.map.getLayersByName(layername[i]);
					for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
						window.api.map.removeLayer(layers[layerIndex]);
					}
				}
			}

			/*while(window.api.map.popups.length) {
		         window.api.map.removePopup(window.api.map.popups[0]);
		    }*/

			//auch aus layertree entfernen
			$(".x-panel-body .x-tree-node .x-tree-node-anchor span").each(function() {
				if (layername.indexOf($(this).text()) !== -1) {
					$(this).parent().parent().remove();
				}
			})
		}
	}
}

function entfernePopMarkerEbenen() {
	var layername = ["Population", "Populationen", "Populationen Nummern", "Populationen Namen"];
	//nur möglich, wenn api und map existieren
	if (typeof window.api !== "undefined") {
		if (window.api.map !== "undefined") {
			for (i in layername) {
				if (window.api.map.getLayersByName(layername[i])) {
					var layers = window.api.map.getLayersByName(layername[i]);
					for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
						window.api.map.removeLayer(layers[layerIndex]);
					}
				}
			}

			//auch aus layertree entfernen
			$(".x-panel-body .x-tree-node .x-tree-node-anchor span").each(function() {
				if (layername.indexOf($(this).text()) !== -1) {
					$(this).parent().parent().remove();
				}
			})
		}
	}
}

function entferneUebergebeneMarkerEbeneAusLayertree(layername) {
	//nur möglich, wenn api und map existieren
	if (typeof window.api !== "undefined") {
		if (window.api.map !== "undefined") {
			$(".x-panel-body .x-tree-node .x-tree-node-anchor span").each(function() {
				if ($(this).text() === layername) {
					$(this).parent().parent().remove();
				}
			})
		}
	}
}

function verorteTPopAufGeoAdmin(TPop) {
	var bounds;
	$.when(zeigeFormular("GeoAdminKarte"))
		.then(function() {
			$("#mitPolygonWaehlen").button({ disabled: true });
		});

	//bound eröffnen
	bounds = new OpenLayers.Bounds();
	//bounds bestimmen
	if (TPop && TPop.TPopXKoord && TPop.TPopYKoord) {
		//bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
		x_max = parseInt(TPop.TPopXKoord) + 300;
		x_min = parseInt(TPop.TPopXKoord) - 300;
		y_max = parseInt(TPop.TPopYKoord) + 300;
		y_min = parseInt(TPop.TPopYKoord) - 300;
		bounds.extend(new OpenLayers.LonLat(x_max, y_max));
		bounds.extend(new OpenLayers.LonLat(x_min, y_min));
		//marker aufbauen
		erstelleTPopulationFuerGeoAdmin(TPop);
		//alle layeroptionen schliessen
		schliesseLayeroptionen();

	} else {
		//sonst Kanton ZH anzeigen
		//bounds.extend(new OpenLayers.LonLat(679000, 274000));
		//bounds.extend(new OpenLayers.LonLat(707000, 232000));
		bounds.extend(new OpenLayers.LonLat(689000, 264000));
		bounds.extend(new OpenLayers.LonLat(697000, 242000));
	}

	//jetzt einen Handler für den Klick aufbauen
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
			//letzten Klick-Handler deaktivieren, sonst wird für jede Verortung ein neuer event-handler aufgebaut
			if (window.LetzterKlickHandler) {
				window.LetzterKlickHandler.deactivate();
			}
			//Klick-Handler in Variable speichern, damit er beim nächsten Aufruf deaktiviert werden kann
			window.LetzterKlickHandler = this;
		},

		trigger: function(e) {
			var lonlat = window.api.map.getLonLatFromPixel(e.xy);
			//x und y merken
			TPop.TPopXKoord = lonlat.lon;
			TPop.TPopYKoord = lonlat.lat;
			//Datensatz updaten
			$.ajax({
				url: 'php/tpop_update.php',
				dataType: 'json',
				data: {
					"id": localStorage.tpop_id,
					"Feld": "TPopXKoord",
					"Wert": TPop.TPopXKoord,
					"user": sessionStorage.User
				},
				success: function () {
					$.ajax({
						url: 'php/tpop_update.php',
						dataType: 'json',
						data: {
							"id": localStorage.tpop_id,
							"Feld": "TPopYKoord",
							"Wert": TPop.TPopYKoord,
							"user": sessionStorage.User
						},
						success: function () {
							//markerebenen entfernen
							entferneTPopMarkerEbenen();
							//alten listener entfernen, neuer wird mit dem nächsten Befehl erstellt 
							window.api.map.removeControl(click);
							//markerebene neu aufbauen
							erstelleTPopulationFuerGeoAdmin(TPop);
						}
					});
				}
			});
		}

	});

	var click = new OpenLayers.Control.Click();
	window.api.map.addControl(click);
	click.activate();
	
	//Karte zum richtigen Ausschnitt zoomen
	window.api.map.zoomToExtent(bounds);
	schliesseLayeroptionen();
}

function zeigeTPopAufGeoAdmin(TPopListeMarkiert) {
	//falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
	if (window.LetzterKlickHandler) {
		window.LetzterKlickHandler.deactivate();
	}
	var overlay_pop_visible = false;
	if (typeof overlay_pop !== "undefined" && overlay_pop.visibility === true) {
		overlay_pop_visible = true;
	}
	var overlay_popbeschriftung_visible = false;
	if (typeof overlay_pop_beschriftungen !== "undefined" && overlay_pop_beschriftungen.visibility === true) {
		overlay_popbeschriftung_visible = true;
	}
	
	var markierte_tpop = waehleAusschnittFuerUebergebeneTPop(TPopListeMarkiert);

	//Grundkarte aufbauen
	$.when(zeigeFormular("GeoAdminKarte"))
		.then(function() {
			//Karte zum richtigen Ausschnitt zoomen
			//aber nur, wenn keine Auswahl aktiv
			if (window.auswahlPolygonLayer && window.auswahlPolygonLayer.features.length > 0) {
				//Auswahl aktiv, Zoomstufe belassen
			} else {
				window.api.map.updateSize();
				window.api.map.zoomToExtent(markierte_tpop.bounds);
			}
			//tpop und pop ergänzen
			//alle tpop holen
			var tpop_aufruf = $.ajax({
				url: 'php/tpop_karte_alle.php',
				dataType: 'json',
				data: {
					"ApArtId": window.ap.ApArtId
				}
			});

			tpop_aufruf.done(function (TPopListe) {
				$.when(
					//Layer für Symbole und Beschriftung erstellen
					erstelleTPopNrFuerGeoAdmin(TPopListe, markierte_tpop.tpopid_markiert, true),
					erstelleTPopNamenFuerGeoAdmin(TPopListe, markierte_tpop.tpopid_markiert, false),
					erstelleTPopSymboleFuerGeoAdmin(TPopListe, markierte_tpop.tpopid_markiert, true),
					//alle Pop holen
					zeigePopInTPopKarte(overlay_pop_visible, overlay_popbeschriftung_visible)
				)
				.then(function() {
					//alle layeroptionen schliessen
					schliesseLayeroptionen();
				});
			});

			tpop_aufruf.fail(function() {
				$("#Meldung").html("Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden");
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			});
	});
}

function zeigePopAufGeoAdmin(PopListeMarkiert) {
	//falls noch aus dem Verorten ein Klick-Handler besteht: deaktivieren
	if (window.LetzterKlickHandler) {
		window.LetzterKlickHandler.deactivate();
	}
	
	var markierte_pop = waehleAusschnittFuerUebergebenePop(PopListeMarkiert);

	//Grundkarte aufbauen
	$.when(zeigeFormular("GeoAdminKarte"))
		.then(function() {
			//Karte zum richtigen Ausschnitt zoomen
			//aber nur, wenn keine Auswahl aktiv
			if (window.auswahlPolygonLayer && window.auswahlPolygonLayer.features.length > 0) {
				//Auswahl aktiv, Zoomstufe belassen
			} else {
				window.api.map.updateSize();
				window.api.map.zoomToExtent(markierte_pop.bounds);
			}
			//tpop und pop ergänzen
			//alle tpop holen
			var tpop_aufruf = $.ajax({
				url: 'php/tpop_karte_alle.php',
				dataType: 'json',
				data: {
					"ApArtId": window.ap.ApArtId
				}
			});

			tpop_aufruf.done(function (TPopListe) {
				$.when(
					//Layer für Symbole und Beschriftung erstellen
					erstelleTPopNrFuerGeoAdmin(TPopListe, null, false),
					erstelleTPopNamenFuerGeoAdmin(TPopListe, null, false),
					erstelleTPopSymboleFuerGeoAdmin(TPopListe, null, false),
					//alle Pop holen, symbole und nr sichtbar schalten, Markierung übergeben
					zeigePopInTPopKarte(true, true, markierte_pop.popid_markiert)
				)
				.then(function() {
					//alle layeroptionen schliessen
					schliesseLayeroptionen();
				});
			});

			tpop_aufruf.fail(function() {
				$("#Meldung").html("Fehler: Es konnten keine Daten aus der Datenbank abgerufen werden");
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			});
	});
}

//übernimmt eine Liste von (markierten) TPop
//retourniert den Ausschnitt = bounds der angezeigt werden soll
//und einen array mit den tpop_id's der liste
function waehleAusschnittFuerUebergebeneTPop(TPopListeMarkiert) {
	var TPop, bounds, x_max, y_max, x_min, y_min;
	//bound eröffnen
	bounds = new OpenLayers.Bounds();

	//jetzt bounds der anzuzeigenden bestimmen
	var tpopid_markiert = [];
	if (TPopListeMarkiert.rows.length > 0) {
		for (b in TPopListeMarkiert.rows) {
			if (TPopListeMarkiert.rows.hasOwnProperty(b)) {
				TPop = TPopListeMarkiert.rows[b];
				tpopid_markiert.push(TPop.TPopId);
				//bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
				x_max = parseInt(TPop.TPopXKoord) + 300;
				x_min = parseInt(TPop.TPopXKoord) - 300;
				y_max = parseInt(TPop.TPopYKoord) + 300;
				y_min = parseInt(TPop.TPopYKoord) - 300;
				bounds.extend(new OpenLayers.LonLat(x_max, y_max));
				bounds.extend(new OpenLayers.LonLat(x_min, y_min));
			}
		}
	} else {
		//keine tpop übergeben, Kanton anzeigen
		bounds.extend(new OpenLayers.LonLat(717000, 284000));
		bounds.extend(new OpenLayers.LonLat(669000, 222000));
	}
	return {bounds: bounds, tpopid_markiert: tpopid_markiert};
}

//übernimmt eine Liste von (markierten) Pop
//retourniert den Ausschnitt = bounds der angezeigt werden soll
//und einen array mit den tpop_id's der liste
function waehleAusschnittFuerUebergebenePop(PopListeMarkiert) {
	var Pop, bounds, x_max, y_max, x_min, y_min;
	//bound eröffnen
	bounds = new OpenLayers.Bounds();

	//jetzt bounds der anzuzeigenden bestimmen
	var popid_markiert = [];
	if (PopListeMarkiert.rows.length > 0) {
		for (b in PopListeMarkiert.rows) {
			if (PopListeMarkiert.rows.hasOwnProperty(b)) {
				Pop = PopListeMarkiert.rows[b];
				popid_markiert.push(Pop.PopId);
				//bounds vernünftig erweitern, damit Punkt nicht in eine Ecke zu liegen kommt
				x_max = parseInt(Pop.PopXKoord) + 300;
				x_min = parseInt(Pop.PopXKoord) - 300;
				y_max = parseInt(Pop.PopYKoord) + 300;
				y_min = parseInt(Pop.PopYKoord) - 300;
				bounds.extend(new OpenLayers.LonLat(x_max, y_max));
				bounds.extend(new OpenLayers.LonLat(x_min, y_min));
			}
		}
	} else {
		//keine tpop übergeben, Kanton anzeigen
		bounds.extend(new OpenLayers.LonLat(717000, 284000));
		bounds.extend(new OpenLayers.LonLat(669000, 222000));
	}
	return {bounds: bounds, popid_markiert: popid_markiert};
}

function zeigePopInTPopKarte(overlay_pop_visible, overlay_popbeschriftungen_visible, popid_markiert) {
	var pop_gezeigt = $.Deferred();
	var pop_aufruf = $.ajax({
		url: 'php/pop_karte_alle.php',
		dataType: 'json',
		data: {
			"ApArtId": window.ap.ApArtId
		}
	});

	pop_aufruf.done(function(PopListe) {
		//Layer für Symbole und Beschriftung erstellen
		$.when(
			erstellePopNrFuerGeoAdmin(PopListe, overlay_popbeschriftungen_visible),
			erstellePopNamenFuerGeoAdmin(PopListe),
			erstellePopSymboleFuerGeoAdmin(PopListe, popid_markiert, overlay_pop_visible)
			)
			.then(function() {
				schliesseLayeroptionen();
				pop_gezeigt.resolve();
			});
	});

	pop_aufruf.fail(function() {
		$("#Meldung").html("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
		pop_gezeigt.resolve();
	});
	return pop_gezeigt.promise();
}

function erstelleTPopulationFuerGeoAdmin(TPop) {
	//styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_rot.png',
		graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
		title: '${tooltip}'
	});
	var selectStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_gelb.png'
	});

	// overlay layer für Marker vorbereiten
	var overlay_tpopulation = new OpenLayers.Layer.Vector('Teilpopulation', {
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': defaultStyle
		})
	});
	
	var myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord);
	var myTPopFlurname = TPop.TPopFlurname || '(kein Flurname)';
	//tooltip bzw. label vorbereiten: nullwerte ausblenden
	var myTooltip;
	if (window.pop.PopNr & TPop.TPopNr) {
		myTooltip = window.pop.PopNr + '/' + TPop.TPopNr + ' ' + myTPopFlurname;
	} else if (window.pop.PopNr) {
		myTooltip = window.pop.PopNr + '/?' + ' ' + myTPopFlurname;
	} else if (TPop.TPopNr) {
		myTooltip = '?/' + TPop.TPopNr + ' ' + myTPopFlurname;
	} else {
		myTooltip = '?/?' + ' ' + myTPopFlurname;
	}

	//marker erstellen...
	//gewählte erhalten style gelb und zuoberst
	var marker = new OpenLayers.Feature.Vector(myLocation, {
		tooltip: myTooltip
	});

	//die marker der Ebene hinzufügen
	overlay_tpopulation.addFeatures(marker);

	//die marker sollen verschoben werdeen können
	var dragControl = new OpenLayers.Control.DragFeature(overlay_tpopulation, {
		onComplete: function(feature) {
			//x und y merken
			TPop.TPopXKoord = feature.geometry.x;
			TPop.TPopYKoord = feature.geometry.y;
			//Datensatz updaten
			speichereWert('tpop', localStorage.tpop_id, 'TPopXKoord', TPop.TPopXKoord);
			speichereWert('tpop', localStorage.tpop_id, 'TPopYKoord', TPop.TPopYKoord);
		}
	});
	window.api.map.addControl(dragControl);
	dragControl.activate();

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_tpopulation]);

	//control zur Karte hinzufügen
	window.selectControlTPop = new OpenLayers.Control.SelectFeature(overlay_tpopulation, {clickout: true});
	window.api.map.addControl(window.selectControlTPop);
	window.selectControlTPop.activate();
}

//dieser Funktion kann man einen Wert zum speichern übergeben
function speichereWert(tabelle, id, feld, wert) {
	if (pruefeSchreibvoraussetzungen()) {
		$.ajax({
			url: 'php/' + tabelle + '_update.php',
			dataType: 'json',
			data: {
				"id": id,
				"Feld": feld,
				"Wert": wert,
				"user": sessionStorage.User
			},
			success: function () {
				//muss nichts machen
			},
			error: function (data) {
				var Meldung;
				Meldung = JSON.stringify(data);
				$("#Meldung").html(data.responseText);
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			}
		});
	}
}

//nimmt drei Variabeln entgegen: 
//TPopListe: Die Liste der darzustellenden Teilpopulationen
//tpopid_markiert: die ID der zu markierenden TPop
//visible: Ob das Layer sichtbar sein soll
function erstelleTPopSymboleFuerGeoAdmin(TPopListe, tpopid_markiert, visible) {
	var tpopsymbole_erstellt = $.Deferred();
	//if (!visible && visible !== false) {
	if (visible === null) {
		visible = true;
	}
	//styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon.png',
		graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
		title: '${tooltip}'
	});
	var selectStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_gelb.png'
	});

	var strategy = new OpenLayers.Strategy.Cluster({
		distance: 30, 
		threshold: 2
	});

	// overlay layer für Marker vorbereiten
	window.overlay_tpop = new OpenLayers.Layer.Vector('Teilpopulationen', {
		filter: '',	//ist wohl nicht nötig und nützt auch nichts, um später einen Filter anzufügen
		//popup bei select
		eventListeners: {
			'featureselected': function(evt) {
				geoadminOnFeatureSelect(evt.feature);
			},
			'featureunselected': function(evt) {
				geoadminOnFeatureUnselect(evt.feature);
			}
		},
		//normal = grün, markiert = gelb
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': selectStyle
		}),
		//ermöglicht, dass die markierte TPop über den anderen angezeigt wird
		rendererOptions: {
			//yOrdering: true, 
			zIndexing: true
		},
		visibility: visible
	});

	//Array gründen, um marker darin zu sammeln
	var markers = [];
	var myLabel;
	var myFlurname;

	for (b in TPopListe.rows) {
		if (TPopListe.rows.hasOwnProperty(b)) {
			TPop = TPopListe.rows[b];
			myFlurname = TPop.TPopFlurname || '(kein Flurname)';
			html = '<h3>' + TPop.Artname + '</h3>'+
				'<p>Population: ' + TPop.PopName + '</p>'+
				'<p>Teilpopulation: ' + myFlurname + '</p>'+
				'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
				"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">Formular öffnen<\/a></p>"+
				"<p><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + TPop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>";
			
			var myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord);

			//tooltip bzw. label vorbereiten: nullwerte ausblenden
			if (TPop.PopNr && TPop.TPopNr) {
				myLabel = TPop.PopNr + '/' + TPop.TPopNr;
			} else if (TPop.PopNr) {
				myLabel = TPop.PopNr + '/?';
			} else if (TPop.TPopNr) {
				myLabel = '?/' + TPop.TPopNr;
			} else {
				myLabel = '?/?';
			}

			//marker erstellen...
			//gewählte erhalten style gelb und zuoberst
			if (tpopid_markiert && tpopid_markiert.indexOf(TPop.TPopId) !== -1) {
				var marker = new OpenLayers.Feature.Vector(myLocation, {
					tooltip: myFlurname,
					label: myLabel,
					message: html
				}, {
					externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_gelb.png',
					graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
					title: TPop.TPopFlurname,
					graphicZIndex: 5000
				});
			} else {
				var marker = new OpenLayers.Feature.Vector(myLocation, {
					tooltip: myFlurname,
					message: html,
					label: myLabel
				});
			}
			marker.attributes.myTyp = "tpop";
			marker.attributes.myId = TPop.TPopId;

			//...und in Array speichern
			markers.push(marker);
		}
	}

	//die marker der Ebene hinzufügen
	overlay_tpop.addFeatures(markers);

	//die marker sollen verschoben werden können
	var dragControl = new OpenLayers.Control.DragFeature(overlay_tpop, {
		onStart: function(feature) {
			//TO DO: Variable zum rückgängig machen erstellen
			/*window.tpop_vorher = {};
			tpop_vorher.TPopXKoord = feature.geometry.x;
			tpop_vorher.TPopYKoord = feature.geometry.y;
			tpop_vorher.TPopId = feature.attributes.myId;*/
			//meldung anzeigen, wie bei anderen Wiederherstellungen
			//wenn wiederherstellen: function verschiebeTPop(id, x, y)
			
			//allfällig geöffnete Popups schliessen - ist unschön, wenn die offen bleiben
			window.selectControlTPop.unselectAll();
		},
		onComplete: function(feature) {
			//nur zulassen, wenn Schreibrechte bestehen
			if (sessionStorage.NurLesen) {
				$("#Meldung").html("Sie haben keine Schreibrechte");
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
							//overlay entfernen...
							if (window.api.map.getLayersByName('Teilpopulationen')) {
								var layers = window.api.map.getLayersByName('Teilpopulationen');
								for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
									window.api.map.removeLayer(layers[layerIndex]);
								}
							}
							//...und neu erstellen
							erstelleTPopSymboleFuerGeoAdmin(TPopListe, tpopid_markiert, true);
						}
					}
				});
				return;
			}
			//Verschieben muss bestätigt werden
			//Mitteilung formulieren. Gewählte hat keinen label und tooltip ist wie sonst label
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
						//neue Koordinaten speichern
						//x und y merken
						TPop.TPopXKoord = feature.geometry.x;
						TPop.TPopYKoord = feature.geometry.y;
						//Datensatz updaten
						speichereWert('tpop', feature.attributes.myId, 'TPopXKoord', TPop.TPopXKoord);
						speichereWert('tpop', feature.attributes.myId, 'TPopYKoord', TPop.TPopYKoord);
						//jetzt alle marker entfernen...
						entferneTPopMarkerEbenen();
						//...und neu aufbauen
						//dazu die tpopliste neu abrufen, da Koordinaten geändert haben! tpopid_markiert bleibt gleich
						$.ajax({
							url: 'php/tpop_karte_alle.php',
							dataType: 'json',
							data: {
								"ApArtId": window.ap.ApArtId
							},
							success: function (TPopListe) {
								erstelleTPopNrFuerGeoAdmin(TPopListe, tpopid_markiert);
								erstelleTPopNamenFuerGeoAdmin(TPopListe, tpopid_markiert);
								erstelleTPopSymboleFuerGeoAdmin(TPopListe, tpopid_markiert, true);
							},	
							error: function (data) {
								$("#Meldung").html("Fehler: Es konnten keine Teilpopulationen aus der Datenbank abgerufen werden");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						});
					},
					"nein, nicht verschieben": function() {
						$(this).dialog("close");
						//overlay entfernen...
						if (window.api.map.getLayersByName('Teilpopulationen')) {
							var layers = window.api.map.getLayersByName('Teilpopulationen');
							for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
								window.api.map.removeLayer(layers[layerIndex]);
							}
						}
						//...und neu erstellen
						erstelleTPopSymboleFuerGeoAdmin(TPopListe, tpopid_markiert, true);
					}
				}
			});
		}
	});

	//selectfeature (Infoblase) soll nicht durch dragfeature blockiert werden
	//Quelle: http://stackoverflow.com/questions/6953907/make-marker-dragable-and-clickable
	dragControl.handlers['drag'].stopDown = false;
	dragControl.handlers['drag'].stopUp = false;
	dragControl.handlers['drag'].stopClick = false;
	dragControl.handlers['feature'].stopDown = false;
	dragControl.handlers['feature'].stopUp = false;
	dragControl.handlers['feature'].stopClick = false;

	//dragControl einschalten
	window.api.map.addControl(dragControl);
	dragControl.activate();

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_tpop]);

	//SelectControl erstellen (mit dem Eventlistener öffnet das die Infoblase) und zur Karte hinzufügen
	window.selectControlTPop = new OpenLayers.Control.SelectFeature(overlay_tpop, {clickout: true});
	window.api.map.addControl(window.selectControlTPop);
	window.selectControlTPop.activate();

	//mit Polygon auswählen, nur wenn noch nicht existent
	if (!window.auswahlPolygonLayer) {
		window.auswahlPolygonLayer = new OpenLayers.Layer.Vector("Auswahl-Polygon", {
			projection: new OpenLayers.Projection("EPSG:21781"), 
			displayInLayerSwitcher: false
		});
		window.api.map.addLayers([auswahlPolygonLayer]);
	}
	//drawControl erstellen, nur wenn noch nicht existent
	if (!window.drawControl) {
		window.drawControl = new OpenLayers.Control.DrawFeature(auswahlPolygonLayer, OpenLayers.Handler.Polygon);
		drawControl.events.register("featureadded", this, function (event) {
			window.PopTPopAuswahlFilter = new OpenLayers.Filter.Spatial({ 
				type: OpenLayers.Filter.Spatial.INTERSECTS, 
				value: event.feature.geometry
			});
			//Teilpopulationen: Auswahl ermitteln und einen Array von ID's in window.tpop_array speichern
			erstelleTPopAuswahlArrays();
			//Populationen: Auswahl ermitteln und einen Array von ID's in window.pop_array speichern
			erstellePopAuswahlArrays();
			//Liste erstellen, welche die Auswahl anzeigt, Pop/TPop verlinkt und Exporte anbietet
			erstelleListeDerAusgewaehltenPopTPop();

			//control deaktivieren
			window.drawControl.deactivate();
			//Schaltfläche Karte schieben aktivieren
			$("#karteSchieben").attr("checked", true);
			$("#karteSchieben").button("enable").button("refresh");
		});
		window.api.map.addControl(drawControl);
	}

	tpopsymbole_erstellt.resolve();
	return tpopsymbole_erstellt.promise();
}

function erstelleTPopAuswahlArrays() {
	//Teilpopulationen: Auswahl ermitteln und einen Array von ID's in window.tpop_array speichern
	window.tpop_array = [];
	window.tpop_id_array = [];
	if (overlay_tpop.visibility === true) {
		$.each(overlay_tpop.features, function() {
			if (window.PopTPopAuswahlFilter.evaluate(this)) {
				window.tpop_array.push(this.attributes);
				window.tpop_id_array.push(parseInt(this.attributes.myId));
			}
		});
		window.tpop_array.sort(vergleicheTPopZumSortierenNachTooltip);
	}
}

function erstellePopAuswahlArrays() {
	//Populationen: Auswahl ermitteln und einen Array von ID's in window.pop_array speichern
	window.pop_array = [];
	window.pop_id_array = [];
	if (overlay_pop.visibility === true) {
		$.each(overlay_pop.features, function() {
			if (window.PopTPopAuswahlFilter.evaluate(this)) {
				window.pop_array.push(this.attributes);
				window.pop_id_array.push(parseInt(this.attributes.myId));
			}
		});
		window.pop_array.sort(vergleicheTPopZumSortierenNachTooltip);
	}
}

function erstelleListeDerAusgewaehltenPopTPop() {
	//rückmelden, welche Objekte gewählt wurden
	var rueckmeldung = "";
	if (window.pop_array.length > 0) {
		if (window.tpop_array.length > 0) {
			//tpop und pop betitteln
			rueckmeldung += "<p class='ergebnisAuswahlListeTitel'>" + window.pop_array.length + " Populationen: </p>";
		}
		rueckmeldung += "<table>";
		for (var i = 0; i < window.pop_array.length; i++) {
			rueckmeldung += "<tr><td><a href=\"#\" onclick=\"oeffnePop('" + window.pop_array[i]['myId'] + "')\">" + window.pop_array[i]['label'] + ":<\/a></td><td><a href=\"#\" onclick=\"oeffnePop('" + window.pop_array[i]['myId'] + "')\">" + window.pop_array[i].tooltip + "<\/a></td></tr>";
		}
		rueckmeldung += "</table>";
	}
	if (window.tpop_array.length > 0) {
		if (window.pop_array.length > 0) {
			//tpop und pop betitteln
			rueckmeldung += "<p class='ergebnisAuswahlListeTitel ergebnisAuswahlListeTitelTPop'>" + window.tpop_array.length + " Teilpopulationen: </p>";
		}
		rueckmeldung += "<table>";
		for (var i = 0; i < window.tpop_array.length; i++) {
			rueckmeldung += "<tr><td><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + window.tpop_array[i]['myId'] + "')\">" + window.tpop_array[i]['label'] + ":<\/a></td><td><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + window.tpop_array[i]['myId'] + "')\">" + window.tpop_array[i].tooltip + "<\/a></td></tr>";
		}
		rueckmeldung += "</table>";
	}
	//Höhe der Meldung begrenzen. Leider funktioniert maxHeight nicht
	var height = "auto";
	if (window.tpop_array.length > 25) {
		height = 650;
	}

	//Listentitel erstellen
	var Listentitel;
	var exportieren = "Exportieren: ";
	var exportierenPop = "<a href='#' class='export_pop'>Populationen</a>";
	var exportierenTPop = "<a href='#' class='export_tpop'>Teilpopulationen</a>, <a href='#' class='export_kontr'>Kontrollen</a>, <a href='#' class='export_massn'>Massnahmen</a>";
	if (window.pop_array.length > 0 && window.tpop_array.length > 0) {
		Listentitel = "Gewählt wurden " + window.pop_array.length + " Populationen und " + window.tpop_array.length + " Teilpopulationen";
		exportieren += exportierenPop + ", " + exportierenTPop;
	} else if (window.pop_array.length > 0) {
		Listentitel = "Gewählt wurden " + window.pop_array.length + " Populationen:";
		exportieren += exportierenPop;
	} else if (window.tpop_array.length > 0) {
		Listentitel = "Gewählt wurden " + window.tpop_array.length + " Teilpopulationen:";
		exportieren += exportierenTPop;
	} else {
		Listentitel = "Keine Populationen/Teilpopulationen gewählt";
		exportieren = "";
	}
	$("#ergebnisAuswahlHeaderText").html(Listentitel);
	$("#ergebnisAuswahlListe").html(rueckmeldung);
	$("#ergebnisAuswahlFooter").html(exportieren);
	//Ergebnis-Div einblenden
	$("#ergebnisAuswahl").css("display", "block");
}

//übernimmt drei Variabeln: PopListe ist das Objekt mit den Populationen
//popid_array der Array mit den ausgewählten Pop
//visible: Ob die Ebene sichtbar geschaltet wird (oder bloss im Layertree verfügbar ist)
function erstellePopSymboleFuerGeoAdmin(PopListe, popid_markiert, visible) {
	if (visible === null) {
		visible = true;
	}
	var PopSymbole_erstellt = $.Deferred();
	//styles für overlay_pop definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_braun.png',
		graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
		title: '${tooltip}'
	});
	var selectStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_orange.png'
	});

	// overlay layer für Marker vorbereiten
	window.overlay_pop = new OpenLayers.Layer.Vector('Populationen', {
		//popup bei select
		eventListeners: {
			'featureselected': function(evt) {
				geoadminOnFeatureSelect(evt.feature);
			},
			'featureunselected': function(evt) {
				geoadminOnFeatureUnselect(evt.feature);
			}
		},
		//normal = braun, markiert = orange
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': selectStyle
		}),
		//ermöglicht, dass die markierte Pop über den anderen angezeigt wird
		rendererOptions: {
			zIndexing: true
		},
		visibility: visible
	});

	//Array gründen, um marker darin zu sammeln
	var markers = [];
	var myLabel;
	var myName;

	for (b in PopListe.rows) {
		if (PopListe.rows.hasOwnProperty(b)) {
			Pop = PopListe.rows[b];
			myName = Pop.PopName || '(kein Name)';
			html = '<h3>' + myName + '</h3>'+
				'<p>Koordinaten: ' + Pop.PopXKoord + ' / ' + Pop.PopYKoord + '</p>'+
				"<p><a href=\"#\" onclick=\"oeffnePop('" + Pop.PopId + "')\">Formular öffnen<\/a></p>"+
				"<p><a href=\"#\" onclick=\"oeffnePopInNeuemTab('" + Pop.PopId + "')\">Formular in neuem Fenster öffnen<\/a></p>";
			
			var myLocation = new OpenLayers.Geometry.Point(Pop.PopXKoord, Pop.PopYKoord);

			//tooltip bzw. label vorbereiten: nullwerte ausblenden
			if (Pop.PopNr) {
				myLabel = Pop.PopNr;
			} else {
				myLabel = '?';
			}

			//marker erstellen...
			//gewählte erhalten style gelb und zuoberst
			if (popid_markiert && popid_markiert.indexOf(Pop.PopId) !== -1) {
				var marker = new OpenLayers.Feature.Vector(myLocation, {
					tooltip: myName,
					label: myLabel,
					message: html
				}, {
					externalGraphic: 'http://www.barbalex.ch/apflora/img/flora_icon_orange.png',
					graphicWidth: 32, graphicHeight: 37, graphicYOffset: -37,
					title: myName,
					graphicZIndex: 5000
				});
			} else {
				var marker = new OpenLayers.Feature.Vector(myLocation, {
					tooltip: myName,
					message: html,
					label: myLabel
				});
			}
			marker.attributes.myTyp = "pop";
			marker.attributes.myId = Pop.PopId;

			//...und in Array speichern
			markers.push(marker);
		}
	}

	//die marker der Ebene hinzufügen
	overlay_pop.addFeatures(markers);

	//die marker sollen verschoben werden können
	var dragControl = new OpenLayers.Control.DragFeature(overlay_pop, {
		onStart: function(feature) {
			//allfällig geöffnete Popups schliessen - ist unschön, wenn die offen bleiben
			window.selectControlPop.unselectAll();
		},
		onComplete: function(feature) {
			//nur zulassen, wenn Schreibrechte bestehen
			if (sessionStorage.NurLesen) {
				$("#Meldung").html("Sie haben keine Schreibrechte");
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
							//overlay entfernen...
							if (window.api.map.getLayersByName('Populationen')) {
								var layers = window.api.map.getLayersByName('Populationen');
								for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
									window.api.map.removeLayer(layers[layerIndex]);
								}
							}
							//...und neu erstellen
							erstellePopSymboleFuerGeoAdmin(PopListe, popid_markiert, visible);
						}
					}
				});
				return;
			}
			//Verschieben muss bestätigt werden
			//Mitteilung formulieren. Gewählte hat keinen label und tooltip ist wie sonst label
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
						//neue Koordinaten speichern
						//x und y merken
						Pop.PopXKoord = feature.geometry.x;
						Pop.PopYKoord = feature.geometry.y;
						//Datensatz updaten
						speichereWert('pop', feature.attributes.myId, 'PopXKoord', Pop.PopXKoord);
						speichereWert('pop', feature.attributes.myId, 'PopYKoord', Pop.PopYKoord);
						//jetzt alle marker entfernen...
						entfernePopMarkerEbenen();
						//...und neu aufbauen
						//dazu die popliste neu abrufen, da Koordinaten geändert haben! popid_markiert bleibt gleich
						$.ajax({
							url: 'php/pop_karte_alle.php',
							dataType: 'json',
							data: {
								"ApArtId": window.ap.ApArtId
							},
							success: function (PopListe) {
								erstellePopNrFuerGeoAdmin(PopListe, true);
								erstellePopNamenFuerGeoAdmin(PopListe);
								erstellePopSymboleFuerGeoAdmin(PopListe, popid_markiert, true);
							},	
							error: function (data) {
								$("#Meldung").html("Fehler: Es konnten keine Populationen aus der Datenbank abgerufen werden");
								$("#Meldung").dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$(this).dialog("close");
										}
									}
								});
							}
						});
					},
					"nein, nicht verschieben": function() {
						$(this).dialog("close");
						//overlay entfernen...
						if (window.api.map.getLayersByName('Populationen')) {
							var layers = window.api.map.getLayersByName('Populationen');
							for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
								window.api.map.removeLayer(layers[layerIndex]);
							}
						}
						//...und neu erstellen
						erstellePopSymboleFuerGeoAdmin(PopListe, popid_markiert, true);
					}
				}
			});
		}
	});

	//selectfeature (Infoblase) soll nicht durch dragfeature blockiert werden
	//Quelle: http://stackoverflow.com/questions/6953907/make-marker-dragable-and-clickable
	dragControl.handlers['drag'].stopDown = false;
	dragControl.handlers['drag'].stopUp = false;
	dragControl.handlers['drag'].stopClick = false;
	dragControl.handlers['feature'].stopDown = false;
	dragControl.handlers['feature'].stopUp = false;
	dragControl.handlers['feature'].stopClick = false;

	//dragControl einschalten
	window.api.map.addControl(dragControl);
	dragControl.activate();

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_pop]);

	//SelectControl erstellen (mit dem Eventlistener öffnet das die Infoblase) und zur Karte hinzufügen
	window.selectControlPop = new OpenLayers.Control.SelectFeature(overlay_pop, {clickout: true});
	window.api.map.addControl(window.selectControlPop);
	window.selectControlPop.activate();
	PopSymbole_erstellt.resolve();
	return PopSymbole_erstellt.promise();
}

function erstellePopNrFuerGeoAdmin(PopListe, visible) {
	var PopNr_erstellt = $.Deferred();
	//styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/leer.png',
		graphicWidth: 1, graphicHeight: 1, graphicYOffset: 0,
		title: null,
		label: '${label}',
		fontColor: "black",
		fontSize: "11px",
		fontFamily: "Arial, Verdana, Helvetica, sans-serif",
		fontWeight: "bold",
		labelAlign: "cm",
		// positive value moves the label to the right
		labelXOffset: 0,
		// negative value moves the label down
		labelYOffset: -8,
		labelOutlineColor: "white",
		labelOutlineWidth: 3
	});

	// overlay layer für Marker vorbereiten
	//wurde visible mitgegeben verwenden, sonst nicht
	if (visible !== null) {
		var overlay_pop_beschriftungen = new OpenLayers.Layer.Vector('Populationen Nummern', {
			styleMap: new OpenLayers.StyleMap({
				'default': defaultStyle,
				'select': defaultStyle
			}),
			visibility: visible
		});
	} else {
		var overlay_pop_beschriftungen = new OpenLayers.Layer.Vector('Populationen Nummern', {
			styleMap: new OpenLayers.StyleMap({
				'default': defaultStyle,
				'select': defaultStyle
			})
		});
	}

	//Array gründen, um marker darin zu sammeln
	var markers = [];
	var myLabel;

	for (b in PopListe.rows) {
		if (PopListe.rows.hasOwnProperty(b)) {
			Pop = PopListe.rows[b];
			
			var myLocation = new OpenLayers.Geometry.Point(Pop.PopXKoord, Pop.PopYKoord);

			//tooltip bzw. label vorbereiten: nullwerte ausblenden
			if (Pop.PopNr) {
				myLabel = Pop.PopNr ;
			} else {
				myLabel = '?';
			}

			//marker erstellen...
			//gewählte erhalten style gelb und zuoberst
			var marker = new OpenLayers.Feature.Vector(myLocation, {
				label: myLabel,
			});

			//...und in Array speichern
			markers.push(marker);
		}
	}

	//die marker der Ebene hinzufügen
	overlay_pop_beschriftungen.addFeatures(markers);

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_pop_beschriftungen]);
	PopNr_erstellt.resolve();
	return PopNr_erstellt.promise();
}

function erstellePopNamenFuerGeoAdmin(PopListe) {
	var PopNamen_erstellt = $.Deferred();
	//styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/leer.png',
		graphicWidth: 1, graphicHeight: 1, graphicYOffset: 0,
		title: null,
		label: '${label}',
		fontColor: "black",
		fontSize: "11px",
		fontFamily: "Arial, Verdana, Helvetica, sans-serif",
		fontWeight: "bold",
		labelAlign: "cm",
		// positive value moves the label to the right
		labelXOffset: 0,
		// negative value moves the label down
		labelYOffset: -8,
		labelOutlineColor: "white",
		labelOutlineWidth: 3
	});

	// overlay layer für Marker vorbereiten
	var overlay_pop_beschriftungen = new OpenLayers.Layer.Vector('Populationen Namen', {
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': defaultStyle
		}),
		visibility: false
	});

	//Array gründen, um marker darin zu sammeln
	var markers = [];

	for (b in PopListe.rows) {
		if (PopListe.rows.hasOwnProperty(b)) {
			Pop = PopListe.rows[b];
			
			var myLocation = new OpenLayers.Geometry.Point(Pop.PopXKoord, Pop.PopYKoord);
			var myPopName = Pop.TPopName || '(kein Name)';

			//marker erstellen...
			//gewählte erhalten style gelb und zuoberst
			var marker = new OpenLayers.Feature.Vector(myLocation, {
				label: myPopName,
			});

			//...und in Array speichern
			markers.push(marker);
		}
	}

	//die marker der Ebene hinzufügen
	overlay_pop_beschriftungen.addFeatures(markers);

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_pop_beschriftungen]);
	PopNamen_erstellt.resolve();
	return PopNamen_erstellt.promise();
}

//ermöglicht es, nach dem toolip zu sortieren
function vergleicheTPopZumSortierenNachTooltip(a,b) {
	if (a.tooltip < b.tooltip)
		 return -1;
	if (a.tooltip > b.tooltip)
		return 1;
	return 0;
}

function deaktiviereGeoAdminAuswahl() {
	if (window.auswahlPolygonLayer) {
		window.auswahlPolygonLayer.removeAllFeatures();
	}
	if (window.drawControl) {
		window.drawControl.deactivate();
	}
	$("#ergebnisAuswahl").css("display", "none");
	delete window.tpop_id_array;
	delete window.tpop_id_liste;
	delete window.pop_id_array;
	delete window.pop_id_liste;
}

//nimmt drei Variabeln entgegen: 
//TPopListe: Die Liste der darzustellenden Teilpopulationen
//tpopid_markiert: die ID der zu markierenden TPop
//visible: Ob das Layer sichtbar sein soll
function erstelleTPopNrFuerGeoAdmin(TPopListe, tpopid_markiert, visible) {
	if (visible === null) {
		visible = true;
	}
	var tpopnr_erstellt = $.Deferred();
	//styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/leer.png',
		graphicWidth: 1, graphicHeight: 1, graphicYOffset: 0,
		title: null,
		label: '${label}',
		fontColor: "black",
		fontSize: "11px",
		fontFamily: "Arial, Verdana, Helvetica, sans-serif",
		fontWeight: "bold",
		labelAlign: "cm",
		// positive value moves the label to the right
		labelXOffset: 0,
		// negative value moves the label down
		labelYOffset: -8,
		labelOutlineColor: "white",
		labelOutlineWidth: 3
	});

	// overlay layer für Marker vorbereiten
	var overlay_tpop_beschriftungen = new OpenLayers.Layer.Vector('Teilpopulationen Nummern', {
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': defaultStyle
		}),
		visibility: visible
	});

	//Array gründen, um marker darin zu sammeln
	var markers = [];
	var myLabel;

	for (b in TPopListe.rows) {
		if (TPopListe.rows.hasOwnProperty(b)) {
			TPop = TPopListe.rows[b];
			
			var myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord);

			//tooltip bzw. label vorbereiten: nullwerte ausblenden
			if (TPop.PopNr && TPop.TPopNr) {
				myLabel = TPop.PopNr + '/' + TPop.TPopNr;
			} else if (TPop.PopNr) {
				myLabel = TPop.PopNr + '/?';
			} else if (TPop.TPopNr) {
				myLabel = '?/' + TPop.TPopNr;
			} else {
				myLabel = '?/?';
			}

			//marker erstellen...
			//gewählte erhalten style gelb und zuoberst
			var marker = new OpenLayers.Feature.Vector(myLocation, {
				label: myLabel,
			});

			//...und in Array speichern
			markers.push(marker);
		}
	}

	//die marker der Ebene hinzufügen
	overlay_tpop_beschriftungen.addFeatures(markers);

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_tpop_beschriftungen]);
	tpopnr_erstellt.resolve();
	return tpopnr_erstellt.promise();
}

//nimmt drei Variabeln entgegen: 
//TPopListe: Die Liste der darzustellenden Teilpopulationen
//tpopid_markiert: die ID der zu markierenden TPop
//visible: Ob das Layer sichtbar sein soll
function erstelleTPopNamenFuerGeoAdmin(TPopListe, tpopid_markiert, visible) {
	if (visible === null) {
		visible = true;
	}
	var tpopnamen_erstellt = $.Deferred();
	//styles für overlay_top definieren
	var defaultStyle = new OpenLayers.Style({
		externalGraphic: 'http://www.barbalex.ch/apflora/img/leer.png',
		graphicWidth: 1, graphicHeight: 1, graphicYOffset: 0,
		title: null,
		label: '${label}',
		fontColor: "black",
		fontSize: "11px",
		fontFamily: "Arial, Verdana, Helvetica, sans-serif",
		fontWeight: "bold",
		labelAlign: "cm",
		// positive value moves the label to the right
		labelXOffset: 0,
		// negative value moves the label down
		labelYOffset: -8,
		labelOutlineColor: "white",
		labelOutlineWidth: 3
	});

	// overlay layer für Marker vorbereiten
	var overlay_tpop_beschriftungen = new OpenLayers.Layer.Vector('Teilpopulationen Namen', {
		styleMap: new OpenLayers.StyleMap({
			'default': defaultStyle,
			'select': defaultStyle
		}),
		visibility: visible
	});

	//Array gründen, um marker darin zu sammeln
	var markers = [];

	for (b in TPopListe.rows) {
		if (TPopListe.rows.hasOwnProperty(b)) {
			TPop = TPopListe.rows[b];
			
			var myLocation = new OpenLayers.Geometry.Point(TPop.TPopXKoord, TPop.TPopYKoord);
			var myTPopFlurname = TPop.TPopFlurname || '(kein Name)';

			//marker erstellen...
			//gewählte erhalten style gelb und zuoberst
			var marker = new OpenLayers.Feature.Vector(myLocation, {
				label: myTPopFlurname,
			});

			//...und in Array speichern
			markers.push(marker);
		}
	}

	//die marker der Ebene hinzufügen
	overlay_tpop_beschriftungen.addFeatures(markers);

	//overlay zur Karte hinzufügen
	window.api.map.addLayers([overlay_tpop_beschriftungen]);

	tpopnamen_erstellt.resolve();
	return tpopnamen_erstellt.promise();
}

function geoadminOnFeatureSelect(feature) {
	var popup = new OpenLayers.Popup.FramedCloud("popup",
		feature.geometry.getBounds().getCenterLonLat(),
		null,
		feature.attributes.message,
		null,
		false	//true zeigt Schliess-Schalftläche an. Schliessen zerstört aber event-listener > popup kann nur ein mal angezeigt werden!
	);
	popup.autoSize = true;
	popup.maxSize = new OpenLayers.Size(600,600);
	popup.fixedRelativePosition = true;
	feature.popup = popup;
	window.api.map.addPopup(popup);
}

function geoadminOnFeatureUnselect(feature) {
	feature.popup.hide();
}

function zeigeBeobUndTPopAufKarte(BeobListe, TPopListe) {
	window.TPopListe = TPopListe;
	var anzBeob, infowindowBeob, infowindowTPop, TPop, lat, lng, latlng, options, map, bounds, markersTPop, TPopId, latlng2, markerBeob, markerTPop, contentStringBeob, contentStringTPop, mcOptionsBeob, mcOptionsTPop, markerClusterBeob, markerClusterTPop, Datum, titel_beob, tpop_beschriftung, a_note, myFlurname;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("google_karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	infowindowBeob = new google.maps.InfoWindow();
	infowindowTPop = new google.maps.InfoWindow();
	//Lat und Lng in BeobListe ergänzen
	//for (i in BeobListe.rows) {
	for (var i = 0; i < BeobListe.rows.length; i++) {
		Beob = BeobListe.rows[i];
		Beob.Lat = CHtoWGSlat(parseInt(Beob.X), parseInt(Beob.Y));
		Beob.Lng = CHtoWGSlng(parseInt(Beob.X), parseInt(Beob.Y));
	}
	//dito in TPopListe
	//for (i in TPopListe.rows) {
	for (var i = 0; i < TPopListe.rows.length; i++) {
		TPop = TPopListe.rows[i];
		if (!TPop.TPopXKoord || !TPop.TPopYKoord) {
			delete TPop;
		} else {
			TPop.Lat = CHtoWGSlat(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
			TPop.Lng = CHtoWGSlng(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
		}
	}
	//Beob zählen
	anzBeob = BeobListe.rows.length;
	//TPop zählen
	anzTPop = TPopListe.rows.length;
	//Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
	//auf die die Karte ausgerichtet werden kann
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
	window.map = map;
	bounds = new google.maps.LatLngBounds();

	//für alle TPop Marker erstellen
	markersTPop = [];
	//for (i in TPopListe.rows) {
	for (var i = 0; i < TPopListe.rows.length; i++) {
		TPop = TPopListe.rows[i];
		TPopId = TPop.TPopId;
		latlng2 = new google.maps.LatLng(TPop.Lat, TPop.Lng);
		//Kartenausschnitt um diese Koordinate erweitern
		bounds.extend(latlng2);
		tpop_beschriftung = beschrifteTPopMitNrFuerKarte(TPop.PopNr, TPop.TPopNr);
		markerTPop = new MarkerWithLabel({
			map: map,
			position: latlng2,
			title: tpop_beschriftung,
			labelContent: tpop_beschriftung,
			labelAnchor: new google.maps.Point(75, 0),
			labelClass: "MapLabel",
			icon: "img/flora_icon.png"
		});
		markersTPop.push(markerTPop);
		myFlurname = TPop.TPopFlurname || '(kein Flurname)';
		contentStringTPop = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + TPop.Artname + '</h3>'+
			'<p>Population: ' + TPop.PopName + '</p>'+
			'<p>TPop: ' + myFlurname + '</p>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + TPop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		makeListener(map, markerTPop, contentStringTPop);
	}
	mcOptionsTPop = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m8.png",
				width: 53
			}]
	};
	markerClusterTPop = new MarkerClusterer(map, markersTPop, mcOptionsTPop);
	
	//diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, markerTPop, contentStringTPop) {
		google.maps.event.addListener(markerTPop, 'click', function () {
			infowindowTPop.setContent(contentStringTPop);
			infowindowTPop.open(map,markerTPop);
		});
	}

	//für alle Beob Marker erstellen
	window.markersBeob = [];
	//for (i in BeobListe.rows) {
	for (var i = 0; i < BeobListe.rows.length; i++) {
		Beob = BeobListe.rows[i];
		Datum = Beob.Datum;
		latlng2 = new google.maps.LatLng(Beob.Lat, Beob.Lng);
		if (anzBeob === 1) {
			//map.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
			latlng = latlng2;
		} else {
			//Kartenausschnitt um diese Koordinate erweitern
			bounds.extend(latlng2);
		}
		//title muss String sein
		if (Datum) {
			titel_beob = Datum.toString();
		} else {
			titel_beob = "";
		}
		//A_NOTE muss String sein
		if (Beob.A_NOTE) {
			a_note = Beob.A_NOTE.toString();
		} else {
			a_note = "";
		}
		markerBeob = new MarkerWithLabel({
			map: map,
			position: latlng2,
			title: titel_beob,
			labelContent: a_note,
			labelAnchor: new google.maps.Point(75, 0),
			labelClass: "MapLabel",
			icon: "img/flora_icon_violett.png",
			draggable: true
		});
		window.markersBeob.push(markerBeob);
		makeListenerMarkerBeobDragend(markerBeob, Beob);
		var Autor = Beob.Autor || "(keiner)";
		var Projekt = Beob.PROJET || "(keines)";
		var Ort = Beob.DESC_LOCALITE || "(keiner)";
		contentStringBeob = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + Datum + '</h3>'+
			'<p>Autor: ' + Autor + '</p>'+
			'<p>Projekt: ' + Projekt + '</p>'+
			'<p>Ort: ' + Ort + '</p>'+
			'<p>Koordinaten: ' + Beob.X + ' / ' + Beob.Y + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneBeob('" + Beob.NO_NOTE + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"oeffneBeobInNeuemTab('" + Beob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		makeListenerBeob(map, markerBeob, contentStringBeob);
	}
	//KEIN MARKERCLUSTERER: er verhindert das Entfernen einzelner Marker!
	//ausserdem macht er es schwierig, eng liegende Marker zuzuordnen
	
	//diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListenerBeob(map, markerBeob, contentStringBeob) {
		google.maps.event.addListener(markerBeob, 'click', function () {
			infowindowBeob.setContent(contentStringBeob);
			infowindowBeob.open(map, markerBeob);
		});
	}

	function makeListenerMarkerBeobDragend(markerBeob, Beob) {
		google.maps.event.addListener(markerBeob, "dragend", function (event) {
			var lat, lng, X, Y, that;
			that = this;
			//Koordinaten berechnen
			lat = event.latLng.lat();
			lng = event.latLng.lng();
			X = DdInChY(lat, lng);
			Y = DdInChX(lat, lng);
			//nächstgelegene TPop aus DB holen
			$.ajax({
				url: 'php/beob_naechste_tpop.php',
				data: {
					"ApArtId": Beob.NO_ISFS,
					"X": X,
					"Y": Y
				},
				dataType: 'json',
				success: function (data) {
					var beobtxt;
					if (Beob.Autor) {
						beobtxt = "Beobachtung von " + Beob.Autor + " aus dem Jahr " + Beob.A_NOTE;
					} else {
						beobtxt = "Beobachtung ohne Autor aus dem Jahr " + Beob.A_NOTE;
					}
					//rückfragen
					$("#Meldung").html("Soll die " + beobtxt + "<br>der Teilpopulation '" + data[0].TPopFlurname + "' zugeordnet werden?");
					$("#Meldung").dialog({
						modal: true,
						title: "Zuordnung bestätigen",
						width: 600,
						buttons: {
							Ja: function() {
								$(this).dialog("close");
								//dem bind.move_node mitteilen, dass das Formular nicht initiiert werden soll
								localStorage.karte_fokussieren = true;
								//Beob der TPop zuweisen
								$("#tree").jstree("move_node", "#beob" + Beob.NO_NOTE, "#tpop_ordner_beob_zugeordnet" + data[0].TPopId, "first");
								//Den Marker der zugewiesenen Beobachtung entfernen
								that.setMap(null);
							},
							Nein: function() {
								$(this).dialog("close");
								//drag rückgängig machen
								lng = CHtoWGSlng(Beob.X, Beob.Y);
								lat = CHtoWGSlat(Beob.X, Beob.Y);
								var latlng3 = new google.maps.LatLng(lat, lng);
								that.setPosition(latlng3);
							}
						}
					});
				},
				error: function (data) {
					$("#Meldung").html("Fehler: Die Beobachtung wurde nicht zugeordnet");
					$("#Meldung").dialog({
						modal: true,
						buttons: {
							Ok: function() {
								$(this).dialog("close");
							}
						}
					});
				}
			});
		});
	}

	if (anzTPop + anzBeob === 1) {
		//map.fitbounds setzt zu hohen zoom, wenn nur ein Punkt dargestellt wird > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		//Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
}

function zeigeBeobAufKarte(BeobListe) {
	var anzBeob, infowindow, TPop, lat, lng, latlng, options, map, bounds, markers, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, Datum, titel, a_note;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("google_karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	infowindow = new google.maps.InfoWindow();
	//Lat und Lng in BeobListe ergänzen
	//for (i in BeobListe.rows) {
	for (var i = 0; i < BeobListe.rows.length; i++) {
		Beob = BeobListe.rows[i];
		Beob.Lat = CHtoWGSlat(parseInt(Beob.X), parseInt(Beob.Y));
		Beob.Lng = CHtoWGSlng(parseInt(Beob.X), parseInt(Beob.Y));
	}
	//TPop zählen
	anzBeob = BeobListe.rows.length;
	//Karte mal auf Zürich zentrieren, falls in den BeobListe.rows keine Koordinaten kommen
	//auf die die Karte ausgerichtet werden kann
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
	window.map = map;
	bounds = new google.maps.LatLngBounds();
	//für alle Orte Marker erstellen
	markers = [];
	//for (i in BeobListe.rows) {
	for (var i = 0; i < BeobListe.rows.length; i++) {
		Beob = BeobListe.rows[i];
		Datum = Beob.Datum;
		latlng2 = new google.maps.LatLng(Beob.Lat, Beob.Lng);
		if (anzBeob === 1) {
			//map.fitbounds setzt zu hohen zoom, wenn nur eine Beob Koordinaten hat > verhindern
			latlng = latlng2;
		} else {
			//Kartenausschnitt um diese Koordinate erweitern
			bounds.extend(latlng2);
		}
		//title muss String sein
		if (Datum) {
			titel = Datum.toString();
		} else {
			titel = "";
		}
		//A_NOTE muss String sein
		if (Beob.A_NOTE) {
			a_note = Beob.A_NOTE.toString();
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
		//dem Marker einen Typ und eine id geben
		//damit drag and drop möglich werden soll
		//marker.set("typ", "beob");
		//marker.set("id", Beob.BeobId);
		marker.metadata = {typ: "beob_nicht_beurteilt", id: Beob.NO_NOTE};
		markers.push(marker);
		var Autor = Beob.Autor || "(keiner)";
		var Projekt = Beob.PROJET || "(keines)";
		var Ort = Beob.DESC_LOCALITE || "(keiner)";
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + Datum + '</h3>'+
			'<p>Autor: ' + Autor + '</p>'+
			'<p>Projekt: ' + Projekt + '</p>'+
			'<p>Ort: ' + Ort + '</p>'+
			'<p>Koordinaten: ' + Beob.X + ' / ' + Beob.Y + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneBeob('" + Beob.NO_NOTE + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"oeffneBeobInNeuemTab('" + Beob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		makeListener(map, marker, contentString);
	}
	mcOptions = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m5.png",
				width: 53
			}]
	};
	markerCluster = new MarkerClusterer(map, markers, mcOptions);
	if (anzBeob === 1) {
		//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		//Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
	//diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.setContent(contentString);
			infowindow.open(map,marker);
		});
	}
}

function zeigeTPopBeobAufKarte(TPopBeobListe) {
	var anzBeob, infowindow, TPop, lat, lng, latlng, options, map, bounds, markers, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, Datum, titel;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("google_karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	infowindow = new google.maps.InfoWindow();
	//TPopListe bearbeiten:
	//Objekte löschen, die keine Koordinaten haben
	//Lat und Lng ergänzen
	//for (i in TPopBeobListe.rows) {
	for (var i = 0; i < TPopBeobListe.rows.length; i++) {
		TPopBeob = TPopBeobListe.rows[i];
		TPopBeob.Lat = CHtoWGSlat(parseInt(TPopBeob.X), parseInt(TPopBeob.Y));
		TPopBeob.Lng = CHtoWGSlng(parseInt(TPopBeob.X), parseInt(TPopBeob.Y));
	}
	//TPop zählen
	anzTPopBeob = TPopBeobListe.rows.length;
	//Karte mal auf Zürich zentrieren, falls in den TPopBeobListe.rows keine Koordinaten kommen
	//auf die die Karte ausgerichtet werden kann
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
	window.map = map;
	//Versuch: SVO einblenden
	//loadWMS(map, "http://wms.zh.ch/FnsSVOZHWMS?");
	//loadWMS(map, "http://www.gis.zh.ch/scripts/wmsfnssvo2.asp?");
	//Versuch: AV einblenden
	//loadWMS(map, "http://wms.zh.ch/avwms?");
	bounds = new google.maps.LatLngBounds();
	//für alle Orte Marker erstellen
	markers = [];
	//for (i in TPopBeobListe.rows) {
	for (var i = 0; i < TPopBeobListe.rows.length; i++) {
		TPopBeob = TPopBeobListe.rows[i];
		Datum = TPopBeob.Datum;
		latlng2 = new google.maps.LatLng(TPopBeob.Lat, TPopBeob.Lng);
		if (anzTPopBeob === 1) {
			//map.fitbounds setzt zu hohen zoom, wenn nur eine TPopBeob Koordinaten hat > verhindern
			latlng = latlng2;
		} else {
			//Kartenausschnitt um diese Koordinate erweitern
			bounds.extend(latlng2);
		}
		//title muss String sein
		if (Datum) {
			titel = Datum.toString();
		} else {
			titel = "";
		}
		marker = new MarkerWithLabel({
			map: map,
			position: latlng2,
			//title muss String sein
			title: titel,
			labelContent: titel,
			labelAnchor: new google.maps.Point(75, 0),
			labelClass: "MapLabel",
			icon: "img/flora_icon_violett.png"
		});
		markers.push(marker);
		var Autor = TPopBeob.Autor || "(keiner)";
		var Projekt = TPopBeob.PROJET || "(keines)";
		var Ort = TPopBeob.DESC_LOCALITE || "(keiner)";
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + Datum + '</h3>'+
			'<p>Autor: ' + Autor + '</p>'+
			'<p>Projekt: ' + Projekt + '</p>'+
			'<p>Ort: ' + Ort + '</p>'+
			'<p>Koordinaten: ' + TPopBeob.X + ' / ' + TPopBeob.Y + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPopBeob('" + TPopBeob.NO_NOTE + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"oeffneTPopBeobInNeuemTab('" + TPopBeob.NO_NOTE + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		makeListener(map, marker, contentString);
	}
	mcOptions = {
		maxZoom: 17, 
		styles: [{
				height: 53,
				url: "img/m5.png",
				width: 53
			}]
	};
	markerCluster = new MarkerClusterer(map, markers, mcOptions);
	if (anzTPopBeob === 1) {
		//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
		map.setCenter(latlng);
		map.setZoom(18);
	} else {
		//Karte auf Ausschnitt anpassen
		map.fitBounds(bounds);
	}
	//diese Funktion muss hier sein, damit infowindow bekannt ist
	function makeListener(map, marker, contentString) {
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.setContent(contentString);
			infowindow.open(map, marker);
		});
	}
}

function verorteTPopAufKarte(TPop) {
	var anzTPop, infowindow, lat, lng, latlng, ZoomLevel, options, map, verorted, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, tpop_beschriftung, myFlurname;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("google_karte");
	window.markersArray = [];
	infowindow = new google.maps.InfoWindow();
	if (TPop && TPop.TPopXKoord && TPop.TPopYKoord) {
		//Wenn Koordinaten vorhanden, Lat und Lng ergänzen
		lat = CHtoWGSlat(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
		lng = CHtoWGSlng(parseInt(TPop.TPopXKoord), parseInt(TPop.TPopYKoord));
		ZoomLevel = 15;
		verorted = true;
	} else {
		//sonst auf Zürich zentrieren
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
	window.map = map;
	if (verorted === true) {
		tpop_beschriftung = beschrifteTPopMitNrFuerKarte(TPop.PopNr, TPop.TPopNr);
		marker = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: tpop_beschriftung,
			icon: "img/flora_icon_rot.png",
			draggable: true
		});
		//Marker in Array speichern, damit er gelöscht werden kann
		markersArray.push(marker); 
		myFlurname = TPop.TPopFlurname || '(kein Flurname)';
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + myFlurname + '</h3>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">Formular öffnen<\/a></p>"+
			"<p><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + TPop.TPopId + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
			'</div>'+
			'</div>';
		infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		if (!window.InfoWindowArray) {
			window.InfoWindowArray = [];
		}
		window.InfoWindowArray.push(infowindow);
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(map,marker);
		});
		google.maps.event.addListener(marker, "dragend", function (event) {
			SetLocationTPop(event.latLng, map, marker, TPop);
		});
	}
	google.maps.event.addListener(map, 'click', function (event) {
		placeMarkerTPop(event.latLng, map, marker, TPop);
	});
}

function placeMarkerTPop(location, map, marker, TPop) {
	var title;
	//title muss String sein
	if (TPop && TPop.TPopFlurname) {
		title = TPop.TPopFlurname;
	} else {
		title = "neue Teilpopulation";
	}
	//zuerst bisherigen Marker löschen
	clearMarkers();
	var marker = new google.maps.Marker({
		position: location, 
		map: map,
		title: title,
		icon: "img/flora_icon_rot.png",
		draggable: true
	});
	//Marker in Array speichern, damit er gelöscht werden kann
	markersArray.push(marker);
	google.maps.event.addListener(marker, "dragend", function (event) {
		SetLocationTPop(event.latLng, map, marker, TPop);
	});
	SetLocationTPop(location, map, marker);
}

function SetLocationTPop(LatLng, map, marker, TPop) {
	var lat, lng, contentString, infowindow, Objekt, title, X, Y;
	//nur aktualisieren, wenn Schreibrechte bestehen
	if (sessionStorage.NurLesen) {
		$("#Meldung").html("Sie haben keine Schreibrechte");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
		return;
	}
	if (TPop && TPop.TPopFlurname) {
		title = TPop.TPopFlurname;
	} else {
		title = "neue Teilpopulation";
	}
	lat = LatLng.lat();
	lng = LatLng.lng();
	X = DdInChY(lat, lng);
	Y = DdInChX(lat, lng);
	$.ajax({
		url: 'php/tpop_update.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpop_id,
			"Feld": "TPopXKoord",
			"Wert": X,
			"user": sessionStorage.User
		},
		success: function () {
			$.ajax({
				url: 'php/tpop_update.php',
				dataType: 'json',
				data: {
					"id": localStorage.tpop_id,
					"Feld": "TPopYKoord",
					"Wert": Y,
					"user": sessionStorage.User
				},
				success: function () {
					clearInfoWindows();
					contentString = '<div id="content">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<div id="bodyContent" class="GmInfowindow">'+
						'<h3>' + title + '</h3>'+
						'<p>Koordinaten: ' + X + ' / ' + Y + '</p>'+
						"<p><a href=\"#\" onclick=\"oeffneTPop('" + localStorage.tpop_id + "')\">Formular öffnen<\/a></p>"+
						"<p><a href=\"#\" onclick=\"oeffneTPopInNeuemTab('" + localStorage.tpop_id + "')\">Formular in neuem Fenster öffnen<\/a></p>"+
						'</div>'+
						'</div>';
					infowindow = new google.maps.InfoWindow({
						content: contentString
					});
					if (!window.InfoWindowArray) {
						window.InfoWindowArray = [];
					}
					window.InfoWindowArray.push(infowindow);
					google.maps.event.addListener(marker, 'click', function () {
						infowindow.open(map, marker);
					});
				}
			});
		}
	});
}

//GoogleMap: alle Marker löschen
//benutzt wo in GoogleMaps Marker gesetzt und verschoben werden
function clearMarkers() {
	if (markersArray) {
		//for (i in markersArray) {
		for (var i = 0; i < markersArray.length; i++) {
			markersArray[i].setMap(null);
		}
	}
}

//GoogleMap: alle InfoWindows löschen
//benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
function clearInfoWindows() {
	if (window.InfoWindowArray) {
		for (var i = 0; i < window.InfoWindowArray.length; i++) {
			window.InfoWindowArray[i].setMap(null);
		}
	}
}

function oeffneTPop(TPopId) {
	localStorage.tpop_id = TPopId;
	jQuery.jstree._reference("[typ='tpop']#" + TPopId).deselect_all();
	jQuery("#tree").jstree("select_node", "[typ='tpop']#" + TPopId);
}

function oeffneTPopInNeuemTab(TPopId) {
	window.open("index.html?ap="+localStorage.ap_id+"&pop=" + localStorage.pop_id+"&tpop="+TPopId, "_blank");
}

function oeffnePop(PopId) {
	localStorage.pop_id = PopId;
	jQuery.jstree._reference("[typ='pop']#" + PopId).deselect_all();
	jQuery("#tree").jstree("select_node", "[typ='pop']#" + PopId);
}

function oeffnePopInNeuemTab(PopId) {
	window.open("index.html?ap="+localStorage.ap_id+"&pop=" + PopId, "_blank");
}

function oeffneBeob(BeobId) {
	localStorage.beob_id = BeobId;
	jQuery.jstree._reference("[typ='beob_nicht_beurteilt']#" + BeobId).deselect_all();
	jQuery("#tree").jstree("select_node", "[typ='beob_nicht_beurteilt']#" + BeobId);
}

function oeffneBeobInNeuemTab(BeobId) {
	window.open("index.html?ap="+localStorage.ap_id+"&beob_nicht_beurteilt=" + BeobId, "_blank");
}

function oeffneTPopBeob(BeobId) {
	localStorage.beob_id = BeobId;
	jQuery.jstree._reference("[typ='beob_zugeordnet']#" + BeobId).deselect_all();
	jQuery("#tree").jstree("select_node", "[typ='beob_zugeordnet']#" + BeobId);
}

function oeffneTPopBeobInNeuemTab(BeobId) {
	window.open("index.html?ap="+localStorage.ap_id+"&beob_nicht_beurteilt=" + BeobId, "_blank");
}





/* 
	Document   : wms.js
	Created on : Feb 16, 2011, 3:25:27 PM
	Author	 : "Gavin Jackson <Gavin.Jackson@csiro.au>"

	Refactored code from http://lyceum.massgis.state.ma.us/wiki/doku.php?id=googlemapsv3:home

	example: loadWMS(map, "http://spatial.ala.org.au/geoserver/wms?", customParams);

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
};

MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
	var me = this;

	var point = opt_point || new google.maps.Point(0, 0);

	var origin = me.pixelOrigin_;
	point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
	// NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
	// 89.189.  This is about a third of a tile past the edge of the world tile.
	var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
	point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
	return point;
};

MercatorProjection.prototype.fromDivPixelToLatLng = function(pixel, zoom) {
	var me = this;

	var origin = me.pixelOrigin_;
	var scale = Math.pow(2, zoom);
	var lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_;
	var latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_;
	var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
	return new google.maps.LatLng(lat, lng);
};

MercatorProjection.prototype.fromDivPixelToSphericalMercator = function(pixel, zoom) {
	var me = this;
	var coord = me.fromDivPixelToLatLng(pixel, zoom);

	var r= 6378137.0;
	var x = r* degreesToRadians(coord.lng());
	var latRad = degreesToRadians(coord.lat());
	var y = (r/2) * Math.log((1+Math.sin(latRad))/ (1-Math.sin(latRad)));

	return new google.maps.Point(x,y);
};

function loadWMS(map, baseURL, customParams){
	var tileHeight = 256;
	var tileWidth = 256;
	var opacityLevel = 0.75;
	var isPng = true;
	var minZoomLevel = 2;
	var maxZoomLevel = 28;

	//var baseURL = "";
	//für SVO
	var wmsParams = [
	"REQUEST=GetMap",
	"SERVICE=WMS",
	"VERSION=1.1.1",
	"WIDTH=512",
	"HEIGHT=512",
	"SRS=EPSG:4326",
	"LAYERS=zonen-schutzverordnungen",
	"STYLES=default",
	"TRANSPARENT=TRUE",
	"FORMAT=image/gif"
	];
	//für av
	/*var wmsParams = [
	//"REQUEST=GetCapabilities",
	//"SERVICE=WMS",
	//"VERSION=1.3.0",
	"WIDTH="+ tileWidth,
	"HEIGHT="+ tileHeight
	];*/

	//add additional parameters
	var wmsParams = wmsParams.concat(customParams);

	var overlayOptions =
	{
		getTileUrl: function(coord, zoom)
		{
			var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
			var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);

			var projectionMap = new MercatorProjection();

			var lULg = projectionMap.fromDivPixelToSphericalMercator(lULP, zoom);
			var lLRg  = projectionMap.fromDivPixelToSphericalMercator(lLRP, zoom);

			var lUL_Latitude = lULg.y;
			var lUL_Longitude = lULg.x;
			var lLR_Latitude = lLRg.y;
			var lLR_Longitude = lLRg.x;
			//GJ: there is a bug when crossing the -180 longitude border (tile does not render) - this check seems to fix it
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

	overlayWMS = new google.maps.ImageMapType(overlayOptions);

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

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
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

function oeffneUri() {
	var uri = new Uri($(location).attr('href'));
	var anchor = uri.anchor() || null;
	var ap_id = uri.getQueryParamValue('ap');
	if (ap_id) {
		//globale Variabeln setzen
		setzeWindowAp(ap_id);
		//Dem Feld im Formular den Wert zuweisen
		$("#ap_waehlen").val(ap_id);
		if (uri.getQueryParamValue('tpop')) {
			//globale Variabeln setzen
			setzeWindowPop(uri.getQueryParamValue('pop'));
			setzeWindowTpop(uri.getQueryParamValue('tpop'));
			var tpopfeldkontr_id = uri.getQueryParamValue('tpopfeldkontr');
			if (tpopfeldkontr_id) {
				//globale Variabeln setzen
				setzeWindowTpopfeldkontr(tpopfeldkontr_id);
				//markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.tpopfeldkontr_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_tpopfeldkontr();
			} else if (uri.getQueryParamValue('tpopfreiwkontr')) {
				//globale Variabeln setzen
				setzeWindowTpopfeldkontr(uri.getQueryParamValue('tpopfreiwkontr'));
				//markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.tpopfreiwkontr_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_tpopfeldkontr();
			} else if (uri.getQueryParamValue('tpopmassn')) {
				//globale Variabeln setzen
				setzeWindowTpopmassn(uri.getQueryParamValue('tpopmassn'));
				//markieren, dass nach dem loaded-event im Tree die TPopkontr angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.tpopmassn_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_tpopmassn();
			} else if (uri.getQueryParamValue('tpopber')) {
				//globale Variabeln setzen
				setzeWindowTpopber(uri.getQueryParamValue('tpopber'));
				//markieren, dass nach dem loaded-event im Tree die tpopber angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.tpopber_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_tpopber();
			} else if (uri.getQueryParamValue('beob_zugeordnet')) {
				//markieren, dass nach dem loaded-event im Tree die beob_zugeordnet angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.beob_zugeordnet_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				/*ausgeschaltet - funktioniert nicht! vermutlich, weil tree.php und beob_distzutpop sich in quere kommen
				//herausfinden, ob beobtyp infospezies oder evab ist
				localStorage.beob_id = uri.getQueryParamValue('beob_zugeordnet');
				if (isNaN(uri.getQueryParamValue('beob_zugeordnet'))) {
					//evab
					localStorage.beobtyp = "evab";
					initiiere_beob("evab", localStorage.beob_id, "zugeordnet");
				} else {
					localStorage.beobtyp = "infospezies";
					initiiere_beob("infospezies", localStorage.beob_id, "zugeordnet");
				}*/
			} else if (uri.getQueryParamValue('tpopmassnber')) {
				//globale Variabeln setzen
				setzeWindowTpopmassnber(uri.getQueryParamValue('tpopmassnber'));
				//markieren, dass nach dem loaded-event im Tree die tpopmassnber angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.tpopmassnber_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_tpopmassnber();
			} else {
				//muss tpop sein
				//markieren, dass nach dem loaded-event im Tree die TPop angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.tpop_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_tpop();
			}
		} else if (uri.getQueryParamValue('pop')) {
			//globale Variabeln setzen
			setzeWindowPop(uri.getQueryParamValue('pop'));
			if (uri.getQueryParamValue('popber')) {
				//globale Variabeln setzen
				setzeWindowPopber(uri.getQueryParamValue('popber'));
				//markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.popber_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_popber();
			} else if (uri.getQueryParamValue('popmassnber')) {
				//globale Variabeln setzen
				setzeWindowPopmassnber(uri.getQueryParamValue('popmassnber'));
				//markieren, dass nach dem loaded-event im Tree die popmassnber angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.popmassnber_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_popmassnber();
			} else {
				//muss pop sein
				//markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.pop_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				localStorage.pop_id = uri.getQueryParamValue('pop');
				initiiere_pop();
			}
		} else if (uri.getQueryParamValue('apziel')) {
			//globale Variabeln setzen
			setzeWindowApziel(uri.getQueryParamValue('apziel'));
			if (uri.getQueryParamValue('zielber')) {
				//globale Variabeln setzen
				setzeWindowZielber(uri.getQueryParamValue('zielber'));
				//markieren, dass nach dem loaded-event im Tree die zielber angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.zielber_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				initiiere_zielber();
			} else {
				//muss ein apziel sein
				//markieren, dass nach dem loaded-event im Tree die apziel angezeigt werden soll 
				//Die Markierung wird im load-Event wieder entfernt
				window.apziel_zeigen = true;
				//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
				localStorage.apziel_id = uri.getQueryParamValue('apziel');
				initiiere_apziel();
			}
		} else if (uri.getQueryParamValue('erfkrit')) {
			//globale Variabeln setzen
			setzeWindowErfkrit(uri.getQueryParamValue('erfkrit'));
			//markieren, dass nach dem loaded-event im Tree die erfkrit angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.erfkrit_zeigen = true;
		} else if (uri.getQueryParamValue('jber')) {
			//globale Variabeln setzen
			setzeWindowJber(uri.getQueryParamValue('jber'));
			//markieren, dass nach dem loaded-event im Tree die jber angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.jber_zeigen = true;
			//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			initiiere_jber();
		} else if (uri.getQueryParamValue('jber_uebersicht')) {
			//globale Variabeln setzen
			setzeWindowJberUebersicht(uri.getQueryParamValue('jber_uebersicht'));
			//markieren, dass nach dem loaded-event im Tree die jber_uebersicht angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.jber_uebersicht_zeigen = true;
			//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			initiiere_jber_uebersicht();
		} else if (uri.getQueryParamValue('ber')) {
			//globale Variabeln setzen
			setzeWindowBer(uri.getQueryParamValue('ber'));
			//markieren, dass nach dem loaded-event im Tree die ber angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.ber_zeigen = true;
			//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			initiiere_ber();
		} else if (uri.getQueryParamValue('umwfakt')) {
			//globale Variabeln setzen
			setzeWindowUmwfakt(uri.getQueryParamValue('umwfakt'));
			//markieren, dass nach dem loaded-event im Tree die umwfakt angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.umwfakt_zeigen = true;
			//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			initiiere_umwfakt();
		} else if (uri.getQueryParamValue('assozarten')) {
			//globale Variabeln setzen
			setzeWindowAssozarten(uri.getQueryParamValue('assozarten'));
			//markieren, dass nach dem loaded-event im Tree die assozarten angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.assozarten_zeigen = true;
			//NICHT direkt initiieren, weil sonst die Artliste noch nicht existiert
		} else if (uri.getQueryParamValue('beob_nicht_beurteilt')) {
			//markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.beob_nicht_beurteilt_zeigen = true;
		} else if (uri.getQueryParamValue('beob_nicht_zuzuordnen')) {
			//markieren, dass nach dem loaded-event im Tree die beob angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.beob_nicht_zuzuordnen_zeigen = true;
		} else {
			//muss ap sein
			//markieren, dass nach dem loaded-event im Tree die Pop angezeigt werden soll 
			//Die Markierung wird im load-Event wieder entfernt
			window.ap_zeigen = true;
			//direkt initiieren, nicht erst, wenn baum fertig aufgebaut ist
			localStorage.ap_id = ap_id;
			initiiere_ap();
		}
		erstelle_tree(ap_id);
		$("#ap_waehlen_label").hide();
	} else {
		var exporte = uri.getQueryParamValue('exporte');
		if (exporte) {
			initiiere_exporte(anchor);
		}
	}
}

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
	var ua = navigator.userAgent;
	var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(ua) != null)
	  rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

function onfeatureselect_detailplaene_shp(feature) {
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
	window.api.map.addPopup(popup);
}

function onfeatureunselect_detailplaene_shp(feature) {
	window.api.map.removePopup(feature.popup);
	//feature.popup.destroy();
    //feature.popup = null;
}

function initiiereGeoAdminKarte() {
	//Proxy Host for Ajax Requests to overcome Cross-Domain HTTTP Requests
	//OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";
	//var zh_bbox_1903 = new OpenLayers.Bounds(669000, 222000, 717000, 284000);

	//Zunächst alle Layer definieren
	var zh_ortho = new OpenLayers.Layer.WMS("ZH Luftbild", "http://agabriel:4zC6MgjM@wms.zh.ch/OrthoZHWMS", {
		layers: 'orthophotos',
		isBaseLayer: true
	}, {
		visibility: true,
		singleTile: true
	});
	var zh_ortho_2 = new OpenLayers.Layer.WMS("ZH Luftbild", "http://maps.zh.ch/wms/OrthoBackgroundZH", {
		layers: 'orthoaktuell',
		isBaseLayer: true
	}, {
		visibility: true,
		singleTile: true
	});
	var zh_hoehenmodell = new OpenLayers.Layer.WMS("ZH Höhenmodell", "http://maps.zh.ch/wms/DTMBackgroundZH", {
		layers: 'dtm',
		isBaseLayer: true
	}, {
		visibility: false,
		singleTile: true
	});
	var zh_lk_sw = new OpenLayers.Layer.WMS("Landeskarten sw", "http://agabriel:4zC6MgjM@wms.zh.ch/RasterWMS", {
		layers: 'up24,up8,lk25,lk50,lk100,lk200,lk500',
		transparent: true,
		isBaseLayer: false
	}, {
		singleTile: true,
		visibility: true
	});
	var zh_lk_sw_2 = new OpenLayers.Layer.WMS("Landeskarten überlagernd", "http://maps.zh.ch/wms/BASISKARTEZH", {
		layers: 'lk500,lk200,lk100,lk50,lk25,up8,up24',
		transparent: true,
		isBaseLayer: false
	}, {
		singleTile: true,
		visibility: true
	});
	var zh_lk = new OpenLayers.Layer.WMS("Landeskarten ohne Luftbild", "http://maps.zh.ch/wms/BASISKARTEZH", {
		layers: 'wald,seen,lk500,lk200,lk100,lk50,lk25,up8,up24',
		transparent: false,
		isBaseLayer: false
	}, {
		singleTile: true,
		visibility: false
	});
	var zh_grenzen = new OpenLayers.Layer.WMS("Gemeinden ZH", "http://maps.zh.ch/wms/BASISKARTEZH", {
		layers: 'grenzen,gemeindegrenzen',
		transparent: true,
		isBaseLayer: false
	}, {
		singleTile: true,
		visibility: false
	});
	/*var zh_uep = new OpenLayers.Layer.WMS("Übersichtsplan Kt. Zürich", "http://wms.zh.ch/upwms", {
		layers: 'upwms',
		transparent: true,
		isBaseLayer: false
	}, {
		visibility: true,
		singleTile: true,
		minScale: 22000,
		maxScale: 1
	});*/
	var zh_av = new OpenLayers.Layer.WMS("ZH Parzellen", "http://wms.zh.ch/avwms", {
		layers: 'Liegenschaften',
		transparent: true
	}, {
		visibility: false,
		singleTile: true
		//maxScale: 5000
	});
	var zh_avnr = new OpenLayers.Layer.WMS("ZH Parzellen-Nummern", "http://wms.zh.ch/avwms", {
		layers: 'OSNR',
		transparent: true
	}, {
		visibility: false,
		singleTile: true
	});
	var zh_svo = new OpenLayers.Layer.WMS("ZH SVO farbig", "http://wms.zh.ch/FnsSVOZHWMS", {
		layers: 'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr',
		transparent: true
	}, {
		singleTile: true,
		opacity: 0.7,
		visibility: false
	});
	var zh_svo_raster = new OpenLayers.Layer.WMS("ZH SVO Raster", "http://wms.zh.ch/FnsSVOZHWMS", {
		layers: 'zonen-schutzverordnungen-raster,ueberlagernde-schutzzonen,schutzverordnungsobjekte,svo-zonen-labels,schutzverordnungsobjekt-nr',
		transparent: true
	}, {
		singleTile: true,
		visibility: false
	});
	//Verträge als WFS hinzufügen
	var zh_vertraege = new OpenLayers.Layer.Vector("ZH Verträge", {
	    strategies: [new OpenLayers.Strategy.BBOX()],
	    protocol: new OpenLayers.Protocol.WFS.v1_1_0({
	        url:  "http://agabriel:4zC6MgjM@maps.zh.ch/wfs/FnsVertraegeWFS",
	        featureType: "vertraege_f",
	        featureNs: "http://www.opengis.net/gml"
	        //featureNs: "http://www.intergraph.com/geomedia/gml"
	    })
	});
	var zh_waldgesellschaften = new OpenLayers.Layer.WMS("ZH Waldgesellschaften", "http://agabriel:4zC6MgjM@wms.zh.ch/WaldVKoverlayZH", {
		layers: 'waldgesellschaften,beschriftung-einheit-nach-ek72',
		transparent: true
	}, {
		singleTile: true,
		visibility: false
	});
	var zh_liwa = new OpenLayers.Layer.WMS("ZH Lichte Wälder", "http://maps.zh.ch/wms/FnsLWZH", {
		layers: 'objekte-lichte-waelder-kanton-zuerich',
		transparent: true
	}, {
		singleTile: true,
		visibility: false
	});

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

	var ch_lk1000 = new OpenLayers.Layer.WMS("Landeskarte 1:1'000'000", "http://wms.geo.admin.ch?", {
		layers: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
		srs: 'EPSG:21781',
		'format': 'png'
	}, {
		singleTile: true,
		visibility: false
	});
	var ch_ktgrenzen = new OpenLayers.Layer.WMS("Kantone", "http://wms.geo.admin.ch?", {
		layers: 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill',
		srs: 'EPSG:21781',
		'format': 'png'
	}, {
		singleTile: true,
		visibility: false
	});

	//allfällige Marker-Ebenen entfernen
	entferneTPopMarkerEbenen();
	entfernePopMarkerEbenen();
	
	//api nur definieren, wenn dies nicht schon passiert ist
	if (typeof window.api == "undefined") {
		window.api = new GeoAdmin.API();
	}

	//Karte nur aufbauen, wenn dies nicht schon passiert ist
	if (!window.api.map) {
		window.api.createMap({
			div: "ga_karten_div",
			easting: 693000,
			northing: 253000,
			zoom: 4
		});

		/*window.api.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
		var baseLayerTool = new GeoAdmin.BaseLayerTool({
			renderTo: "baselayertool3",
			map: map3
		});*/

		//The complementary layer is per default the color pixelmap.
		window.api.map.switchComplementaryLayer("voidLayer", {opacity: 0});
		window.api.setBgLayer('voidLayer', {opacity: 0});	//wichtig, weil sonst Daten von GeoAdmin geladen werden
		//Layer für detailpläne aufbauen
		//aber nur beim ersten mal
		if (!window.detailplaene_shp) {
			//erst daten auslesen
			var detailplaene_shapefile = new Shapefile({
				shp: "shp/detailplaene.shp",
				dbf: "shp/detailplaene.dbf"
			}, function (data) {
				//vektorlayer schaffen
				window.detailplaene_shp = new OpenLayers.Layer.Vector("Detailpläne", {
					styleMap: detailplaene_stylemap,
					eventListeners: {
						"featureselected": function(evt) {
							console.log("feature selected");
							onfeatureselect_detailplaene_shp(evt.feature);
						},
						"featureunselected": function(evt) {
							onfeatureunselect_detailplaene_shp(evt.feature);
						}
					}
				});
				//Informationen in GeoJSON bereitstellen
				var parser = new OpenLayers.Format.GeoJSON();
				var detailplaene_popup_features = parser.read(data.geojson);
				window.detailplaene_shp.addFeatures(detailplaene_popup_features);
				//Layer hinzufügen
				window.api.map.addLayers([window.detailplaene_shp]);
				//select feature controll für detailpläne schaffen
				var detailplaene_selector = new OpenLayers.Control.SelectFeature(window.detailplaene_shp, {
					clickout: true
				});
				window.api.map.addControl(detailplaene_selector);
				detailplaene_selector.activate();
			});
		}
		
		//window.api.map.addLayers([ch_lk1000]);
		//window.api.map.addLayers([zh_ortho, zh_hoehenmodell, zh_lk_sw, zh_lk]);


		/*window.api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe-pk25.noscale', {
			visibility: false
		});*/
		/*window.api.map.addLayerByName('ch.swisstopo.pixelkarte-farbe', {
			visibility: true,
			opacity: 1.0
		});*/
		window.api.map.addLayerByName('ch.swisstopo-vd.geometa-gemeinde', {visibility: false});
		window.api.map.addLayers([zh_grenzen]);
		/*window.api.map.addLayerByName('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill', {
			visibility: false
		});*/
		window.api.map.addLayers([zh_av, zh_avnr, zh_svo, zh_svo_raster, zh_waldgesellschaften, zh_liwa]);
		
		/*window.api.map.addLayerByName('ch.bafu.bundesinventare-trockenwiesen_trockenweiden', {
			visibility: false,
			opacity: 0.7
		});
		window.api.map.addLayerByName('ch.bafu.bundesinventare-flachmoore', {
			visibility: false,
			opacity: 0.7
		});
		window.api.map.addLayerByName('ch.bafu.bundesinventare-hochmoore', {
			visibility: false,
			opacity: 0.7
		});
		window.api.map.addLayerByName('ch.bafu.bundesinventare-auen', {
			visibility: false,
			opacity: 0.7
		});
		window.api.map.addLayerByName('ch.bafu.bundesinventare-amphibien', {
			visibility: false,
			opacity: 0.7
		});*/

		window.api.map.addControl(new OpenLayers.Control.MousePosition({numDigits: 0, separator: ' / '}));
		window.api.map.addControl(new OpenLayers.Control.KeyboardDefaults());

		//messen
		// style the sketch fancy
		var sketchSymbolizers = {
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
		};

		var style = new OpenLayers.Style();
		style.addRules([
			new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);
		var styleMap = new OpenLayers.StyleMap({"default": style});

		measureControls = {
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
				"measure": handleMeasurements,
				"measurepartial": handleMeasurements
			});
			window.api.map.addControl(controlMessung);
		}

		//layertree aufbauen
		window.layertree = window.api.createLayerTree({
			renderTo: "layertree",
			width: 285
		});

		//layertree minimieren
		$(".x-panel-bwrap").css('display', 'none');

		//verständlich beschreiben
		$(".x-panel-header-text").text("Ebenen");

		//ganze Titelzeile: mit Klick vergrössern bzw. verkleinern
		$("#layertree").on("click", "#toggleLayertree, .x-panel-header", function() {
			oeffneSchliesseLayertree();
		});
	}
	
	$('#karteSchieben').checked = true;	//scheint nicht zu funktionieren?
	korrigiereLayernamenImLayertree();
};

function waehleMitPolygon() {
	//den vorbereiteten drawControl aktivieren
	window.drawControl.activate();
	//allfällige Messung deaktivieren
	measureControls['line'].deactivate();
	measureControls['polygon'].deactivate();
	//allfällige bisherige Auswahl entfernen
	window.auswahlPolygonLayer.removeAllFeatures();
	//allfälliges Ergebnisfenster ausblenden
	$("#ergebnisAuswahl").css("display", "none");
	delete window.tpop_id_array;
	delete window.tpop_id_liste;
}

function korrigiereLayernamenImLayertree() {
	//im layertree gewissen Namen anders schreiben
	$(".x-panel-body .x-tree-node .x-tree-node-anchor span").each(function() {
		switch ($(this).text()) {
			case "Amphibien Ortsfeste Objekte":
				$(this).text("CH Amphibien ortsfest");
				break;
			case "Auengebiete":
				$(this).text("CH Auengebiete");
				break;
			case "Hochmoore":
				$(this).text("CH Hochmoore");
				break;
			case "Flachmoore":
				$(this).text("CH Flachmoore");
				break;
			case "Trockenwiesen und -weiden (TWW)":
				$(this).text("CH Trockenwiesen (TWW)");
				break;
			case "Kantonsgrenzen":
				$(this).text("Kantone");
				break;
			case "Gemeindeinformationen":
				$(this).text("CH Gemeinden");
				break;
		}
	});
}

function schliesseLayeroptionen() {
	$(".x-panel-body .x-tree-node").each(function() {
		if ($(".x-tree-node-anchor span", this).text() !== "ZH Luftbild") {
			$(".gx-tree-layer-action.close", this).each(function() {
				$(this).css("visibility", "hidden");
			});
			$(".gx-tree-layer-action.open", this).each(function() {
				$(this).css("visibility", "visible");
				$(this).css("display", "block");
			});
			$(".x-toolbar.x-small-editor.geoadmin-toolbar.x-toolbar-layout-ct", this).each(function() {
				$(this).addClass("x-hide-display");
			});
		}
	});
}

function oeffneSchliesseLayertree() {
	//ein hübscher Übergang wäre nett
	if ($(".x-panel-bwrap").css('display') !== 'none') {
		$(".x-panel-bwrap").css('display', 'none');
		$("#layertree .x-panel-header").css('border-bottom-right-radius', '6px');
		$("#layertree .x-panel-header").css('border-bottom-left-radius', '6px');
	} else {
		$(".x-panel-bwrap").css('display', 'inline');
		$("#layertree .x-panel-header").css('border-bottom-right-radius', 0);
		$("#layertree .x-panel-header").css('border-bottom-left-radius', 0);
	}
}

function handleMeasurements(event) {
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
}

function messe(element) {
	for(key in measureControls) {
		var controlMessung = measureControls[key];
		if(element.value == key && element.checked) {
			controlMessung.activate();
		} else {
			controlMessung.deactivate();
			$("#ergebnisMessung").text("");
		}
	}
	//einen allfällig aktiven drawControl deaktivieren
	deaktiviereGeoAdminAuswahl();
	//und allfällig verbliebene Auswahlpolygon entfernen
	window.auswahlPolygonLayer.removeAllFeatures();
}

function erstelleGemeindeliste() {
	if (!window.Gemeinden) {
		$.ajax({
			url: 'php/gemeinden.php',
			dataType: 'json',
			success: function (data) {
				if (data) {
					//Gemeinden bereitstellen
					//Feld mit Daten beliefern
					var Gemeinden;
					Gemeinden = [];
					//for (i in data.rows) {
					for (var i = 0; i < data.rows.length; i++) {
						if (data.rows[i].GmdName) {
							Gemeinden.push(data.rows[i].GmdName);
						}
					}
					window.Gemeinden = Gemeinden;
					//autocomplete-widget für Gemeinden initiieren
					$("#TPopGemeinde").autocomplete({
						source: Gemeinden,
						delay: 0,
						//Change-Event wird nicht ausgelöst > hier aufrufen
						change: function(event, ui) {
							speichern(event.target);
						}
					});
				}
			}
		});
	}
}

function waehleAp(ap_id) {
	if (ap_id) {
		//einen AP gewählt
		$("#ap_waehlen_label").hide();
		localStorage.ap_id = ap_id;
		if ($("[name='programm_wahl']:checked").attr("id") === "programm_neu") {
			//zuerst einen neuen Datensatz anlegen
			$.ajax({
				url: 'php/ap_insert.php',
				dataType: 'json',
				data: {
					"id": localStorage.ap_id,
					"user": sessionStorage.User
				},
				success: function () {
					$.when(waehle_ap_liste("programm_alle"))
						.then(function() {
							$.when(erstelle_tree(localStorage.ap_id))
								.then(function() {
									$('#ap_waehlen').val(localStorage.ap_id);
									$('#ap_waehlen option[value =' + localStorage.ap_id + ']').attr('selected', true);
									$("#ApArtId").val(localStorage.ap_id);
									initiiere_ap();
								});
					});
				},
				error: function (data) {
					var Meldung;
					Meldung = JSON.stringify(data);
					$("#Meldung").html(data.responseText);
					$( "#Meldung" ).dialog({
						modal: true,
						buttons: {
							Ok: function() {
								$( this ).dialog( "close" );
							}
						}
					});
				}
			});
		} else {
			erstelle_tree(ap_id);
			$("#ap").show();
			initiiere_ap();
		}
	} else {
		//leeren Wert gewählt
		$("#ap_waehlen_label").html("Artförderprogramm wählen:").show();
		$("#tree").hide();
		$("#suchen").hide();
		$("#hilfe").hide();
		$("#ap_loeschen").hide();
		$("#ap").hide();
		zeigeFormular();
		history.replaceState({ap: "ap"}, "ap", "index.html");
	}
}

function kopiereKoordinatenInPop(TPopXKoord, TPopYKoord) {
	//prüfen, ob X- und Y-Koordinaten vergeben sind
	if (TPopXKoord > 100000 && TPopYKoord > 100000) {
		//Koordinaten der Pop nachführen
		$.ajax({
			url: 'php/pop_update.php',
			dataType: 'json',
			data: {
				"id": localStorage.pop_id,
				"Feld": "PopXKoord",
				"Wert": TPopXKoord,
				"user": sessionStorage.User
			},
			success: function () {
				$.ajax({
					url: 'php/pop_update.php',
					dataType: 'json',
					data: {
						"id": localStorage.pop_id,
						"Feld": "PopYKoord",
						"Wert": TPopYKoord,
						"user": sessionStorage.User
					},
					success: function () {
						$("#kopiereKoordinatenInPopRueckmeldung").fadeIn('slow');
						setTimeout(function() {
							$("#kopiereKoordinatenInPopRueckmeldung").fadeOut('slow');
						}, 3000);
					},
					error: function (data) {
						var Meldung;
						Meldung = JSON.stringify(data);
						$("#Meldung").html(data.responseText);
						$("#Meldung").dialog({
							modal: true,
							buttons: {
								Ok: function() {
									$(this).dialog("close");
								}
							}
						});
					}
				});
			},
			error: function (data) {
				var Meldung;
				Meldung = JSON.stringify(data);
				$("#Meldung").html(data.responseText);
				$("#Meldung").dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			}
		});
	} else {
		//auffordern, die Koordinaten zu vergeben und Speichern abbrechen
		$("#Meldung").html("Sie müssen zuerst Koordinaten erfassen");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
	}
}

function pruefe_anmeldung() {
	//Leserechte zurücksetzen
	delete sessionStorage.NurLesen;
	if ($("#anmeldung_name").val() && $("#anmeldung_passwort").val()) {
		$.ajax({
			url: 'php/anmeldung.php',
			dataType: 'json',
			data: {
				"Name": $("#anmeldung_name").val(),
				"pwd": $("#anmeldung_passwort").val()
			},
			success: function (data) {
				if (data && data.anzUser > 0) {
					sessionStorage.User = $("#anmeldung_name").val();
					//wenn NurLesen, globale Variable setzen
					if (data.NurLesen && data.NurLesen === -1) {
						sessionStorage.NurLesen = true;
					}
					$("#anmeldung_rueckmeldung").html("Willkommen " + $("#anmeldung_name").val()).addClass("ui-state-highlight");
					setTimeout(function() {
						$("#anmelde_dialog").dialog("close", 2000);
					}, 1000);
				} else {
					alert("Anmeldung gescheitert");
					$("#anmeldung_rueckmeldung").html("Anmeldung gescheitert").addClass("ui-state-highlight");
					setTimeout(function() {
						$("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
					}, 500);
				}
			},
			error: function () {
				$("#Meldung").html("Anmeldung gescheitert");
				$( "#Meldung" ).dialog({
					modal: true,
					buttons: {
						Ok: function() {
						}
					}
				});
			}
		});
	} else {
		$("#anmeldung_rueckmeldung").html("Bitte Name und Passwort ausfüllen").addClass( "ui-state-highlight" );
		setTimeout(function() {
			$("#anmeldung_rueckmeldung").removeClass("ui-state-highlight", 1500);
		}, 500);
	}
}

//erwartet aktuelle Werte für jahr und typ
//erstellt den label für den Baum
function erstelleLabelFuerFeldkontrolle(jahr, typ) {
	if (typeof jahr === "undefined") {
		jahr = "(kein Jahr)";
	}
	if (typeof typ === "undefined") {
		typ = "(kein Typ)";
	}
	return jahr + ": " + typ;
}

//erwartet aktuelle Werte für jahr und beurteilung
//erstellt den label für den Baum
function erstelleLabelFuerMassnahme(jahr, beurteilung) {
	if (typeof jahr === "undefined") {
		jahr = "(kein Jahr)";
	}
	if (typeof beurteilung === "undefined") {
		beurteilung = "(keine Beurteilung)";
	}
	return jahr + ": " + beurteilung;
}

function erstelleUnterordnerFuerTPop(TPopNode) {
	jQuery.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Massnahmen",
		"attr": {
			"id": localStorage.tpop_id,
			"typ": "tpop_ordner_massn"
		}
	});
	jQuery.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Massnahmen-Berichte",
		"attr": {
			"id": localStorage.tpop_id,
			"typ": "tpop_ordner_massnber"
		}
	});
	jQuery.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Feldkontrollen",
		"attr": {
			"id": localStorage.tpop_id,
			"typ": "tpop_ordner_feldkontr"
		}
	});
	jQuery.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Freiwilligen-Kontrollen",
		"attr": {
			"id": localStorage.tpop_id,
			"typ": "tpop_ordner_freiwkontr"
		}
	});
	jQuery.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Teilpopulations-Berichte",
		"attr": {
			"id": localStorage.tpop_id,
			"typ": "tpop_ordner_tpopber"
		}
	});
	jQuery.jstree._reference(TPopNode).create_node(TPopNode, "last", {
		"data": "Beobachtungen",
		"attr": {
			"id": localStorage.tpop_id,
			"typ": "tpop_ordner_beob_zugeordnet"
		}
	});
}

//gibt HTML zurück, mit dem die Informationen über eine Beobachtung dargestellt werden
//erwartet die Daten der Beobachtung
function erstelleFelderFuerBeob(data, beobtyp) {
	//Titel für Beob im Formular erstellen
	var beobtitel = "<h1>Informationen aus ";
	if (beobtyp === "infospezies") {
		beobtitel += "Info Spezies";
	} else {
		beobtitel += "EvAB";
	}
	beobtitel += " (nicht veränderbar)</h1>";
	//Beob-Felder dynamisch aufbauen
	var html_beobfelder = "<table>";
	var html_beobfeld;
	var nichtAnzuzeigendeFelder = ["NO_ISFS", "ESPECE", "CUSTOM_TEXT_5_", "OBJECTID", "FNS_GISLAYER", "FNS_ISFS", "ID", "FNS_JAHR", "NOM_COMPLET", "FAMILLE"];
	$.each(data, function(index, value) {
		if ((value || value === 0) && nichtAnzuzeigendeFelder.indexOf(index) === -1) {
			//TODO: Zahlen, text und Memofelder unterscheiden
			//TODO: Felder durch externe Funktion erstellen lassen
			//ID: beobfelder_ voranstellen, um Namens-Kollisionen zu vermeiden
			html_beobfeld = "";
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
}

//in DOM-Objekten sind viele ID's der Name des DOM-Elements vorangestellt, damit die ID eindeutig ist
//ACHTUNG auf die Reihenfolge der Ersatzbefehle. Sonst wird z.B. in 'tpopber' 'popber' ersetzt und es bleibt 't'
function erstelleIdAusDomAttributId(domAttributId) {
	var returnWert = domAttributId.replace('ap_ordner_pop', '').replace('ap_ordner_apziel', '').replace('ap_ordner_erfkrit', '').replace('ap_ordner_jber', '').replace('ap_ordner_ber', '').replace('ap_ordner_beob_nicht_beurteilt', '').replace('ap_ordner_beob_nicht_zuzuordnen', '').replace('umwfakt', '').replace('ap_ordner_assozarten', '').replace('tpop_ordner_massnber', '').replace('tpop_ordner_massn', '').replace('tpopmassnber', '').replace('pop_ordner_massnber', '').replace('popmassnber', '').replace('tpop_ordner_feldkontr', '').replace('tpop_ordner_freiwkontr', '').replace('tpop_ordner_tpopber', '').replace('tpopber', '').replace('pop_ordner_popber', '').replace('popber', '').replace('tpop_ordner_beob_zugeordnet', '').replace('beob', '').replace('ber', '');
	if (domAttributId == returnWert && parseInt(returnWert) && parseInt(returnWert) != returnWert) {
		console.log('erstelleIdAusDomAttributId meldet: erhalten ' + domAttributId + ', zurückgegeben: ' + returnWert + '. Die Regel in der function muss wohl angepasst werden');
	}
	return returnWert;
}

function zeigeBeobKoordinatenImGisBrowser() {
	var URL;
	if ($("#beobfelder_FNS_XGIS").val() && $("#beobfelder_FNS_YGIS").val()) {
		URL = "http://www.gis.zh.ch/gb/gb.asp?YKoord=" + $("#beobfelder_FNS_XGIS").val() + "&XKoord=" + $("#beobfelder_FNS_YGIS").val() + "&Massstab=3000+app=GB-SWISSIMAGE+rn=5$7";
		window.open(URL, target = "_blank");
	} else if ($("#beobfelder_COORDONNEE_FED_E").val() && $("#beobfelder_COORDONNEE_FED_N").val()) {
		URL = "http://www.gis.zh.ch/gb/gb.asp?YKoord=" + $("#beobfelder_COORDONNEE_FED_E").val() + "&XKoord=" + $("#beobfelder_COORDONNEE_FED_N").val() + "&Massstab=3000+app=GB-SWISSIMAGE+rn=5$7";
		window.open(URL, target = "_blank");
	} else {
		$("#Meldung").html("Fehler: Keine Koordinaten zum Anzeigen");
		$("#Meldung").dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
				}
			}
		});
	}
}

//retourniert die Beschriftung für TPop auf Karten
//Wenn TPop mit ihrer Nummer beschriftet sein sollen
//tpop_nr und pop_nr wird übernommen
function beschrifteTPopMitNrFuerKarte(pop_nr, tpop_nr) {
	var tpop_beschriftung;
	pop_nr = pop_nr || "?";
	if (tpop_nr) {
		tpop_beschriftung = pop_nr + "/" + tpop_nr;
	} else {
		tpop_beschriftung = pop_nr + "/?";
	}
	return tpop_beschriftung;
}

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

/*411 Zeilen lang
* jQuery File Download Plugin v1.3.3
*
* http://www.johnculviner.com
*
* Copyright (c) 2012 - John Culviner
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

var $ = jQuery.noConflict();

$.extend({
	//
    //$.fileDownload('/path/to/url/', options)
    //  see directly below for possible 'options'
    fileDownload: function (fileUrl, options) {

        var defaultFailCallback = function (responseHtml, url) {
            alert("A file download error has occurred, please try again.");
        };

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
            //the stock android browser straight up doesn't support file downloads initiated by a non GET: http://code.google.com/p/android/issues/detail?id=1780
            //specify a message here to display if a user tries with an android browser
            //if jQuery UI is installed this will be a dialog, otherwise it will be an alert
            //
            androidPostUnsupportedMessageHtml: "Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.",

            //
            //Requires jQuery UI: options to pass into jQuery UI Dialog
            //
            dialogOptions: { modal: true },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  url - the original url attempted
            //
            successCallback: function (url) { },

            //
            //a function to call after a file download dialog/ribbon has appeared
            //Args:
            //  responseHtml    - the html that came back in response to the file download. this won't necessarily come back depending on the browser.
            //                      in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
            //                      server's error message with a "helpful" IE built in message
            //  url             - the original url attempted
            //
            failCallback: defaultFailCallback,

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


        //Setup mobile browser detection: Partial credit: http://detectmobilebrowser.com/
        var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

        var isIos = false;                  //has full support of features in iOS 4.0+, uses a new window to accomplish this.
        var isAndroid = false;              //has full support of GET features in 4.0+ by using a new window. POST will resort to a POST on the current window.
        var isOtherMobileBrowser = false;   //there is no way to reliably guess here so all other mobile devices will GET and POST to the current window.

        if (/ip(ad|hone|od)/.test(userAgent)) {

            isIos = true;

        } else if (userAgent.indexOf('android') != -1) {

            isAndroid = true;

        } else {

            isOtherMobileBrowser = /avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|playbook|silk|iemobile|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

        }

        var httpMethodUpper = settings.httpMethod.toUpperCase();

        if (isAndroid && httpMethodUpper != "GET") {
            //the stock android browser straight up doesn't support file downloads initiated by non GET requests: http://code.google.com/p/android/issues/detail?id=1780

            if ($().dialog) {
                $("<div>").html(settings.androidPostUnsupportedMessageHtml).dialog(settings.dialogOptions);
            } else {
                alert(settings.androidPostUnsupportedMessageHtml);
            }

            return;
        }

        //wire up a jquery dialog to display the preparing message if specified
        var $preparingDialog = null;
        if (settings.preparingMessageHtml) {

            $preparingDialog = $("<div>").html(settings.preparingMessageHtml).dialog(settings.dialogOptions);

        }

        var internalCallbacks = {

            onSuccess: function (url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                };

                settings.successCallback(url);

            },

            onFail: function (responseHtml, url) {

                //remove the perparing message if it was specified
                if ($preparingDialog) {
                    $preparingDialog.dialog('close');
                };

                //wire up a jquery dialog to display the fail message if specified
                if (settings.failMessageHtml) {

                    $("<div>").html(settings.failMessageHtml).dialog(settings.dialogOptions);

                    //only run the fallcallback if the developer specified something different than default
                    //otherwise we would see two messages about how the file download failed
                    if (settings.failCallback != defaultFailCallback) {
                        settings.failCallback(responseHtml, url);
                    }

                } else {

                    settings.failCallback(responseHtml, url);
                }
            }
        };


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

                if (qsStart != -1) {
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
                    .attr("src", fileUrl)
                    .appendTo("body");
            }

        } else {

            var formInnerHtml = "";

            if (settings.data !== null) {

                $.each(settings.data.replace(/\+/g, ' ').split("&"), function () {

                    var kvp = this.split("=");

                    var key = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[0])) : decodeURIComponent(kvp[0]);
                    if (!key) return;
                    var value = kvp[1] || '';
                    value = settings.encodeHTMLEntities ? htmlSpecialCharsEntityEncode(decodeURIComponent(kvp[1])) : decodeURIComponent(kvp[1]);

                    formInnerHtml += '<input type="hidden" name="' + key + '" value="' + value + '">';
                });
            }

            if (isOtherMobileBrowser) {

                $form = $("<form>").appendTo("body");
                $form.hide()
                    .attr('method', settings.httpMethod)
                    .attr('action', fileUrl)
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
                var date = new Date(1000);
                document.cookie = settings.cookieName + "=; expires=" + date.toUTCString() + "; path=" + settings.cookiePath;

                cleanUp(false);

                return;
            }

            //has an error occured?
            //if neither containers exist below then the file download is occuring on the current window
            if (downloadWindow || $iframe) {

                //has an error occured?
                try {

                    var formDoc;
                    if (downloadWindow) {
                        formDoc = downloadWindow.document;
                    } else {
                        formDoc = getiframeDocument($iframe);
                    }

                    if (formDoc && formDoc.body != null && formDoc.body.innerHTML.length > 0) {

                        var isFailure = true;

                        if ($form && $form.length > 0) {
                            var $contents = $(formDoc.body).contents().first();

                            if ($contents.length > 0 && $contents[0] === $form[0]) {
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
                        if (isFailure) {
                            downloadWindow.focus(); //ios safari bug doesn't allow a window to be closed unless it is focused
                            downloadWindow.close();
                        } else {
                            downloadWindow.focus();
                        }
                    }
                }

            }, 0);
        }

        function htmlSpecialCharsEntityEncode(str) {
            return str.replace(/&/gm, '&amp;')
                .replace(/\n/gm, "&#10;")
                .replace(/\r/gm, "&#13;")
                .replace(/</gm, '&lt;')
                .replace(/>/gm, '&gt;')
                .replace(/"/gm, '&quot;')
                .replace(/'/gm, '&apos;'); //single quotes just to be safe
        }
    }
});