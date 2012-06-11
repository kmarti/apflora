<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

$beob_id = $_GET["beob_id"];
settype($beob_id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT BeobId, tblTeilpopulation.TPopId AS TPopId, X, Y, Projekt, RaumGde, Ort, Datum, Jahr, Autor, Herkunft, TPopFlurname, SQRT((X-TPopXKoord)*(X-TPopXKoord)+(Y-TPopYKoord)*(Y-TPopYKoord)) AS DistZuTPop FROM tblBeobachtungen INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON NR = ApArtId WHERE BeobId ='.$beob_id.' ORDER BY DistzuTPop, TPopFlurname');
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