<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
$beobtyp = $_GET["beobtyp"];

// SQL-Anfrage ausführen
if ($beobtyp == "infospezies") {
	$result = mysqli_query($link, "SELECT * FROM tblBeobZuordnung WHERE NO_NOTE = $id");
} else {
	$result = mysqli_query($link, 'SELECT * FROM tblBeobZuordnung WHERE NO_NOTE_PROJET="'.$id.'"');
}

$row = mysqli_fetch_assoc($result);

//in json verwandeln
$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>