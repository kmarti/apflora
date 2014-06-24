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

$TPopId = $_POST["tpop_id"];
settype($TPopId, "integer");
$TPopKontrId = $_POST["tpopfeldkontr_id"];
settype($TPopKontrId, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'UPDATE tblTeilPopFeldkontrolle SET TPopId="'.mysqli_real_escape_string($link, $TPopId).'", MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'" WHERE TPopKontrId='.mysqli_real_escape_string($link, $TPopKontrId);

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Feldkontrolle wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>