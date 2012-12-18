<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$Username = $_GET["Name"];
$Passwort = $_GET["pwd"];

// SQL-Anfrage ausführen
$Querystring = 'SELECT * FROM tblUser WHERE UserName = "'.$Username.'" AND Passwort = "'.$Passwort.'"';
$result = mysqli_query($link, $Querystring);
$row = mysqli_fetch_assoc($result);
$NurLesen = $row["NurLesen"];
$anzUser = mysqli_num_rows($result);

$ReturnObjekt = "{\"anzUser\": $anzUser, \"NurLesen\": $NurLesen}";

//print($anzUser);
print($ReturnObjekt);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>