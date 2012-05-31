<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT DomainCode, DomainTxt FROM DomainApUmsetzung ORDER BY DomainOrd");

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$DomainCode = $r['DomainCode'];
	settype($DomainCode, "integer");
	$row = array("ApUmsetzung" => utf8_encode($r['DomainTxt']), "id" => $DomainCode);
    $rows[] = $row;
}

/*while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}*/

//in json verwandeln
$return = json_encode($rows);
$Object = "{\"rows\": $return}";

print($Object);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>