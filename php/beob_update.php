<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_POST["id"];
$Feld = $_POST["Feld"];
$Wert = $_POST["Wert"];
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

if ($Wert == NULL) {
	//Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
	$Querystring = 'UPDATE tblBeobZuordnung SET '.$Feld.'= NULL, BeobMutWann="'.$time.'", BeobMutWer="'.$user.'" WHERE NO_NOTE = "'.$id.'"';
} else {
	$Querystring = 'UPDATE tblBeobZuordnung SET '.$Feld.'="'.$Wert.'", BeobMutWann="'.$time.'", BeobMutWer="'.$user.'" WHERE NO_NOTE = "'.$id.'"';
}

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Wert ".$Wert." konnte nicht im Feld ".$Feld." gespeichert werden";
}

// Verbindung schliessen
mysqli_close($link);
?>