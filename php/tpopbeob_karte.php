<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$beob_id = $_GET["beob_id"];
settype($beob_id, "integer");
$tpop_id = $_GET["tpop_id"];
settype($tpop_id, "integer");
//beob dieses AP abfragen
if ($beob_id) {
	//beob_id wurde übergeben > auf eine Beobachtung filtern
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeobachtungen WHERE BeobId = $beob_id AND X > 0 AND Y > 0");
} else {
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeobachtungen WHERE TPopId = $tpop_id AND X > 0 AND Y > 0");
}
//beob aufbauen
$rows_beob = array();
while($r_beob = mysqli_fetch_assoc($result_beob)) {
	//beob-Array um beob ergänzen
    $rows_beob[] = $r_beob;
}
mysqli_free_result($result_beob);
	
//in json verwandeln
$rows = json_encode($rows_beob);
$Object = "{\"rows\": $rows}";

print($Object);

// Verbindung schliessen
mysqli_close($link);
?>