<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

$ApArtId = $_GET['id'];
settype($ApArtId, "integer");

// SQL-Anfrage ausführen
$query = "SELECT PopName, PopId, ApArtId FROM tblPopulation where ApArtId = $ApArtId";
$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());
$anzPop = mysql_num_rows($result);

//benötigte Datenstruktur aufbaue
$populationen = "";
//zuerst die nodes des Ordners:
while($r = mysql_fetch_assoc($result)) {
	$PopId = $r['PopId'];
	settype($PopId, "integer");
	$attr = array("id" => $PopId, "typ" => "pop");
	$children = array(0 => "Teilpopulationen", 1 => "Populations-Berichte", 2 => "Massnahmen-Berichte");
	$population = array("data" => utf8_encode($r['PopName']), "attr" => $attr, "state" => "closed", "children" => $children);
	if ($populationen) {
		$populationen .= ",";
	}
    $populationen .= json_encode($population);
}

//nun den Ordner
$attr = json_encode(array("id" => $ApArtId, "typ" => "pop_ordner"));
//$Ordner = "{\"data\":\"$anzPop Populationen\", \"attr\": $attr, \"state\": \"closed\", \"children\": [$populationen]}";
$Ordner = "{\"data\":\"$anzPop Populationen\", \"attr\": $attr, \"state\": \"closed\"}";

print($Ordner);

// Resultset freigeben
mysql_free_result($result);

// Verbindung schliessen
mysql_close($link);
?>