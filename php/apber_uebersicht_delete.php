<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$jahr = $_GET["jahr"];
settype($jahr, "integer");

$Querystring = "DELETE FROM tblApJBerUebersicht WHERE Jahr=".$jahr;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht";
}

// Verbindung schliessen
mysqli_close($link);
?>