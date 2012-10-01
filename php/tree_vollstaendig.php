<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

$id = $_GET["id"];
settype($id, "integer");
$typ = $_GET["typ"] || null;

$child_dummy = array(0 => "dummy");

//ap abfragen
$query_ap = "SELECT Name, ApArtId FROM vAp1";
$result_ap = mysql_query($query_ap) or die("Anfrage fehlgeschlagen: " . mysql_error());
//benötigte Datenstruktur aufbauen
$rows = array();
while($r_ap = mysql_fetch_assoc($result_ap)) {
	$ApArtId = $r_ap['ApArtId'];
	settype($ApArtId, "integer");
	
	//pop dieses AP abfragen
	$query_pop = "SELECT PopName, PopId, ApArtId FROM tblPopulation where ApArtId = $ApArtId ORDER BY PopName";
	$result_pop = mysql_query($query_pop) or die("Anfrage fehlgeschlagen: " . mysql_error());
	$anz_pop = mysql_num_rows($result_pop);
	//Datenstruktur für pop aufbauen
	$rows_pop = array();
	while($r_pop = mysql_fetch_assoc($result_pop)) {
		$PopId = $r_pop['PopId'];
		settype($PopId, "integer");
		//TPop dieser Pop abfragen
		$query_tpop = "SELECT TPopFlurname, TPopId, PopId FROM tblTeilpopulation where PopId = $PopId ORDER BY TPopFlurname";
		$result_tpop = mysql_query($query_tpop) or die("Anfrage fehlgeschlagen: " . mysql_error());
		$anz_tpop = mysql_num_rows($result_tpop);
		//Datenstruktur für tpop aufbauen
		$rows_tpop = array();
		while($r_tpop = mysql_fetch_assoc($result_tpop)) {
			$TPopId = $r_tpop['TPopId'];
			settype($TPopId, "integer");
			//TPop setzen
			$attr_tpop = array("id" => $TPopId, "typ" => "tpop");
			$children_tpop = array(0 => "dummy");
			$tpop = array("data" => utf8_encode($r_tpop['TPopFlurname']), "attr" => $attr_tpop, "children" => $children_tpop);
			//tpop-Array um tpop ergänzen
		    $rows_tpop[] = $tpop;
		}
		mysql_free_result($result_tpop);
		
		//pop-ordner setzen
		//Teilpopulationen
		$pop_ordner_tpop_attr = array("id" => $PopId, "typ" => "ap_ordner_tpop");
		$pop_ordner_tpop = array("data" => $anz_tpop." Teilpopulationen", "attr" => $pop_ordner_tpop_attr, "children" => $rows_tpop);
		//Populations-Berichte
		$pop_ordner_popber_attr = array("id" => $PopId, "typ" => "pop_ordner_popber");
		$pop_ordner_popber = array("data" => "AP-Ziele", "attr" => $pop_ordner_popber_attr, "children" => $child_dummy);
		//Massnahmen-Berichte
		$pop_ordner_massnber_attr = array("id" => $PopId, "typ" => "pop_ordner_massnber");
		$pop_ordner_massnber = array("data" => "Erfolgskriterien", "attr" => $pop_ordner_massnber_attr, "children" => $child_dummy);
		//zusammensetzen
		$pop_ordner = array(0 => $pop_ordner_tpop, 1 => $pop_ordner_popber, 2 => $pop_ordner_massnber);

		//Pop setzen
		$attr_pop = array("id" => $PopId, "typ" => "pop");
		$children_pop = $pop_ordner;
		$pop = array("data" => utf8_encode($r_pop['PopName']), "attr" => $attr_pop, "children" => $children_pop);
		//pop-Array um pop ergänzen
	    $rows_pop[] = $pop;
	}
	mysql_free_result($result_pop);

	//AP-Ordner setzen
	//Populationen
	$ap_ordner_pop_attr = array("id" => $ApArtId, "typ" => "ap_ordner_pop");
	$ap_ordner_pop = array("data" => $anz_pop." Populationen", "attr" => $ap_ordner_pop_attr, "children" => $rows_pop);
	//AP-Ziele
	$ap_ordner_apziele_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apziele");
	$ap_ordner_apziele = array("data" => "AP-Ziele", "attr" => $ap_ordner_apziele_attr, "children" => $child_dummy);
	//Erfolgskriterien
	$ap_ordner_erfkrit_attr = array("id" => $ApArtId, "typ" => "ap_ordner_erfkrit");
	$ap_ordner_erfkrit = array("data" => "Erfolgskriterien", "attr" => $ap_ordner_erfkrit_attr, "children" => $child_dummy);
	//AP-Berichte
	$ap_ordner_jber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_jber");
	$ap_ordner_jber = array("data" => "AP-Berichte", "attr" => $ap_ordner_jber_attr, "children" => $child_dummy);
	//Berichte
	$ap_ordner_ber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_ber");
	$ap_ordner_ber = array("data" => "Berichte", "attr" => $ap_ordner_ber_attr, "children" => $child_dummy);
	//zusammensetzen
	$ap_ordner = array(0 => $ap_ordner_pop, 1 => $ap_ordner_apziele, 2 => $ap_ordner_erfkrit, 3 => $ap_ordner_jber, 4 => $ap_ordner_ber);

	//ap setzen
	$attr_ap = array("id" => $ApArtId, "typ" => "ap");
	$children_ap = $ap_ordner;
	$row_ap = array("data" => utf8_encode($r_ap['Name']), "attr" => $attr_ap, "children" => $children_ap);
	
	//AP-Array um ap ergänzen
    $rows[] = $row_ap;
}
//in json verwandeln
$rows = json_encode($rows);

mysql_free_result($result_ap);

print($rows);

// Verbindung schliessen
if ($link) {
	mysql_close($link);
}
?>