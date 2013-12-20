<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT * FROM tblIdealbiotop WHERE IbApArtId=".mysqli_real_escape_string($link, $id));

$row = mysqli_fetch_assoc($result);
$IbErstelldatum = $row["IbErstelldatum"];
//leerwerte nicht antasten - werden sonst zu 1.1.1970
if ($IbErstelldatum) {
	$row["IbErstelldatum"] = date("d.m.Y", strtotime($IbErstelldatum));
}

//in json verwandeln
$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>