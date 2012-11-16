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

$PopId = $_GET["pop_id"];
settype($PopId, "integer");
$TPopId = $_GET["tpop_id"];
settype($TPopId, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

//TPopPop 0 setzen, falls es bisher -1 war (neue TPop soll nicht die bisherige repräsentative ersetzen und es gibt bestimmt schon eine)
$Querystring = 'UPDATE tblTeilpopulation SET PopId="'.$PopId.'", TPopPop="0", MutWann="'.$time.'", MutWer="'.$user.'" WHERE TPopId='.$TPopId;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Teilpopulation wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>