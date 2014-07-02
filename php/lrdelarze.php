<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT Label, CONCAT(Label, ": ", REPEAT(" ",(7-LENGTH(Label))), Einheit) AS Einheit FROM ArtenDb_LR WHERE LrMethodId = 1 ORDER BY Label');

// benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
	$Label = $r['Label'];
	$row = array("Einheit" => $r['Einheit'], "id" => $Label);
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