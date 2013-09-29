<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link2 = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

//ist ap_arten true, sollen nur ap_arten angezeigt werden
$programm = $_GET["programm"];

// SQL-Anfrage ausführen
if ($programm == "programm_ap") {
	$result = mysqli_query($link, "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS Name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId WHERE alexande_apflora.tblAktionsplan.ApStatus BETWEEN 1 AND 3 ORDER BY Name");
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$ApArtId = $r['ApArtId'];
		settype($ApArtId, "integer");
		$ap_name = $r['Name'];
		$row = array("ap_name" => $ap_name, "id" => $ApArtId);
	    $rows[] = $row;
	}
} else if ($programm == "programm_alle") {
	$result = mysqli_query($link, "SELECT alexande_beob.ArtenDb_Arteigenschaften.Artname AS Name, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId FROM alexande_beob.ArtenDb_Arteigenschaften INNER JOIN alexande_apflora.tblAktionsplan ON alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId=alexande_apflora.tblAktionsplan.ApArtId ORDER BY Name");
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$ApArtId = $r['ApArtId'];
		settype($ApArtId, "integer");
		$ap_name = $r['Name'];
		$row = array("ap_name" => $ap_name, "id" => $ApArtId);
	    $rows[] = $row;
	}
} else {
	$result = mysqli_query($link, "SELECT IF(alexande_beob.ArtenDb_Arteigenschaften.Status is not null, CONCAT(alexande_beob.ArtenDb_Arteigenschaften.Artname, '   ', alexande_beob.ArtenDb_Arteigenschaften.Status), alexande_beob.ArtenDb_Arteigenschaften.Artname) AS ApName, alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId AS NR FROM alexande_beob.ArtenDb_Arteigenschaften WHERE alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT alexande_apflora.tblAktionsplan.ApArtId FROM alexande_apflora.tblAktionsplan) ORDER BY ApName");
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$ApArtId = $r['NR'];
		settype($ApArtId, "integer");
		$ap_name = $r['ApName'];
		$row = array("ap_name" => $ap_name, "id" => $ApArtId);
	    $rows[] = $row;
	}
}

//in json verwandeln
$rows = json_encode($rows);
$Object = "{\"rows\": $rows}";

print($Object);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
mysqli_close($link2);
?>