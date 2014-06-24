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

$PopId = $_POST["pop_id"];
settype($PopId, "integer");
$TPopId = $_POST["tpop_id"];
settype($TPopId, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'UPDATE tblTeilpopulation SET PopId="'.mysqli_real_escape_string($link, $PopId).'", MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'" WHERE TPopId='.mysqli_real_escape_string($link, $TPopId);

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Teilpopulation wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>