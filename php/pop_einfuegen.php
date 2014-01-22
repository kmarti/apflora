<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$ApArtId = $_POST["ap_art_id"]
settype($ApArtId, "integer");
$PopId = $_POST["pop_id"];
settype($PopId, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'UPDATE tblPopulation SET ApArtId="'.mysqli_real_escape_string($link, $ApArtId).'", MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'" WHERE PopId='.mysqli_real_escape_string($link, $PopId);

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Teilpopulation wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>