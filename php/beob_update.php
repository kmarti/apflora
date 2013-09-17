<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
$Feld = $_GET["Feld"];
$Wert = $_GET["Wert"];
$user = $_GET["user"];
$beobtyp = $_GET["beobtyp"];
$time = date('Y-m-d H:i:s');

if ($beobtyp == "infospezies") {
	if ($Wert == NULL) {
		//Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
		$Querystring = 'UPDATE tblBeobZuordnung SET '.$Feld.'= NULL, BeobMutWann="'.$time.'", BeobMutWer="'.$user.'" WHERE NO_NOTE='.$id;
	} else {
		$Querystring = 'UPDATE tblBeobZuordnung SET '.$Feld.'="'.$Wert.'", BeobMutWann="'.$time.'", BeobMutWer="'.$user.'" WHERE NO_NOTE='.$id;
	}
} else {
	if ($Wert == NULL) {
		//Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
		$Querystring = 'UPDATE tblBeobZuordnung SET '.$Feld.'= NULL, BeobMutWann="'.$time.'", BeobMutWer="'.$user.'" WHERE NO_NOTE_PROJET = "'.$id.'"';
	} else {
		$Querystring = 'UPDATE tblBeobZuordnung SET '.$Feld.'="'.$Wert.'", BeobMutWann="'.$time.'", BeobMutWer="'.$user.'" WHERE NO_NOTE_PROJET = "'.$id.'"';
	}
}

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Wert ".$Wert." konnte nicht im Feld ".$Feld." gespeichert werden";
}

// Verbindung schliessen
mysqli_close($link);
?>