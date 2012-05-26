<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

// SQL-Anfrage ausführen
$query = "SELECT Name, ApArtId FROM qryAp1";
$result = mysql_query($query) or die("Anfrage fehlgeschlagen: " . mysql_error());

$rows = "[";
while($r = mysql_fetch_assoc($result)) {
	$attr = array("id" => $r['ApArtId']);
	$children = array(0 => "Populationen", 1 => "AP-Ziele", 2 => "Erfolgskriterien", 3 => "AP-Berichte", 4 => "Berichte");
	$row = array("data" => $r['Name'], "attr" => $attr, "state" => "closed", "children" => $children);
	if ($rows != "[") {
    	$rows .= ",";
    }
    $rows .= json_encode($row);
}
$rows .= "]";

/*$rows = "[";
while($r = mysql_fetch_assoc($result)) {
	$attr = array("id" => $r['ApArtId']);
	$data = array("title" => $r['Name'], "attr" => $attr);
	$children = array(0 => "Populationen", 1 => "AP-Ziele", 2 => "Erfolgskriterien", 3 => "AP-Berichte", 4 => "Berichte");
	$row = array($data, "state" => "closed", "children" => $children);
	if ($rows != "[") {
    	$rows .= ",";
    }
    $rows .= json_encode($row);
}
$rows .= "]";*/

print($rows);

// Resultset freigeben
mysql_free_result($result);

// Verbindung schliessen
mysql_close($link);
?>