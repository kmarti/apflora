<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$TPopId = $_GET["tpop_id"];
settype($TPopId, "integer");
$TPopMassnId = $_GET["tpopmassn_id"];
settype($TPopMassnId, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'UPDATE tblTeilPopMassnahme SET TPopId="'.$TPopId.'", MutWann="'.$time.'", MutWer="'.$user.'" WHERE TPopMassnId='.$TPopMassnId;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Massnahme wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>