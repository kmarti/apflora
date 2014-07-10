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

$TPopId = $_GET["id"];
settype($TPopId, "integer");

$query = "SELECT * FROM tblTeilpopulation WHERE TPopId = " . mysqli_real_escape_string($link, $TPopId);
//echo "<pre>Debug: $query</pre>";

// SQL-Anfrage ausführen
$result = mysqli_query($link, $query);

/*if (false === $result) {
    printf("error: %s\n", mysqli_error($link));
}*/

$row = mysqli_fetch_assoc($result);
//print(implode("|",$row));

$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>