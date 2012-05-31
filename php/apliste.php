<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

//ist ap_arten true, sollen nur ap_arten angezeigt werden
$ap_arten = $_GET["ap_arten"];

// SQL-Anfrage ausführen
if ($ap_arten) {
	$result = mysqli_query($link, "SELECT Name, ApArtId FROM qryAp1 WHERE ApStatus BETWEEN 1 AND 3");
} else {
	$result = mysqli_query($link, "SELECT Name, ApArtId FROM qryAp1");
}

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
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
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>