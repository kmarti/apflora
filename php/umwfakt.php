<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT * FROM tblUmweltFaktoren WHERE UfApArtId=".$id);

$row = mysqli_fetch_assoc($result);
$UfErstelldatum = $row["UfErstelldatum"];
//leerwerte nicht antasten - werden sonst zu 1.1.1970
if ($UfErstelldatum) {
	$row["UfErstelldatum"] = date("d.m.Y", strtotime($UfErstelldatum));
}

//in json verwandeln
$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>