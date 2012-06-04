function initiiere_index() {
	$("#suchen").hide();
	//alle Formulare verstecken
	$("#forms").hide();
	$("#ap").hide();
	$("#pop").hide();
	$("#tpop").hide();
	$("#tpopfeldkontr").hide();
	$("#tpopfreiwkontr").hide();
	$("#vorlage").hide();
	$("#loeschen_dialog").hide();
	//jQuery ui buttons initiieren
	$("#programm_wahl").buttonset();
	$("button").button();
	$("#tpopfeldkontr_tabs").tabs();
	$("#TPopKontrDatum").datepicker({ dateFormat: "dd.mm.yy", altField: "#TPopKontrJahr", altFormat: "yy", defaultDate: +0 });
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
	$("#tpopfreiwkontr").hide();
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
					$("#tpopfreiwkontr").hide();
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
		$("#tpopfreiwkontr").hide();
		$("#vorlage").hide();
		$("#ap_loeschen").show();
	}
}

//wird benutzt von Formular pop
//baut für das select $("#ApArtId") eine Artliste auf
function erstelle_ApArtId_liste() {
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
			$("#ApArtId").html(html);
		}
	});
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
				$("#tpopfreiwkontr").hide();
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
				$("#tpopfreiwkontr").hide();
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
	if (!localStorage.tpopfeldkontr_id) {
		//es fehlen benötigte Daten > eine Ebene höher
		initiiere_pop();
		return;
	}
	//Felder zurücksetzen
	leereFelderVonFormular("tpopfeldkontr");
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
				//Felder mit Daten beliefern
				$("#TPopKontrTyp" + data.TPopKontrTyp).prop("checked", true);
				$("#TPopKontrJahr").val(data.TPopKontrJahr);
				$("#TPopKontrDatum").val(data.TPopKontrDatum);
				$("#TPopKontrMethode1" + data.TPopKontrMethode1).prop("checked", true);
				$("#TPopKontrAnz1").val(data.TPopKontrAnz1);
				$("#TPopKontrMethode2" + data.TPopKontrMethode2).prop("checked", true);
				$("#TPopKontrAnz2").val(data.TPopKontrAnz2);
				$("#TPopKontrMethode3" + data.TPopKontrMethode3).prop("checked", true);
				$("#TPopKontrAnz3").val(data.TPopKontrAnz3);
				$("#TPopKontrJungpfl").val(data.TPopKontrJungpfl);
				$("#TPopKontrVitalitaet").val(data.TPopKontrVitalitaet);
				$("#TPopKontrUeberleb").val(data.TPopKontrUeberleb);
				$("#TPopKontrEntwicklung" + data.TPopKontrEntwicklung).prop("checked", true);
				$("#TPopKontrUrsach").val(data.TPopKontrUrsach);
				$("#TPopKontrUrteil").val(data.TPopKontrUrteil);
				$("#TPopKontrAendUms").val(data.TPopKontrAendUms);
				$("#TPopKontrAendKontr").val(data.TPopKontrAendKontr);
				$("#TPopKontrTxt").val(data.TPopKontrTxt);
				$("#TPopKontrGuid").val(data.TPopKontrGuid);
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
				
				//für select TPopKontrBearb Daten holen - oder vorhandene nutzen
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

				//für select TPopKontrLeb Daten holen - oder vorhandene nutzen
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
				//Formulare blenden
				$("#ap").hide();
				$("#pop").hide();
				$("#tpop").hide();
				$("#tpopfeldkontr").show();
				$("#tpopfreiwkontr").hide();
				$("#vorlage").hide();
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
	})
	.bind("open_node.jstree", function (e, data) {
		//var node;
		//node = data.rslt.obj;
		//this.open_node(e);
		// `data.rslt.obj` is the jquery extended node that was clicked
		//alert(data.rslt.obj.attr("typ") + " mit id " + data.rslt.obj.attr("id"));
	});
	$("#suchen").show();
}

function treeKontextmenu(node) {
	var items, AktiverNode, ParentNode;
	//relevante nodes zwischenspeichern
	AktiverNode = node;
	AktiverNodeText = jQuery.jstree._reference(AktiverNode).get_text(AktiverNode);
	ParentNode = jQuery.jstree._reference(AktiverNode)._get_parent(AktiverNode);
	ParentNodeText = jQuery.jstree._reference(ParentNode).get_text(ParentNode);
	switch($(AktiverNode).attr("typ")) {
	case "ap_ordner_pop":
		items = {
			neu: {
				label: "neue Population",
				action: function () {
					$.ajax({
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": $(AktiverNode).attr("id"),
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
			neu: {
				label: "neue Population",
				action: function () {
					$.ajax({
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": $(ParentNode).attr("id"),
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
			loeschen: {
				label: "lösche Population",
				action: function () {
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
			neu: {
				label: "neue Teilpopulation",
				action: function () {
					$.ajax({
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": $(AktiverNode).attr("id"),
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
			neu: {
				label: "neue Teilpopulation",
				action: function () {
					$.ajax({
						url: 'php/tpop_insert.php',
						dataType: 'json',
						data: {
							"id": $(ParentNode).attr("id"),
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
			loeschen: {
				label: "lösche Teilpopulation",
				action: function () {
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
			neu: {
				label: "neue Feldkontrolle",
				action: function () {
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": $(AktiverNode).attr("id"),
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
		if (window.NodeAusgeschnnitten) {
			items.einfuegen = {
				label: jQuery.jstree._reference(window.NodeAusgeschnnitten).get_Text(window.NodeAusgeschnnitten) + " einfügen",
				action: function () {
					$.ajax({
						url: 'php/tpopfeldkontr_einfuegen.php',
						dataType: 'json',
						data: {
							"tpop_id": $(AktiverNode).attr("id"),
							"tpopfeldkontr_id": $(window.NodeAusgeschnnitten).attr("id"),
							"user": sessionStorage.User
						},
						success: function () {
							var anz, anzTxt;
							//node verschieben
							jQuery.jstree._reference(AktiverNode).move_node(window.NodeAusgeschnnitten, AktiverNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(AktiverNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(AktiverNode).rename_node(AktiverNode, anzTxt);
							jQuery.jstree._reference(AktiverNode).select_node(window.NodeAusgeschnnitten);
							//Variabeln aufräumen
							localStorage.tpopfeldkontr_id = $(window.NodeAusgeschnnitten).attr("id");
							delete window.tpopfeldkontr;
							delete window.NodeAusgeschnnitten;
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
		if (window.NodeKopiert) {
			items.einfuegen = {
				label: jQuery.jstree._reference(window.NodeKopiert).get_text(window.NodeKopiert) + " einfügen",
				action: function () {
					var dataUrl;
					//User und neue TPopId mitgeben
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(AktiverNode).attr("id");
					//die alten id's entfernen
					delete window.ObjektKopiert.TPopId;
					delete window.ObjektKopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete window.ObjektKopiert.MutWann;
					delete window.ObjektKopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in window.ObjektKopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (window.ObjektKopiert[i] !== null) {
								dataUrl += "&" + i + "=" + window.ObjektKopiert[i];
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
								"data": window.ObjektKopiert.TPopKontrJahr,
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
			neu: {
				label: "neu",
				action: function () {
					$.ajax({
						url: 'php/tpopfeldkontr_insert.php',
						dataType: 'json',
						data: {
							"id": $(ParentNode).attr("id"),
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
			loeschen: {
				label: "löschen",
				action: function () {
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
		if (!window.NodeAusgeschnnitten) {
			items.ausschneiden = {
				label: "ausschneiden",
				action: function () {
					window.NodeAusgeschnnitten = AktiverNode;
				}
			}
		}
		if (!window.NodeAusgeschnnitten) {
			items.kopieren = {
				label: "kopieren",
				action: function () {
					window.NodeKopiert = AktiverNode;
					//Daten des Objekts holen
					$.ajax({
						url: 'php/tpopfeldkontr.php',
						dataType: 'json',
						data: {
							"id": $(window.NodeKopiert).attr("id")
						},
						success: function (data) {
							window.ObjektKopiert = data;
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
		if (window.NodeAusgeschnnitten) {
			items.einfuegen = {
				label: jQuery.jstree._reference(window.NodeAusgeschnnitten).get_Text(window.NodeAusgeschnnitten) + " einfügen",
				action: function () {
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
							jQuery.jstree._reference(ParentNode).move_node(window.NodeAusgeschnnitten, ParentNode, "last", false);
							//Parent Node-Beschriftung: Anzahl anpassen
							anz = $(ParentNode).find("> ul > li").length;
							if (anz === 1) {
								anzTxt = anz + " Feldkontrolle";
							} else {
								anzTxt = anz + " Feldkontrollen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzTxt);
							jQuery.jstree._reference(ParentNode).select_node(window.NodeAusgeschnnitten);
							//Variabeln aufräumen
							localStorage.tpopfeldkontr_id = $(window.NodeAusgeschnnitten).attr("id");
							delete window.tpopfeldkontr;
							delete window.NodeAusgeschnnitten;
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
		if (window.NodeKopiert) {
			items.einfuegen = {
				label: jQuery.jstree._reference(window.NodeKopiert).get_text(window.NodeKopiert) + " einfügen",
				action: function () {
					var dataUrl;
					//User und neue TPopId mitgeben
					dataUrl = "?MutWer=" + sessionStorage.User + "&TPopId=" + $(ParentNode).attr("id");
					//die alten id's entfernen
					delete window.ObjektKopiert.TPopId;
					delete window.ObjektKopiert.TPopKontrId;
					//das wird gleich neu gesetzt, alte Werte verwerfen
					delete window.ObjektKopiert.MutWann;
					delete window.ObjektKopiert.MutWer;
					//alle verbliebenen Felder an die url hängen
					for (i in window.ObjektKopiert) {
						if (typeof i !== "function") {
							//Nullwerte ausschliessen
							if (window.ObjektKopiert[i] !== null) {
								dataUrl += "&" + i + "=" + window.ObjektKopiert[i];
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
								"data": window.ObjektKopiert.TPopKontrJahr,
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