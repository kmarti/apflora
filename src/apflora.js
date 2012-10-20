function initiiere_index() {
	$("#suchen").hide();
	$("#undelete_div").hide();
	$("#hilfe").hide();
	//alle Formulare verstecken
	zeigeFormular();
	$("#loeschen_dialog").hide();
	//jQuery ui buttons initiieren
	$("#programm_wahl").buttonset();
	$("button").button();
	$("#tpopfeldkontr_tabs").tabs({
		show: function(event, ui) {
			setzeSpaltenbreiten();
		}
	});
	//Gemeindeliste erstellen, wenn nötig
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
					for (i in data.rows) {
						if (typeof i !== "undefined" && data.rows[i].GmdName) {
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
	} else {
		//autocomplete-widget für Gemeinden initiieren
		$("#TPopGemeinde").autocomplete({
			source: window.Gemeinden
		});
	}
	//$('[type="number"]').spinner();    ausgeschaltet, da die Optik unschön verändert wird und browsereigene auch sichtbar bleiben
	$("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0 });
	$("#TPopMassnDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopMassnJahr", altFormat: "yy", defaultDate: +0 });
	$("#JBerDatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0 });
	$("#UfErstelldatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0 });
	//Auswahllisten aufbauen
	erstelle_ap_liste("programm_alle");
	$("#ap_loeschen").hide();
	erstelle_ApArtId_liste();
}

function initiiere_ap() {
	if (!localStorage.ap_id) {
		//es fehlen benötigte Daten > zurück zum Anfang
		initiiere_index();
		return;
	}
	//Programm-Wahl konfigurieren
	var programm_wahl;
	programm_wahl = $("[name='programm_wahl']:checked").attr("id");
	//Felder zurücksetzen
	leereFelderVonFormular("ap");
	setzeSpaltenbreiten();
	//Bei Testarten Hinweis anzeigen
	$("#testart_div").hide();
	if ($("#ap_waehlen").val()) {
		if ($("#ap_waehlen").val() <= 150) {
			$("#testart_div").show();
			$("#testart_div").html("Das ist eine Testart - hier kann man alles ausprobieren!");
		}
	}
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
									for (i in data2.rows) {
										if (typeof i !== "undefined") {
											html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
										}
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
					setzeSpaltenbreiten();
					$("#ap_loeschen").show();
				}
			}
		});
	} else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
		$("#ApArtId").val($("#ap_waehlen").val());
		//Formulare blenden
		zeigeFormular("ap");
		$("#ap_loeschen").show();
	}
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
				for (i in data.rows) {
					if (typeof i !== "undefined") {
						html += "<option value=\"" + data.rows[i].id + "\">" + data.rows[i].Artname + "</option>";
					}
				}
				window.artliste_html = html;
				$("#ApArtId").html(html);
				$("#AaSisfNr").html(html);
			}
		});
	} else {
		$("#ApArtId").html(window.artliste_html);
		$("#AaSisfNr").html(window.artliste_html);
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
	setzeSpaltenbreiten();
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
				$("#PopName").val(data.PopName);
				$("#PopNr").val(data.PopNr);
				$("#PopBekanntSeit").val(data.PopBekanntSeit);
				$("#PopXKoord").val(data.PopXKoord);
				$("#PopYKoord").val(data.PopYKoord);
				//Formulare blenden
				zeigeFormular("pop");
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#PopName").val()) {
					$("#PopNr").focus();
				}
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
	//Felder zurücksetzen
	leereFelderVonFormular("apziel");
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ZielJahr").val()) {
					$("#ZielJahr").focus();
				}
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ZielBerJahr").val()) {
					$("#ZielBerJahr").focus();
				}
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
	setzeSpaltenbreiten();
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
				$("#ErfBeurtZielSkalaErreichungsgrad" + data.ErfBeurtZielSkalaErreichungsgrad).prop("checked", true);
				$("#ErfBeurtZielSkalaTxt").val(data.ErfBeurtZielSkalaTxt);
				//Formulare blenden
				zeigeFormular("erfkrit");
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ErfBeurtZielSkalaErreichungsgrad").val()) {
					$("#ErfBeurtZielSkalaErreichungsgrad").focus();
				}
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
	setzeSpaltenbreiten();
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
								for (i in data2.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
									}
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#JBerJahr").val()) {
					$("#JBerJahr").focus();
				}
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#JbuJahr").val()) {
					$("#JbuJahr").focus();
				}
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
	setzeSpaltenbreiten();
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
				$("#BerURL").val(data.BerURL);
				//die Daten enthalten # an Anfang und Ende (Access-Macke)
				tempUrl = data.BerURL;
				if (data.BerURL && data.BerURL.slice(0, 1) === "#") {
					tempUrl = data.BerURL.slice(1, (data.BerURL.length -1));
				}
				$('#BerURLHref').attr('onClick', "window.open('" + tempUrl + "', target='_blank')");
				//Formulare blenden
				zeigeFormular("ber");
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function () {
					if (!$("#BerAutor").val()) {
						$("#BerAutor").focus();
					}
				}, 100);
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#UfErstelldatum").val()) {
					//$("#UfErstelldatum").focus();
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
						$("#Meldung").html("Fehler: Keine Umweltfaktoren erstellt");
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

function initiiere_ib() {
	if (!localStorage.ib_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("ib");
	setzeSpaltenbreiten();
	//Daten für die ib aus der DB holen
	$.ajax({
		url: 'php/ib.php',
		dataType: 'json',
		data: {
			"id": localStorage.ib_id
		},
		success: function (data) {
			var tempUrl;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.ib = data;
				//Felder mit Daten beliefern
				$("#IbName").val(data.IbName);
				//IbVegTyp: Daten holen - oder vorhandene nutzen
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
								for (i in data4.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data4.rows[i].id + "\">" + data4.rows[i].Einheit + "</option>";
									}
								}
								window.lrdelarze_html = html;
								$("#IbVegTyp").html(html);
								$("#IbVegTyp").val(data.IbVegTyp);
							}
						}
					});
				} else {
					$("#IbVegTyp").html(window.lrdelarze_html);
					$("#IbVegTyp").val(data.IbVegTyp);
				}
				$("#IbBewPflege").val(data.IbBewPflege);
				$("#IbBemerkungen").val(data.IbBemerkungen);
				//Formulare blenden
				zeigeFormular("ib");
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function () {
					if (!$("#IbName").val()) {
						$("#IbName").focus();
					}
				}, 100);
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function () {
					if (!$("#AaSisfNr").val()) {
						$("#AaSisfNr").focus();
					}
				}, 100);
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#PopMassnBerJahr').focus();
				}, 100);
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
	setzeSpaltenbreiten();
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
				$("#TPopNr").val(data.TPopNr);
				$("#TPopHerkunft" + data.TPopHerkunft).prop("checked", true);
				if (data.TPopHerkunftUnklar == 1) {
					$("#TPopHerkunftUnklar").prop("checked", true);
				} else {
					$("#TPopHerkunftUnklar").prop("checked", false);
				}
				$("#TPopHerkunftUnklarBegruendung").val(data.TPopHerkunftUnklarBegruendung);
				$("#TPopApBerichtRelevant" + data.TPopApBerichtRelevant).prop("checked", true);
				$("#TPopBekanntSeit").val(data.TPopBekanntSeit);
				$("#TPopGemeinde").val(data.TPopGemeinde);
				$("#TPopXKoord").val(data.TPopXKoord);
				$("#TPopYKoord").val(data.TPopYKoord);
				if (data.TPopPop == 1) {
					$("#TPopPop").prop("checked", true);
				} else {
					$("#TPopPop").prop("checked", false);
				}
				$("#TPopRadius").val(data.TPopRadius);
				$("#TPopHoehe").val(data.TPopHoehe);
				$("#TPopExposition").val(data.TPopExposition);
				$("#TPopKlima").val(data.TPopKlima);
				$("#TPopNeigung").val(data.TPopNeigung);
				$("#TPopBeschr").val(data.TPopBeschr);
				$("#TPopKatNr").val(data.TPopKatNr);
				$("#TPopEigen").val(data.TPopEigen);
				$("#TPopKontakt").val(data.TPopKontakt);
				$("#TPopNutzungszone").val(data.TPopNutzungszone);
				$("#TPopBewirtschafterIn").val(data.TPopBewirtschafterIn);
				$("#TPopBewirtschaftung").val(data.TPopBewirtschaftung);
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
								for (i in data2.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
									}
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#TPopFlurname").val()) {
					$('#TPopNr').focus();
				}
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#PopBerJahr').focus();
				}, 100);
			}
		}
	});
}

function initiiere_tpopfeldkontr() {
	//wird gemeinsam für Feld- und Freiwilligenkontrollen verwendet
	//Feldkontrollen: Felder der Freiwilligenkontrollen ausblenden
	//Freiwilligenkontrollen: Felde der Feldkontrollen ausblenen plus Register Biotop
	var feldliste_feldkontr, feldliste_freiwkontr;
	if (!localStorage.tpopfeldkontr_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	feldliste_feldkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrTyp', 'TPopKontrJungpfl', 'TPopKontrVitalitaet', 'TPopKontrUeberleb', 'TPopKontrEntwicklung', 'TPopKontrUrsach', 'TPopKontrUrteil', 'TPopKontrAendUms', 'TPopKontrAendKontr', 'TPopKontrGuid', 'TPopKontrFlaeche', 'TPopKontrVegTyp', 'TPopKontrKonkurrenz', 'TPopKontrMoosschicht', 'TPopKontrKrautschicht', 'TPopKontrStrauchschicht', 'TPopKontrBaumschicht', 'TPopKontrBodenTyp', 'TPopKontrBodenKalkgehalt', 'TPopKontrBodenDurchlaessigkeit', 'TPopKontrBodenHumus', 'TPopKontrBodenNaehrstoffgehalt', 'TPopKontrBodenAbtrag', 'TPopKontrWasserhaushalt', 'TPopKontrHandlungsbedarf', 'TPopKontrIdealBiotopUebereinst', 'TPopKontrLeb', 'TPopKontrLebUmg'];
	feldliste_freiwkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrPlan', 'TPopKontrUebFlaeche', 'TPopKontrUebPfl', 'TPopKontrNaBo', 'TPopKontrJungPflJN', 'TPopKontrVegHoeMax', 'TPopKontrVegHoeMit', 'TPopKontrGefaehrdung', 'TPopKontrGuid'];
	//Felder zurücksetzen
	leereFelderVonFormular("tpopfeldkontr");
	setzeSpaltenbreiten();
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
			var Felderarray;
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
								for (i in data2.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
									}
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
								for (i in data3.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data3.rows[i].id + "\">" + data3.rows[i].ZaehleinheitTxt + "</option>";
									}
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
					$("#TPopKontrUeberleb").val(data.TPopKontrUeberleb);
					$("#TPopKontrEntwicklung" + data.TPopKontrEntwicklung).prop("checked", true);
					$("#TPopKontrUrsach").val(data.TPopKontrUrsach);
					$("#TPopKontrUrteil").val(data.TPopKontrUrteil);
					$("#TPopKontrAendUms").val(data.TPopKontrAendUms);
					$("#TPopKontrAendKontr").val(data.TPopKontrAendKontr);
					//Biotop
					$("#TPopKontrFlaeche").val(data.TPopKontrFlaeche);
					$("#TPopKontrVegTyp").val(data.TPopKontrVegTyp);
					$("#TPopKontrKonkurrenz").val(data.TPopKontrKonkurrenz);
					$("#TPopKontrMoosschicht").val(data.TPopKontrMoosschicht);
					$("#TPopKontrKrautschicht").val(data.TPopKontrKrautschicht);
					$("#TPopKontrStrauchschicht").val(data.TPopKontrStrauchschicht);
					$("#TPopKontrBaumschicht").val(data.TPopKontrBaumschicht);
					$("#TPopKontrBodenTyp").val(data.TPopKontrBodenTyp);
					$("#TPopKontrBodenKalkgehalt").val(data.TPopKontrBodenKalkgehalt);
					$("#TPopKontrBodenDurchlaessigkeit").val(data.TPopKontrBodenDurchlaessigkeit);
					$("#TPopKontrBodenHumus").val(data.TPopKontrBodenHumus);
					$("#TPopKontrBodenNaehrstoffgehalt").val(data.TPopKontrBodenNaehrstoffgehalt);
					$("#TPopKontrBodenAbtrag").val(data.TPopKontrBodenAbtrag);
					$("#TPopKontrWasserhaushalt").val(data.TPopKontrWasserhaushalt);
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
									for (i in data4.rows) {
										if (typeof i !== "undefined") {
											html += "<option value=\"" + data4.rows[i].id + "\">" + data4.rows[i].Einheit + "</option>";
										}
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
								for (i in data5.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data5.rows[i].id + "\">" + data5.rows[i].DomainTxt + "</option>";
									}
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
					if (data.TPopKontrJungPflJN == 1) {
						$("#TPopKontrJungPflJN").prop("checked", true);
					} else {
						$("#TPopKontrJungPflJN").prop("checked", false);
					}
					$("#TPopKontrVegHoeMax").val(data.TPopKontrVegHoeMax);
					$("#TPopKontrVegHoeMit").val(data.TPopKontrVegHoeMit);
					$("#TPopKontrGefaehrdung").val(data.TPopKontrGefaehrdung);
				}
				//fieldcontain-divs der benötigten Felder einblenden
				if (localStorage.tpopfreiwkontr) {
					Felderarray = feldliste_freiwkontr;
				} else {
					Felderarray = feldliste_feldkontr;
				}
				for (i in Felderarray) {
					if (typeof i !== "function") {
						$("." + Felderarray[i]).show();
					}
				}
				//Formulare blenden
				zeigeFormular("tpopfeldkontr");
				setzeSpaltenbreiten();
				//Register in Feldkontr blenden
				if (localStorage.tpopfreiwkontr) {
					$("#tpopfeldkontr_tabs_biotop").hide();
					$("#biotop_tab_li").hide();
					$("#tpopfeldkontr_tabs").tabs("select", 0);
				} else {
					$("#tpopfeldkontr_tabs_biotop").show();
					$("#biotop_tab_li").show();
				}
				//Fokus steuern
				$("#TPopKontrJahr").focus();
				$(window).scrollTop(0);
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
	setzeSpaltenbreiten();
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
								for (i in data2.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].MassnTypTxt + "</option>";
									}
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
				$("#TPopMassnJahr").val(data.TPopMassnJahr);
				if (data.TPopKontrDatum !== "01.01.1970") {
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
								for (i in data2.rows) {
									if (typeof i !== "undefined") {
										html += "<option value=\"" + data2.rows[i].id + "\">" + data2.rows[i].AdrName + "</option>";
									}
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
				$("#TPopMassnFlaeche").val(data.TPopMassnFlaeche);
				$("#TPopMassnAnsiedForm").val(data.TPopMassnAnsiedForm);
				$("#TPopMassnAnsiedPflanzanordnung").val(data.TPopMassnAnsiedPflanzanordnung);
				$("#TPopMassnMarkierung").val(data.TPopMassnMarkierung);
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
							for (i in data.rows) {
								if (typeof i !== "undefined") {
									html += "<option value=\"" + data.rows[i].id + "\">" + data.rows[i].Artname + "</option>";
								}
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
				$("#TPopMassnAnsiedDatSamm").val(data.TPopMassnAnsiedDatSamm);
				$("#TPopMassnGuid").val(data.TPopMassnGuid);
				//Formulare blenden
				zeigeFormular("tpopmassn");
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#TPopMassnJahr').focus();
				}, 100);
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();	
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#TPopBerJahr').focus();
				}, 100);
			}
		}
	});
}

function initiiere_tpopbeob() {
	if (!localStorage.tpopbeob_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpopbeob");
	setzeSpaltenbreiten();
	//Daten für die tpopbeob aus der DB holen
	$.ajax({
		url: 'php/beob.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopbeob_id
		},
		success: function (data) {
			var GisBrowserUrl;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopbeob bereitstellen
				window.tpopbeob = data;
				//Felder mit Daten beliefern
				$("#tpopbeob_ArtName").val(data.Name + " " + data.StatusText);
				$("#tpopbeob_IdZdsf").val(data.IdZdsf);
				$("#tpopbeob_IdEvab").val(data.IdEvab);
				$("#tpopbeob_Projekt").val(data.Projekt);
				$("#tpopbeob_RaumGde").val(data.RaumGde);
				$("#tpopbeob_Ort").val(data.Ort);
				$("#tpopbeob_X").val(data.X);
				$("#tpopbeob_Y").val(data.Y);
				$("#tpopbeob_Datum").val(data.Datum);
				$("#tpopbeob_Jahr").val(data.Jahr);
				$("#tpopbeob_Anzahl").val(data.Anzahl);
				$("#tpopbeob_Autor").val(data.Autor);
				//nochmals tpop_id setzen, damit es sicher da ist
				//wird benötigt, falls node verschoben wird
				localStorage.tpop_id = data.TPopId;
				//Distanzen zu TPop berechnen
				$.ajax({
					url: 'php/beob_zuweisen.php',
					dataType: 'json',
					data: {
						"beobid": data.BeobId
					},
					success: function (data2) {
						var html = '<input type="radio" name="tpopbeob_DistZuTPop" id="tpopbeob_DistZuTPop0" class="tpopbeob_DistZuTPop" formular="tpopbeob" value="0"/>keiner';
						if (data2) {
							for (i in data2) {
								if (typeof i !== "function") {
									if (html) {
										html += "<br>";
									}
									html += '<input type="radio" name="tpopbeob_DistZuTPop" id="tpopbeob_DistZuTPop';
									html += data2[i].TPopId;
									html += '" class="tpopbeob_DistZuTPop" formular="tpopbeob" value="'
									html += data2[i].TPopId;
									html += '" DistZuTPop="';
									html += data2[i].DistZuTPop;
									if (data2[i].TPopId === data.TPopId) {
										html += '" checked="checked" />';
									} else {
										html += '" />';
									}
									//Wenn TPop keine Koordinaten haben, Anzeige von NAN verhindern
									if (parseInt(data2[i].DistZuTPop) >= 0) {
										html += parseInt(data2[i].DistZuTPop) + "m: " + data2[i].TPopFlurname;
									} else {
										html += data2[i].TPopFlurname;
									}
								}
							}
							$("#tpopbeob_DistZuTPop_Felder").html(html);
							//Formulare blenden
							zeigeFormular("tpopbeob");
							setzeSpaltenbreiten();
						}
					}
				});
			}
		}
	});
}

function initiiere_beob() {
	if (!localStorage.BeobId) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("beob");
	setzeSpaltenbreiten();
	//Daten für die beob aus der DB holen
	$.ajax({
		url: 'php/beob.php',
		dataType: 'json',
		data: {
			"id": localStorage.BeobId
		},
		success: function (data) {
			var GisBrowserUrl, Datum;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//beob bereitstellen
				window.beob = data;
				//Felder mit Daten beliefern
				$("#beob_ArtName").val(data.Name + " " + data.StatusText);
				$("#beob_IdZdsf").val(data.IdZdsf);
				$("#beob_IdEvab").val(data.IdEvab);
				$("#beob_Projekt").val(data.Projekt);
				$("#beob_RaumGde").val(data.RaumGde);
				$("#beob_Ort").val(data.Ort);
				$("#beob_X").val(data.X);
				$("#beob_Y").val(data.Y);
				$("#beob_Datum").val(data.Datum);
				$("#beob_Jahr").val(data.Jahr);
				//$("#beob_Anzahl").val(data.Anzahl);
				$("#beob_Autor").val(data.Autor);
				//Distanzen zu TPop berechnen
				$.ajax({
					url: 'php/beob_zuweisen.php',
					dataType: 'json',
					data: {
						"beobid": localStorage.BeobId
					},
					success: function (data) {
						var html = "";
						if (data) {
							for (i in data) {
								if (typeof i !== "function") {
									if (html) {
										html += "<br>";
									}
									html += '<input type="radio" name="DistZuTPop" id="DistZuTPop';
									html += data[i].TPopId;
									html += '" class="DistZuTPop" formular="beob" value="'
									html += data[i].TPopId;
									html += '" DistZuTPop="';
									html += data[i].DistZuTPop;
									html += '" />';
									//Wenn TPop keine Koordinaten haben, dies anzeigen und Anzeige von NAN verhindern
									if (parseInt(data[i].DistZuTPop) >= 0) {
										html += parseInt(data[i].DistZuTPop) + "m: " + data[i].TPopFlurname;
									} else {
										html += data[i].TPopFlurname;
									}
								}
							}
							$("#DistZuTPop_Felder").html(html);
							//Formulare blenden
							zeigeFormular("beob");
							setzeSpaltenbreiten();
						}
					}
				});
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
	setzeSpaltenbreiten();
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
				setzeSpaltenbreiten();
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#TPopMassnBerJahr').focus();
				}, 100);
			}
		}
	});
}

function initiiere_exporte() {
	$("#testart_div").hide();
	zeigeFormular("exporte");
	setzeSpaltenbreiten();
}

//managed die Sichtbarkeit von Formularen
//wird von allen initiiere_-Funktionen verwendet
//wird ein Formularname übergeben, wird dieses Formular gezeigt
//und alle anderen ausgeblendet
//zusätzlich wird die Höhe von textinput-Feldern an den Textinhalt angepasst
function zeigeFormular(Formularname) {
	if (Formularname) {
		$("#forms").show();
		$('form').each(function() {
			$(this).hide();
		});
		$('form').each(function() {
			if ($(this).attr("id") === Formularname) {
				$(this).show();
				$('textarea').each(function () {
					$(this).trigger('focus');
				});
			}
		});
	} else {
		$("#forms").hide();
		$('form').each(function() {
			$(this).hide();
		});
	}
	if (Formularname === "Karte") {
		//Karte wird sonst unter dem Menu angezeigt
		setTimeout(function() {
			setzeSpaltenbreiten();
		}, 5);
	}
	$(window).scrollTop(0);
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

function setzeTreehoehe() {
	if (($("#tree").height() + 157) > $(window).height()) {
		$("#tree").height($(window).height() - 145);
	} else if ($('#tree').hasScrollBar()) {
		$("#tree").height($(window).height() - 145);
	}
}

function setzeFormhoehe() {
	//zunächst mal an formhöhe anpassen
	$('form').each(function() {
		if ($(this).is(":visible")) {
			$("#forms").height($(this).height() + 75);
		}
	});
	//verhindern, dass grösser als Bildschirm
	if (($("#forms").height() + 50) > $(window).height()) {
		$("#forms").height($(window).height() - 50);
	}
}

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

//wenn $("#forms").width() > 444: forms unter menu setzen, 
function setzeSpaltenbreiten() {
	if ($(window).width() > 855) {
		$("#forms").width($(window).width() - 417);
		$("#tree").width(367);
	} else {
		$("#forms").width($(window).width() - 27);
		$("#tree").width($(window).width() - 36);
	}
}

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
	$.ajax({
		url: 'php/apliste.php?programm=' + programm,
		dataType: 'json',
		success: function (data) {
			var html;
			html = "<option></option>";
			for (i in data.rows) {
				if (typeof i !== "undefined") {
					html += "<option value=\"" + data.rows[i].id + "\">" + data.rows[i].ap_name + "</option>";
				}
			}
			$("#ap_waehlen").html(html);
		}
	});
}

function erstelle_tree(ApArtId) {
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
		/*"sort": function (a, b) {
			if ($(this).attr("typ") && $(this).attr("typ") === "pop") {
			//node = data.rslt.obj;
			//if (node.attr("typ") === "pop") {
				return this.get_text(a) > this.get_text(b) ? 1 : -1;
			}
		},*/
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
					} else if (m.o.attr("typ") === "tpopbeob") {
						if (m.r.attr("typ") === "tpopbeob") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_tpopbeob") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "ap_ordner_beob") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else {
							return false;
						}
					} else if (m.o.attr("typ") === "beob") {
						if (m.r.attr("typ") === "tpopbeob") {
							return {
								after: true,
								before: true,
								inside: false
							};
						} else if (m.r.attr("typ") === "tpop_ordner_tpopbeob") {
							return {
								after: false,
								before: false,
								inside: true
							};
						} else if (m.r.attr("typ") === "beob") {
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
			"valid_children": ["ap_ordner_pop", "ap_ordner_apziel", "ap_ordner_erfkrit", "ap_ordner_jber", "ap_ordner_ber", "ap_ordner_beob", "umwfakt", "ap_ordner_ib", "ap_ordner_assozarten"],
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
					"valid_children": ["tpop_ordner_massn", "tpop_ordner_massnber", "tpop_ordner_feldkontr", "tpop_ordner_freiwkontr", "tpop_ordner_tpopber", "tpop_ordner_tpopbeob"],
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
				"tpop_ordner_tpopbeob": {
					"valid_children": "tpopbeob"
				},
				"tpopbeob": {
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
				"ap_ordner_beob": {
					"valid_children": "beob"
				},
				"beob": {
					"valid_children": "none"
				},
				"umwfakt": {
					"valid_children": "none"
				},
				"ap_ordner_ib": {
					"valid_children": "ib"
				},
				"ib": {
					"valid_children": "none",
					"new_node": "neues ideales Biotop"
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
		"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "crrm", "dnd", "types"]
	})
	.show()
	.bind("loaded.jstree", function (event, data) {
		$("#suchen").show();
		$("#hilfe").show();
	})
	//auch auf Mobilgeräten soll das Kontextmenü zugänglich sein!
	.hammer().bind("hold doubletap", function (event) {
		setTimeout(function() {
			jQuery("#tree").jstree('get_selected').children('a').trigger('contextmenu');
		}, 500);
	})
	.bind("select_node.jstree", function (e, data) {
		var node;
		delete localStorage.tpopfreiwkontr;	//Erinnerung an letzten Klick im Baum löschen
		node = data.rslt.obj;
		jQuery.jstree._reference(node).open_node(node);
		if (node.attr("typ").slice(0, 3) === "ap_" || node.attr("typ") === "apzieljahr") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ap").is(':visible') || localStorage.ap_id !== node.attr("id")) {
				localStorage.ap_id = node.attr("id");
				delete localStorage.pop_id;
				initiiere_ap();
			}
		} else if (node.attr("typ") === "pop" || node.attr("typ").slice(0, 4) === "pop_") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#pop").is(':visible') || localStorage.pop_id !== node.attr("id")) {
				localStorage.pop_id = node.attr("id");
				initiiere_pop();
			}
		} else if (node.attr("typ") === "apziel" || node.attr("typ") === "zielber_ordner") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#apziel").is(':visible') || localStorage.apziel_id !== node.attr("id")) {
				localStorage.apziel_id = node.attr("id");
				initiiere_apziel();
			}
		} else if (node.attr("typ") === "zielber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#zielber").is(':visible') || localStorage.zielber_id !== node.attr("id")) {
				localStorage.zielber_id = node.attr("id");
				initiiere_zielber();
			}
		} else if (node.attr("typ") === "erfkrit") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#erfkrit").is(':visible') || localStorage.erfkrit_id !== node.attr("id")) {
				localStorage.erfkrit_id = node.attr("id");
				initiiere_erfkrit();
			}
		} else if (node.attr("typ") === "jber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#jber").is(':visible') || localStorage.jber_id !== node.attr("id")) {
				localStorage.jber_id = node.attr("id");
				initiiere_jber();
			}
		} else if (node.attr("typ") === "jber_uebersicht") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#jber_uebersicht").is(':visible') || localStorage.jber_uebersicht_id !== node.attr("id")) {
				localStorage.jber_uebersicht_id = node.attr("id");
				initiiere_jber_uebersicht();
			}
		} else if (node.attr("typ") === "ber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ber").is(':visible') || localStorage.ber_id !== node.attr("id")) {
				localStorage.ber_id = node.attr("id");
				initiiere_ber();
			}
		} else if (node.attr("typ") === "umwfakt") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#umwfakt").is(':visible')) {
				//eigene id nicht nötig
				//1:1 mit ap verbunden, gleich id
				//wenn noch kein Datensatz existiert erstellt ihn initiiere_umwfakt
				initiiere_umwfakt();
			}
		} else if (node.attr("typ") === "ib") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ib").is(':visible') || localStorage.ib_id !== node.attr("id")) {
				localStorage.ib_id = node.attr("id");
				initiiere_ib();
			}
		} else if (node.attr("typ") === "assozarten") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#assozarten").is(':visible') || localStorage.assozarten_id !== node.attr("id")) {
				localStorage.assozarten_id = node.attr("id");
				initiiere_assozarten();
			}
		} else if (node.attr("typ") === "popber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#popber").is(':visible') || localStorage.popber_id !== node.attr("id")) {
				localStorage.popber_id = node.attr("id");
				initiiere_popber();
			}
		} else if (node.attr("typ") === "popmassnber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#popmassnber").is(':visible') || localStorage.popmassnber_id !== node.attr("id")) {
				localStorage.popmassnber_id = node.attr("id");
				initiiere_popmassnber();
			}
		} else if (node.attr("typ") === "tpop" || node.attr("typ").slice(0, 5) === "tpop_") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpop").is(':visible') || localStorage.tpop_id !== node.attr("id")) {
				localStorage.tpop_id = node.attr("id");
				initiiere_tpop();
			}
		} else if (node.attr("typ") === "tpopfeldkontr") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node.attr("id")) {
				localStorage.tpopfeldkontr_id = node.attr("id");
				initiiere_tpopfeldkontr();
			}
		} else if (node.attr("typ") === "tpopfreiwkontr") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopfeldkontr").is(':visible') || localStorage.tpopfeldkontr_id !== node.attr("id")) {
				localStorage.tpopfeldkontr_id = node.attr("id");
				localStorage.tpopfreiwkontr = true;
				initiiere_tpopfeldkontr();
			}
		} else if (node.attr("typ") === "tpopmassn") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassn").is(':visible') || localStorage.tpopmassn_id !== node.attr("id")) {
				localStorage.tpopmassn_id = node.attr("id");
				initiiere_tpopmassn();
			}
		} else if (node.attr("typ") === "tpopber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopber").is(':visible') || localStorage.tpopber_id !== node.attr("id")) {
				localStorage.tpopber_id = node.attr("id");
				initiiere_tpopber();
			}
		} else if (node.attr("typ") === "tpopbeob") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopbeob").is(':visible') || localStorage.tpopbeob_id !== node.attr("id")) {
				localStorage.tpopbeob_id = node.attr("id");
				initiiere_tpopbeob();
			}
		} else if (node.attr("typ") === "beob") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#beob").is(':visible') || localStorage.BeobId !== node.attr("id")) {
				localStorage.BeobId = node.attr("id");
				initiiere_beob();
			}
		} else if (node.attr("typ") === "tpopmassnber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnber_id !== node.attr("id")) {
				localStorage.tpopmassnber_id = node.attr("id");
				initiiere_tpopmassnber();
			}
		}
		setTimeout("setzeTreehoehe()", 200);
	})
	.bind("open_node.jstree", function (e, data) {
		setTimeout("setzeTreehoehe()", 200);
	})
	.bind("prepare_move.jstree", function (e, data) {
		//herkunft_parent_node muss vor dem move ermittelt werden - danach ist der parent ein anderer!
		window.herkunft_parent_node = jQuery.jstree._reference(data.rslt.o)._get_parent(data.rslt.o);
	})
	/*.bind("rename_node.jstree", function (e, data) {
		var parent_node;
		node = data.rslt.obj;
		parent_node = jQuery.jstree._reference(node)._get_parent();
		jQuery.jstree._focused()._get_settings().sort = function(a,b) {
				return this.get_text(a) > this.get_text(b) ? 1 : -1;
			};
		jQuery.jstree._reference(parent_node).sort(parent_node);
	})*/
	.bind("move_node.jstree", function (e, data) {
		var herkunft_node, ziel_node, ziel_parent_node;
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
		herkunft_node = data.rslt.o;
		ziel_node = data.rslt.r;
		ziel_parent_node = jQuery.jstree._reference(data.rslt.r)._get_parent(data.rslt.r);
		if (herkunft_node.attr("typ") === "pop") {
			if (ziel_node.attr("typ") === "pop") {
				$.ajax({
					url: 'php/pop_einfuegen.php',		//TO DO: PHP
					dataType: 'json',
					data: {
						"ap_art_id": $(ziel_parent_node).attr("id"),
						"pop_id": $(ziel_node).attr("id"),
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
						localStorage.pop_id = $(herkunft_node).attr("id");
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
			if (ziel_node.attr("typ") === "tpop") {
				$.ajax({
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": $(ziel_parent_node).attr("id"),
						"tpop_id": $(ziel_node).attr("id"),
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
						localStorage.tpop_id = $(herkunft_node).attr("id");
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
			if (ziel_node.attr("typ") === "pop_ordner_tpop") {
				$.ajax({
					url: 'php/tpop_einfuegen.php',
					dataType: 'json',
					data: {
						"pop_id": $(ziel_node).attr("id"),
						"tpop_id": $(herkunft_node).attr("id"),
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
						localStorage.tpop_id = $(herkunft_node).attr("id");
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
		if (herkunft_node.attr("typ") === "tpopmassn") {
			if (ziel_node.attr("typ") === "tpopmassn") {
				$.ajax({
					url: 'php/tpopmassn_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": $(ziel_parent_node).attr("id"),
						"tpopmassn_id": $(herkunft_node).attr("id"),
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
						localStorage.tpopmassn_id = $(herkunft_node).attr("id");
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
			if (ziel_node.attr("typ") === "tpop_ordner_massn") {
				$.ajax({
					url: 'php/tpopmassn_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": $(ziel_node).attr("id"),
						"tpopmassn_id": $(herkunft_node).attr("id"),
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
						localStorage.tpopmassn_id = $(herkunft_node).attr("id");
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
		if (herkunft_node.attr("typ") === "tpopfeldkontr") {
			if (ziel_node.attr("typ") === "tpopfeldkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": $(ziel_parent_node).attr("id"),
						"tpopfeldkontr_id": $(herkunft_node).attr("id"),
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
						localStorage.tpopfeldkontr_id = $(herkunft_node).attr("id");
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
			if (ziel_node.attr("typ") === "tpop_ordner_feldkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": $(ziel_node).attr("id"),
						"tpopfeldkontr_id": $(herkunft_node).attr("id"),
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
						localStorage.tpopfeldkontr_id = $(herkunft_node).attr("id");
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
		if (herkunft_node.attr("typ") === "tpopfreiwkontr") {
			if (ziel_node.attr("typ") === "tpopfreiwkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": $(ziel_parent_node).attr("id"),
						"tpopfeldkontr_id": $(herkunft_node).attr("id"),
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
						localStorage.tpopfeldkontr_id = $(herkunft_node).attr("id");
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
			if (ziel_node.attr("typ") === "tpop_ordner_freiwkontr") {
				$.ajax({
					url: 'php/tpopfeldkontr_einfuegen.php',
					dataType: 'json',
					data: {
						"tpop_id": $(ziel_node).attr("id"),
						"tpopfeldkontr_id": $(herkunft_node).attr("id"),
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
						localStorage.tpopfeldkontr_id = $(herkunft_node).attr("id");
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
		if (herkunft_node.attr("typ") === "tpopbeob") {
			if (ziel_node.attr("typ") === "beob" || ziel_node.attr("typ") === "ap_ordner_beob") {
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": $(herkunft_node).attr("id"),
						"Feld": "TPopId",
						"Wert": "",
						"user": sessionStorage.User
					},
					success: function () {
						//typ des nodes anpassen
						$(herkunft_node).attr("typ", "beob");
						//selecten
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						if (ziel_node.attr("typ") === "beob") {
							beschrifte_ap_ordner_beob(ziel_parent_node);
						} else {
							beschrifte_ap_ordner_beob(ziel_node);
						}
						beschrifte_tpop_ordner_tpopbeob(window.herkunft_parent_node);
						//Variablen aufräumen
						localStorage.beob_id = $(herkunft_node).attr("id");
						delete window.tpopbeob;
						delete window.tpopbeob_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_beob();
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
			if (ziel_node.attr("typ") === "tpopbeob") {
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": $(herkunft_node).attr("id"),
						"Feld": "TPopId",
						"Wert": $(ziel_parent_node).attr("id"),
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_tpopbeob(ziel_parent_node);
						beschrifte_tpop_ordner_tpopbeob(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopbeob_id = $(herkunft_node).attr("id");
						delete window.tpopbeob;
						delete window.tpopbeob_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpopbeob();
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
			if (ziel_node.attr("typ") === "tpop_ordner_tpopbeob") {
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": $(herkunft_node).attr("id"),
						"Feld": "TPopId",
						"Wert": $(ziel_node).attr("id"),
						"user": sessionStorage.User
					},
					success: function () {
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_tpop_ordner_tpopbeob(ziel_node);
						beschrifte_tpop_ordner_tpopbeob(window.herkunft_parent_node);
						//selection steuern
						jQuery.jstree._reference(herkunft_node).deselect_all();
						jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						//Variablen aufräumen
						localStorage.tpopbeob_id = $(herkunft_node).attr("id");
						delete window.tpopbeob;
						delete window.tpopbeob_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						initiiere_tpopbeob();
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
		if (herkunft_node.attr("typ") === "beob") {
			if (ziel_node.attr("typ") === "tpopbeob") {
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": $(herkunft_node).attr("id"),
						"Feld": "TPopId",
						"Wert": $(ziel_parent_node).attr("id"),
						"user": sessionStorage.User
					},
					success: function () {
						//typ des nodes anpassen
						$(herkunft_node).attr("typ", "tpopbeob");
						//selecten, aber nur, wenn nicht in der Karte Beob verschoben werden
						if (!localStorage.karte_fokussieren) {
							jQuery.jstree._reference(herkunft_node).deselect_all();
							jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						}
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_ap_ordner_beob(window.herkunft_parent_node);
						beschrifte_tpop_ordner_tpopbeob(ziel_parent_node);
						//Variablen aufräumen
						localStorage.tpopbeob_id = $(herkunft_node).attr("id");
						delete window.beob;
						delete window.beob_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						if (!localStorage.karte_fokussieren) {
							initiiere_tpopbeob();
						} else {
							delete localStorage.karte_fokussieren;
						}
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
			if (ziel_node.attr("typ") === "tpop_ordner_tpopbeob") {
				$.ajax({
					url: 'php/beob_update.php',
					dataType: 'json',
					data: {
						"id": $(herkunft_node).attr("id"),
						"Feld": "TPopId",
						"Wert": $(ziel_node).attr("id"),
						"user": sessionStorage.User
					},
					success: function () {
						//typ des nodes anpassen
						$(herkunft_node).attr("typ", "tpopbeob");
						//selecten, aber nur, wenn nicht in der Karte Beob verschoben werden
						if (!localStorage.karte_fokussieren) {
							jQuery.jstree._reference(herkunft_node).deselect_all();
							jQuery.jstree._reference(herkunft_node).select_node(herkunft_node);
						}
						//Anzahlen anpassen der parent-nodes am Herkunfts- und Zielort
						beschrifte_ap_ordner_beob(window.herkunft_parent_node);
						beschrifte_tpop_ordner_tpopbeob(ziel_node);
						//Variablen aufräumen
						localStorage.tpopbeob_id = $(herkunft_node).attr("id");
						delete window.beob;
						delete window.beob_node_ausgeschnitten;
						delete window.herkunft_parent_node;
						if (!localStorage.karte_fokussieren) {
							initiiere_tpopbeob();
						} else {
							delete localStorage.karte_fokussieren;
						}
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
		}
	})
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_pop(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Population";
	} else {
		anzTxt = anz + " Populationen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_apziel(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " AP-Ziel";
	} else {
		anzTxt = anz + " AP-Ziele";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_apzieljahr(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	anzTxt = jQuery.jstree._reference(node).get_text(node).slice(0, 6);
	anzTxt += anz;
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_zielber_ordner(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Ziel-Bericht";
	} else {
		anzTxt = anz + " Ziel-Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_erfkrit(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " AP-Erfolgskriterium";
	} else {
		anzTxt = anz + " AP-Erfolgskriterien";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_jber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " AP-Bericht";
	} else {
		anzTxt = anz + " AP-Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_ber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Bericht";
	} else {
		anzTxt = anz + " Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_ib(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " ideales Biotop";
	} else {
		anzTxt = anz + " ideale Biotope";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_assozarten(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " assoziierte Art";
	} else {
		anzTxt = anz + " assoziierte Arten";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Population";
	} else {
		anzTxt = anz + " Populationen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop_ordner_tpop(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Teilpopulation";
	} else {
		anzTxt = anz + " Teilpopulationen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop_ordner_popber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Populations-Bericht";
	} else {
		anzTxt = anz + " Populations-Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_pop_ordner_massnber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Massnahmen-Bericht";
	} else {
		anzTxt = anz + " Massnahmen-Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_massn(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Massnahme";
	} else {
		anzTxt = anz + " Massnahmen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_massnber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Massnahmen-Bericht";
	} else {
		anzTxt = anz + " Massnahmen-Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_tpopber(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Teilpopulations-Bericht";
	} else {
		anzTxt = anz + " Teilpopulations-Berichte";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_feldkontr(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Feldkontrolle";
	} else {
		anzTxt = anz + " Feldkontrollen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_freiwkontr(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Freiwilligen-Kontrolle";
	} else {
		anzTxt = anz + " Freiwilligen-Kontrollen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_tpop_ordner_tpopbeob(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " Beobachtung";
	} else {
		anzTxt = anz + " Beobachtungen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

//übernimmt einen node
//zählt dessen children und passt die Beschriftung an
function beschrifte_ap_ordner_beob(node) {
	var anz, anzTxt;
	anz = $(node).find("> ul > li").length;
	if (anz === 1) {
		anzTxt = anz + " nicht zugewiesene Beobachtung";
	} else {
		anzTxt = anz + " nicht zugewiesene Beobachtungen";
	}
	jQuery.jstree._reference(node).rename_node(node, anzTxt);
}

function treeKontextmenu(node) {
	var items, aktiver_node, parent_node, grandparent_node, neue_apziele_node;
	//relevante nodes zwischenspeichern
	//aktiver_node = node;     das hat auch funktioniert
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
							"id": $(aktiver_node).attr("id"),
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
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/ap_karte.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"Wert": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							//Baum neu aufbauen
							//jQuery("#tree").jstree("destroy")
							//erstelle_tree($(parent_node).attr("id"));
							setTimeout(function() {
								erstelle_tree($(aktiver_node).attr("id"));
							}, 500);
							//richtigen node markieren
							/*jQuery("#tree").bind("reselect.jstree", function () { 
								jQuery("#tree").jstree("deselect_all");
								jQuery("#tree").jstree("close_all", -1);
								jQuery("#tree").jstree("select_node", "[typ='pop']#" + window.pop_id); 
							});*/

							/*$(function () { 
								var ready = false; 
								$("#tree")
									.bind("reselect.jstree", function() { ready = true; }) 
									.bind("select_node.jstree", function() { 
										if(ready) { 
											setTimeout(function() {
												jQuery("#tree").jstree("deselect_all");
												jQuery("#tree").jstree("close_all", -1);
												jQuery("#tree").jstree("select_node", "[typ='pop']#" + window.pop_id);
												ready = false;
												alert("hop");
											}, 700); 
										}
									}); 

							}); */
							/*setTimeout(function() {
								jQuery("#tree").jstree("deselect_all");
								jQuery("#tree").jstree("close_all", -1);
								jQuery("#tree").jstree("select_node", "[typ='pop']#" + window.pop_id);
								alert("hop");
							}, 500);*/
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
							"id": $(aktiver_node).attr("id"),
							"typ": "apzieljahr"
						}
					});
					$.ajax({
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "apzieljahr":
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
					$.ajax( {
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
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
							initiiere_apziel();
							//jetzt das Jahr einfügen
							setTimeout(function() {
								$("#ZielJahr").val(jQuery.jstree._reference(aktiver_node).get_text(aktiver_node).slice(0, 4));
								var Objekt = {};
								Objekt.name = "ZielJahr";
								Objekt.formular = "apziel";
								speichern(Objekt);
								$("#ZielJahr").focus();
							}, 100);
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(grandparent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_jber":
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"jahr": jQuery.jstree._reference(aktiver_node).get_text(aktiver_node),
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
										"jahr": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(aktiver_node).attr("id"),
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_ib":
		items = {
			"neu": {
				"label": "neues Idealbiotop",
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
						url: 'php/ib_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.ib_id = data;
							delete window.ib;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neues Idealbiotop",
								"attr": {
									"id": data,
									"typ": "ib"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_ib(aktiver_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_ib();
						},
						error: function (data) {
							$("#Meldung").html("Fehler: Kein neues Idealbiotop erstellt");
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ib":
		items = {
			"neu": {
				"label": "Neues Idealbiotop",
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
						url: 'php/ib_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "ib",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode;
							localStorage.ib_id = data;
							delete window.ib;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "Neues Idealbiotop",
								"attr": {
									"id": data,
									"typ": "ib"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							beschrifte_ap_ordner_ib(parent_node);
							//node selecten
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//Formular initiieren
							initiiere_ib();
						},
						error: function () {
							$("#Meldung").html("Fehler: Kein neues Idealbiotop erstellt");
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
					$("#loeschen_dialog_mitteilung").html("Das Idealbiotop \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/ib_delete.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										delete localStorage.ib_id;
										delete window.ib;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_ap_ordner_ib(parent_node);
									},
									error: function (data) {
										$("#Meldung").html("Fehler: Das Idealbiotop wurde nicht gelöscht");
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
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
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/pop_karte.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
					window.pop_id = $(aktiver_node).attr("id");
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
					//db aktualisieren
					$.ajax({
						url: 'php/pop_update.php',
						dataType: 'json',
						data: {
							"id": window.pop_id,
							"Feld": "ApArtId",
							"Wert": $(parent_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							//Baum neu aufbauen
							//jQuery("#tree").jstree("destroy")
							erstelle_tree($(parent_node).attr("id"));
							//richtigen node markieren
							/*jQuery("#tree").bind("reselect.jstree", function () { 
								jQuery("#tree").jstree("deselect_all");
								jQuery("#tree").jstree("close_all", -1);
								jQuery("#tree").jstree("select_node", "[typ='pop']#" + window.pop_id); 
							});*/

							/*$(function () { 
								var ready = false; 
								$("#tree")
									.bind("reselect.jstree", function() { ready = true; }) 
									.bind("select_node.jstree", function() { 
										if(ready) { 
											setTimeout(function() {
												jQuery("#tree").jstree("deselect_all");
												jQuery("#tree").jstree("close_all", -1);
												jQuery("#tree").jstree("select_node", "[typ='pop']#" + window.pop_id);
												ready = false;
												alert("hop");
											}, 700); 
										}
									}); 

							}); */
							/*setTimeout(function() {
								jQuery("#tree").jstree("deselect_all");
								jQuery("#tree").jstree("close_all", -1);
								jQuery("#tree").jstree("select_node", "[typ='pop']#" + window.pop_id);
								alert("hop");
							}, 500);*/
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
							"id": $(aktiver_node).attr("id"),
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
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Massnahmen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_massn"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Massnahmen-Berichte",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_massnber"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Feldkontrollen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_feldkontr"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Freiwilligen-Kontrollen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_freiwkontr"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Teilpopulations-Berichte",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_tpopber"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Beobachtungen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_tpopbeob"
								}
							});
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
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/pop_karte.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpop_node_kopiert).get_text(window.tpop_node_kopiert) + " einfügen",
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
							"id": $(parent_node).attr("id"),
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
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Massnahmen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_massn"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Massnahmen-Berichte",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_massnber"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Feldkontrollen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_feldkontr"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Freiwilligen-Kontrollen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_freiwkontr"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Teilpopulations-Berichte",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_tpopber"
								}
							});
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "Beobachtungen",
								"attr": {
									"id": data,
									"typ": "tpop_ordner_tpopbeob"
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
										"id": $(aktiver_node).attr("id")
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
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
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
			"GoogleMaps": {
				"label": "auf Luftbild zeigen",
				"separator_before": true,
				"icon": "style/images/flora_icon.png",
				"action": function () {
					$.ajax({
						url: 'php/tpop_karte.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
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
			"verorten": {
				"label": "auf Luftbild verorten",
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
							"id": $(aktiver_node).attr("id")
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
					var URL;
					if ($("#TPopXKoord").val() && $("#TPopYKoord").val()) {
						URL = "http://www.gis.zh.ch/gb/gb.asp?YKoord=" + $("#TPopXKoord").val() + "&XKoord=" + $("#TPopYKoord").val() + "&Massstab=3000+app=GB-SWISSIMAGE+rn=5$7";
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
			},
			"Exporte": {
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (!window.tpop_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
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
							"id": $(window.tpop_node_kopiert).attr("id")
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(aktiver_node).attr("id");
					//die alten id's entfernen
					delete window.tpopfeldkontr_objekt_kopiert.TPopId;
					delete window.tpopfeldkontr_objekt_kopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete window.tpopfeldkontr_objekt_kopiert.MutWann;
					delete window.tpopfeldkontr_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in window.tpopfeldkontr_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (window.tpopfeldkontr_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + window.tpopfeldkontr_objekt_kopiert[i];
							}
						}
					}
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopfeldkontr_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": window.tpopfeldkontr_objekt_kopiert.TPopKontrJahr,
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
					var url_string = "?id=" + $(aktiver_node).attr("id") + "&user=" + sessionStorage.User;
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
						if (typeof i !== "function") {
							$("#" + i).val(window.feldkontr_biotop[i]);
							url_string += "&" + i + "=" + window.feldkontr_biotop[i];
						}
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
				"label": "Feldkontrolle ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
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
							"id": $(window.tpopfeldkontr_node_kopiert).attr("id")
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(parent_node).attr("id");
					//die alten id's entfernen
					delete window.tpopfeldkontr_objekt_kopiert.TPopId;
					delete window.tpopfeldkontr_objekt_kopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete window.tpopfeldkontr_objekt_kopiert.MutWann;
					delete window.tpopfeldkontr_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in window.tpopfeldkontr_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (window.tpopfeldkontr_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + window.tpopfeldkontr_objekt_kopiert[i];
							}
						}
					}
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopfeldkontr_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": window.tpopfeldkontr_objekt_kopiert.TPopKontrJahr,
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(aktiver_node).attr("id");
					//die alten id's entfernen
					delete tpopfreiwkontr_objekt_kopiert.TPopId;
					delete tpopfreiwkontr_objekt_kopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete tpopfreiwkontr_objekt_kopiert.MutWann;
					delete tpopfreiwkontr_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in tpopfreiwkontr_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (tpopfreiwkontr_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + tpopfreiwkontr_objekt_kopiert[i];
							}
						}
					}
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.tpopfreiwkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
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
							"id": $(window.tpopfreiwkontr_node_kopiert).attr("id")
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(parent_node).attr("id");
					//die alten id's entfernen
					delete tpopfreiwkontr_objekt_kopiert.TPopId;
					delete tpopfreiwkontr_objekt_kopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete tpopfreiwkontr_objekt_kopiert.MutWann;
					delete tpopfreiwkontr_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in tpopfreiwkontr_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (tpopfreiwkontr_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + tpopfreiwkontr_objekt_kopiert[i];
							}
						}
					}
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(aktiver_node).attr("id");
					//die alten id's entfernen
					delete window.tpopmassn_objekt_kopiert.TPopId;
					delete window.tpopmassn_objekt_kopiert.TPopMassnId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete window.tpopmassn_objekt_kopiert.MutWann;
					delete window.tpopmassn_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in window.tpopmassn_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (window.tpopmassn_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + window.tpopmassn_objekt_kopiert[i];
							}
						}
					}
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopmassn_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": window.tpopmassn_objekt_kopiert.TPopMassnJahr,
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										delete localStorage.tpopmassn_id;
										delete window.tpopmassn;
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										beschrifte_tpop_ordner_massn(parent_node);
										//Hinweis zum rückgängig machen anzeigen
										$("#undelete_div").html("Massnahme '" + window.deleted.TPopMassnJahr + ": " + window.deleted.TPopMassnTyp + "' wurde gelöscht. <a href='#' id='undelete'>Rückgängig machen?</a>");
										$("#undelete_div").show();
										setTimeout(function () {
											$("#undelete_div").html("");
											$("#undelete_div").hide();
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.tpopmassn_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
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
							"id": $(window.tpopmassn_node_kopiert).attr("id")
						},
						success: function (data) {
							window.tpopmassn_objekt_kopiert = data;
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(parent_node).attr("id");
					//die alten id's entfernen
					delete window.tpopmassn_objekt_kopiert.TPopId;
					delete window.tpopmassn_objekt_kopiert.TPopMassnId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete window.tpopmassn_objekt_kopiert.MutWann;
					delete window.tpopmassn_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in window.tpopmassn_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (window.tpopmassn_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + window.tpopmassn_objekt_kopiert[i];
							}
						}
					}
					//und an die DB schicken
					$.ajax({
						url: 'php/tpopmassn_insert_kopie.php' + dataUrl,
						dataType: 'json',
						success: function (data) {
							var NeuerNode;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": window.tpopmassn_objekt_kopiert.TPopMassnJahr,
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "tpop_ordner_tpopbeob":
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
							"tpop_id": $(aktiver_node).attr("id")
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
		if (window.tpopbeob_node_ausgeschnitten) {
			items = {};
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopbeob_node_ausgeschnitten).get_text(window.tpopbeob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(aktiver_node).move_node(window.tpopbeob_node_ausgeschnitten, aktiver_node, "first", false);
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
	case "tpopbeob":
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
							"beobid": $(aktiver_node).attr("id"),
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
			"GisBrowser": {
				"label": "im GIS-Browser zeigen",
				"separator_before": true,
				"icon": "style/images/wappen_zuerich.png",
				"action": function () {
					var URL;
					if ($("#tpopbeob_X").val() && $("#tpopbeob_Y").val()) {
						URL = "http://www.gis.zh.ch/gb/gb.asp?YKoord=" + $("#tpopbeob_X").val() + "&XKoord=" + $("#tpopbeob_Y").val() + "&Massstab=3000+app=GB-SWISSIMAGE+rn=5$7";
						window.open(URL, target = "_blank");
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
				}
			},
			"Exporte": {
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		if (!window.tpopbeob_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
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
					window.tpopbeob_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.tpopbeob_node_ausgeschnitten) {
			items.einfuegen_tpopbeob = {
				"label": jQuery.jstree._reference(window.tpopbeob_node_ausgeschnitten).get_text(window.tpopbeob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery.jstree._reference(parent_node).move_node(window.tpopbeob_node_ausgeschnitten, parent_node, "first", false);
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
							"id": $(aktiver_node).attr("id"),
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
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
							"id": $(parent_node).attr("id"),
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
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		};
		return items;
	case "ap_ordner_beob":
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
							"apart_id": $(aktiver_node).attr("id")
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
							"apart_id": $(aktiver_node).attr("id")
						},
						success: function (beob) {
							if (beob.rows.length > 0) {
								$.ajax({
									url: 'php/ap_karte.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
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
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (window.tpopbeob_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopbeob_node_ausgeschnitten).get_text(window.tpopbeob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.tpopbeob_node_ausgeschnitten, aktiver_node, "first");
				}
			}
		}
		return items;
	case "beob":
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
							"beobid": $(aktiver_node).attr("id")
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
					var URL;
					if ($("#beob_X").val() && $("#beob_Y").val()) {
						URL = "http://www.gis.zh.ch/gb/gb.asp?YKoord=" + $("#beob_X").val() + "&XKoord=" + $("#beob_Y").val() + "&Massstab=3000+app=GB-SWISSIMAGE+rn=5$7";
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
			},
			"Exporte": {
				"label": "Exporte",
				"separator_before": true,
				"icon": "style/images/exporte.png",
				"action": function () {
					initiiere_exporte();
				}
			}
		}
		if (!window.beob_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden<br>&nbsp;&nbsp;&nbsp;Tipp: drag and drop me!",
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
		if (window.tpopbeob_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopbeob_node_ausgeschnitten).get_text(window.tpopbeob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					jQuery("#tree").jstree("move_node", window.tpopbeob_node_ausgeschnitten, parent_node, "first");
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
	dataUrl = "?MutWer=" + sessionStorage.User + "&PopId=" + $(aktiver_node).attr("id");
	//die alten id's entfernen
	delete window.tpop_objekt_kopiert.PopId;
	delete window.tpop_objekt_kopiert.TPopId;
	//das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.tpop_objekt_kopiert.MutWann;
	delete window.tpop_objekt_kopiert.MutWer;
	//alle verbliebenen Felder an die url hängen
	for (i in window.tpop_objekt_kopiert) {
		if (typeof i !== "function") {
			//Nullwerte ausschliessen
			if (window.tpop_objekt_kopiert[i] !== null) {
				dataUrl += "&" + i + "=" + window.tpop_objekt_kopiert[i];
			}
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
			NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
				"data": window.tpop_objekt_kopiert.TPopFlurname,
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
	dataUrl = "?MutWer=" + sessionStorage.User + "&ApArtId=" + $(parent_node).attr("id");
	//die alten id's entfernen
	delete window.pop_objekt_kopiert.ApArtId;
	delete window.pop_objekt_kopiert.PopId;
	//das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.pop_objekt_kopiert.MutWann;
	delete window.pop_objekt_kopiert.MutWer;
	//alle verbliebenen Felder an die url hängen
	for (i in window.pop_objekt_kopiert) {
		if (typeof i !== "function") {
			//Nullwerte ausschliessen
			if (window.pop_objekt_kopiert[i] !== null) {
				dataUrl += "&" + i + "=" + window.pop_objekt_kopiert[i];
			}
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
	dataUrl = "?MutWer=" + sessionStorage.User + "&PopId=" + $(parent_node).attr("id");
	//die alten id's entfernen
	delete window.tpop_objekt_kopiert.PopId;
	delete window.tpop_objekt_kopiert.TPopId;
	//das wird gleich neu gesetzt, alte Werte verwerfen
	delete window.tpop_objekt_kopiert.MutWann;
	delete window.tpop_objekt_kopiert.MutWer;
	//alle verbliebenen Felder an die url hängen
	for (i in window.tpop_objekt_kopiert) {
		if (typeof i !== "function") {
			//Nullwerte ausschliessen
			if (window.tpop_objekt_kopiert[i] !== null) {
				dataUrl += "&" + i + "=" + window.tpop_objekt_kopiert[i];
			}
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

//wird von allen Formularen benutzt
//speichert den Wert eines Feldes in einem Formular
//übernimmt das Objekt, in dem geändert wurde
function speichern(that) {
	var Feldtyp, Formular, Feldname, Feldjson, Feldwert, Querystring, Objekt;
	//nur speichern, wenn Schreibrechte bestehen
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
	if (Feldname === "TPopPop" || Feldname === "TPopHerkunftUnklar" || Feldname === "TPopMassnPlan" || Feldname === "TPopKontrPlan" || Feldname === "TPopKontrJungPflJN") {
		if (Feldwert) {
			Feldwert = 1;
		} else {
			Feldwert = 0;
		}
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
			if (Feldname === "TPopPop" && Feldwert == 1) {
				//allfällige andere als repräsentativ bezeichnete TPop derselben Pop zurücksetzen
				$.ajax({
					url: 'php/tpop_tpoppop.php',
					dataType: 'json',
					data: {
						"pop_id": localStorage.pop_id,
						"tpop_id": localStorage.tpop_id,
						"user": sessionStorage.User
					},
				});
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
		case "PopName":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_pop'] #" + localStorage.pop_id, $("#PopNr").val() + " " + Feldwert);
			break;
		case "PopNr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_pop'] #" + localStorage.pop_id, Feldwert + " " + $("#PopName").val());
			break;
		case "PopBerJahr":
		case "PopBerEntwicklung":
			jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_popber'] #" + localStorage.popber_id, $("#PopBerJahr").val() + ": " + $("#spanPopBerEntwicklung" + $('input[name="PopBerEntwicklung"]:checked').val()).text());
			break;
		case "PopMassnBerJahr":
		case "PopMassnBerErfolgsbeurteilung":
			jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_massnber'] #" + localStorage.popmassnber_id, $("#PopMassnBerJahr").val() + ": " + $("#spanPopMassnBerErfolgsbeurteilung" + $('input[name="PopMassnBerErfolgsbeurteilung"]:checked').val()).text());
			break;
		case "TPopFlurname":
			jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_tpop'] #" + localStorage.tpop_id, $("#TPopNr").val() + " " + Feldwert);
			break;
		case "TPopNr":
			jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_tpop'] #" + localStorage.tpop_id, Feldwert + " " + $("#TPopFlurname").val());
			break;
		case "TPopKontrTyp":
		case "TPopKontrJahr":
			//wenn kein Typ/Jahr gewählt: "(kein Typ/Jahr)"
			var tpopkontrjahr, tpopkontrtyp;
			if ($("#TPopKontrJahr").val()) {
				tpopkontrjahr = $("#TPopKontrJahr").val();
			} else {
				tpopkontrjahr = "(kein Jahr)";
			}
			if ($("#spanTPopKontrTyp" + $('input[name="TPopKontrTyp"]:checked').val()).text()) {
				tpopkontrtyp = $("#spanTPopKontrTyp" + $('input[name="TPopKontrTyp"]:checked').val()).text();
			} else {
				tpopkontrtyp = "(kein Typ)";
			}
			if (localStorage.tpopfreiwkontr) {
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_freiwkontr'] #" + localStorage.tpopfeldkontr_id, tpopkontrjahr);
			} else {
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_feldkontr'] #" + localStorage.tpopfeldkontr_id, tpopkontrjahr + ": " + tpopkontrtyp);
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
			var tpopmassnjahr, tpopmassntyp;
			if ($("#TPopMassnJahr").val()) {
				tpopmassnjahr = $("#TPopMassnJahr").val();
			} else {
				tpopmassnjahr = "(kein Jahr)";
			}
			if ($("#TPopMassnTyp option:checked").text()) {
				tpopmassntyp = $("#TPopMassnTyp option:checked").text();
			} else {
				tpopmassntyp = "(kein Typ)";
			}
			jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_massn'] #" + localStorage.tpopmassn_id, tpopmassnjahr + ": " + tpopmassntyp);
			break;
		case "TPopMassnBerJahr":
		case "TPopMassnBerErfolgsbeurteilung":
			//wenn kein Jahr/Beurteilung: "(kein Jahr/Beurteilung)"
			var tpopmassnberjahr, tpopmassnbererfolgsbeurteilung;
			if ($("#TPopMassnBerJahr").val()) {
				tpopmassnberjahr = $("#TPopMassnBerJahr").val();
			} else {
				tpopmassnberjahr = "(kein Jahr)";
			}
			if ($("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text()) {
				tpopmassnbererfolgsbeurteilung = $("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text();
			} else {
				tpopmassnbererfolgsbeurteilung = "(keine Beurteilung)";
			}
			jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_massnber'] #" + localStorage.tpopmassnber_id, tpopmassnberjahr + ": " + tpopmassnbererfolgsbeurteilung);
			break;
		case "ZielBezeichnung":
			jQuery("#tree").jstree("rename_node", "[typ='apzieljahr'] #" + localStorage.apziel_id, Feldwert);
			break;
		case "ZielBerJahr":
		case "ZielBerErreichung":
			jQuery("#tree").jstree("rename_node", "[typ='zielber_ordner'] #" + localStorage.zielber_id, $("#ZielBerJahr").val() + ": " + $("#ZielBerErreichung").val());
			break;
		case "ErfBeurtZielSkalaErreichungsgrad":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_erfkrit'] #" + localStorage.erfkrit_id, $("#SpanErfBeurtZielSkalaErreichungsgrad" + Feldwert).text() + ": " + $("#ErfBeurtZielSkalaTxt").val());
			break;
		case "ErfBeurtZielSkalaTxt":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_erfkrit'] #" + localStorage.erfkrit_id, $("#SpanErfBeurtZielSkalaErreichungsgrad" + $("input:radio[name='ErfBeurtZielSkalaErreichungsgrad']:checked").val()).text() + ": " + Feldwert);
			break;
		case "JBerJahr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_jber'] #" + localStorage.jber_id, Feldwert);
			break;
		case "BerAutor":
		case "BerJahr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_ber'] #" + localStorage.ber_id, $("#BerJahr").val() + ": " + $("#BerAutor").val());
			break;
		case "IbName":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_ib'] #" + localStorage.ib_id, Feldwert);
			break;
		case "AaSisfNr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_assozarten'] #" + localStorage.assozarten_id, $("#AaSisfNr option[value='" + Feldwert + "']").text());
			break;
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
	  +     76.63 * Math.pow(lat_aux,2)
	  -    194.56 * Math.pow(lng_aux,2) * lat_aux
	  +    119.79 * Math.pow(lat_aux,3);
 
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
	   -      0.36 * lng_aux * Math.pow(lat_aux,2)
	   -     44.54 * Math.pow(lng_aux,3);
	
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
	var anzTPop, infowindow, TPop, lat, lng, latlng, options, map, bounds, markers, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, Kartenhoehe, titel;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("Karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	Kartenhoehe = $(window).height() - 50;
	infowindow = new google.maps.InfoWindow();
	$("#Karte").css("height", Kartenhoehe + "px");
	//TPopListe bearbeiten:
	//Objekte löschen, die keine Koordinaten haben
	//Lat und Lng ergänzen
	for (i in TPopListe.rows) {
		TPop = TPopListe.rows[i];
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
	map = new google.maps.Map(document.getElementById("Karte"), options);
	//google.maps.event.trigger(map,'resize');
	bounds = new google.maps.LatLngBounds();
	//für alle TPop Marker erstellen
	markers = [];
	for (i in TPopListe.rows) {
		TPop = TPopListe.rows[i];
		TPopId = TPop.TPopId;
		latlng2 = new google.maps.LatLng(TPop.Lat, TPop.Lng);
		if (anzTPop === 1) {
			//map.fitbounds setzt zu hohen zoom, wenn nur eine TPop Koordinaten hat > verhindern
			latlng = latlng2;
		} else {
			//Kartenausschnitt um diese Koordinate erweitern
			bounds.extend(latlng2);
		}
		//title muss String sein
		if (TPop.TPopFlurname) {
			titel = TPop.TPopFlurname.toString();
		} else {
			titel = "";
		}
		marker = new MarkerWithLabel({
			map: map,
			position: latlng2,
			title: titel,
			labelContent: titel,
			labelAnchor: new google.maps.Point(75, 0),
			labelClass: "MapLabel",
			icon: "img/flora_icon.png"
		});
		markers.push(marker);
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + TPop.Name + '</h3>'+
			'<p>Population: ' + TPop.PopName + '</p>'+
			'<p>TPop: ' + TPop.TPopFlurname + '</p>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">bearbeiten<\/a></p>"+
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

function zeigeBeobUndTPopAufKarte(BeobListe, TPopListe) {
	var anzBeob, infowindowBeob, infowindowTPop, TPop, lat, lng, latlng, options, map, bounds, markersTPop, TPopId, latlng2, markerBeob, markerTPop, contentStringBeob, contentStringTPop, mcOptionsBeob, mcOptionsTPop, markerClusterBeob, markerClusterTPop, Kartenhoehe, Datum, titel, titel_beob, a_note;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("Karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	Kartenhoehe = $(window).height() - 50;
	infowindowBeob = new google.maps.InfoWindow();
	infowindowTPop = new google.maps.InfoWindow();
	$("#Karte").css("height", Kartenhoehe + "px");
	//Lat und Lng in BeobListe ergänzen
	for (i in BeobListe.rows) {
		Beob = BeobListe.rows[i];
		Beob.Lat = CHtoWGSlat(parseInt(Beob.xGIS), parseInt(Beob.yGIS));
		Beob.Lng = CHtoWGSlng(parseInt(Beob.xGIS), parseInt(Beob.yGIS));
	}
	//dito in TPopListe
	for (i in TPopListe.rows) {
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
	map = new google.maps.Map(document.getElementById("Karte"), options);
	//google.maps.event.trigger(map,'resize');
	bounds = new google.maps.LatLngBounds();

	//für alle TPop Marker erstellen
	markersTPop = [];
	for (i in TPopListe.rows) {
		TPop = TPopListe.rows[i];
		TPopId = TPop.TPopId;
		latlng2 = new google.maps.LatLng(TPop.Lat, TPop.Lng);
		//Kartenausschnitt um diese Koordinate erweitern
		bounds.extend(latlng2);
		//title muss String sein
		if (TPop.TPopFlurname) {
			titel = TPop.TPopFlurname.toString();
		} else {
			titel = "";
		}
		markerTPop = new MarkerWithLabel({
			map: map,
			position: latlng2,
			title: titel,
			labelContent: titel,
			labelAnchor: new google.maps.Point(75, 0),
			labelClass: "MapLabel",
			icon: "img/flora_icon.png"
		});
		markersTPop.push(markerTPop);
		contentStringTPop = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + TPop.Name + '</h3>'+
			'<p>Population: ' + TPop.PopName + '</p>'+
			'<p>TPop: ' + TPop.TPopFlurname + '</p>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">bearbeiten<\/a></p>"+
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
	for (i in BeobListe.rows) {
		Beob = BeobListe.rows[i];
		if (Beob.J_NOTE && Beob.M_NOTE > 0) {
			if (Beob.J_NOTE < 10) {
				Beob.J_NOTE = "0" + Beob.J_NOTE;
			}
			if (Beob.M_NOTE < 10) {
				Beob.M_NOTE = "0" + Beob.M_NOTE;
			}
			Datum = Beob.J_NOTE + "." + Beob.M_NOTE + "." + Beob.A_NOTE;
		} else {
			Datum = Beob.A_NOTE;
		}
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
			'<p>Koordinaten: ' + Beob.xGIS + ' / ' + Beob.yGIS + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneBeob('" + Beob.BeobId + "')\">Formular öffnen<\/a></p>"+
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
								jQuery("#tree").jstree("move_node", "[typ='beob']#" + Beob.BeobId, "[typ='tpop_ordner_tpopbeob']#" + data[0].TPopId, "first");
								//Den Marker der zugewiesenen Beobachtung entfernen
								that.setMap(null);
							},
							Nein: function() {
								$(this).dialog("close");
								//drag rückgängig machen
								lng = CHtoWGSlng(Beob.xGIS, Beob.yGIS);
								lat = CHtoWGSlat(Beob.xGIS, Beob.yGIS);
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
	var anzBeob, infowindow, TPop, lat, lng, latlng, options, map, bounds, markers, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, Kartenhoehe, Datum, titel, a_note;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("Karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	Kartenhoehe = $(window).height() - 50;
	infowindow = new google.maps.InfoWindow();
	$("#Karte").css("height", Kartenhoehe + "px");
	//Lat und Lng in BeobListe ergänzen
	for (i in BeobListe.rows) {
		Beob = BeobListe.rows[i];
		Beob.Lat = CHtoWGSlat(parseInt(Beob.xGIS), parseInt(Beob.yGIS));
		Beob.Lng = CHtoWGSlng(parseInt(Beob.xGIS), parseInt(Beob.yGIS));
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
	map = new google.maps.Map(document.getElementById("Karte"), options);
	//google.maps.event.trigger(map,'resize');
	bounds = new google.maps.LatLngBounds();
	//für alle Orte Marker erstellen
	markers = [];
	for (i in BeobListe.rows) {
		Beob = BeobListe.rows[i];
		if (Beob.J_NOTE && Beob.M_NOTE > 0) {
			if (Beob.J_NOTE < 10) {
				Beob.J_NOTE = "0" + Beob.J_NOTE;
			}
			if (Beob.M_NOTE < 10) {
				Beob.M_NOTE = "0" + Beob.M_NOTE;
			}
			Datum = Beob.J_NOTE + "." + Beob.M_NOTE + "." + Beob.A_NOTE;
		} else {
			Datum = Beob.A_NOTE;
		}
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
		marker.metadata = {typ: "beob", id: Beob.BeobId};
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
			'<p>Koordinaten: ' + Beob.xGIS + ' / ' + Beob.yGIS + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneBeob('" + Beob.BeobId + "')\">Formular öffnen<\/a></p>"+
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
	var anzBeob, infowindow, TPop, lat, lng, latlng, options, map, bounds, markers, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, Kartenhoehe, Datum, titel;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("Karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	Kartenhoehe = $(window).height() - 50;
	infowindow = new google.maps.InfoWindow();
	$("#Karte").css("height", Kartenhoehe + "px");
	//TPopListe bearbeiten:
	//Objekte löschen, die keine Koordinaten haben
	//Lat und Lng ergänzen
	for (i in TPopBeobListe.rows) {
		TPopBeob = TPopBeobListe.rows[i];
		TPopBeob.Lat = CHtoWGSlat(parseInt(TPopBeob.xGIS), parseInt(TPopBeob.yGIS));
		TPopBeob.Lng = CHtoWGSlng(parseInt(TPopBeob.xGIS), parseInt(TPopBeob.yGIS));
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
	map = new google.maps.Map(document.getElementById("Karte"), options);
	//Versuch: SVO einblenden
	//loadWMS(map, "http://www.gis.zh.ch/scripts/wmsFNSSVO2.asp?");
	bounds = new google.maps.LatLngBounds();
	//für alle Orte Marker erstellen
	markers = [];
	for (i in TPopBeobListe.rows) {
		TPopBeob = TPopBeobListe.rows[i];
		if (!TPopBeob.M_NOTE) {
			Datum = TPopBeob.A_NOTE;
		} else {
			if (TPopBeob.M_NOTE < 10) {
				Monat = "0" + TPopBeob.M_NOTE;
			} else {
				Monat = TPopBeob.M_NOTE;
			}
			if (TPopBeob.J_NOTE < 10) {
				Tag = "0" + TPopBeob.J_NOTE;
			} else {
				Tag = TPopBeob.J_NOTE;
			}
			Datum = TPopBeob.A_NOTE + "." + Monat + "." + Tag;
		}
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
		var Projekt = TPopBeob.Projekt || "(keines)";
		var Ort = TPopBeob.DESC_LOCALITE || "(keiner)";
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + Datum + '</h3>'+
			'<p>Autor: ' + Autor + '</p>'+
			'<p>Projekt: ' + Projekt + '</p>'+
			'<p>Ort: ' + Ort + '</p>'+
			'<p>Koordinaten: ' + TPopBeob.xGIS + ' / ' + TPopBeob.yGIS + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPopBeob('" + TPopBeob.BeobId + "')\">Formular öffnen<\/a></p>"+
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
	var anzTPop, infowindow, lat, lng, latlng, ZoomLevel, options, map, verorted, TPopId, latlng2, marker, contentString, mcOptions, markerCluster, Kartenhoehe, titel;
	//vor Erneuerung zeigen - sonst klappt Wiederaufruf nicht, wenn die Karte schon angezeigt ist
	zeigeFormular("Karte");
	window.markersArray = [];
	window.InfoWindowArray = [];
	Kartenhoehe = $(window).height() - 50;
	infowindow = new google.maps.InfoWindow();
	$("#Karte").css("height", Kartenhoehe + "px");
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
	mapcanvas = $('#Karte');
	map = new google.maps.Map(mapcanvas[0],options);
	if (verorted === true) {
		//title muss String sein
		if (TPop.TPopFlurname) {
			titel = TPop.TPopFlurname.toString();
		} else {
			titel = "";
		}
		marker = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: titel,
			icon: "img/flora_icon_rot.png",
			draggable: true
		});
		//Marker in Array speichern, damit er gelöscht werden kann
		markersArray.push(marker); 
		contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<h3>' + TPop.TPopFlurname + '</h3>'+
			'<p>Koordinaten: ' + TPop.TPopXKoord + ' / ' + TPop.TPopYKoord + '</p>'+
			"<p><a href=\"#\" onclick=\"oeffneTPop('" + TPop.TPopId + "')\">bearbeiten<\/a></p>"+
			'</div>'+
			'</div>';
		infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		InfoWindowArray.push(infowindow);
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
						"<p><a href=\"#\" onclick=\"oeffneTPop('" + localStorage.tpop_id + "')\">bearbeiten<\/a></p>"+
						'</div>'+
						'</div>';
					infowindow = new google.maps.InfoWindow({
						content: contentString
					});
					InfoWindowArray.push(infowindow);
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
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
	}
}

//GoogleMap: alle InfoWindows löschen
//benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
function clearInfoWindows() {
	if (InfoWindowArray) {
		for (i in InfoWindowArray) {
			InfoWindowArray[i].setMap(null);
		}
	}
}

function oeffneTPop(TPopId) {
	localStorage.tpop_id = TPopId;
	initiiere_tpop();
	jQuery.jstree._reference("[typ='tpop']#" + TPopId).deselect_all("[typ='tpop']#" + TPopId);
	jQuery("#tree").jstree("select_node", "[typ='tpop']#" + TPopId);
}

function oeffneBeob(BeobId) {
	localStorage.BeobId = BeobId;
	initiiere_beob();
	jQuery.jstree._reference("[typ='beob']#" + BeobId).deselect_all("[typ='beob']#" + BeobId);
	jQuery("#tree").jstree("select_node", "[typ='beob']#" + BeobId);
}

function oeffneTPopBeob(BeobId) {
	localStorage.tpopbeob_id = BeobId;
	initiiere_tpopbeob();
	jQuery.jstree._reference("[typ='tpopbeob']#" + BeobId).deselect_all("[typ='tpopbeob']#" + BeobId);
	jQuery("#tree").jstree("select_node", "[typ='tpopbeob']#" + BeobId);
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
	var wmsParams = [
	"REQUEST=GetMap",
	"SERVICE=WMS",
	"VERSION=1.1.1",
	"STYLES=default",
	"LAYERS=GISZH",
	"FORMAT=image/png",
	"TRANSPARENT=TRUE",
	"SRS=EPSG:4326",
	"WIDTH="+ tileWidth,
	"HEIGHT="+ tileHeight
	];

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