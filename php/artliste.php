<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

// SQL-Anfrage ausführen
$query = "SELECT NR, IF(Deutsch Is Not Null, CONCAT(Name, ' (', Deutsch, ')   ', StatusText), CONCAT(Name, '   ', StatusText)) AS Artname FROM ArtenDb_tblFloraSisf LEFT JOIN DomainFloraStatus ON Status = StatusWert ORDER BY Artname";
$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysql_fetch_assoc($result)) {
	$ApArtId = $r['NR'];
	settype($ApArtId, "integer");
	$row = array("Artname" => utf8_encode($r['Artname']), "id" => $ApArtId);
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