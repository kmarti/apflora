<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

// check connection
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

// die id der zu kopierenden TPop wird übernommen
// mit post hat irgend etwas in php nicht funktioniert (es wurde immer id=0 zurückgegeben), daher wieder get eingeschatet
$TPopId = $_GET["TPopId"];
settype($TPopId, "integer");
$PopId = $_GET["PopId"];
settype($PopId, "integer");
$user = $_GET["user"];

// MutWann ergänzen
$time = date('Y-m-d H:i:s');

// Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
$Querystring = 'CREATE TEMPORARY TABLE tmp SELECT * FROM tblTeilpopulation WHERE TPopId = '.$TPopId;
$result = mysqli_query($link, $Querystring);

// PopId anpassen
$Querystring = 'UPDATE tmp SET TPopId = NULL, PopId = '.$PopId.', MutWann="'.$time.'", MutWer="'.$user.'"';
$result = mysqli_query($link, $Querystring);

// Den Datensatz einfügen
$Querystring = 'INSERT INTO tblTeilpopulation SELECT * FROM tmp';
$result = mysqli_query($link, $Querystring);

// neue id mitteilen
print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>