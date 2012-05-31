function initiiere_ap() {
	/*if (!localStorage.ApArtId || !localStorage.rlbk) {
		//es fehlen benötigte Daten > zurück zum Anfang
		window.open("index.html", target = "_self");
	}*/
	var programm_wahl;
	programm_wahl = $("[name='programm_wahl']:checked").attr("id");
	//Felder zurücksetzen
	$('#ap_form input[type="text"]').each(function(){
		$(this).val("");  
	});
	$('#ap_form input[type="radio"]:checked').each(function(){
		$(this).prop('checked', false);  
	});
	$('#ap_form select').each(function(){
		$(this).val("");  
	});
	if ($("#ap_waehlen").val() && programm_wahl !== "programm_neu") {
		//Daten für den ap aus der DB holen
		$.ajax({
			url: 'php/ap.php',
			dataType: 'json',
			data: {
				"id": localStorage.ApArtId
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
					$("#ap_form").show();
				}
			}
		});
	} else if ($("#ap_waehlen").val() && programm_wahl === "programm_neu") {
		$("#ApArtId").val($("#ap_waehlen").val());
		$("#ap_form").show();
	}
	//tree aufbauen. Wird mit der localStorage übergeben
	//$.jstree.rollback(JSON.parse(localStorage.rlbk));
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
		"types": {
			"default": {
				"select_node": function(e) {
					this.correct_state(e);
					this.toggle_node(e);
					return false;
				}
			}
		},
		"plugins" : ["themes", "json_data", "ui", "hotkeys", "search", "types"]
	})
	.show()
	.bind("open_node.jstree", function (e, data) {
		//var node;
		//node = data.rslt.obj;
		//this.open_node(e);
		// `data.rslt.obj` is the jquery extended node that was clicked
		//alert(data.rslt.obj.attr("typ") + " mit id " + data.rslt.obj.attr("id"));
	});
	$("#suchen").show();
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