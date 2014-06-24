<?php
// Verbindung aufbauen, Datenbank auswählen
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");
$link2 = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_beob");

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

$Querystring = 'INSERT INTO tblAktionsplan (ApArtId, MutWann, MutWer) VALUES ('.mysqli_real_escape_string($link, $id).', "'.mysqli_real_escape_string($link, $time).'", "'.mysqli_real_escape_string($link, $user).'")';
$result = mysqli_query($link, $Querystring);

$Querystring2 = 'SELECT Artwert FROM alexande_beob.ArtenDb_Arteigenschaften WHERE TaxonomieId='.mysqli_real_escape_string($link, $id);
$result2 = mysqli_query($link2, $Querystring2);
$row = mysqli_fetch_assoc($result2);
$Artwert = $row["Artwert"];

$Querystring3 = 'UPDATE tblAktionsplan SET ApArtwert="'.mysqli_real_escape_string($link, $Artwert).'" WHERE ApArtId = '.mysqli_real_escape_string($link, $id);
$result3 = mysqli_query($link, $Querystring3);


if (!$result) {
	print "Fehler: Es wurde kein neues Programm gespeichert";
}

// Verbindung schliessen
mysqli_close($link);
mysqli_close($link2);
?>