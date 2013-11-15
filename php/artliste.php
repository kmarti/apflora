<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT TaxonomieId, IF(Status Is Not Null, CONCAT(Artname, '   ', Status), Artname) AS Artname FROM ArtenDb_Arteigenschaften ORDER BY Artname");

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$TaxonomieId = $r['TaxonomieId'];
	settype($TaxonomieId, "integer");
	$row = array("Artname" => $r['Artname'], "id" => $TaxonomieId);
    $rows[] = $row;
}

//in json verwandeln
$rows = json_encode($rows);
$Object = "{\"rows\": $rows}";

print($Object);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>