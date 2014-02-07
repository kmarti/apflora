<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_beob");
$link2 = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}
if ($link2->connect_errno) {
    printf("Connect failed: %s\n", $link2->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");
mysqli_set_charset($link2, "utf8");

$apartid = $_POST["apartid"];
settype($apartid, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId, IF(alexande_beob.ArtenDb_Arteigenschaften.Status Is Not Null, CONCAT(alexande_beob.ArtenDb_Arteigenschaften.Artname, '   ', alexande_beob.ArtenDb_Arteigenschaften.Status), alexande_beob.ArtenDb_Arteigenschaften.Artname) AS Artname FROM ArtenDb_Arteigenschaften WHERE alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId not in (SELECT alexande_apflora.tblAktionsplan.ApArtId FROM alexande_apflora.tblAktionsplan WHERE alexande_apflora.tblAktionsplan.ApArtId <> '".mysqli_real_escape_string($link, $apartid)."') ORDER BY Artname");

// benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$TaxonomieId = $r['TaxonomieId'];
	settype($TaxonomieId, "integer");
	$row = array("Artname" => $r['Artname'], "id" => $TaxonomieId);
    $rows[] = $row;
}

// in json verwandeln
$rows = json_encode($rows);
$Object = "{\"rows\": $rows}";

print($Object);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>