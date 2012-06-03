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
$result = mysqli_query($link, "SELECT ZaehleinheitCode, ZaehleinheitTxt FROM DomainTPopKontrZaehleinheit ORDER BY ZaehleinheitOrd");

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$ZaehleinheitCode = $r['ZaehleinheitCode'];
	settype($ZaehleinheitCode, "integer");
	$row = array("ZaehleinheitTxt" => $r['ZaehleinheitTxt'], "id" => $ZaehleinheitCode);
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