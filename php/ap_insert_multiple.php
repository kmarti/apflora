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

//in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_GET;

//zeit muss umgewandelt werden!
/*foreach ($_GET as $key => $value) {
	if ($key == "JBerDatum") {
		if ($value) {
			$value = date("Y-m-d H:i:s", strtotime($value));
		} else {
			$value = null;
		}
	}
}*/

$Keystring = implode(',', array_keys($_GET));
$Valuestring = implode('","', array_values($_GET));

//jetzt den Querystring aufbauen
$Querystring = 'INSERT INTO tblAktionsplan ('.$Keystring.') VALUES ("'.$Valuestring.'")';

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print($result);

// Verbindung schliessen
mysqli_close($link);
?>