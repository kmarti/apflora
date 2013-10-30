<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

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