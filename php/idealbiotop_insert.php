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
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'INSERT INTO tblIdealbiotop (IbApArtId, MutWann, MutWer) VALUES ('.mysqli_real_escape_string($link, $id).', "'.mysqli_real_escape_string($link, $time).'", "'.mysqli_real_escape_string($link, $user).'")';	// muss die neue PopId erhalten!

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

// speziell: bei Idealbiotopen ist die ApArtId = der id (1:1)
print $id;

// Verbindung schliessen
mysqli_close($link);
?>