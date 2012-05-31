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
$result = mysqli_query($link, "SELECT NR, IF(Deutsch Is Not Null, CONCAT(Name, ' (', Deutsch, ')   ', StatusText), CONCAT(Name, '   ', StatusText)) AS Artname FROM ArtenDb_tblFloraSisf LEFT JOIN DomainFloraStatus ON Status = StatusWert ORDER BY Artname");

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
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
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>