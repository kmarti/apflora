<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$no_note = $_POST["no_note"];
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');


$Querystring = 'INSERT INTO tblBeobZuordnung (NO_NOTE, BeobMutWann, BeobMutWer) VALUES ("'.$no_note.'", "'.$time.'", "'.$user.'")';


$result = mysqli_query($link, $Querystring);


if (!$result) {
	print "Fehler: Zuordnung gescheitert";
} else {
	print mysqli_insert_id($link);
}

// Verbindung schliessen
mysqli_close($link);
?>