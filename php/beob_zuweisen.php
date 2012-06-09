<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

$no_note = $_GET["no_note"];
settype($no_note, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT ISFS, TPopId, xGIS, yGIS, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((xGIS-TPopXKoord)*(xGIS-TPopXKoord)+(yGIS-TPopYKoord)*(yGIS-TPopYKoord)) AS DistZuTPop FROM BeobachtungenZdsf_ZdsfBeob INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON ISFS = ApArtId WHERE NO_NOTE ='.$no_note.' ORDER BY DistzuTPop, TPopFlurname');
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