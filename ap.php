<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

// SQL-Anfrage ausführen
$query = "SELECT Name, ApArtId FROM qryAp1";
$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());

// in json ausgeben
$rows = array();
/*while($r = mysql_fetch_assoc($result)) {
	//$a = '{ "data":"'.$r['Name'].'", "attr": {"ApArtId":'.json_encode($r['ApArtId']).'}}';
	$a = '{ "data":"';
	$b = $r['Name'];
	$c = '", "attr": {"ApArtId":"';
	$d = $r['ApArtId'];
	$e = '"}}';
    $rows[] = $a.$b.$c.$d.$e;
}*/
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r['Name'];
}

/*while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}*/

print json_encode($rows);
//print json_encode($result);

// Resultset freigeben
mysql_free_result($result);

// Verbindung schliessen
mysql_close($link);
?>