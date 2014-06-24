<?php
// Verbindung aufbauen, Datenbank auswählen
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");

// check connection
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

// die id der zu kopierenden TPop wird übernommen
$TPopId = $_POST["TPopId"];
settype($TPopId, "integer");
$TPopKontrId = $_POST["TPopKontrId"];
settype($TPopKontrId, "integer");
$user = $_POST["user"];

// MutWann ergänzen
$time = date('Y-m-d H:i:s');

// Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
$Querystring1 = 'CREATE TEMPORARY TABLE tmp SELECT * FROM tblTeilPopFeldkontrolle WHERE TPopKontrId = '.mysqli_real_escape_string($link, $TPopKontrId);
mysqli_query($link, $Querystring1);

// TPopId anpassen
$Querystring2 = 'UPDATE tmp SET TPopKontrId = NULL, TPopId = '.mysqli_real_escape_string($link, $TPopId).', MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'"';
mysqli_query($link, $Querystring2);

// Den Datensatz einfügen
$Querystring3 = 'INSERT INTO tblTeilPopFeldkontrolle SELECT * FROM tmp';
mysqli_query($link, $Querystring3);

// neue id mitteilen
print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>