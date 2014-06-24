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

$id = $_POST["id"];
settype($id, "integer");

$Querystring = "DELETE FROM tblErfKrit WHERE ErfkritId=".mysqli_real_escape_string($link, $id);

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Das Erfolgskriterium wurde nicht gelöscht";
}

// Verbindung schliessen
mysqli_close($link);
?>