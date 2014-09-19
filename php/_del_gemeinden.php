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

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT GmdName FROM DomainGemeinden ORDER BY GmdName');

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$row = array("GmdName" => $r['GmdName']);
    $rows[] = $row;
}

$rows = json_encode($rows);
$Object = "{\"rows\": $rows}";

print($Object);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>