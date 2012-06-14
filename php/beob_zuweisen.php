<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$no_note = $_GET["no_note"];
settype($no_note, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT NO_ISFS, TPopId, xGIS, yGIS, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((xGIS-TPopXKoord)*(xGIS-TPopXKoord)+(yGIS-TPopYKoord)*(yGIS-TPopYKoord)) AS DistZuTPop FROM alexande_beob.beob INNER JOIN (alexande_apflora.tblPopulation INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE ='.$no_note.' ORDER BY DistzuTPop, TPopFlurname');
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$row = array("TPopFlurname" => $r['TPopFlurname'], "TPopId" => $r['TPopId'], "DistZuTPop" => $r['DistZuTPop']);
    $rows[] = $row;
}

//in json verwandeln
$return = json_encode($rows);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>