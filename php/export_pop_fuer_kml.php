<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$view = 'vPopFuerKml'; // view you want to export
$file = 'ApFloraPopulationen'; // csv name.
 
$values = mysqli_query($link, "SELECT * FROM ".$view."");
 
$Zeilen = "";
//In den Daten sind Zeichen, die Google Earth nicht erträgt
//sie müssen entfernt werden
$Ersetzungen = array("&");
$Art = "";
while ($r = mysqli_fetch_assoc($values)) {
	$r['Label'] = str_replace($Ersetzungen, ' ', $r['Label']);
	$r['Inhalte'] = str_replace($Ersetzungen, ' ', $r['Inhalte']);
	$Zeile = "";
	if ($Art === "") {
		$Zeile .= "\t<Folder>\n";
		$Zeile .= "\t\t<name>";
		$Zeile .= $r['Art'];
		$Zeile .= "</name>\n";
	} else if ($Art != $r['Art']) {
		$Zeile .= "\t</Folder>\n\t<Folder>\n";
		$Zeile .= "\t\t<name>";
		$Zeile .= $r['Art'];;
		$Zeile .= "</name>\n";
	}
	$Zeile .= "\t\t<Placemark><name>";
	$Zeile .= $r['Label'];
	$Zeile .= "</name>";
	$Zeile .= "<description><![CDATA[";
	$Zeile .= $r['Inhalte'];
	$Zeile .= "<br><a href='";
	$Zeile .= $r['URL'];
	$Zeile .= "'>Formular öffnen</a>";
	$Zeile .= "]]></description>";
	$Zeile .= "<styleUrl>#default+nicon=http://maps.google.com/mapfiles/kml/pal3/icon63.png+hicon=http://maps.google.com/mapfiles/kml/pal3/icon55.png</styleUrl>";
	$Zeile .= "<Point><coordinates>";
	$Zeile .= $r['Laengengrad'];
	$Zeile .= ",";
	$Zeile .= $r['Breitengrad'];
	$Zeile .= ",0</coordinates></Point>";
	$Zeile .= "</Placemark>";
	$Art = $r['Art'];
	$Zeilen .= $Zeile."\n";
}
$Zeilen .= "\t</Folder>\n";
 
$filename = $file."_".date("Y-m-d_H-i-s",time());
$Kopf = "<?xml version='1.0' encoding='UTF-8'?><kml xmlns='http://earth.google.com/kml/2.1'>\n<Document>\n<name>".$filename."</name>\n";
$Fuss = "</Document>\n</kml>";
$Output = $Kopf;
$Output .= $Zeilen;
$Output .= $Fuss;

header('Content-Type: application/vnd.google-earth.kml+xml kml; charset=utf-8');
header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('Content-Disposition: attachment; filename='.$filename.'.kml');
header('Pragma: no-cache');

print($Output);

// Resultset freigeben
mysqli_free_result($values);

// Verbindung schliessen
mysqli_close($link);
?>