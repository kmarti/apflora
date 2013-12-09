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
//settype($id, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'INSERT INTO tblTeilPopBericht (TPopId, MutWann, MutWer) VALUES ('.$id.', "'.$time.'", "'.$user.'")';	//muss die neue TPopKontrId erhalten!

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

//neue id mitteilen
print mysqli_insert_id($link);


// Verbindung schliessen
mysqli_close($link);
?>