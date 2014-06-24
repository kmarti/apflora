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

$JbuJahr = $_POST["JbuJahr"];
settype($JbuJahr, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'INSERT INTO tblJBerUebersicht (JbuJahr, MutWann, MutWer) VALUES ('.mysqli_real_escape_string($link, $JbuJahr).', "'.mysqli_real_escape_string($link, $time).'", "'.mysqli_real_escape_string($link, $user).'")';	// muss die neue PopId erhalten!

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print $result;

// Verbindung schliessen
mysqli_close($link);
?>