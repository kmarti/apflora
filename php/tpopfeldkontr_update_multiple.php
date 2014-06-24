<?php
// Verbindung aufbauen, Datenbank auswählen
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

// in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_POST;
// id wird nur für die WHERE-Klausel benutzt, nicht speichern
$id = $_POST["id"];
settype($id, "integer");
unset($Felderarray["id"]);
// user soll als MutWer gespeichert werden
$user = $_POST["user"];
unset($Felderarray["user"]);
// Zeit wird in MutWann gespeichert
$time = date('Y-m-d H:i:s');

// zunächst mal Daten ins richtige Format bringen
foreach ($Felderarray as $key => $value) {
    if ($key == "TPopKontrDatum") {
		$value = date("Y-m-d H:i:s", strtotime($value));
	} 
}

// jetzt den Querystring aufbauen
$Querystring = 'UPDATE tblTeilPopFeldkontrolle SET MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'"';

// jetzt Querystring entwickeln
foreach ($Felderarray as $key => $value) {
	if ($value) {
		$Querystring .= ','.$key.'="'.$value.'"';
	} else {
		// Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
		$Querystring .= ','.$key.'=NULL';
	}
}
// MutWann, MutWer und Where ergänzen
$Querystring .= ' WHERE TPopKontrId='.mysqli_real_escape_string($link, $id);

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print($result);

// Verbindung schliessen
mysqli_close($link);
?>