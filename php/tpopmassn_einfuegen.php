<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

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