<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$JbuJahr = $_GET["JbuJahr"];
settype($jahr, "integer");

$Querystring = "DELETE FROM tblJBerUebersicht WHERE JbuJahr=".$JbuJahr;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Übersicht zu allen Arten wurde nicht gelöscht";
}

// Verbindung schliessen
mysqli_close($link);
?>