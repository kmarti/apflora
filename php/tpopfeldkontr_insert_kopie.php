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
$TPopKontrId = $_GET["TPopKontrId"];
settype($TPopKontrId, "integer");
$user = $_GET["user"];

// MutWann ergänzen
$time = date('Y-m-d H:i:s');

// Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
$Querystring1 = 'CREATE TEMPORARY TABLE tmp SELECT * FROM tblTeilPopFeldkontrolle WHERE TPopKontrId = '.$TPopKontrId;
mysqli_query($link, $Querystring1);

// TPopId anpassen
$Querystring2 = 'UPDATE tmp SET TPopKontrId = NULL, TPopId = '.$TPopId.', MutWann="'.$time.'", MutWer="'.$user.'"';
mysqli_query($link, $Querystring2);

// Den Datensatz einfügen
$Querystring3 = 'INSERT INTO tblTeilPopFeldkontrolle SELECT * FROM tmp';
mysqli_query($link, $Querystring3);

// neue id mitteilen
print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>