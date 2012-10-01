<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

$JbuJahr = $_GET["JbuJahr"];
settype($JbuJahr, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'INSERT INTO tblJBerUebersicht (JbuJahr, MutWann, MutWer) VALUES ('.$JbuJahr.', "'.$time.'", "'.$user.'")';	//muss die neue PopId erhalten!

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print $result;

// Verbindung schliessen
mysqli_close($link);
?>