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

//zunächst mal Daten ins richtige Format bringen
foreach ($Felderarray as $key => $value) {
    if ($key == "TPopMassnDatum") {
    	if ($value) {
			$value = date("YYYY-MM-DD", strtotime($value));
			//$value = date_create_from_format('YYYY-MM-DD', $value);
		} else {
			$value = null;
		}
	} 
}

//MutWann ergänzen
$time = date('Y-m-d H:i:s');

//Array in zwei kommagetrennte String-Listen verwandeln
$Feldliste = implode(",", array_keys($Felderarray));
$Wertliste = '"'.implode('","', array_values($Felderarray)).'"';

$Querystring = 'INSERT INTO tblTeilPopMassnahme ('.$Feldliste.',MutWann) VALUES ('.$Wertliste.',"'.$time.'")';

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

//neue id mitteilen
print mysqli_insert_id($link);


// Verbindung schliessen
mysqli_close($link);
?>