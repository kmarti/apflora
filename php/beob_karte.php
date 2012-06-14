<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$no_note = $_GET["no_note"];
settype($no_note, "integer");
$tpop_id = $_GET["tpop_id"];
settype($tpop_id, "integer");
$apart_id = $_GET["apart_id"];
settype($apart_id, "integer");
//beob dieses AP abfragen
if ($no_note) {
	//no_note wurde übergeben > auf eine Beobachtung filtern
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeob WHERE NO_NOTE = $no_note AND xGIS > 0 AND yGIS > 0");
} else if ($tpop_id) {
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeob WHERE TPopId=".$tpop_id." AND xGIS > 0 AND yGIS > 0");
} else if ($apart_id) {
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeob WHERE NO_ISFS=".$apart_id." AND xGIS > 0 AND yGIS > 0");
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