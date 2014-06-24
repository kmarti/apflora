<?php
// Verbindung aufbauen, Datenbank auswählen
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");

$link2 = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_beob");

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

$ApArtId = $_GET["id"];
settype($id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT alexande_apflora.tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.tblAktionsplan.ApStatus, alexande_apflora.tblAktionsplan.ApJahr, alexande_apflora.tblAktionsplan.ApUmsetzung, alexande_apflora.tblAktionsplan.ApBearb, alexande_apflora.tblAktionsplan.ApArtwert, alexande_apflora.tblAktionsplan.MutWann, alexande_apflora.tblAktionsplan.MutWer FROM alexande_apflora.tblAktionsplan INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId WHERE ApArtId = ".mysqli_real_escape_string($link, $ApArtId));

$row = mysqli_fetch_assoc($result);

$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>