<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_beob");

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
$nicht_zuzuordnen = $_GET["nicht_zuzuordnen"];
settype($apart_id, "integer");
//beob dieses AP abfragen
if ($beobid) {
	//beobid wurde übergeben > auf eine Beobachtung filtern
	$result_beob = mysqli_query($link, 'SELECT tblBeobInfospezies.NO_NOTE, tblBeobInfospezies.NO_ISFS, tblBeobInfospezies.FNS_XGIS AS X, tblBeobInfospezies.FNS_YGIS AS Y, tblBeobInfospezies.A_NOTE, tblBeobBereitgestellt.Datum, tblBeobBereitgestellt.Autor, tblBeobInfospezies.PROJET, tblBeobInfospezies.DESC_LOCALITE FROM tblBeobInfospezies INNER JOIN tblBeobBereitgestellt ON tblBeobInfospezies.NO_NOTE = tblBeobBereitgestellt.NO_NOTE WHERE tblBeobInfospezies.FNS_XGIS>0 AND tblBeobInfospezies.FNS_YGIS>0 AND tblBeobInfospezies.NO_NOTE="'.mysqli_real_escape_string($link, $beobid).'" UNION SELECT tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, tblBeobEvab.NO_ISFS, tblBeobEvab.COORDONNEE_FED_E AS X, tblBeobEvab.COORDONNEE_FED_N AS Y, tblBeobEvab.A_NOTE, tblBeobBereitgestellt.Datum, tblBeobBereitgestellt.Autor, tblBeobEvab.Projekt_ZH AS PROJET, tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE FROM tblBeobBereitgestellt INNER JOIN tblBeobEvab ON tblBeobBereitgestellt.NO_NOTE_PROJET = tblBeobEvab.NO_NOTE_PROJET WHERE tblBeobEvab.COORDONNEE_FED_E>0 AND tblBeobEvab.COORDONNEE_FED_N>0 AND tblBeobEvab.NO_NOTE_PROJET="'.mysqli_real_escape_string($link, $beobid).'"');
} else if ($tpop_id) {
	//tpop_id wurde übergeben > auf tpop filtern
	$result_beob = mysqli_query($link, 'SELECT alexande_beob.tblBeobInfospezies.NO_NOTE, alexande_beob.tblBeobInfospezies.NO_ISFS, alexande_beob.tblBeobInfospezies.FNS_XGIS AS X, alexande_beob.tblBeobInfospezies.FNS_YGIS AS Y, alexande_beob.tblBeobInfospezies.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobInfospezies.PROJET, alexande_beob.tblBeobInfospezies.DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblTeilpopulation.TPopXKoord, alexande_apflora.tblTeilpopulation.TPopYKoord FROM (alexande_beob.tblBeobInfospezies INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE) INNER JOIN (alexande_apflora.tblTeilpopulation INNER JOIN alexande_apflora.tblBeobZuordnung ON alexande_apflora.tblTeilpopulation.TPopId = alexande_apflora.tblBeobZuordnung.TPopId) ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobInfospezies.FNS_XGIS>0 AND alexande_beob.tblBeobInfospezies.FNS_YGIS>0 AND alexande_apflora.tblBeobZuordnung.TPopId='.mysqli_real_escape_string($link, $tpop_id).' UNION SELECT alexande_beob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, alexande_beob.tblBeobEvab.NO_ISFS, alexande_beob.tblBeobEvab.COORDONNEE_FED_E AS X, alexande_beob.tblBeobEvab.COORDONNEE_FED_N AS Y, alexande_beob.tblBeobEvab.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobEvab.Projekt_ZH AS PROJET, alexande_beob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblTeilpopulation.TPopXKoord, alexande_apflora.tblTeilpopulation.TPopYKoord FROM (alexande_beob.tblBeobBereitgestellt INNER JOIN alexande_beob.tblBeobEvab ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = alexande_beob.tblBeobEvab.NO_NOTE_PROJET) INNER JOIN (alexande_apflora.tblTeilpopulation INNER JOIN alexande_apflora.tblBeobZuordnung ON alexande_apflora.tblTeilpopulation.TPopId = alexande_apflora.tblBeobZuordnung.TPopId) ON alexande_beob.tblBeobEvab.NO_NOTE_PROJET = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobEvab.COORDONNEE_FED_E>0 AND alexande_beob.tblBeobEvab.COORDONNEE_FED_N>0 AND alexande_apflora.tblBeobZuordnung.TPopId='.mysqli_real_escape_string($link, $tpop_id));
} else if ($apart_id) {
	//apart_id wurde übergeben > auf Art filtern 
	if ($nicht_zuzuordnen) {
		//die nicht zugeordneten
		$result_beob = mysqli_query($link, 'SELECT alexande_beob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, alexande_beob.tblBeobEvab.NO_ISFS, alexande_beob.tblBeobEvab.COORDONNEE_FED_E AS X, alexande_beob.tblBeobEvab.COORDONNEE_FED_N AS Y, alexande_beob.tblBeobEvab.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobEvab.Projekt_ZH AS PROJET, alexande_beob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobBereitgestellt INNER JOIN alexande_beob.tblBeobEvab ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = alexande_beob.tblBeobEvab.NO_NOTE_PROJET) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobEvab.NO_NOTE_PROJET = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobEvab.COORDONNEE_FED_E>0 AND alexande_beob.tblBeobEvab.COORDONNEE_FED_N>0 AND alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen =1 AND alexande_beob.tblBeobEvab.NO_ISFS='.mysqli_real_escape_string($link, $apart_id).' UNION SELECT alexande_beob.tblBeobInfospezies.NO_NOTE, alexande_beob.tblBeobInfospezies.NO_ISFS, alexande_beob.tblBeobInfospezies.FNS_XGIS AS X, alexande_beob.tblBeobInfospezies.FNS_YGIS AS Y, alexande_beob.tblBeobInfospezies.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobInfospezies.PROJET, alexande_beob.tblBeobInfospezies.DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobInfospezies INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobInfospezies.FNS_XGIS>0 AND alexande_beob.tblBeobInfospezies.FNS_YGIS>0 AND alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=1 AND alexande_beob.tblBeobInfospezies.NO_ISFS='.mysqli_real_escape_string($link, $apart_id));
	} else {
		//die nicht zugewiesenen
		$result_beob = mysqli_query($link, 'SELECT alexande_beob.tblBeobEvab.NO_NOTE_PROJET AS NO_NOTE, alexande_beob.tblBeobEvab.NO_ISFS, alexande_beob.tblBeobEvab.COORDONNEE_FED_E AS X, alexande_beob.tblBeobEvab.COORDONNEE_FED_N AS Y, alexande_beob.tblBeobEvab.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobEvab.Projekt_ZH AS PROJET, alexande_beob.tblBeobEvab.DESC_LOCALITE_ AS DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobBereitgestellt INNER JOIN alexande_beob.tblBeobEvab ON alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET = alexande_beob.tblBeobEvab.NO_NOTE_PROJET) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobEvab.NO_NOTE_PROJET = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobEvab.COORDONNEE_FED_E>0 AND alexande_beob.tblBeobEvab.COORDONNEE_FED_N>0 AND alexande_apflora.tblBeobZuordnung.TPopId Is Null AND alexande_beob.tblBeobEvab.NO_ISFS='.mysqli_real_escape_string($link, $apart_id).' UNION SELECT alexande_beob.tblBeobInfospezies.NO_NOTE, alexande_beob.tblBeobInfospezies.NO_ISFS, alexande_beob.tblBeobInfospezies.FNS_XGIS AS X, alexande_beob.tblBeobInfospezies.FNS_YGIS AS Y, alexande_beob.tblBeobInfospezies.A_NOTE, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, alexande_beob.tblBeobInfospezies.PROJET, alexande_beob.tblBeobInfospezies.DESC_LOCALITE, alexande_apflora.tblBeobZuordnung.TPopId FROM (alexande_beob.tblBeobInfospezies INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE) LEFT JOIN alexande_apflora.tblBeobZuordnung ON alexande_beob.tblBeobInfospezies.NO_NOTE = alexande_apflora.tblBeobZuordnung.NO_NOTE WHERE alexande_beob.tblBeobInfospezies.FNS_XGIS>0 AND alexande_beob.tblBeobInfospezies.FNS_YGIS>0 AND alexande_apflora.tblBeobZuordnung.TPopId Is Null AND alexande_beob.tblBeobInfospezies.NO_ISFS='.mysqli_real_escape_string($link, $apart_id));
	}
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