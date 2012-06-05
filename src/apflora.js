function initiiere_index() {
	$("#suchen").hide();
	//alle Formulare verstecken
	$("#forms").hide();
	$("#ap").hide();
	$("#pop").hide();
	$("#tpop").hide();
	$("#tpopfeldkontr").hide();
	$("#tpopmassn").hide();
	$("#vorlage").hide();
	$("#loeschen_dialog").hide();
	//jQuery ui buttons initiieren
	$("#programm_wahl").buttonset();
	$("button").button();
	$("#tpopfeldkontr_tabs").tabs();
	$("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0 });
	$("#TPopMassnDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopMassnJahr", altFormat: "yy", defaultDate: +0 });
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
	//alle anderen Formulare ausblenden
	$("#pop").hide();
	$("#tpop").hide();
	$("#vorlage").hide();
	$("#tpopfeldkontr").hide();
	$("#tpopmassn").hide();
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
					//Formulare blenden
					$("#forms").show();
					$("#ap").show();
					$("#pop").hide();
					$("#tpop").hide();
					$("#tpopfeldkontr").hide();
					$("#tpopmassn").hide();
					$("#vorlage").hide();
					$("#ap_loeschen").show();
				}
			}
		});
	} else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
		$("#ApArtId").val($("#ap_waehlen").val());
		//Formulare blenden
		$("#forms").show();
		$("#ap").show();
		$("#pop").hide();
		$("#tpop").hide();
		$("#tpopfeldkontr").hide();
		$("#tpopmassn").hide();
		$("#vorlage").hide();
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
			}
		});
	} else {
		$("#ApArtId").html(window.artliste_html);
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
				$("#PopName").val(data.PopName);
				$("#PopNr").val(data.PopNr);
				$("#PopBekanntSeit").val(data.PopBekanntSeit);
				//Formulare blenden
				$("#ap").hide();
				$("#pop").show();
				$("#tpop").hide();
				$("#tpopfeldkontr").hide();
				$("#tpopmassn").hide();
				$("#vorlage").hide();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#PopName").val()) {
					$("#PopName").focus();
				}
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
				$("#ap").hide();
				$("#pop").hide();
				$("#tpop").show();
				$("#tpopfeldkontr").hide();
				$("#tpopmassn").hide();
				$("#vorlage").hide();
				//bei neuen Datensätzen Fokus steuern
				if (!$("#TPopFlurname").val()) {
					$('#TPopFlurname').focus();
				}
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
					if (!window.tpopfeldkontr_lrdelarze_html) {
						$.ajax({
							url: 'php/tpopfeldkontr_lrdelarze.php',
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
									window.tpopfeldkontr_lrdelarze_html = html;
									$("#TPopKontrLeb").html(html);
									$("#TPopKontrLeb").val(window.tpopfeldkontr.TPopKontrLeb);
									$("#TPopKontrLebUmg").html(html);
									$("#TPopKontrLebUmg").val(window.tpopfeldkontr.TPopKontrLebUmg);
								}
							}
						});
					} else {
						$("#TPopKontrLeb").html(window.tpopfeldkontr_lrdelarze_html);
						$("#TPopKontrLeb").val(window.tpopfeldkontr.TPopKontrLeb);
						$("#TPopKontrLebUmg").html(window.tpopfeldkontr_lrdelarze_html);
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
				$("#ap").hide();
				$("#pop").hide();
				$("#tpop").hide();
				//Register in Feldkontr blenden
				if (localStorage.freiwkontr) {
					$("#tpopfeldkontr_tabs_biotop").hide();
					$("#biotop_tab_li").hide();
				} else {
					$("#tpopfeldkontr_tabs_biotop").show();
					$("#biotop_tab_li").show();
				}
				$("#tpopfeldkontr").show();
				$("#tpopmassn").hide();
				$("#vorlage").hide();
				//bei neuen Freiwilligen-Kontrollen Fokus steuern
				if (!$("#TPopKontrJahr").val() && localStorage.freiwkontr) {
					$("#TPopKontrJahr").focus();
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
				//Formulare blenden
				$("#ap").hide();
				$("#pop").hide();
				$("#tpop").hide();
				$("#tpopfeldkontr").hide();
				$("#tpopfreiwkontr").hide();
				$("#vorlage").hide();
				$("#tpopmassn").show();
				//bei neuen Datensätzen Fokus steuern
				$('#TPopMassnTyp').focus();
			}
		}
	});
}

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
			"selected_parent_open": true	//wenn Code einen node wählt, werden alle parents geöffnet
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
		//Erinnerung an letzten Klick im Baum löschen
		delete localStorage.freiwkontr;
		node = data.rslt.obj;
		jQuery.jstree._reference(node).open_node(node);
		if (node.attr("typ") === "pop" || node.attr("typ").slice(0, 4) === "pop_") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#pop").is(':visible') || localStorage.pop_id !== node.attr("id")) {
				localStorage.pop_id = node.attr("id");
				initiiere_pop();
			}
		} else if (node.attr("typ").slice(0, 3) === "ap_") {
			//verhindern, dass bereits offene Seiten nochmals geöffnet werden
			if (!$("#ap").is(':visible') || localStorage.ap_id !== node.attr("id")) {
				localStorage.ap_id = node.attr("id");
				delete localStorage.pop_id;
				initiiere_ap();
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
		} else {
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
	var items, AktiverNode, ParentNode;
	//relevante nodes zwischenspeichern
	AktiverNode = node;
	AktiverNodeText = jQuery.jstree._reference(AktiverNode).get_text(AktiverNode);
	if ($(AktiverNode).attr("typ") !== "ap_ordner_pop") {
		ParentNode = jQuery.jstree._reference(AktiverNode)._get_parent(AktiverNode);
		ParentNodeText = jQuery.jstree._reference(ParentNode).get_text(ParentNode);
	}
	switch($(AktiverNode).attr("typ")) {
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
							"id": $(AktiverNode).attr("id"),
							"typ": "pop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.pop_id = data;
							delete window.pop;
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
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
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Population";
							} else {
								anzTxt = anz + " Populationen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"id": $(ParentNode).attr("id"),
							"typ": "pop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.pop_id = data;
							delete window.pop;
							delete localStorage.pop;
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
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
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Population";
							} else {
								anzTxt = anz + " Populationen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
					jQuery.jstree._reference(AktiverNode).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(AktiverNode).open_all(AktiverNode);
					jQuery.jstree._reference(AktiverNode).select_node(AktiverNode);
					$("#loeschen_dialog_mitteilung").html("Die Population \"" + jQuery.jstree._reference(AktiverNode).get_text(AktiverNode) + "\" und alle darunter befindlichen Knoten werden unwiederbringlich gelöscht.");
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
										"id": $(AktiverNode).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.pop_id;
										delete window.pop;
										jQuery.jstree._reference(ParentNode).select_node(ParentNode);
										jQuery.jstree._reference(AktiverNode).delete_node(AktiverNode);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(ParentNode).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Population";
										} else {
											anzTxt = anz + " Populationen";
										}
										jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id"),
							"typ": "tpop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpop_id = data;
							delete window.tpop;
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
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
									"typ": "tpop_ordner_beob"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"id": $(ParentNode).attr("id"),
							"typ": "tpop",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpop_id = data;
							delete window.tpop;
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
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
									"typ": "tpop_ordner_beob"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Teilpopulation";
							} else {
								anzTxt = anz + " Teilpopulationen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
					jQuery.jstree._reference(AktiverNode).deselect_all();
					//alle tieferen Knoten öffnen um zu zeigen, was mit gelöscht wird
					jQuery.jstree._reference(AktiverNode).open_all(AktiverNode);
					jQuery.jstree._reference(AktiverNode).select_node(AktiverNode);
					$("#loeschen_dialog_mitteilung").html("Die Teilpopulation \"" + jQuery.jstree._reference(AktiverNode).get_text(AktiverNode) + "\" und alle darunter befindlichen Knoten werden unwiederbringlich gelöscht.");
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
										"id": $(AktiverNode).attr("id")
									},
									success: function () {
										var anz, anzTxt;
										delete localStorage.tpop_id;
										delete window.tpop;
										jQuery.jstree._reference(ParentNode).deselect_all();
										jQuery.jstree._reference(ParentNode).select_node(ParentNode);
										jQuery.jstree._reference(AktiverNode).delete_node(AktiverNode);
										//Parent Node-Beschriftung: Anzahl anpassen
										anz = $(ParentNode).find("> ul > li").length;
										if (anz === 1) {
											anzTxt = anz + " Teilpopulation";
										} else {
											anzTxt = anz + " Teilpopulationen";
										}
										jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id"),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
								"data": "neue Feldkontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"tpop_id": $(AktiverNode).attr("id"),
							"tpopfeldkontr_id": $(window.tpopfeldkontr_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(AktiverNode).move_node(window.tpopfeldkontr_node_ausgeschnitten, AktiverNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
							jQuery.jstree._reference(AktiverNode).select_node(window.tpopfeldkontr_node_ausgeschnitten);
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(AktiverNode).attr("id");
					//die alten id's entfernen
					delete tpopfeldkontr_objekt_kopiert.TPopId;
					delete tpopfeldkontr_objekt_kopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete tpopfeldkontr_objekt_kopiert.MutWann;
					delete tpopfeldkontr_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in tpopfeldkontr_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (tpopfeldkontr_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + tpopfeldkontr_objekt_kopiert[i];
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
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
								"data": tpopfeldkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"id": $(ParentNode).attr("id"),
							"typ": "tpopfeldkontr",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": "neue Feldkontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopfeldkontr_id;
							delete window.tpopfeldkontr;
							jQuery.jstree._reference(ParentNode).select_node(ParentNode);
							jQuery.jstree._reference(AktiverNode).delete_node(AktiverNode);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
					window.tpopfeldkontr_node_ausgeschnitten = AktiverNode;
				}
			}
		}
		if (!window.tpopfeldkontr_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					window.tpopfeldkontr_node_kopiert = AktiverNode;
					//Daten des Objekts holen
					$.ajax({
						url: 'php/tpopfeldkontr.php',
						dataType: 'json',
						data: {
							"id": $(window.tpopfeldkontr_node_kopiert).attr("id")
						},
						success: function (data) {
							tpopfeldkontr_objekt_kopiert = data;
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
							"tpop_id": $(ParentNode).attr("id"),
							"tpopfeldkontr_id": $(AktiverNode).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							ParentNode = jQuery.jstree._reference(AktiverNode)._get_parent(AktiverNode);
							jQuery.jstree._reference(ParentNode).move_node(window.tpopfeldkontr_node_ausgeschnitten, ParentNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
							jQuery.jstree._reference(ParentNode).select_node(window.tpopfeldkontr_node_ausgeschnitten);
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(ParentNode).attr("id");
					//die alten id's entfernen
					delete tpopfeldkontr_objekt_kopiert.TPopId;
					delete tpopfeldkontr_objekt_kopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete tpopfeldkontr_objekt_kopiert.MutWann;
					delete tpopfeldkontr_objekt_kopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in tpopfeldkontr_objekt_kopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (tpopfeldkontr_objekt_kopiert[i] !== null) {
								dataUrl += "&" + i + "=" + tpopfeldkontr_objekt_kopiert[i];
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
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": tpopfeldkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfeldkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id"),
							"typ": "tpopfreiwkontr",
							"user": sessionStorage.User,
							"TPopKontrTyp": "Freiwilligen-Erfolgskontrolle"
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							localStorage.freiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
								"data": "neue Freiwilligen-Kontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"tpop_id": $(AktiverNode).attr("id"),
							"tpopfeldkontr_id": $(window.tpopfreiwkontr_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(AktiverNode).move_node(window.tpopfreiwkontr_node_ausgeschnitten, AktiverNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
							jQuery.jstree._reference(AktiverNode).select_node(window.tpopfreiwkontr_node_ausgeschnitten);
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(AktiverNode).attr("id");
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
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
								"data": tpopfreiwkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"id": $(ParentNode).attr("id"),
							"typ": "tpopfreiwkontr",
							"user": sessionStorage.User,
							"TPopKontrTyp": "Freiwilligen-Erfolgskontrolle"
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopfeldkontr_id = data;
							localStorage.tpopfreiwkontr = true;
							delete window.tpopfeldkontr;
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": "neue Freiwilligen-Kontrolle",
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopfeldkontr_id;
							delete localStorage.freiwkontr;
							delete window.tpopfeldkontr;
							jQuery.jstree._reference(ParentNode).select_node(ParentNode);
							jQuery.jstree._reference(AktiverNode).delete_node(AktiverNode);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
					window.tpopfreiwkontr_node_ausgeschnitten = AktiverNode;
				}
			}
		}
		if (!window.tpopfreiwkontr_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					window.tpopfreiwkontr_node_kopiert = AktiverNode;
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
							"tpop_id": $(ParentNode).attr("id"),
							"tpopfeldkontr_id": $(AktiverNode).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							ParentNode = jQuery.jstree._reference(AktiverNode)._get_parent(AktiverNode);
							jQuery.jstree._reference(ParentNode).move_node(window.tpopfreiwkontr_node_ausgeschnitten, ParentNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
							jQuery.jstree._reference(ParentNode).select_node(window.tpopfreiwkontr_node_ausgeschnitten);
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(ParentNode).attr("id");
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
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": tpopfreiwkontr_objekt_kopiert.TPopKontrJahr,
								"attr": {
									"id": data,
									"typ": "tpopfreiwkontr"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Freiwilligen-Kontrolle";
							} else {
								anzTxt = anz + " Freiwilligen-Kontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id"),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
								"data": "neue Massnahme",
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"tpop_id": $(AktiverNode).attr("id"),
							"tpopmassn_id": $(window.tpopmassn_node_ausgeschnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(AktiverNode).move_node(window.tpopmassn_node_ausgeschnitten, AktiverNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
							jQuery.jstree._reference(AktiverNode).select_node(window.tpopmassn_node_ausgeschnitten);
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(AktiverNode).attr("id");
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
							NeuerNode = jQuery.jstree._reference(AktiverNode).create_node(AktiverNode, "last", {
								"data": window.tpopmassn_objekt_kopiert.TPopMassnJahr,
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
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
							"id": $(ParentNode).attr("id"),
							"typ": "tpopmassn",
							"user": sessionStorage.User
						},
						success: function (data) {
							var NeuerNode, anz, anzTxt;
							localStorage.tpopmassn_id = data;
							delete window.tpopmassn;
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": "neue Massnahme",
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
							"id": $(AktiverNode).attr("id")
						},
						success: function () {
							var anz, anzTxt;
							delete localStorage.tpopmassn_id;
							delete window.tpopmassn;
							jQuery.jstree._reference(ParentNode).select_node(ParentNode);
							jQuery.jstree._reference(AktiverNode).delete_node(AktiverNode);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
					window.tpopmassn_node_ausgeschnitten = AktiverNode;
				}
			}
		}
		if (!window.tpopmassn_node_ausgeschnitten) {
			items.kopieren = {
				"label": "kopieren",
				"separator_before": true,
				"icon": "style/images/kopieren.png",
				"action": function () {
					window.tpopmassn_node_kopiert = AktiverNode;
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
							"tpop_id": $(ParentNode).attr("id"),
							"tpopmassn_id": $(AktiverNode).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							ParentNode = jQuery.jstree._reference(AktiverNode)._get_parent(AktiverNode);
							jQuery.jstree._reference(ParentNode).move_node(window.tpopmassn_node_ausgeschnitten, ParentNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
							jQuery.jstree._reference(ParentNode).select_node(window.tpopmassn_node_ausgeschnitten);
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
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(ParentNode).attr("id");
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
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": window.tpopmassn_objekt_kopiert.TPopMassnJahr,
								"attr": {
									"id": data,
									"typ": "tpopmassn"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Massnahme";
							} else {
								anzTxt = anz + " Massnahmen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
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
	}
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
			jQuery("#tree").jstree("rename_node", "#" + localStorage.pop_id, Feldwert);
			break;
		case "TPopFlurname":
			jQuery("#tree").jstree("rename_node", "#" + localStorage.tpop_id, Feldwert);
			break;
		case "TPopKontrJahr":
			jQuery("#tree").jstree("rename_node", "#" + localStorage.tpopfeldkontr_id, Feldwert);
			break;
		case "TPopMassnJahr":
			jQuery("#tree").jstree("rename_node", "#" + localStorage.tpopmassn_id, Feldwert);
			break;
		case "TPopMassnTyp":
			var massn_typ_text;
			for (i in window.tpopmassn_typ.rows) {
				if (typeof i !== "undefined") {
					if (i === Feldwert) {
						massn_typ_text = window.tpopmassn_typ.rows[i].MassnTypTx;
						break;
					}
				}
			}
			jQuery("#tree").jstree("rename_node", "#" + localStorage.tpopmassn_id, massn_typ_text);
			break;
	}
}


/*function speichern(that) {
	var Formular, Feldname, Feldjson, Feldwert, Querystring, Objekt;
	Formular = $(that).attr("formular");
	Feldname = that.name;
	//nötig, damit Arrays richtig kommen
	Feldjson = $("[name='" + Feldname + "']").serializeObject();
	Feldwert = Feldjson[Feldname];
	if (Feldname === "TPopHerkunftUnklar" || Feldname === "TPopPop") {
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
			jQuery("#tree").jstree("rename_node", "#" + localStorage.pop_id, Feldwert);
			break;
		case "TPopFlurname":
			jQuery("#tree").jstree("rename_node", "#" + localStorage.tpop_id, Feldwert);
			break;
		case "TPopKontrJahr":
			jQuery("#tree").jstree("rename_node", "#" + localStorage.tpopfeldkontr_id, Feldwert);
			break;
	}
}*/

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