function initiiere_index() {
	$("#suchen").hide();
	//alle Formulare verstecken
	zeigeFormular();
	$("#loeschen_dialog").hide();
	//jQuery ui buttons initiieren
	$("#programm_wahl").buttonset();
	$("button").button();
	$("#tpopfeldkontr_tabs").tabs({
		show: function(event, ui) {
			setzeFeldbreiten();
		}
	});
	$("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0 });
	$("#TPopMassnDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopMassnJahr", altFormat: "yy", defaultDate: +0 });
	$("#ApBerDatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0 });
	$("#IbErstelldatum").datepicker({ dateFormat: "dd.mm.yy", defaultDate: +0 });
	//Auswahllisten aufbauen
	erstelle_ap_liste("programm_alle");
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
	setzeFeldbreiten();
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
					//Formulare blenden
					zeigeFormular("ap");
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
				$("#IbaassSisfNr").html(html);
			}
		});
	} else {
		$("#ApArtId").html(window.artliste_html);
		$("#IbaassSisfNr").html(window.artliste_html);
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
	setzeFeldbreiten();
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
				//Formulare blenden
				zeigeFormular("pop");
				//bei neuen Datensätzen Fokus steuern
				if (!$("#PopName").val()) {
					$("#PopName").focus();
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
	setzeFeldbreiten();
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
	setzeFeldbreiten();
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
	setzeFeldbreiten();
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
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ErfBeurtZielSkalaErreichungsgrad").val()) {
					$("#ErfBeurtZielSkalaErreichungsgrad").focus();
				}
			}
		}
	});
}

function initiiere_apber() {
	if (!localStorage.apber_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("apber");
	setzeFeldbreiten();
	//Daten für die apber aus der DB holen
	$.ajax({
		url: 'php/apber.php',
		dataType: 'json',
		data: {
			"id": localStorage.apber_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.apber = data;
				//Felder mit Daten beliefern
				$("#ApBerJahr").val(data.ApBerJahr);
				$("#ApBerSituation").val(data.ApBerSituation);
				$("#ApBerVergleichVorjahrGesamtziel").val(data.ApBerVergleichVorjahrGesamtziel);
				$("#ApBerBeurteilung" + data.ApBerBeurteilung).prop("checked", true);
				//escapen, + und - werden sonst verändert
				$("#ApBerVeraenGegenVorjahr\\" + data.ApBerVeraenGegenVorjahr).prop("checked", true);
				$("#ApBerAnalyse").val(data.ApBerAnalyse);
				$("#ApBerUmsetzung").val(data.ApBerUmsetzung);
				$("#ApBerErfko").val(data.ApBerErfko);
				$("#ApBerATxt").val(data.ApBerATxt);
				$("#ApBerBTxt").val(data.ApBerBTxt);
				$("#ApBerCTxt").val(data.ApBerCTxt);
				$("#ApBerDTxt").val(data.ApBerDTxt);
				if (data.ApBerDatum !== "01.01.1970") {
					//php macht aus einem Nullwert im Datum den 1.1.1970!!!
					$("#ApBerDatum").val(data.ApBerDatum);
				} else {
					$("#ApBerDatum").val("");
				}
				//ApBerBearb: Daten holen - oder vorhandene nutzen
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
								$("#ApBerBearb").html(html);
								$("#ApBerBearb").val(window.apber.ApBerBearb);
							}
						}
					});
				} else {
					$("#ApBerBearb").html(window.adressen_html);
					$("#ApBerBearb").val(window.apber.ApBerBearb);
				}
				//Formulare blenden
				zeigeFormular("apber");
				//bei neuen Datensätzen Fokus steuern
				if (!$("#ApBerJahr").val()) {
					$("#ApBerJahr").focus();
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
	setzeFeldbreiten();
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
				//$('#BerURLHref').attr('onClick', "document.location.href='" + data.BerURL + "';");
				//die Daten enthalten # an Anfang und Ende (Access-Macke)
				tempUrl = data.BerURL;
				if (data.BerURL && data.BerURL.slice(0, 1) === "#") {
					tempUrl = data.BerURL.slice(1, (data.BerURL.length -1));
				}
				$('#BerURLHref').attr('onClick', "window.open('" + tempUrl + "', target='_blank')");
				//Formulare blenden
				zeigeFormular("ber");
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

function initiiere_iballg() {
	if (!localStorage.ap_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("iballg");
	setzeFeldbreiten();
	//Daten für die iballg aus der DB holen
	$.ajax({
		url: 'php/iballg.php',
		dataType: 'json',
		data: {
			"id": localStorage.ap_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//iballg bereitstellen
				window.iballg = data;
				//Felder mit Daten beliefern
				if (data.IbErstelldatum !== "01.01.1970") {
					//php macht aus einem Nullwert im Datum den 1.1.1970!!!
					$("#IbErstelldatum").val(data.IbErstelldatum);
				}
				$("#IbHöhenlage").val(data.IbHöhenlage);
				$("#IbRegion").val(data.IbRegion);
				$("#IbExposition").val(data.IbExposition);
				$("#IbBesonnung").val(data.IbBesonnung);
				$("#IbHangneigung").val(data.IbHangneigung);
				$("#IbBodenTyp").val(data.IbBodenTyp);
				$("#IbBodenKalkgehalt").val(data.IbBodenKalkgehalt);
				$("#IbBodenDurchlässigkeit").val(data.IbBodenDurchlässigkeit);
				$("#IbBodenHumus").val(data.IbBodenHumus);
				$("#IbBodenNährstoffgehalt").val(data.IbBodenNährstoffgehalt);
				$("#IbWasserhaushalt").val(data.IbWasserhaushalt);
				$("#IbKonkurrenz").val(data.IbKonkurrenz);
				$("#IbMoosschicht").val(data.IbMoosschicht);
				$("#IbKrautschicht").val(data.IbKrautschicht);
				$("#IbStrauchschicht").val(data.IbStrauchschicht);
				$("#IbBaumschicht").val(data.IbBaumschicht);
				$("#IbBemerkungen").val(data.IbBemerkungen);
				//Formulare blenden
				zeigeFormular("iballg");
				//bei neuen Datensätzen Fokus steuern
				if (!$("#IbErstelldatum").val()) {
					$("#IbErstelldatum").focus();
				}
			} else {
				//null zurückgekommen > Datesatz schaffen
				$.ajax({
					url: 'php/iballg_insert.php',
					dataType: 'json',
					data: {
						"id": localStorage.ap_id,
						"user": sessionStorage.User
					},
					success: function (data) {
						initiiere_iballg();
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
			//noch kein Datensatz > einen anlegen
			$.ajax({
				url: 'php/iballg_insert.php',
				dataType: 'json',
				data: {
					"id": localStorage.ap_id,
					"user": sessionStorage.User
				},
				success: function (data) {
					initiiere_iballg();
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
	});
}

function initiiere_ibb() {
	if (!localStorage.ibb_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("ibb");
	setzeFeldbreiten();
	//Daten für die ibb aus der DB holen
	$.ajax({
		url: 'php/ibb.php',
		dataType: 'json',
		data: {
			"id": localStorage.ibb_id
		},
		success: function (data) {
			var tempUrl;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.ibb = data;
				//Felder mit Daten beliefern
				$("#IbbName").val(data.IbbName);
				//IbbVegTyp: Daten holen - oder vorhandene nutzen
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
								$("#IbbVegTyp").html(html);
								$("#IbbVegTyp").val(data.IbbVegTyp);
							}
						}
					});
				} else {
					$("#IbbVegTyp").html(window.lrdelarze_html);
					$("#IbbVegTyp").val(data.IbbVegTyp);
				}
				$("#IbbBewPflege").val(data.IbbBewPflege);
				$("#IbbBemerkungen").val(data.IbbBemerkungen);
				//Formulare blenden
				zeigeFormular("ibb");
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function () {
					if (!$("#IbbName").val()) {
						$("#IbbName").focus();
					}
				}, 100);
			}
		}
	});
}

function initiiere_ibartenassoz() {
	if (!localStorage.ibartenassoz_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_ap();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("ibartenassoz");
	setzeFeldbreiten();
	//Daten für die ibartenassoz aus der DB holen
	$.ajax({
		url: 'php/ibartenassoz.php',
		dataType: 'json',
		data: {
			"id": localStorage.ibartenassoz_id
		},
		success: function (data) {
			var tempUrl;
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//ap bereitstellen
				window.ibartenassoz = data;
				//Felder mit Daten beliefern
				$("#IbaassSisfNr").val(data.IbaassSisfNr);
				$("#IbaassBem").val(data.IbaassBem);
				//Formulare blenden
				zeigeFormular("ibartenassoz");
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function () {
					if (!$("#IbaassSisfNr").val()) {
						$("#IbaassSisfNr").focus();
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
	setzeFeldbreiten();
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
	setzeFeldbreiten();
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
				if (data.TPopHerkunftUnklar == -1) {
					$("#TPopHerkunftUnklar").prop("checked", true);
				} else {
					$("#TPopHerkunftUnklar").prop("checked", false);
				}
				$("#TPopHerkunftUnklarBegründung").val(data.TPopHerkunftUnklarBegründung);
				$("#TPopApBerichtRelevant" + data.TPopApBerichtRelevant).prop("checked", true);
				$("#TPopBekanntSeit").val(data.TPopBekanntSeit);
				$("#TPopFlurname").val(data.TPopFlurname);
				$("#TPopXKoord").val(data.TPopXKoord);
				$("#TPopYKoord").val(data.TPopYKoord);
				if (data.TPopPop == -1) {
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
				//bei neuen Datensätzen Fokus steuern
				if (!$("#TPopFlurname").val()) {
					$('#TPopFlurname').focus();
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
	setzeFeldbreiten();
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
	feldliste_feldkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrTyp', 'TPopKontrJungpfl', 'TPopKontrVitalitaet', 'TPopKontrUeberleb', 'TPopKontrEntwicklung', 'TPopKontrUrsach', 'TPopKontrUrteil', 'TPopKontrAendUms', 'TPopKontrAendKontr', 'TPopKontrGuid', 'TPopKontrFlaeche', 'TPopKontrVegTyp', 'TPopKontrKonkurrenz', 'TPopKontrMoosschicht', 'TPopKontrKrautschicht', 'TPopKontrStrauchschicht', 'TPopKontrBaumschicht', 'TPopKontrBodenTyp', 'TPopKontrBodenKalkgehalt', 'TPopKontrBodenDurchlässigkeit', 'TPopKontrBodenHumus', 'TPopKontrBodenNährstoffgehalt', 'TPopKontrBodenAbtrag', 'TPopKontrWasserhaushalt', 'TPopKontrHandlungsbedarf', 'TPopKontrIdealBiotopÜbereinst', 'TPopKontrLeb', 'TPopKontrLebUmg'];
	feldliste_freiwkontr = ['TPopKontrJahr', 'TPopKontrDatum', 'TPopKontrMethode1', 'TPopKontrAnz1', 'TPopKontrMethode2', 'TPopKontrAnz2', 'TPopKontrMethode3', 'TPopKontrAnz3', 'TPopKontrTxt', 'TPopKontrBearb', 'TPopKontrZaehleinheit1', 'TPopKontrZaehleinheit2', 'TPopKontrZaehleinheit3', 'TPopKontrPlan', 'TPopKontrÜbFläche', 'TPopKontrÜbPfl', 'TPopKontrNaBo', 'TPopKontrJungPflJN', 'TPopKontrVegHöMax', 'TPopKontrVegHöMit', 'TPopKontrGefährdung'];
	//Felder zurücksetzen
	leereFelderVonFormular("tpopfeldkontr");
	setzeFeldbreiten();
	//alle Felder ausblenden. Später werden die benötigten eingeblendet
	blendeFelderVonFormularAus("tpopfeldkontr");
	//Daten für die pop aus der DB holen
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
				if (!localStorage.freiwkontr) {
					$("#TPopKontrTyp" + data.TPopKontrTyp).prop("checked", true);
					$("#TPopKontrJungpfl").val(data.TPopKontrJungpfl);
					$("#TPopKontrVitalitaet").val(data.TPopKontrVitalitaet);
					$("#TPopKontrUeberleb").val(data.TPopKontrUeberleb);
					$("#TPopKontrEntwicklung" + data.TPopKontrEntwicklung).prop("checked", true);
					$("#TPopKontrUrsach").val(data.TPopKontrUrsach);
					$("#TPopKontrUrteil").val(data.TPopKontrUrteil);
					$("#TPopKontrAendUms").val(data.TPopKontrAendUms);
					$("#TPopKontrAendKontr").val(data.TPopKontrAendKontr);
					$("#TPopKontrGuid").val(data.TPopKontrGuid);
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
					$("#TPopKontrBodenDurchlässigkeit").val(data.TPopKontrBodenDurchlässigkeit);
					$("#TPopKontrBodenHumus").val(data.TPopKontrBodenHumus);
					$("#TPopKontrBodenNährstoffgehalt").val(data.TPopKontrBodenNährstoffgehalt);
					$("#TPopKontrBodenAbtrag").val(data.TPopKontrBodenAbtrag);
					$("#TPopKontrWasserhaushalt").val(data.TPopKontrWasserhaushalt);
					$("#TPopKontrHandlungsbedarf").val(data.TPopKontrHandlungsbedarf);
					$("#TPopKontrIdealBiotopÜbereinst" + data.TPopKontrIdealBiotopÜbereinst).prop("checked", true);
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
				//Felder, die nur in freiwkontr vorkommen
				if (localStorage.freiwkontr) {
					if (data.TPopKontrPlan == -1) {
						$("#TPopKontrPlan").prop("checked", true);
					} else {
						$("#TPopKontrPlan").prop("checked", false);
					}
					$("#TPopKontrÜbFläche").val(data.TPopKontrÜbFläche);
					$("#TPopKontrÜbPfl").val(data.TPopKontrÜbPfl);
					$("#TPopKontrNaBo").val(data.TPopKontrNaBo);
					if (data.TPopKontrJungPflJN == -1) {
						$("#TPopKontrJungPflJN").prop("checked", true);
					} else {
						$("#TPopKontrJungPflJN").prop("checked", false);
					}
					$("#TPopKontrVegHöMax").val(data.TPopKontrVegHöMax);
					$("#TPopKontrVegHöMit").val(data.TPopKontrVegHöMit);
					$("#TPopKontrGefährdung").val(data.TPopKontrGefährdung);
				}
				//benötigte Felder einblenden
				if (localStorage.freiwkontr) {
					blendeFelderEin(feldliste_freiwkontr);
				} else {
					blendeFelderEin(feldliste_feldkontr);
				}
				//Formulare blenden
				zeigeFormular("tpopfeldkontr");
				//Register in Feldkontr blenden
				if (localStorage.freiwkontr) {
					$("#tpopfeldkontr_tabs_biotop").show();
					$("#biotop_tab_li").hide();
				} else {
					$("#tpopfeldkontr_tabs_biotop").show();
					$("#biotop_tab_li").show();
				}
				//bei neuen Freiwilligen-Kontrollen Fokus steuern
				if (localStorage.freiwkontr) {
					if (!$("#TPopKontrJahr").val()) {
						setTimeout(function() {
							$("#TPopKontrJahr").focus();
						}, 100);
					}
				} else {
					setTimeout(function() {
						$("#TPopKontrTyp").focus();
					}, 100);
				}
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
	setzeFeldbreiten();
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
				if (data.TPopMassnPlan == -1) {
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
						}
					});
				} else {
					$("#TPopMassnAnsiedWirtspfl").html(window.artliste_html);
				}
				$("#TPopMassnAnsiedHerkunftPop").val(data.TPopMassnAnsiedHerkunftPop);
				$("#TPopMassnAnsiedDatSamm").val(data.TPopMassnAnsiedDatSamm);
				$("#TPopMassnGuid").val(data.TPopMassnGuid);
				//Formulare blenden
				zeigeFormular("tpopmassn");
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#TPopMassnTyp').focus();
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
	setzeFeldbreiten();
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
	setzeFeldbreiten();
	//Daten für die tpopbeob aus der DB holen
	$.ajax({
		url: 'php/tpopbeob.php',
		dataType: 'json',
		data: {
			"id": localStorage.tpopbeob_id
		},
		success: function (data) {
			//Rückgabewert null wird offenbar auch als success gewertet, gibt weiter unten Fehler, also Ausführung verhindern
			if (data) {
				//tpopbeob bereitstellen
				window.tpopbeob = data;
				//Felder mit Daten beliefern
				$("#tpopbeob_ArtName").val(data.Name + " " + data.StatusText);
				$("#IdZdsf").val(data.IdZdsf);
				$("#IdEvab").val(data.IdEvab);
				$("#Projekt").val(data.Projekt);
				$("#RaumGde").val(data.RaumGde);
				$("#Ort").val(data.Ort);
				$("#X").val(data.X);
				$("#Y").val(data.Y);
				$("#Datum").val(data.Datum);
				$("#Jahr").val(data.Jahr);
				$("#Anzahl").val(data.Anzahl);
				$("#Autor").val(data.Autor);
				$("#Herkunft").val(data.Herkunft);
				$("#DistZurTPop").val(data.DistZurTPop);
				//Formulare blenden
				zeigeFormular("tpopbeob");
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
	setzeFeldbreiten();
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
				//bei neuen Datensätzen Fokus steuern
				setTimeout(function() {
					$('#TPopMassnBerJahr').focus();
				}, 100);
			}
		}
	});
}

//managed die Sichtbarkeit von Formularen
//wird von allen initiiere_-Funktionen verwendet
//wird ein Formularname übergeben, wird dieses Formular gezeigt
//und alle anderen ausgeblendet
function zeigeFormular(Formularname) {
	if (Formularname) {
		$("#forms").show();
		$('form').each(function() {
			if ($(this).attr("id") === Formularname) {
				$(this).show();
			} else {
				$(this).hide();
			}
			
		});
	} else {
		$("#forms").hide();
		$('form').each(function() {
			$(this).hide();
		});
	}
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

function setzeFeldbreiten() {
	$('#forms input[type="text"], #forms input[type="url"], #forms select, #forms textarea').each(function() {
		if ($(this).attr("formular") === "tpopfeldkontr") {
			//hier hats tabs, Felder müssen schmaler sein als normal
			$(this).width($(window).width() - 715);
		} else if ($(this).attr("formular") === "iballg") {
			//hier hats fieldsets, Felder müssen schmaler sein als normal
			$(this).width($(window).width() - 690);
		} else {
			$(this).width($(window).width() - 650);
		}
	});
	//Zahlenfelder sollen nicht breiter als 200px sein
	$('#forms input[type="number"]').each(function() {
		if ($(this).attr("formular") === "tpopfeldkontr") {
			//hier hats tabs, Felder müssen schmaler sein als normal
			if (($(window).width() - 715) > 200) {
				$(this).width(200);
			} else {
				$(this).width($(window).width() - 715);
			}
		} else if ($(this).attr("formular") === "iballg") {
			//hier hats fieldsets, Felder müssen schmaler sein als normal
			if (($(window).width() - 690) > 200) {
				$(this).width(200);
			} else {
				$(this).width($(window).width() - 690);
			}
		} else {
			if (($(window).width() - 650) > 200) {
				$(this).width(200);
			} else {
				$(this).width($(window).width() - 650);
			}
		}
	});
}

/*function setzeFeldbreiten() {
	$('#forms input[type="text"]:visible, #forms input[type="number"]:visible, #forms select:visible, #forms textarea:visible').each(function() {
		if ($(this).attr("formular") !== "tpopfeldkontr") {
			$(this).width($(window).width() - 640);
		} else {
			$(this).width($(window).width() - 715);
		}
	});
}*/

//wird benutzt von Formular Feldkontrolle
function blendeFelderVonFormularAus(Formular) {
	$('#' + Formular + ' .fieldcontain').each(function() {
		$(this).hide();
	});
}

//übernimmt einen Array mit Feldnamen
//blendet die fieldcontain-divs dieser Felder ein
//wird benutzt von Formular Feldkontrolle
function blendeFelderEin(Felderarray) {
	for (i in Felderarray) {
		if (typeof i !== "function") {
			$("." + Felderarray[i]).show();
		}
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
				loading: "hole Daten...",
				new_node: "neuer Knoten"
			},
		},
		"ui": {
			"select_limit": 1,	//nur ein Datensatz kann aufs mal gewählt werden
			"selected_parent_open": true,	//wenn Code einen node wählt, werden alle parents geöffnet
		},
		"search": {
			"case_insensitive": true
		},
		"themes": {
			"icons": false
		},
		"contextmenu": {
			"items": treeKontextmenu,
			"select_node": true
		},"types": {
			"default": {
				"select_node": function(e) {
					this.correct_state(e);
					this.toggle_node(e);
					return false;
				}
			}
		},
		"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "contextmenu", "types"]
	})
	.show()
	.bind("select_node.jstree", function (e, data) {
		var node;
		delete localStorage.freiwkontr;	//Erinnerung an letzten Klick im Baum löschen
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
		} else if (node.attr("typ") === "apber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#apber").is(':visible') || localStorage.apber_id !== node.attr("id")) {
				localStorage.apber_id = node.attr("id");
				initiiere_apber();
			}
		} else if (node.attr("typ") === "ber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ber").is(':visible') || localStorage.ber_id !== node.attr("id")) {
				localStorage.ber_id = node.attr("id");
				initiiere_ber();
			}
		} else if (node.attr("typ") === "iballg") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#iballg").is(':visible')) {
				//eigene id nicht nötig
				//1:1 mit ap verbunden, gleich id
				//wenn noch kein Datensatz existiert erstellt ihn initiiere_iballg
				initiiere_iballg();
			}
		} else if (node.attr("typ") === "ibb") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ibb").is(':visible') || localStorage.ibb_id !== node.attr("id")) {
				localStorage.ibb_id = node.attr("id");
				initiiere_ibb();
			}
		} else if (node.attr("typ") === "ibartenassoz") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ibartenassoz").is(':visible') || localStorage.ibartenassoz_id !== node.attr("id")) {
				localStorage.ibartenassoz_id = node.attr("id");
				initiiere_ibartenassoz();
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
				localStorage.freiwkontr = true;
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
		} else if (node.attr("typ") === "tpopmassnber") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#tpopmassnber").is(':visible') || localStorage.tpopmassnber_id !== node.attr("id")) {
				localStorage.tpopmassnber_id = node.attr("id");
				initiiere_tpopmassnber();
			}
		} else {
			//bei apzieljahren und zielber kommt kein Formular
			$("#Meldung").html("Diese Seite ist noch nicht gebaut");
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
	$("#suchen").show();
}

function treeKontextmenu(node) {
	var items, aktiver_node, parent_node, grandparent_node, neue_apziele_node;
	//relevante nodes zwischenspeichern
	aktiver_node = node;
	aktiver_nodeText = jQuery.jstree._reference(aktiver_node).get_text(aktiver_node);
	if ($(aktiver_node).attr("typ").slice(0, 9) !== "ap_ordner") {
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
					$.ajax({
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"typ": "pop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Population";
							} else {
								anzTxt = anz + " Populationen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "ap_ordner_apziel":
		items = {
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function () {
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
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li > ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " AP-Ziel";
							} else {
								anzTxt = anz + " AP-Ziele";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//jetzt Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "0 Ziel-Berichte",
								"attr": {
									"id": data,
									"typ": "ziel_ordner"
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
			}
		};
		return items;
	case "apzieljahr":
		items = {
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax( {
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "apziel",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li > ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " AP-Ziel";
							} else {
								anzTxt = anz + " AP-Ziele";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							//aktiver Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							anzTxt = jQuery.jstree._reference(aktiver_node).get_text(aktiver_node).slice(0, 6);
							anzTxt += anz;
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							//jetzt Unterordner anlegen
							jQuery.jstree._reference(NeuerNode).create_node(NeuerNode, "last", {
								"data": "0 Ziel-Berichte",
								"attr": {
									"id": data,
									"typ": "ziel_ordner"
								}
							});
							initiiere_apziel();
							//IDEE: JETZT DAS JAHR EINFÜGEN
							setTimeout(function() {
								$("#ZielJahr").val(jQuery.jstree._reference(aktiver_node).get_text(aktiver_node).slice(0, 4));
								var Objekt = {};
								Objekt.name = "ZielJahr";
								Objekt.formular = "apziel";
								speichern(Objekt);
								$("#ZielTyp").focus();
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
			}
		};
		return items;
	case "apziel":
		items = {
			"neu": {
				"label": "neues Ziel",
				"icon": "style/images/neu.png",
				"action": function () {
					grandparent_node = jQuery.jstree._reference(parent_node)._get_parent(parent_node);
					$.ajax( {
						url: 'php/apziel_insert.php',
						dataType: 'json',
						data: {
							"id": $(grandparent_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(grandparent_node).find("> ul > li > ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " AP-Ziel";
							} else {
								anzTxt = anz + " AP-Ziele";
							}
							jQuery.jstree._reference(grandparent_node).rename_node(grandparent_node, anzTxt);
							//parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							anzTxt = jQuery.jstree._reference(parent_node).get_text(parent_node).slice(0, 6);
							anzTxt += anz;
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
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
										var anz, anzTxt;
										delete localStorage.apziel_id;
										delete window.apziel;
										jQuery.jstree._reference(aktiver_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//grandparent Node-Beschriftung: Anzahl anpassen
										grandparent_node = jQuery.jstree._reference(parent_node)._get_parent(parent_node);
										anz = $(grandparent_node).find("> ul > li > ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " AP-Ziel";
										} else {
											anzTxt = anz + " AP-Ziele";
										}
										jQuery.jstree._reference(grandparent_node).rename_node(grandparent_node, anzTxt);
										//parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										anzTxt = jQuery.jstree._reference(parent_node).get_text(parent_node).slice(0, 6);
										anzTxt += anz;
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "zielber_ordner":
		items = {
			"neu": {
				"label": "neuer Ziel-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/zielber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Ziel-Bericht";
							} else {
								anzTxt = anz + " Ziel-Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "zielber":
		items = {
			"neu": {
				"label": "neuer Ziel-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/zielber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "zielber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Ziel-Bericht";
							} else {
								anzTxt = anz + " Ziel-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
										var anz, anzTxt;
										delete localStorage.zielber_id;
										delete window.zielber;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Ziel-Bericht";
										} else {
											anzTxt = anz + " Ziel-Berichte";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "ap_ordner_erfkrit":
		items = {
			"neu": {
				"label": "neues Erfolgskriterium",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/erfkrit_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Erfolgskriterium";
							} else {
								anzTxt = anz + " Erfolgskriterien";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "erfkrit":
		items = {
			"neu": {
				"label": "neues Erfolgskriterium",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/erfkrit_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "erfkrit",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Erfolgskriterium";
							} else {
								anzTxt = anz + " Erfolgskriterien";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
										var anz, anzTxt;
										delete localStorage.erfkrit_id;
										delete window.erfkrit;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Erfolgskriterium";
										} else {
											anzTxt = anz + " Erfolgskriterien";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "ap_ordner_apber":
		items = {
			"neu": {
				"label": "neuer AP-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/apber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.apber_id = data;
							delete window.apber;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neuer AP-Bericht",
								"attr": {
									"id": data,
									"typ": "apber"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " AP-Bericht";
							} else {
								anzTxt = anz + " AP-Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_apber();
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
			}
		};
		return items;
	case "apber":
		items = {
			"neu": {
				"label": "Neuer AP-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/apber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "apber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.apber_id = data;
							delete window.apber;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "Neuer AP-Bericht",
								"attr": {
									"id": data,
									"typ": "apber"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " AP-Bericht";
							} else {
								anzTxt = anz + " AP-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_apber();
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
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Der AP-Bericht \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" wird unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/apber_delete.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.apber_id;
										delete window.apber;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " AP-Bericht";
										} else {
											anzTxt = anz + " AP-Berichte";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "ap_ordner_ber":
		items = {
			"neu": {
				"label": "neuer Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/ber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Bericht";
							} else {
								anzTxt = anz + " Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/ber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "ber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Bericht";
							} else {
								anzTxt = anz + " Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
										var anz, anzTxt;
										delete localStorage.ber_id;
										delete window.ber;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Bericht";
										} else {
											anzTxt = anz + " Berichte";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "ap_ordner_ibb":
		items = {
			"neu": {
				"label": "neues Idealbiotop",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/ibb_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.ibb_id = data;
							delete window.ibb;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neues Idealbiotop",
								"attr": {
									"id": data,
									"typ": "ibb"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Idealbiotop";
							} else {
								anzTxt = anz + " Idealbiotope";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_ibb();
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
			}
		};
		return items;
	case "ibb":
		items = {
			"neu": {
				"label": "Neues Idealbiotop",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/ibb_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "ibb",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.ibb_id = data;
							delete window.ibb;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "Neues Idealbiotop",
								"attr": {
									"id": data,
									"typ": "ibb"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Idealbiotop";
							} else {
								anzTxt = anz + " Idealbiotope";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_ibb();
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
									url: 'php/ibb_delete.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.ibb_id;
										delete window.ibb;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Idealbiotop";
										} else {
											anzTxt = anz + " Idealbiotope";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "ap_ordner_ibartenassoz":
		items = {
			"neu": {
				"label": "neue assoziierte Art",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/ibartenassoz_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.ibartenassoz_id = data;
							delete window.ibartenassoz;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue assoziierte Art",
								"attr": {
									"id": data,
									"typ": "ibartenassoz"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " assoziierte Art";
							} else {
								anzTxt = anz + " assoziierte Arten";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_ibartenassoz();
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
			}
		};
		return items;
	case "ibartenassoz":
		items = {
			"neu": {
				"label": "neue assoziierte Art",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/ibartenassoz_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "ibartenassoz",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.ibartenassoz_id = data;
							delete window.ibartenassoz;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue assoziierte Art",
								"attr": {
									"id": data,
									"typ": "ibartenassoz"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " assoziierte Art";
							} else {
								anzTxt = anz + " assoziierte Arten";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							initiiere_ibartenassoz();
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
									url: 'php/ibartenassoz_delete.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.ibartenassoz_id;
										delete window.ibartenassoz;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " assoziierte Art";
										} else {
											anzTxt = anz + " assoziierte Arten";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "pop":
		items = {
			"neu": {
				"label": "neue Population",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax( {
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "pop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Population";
							} else {
								anzTxt = anz + " Populationen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(parent_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Population \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" und alle darunter befindlichen Knoten werden unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/pop_delete.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.pop_id;
										delete window.pop;
										jQuery.jstree._reference(aktiver_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Population";
										} else {
											anzTxt = anz + " Populationen";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_ap();
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
			}
		};
		return items;
	case "pop_ordner_tpop":
		items = {
			"neu": {
				"label": "neue Teilpopulation",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"typ": "tpop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		if (window.tpop_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpop_node_ausgeschnitten).get_text(window.tpop_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpop_einfuegen.php',
						dataType: 'json',
						data: {
							"pop_id": $(aktiver_node).attr("id"),
							"tpop_id": $(window.tpop_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(aktiver_node).move_node(window.tpop_node_ausgeschnitten, aktiver_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(aktiver_node).select_node(window.tpop_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpop_id = $(window.tpop_node_ausgeschnitten).attr("id");
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
		}
		if (window.tpop_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpop_node_kopiert).get_text(window.tpop_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
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
							var NeuerNode, anz, anzTxt;
							localStorage.tpop_id = data;
							delete window.tpop;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": window.tpop_objekt_kopiert.TPopFlurname,
								"attr": {
									"id": data,
									"typ": "tpop"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		}
		return items;
	case "tpop":
		items = {
			"neu": {
				"label": "neue Teilpopulation",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "tpop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					//selektieren, falls direkt mit der rechten Maustaste gewählt wurde
					jQuery.jstree._reference(aktiver_node).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(aktiver_node).open_all(aktiver_node);
					jQuery.jstree._reference(aktiver_node).deselect_all();
					jQuery.jstree._reference(aktiver_node).select_node(aktiver_node);
					$("#loeschen_dialog_mitteilung").html("Die Teilpopulation \"" + jQuery.jstree._reference(aktiver_node).get_text(aktiver_node) + "\" und alle darunter befindlichen Knoten werden unwiederbringlich gelöscht.");
					$("#loeschen_dialog").dialog({
						resizable: false,
						height:'auto',
						width: 400,
						modal: true,
						buttons: {
							"ja, löschen!": function() {
								$(this).dialog("close");
								$.ajax({
									url: 'php/tpop_delete.php',
									dataType: 'json',
									data: {
										"id": $(aktiver_node).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.tpop_id;
										delete window.tpop;
										jQuery.jstree._reference(parent_node).deselect_all();
										jQuery.jstree._reference(parent_node).select_node(parent_node);
										jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(parent_node).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Teilpopulation";
										} else {
											anzTxt = anz + " Teilpopulationen";
										}
										jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
										initiiere_pop();
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
			}
		};
		if (!window.tpop_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
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
					$.ajax({
						url: 'php/tpop_einfuegen.php',
						dataType: 'json',
						data: {
							"pop_id": $(parent_node).attr("id"),
							"tpop_id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
							jQuery.jstree._reference(parent_node).move_node(window.tpop_node_ausgeschnitten, parent_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(window.tpop_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpop_id = $(window.tpop_node_ausgeschnitten).attr("id");
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
		}
		if (window.tpop_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpop_node_kopiert).get_text(window.tpop_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
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
							var NeuerNode, anz, anzTxt;
							localStorage.tpop_id = data;
							delete window.tpop;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": window.tpop_objekt_kopiert.TPopFlurname,
								"attr": {
									"id": data,
									"typ": "tpop"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		}
		return items;
	case "pop_ordner_popber":
		items = {
			"neu": {
				"label": "neuer Populations-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/popber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Populations-Bericht";
							} else {
								anzTxt = anz + " Populations-Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "popber":
		items = {
			"neu": {
				"label": "neuer Populations-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/popber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "popber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Populations-Bericht";
							} else {
								anzTxt = anz + " Populations-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/popber_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.popber_id;
							delete window.popber;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Populations-Bericht";
							} else {
								anzTxt = anz + " Populations-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
					$.ajax({
						url: 'php/popmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahmen-Bericht";
							} else {
								anzTxt = anz + " Massnahmen-Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "popmassnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/popmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "popmassnber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahmen-Bericht";
							} else {
								anzTxt = anz + " Massnahmen-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/popmassnber_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.popmassnber_id;
							delete window.popmassnber;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahmen-Bericht";
							} else {
								anzTxt = anz + " Massnahmen-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		if (window.tpopfeldkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_ausgeschnitten).get_text(window.tpopfeldkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopfeldkontr_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(aktiver_node).attr("id"),
							"tpopfeldkontr_id": $(window.tpopfeldkontr_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(aktiver_node).move_node(window.tpopfeldkontr_node_ausgeschnitten, aktiver_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(aktiver_node).select_node(window.tpopfeldkontr_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopfeldkontr_id = $(window.tpopfeldkontr_node_ausgeschnitten).attr("id");
							delete window.tpopfeldkontr;
							delete window.tpopfeldkontr_node_ausgeschnitten;
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
		}
		if (window.tpopfeldkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_kopiert).get_text(window.tpopfeldkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
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
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": window.tpopfeldkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
				"label": "löschen",
				"separator_before": true,
				"icon": "style/images/loeschen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopfeldkontr_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopfeldkontr_id;
							delete window.tpopfeldkontr;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
				}
			}
		};
		if (!window.tpopfeldkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
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
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
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
					$.ajax({
						url: 'php/tpopfeldkontr_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(parent_node).attr("id"),
							"tpopfeldkontr_id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
							jQuery.jstree._reference(parent_node).move_node(window.tpopfeldkontr_node_ausgeschnitten, parent_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(window.tpopfeldkontr_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopfeldkontr_id = $(window.tpopfeldkontr_node_ausgeschnitten).attr("id");
							delete window.tpopfeldkontr;
							delete window.tpopfeldkontr_node_ausgeschnitten;
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
		}
		if (window.tpopfeldkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfeldkontr_node_kopiert).get_text(window.tpopfeldkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
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
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"typ": "tpopfreiwkontr",
							"user": sessionStorage.User,
							"TPopKontrTyp": "Freiwilligen-Erfolgskontrolle"
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							localStorage.freiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": "neue Freiwilligen-Kontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		if (window.tpopfreiwkontr_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_ausgeschnitten).get_text(window.tpopfreiwkontr_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopfeldkontr_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(aktiver_node).attr("id"),
							"tpopfeldkontr_id": $(window.tpopfreiwkontr_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(aktiver_node).move_node(window.tpopfreiwkontr_node_ausgeschnitten, aktiver_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(aktiver_node).select_node(window.tpopfreiwkontr_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopfeldkontr_id = $(window.tpopfreiwkontr_node_ausgeschnitten).attr("id");
							delete window.tpopfeldkontr;
							delete window.tpopfreiwkontr_node_ausgeschnitten;
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
		}
		if (window.tpopfreiwkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_kopiert).get_text(window.tpopfreiwkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
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
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							localStorage.freiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": tpopfreiwkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "tpopfreiwkontr",
							"user": sessionStorage.User,
							"TPopKontrTyp": "Freiwilligen-Erfolgskontrolle"
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							localStorage.tpopfreiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(parent_node).create_node(parent_node, "last", {
								"data": "neue Freiwilligen-Kontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopfeldkontr_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopfeldkontr_id;
							delete localStorage.freiwkontr;
							delete window.tpopfeldkontr;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
				}
			}
		};
		if (!window.tpopfreiwkontr_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
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
					$.ajax({
						url: 'php/tpopfeldkontr_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(parent_node).attr("id"),
							"tpopfeldkontr_id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
							jQuery.jstree._reference(parent_node).move_node(window.tpopfreiwkontr_node_ausgeschnitten, parent_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(window.tpopfreiwkontr_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopfeldkontr_id = $(window.tpopfreiwkontr_node_ausgeschnitten).attr("id");
							delete window.tpopfeldkontr;
							delete window.tpopfreiwkontr_node_ausgeschnitten;
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
		}
		if (window.tpopfreiwkontr_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopfreiwkontr_node_kopiert).get_text(window.tpopfreiwkontr_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					var dataUrl;
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
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopmassn_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		if (window.tpopmassn_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_ausgeschnitten).get_text(window.tpopmassn_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopmassn_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(aktiver_node).attr("id"),
							"tpopmassn_id": $(window.tpopmassn_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(aktiver_node).move_node(window.tpopmassn_node_ausgeschnitten, aktiver_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(aktiver_node).select_node(window.tpopmassn_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopmassn_id = $(window.tpopmassn_node_ausgeschnitten).attr("id");
							delete window.tpopmassn;
							delete window.tpopmassn_node_ausgeschnitten;
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
		}
		if (window.tpopmassn_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_kopiert).get_text(window.tpopmassn_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
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
							var NeuerNode, anz, anzTxt;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(aktiver_node).create_node(aktiver_node, "last", {
								"data": window.tpopmassn_objekt_kopiert.TPopMassnJahr,
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopmassn_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopmassn_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopmassn_id;
							delete window.tpopmassn;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
				}
			}
		};
		if (!window.tpopmassn_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
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
					$.ajax({
						url: 'php/tpopmassn_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(parent_node).attr("id"),
							"tpopmassn_id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
							jQuery.jstree._reference(parent_node).move_node(window.tpopmassn_node_ausgeschnitten, parent_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(window.tpopmassn_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopmassn_id = $(window.tpopmassn_node_ausgeschnitten).attr("id");
							delete window.tpopmassn;
							delete window.tpopmassn_node_ausgeschnitten;
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
		}
		if (window.tpopmassn_node_kopiert) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopmassn_node_kopiert).get_text(window.tpopmassn_node_kopiert) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
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
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulations-Bericht";
							} else {
								anzTxt = anz + " Teilpopulations-Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "tpopber":
		items = {
			"neu": {
				"label": "neuer Teilpopulations-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "tpopber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulations-Bericht";
							} else {
								anzTxt = anz + " Teilpopulations-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopber_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopber_id;
							delete window.tpopber;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulations-Bericht";
							} else {
								anzTxt = anz + " Teilpopulations-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
				}
			}
		};
		return items;
	case "tpop_ordner_tpopbeob":
		if (window.tpopbeob_node_ausgeschnitten) {
			items = {};
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopbeob_node_ausgeschnitten).get_text(window.tpopbeob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopbeob_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(aktiver_node).attr("id"),
							"tpopbeob_id": $(window.tpopbeob_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(aktiver_node).move_node(window.tpopbeob_node_ausgeschnitten, aktiver_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Beobachtung";
							} else {
								anzTxt = anz + " Beobachtungen";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(aktiver_node).select_node(window.tpopbeob_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopbeob_id = $(window.tpopbeob_node_ausgeschnitten).attr("id");
							delete window.tpopbeob;
							delete window.tpopbeob_node_ausgeschnitten;
							//jetzt die neue Distanz zur Teilpopulation berechnen und speichern
							setzeDistanzZurTeilpop(localStorage.tpopbeob_id, localStorage.tpop_id);
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
		}
		return items;
	case "tpopbeob":
		items = {};
		if (!window.tpopbeob_node_ausgeschnitten) {
			items.ausschneiden = {
				"label": "ausschneiden",
				"separator_before": true,
				"icon": "style/images/ausschneiden.png",
				"action": function () {
					window.tpopbeob_node_ausgeschnitten = aktiver_node;
				}
			}
		}
		if (window.tpopbeob_node_ausgeschnitten) {
			items.einfuegen = {
				"label": jQuery.jstree._reference(window.tpopbeob_node_ausgeschnitten).get_text(window.tpopbeob_node_ausgeschnitten) + " einfügen",
				"separator_before": true,
				"icon": "style/images/einfuegen.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopbeob_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(parent_node).attr("id"),
							"tpopbeob_id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							parent_node = jQuery.jstree._reference(aktiver_node)._get_parent(aktiver_node);
							jQuery.jstree._reference(parent_node).move_node(window.tpopbeob_node_ausgeschnitten, parent_node, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Beobachtung";
							} else {
								anzTxt = anz + " Beobachtungen";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(window.tpopbeob_node_ausgeschnitten);
							//Variabeln aufräumen
							localStorage.tpopbeob_id = $(window.tpopbeob_node_ausgeschnitten).attr("id");
							delete window.tpopbeob;
							delete window.tpopbeob_node_ausgeschnitten;
							//jetzt die neue Distanz zur Teilpopulation berechnen und speichern
							setzeDistanzZurTeilpop(localStorage.tpopbeob_id, localStorage.tpop_id);
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
		}
		return items;










	case "tpop_ordner_massnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id"),
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(aktiver_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahmen-Bericht";
							} else {
								anzTxt = anz + " Massnahmen-Berichte";
							}
							jQuery.jstree._reference(aktiver_node).rename_node(aktiver_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
			}
		};
		return items;
	case "tpopmassnber":
		items = {
			"neu": {
				"label": "neuer Massnahmen-Bericht",
				"icon": "style/images/neu.png",
				"action": function () {
					$.ajax({
						url: 'php/tpopmassnber_insert.php',
						dataType: 'json',
						data: {
							"id": $(parent_node).attr("id"),
							"typ": "tpopmassnber",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
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
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahmen-Bericht";
							} else {
								anzTxt = anz + " Massnahmen-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
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
					$.ajax({
						url: 'php/tpopmassnber_delete.php',
						dataType: 'json',
						data: {
							"id": $(aktiver_node).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopmassnber_id;
							delete window.tpopmassnber;
							jQuery.jstree._reference(aktiver_node).deselect_all();
							jQuery.jstree._reference(parent_node).select_node(parent_node);
							jQuery.jstree._reference(aktiver_node).delete_node(aktiver_node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(parent_node).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahmen-Bericht";
							} else {
								anzTxt = anz + " Massnahmen-Berichte";
							}
							jQuery.jstree._reference(parent_node).rename_node(parent_node, anzTxt);
							initiiere_tpop();
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
				}
			}
		};
		return items;
	}
}

//übernimmt id von tpopbeob und Objekt von tpop
//Berechnet den Abstand der beob von der tpop
//aktualisiert den Wert in der DB
//und aktualisiert ihn im Feld?
function setzeDistanzZurTeilpop(tpopbeob_id, tpop_id) {
	var Distanz;
	$.ajax({
		url: 'php/tpop.php',
		dataType: 'json',
		data: {
			"id": tpop_id
		},
		success: function (tpop) {
			$.ajax({
				url: 'php/tpopbeob.php',
				dataType: 'json',
				data: {
					"id": tpopbeob_id
				},
				success: function (tpopbeob) {
					Distanz = Math.floor(Math.sqrt((tpop.TPopXKoord - tpopbeob.X)*(tpop.TPopXKoord - tpopbeob.X) + (tpop.TPopYKoord - tpopbeob.Y)*(tpop.TPopYKoord - tpopbeob.Y)));
					$.ajax({
						url: 'php/tpopbeob_update.php',
						dataType: 'json',
						data: {
							"id": tpopbeob.BeobId,
							"Feld": "DistZurTPop",
							"Wert": Distanz,
							"user": sessionStorage.User
						},
						success: function () {
							$("#DistZurTPop").val(Distanz);
						},
						error: function () {
							$("#Meldung").html("Fehler: Die Distanz zur Teilpopulation wurde nicht aktualisiert");
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
					$("#Meldung").html("Fehler: Die Distanz zur Teilpopulation wurde nicht aktualisiert");
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
			$("#Meldung").html("Fehler: Die Distanz zur Teilpopulation wurde nicht aktualisiert");
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
	if (Feldname === "TPopHerkunftUnklar" || Feldname === "TPopPop" || Feldname === "TPopMassnPlan") {
		if (Feldwert) {
			Feldwert = -1;
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
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_pop'] #" + localStorage.pop_id, Feldwert);
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
			jQuery("#tree").jstree("rename_node", "[typ='pop_ordner_tpop'] #" + localStorage.tpop_id, Feldwert);
			break;
		case "TPopKontrJahr":
			if (localStorage.freiwkontr) {
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_freiwkontr'] #" + localStorage.tpopfeldkontr_id, Feldwert);
			} else {
				jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_feldkontr'] #" + localStorage.tpopfeldkontr_id, Feldwert);
			}
			break;
		case "TPopBerJahr":
		case "TPopBerEntwicklung":
			jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_tpopber'] #" + localStorage.tpopber_id, $("#TPopBerJahr").val() + ": " + $("#spanTPopBerEntwicklung" + $('input[name="TPopBerEntwicklung"]:checked').val()).text());
			break;
		case "TPopMassnJahr":
		case "TPopMassnTyp":
			jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_massn'] #" + localStorage.tpopmassn_id, $("#TPopMassnJahr").val() + ": " + $("#TPopMassnTyp option:checked").text());
			break;
		case "TPopMassnBerJahr":
		case "TPopMassnBerErfolgsbeurteilung":
			jQuery("#tree").jstree("rename_node", "[typ='tpop_ordner_massnber'] #" + localStorage.tpopmassnber_id, $("#TPopMassnBerJahr").val() + ": " + $("#spanTPopMassnBerErfolgsbeurteilung" + $('input[name="TPopMassnBerErfolgsbeurteilung"]:checked').val()).text());
			break;
		case "ZielBezeichnung":
			jQuery("#tree").jstree("rename_node", "[typ='apzieljahr'] #" + localStorage.apziel_id, Feldwert);
			break;
		case "ZielBerJahr":
		case "ZielBerErreichung":
			jQuery("#tree").jstree("rename_node", "[typ='zielber_ordner'] #" + localStorage.zielber_id, $("#ZielBerJahr").val() + ": " + $("#ZielBerErreichung").val());
			break;
		case "ErfBeurtZielSkalaErreichungsgrad":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_erfkrit'] #" + localStorage.erfkrit_id, $("#SpanErfBeurtZielSkalaErreichungsgrad" + Feldwert).text());
			break;
		case "ApBerJahr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_apber'] #" + localStorage.apber_id, Feldwert);
			break;
		case "BerJahr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_ber'] #" + localStorage.ber_id, Feldwert);
			break;
		case "IbbName":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_ibb'] #" + localStorage.ibb_id, Feldwert);
			break;
		case "IbaassSisfNr":
			jQuery("#tree").jstree("rename_node", "[typ='ap_ordner_ibartenassoz'] #" + localStorage.ibartenassoz_id, $("#IbaassSisfNr option[value='" + Feldwert + "']").text());
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