<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("127.0.0.1", "root", "admin", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");
$Feld = $_GET["Feld"];
$Wert = $_GET["Wert"];
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

//zeit muss umgewandelt werden!
if ($Feld == "JBerDatum") {
	if ($Wert || $Wert == 0) {
		$Wert = date("Y-m-d H:i:s", strtotime($Wert));
	} else {
		$Wert = null;
	}
}

if ($Wert || $Wert == 0) {
	$Querystring = 'UPDATE tblJBer SET '.$Feld.'="'.$Wert.'", MutWann="'.$time.'", MutWer="'.$user.'" WHERE JBerId = '.$id;
} else {
	//Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
	$Querystring = 'UPDATE tblJBer SET '.$Feld.'=null, MutWann="'.$time.'", MutWer="'.$user.'" WHERE JBerId = '.$id;
}

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Wert ".$Wert." konnte nicht im Feld ".$Feld." gespeichert werden";
}

// Verbindung schliessen
mysqli_close($link);
?>