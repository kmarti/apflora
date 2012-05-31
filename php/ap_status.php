<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

// SQL-Anfrage ausführen
$query = "SELECT DomainCode, DomainTxt FROM DomainApBearbeitungsstand ORDER BY DomainOrd";
$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysql_fetch_assoc($result)) {
	$id = $r['DomainCode'];
	settype($id, "integer");
	$row = array("ApStatus" => utf8_encode($r['DomainTxt']), "id" => $id);
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