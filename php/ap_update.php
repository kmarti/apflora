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
$Feld = $_GET["Feld"];
$Wert = $_GET["Wert"];

$Querystring = "UPDATE tblAktionsplan SET ".$Feld." = ".$Wert." WHERE ApArtId = ".$id;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Wert ".$Wert." konnte nicht im Feld ".$Feld." gespeichert werden";
}

// Verbindung schliessen
mysqli_close($link);
?>