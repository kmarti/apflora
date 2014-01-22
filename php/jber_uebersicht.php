<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$JbuJahr = $_GET["JbuJahr"];
settype($jahr, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT * FROM tblJBerUebersicht WHERE JbuJahr=".$JbuJahr);

$row = mysqli_fetch_assoc($result);

$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>