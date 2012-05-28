<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

$id = $_GET["id"];
settype($id, "integer");
$typ = $_GET["typ"] || null;

//richtige SQL-Anfrage ermitteln
if (!$typ) {
	//wir sind zuoberst, Aktionspläne anzeigen
	//Abfrage definieren
	$query = "SELECT Name, ApArtId FROM qryAp1";
	//Abfrage ausführen
	$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());
	//benötigte Datenstruktur aufbauen
	$rows = "[";
	while($r = mysql_fetch_assoc($result)) {
		$ApArtId = $r['ApArtId'];
		settype($ApArtId, "integer");
		$attr = array("id" => $ApArtId, "typ" => "ap");
		$children = array(0 => "Populationen", 1 => "AP-Ziele", 2 => "Erfolgskriterien", 3 => "AP-Berichte", 4 => "Berichte");
		$row = array("data" => utf8_encode($r['Name']), "attr" => $attr, "children" => $children);
		if ($rows != "[") {
	    	$rows .= ",";
	    }
	    $rows .= json_encode($row);
	}
	$rows .= "]";
} else if ($typ === "ap") {
	//gewünschte Knoten aufzählen
	$children = array(0 => "Populationen", 1 => "AP-Ziele", 2 => "Erfolgskriterien", 3 => "AP-Berichte", 4 => "Berichte");
	//Datenstruktur aufbauen
	$rows = "[";
	foreach ($variable as $value) {
		$attr = array("id" => $id, "typ" => "ap_".$value);
		$row = array("data" => $value, "attr" => $attr);
		if ($rows != "[") {
	    	$rows .= ",";
	    }
	    $rows .= json_encode($row);
	}
} else if ($typ === "ap_Populationen") {
	//Abfragen
	$query = "SELECT PopName, PopId, ApArtId FROM tblPopulation where ApArtId = $id";
	$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());
	$anzPop = mysql_num_rows($result);
	//benötigte Datenstruktur aufbauen
	$rows = "";
	//zuerst die nodes des Ordners:
	while($r = mysql_fetch_assoc($result)) {
		$PopId = $r['PopId'];
		settype($PopId, "integer");
		$attr = array("id" => $PopId, "typ" => "pop");
		$population = array("data" => utf8_encode($r['PopName']), "attr" => $attr);
		if ($rows) {
			$rows .= ",";
		}
	    $rows .= json_encode($population);
	}
} else if ($typ === "Pop") {
	//gewünschte Knoten aufzählen
	$children = array(0 => "Teilpopulationen", 1 => "Populations-Berichte", 2 => "Massnahmen-Berichte");
	//Datenstruktur aufbauen
	$rows = "[";
	foreach ($variable as $value) {
		$attr = array("id" => $id, "typ" => "pop_".$value);
		$row = array("data" => $value, "attr" => $attr);
		if ($rows != "[") {
	    	$rows .= ",";
	    }
	    $rows .= json_encode($row);
	}
}

print($rows);

// Resultset freigeben
mysql_free_result($result);

// Verbindung schliessen
mysql_close($link);
?>