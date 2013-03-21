<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

//in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_GET;

//zeit muss umgewandelt werden!
foreach ($_GET as $key => $value) {
	if ($key == "TPopKontrDatum") {
		if ($value) {
			$value = date("Y-m-d H:i:s", strtotime($value));
		} else {
			$value = null;
		}
	}
}

$Keystring = implode(',', array_keys($_GET));
$Valuestring = implode('","', array_values($_GET));

//jetzt den Querystring aufbauen
$Querystring = 'INSERT INTO tblTeilPopFeldkontrolle ('.$Keystring.') VALUES ("'.$Valuestring.'")';

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

//print($result);
print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>