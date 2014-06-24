<?php
// Verbindung aufbauen, Datenbank auswählen
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora_views");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$view = 'vTPopAnzMassn'; // view you want to export
$file = 'TeilpopulationenAnzahlMassnahmen'; // csv name.

$result = mysqli_query($link, "SHOW COLUMNS FROM ".$view."");
$i = 0;
$csv_output = '';
 
if (mysqli_num_rows($result) > 0) {
	while ($row = mysqli_fetch_assoc($result)) {
		$csv_output .= '"'.$row['Field'].'";';
	$i++;}
}
$csv_output .= "\n";
$values = mysqli_query($link, "SELECT * FROM ".$view."");
 
while ($rowr = mysqli_fetch_row($values)) {
	// In den Daten sind Zeilenumbrüche und Hochzeichen
	// sie müssen entfernt werden, sonst bricht die Tabelle auch daran um
	$Ersetzungen = array("\r\n", "\r", "\n");
	for ($j=0;$j<$i;$j++) {
		$rowr[$j] = str_replace($Ersetzungen, ' ', $rowr[$j]);
		$rowr[$j] = str_replace('"', "'", $rowr[$j]);
		$rowr[$j] = str_replace(';', ":", $rowr[$j]);
		$csv_output .= '"'.$rowr[$j].'";';
	}
	$csv_output .= "\n";
}
 
$filename = $file."_".date("Y-m-d_H-i",time());

header('Content-Type: text/x-csv; charset=utf-8');
header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Content-Disposition: attachment; filename='.$filename.'.csv');
header('Pragma: no-cache');
header('Set-Cookie: fileDownload=true; path=/');

print($csv_output);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>