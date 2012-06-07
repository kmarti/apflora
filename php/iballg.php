<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

$id = $_GET["id"];
settype($id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT * FROM tblIbAllg WHERE IbApArtId=".$id);

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