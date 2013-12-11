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
settype($TPopId, "integer");
$TPopMassnId = $_GET["TPopMassnId"];
settype($TPopMassnId, "integer");
$user = $_GET["user"];

// MutWann ergänzen
$time = date('Y-m-d H:i:s');

// Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
$Querystring1 = 'CREATE TEMPORARY TABLE tmp SELECT * FROM tblTeilPopMassnahme WHERE TPopMassnId = '.$TPopMassnId;
$result1 = mysqli_query($link, $Querystring1);

// TPopId anpassen
$Querystring2 = 'UPDATE tmp SET TPopMassnId = NULL, TPopId = '.$TPopId.', MutWann="'.$time.'", MutWer="'.$user.'"';
$result2 = mysqli_query($link, $Querystring2);

// Den Datensatz einfügen
$Querystring3 = 'INSERT INTO tblTeilPopMassnahme SELECT * FROM tmp';
$result3 = mysqli_query($link, $Querystring3);

// neue id mitteilen
print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>