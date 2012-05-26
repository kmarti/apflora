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
/*$rows = array();
while($r = mysql_fetch_assoc($result)) {
	//$a = '{ "data":"'.$r['Name'].'", "attr": {"ApArtId":'.json_encode($r['ApArtId']).'}}';
	$a = '{ "data":"';
	$b = $r['Name'];
	$c = '", "attr": {"id":"';
	$d = $r['ApArtId'];
	$e = '"}, "state":"closed", "children":["Populationen", "AP-Ziele"]},';
    $rows = $a.$b.$c.$d.$e;
}*/

/*$rows = "";
while($r = mysql_fetch_assoc($result)) {
	//$a = '{ "data":"'.$r['Name'].'", "attr": {"ApArtId":'.json_encode($r['ApArtId']).'}}';
	$a = '{"data":"';
	$b = $r['Name'];
	$c = '", "attr": {"id":"';
	$d = $r['ApArtId'];
	$e = '"}, "state":"closed", "children":["Populationen", "AP-Ziele"]}';
	if ($rows) {
    	$rows .= ",";
    }
    $rows .= $a.$b.$c.$d.$e;
}*/

$rows = "[";
while($r = mysql_fetch_assoc($result)) {
	$attr = array("id" => $r['ApArtId']);
	$children = array(0 => "Populationen", 1 => "AP-Ziele");
	$row = array("data" => $r['Name'], "attr" => $attr, "state" => "closed", "children" => $children);
	if ($rows != "[") {
    	$rows .= ",";
    }
    $rows .= json_encode($row);
}
$rows .= "]";

//echo $rows;
print($rows);
//print($result);
//print json_encode($rows);
//print json_encode($result);

// Resultset freigeben
mysql_free_result($result);

// Verbindung schliessen
mysql_close($link);
?>