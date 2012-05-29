<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

//ist ap_arten true, sollen nur ap_arten angezeigt werden
$ap_arten = $_GET["ap_arten"];

// SQL-Anfrage ausführen
if ($ap_arten) {
	$query = "SELECT Name, ApArtId FROM qryAp1 WHERE ApStatus BETWEEN 1 AND 3";
} else {
	$query = "SELECT Name, ApArtId FROM qryAp1";
}
$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysql_fetch_assoc($result)) {
	$ApArtId = $r['ApArtId'];
	settype($ApArtId, "integer");
	$row = array("ap_name" => utf8_encode($r['Name']), "id" => $ApArtId);
    $rows[] = $row;
}
//in json verwandeln
$rows = json_encode($rows);
$Object = "{\"rows\": $rows}";

print($Object);

// Resultset freigeben
mysql_free_result($result);

// Verbindung schliessen
mysql_close($link);
?>