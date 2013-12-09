<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$TPopId = $_POST["tpop_id"];
settype($TPopId, "integer");
$TPopKontrId = $_POST["tpopfeldkontr_id"];
settype($TPopKontrId, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'UPDATE tblTeilPopFeldkontrolle SET TPopId="'.$TPopId.'", MutWann="'.$time.'", MutWer="'.$user.'" WHERE TPopKontrId='.$TPopKontrId;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Feldkontrolle wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>