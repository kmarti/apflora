<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

//in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_GET;

//MutWann ergänzen
$time = date('Y-m-d H:i:s');

//Array in zwei kommagetrennte String-Listen verwandeln
$Feldliste = implode(",", array_keys($Felderarray));
$Wertliste = "'".implode("','", array_values($Felderarray))."'";

$Querystring = 'INSERT INTO tblTeilpopulation ('.$Feldliste.',MutWann) VALUES ('.$Wertliste.',"'.$time.'")';

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

//neue id mitteilen
//print $result;
print mysqli_insert_id($link);


// Verbindung schliessen
mysqli_close($link);
?>