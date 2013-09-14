<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT tblBeobInfospezies.* FROM tblBeobInfospezies WHERE NO_NOTE='.$id);
$row = mysqli_fetch_assoc($result);

//in json verwandeln
$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>