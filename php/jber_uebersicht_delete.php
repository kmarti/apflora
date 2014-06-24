<?php
// Verbindung aufbauen, Datenbank auswählen
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$JbuJahr = $_POST["jahr"];
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