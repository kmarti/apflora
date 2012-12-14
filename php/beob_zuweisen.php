<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");

$link2 = new mysqli("127.0.0.1", "root", "admin", "alexande_apflora");


/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");
mysqli_set_charset($link2, "utf8");

$beobid = $_GET["beobid"];

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT NO_ISFS, alexande_apflora.tblTeilpopulation.TPopId, xGIS, yGIS, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((xGIS-TPopXKoord)*(xGIS-TPopXKoord)+(yGIS-TPopYKoord)*(yGIS-TPopYKoord)) AS DistZuTPop FROM alexande_beob.tblBeob INNER JOIN (alexande_apflora.tblPopulation INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) ON NO_ISFS = ApArtId WHERE BeobId ="'.$beobid.'" ORDER BY DistzuTPop, TPopFlurname');
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