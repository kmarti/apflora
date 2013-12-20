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
settype($id, "integer");

$Querystring = "DELETE FROM tblPopMassnBericht WHERE PopMassnBerId = ".mysqli_real_escape_string($link, $id);

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Der Massnahmen-Bericht wurde nicht gelöscht";
}

// Verbindung schliessen
mysqli_close($link);
?>