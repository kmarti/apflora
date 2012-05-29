<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

$ApArtId = $_GET["id"];
settype($id, "integer");

$child_dummy = array(0 => "dummy");
	
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
		//Massn dieser TPop abfragen
		$query_tpopmassn = "SELECT tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopId, tblTeilPopMassnahme.TPopMassnJahr, tblTeilPopMassnahme.TPopMassnDatum, DomainTPopMassnTyp.MassnTypTxt FROM tblTeilPopMassnahme INNER JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode where TPopId = $TPopId ORDER BY tblTeilPopMassnahme.TPopMassnJahr, tblTeilPopMassnahme.TPopMassnDatum, DomainTPopMassnTyp.MassnTypTxt";
		$result_tpopmassn = mysql_query($query_tpopmassn) or die("Anfrage fehlgeschlagen: " . mysql_error());
		$anz_tpopmassn = mysql_num_rows($result_tpopmassn);
		//Datenstruktur für tpopmassn aufbauen
		$rows_tpopmassn = array();
		while($r_tpopmassn = mysql_fetch_assoc($result_tpopmassn)) {
			$TPopMassnId = $r_tpopmassn['TPopMassnId'];
			settype($TPopMassnId, "integer");
			$TPopMassnJahr =  $r_tpopmassn['TPopMassnJahr'];
			settype($TPopMassnJahr, "integer");
			$MassnTypTxt = utf8_encode($r_tpop['MassnTypTxt']);
			//TPopMassn setzen
			$attr_tpopmassn = array("id" => $TPopMassnId, "typ" => "tpopmassn");
			$tpopmassn = array("data" => $TPopMassnJahr." ".$MassnTypTxt, "attr" => $attr_tpopmassn);
			//tpopmassn-Array um tpopmassn ergänzen
		    $rows_tpopmassn[] = $tpopmassn;
		}
		mysql_free_result($result_tpopmassn);
		
		//MassnBer dieser TPop abfragen
		$query_tpopmassnber = "SELECT tblTeilPopMassnBericht.TPopMassnBerId, tblTeilPopMassnBericht.TPopId, tblTeilPopMassnBericht.TPopMassnBerJahr, DomainTPopMassnErfolgsbeurteilung.BeurteilTxt FROM tblTeilPopMassnBericht INNER JOIN DomainTPopMassnErfolgsbeurteilung ON tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung = DomainTPopMassnErfolgsbeurteilung.BeurteilId where TPopId = $TPopId  ORDER BY tblTeilPopMassnBericht.TPopMassnBerJahr, DomainTPopMassnErfolgsbeurteilung.BeurteilTxt";
		$result_tpopmassnber = mysql_query($query_tpopmassnber) or die("Anfrage fehlgeschlagen: " . mysql_error());
		$anz_tpopmassnber = mysql_num_rows($result_tpopmassnber);
		//Datenstruktur für tpopmassnber aufbauen
		$rows_tpopmassnber = array();
		while($r_tpopmassnber = mysql_fetch_assoc($result_tpopmassnber)) {
			$TPopMassnBerId = $r_tpopmassnber['TPopMassnBerId'];
			settype($TPopMassnBerId, "integer");
			$TPopMassnBerJahr =  $r_tpopmassnber['TPopMassnBerJahr'];
			settype($TPopMassnBerJahr, "integer");
			$BeurteilTxt = utf8_encode($r_tpop['BeurteilTxt']);
			//TPopMassn setzen
			$attr_tpopmassnber = array("id" => $TPopMassnBerId, "typ" => "tpopmassnber");
			$tpopmassnber = array("data" => $TPopMassnBerJahr." ".$BeurteilTxt, "attr" => $attr_tpopmassnber);
			//tpopmassnber-Array um tpopmassnber ergänzen
		    $rows_tpopmassnber[] = $tpopmassnber;
		}
		mysql_free_result($result_tpopmassnber);

		//TPop-Ordner setzen
		//Massnahmen
		$tpop_ordner_massn_attr = array("id" => $TPopId, "typ" => "tpop_ordner_massn");
		$tpop_ordner_massn = array("data" => $anz_tpopmassn." Massnahmen", "attr" => $tpop_ordner_massn_attr, "children" => $rows_tpopmassn);
		//Massnahmen-Berichte
		$tpop_ordner_massnber_attr = array("id" => $TPopId, "typ" => "tpop_ordner_massnber");
		$tpop_ordner_massnber = array("data" => $anz_tpopmassnber." Massnahmen-Berichte", "attr" => $tpop_ordner_massnber_attr, "children" => $rows_tpopmassnber);
		//Feldkontrollen
		$tpop_ordner_feldkontr_attr = array("id" => $TPopId, "typ" => "tpop_ordner_feldkontr");
		$tpop_ordner_feldkontr = array("data" => "Feldkontrollen", "attr" => $tpop_ordner_feldkontr_attr, "children" => $child_dummy);
		//Freiwilligen-Kontrollen
		$tpop_ordner_freiwkontr_attr = array("id" => $TPopId, "typ" => "tpop_ordner_freiwkontr");
		$tpop_ordner_freiwkontr = array("data" => "Freiwilligen-Kontrollen", "attr" => $tpop_ordner_freiwkontr_attr, "children" => $child_dummy);
		//Teilpopulations-Berichte
		$tpop_ordner_tpopber_attr = array("id" => $TPopId, "typ" => "tpop_ordner_tpopber");
		$tpop_ordner_tpopber = array("data" => "Teilpopulations-Berichte", "attr" => $tpop_ordner_tpopber_attr, "children" => $child_dummy);
		//Beobachtungen
		$tpop_ordner_beob_attr = array("id" => $TPopId, "typ" => "tpop_ordner_beob");
		$tpop_ordner_beob = array("data" => "Beobachtungen", "attr" => $tpop_ordner_beob_attr, "children" => $child_dummy);
		//zusammensetzen
		$tpop_ordner = array(0 => $tpop_ordner_massn, 1 => $tpop_ordner_massnber, 2 => $tpop_ordner_feldkontr, 3 => $tpop_ordner_freiwkontr, 4 => $tpop_ordner_tpopber, 5 => $tpop_ordner_beob);

		//TPop setzen
		$attr_tpop = array("id" => $TPopId, "typ" => "tpop");
		$tpop = array("data" => utf8_encode($r_tpop['TPopFlurname']), "attr" => $attr_tpop, "children" => $tpop_ordner);
		//tpop-Array um tpop ergänzen
	    $rows_tpop[] = $tpop;
	}
	mysql_free_result($result_tpop);
	
	//pop-ordner setzen
	//Teilpopulationen
	$pop_ordner_tpop_attr = array("id" => $PopId, "typ" => "pop_ordner_tpop");
	$pop_ordner_tpop = array("data" => $anz_tpop." Teilpopulationen", "attr" => $pop_ordner_tpop_attr, "children" => $rows_tpop);
	//Populations-Berichte
	$pop_ordner_popber_attr = array("id" => $PopId, "typ" => "pop_ordner_popber");
	$pop_ordner_popber = array("data" => "Populations-Berichte", "attr" => $pop_ordner_popber_attr, "children" => $child_dummy);
	//Massnahmen-Berichte
	$pop_ordner_massnber_attr = array("id" => $PopId, "typ" => "pop_ordner_massnber");
	$pop_ordner_massnber = array("data" => "Massnahmen-Berichte", "attr" => $pop_ordner_massnber_attr, "children" => $child_dummy);
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

//AP-Ziele
//Jahre
$query_apzielejahr = "SELECT ZielJahr FROM tblZiel where ApArtId = $ApArtId GROUP BY ZielJahr";
$result_apzielejahr = mysql_query($query_apzielejahr) or die("Anfrage fehlgeschlagen: " . mysql_error());
$anz_apzielejahr = 0;
//Datenstruktur apzielejahr aufbauen
$rows_apzielejahr = array();
while($r_apzielejahr = mysql_fetch_assoc($result_apzielejahr)) {
	$apzielejahr_jahr = $r_apzielejahr['ZielJahr'];
	settype($apzielejahr_jahr, "integer");

	//Typen
	$query_apziele = "SELECT ZielId, ZielTyp, ZielBezeichnung FROM tblZiel WHERE (ApArtId = $ApArtId) AND (ZielJahr = ".$r_apzielejahr['ZielJahr'].") ORDER BY ZielTyp, ZielBezeichnung";
	$result_apziele = mysql_query($query_apziele) or die("Anfrage fehlgeschlagen: " . mysql_error());
	$anz_apziele = mysql_num_rows($result_apziele);
	$anz_apzielejahr = $anz_apzielejahr + $anz_apziele;
	//Datenstruktur apzielejahr aufbauen
	$rows_apziele = array();
	while($r_apziele = mysql_fetch_assoc($result_apziele)) {
		//TPop setzen
		$ZielBezeichnung = utf8_encode($r_apziele['ZielBezeichnung']);
		$ZielTyp = utf8_encode($r_apziele['ZielTyp']);
		$attr_apziele = array("id" => $r_apziele['ZielId'], "typ" => "apziele");
		$children_apziele = array(0 => "dummy");
		$apziele = array("data" => $ZielBezeichnung, "attr" => $attr_apziele, "children" => $children_apziele);
		//Array um apziele ergänzen
	    $rows_apziele[] = $apziele;
	}
	mysql_free_result($result_apziele);

	//apzielejahr setzen
	$attr_apzielejahr = array("id" => $apzielejahr_jahr, "typ" => "apzielejahr");
	$data_apzielejahr = $apzielejahr_jahr.": ".$anz_apziele;
	$apzielejahr = array("data" => $data_apzielejahr, "attr" => $attr_apzielejahr, "children" => $rows_apziele);
	//tpop-Array um tpop ergänzen
    $rows_apzielejahr[] = $apzielejahr;
}
mysql_free_result($result_apzielejahr);
	

//AP-Ordner setzen
//Populationen
$ap_ordner_pop_attr = array("id" => $ApArtId, "typ" => "ap_ordner_pop");
$ap_ordner_pop = array("data" => $anz_pop." Populationen", "attr" => $ap_ordner_pop_attr, "children" => $rows_pop);
//AP-Ziele
$ap_ordner_apziele_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apziele");
$ap_ordner_apziele = array("data" => $anz_apzielejahr." AP-Ziele", "attr" => $ap_ordner_apziele_attr, "children" => $rows_apzielejahr);
//Erfolgskriterien
$ap_ordner_erfkrit_attr = array("id" => $ApArtId, "typ" => "ap_ordner_erfkrit");
$ap_ordner_erfkrit = array("data" => "Erfolgskriterien", "attr" => $ap_ordner_erfkrit_attr, "children" => $child_dummy);
//AP-Berichte
$ap_ordner_apber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apber");
$ap_ordner_apber = array("data" => "AP-Berichte", "attr" => $ap_ordner_apber_attr, "children" => $child_dummy);
//Berichte
$ap_ordner_ber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_ber");
$ap_ordner_ber = array("data" => "Berichte", "attr" => $ap_ordner_ber_attr, "children" => $child_dummy);
//zusammensetzen
$ap_ordner = array(0 => $ap_ordner_pop, 1 => $ap_ordner_apziele, 2 => $ap_ordner_erfkrit, 3 => $ap_ordner_apber, 4 => $ap_ordner_ber);

	
//in json verwandeln
$rows = json_encode($ap_ordner);

print($rows);

// Verbindung schliessen
if ($link) {
	mysql_close($link);
}
?>