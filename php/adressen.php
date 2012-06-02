<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT AdrId, AdrName FROM tblAdresse ORDER BY AdrName");

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$AdrId = $r['AdrId'];
	settype($AdrId, "integer");
	$row = array("AdrName" => $r['AdrName'], "id" => $AdrId);
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