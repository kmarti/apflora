<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$JBerId = $_GET["id"];
settype($JBerId, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT * FROM tblJBer WHERE JBerId=".$JBerId);

$row = mysqli_fetch_assoc($result);
$JBerDatum = $row["JBerDatum"];
// leerwerte nicht antasten - werden sonst zu 1.1.1970
if ($JBerDatum) {
	$row["JBerDatum"] = date("d.m.Y", strtotime($JBerDatum));
}

$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>