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

$no_note = $_POST["no_note"];
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');


$Querystring = 'INSERT INTO tblBeobZuordnung (NO_NOTE, BeobMutWann, BeobMutWer) VALUES ("'.mysqli_real_escape_string($link, $no_note).'", "'.mysqli_real_escape_string($link, $time).'", "'.mysqli_real_escape_string($link, $user).'")';


$result = mysqli_query($link, $Querystring);


if (!$result) {
	print "Fehler: Zuordnung gescheitert";
} else {
	print mysqli_insert_id($link);
}

// Verbindung schliessen
mysqli_close($link);
?>