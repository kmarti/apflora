function initiiere_index() {
	$("#suchen").hide();
	//alle Formulare verstecken
	$("#ap").hide();
	$("#pop").hide();
	//jQuery ui buttons initiieren
	$("#programm_wahl").buttonset();
	$("button").button();
	//Auswahllisten aufbauen
	erstelle_ap_liste("programm_alle");
	erstelle_ApArtId_liste();
}

function initiiere_ap() {
	/*if (!localStorage.ap_id || !localStorage.rlbk) {
		//es fehlen benötigte Daten > zurück zum Anfang
		window.open("index.html", target = "_self");
	}*/
	//Programm-Wahl konfigurieren
	var programm_wahl;
	programm_wahl = $("[name='programm_wahl']:checked").attr("id");
	//alle anderen Formulare ausblenden
	$("pop").hide();
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
					localStorage.ap = JSON.stringify(data);
					//Felder mit Daten beliefern
					$("#ApStatus" + data.ApStatus).prop("checked", true);
					$("#ApUmsetzung" + data.ApUmsetzung).prop("checked", true);
					$("#ApArtId").val(data.ApArtId);
					$("#ApJahr").val(data.ApJahr);
					//Formulare blenden
					$("#ap").show();
					$("#pop").hide();
				}
			}
		});
	} else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
		$("#ApArtId").val($("#ap_waehlen").val());
		//Formulare blenden
		$("#ap").show();
		$("#pop").hide();
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
	/*if (!localStorage.pop_id) {
		//es fehlen benötigte Daten > zurück zum Anfang
		window.open("index.html", target = "_self");
	}*/
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
				localStorage.pop = JSON.stringify(data);
				//Felder mit Daten beliefern
				$("#PopHerkunft" + data.PopHerkunft).prop("checked", true);
				$("#PopName").val(data.PopName);
				$("#PopNr").val(data.PopNr);
				$("#PopBekanntSeit").val(data.PopBekanntSeit);
				//Formulare blenden
				$("#ap").hide();
				$("#pop").show();
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
			"items": treeKontextmenu
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
		if (node.attr("typ") === "pop") {
			localStorage.pop_id = node.attr("id");
			initiiere_pop();
		} else if (node.attr("typ").slice(0, 3) === "ap_") {
			localStorage.ap_id = node.attr("id");
			delete localStorage.pop_id;
			initiiere_ap();
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
	var items;
	switch($(node).attr("typ")) {
	case "ap_ordner_pop":
		items = {
			neu: {
				label: "neue Population",
				action: function () {
					$.ajax({
						url: 'php/pop_insert.php',
						dataType: 'json',
						data: {
							"id": localStorage.ap_id
						},
						success: function (data) {
							var NeuerNode, anzPop, anzPopTxt;
							localStorage.pop_id = data;
							delete window.pop;
							delete localStorage.pop;
							NeuerNode = jQuery.jstree._reference(node).create_node(node, "last", {
								"data": "neue Population",
								"attr": {
									"id": data,
									"typ": "pop"
								}
							});
							//Node-Beschriftung: Anzahl anpassen
							anzPop = $(node).find("> ul > li").length;
							if (anzPop === 1) {
								anzPopTxt = anzPop + " Population";
							} else {
								anzPopTxt = anzPop + " Populationen";
							}
							jQuery.jstree._reference(node).rename_node(node, anzPopTxt);
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							$("#ap").hide();
							$("#pop").show();
							$('#PopName').focus();
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
							"id": localStorage.ap_id
						},
						success: function (data) {
							var ParentNode, NeuerNode, anzPop, anzPopTxt;
							localStorage.pop_id = data;
							delete window.pop;
							delete localStorage.pop;
							ParentNode = jQuery.jstree._reference(node)._get_parent(node);
							NeuerNode = jQuery.jstree._reference(ParentNode).create_node(ParentNode, "last", {
								"data": "neue Population",
								"attr": {
									"id": data,
									"typ": "pop"
								}
							});
							//Parent Node-Beschriftung: Anzahl anpassen
							anzPop = $(ParentNode).find("> ul > li").length;
							if (anzPop === 1) {
								anzPopTxt = anzPop + " Population";
							} else {
								anzPopTxt = anzPop + " Populationen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzPopTxt);
							jQuery.jstree._reference(NeuerNode).select_node(NeuerNode);
							$("#ap").hide();
							$("#pop").show();
							$('#PopName').focus();
							/*setTimeout(function () { 
								$('#PopName').focus();
							}, 50);*/
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
					$.ajax({
						url: 'php/pop_delete.php',
						dataType: 'json',
						data: {
							"id": localStorage.pop_id
						},
						success: function () {
							var ParentNode, anzPop, anzPopTxt;
							delete localStorage.pop_id;
							delete window.pop;
							delete localStorage.pop;
							ParentNode = jQuery.jstree._reference(node)._get_parent(node);
							jQuery.jstree._reference(ParentNode).select_node(ParentNode);
							jQuery.jstree._reference(node).delete_node(node);
							//Parent Node-Beschriftung: Anzahl anpassen
							anzPop = $(ParentNode).find("> ul > li").length;
							if (anzPop === 1) {
								anzPopTxt = anzPop + " Population";
							} else {
								anzPopTxt = anzPop + " Populationen";
							}
							jQuery.jstree._reference(ParentNode).rename_node(ParentNode, anzPopTxt);
							$("#pop").hide();
							$("#ap").show();
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
				}
			}
		};
		return items;
	}		
}

//wird von allen Formularen benutzt
//speichert den Wert eines Feldes in einem Formular
//übernimmt das Objekt, in dem geändert wurde
function speichern(that) {
	var Formular, Feldname, Feldjson, Feldwert, Querystring;
	Formular = $(that).attr("formular");
	Feldname = that.name;
	//nötig, damit Arrays richtig kommen
	Feldjson = $("[name='" + Feldname + "']").serializeObject();
	Feldwert = Feldjson[Feldname];
	$.ajax({
		url: 'php/' + Formular + '_update.php',
		dataType: 'json',
		data: {
			"id": localStorage[Formular + "_id"],
			"Feld": Feldname,
			"Wert": Feldwert
		},
		success: function () {
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