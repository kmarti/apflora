function initiiere_ap() {
	/*if (!localStorage.ApArtId || !localStorage.rlbk) {
		//es fehlen benötigte Daten > zurück zum Anfang
		window.open("index.html", target = "_self");
	}*/

	//Daten für den AP aus der DB holen
	$.ajax({
		url: 'php/ap.php',
		dataType: 'json',
		data: {
			"id": localStorage.ApArtId
		},
		success: function (data) {
			//ap bereitstellen
			window.ap = data;
			localStorage.ap = JSON.stringify(data);
			//Felder mit Daten beliefern
			//Radio Felder initiieren
			$("#ApStatus" + data.ApStatus).prop("checked",true);
			$("#ApUmsetzung" + data.ApUmsetzung).prop("checked",true);
			//übrige Felder initiieren
			$("#ApArtId").val(data.ApArtId);
			$("#ApJahr").val(data.ApJahr);
		}
	});


	//tree aufbauen. Wird mit der localStorage übergeben
	//$.jstree.rollback(JSON.parse(localStorage.rlbk));
}

function erstelle_ap_liste(ap_arten) {
	var url;
	urll = 'php/apliste.php';
	if (ap_arten) {
		urll += '?ap_arten=true';
	}
	$.ajax({
		url: urll,
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
	.bind("open_node.jstree", function (e, data) {
		var node;
		//node = data.rslt.obj;
		//this.open_node(e);
		// `data.rslt.obj` is the jquery extended node that was clicked
		//alert(data.rslt.obj.attr("typ") + " mit id " + data.rslt.obj.attr("id"));
	});
}

//generiert den html-Inhalt für Optionen von Radio
//wird von generiereHtmlFuerRadio aufgerufen
function generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen) {
	var i, HtmlContainer, Optionn, ListItem;
	HtmlContainer = "";
	for (i in Optionen.rows) {
		if (typeof i !== "function") {
			Optionn = Optionen.rows[i];
			ListItem = "<label for='";
			ListItem += Optionn['id'];
			ListItem += "'>";
			ListItem += "</label>";
			ListItem += "<input class='speichern' type='radio' name='";
			ListItem += FeldName;
			ListItem += "' id='";
			ListItem += Optionn['id'];
			ListItem += "' value='";
			ListItem += Optionn['id'];
			if (FeldWert === Optionn['id']) {
				ListItem += "' checked='checked";
			}
			ListItem += "'/>";
			ListItem += Optionn[FeldName];
			HtmlContainer += ListItem;
		}
	}
	return HtmlContainer;
}