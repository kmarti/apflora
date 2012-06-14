<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");
$link2 = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");
mysqli_set_charset($link2, "utf8");

$ApArtId = $_GET["id"];
settype($id, "integer");
$no_note = $_GET["no_note"];
settype($no_note, "integer");
//beob dieses AP abfragen
if ($no_note) {
	//no_note wurde übergeben > auf eine Beobachtung filtern
	$result_beob = mysqli_query($link, "SELECT * FROM alexande_beob.beob WHERE NO_NOTE = $no_note AND NO_ISFS = $ApArtId AND xGIS > 0 AND yGIS > 0");
} else {
	$result_beob = mysqli_query($link, "SELECT * FROM alexande_beob.beob WHERE NO_NOTE NOT IN (SELECT IdZdsf FROM alexande_apflora.tblBeobachtungen WHERE NR=$ApArtId) AND NO_ISFS = $ApArtId AND xGIS > 0 AND yGIS > 0");
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