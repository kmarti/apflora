<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_beob");
$link2 = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");


/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");
mysqli_set_charset($link2, "utf8");

$beobid = $_GET["beobid"];

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT NO_ISFS, alexande_apflora.tblTeilpopulation.TPopId, FNS_XGIS, FNS_YGIS, TPopXKoord, TPopYKoord, TPopFlurname, SQRT((FNS_XGIS-TPopXKoord)*(FNS_XGIS-TPopXKoord)+(FNS_YGIS-TPopYKoord)*(FNS_YGIS-TPopYKoord)) AS DistZuTPop FROM alexande_beob.tblBeobInfospezies INNER JOIN (alexande_apflora.tblPopulation INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE ="'.mysqli_real_escape_string($link, $beobid).'" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND FNS_XGIS IS NOT NULL AND FNS_YGIS IS NOT NULL ORDER BY DistzuTPop, TPopFlurname');
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$row = array("TPopFlurname" => $r['TPopFlurname'], "TPopId" => $r['TPopId'], "DistZuTPop" => $r['DistZuTPop']);
    $rows[] = $row;
}

// 
$return = json_encode($rows);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>