<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

$Username = $_GET["Name"];
$Passwort = $_GET["pwd"];

// SQL-Anfrage ausführen
$Querystring = 'SELECT * FROM tblUser WHERE UserName = "'.$Username.'" AND Passwort = "'.$Passwort.'"';
$result = mysqli_query($link, $Querystring);
$anzUser = mysqli_num_rows($result);

print($anzUser);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>