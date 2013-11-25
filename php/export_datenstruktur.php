<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "information_schema");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$csv_output = 'Tabelle: Name';'Tabelle: Anzahl Datensätze';'Tabelle: Bemerkungen';'Feld: Name';'Feld: Datentyp';'Feld: Nullwerte';'Feld: Bemerkungen'."\n";

$values = mysqli_query($link, "SELECT TABLES.TABLE_NAME, TABLES.TABLE_ROWS, TABLES.TABLE_COMMENT, COLUMNS.COLUMN_NAME,  COLUMNS.COLUMN_TYPE, COLUMNS.IS_NULLABLE, COLUMNS.COLUMN_COMMENT FROM COLUMNS INNER JOIN TABLES ON TABLES.TABLE_NAME = COLUMNS.TABLE_NAME WHERE COLUMNS.TABLE_NAME IN (SELECT TABLE_NAME FROM TABLES WHERE TABLE_SCHEMA='alexande_apflora')");

while ($rowr = mysqli_fetch_row($values)) {
	for ($j=0; $j<9; $j++) {
		$csv_output .= '"'.$rowr[$j].'";';
	}
	$csv_output .= "\n";
}
 
$filename = "Apflora_Datenstruktur_".date("Y-m-d_H-i",time());

header('Content-Type: text/x-csv; charset=utf-8');
//header('Content-Type: application/vnd.ms-excel; charset=utf-8');
header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Content-Disposition: attachment; filename='.$filename.'.csv');
//header('Content-Disposition: attachment; filename='.$filename.'.xls');
header('Pragma: no-cache');
header('Set-Cookie: fileDownload=true; path=/');

print($csv_output);

// Resultset freigeben
mysqli_free_result($values);

// Verbindung schliessen
mysqli_close($link);
?>