<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

//in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_GET;
//die id der zu kopierenden TPop wird übernommen
$TPopId = $_GET["TPopId"];
settype($TPopId, "integer");
$TPopMassnId = $_GET["TPopMassnId"];
settype($TPopMassnId, "integer");
$user = $_GET["user"];

//MutWann ergänzen
$time = date('Y-m-d H:i:s');

//Array in zwei kommagetrennte String-Listen verwandeln
$Feldliste = implode(",", array_keys($Felderarray));
$Wertliste = "'".implode("','", array_values($Felderarray))."'";

$Querystring = 'CREATE TEMPORARY TABLE tmp SELECT * FROM tblTeilPopMassnahme WHERE TPopMassnId = '.$TPopMassnId;
//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);
$Querystring = 'UPDATE tmp SET TPopMassnId = NULL, TPopId = '.$TPopId.', MutWann="'.$time.'", MutWer="'.$user.'"';
//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);
$Querystring = 'INSERT INTO tblTeilPopMassnahme SELECT * FROM tmp';
//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

//neue id mitteilen
//print $result;
print mysqli_insert_id($link);


// Verbindung schliessen
mysqli_close($link);
?>
