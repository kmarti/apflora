<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("127.0.0.1", "root", "admin", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$beobid = $_GET["beobid"];
$tpop_id = $_GET["tpop_id"];
settype($tpop_id, "integer");
$apart_id = $_GET["apart_id"];
settype($apart_id, "integer");
//beob dieses AP abfragen
if ($beobid) {
	//beobid wurde übergeben > auf eine Beobachtung filtern
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeob WHERE BeobId = '".$beobid."' AND xGIS > 0 AND yGIS > 0");
} else if ($tpop_id) {
	//tpop_id wurde übergeben > auf tpop filtern
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeob WHERE TPopId=".$tpop_id." AND xGIS > 0 AND yGIS > 0");
} else if ($apart_id) {
	//apart_id wurde übergeben > auf Art filtern, nur die nicht zugewiesenen
	$result_beob = mysqli_query($link, "SELECT * FROM tblBeob WHERE NO_ISFS=".$apart_id." AND xGIS > 0 AND yGIS > 0 AND (TPopId IS NULL OR TPopId = '')");
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