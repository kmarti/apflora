<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link_beob = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}
if ($link_beob->connect_errno) {
    printf("Connect failed: %s\n", $link_beob->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");
mysqli_set_charset($link_beob, "utf8");

$ApArtId = $_GET["id"];
settype($id, "integer");

$child_dummy = array(0 => "dummy");
	
//pop dieses AP abfragen
$result_pop = mysqli_query($link, "SELECT PopNr, PopName, PopId, ApArtId FROM tblPopulation where ApArtId = $ApArtId ORDER BY PopNr, PopName");
$PopNr_max0 = mysqli_query($link, "SELECT MAX(PopNr) as PopNr_max FROM tblPopulation where ApArtId = $ApArtId");
$PopNr_max = strval($r_pop['PopNr_max']);
$anz_pop = mysqli_num_rows($result_pop);
//Datenstruktur für pop aufbauen
$rows_pop = array();
while($r_pop = mysqli_fetch_assoc($result_pop)) {
	$PopId = $r_pop['PopId'];
	settype($PopId, "integer");
	
	//PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
	//Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden   FUNKTIONIERT NICHT!!!!
	$PopNr_number = strval($r_pop['PopNr']);
	$Stellendifferenz = strlen($PopNr_max) - strlen($PopNr_number);
	$PopNr = strval($PopNr_number);
	switch ($Stellendifferenz) {
		case 0:
			//belassen
			break;
		case 1:
			$PopNr = "0".$PopNr;
			break;
		case 2:
			$PopNr = "00".$PopNr;
			break;
		case 3:
			$PopNr = "000".$PopNr;
			break;
		case 4:
			$PopNr = "0000".$PopNr;
			break;
		case 5:
			$PopNr = "00000".$PopNr;
			break;
	}
	
	//TPop dieser Pop abfragen
	$result_tpop = mysqli_query($link, "SELECT TPopNr, TPopFlurname, TPopId, PopId FROM tblTeilpopulation where PopId = $PopId ORDER BY TPopNr, TPopFlurname");
	$anz_tpop = mysqli_num_rows($result_tpop);
	//Datenstruktur für tpop aufbauen
	$rows_tpop = array();
	while($r_tpop = mysqli_fetch_assoc($result_tpop)) {
		$TPopId = $r_tpop['TPopId'];
		settype($TPopId, "integer");
		//Massn dieser TPop abfragen
		$result_tpopmassn = mysqli_query($link, "SELECT TPopMassnId, TPopId, TPopMassnJahr, TPopMassnDatum, MassnTypTxt FROM tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON TPopMassnTyp = MassnTypCode where TPopId = $TPopId ORDER BY TPopMassnJahr, TPopMassnDatum, MassnTypTxt");
		$anz_tpopmassn = mysqli_num_rows($result_tpopmassn);
		//Datenstruktur für tpopmassn aufbauen
		$rows_tpopmassn = array();
		while($r_tpopmassn = mysqli_fetch_assoc($result_tpopmassn)) {
			$TPopMassnId = $r_tpopmassn['TPopMassnId'];
			settype($TPopMassnId, "integer");
			//TPopMassnJahr soll immer existieren
			if ($r_tpopmassn['TPopMassnJahr']) {
				$TPopMassnJahr = $r_tpopmassn['TPopMassnJahr'];
				settype($TPopMassnJahr, "integer");
			} else {
				$TPopMassnJahr = "(kein Jahr)";
			}
			//MassnTypTxt soll immer existieren
			if ($r_tpopmassn['MassnTypTxt']) {
				$MassnTypTxt = $r_tpopmassn['MassnTypTxt'];
			} else {
				$MassnTypTxt = "(kein Typ)";
			}
			//TPopMassn setzen
			$attr_tpopmassn = array("id" => $TPopMassnId, "typ" => "tpopmassn");
			$tpopmassn = array("data" => $TPopMassnJahr.": ".$MassnTypTxt, "attr" => $attr_tpopmassn);
			//tpopmassn-Array um tpopmassn ergänzen
		    $rows_tpopmassn[] = $tpopmassn;
		}
		mysqli_free_result($result_tpopmassn);

		//MassnBer dieser TPop abfragen
		$result_tpopmassnber = mysqli_query($link, "SELECT TPopMassnBerId, TPopId, TPopMassnBerJahr, BeurteilTxt FROM tblTeilPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON TPopMassnBerErfolgsbeurteilung = BeurteilId where TPopId = $TPopId ORDER BY TPopMassnBerJahr, BeurteilTxt");
		$anz_tpopmassnber = mysqli_num_rows($result_tpopmassnber);
		//Datenstruktur für tpopmassnber aufbauen
		$rows_tpopmassnber = array();
		while($r_tpopmassnber = mysqli_fetch_assoc($result_tpopmassnber)) {
			$TPopMassnBerId = $r_tpopmassnber['TPopMassnBerId'];
			settype($TPopMassnBerId, "integer");
			//TPopMassnBerJahr soll immer existieren
			if ($r_tpopmassnber['TPopMassnBerJahr']) {
				$TPopMassnBerJahr =  $r_tpopmassnber['TPopMassnBerJahr'];
				settype($TPopMassnBerJahr, "integer");
			} else {
				$TPopMassnBerJahr = "(kein Jahr)";
			}
			//BeurteilTxt soll immer existieren
			if ($r_tpopmassnber['BeurteilTxt']) {
				$BeurteilTxt = $r_tpopmassnber['BeurteilTxt'];
			} else {
				$BeurteilTxt = "(keine Beurteilung)";
			}
			//TPopMassn setzen
			$attr_tpopmassnber = array("id" => $TPopMassnBerId, "typ" => "tpopmassnber");
			$tpopmassnber = array("data" => $TPopMassnBerJahr.": ".$BeurteilTxt, "attr" => $attr_tpopmassnber);
			//tpopmassnber-Array um tpopmassnber ergänzen
		    $rows_tpopmassnber[] = $tpopmassnber;
		}
		mysqli_free_result($result_tpopmassnber);

		//Feldkontrollen dieser TPop abfragen
		$result_tpopfeldkontr = mysqli_query($link, "SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId = $TPopId) AND (TPopKontrTyp<>\"Freiwilligen-Erfolgskontrolle\" OR TPopKontrTyp IS NULL) ORDER BY TPopKontrJahr, TPopKontrTyp");
		$anz_tpopfeldkontr = mysqli_num_rows($result_tpopfeldkontr);
		//Datenstruktur für tpopfeldkontr aufbauen
		$rows_tpopfeldkontr = array();
		while($r_tpopfeldkontr = mysqli_fetch_assoc($result_tpopfeldkontr)) {
			$TPopKontrId = $r_tpopfeldkontr['TPopKontrId'];
			settype($TPopKontrId, "integer");
			//TPopKontrJahr soll immer existieren
			if ($r_tpopfeldkontr['TPopKontrJahr']) {
				$TPopKontrJahr = $r_tpopfeldkontr['TPopKontrJahr'];
				settype($TPopKontrJahr, "integer");
			} else {
				$TPopKontrJahr = "(kein Jahr)";
			}
			//TPopKontrTyp soll immer existieren
			if ($r_tpopfeldkontr['TPopKontrTyp']) {
				$TPopKontrTyp = $r_tpopfeldkontr['TPopKontrTyp'];
			} else {
				$TPopKontrTyp = "(kein Typ)";
			}
			//TPopFeldKontr setzen
			$attr_tpopfeldkontr = array("id" => $TPopKontrId, "typ" => "tpopfeldkontr");
			$tpopfeldkontr = array("data" => $TPopKontrJahr.": ".$TPopKontrTyp, "attr" => $attr_tpopfeldkontr);
			//tpopfeldkontr-Array um tpopfeldkontr ergänzen
		    $rows_tpopfeldkontr[] = $tpopfeldkontr;
		}
		mysqli_free_result($result_tpopfeldkontr);

		//Freiwilligen-kontrollen dieser TPop abfragen
		$result_tpopfreiwkontr = mysqli_query($link, "SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId = $TPopId) AND (TPopKontrTyp=\"Freiwilligen-Erfolgskontrolle\") ORDER BY TPopKontrJahr, TPopKontrTyp");
		$anz_tpopfreiwkontr = mysqli_num_rows($result_tpopfreiwkontr);
		//Datenstruktur für tpopfreiwkontr aufbauen
		$rows_tpopfreiwkontr = array();
		while($r_tpopfreiwkontr = mysqli_fetch_assoc($result_tpopfreiwkontr)) {
			$TPopKontrId = $r_tpopfreiwkontr['TPopKontrId'];
			settype($TPopKontrId, "integer");
			if ($r_tpopfreiwkontr['TPopKontrJahr'] > 0) {
				$TPopKontrJahr =  $r_tpopfreiwkontr['TPopKontrJahr'];
			} else {
				$TPopKontrJahr =  "(kein Jahr)";
			}
			//settype($TPopKontrJahr, "integer");
			$TPopKontrTyp = $r_tpopfreiwkontr['TPopKontrTyp'];
			//TPopFeldKontr setzen
			$attr_tpopfreiwkontr = array("id" => $TPopKontrId, "typ" => "tpopfreiwkontr");
			$tpopfreiwkontr = array("data" => $TPopKontrJahr, "attr" => $attr_tpopfreiwkontr);
			//tpopfreiwkontr-Array um tpopfreiwkontr ergänzen
		    $rows_tpopfreiwkontr[] = $tpopfreiwkontr;
		}
		mysqli_free_result($result_tpopfreiwkontr);

		//TPop-Berichte dieser TPop abfragen
		$result_tpopber = mysqli_query($link, "SELECT TPopBerId, TPopId, TPopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblTeilPopBericht LEFT JOIN DomainTPopEntwicklung ON TPopBerEntwicklung = EntwicklungCode where TPopId = $TPopId ORDER BY TPopBerJahr, EntwicklungOrd");
		$anz_tpopber = mysqli_num_rows($result_tpopber);
		//Datenstruktur für tpopber aufbauen
		$rows_tpopber = array();
		while($r_tpopber = mysqli_fetch_assoc($result_tpopber)) {
			$TPopBerId = $r_tpopber['TPopBerId'];
			settype($TPopBerId, "integer");
			//TPopBerJahr soll immer existieren
			if ($r_tpopber['TPopBerJahr']) {
				$TPopBerJahr = $r_tpopber['TPopBerJahr'];
				settype($TPopBerJahr, "integer");
			} else {
				$TPopBerJahr = "(kein Jahr)";
			}
			//EntwicklungTxt soll immer existieren
			if ($r_tpopber['EntwicklungTxt']) {
				$EntwicklungTxt = $r_tpopber['EntwicklungTxt'];
			} else {
				$EntwicklungTxt = "(keine Beurteilung)";
			}
			//TPopFeldKontr setzen
			$attr_tpopber = array("id" => $TPopBerId, "typ" => "tpopber");
			$tpopber = array("data" => $TPopBerJahr.": ".$EntwicklungTxt, "attr" => $attr_tpopber);
			//tpopber-Array um tpopber ergänzen
		    $rows_tpopber[] = $tpopber;
		}
		mysqli_free_result($result_tpopber);

		//Beobachtungen dieser TPop abfragen
		$result_tpopbeob = mysqli_query($link, "SELECT BeobId, Autor, J_NOTE, M_NOTE, A_NOTE FROM alexande_beob.tblBeob WHERE TPopId = $TPopId ORDER BY A_NOTE DESC, M_NOTE DESC, J_NOTE DESC");
		$anz_tpopbeob = mysqli_num_rows($result_tpopbeob);
		//Datenstruktur für tpopbeob aufbauen
		$rows_tpopbeob = array();
		while($r_tpopbeob = mysqli_fetch_assoc($result_tpopbeob)) {
			$BeobId = $r_tpopbeob['BeobId'];
			if ($r_tpopbeob['Autor'] && $r_tpopbeob['Autor'] <> " ") {
				$Autor = $r_tpopbeob['Autor'];
			} else {
				$Autor = "(kein Autor)";
			}
			if ($r_tpopbeob['M_NOTE'] < 10) {
				$Monat = "0".$r_tpopbeob['M_NOTE'];
			} else {
				$Monat = $r_tpopbeob['M_NOTE'];
			}
			if ($r_tpopbeob['J_NOTE'] < 10) {
				$Tag = "0".$r_tpopbeob['J_NOTE'];
			} else {
				$Tag = $r_tpopbeob['J_NOTE'];
			}
			if (!$r_tpopbeob['M_NOTE']) {
				$beobDatum = $r_tpopbeob['A_NOTE'];
			} else {
				$beobDatum = $r_tpopbeob['A_NOTE'].".".$Monat.".".$Tag;
			}
			//TPopFeldKontr setzen
			$attr_tpopbeob = array("id" => $BeobId, "typ" => "tpopbeob");
			$tpopbeob = array("data" => $beobDatum.": ".$Autor, "attr" => $attr_tpopbeob);
			//tpopbeob-Array um tpopbeob ergänzen
		    $rows_tpopbeob[] = $tpopbeob;
		}
		mysqli_free_result($result_tpopbeob);

		//TPop-Ordner setzen
		//Massnahmen
		$tpop_ordner_massn_datatext = $anz_tpopmassn." Massnahmen";
		if ($anz_tpopmassn === 1) {
			$tpop_ordner_massn_datatext = $anz_tpopmassn." Massnahme";
		}
		$tpop_ordner_massn_attr = array("id" => $TPopId, "typ" => "tpop_ordner_massn");
		$tpop_ordner_massn = array("data" => $tpop_ordner_massn_datatext, "attr" => $tpop_ordner_massn_attr, "children" => $rows_tpopmassn);
		//Massnahmen-Berichte
		$tpop_ordner_massnber_datatext = $anz_tpopmassnber." Massnahmen-Berichte";
		if ($anz_tpopmassnber === 1) {
			$tpop_ordner_massnber_datatext = $anz_tpopmassnber." Massnahmen-Bericht";
		}
		$tpop_ordner_massnber_attr = array("id" => $TPopId, "typ" => "tpop_ordner_massnber");
		$tpop_ordner_massnber = array("data" => $tpop_ordner_massnber_datatext, "attr" => $tpop_ordner_massnber_attr, "children" => $rows_tpopmassnber);
		//Feldkontrollen
		$tpop_ordner_feldkontr_datatext = $anz_tpopfeldkontr." Feldkontrollen";
		if ($anz_tpopfeldkontr === 1) {
			$tpop_ordner_feldkontr_datatext = $anz_tpopfeldkontr." Feldkontrolle";
		}
		$tpop_ordner_feldkontr_attr = array("id" => $TPopId, "typ" => "tpop_ordner_feldkontr");
		$tpop_ordner_feldkontr = array("data" => $tpop_ordner_feldkontr_datatext, "attr" => $tpop_ordner_feldkontr_attr, "children" => $rows_tpopfeldkontr);
		//Freiwilligen-Kontrollen
		$tpop_ordner_freiwkontr_datatext = $anz_tpopfreiwkontr." Freiwilligen-Kontrollen";
		if ($anz_tpopfreiwkontr === 1) {
			$tpop_ordner_freiwkontr_datatext = $anz_tpopfreiwkontr." Freiwilligen-Kontrolle";
		}
		$tpop_ordner_freiwkontr_attr = array("id" => $TPopId, "typ" => "tpop_ordner_freiwkontr");
		$tpop_ordner_freiwkontr = array("data" => $tpop_ordner_freiwkontr_datatext, "attr" => $tpop_ordner_freiwkontr_attr, "children" => $rows_tpopfreiwkontr);
		//Teilpopulations-Berichte
		$tpop_ordner_tpopber_datatext = $anz_tpopber." Teilpopulations-Berichte";
		if ($anz_tpopber === 1) {
			$tpop_ordner_tpopber_datatext = $anz_tpopber." Teilpopulations-Bericht";
		}
		$tpop_ordner_tpopber_attr = array("id" => $TPopId, "typ" => "tpop_ordner_tpopber");
		$tpop_ordner_tpopber = array("data" => $tpop_ordner_tpopber_datatext, "attr" => $tpop_ordner_tpopber_attr, "children" => $rows_tpopber);
		//Beobachtungen
		$tpop_ordner_tpopbeob_datatext = $anz_tpopbeob." Beobachtungen";
		if ($anz_tpopbeob === 1) {
			$tpop_ordner_tpopbeob_datatext = $anz_tpopbeob." Beobachtung";
		}
		$tpop_ordner_tpopbeob_attr = array("id" => $TPopId, "typ" => "tpop_ordner_tpopbeob");
		$tpop_ordner_tpopbeob = array("data" => $tpop_ordner_tpopbeob_datatext, "attr" => $tpop_ordner_tpopbeob_attr, "children" => $rows_tpopbeob);
		//zusammensetzen
		$tpop_ordner = array(0 => $tpop_ordner_massn, 1 => $tpop_ordner_massnber, 2 => $tpop_ordner_feldkontr, 3 => $tpop_ordner_freiwkontr, 4 => $tpop_ordner_tpopber, 5 => $tpop_ordner_tpopbeob);

		//TPop setzen
		$attr_tpop = array("id" => $TPopId, "typ" => "tpop");
		$tpop = array("data" => $r_tpop['TPopNr'] . " " . $r_tpop['TPopFlurname'], "attr" => $attr_tpop, "children" => $tpop_ordner);
		//tpop-Array um tpop ergänzen
	    $rows_tpop[] = $tpop;
	}
	mysqli_free_result($result_tpop);

	//popber dieser Pop abfragen
	$result_popber = mysqli_query($link, "SELECT PopBerId, PopId, PopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblPopBericht INNER JOIN DomainPopEntwicklung ON PopBerEntwicklung = EntwicklungId where PopId = $PopId ORDER BY PopBerJahr, EntwicklungOrd");
	$anz_popber = mysqli_num_rows($result_popber);
	//Datenstruktur für popber aufbauen
	$rows_popber = array();
	while($r_popber = mysqli_fetch_assoc($result_popber)) {
		$PopBerId = $r_popber['PopBerId'];
		settype($PopBerId, "integer");
		$EntwicklungTxt = $r_popber['EntwicklungTxt'];
		//popber setzen
		$attr_popber = array("id" => $PopBerId, "typ" => "popber");
		$popber = array("data" => $r_popber['PopBerJahr'].": ".$EntwicklungTxt, "attr" => $attr_popber);
		//popber-Array um popber ergänzen
	    $rows_popber[] = $popber;
	}
	mysqli_free_result($result_popber);

	//massnber dieser Pop abfragen
	$result_massnber = mysqli_query($link, "SELECT PopMassnBerId, PopId, PopMassnBerJahr, BeurteilTxt, BeurteilOrd FROM tblPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON PopMassnBerErfolgsbeurteilung = BeurteilId where PopId = $PopId ORDER BY PopMassnBerJahr, BeurteilOrd");
	$anz_massnber = mysqli_num_rows($result_massnber);
	//Datenstruktur für massnber aufbauen
	$rows_massnber = array();
	while($r_massnber = mysqli_fetch_assoc($result_massnber)) {
		$PopMassnBerId = $r_massnber['PopMassnBerId'];
		settype($PopMassnBerId, "integer");
		$BeurteilTxt = $r_massnber['BeurteilTxt'];
		//massnber setzen
		$attr_massnber = array("id" => $PopMassnBerId, "typ" => "popmassnber");
		$massnber = array("data" => $r_massnber['PopMassnBerJahr'].": ".$BeurteilTxt, "attr" => $attr_massnber);
		//massnber-Array um massnber ergänzen
	    $rows_massnber[] = $massnber;
	}
	mysqli_free_result($result_massnber);
	
	//pop-ordner setzen
	//Teilpopulationen
	$pop_ordner_tpop_datatext = $anz_tpop." Teilpopulationen";
	if ($anz_tpop === 1) {
		$pop_ordner_tpop_datatext = $anz_tpop." Teilpopulation";
	}
	$pop_ordner_tpop_attr = array("id" => $PopId, "typ" => "pop_ordner_tpop");
	$pop_ordner_tpop = array("data" => $pop_ordner_tpop_datatext, "attr" => $pop_ordner_tpop_attr, "children" => $rows_tpop);
	//Populations-Berichte
	$pop_ordner_popber_datatext = $anz_popber." Populations-Berichte";
	if ($anz_popber === 1) {
		$pop_ordner_popber_datatext = $anz_popber." Populations-Bericht";
	}
	$pop_ordner_popber_attr = array("id" => $PopId, "typ" => "pop_ordner_popber");
	$pop_ordner_popber = array("data" => $pop_ordner_popber_datatext, "attr" => $pop_ordner_popber_attr, "children" => $rows_popber);
	//Massnahmen-Berichte
	$pop_ordner_massnber_datatext = $anz_massnber." Massnahmen-Berichte";
	if ($anz_massnber === 1) {
		$pop_ordner_massnber_datatext = $anz_massnber." Massnahmen-Bericht";
	}
	$pop_ordner_massnber_attr = array("id" => $PopId, "typ" => "pop_ordner_massnber");
	$pop_ordner_massnber = array("data" => $pop_ordner_massnber_datatext, "attr" => $pop_ordner_massnber_attr, "children" => $rows_massnber);
	//zusammensetzen
	$pop_ordner = array(0 => $pop_ordner_tpop, 1 => $pop_ordner_popber, 2 => $pop_ordner_massnber);

	//Pop setzen
	$attr_pop = array("id" => $PopId, "typ" => "pop");
	$children_pop = $pop_ordner;
	if ($r_pop['PopName']) {
		$data = $PopNr . " " . $r_pop['PopName'];
	} else {
		$data = "namenlos";
	}
	$pop = array("data" => $data, "attr" => $attr_pop, "children" => $children_pop);
	//pop-Array um pop ergänzen
    $rows_pop[] = $pop;
}
mysqli_free_result($result_pop);

//AP-Ziele
//Jahre
$result_apzieljahr = mysqli_query($link, "SELECT ZielJahr FROM tblZiel where ApArtId = $ApArtId GROUP BY ZielJahr");
$anz_apzieljahr = 0;
//Datenstruktur apzieljahr aufbauen
$rows_apzieljahr = array();
while($r_apzieljahr = mysqli_fetch_assoc($result_apzieljahr)) {
	$apzieljahr_jahr = $r_apzieljahr['ZielJahr'];
	settype($apzieljahr_jahr, "integer");

	//Typen
	$result_apziel = mysqli_query($link, "SELECT ZielId, ZielTyp, ZielBezeichnung FROM tblZiel WHERE (ApArtId = $ApArtId) AND (ZielJahr = '".$r_apzieljahr['ZielJahr']."') ORDER BY ZielTyp, ZielBezeichnung");
	$anz_apziel = mysqli_num_rows($result_apziel);
	$anz_apzieljahr = $anz_apzieljahr + $anz_apziel;

	//Datenstruktur apzieljahr aufbauen
	$rows_apziel = array();
	while($r_apziel = mysqli_fetch_assoc($result_apziel)) {
		$ZielId = $r_apziel['ZielId'];
		settype($ZielId, "integer");

		//zielber dieses Ziels abfragen
		$result_zielber = mysqli_query($link, "SELECT ZielBerId, ZielId, ZielBerJahr, ZielBerErreichung FROM tblZielBericht where ZielId = $ZielId ORDER BY ZielBerJahr, ZielBerErreichung");
		$anz_zielber = mysqli_num_rows($result_zielber);
		//zielber aufbauen
		$rows_zielber = array();
		while($r_zielber = mysqli_fetch_assoc($result_zielber)) {
			$ZielBerId = $r_zielber['ZielBerId'];
			settype($ZielBerId, "integer");
			//zielber setzen
			$attr_zielber = array("id" => $ZielBerId, "typ" => "zielber");
			$zielber = array("data" => $r_zielber['ZielBerJahr'].": ".$r_zielber['ZielBerErreichung'], "attr" => $attr_zielber);
			//zielber-Array um zielber ergänzen
		    $rows_zielber[] = $zielber;
		}
		mysqli_free_result($result_zielber);

		//Zielber-Ordner setzen
		$zielber_ordner_datatext = $anz_zielber." Ziel-Berichte";
		if ($anz_zielber === 1) {
			$zielber_ordner_datatext = $anz_zielber." Ziel-Bericht";
		}
		$zielber_ordner_attr = array("id" => $ZielId, "typ" => "zielber_ordner");
		$zielber_ordner = array("data" => $zielber_ordner_datatext, "attr" => $zielber_ordner_attr, "children" => $rows_zielber);
		//zusammensetzen
		$zielber_ordner = array(0 => $zielber_ordner);

		//apziel setzen
		//abfangen, wenn Ziel (noch) nicht beschrieben ist
		if ($r_apziel['ZielBezeichnung']) {
			$ZielBezeichnung = $r_apziel['ZielBezeichnung'];
		} else {
			$ZielBezeichnung = "unbeschriebenes Ziel";
		}
		$ZielTyp = $r_apziel['ZielTyp'];
		$attr_apziel = array("id" => $r_apziel['ZielId'], "typ" => "apziel");
		$apziel = array("data" => $ZielBezeichnung, "attr" => $attr_apziel, "children" => $zielber_ordner);
		//Array um apziel ergänzen
	    $rows_apziel[] = $apziel;
	}
	mysqli_free_result($result_apziel);

	//apzieljahr setzen
	$metadata = array("ApArtId" => $ApArtId);
	$attr_apzieljahr = array("id" => $ApArtId, "typ" => "apzieljahr");
	$data_apzieljahr = $apzieljahr_jahr.": ".$anz_apziel;
	$apzieljahr = array("data" => $data_apzieljahr, "attr" => $attr_apzieljahr, "metadata" => $metadata, "children" => $rows_apziel);
	//tpop-Array um tpop ergänzen
    $rows_apzieljahr[] = $apzieljahr;
}
mysqli_free_result($result_apzieljahr);

//erfkrit dieses AP abfragen
$result_erfkrit = mysqli_query($link, "SELECT ErfBeurtZielSkalaId, ApArtId, BeurteilTxt, ErfBeurtZielSkalaTxt, BeurteilOrd
FROM tblErfBeurtZielSkala LEFT JOIN DomainApBeurteilungsskala ON ErfBeurtZielSkalaErreichungsgrad = BeurteilId
where ApArtId = $ApArtId ORDER BY BeurteilOrd");
$anz_erfkrit = mysqli_num_rows($result_erfkrit);
//erfkrit aufbauen
$rows_erfkrit = array();
while($r_erfkrit = mysqli_fetch_assoc($result_erfkrit)) {
	$ErfBeurtZielSkalaId = $r_erfkrit['ErfBeurtZielSkalaId'];
	settype($ErfBeurtZielSkalaId, "integer");
	//erfkrit setzen
	$attr_erfkrit = array("id" => $ErfBeurtZielSkalaId, "typ" => "erfkrit");
	$erfkrit = array("data" => $r_erfkrit['BeurteilTxt'] . ": " . $r_erfkrit['ErfBeurtZielSkalaTxt'], "attr" => $attr_erfkrit);
	//erfkrit-Array um erfkrit ergänzen
    $rows_erfkrit[] = $erfkrit;
}
mysqli_free_result($result_erfkrit);

//apber dieses AP abfragen
$result_apber = mysqli_query($link, "SELECT ApBerId, ApArtId, ApBerJahr FROM tblApJBer where ApArtId = $ApArtId ORDER BY ApBerJahr");
$anz_apber = mysqli_num_rows($result_apber);
//apber aufbauen
$rows_apber = array();
while($r_apber = mysqli_fetch_assoc($result_apber)) {
	$ApBerId = $r_apber['ApBerId'];
	settype($ApBerId, "integer");
	//apber_uebersicht dieses Jahrs abfragen
	$result_apber_uebersicht = mysqli_query($link, "SELECT Jahr, Bemerkungen FROM tblApJBerUebersicht WHERE Jahr=".$r_apber['ApBerJahr']);
	//apber_uebersicht aufbauen
	$rows_apber_uebersicht = array();
	while($r_apber_uebersicht = mysqli_fetch_assoc($result_apber_uebersicht)) {
		$Jahr = $r_apber_uebersicht['Jahr'];
		settype($Jahr, "integer");
		//apber_uebersicht setzen
		$attr_apber_uebersicht = array("id" => $Jahr, "typ" => "apber_uebersicht");
		$apber_uebersicht = array("data" => "Übersicht zu allen Arten", "attr" => $attr_apber_uebersicht);
		//apber_uebersicht-Array um apber_uebersicht ergänzen
	    $rows_apber_uebersicht[] = $apber_uebersicht;
	}
	mysqli_free_result($result_apber_uebersicht);
	//apber setzen
	$attr_apber = array("id" => $ApBerId, "typ" => "apber");
	$apber = array("data" => $r_apber['ApBerJahr'], "attr" => $attr_apber, "children" => $rows_apber_uebersicht);
	//apber-Array um apber ergänzen
    $rows_apber[] = $apber;
}
mysqli_free_result($result_apber);

//ber dieses AP abfragen
$result_ber = mysqli_query($link, "SELECT BerId, ApArtId, BerJahr, BerTitel FROM tblApBer where ApArtId = $ApArtId ORDER BY BerJahr DESC, BerTitel");
$anz_ber = mysqli_num_rows($result_ber);
//ber aufbauen
$rows_ber = array();
while($r_ber = mysqli_fetch_assoc($result_ber)) {
	$BerId = $r_ber['BerId'];
	settype($BerId, "integer");
	//ber setzen
	$attr_ber = array("id" => $BerId, "typ" => "ber");
	$ber = array("data" => $r_ber['BerJahr'].": ".$r_ber['BerTitel'], "attr" => $attr_ber);
	//ber-Array um ber ergänzen
    $rows_ber[] = $ber;
}
mysqli_free_result($result_ber);

//beob dieses AP abfragen
$result_beob = mysqli_query($link_beob, "SELECT BeobId, Autor, J_NOTE, M_NOTE, A_NOTE FROM alexande_beob.tblBeob WHERE (TPopId IS NULL OR TPopId = '') AND NO_ISFS=$ApArtId ORDER BY A_NOTE DESC, M_NOTE DESC, J_NOTE DESC");
$anz_beob = mysqli_num_rows($result_beob);
//beob aufbauen
$rows_beob = array();
while($r_beob = mysqli_fetch_assoc($result_beob)) {
	$beobid = $r_beob['BeobId'];
	if ($r_beob['Autor'] && $r_beob['Autor'] <> " ") {
		$beobAutor = $r_beob['Autor'];
	} else {
		$beobAutor = "(kein Autor)";
	}
	if ($r_beob['M_NOTE'] < 10) {
		$Monat = "0".$r_beob['M_NOTE'];
	} else {
		$Monat = $r_beob['M_NOTE'];
	}
	if ($r_beob['J_NOTE'] < 10) {
		$Tag = "0".$r_beob['J_NOTE'];
	} else {
		$Tag = $r_beob['J_NOTE'];
	}
	if (!$r_beob['M_NOTE']) {
		$beobDatum = $r_beob['A_NOTE'];
	} else {
		$beobDatum = $r_beob['A_NOTE'].".".$Monat.".".$Tag;
	}
	//beob setzen
	$attr_beob = array("id" => $beobid, "typ" => "beob");
	$beob = array("data" => $beobDatum.": ".$beobAutor, "attr" => $attr_beob);
	//beob-Array um beob ergänzen
    $rows_beob[] = $beob;
}
mysqli_free_result($result_beob);

//iballg dieses AP abfragen
$result_iballg = mysqli_query($link, "SELECT IbApArtId FROM tblIbAllg where IbApArtId = $ApArtId");
$anz_iballg = mysqli_num_rows($result_iballg);

mysqli_free_result($result_iballg);

//ibb dieses AP abfragen
$result_ibb = mysqli_query($link, "SELECT IbbId, IbApArtId, IbbName, IbbVegTyp FROM tblIbBiotope where IbApArtId = $ApArtId ORDER BY IbbName, IbbVegTyp");
$anz_ibb = mysqli_num_rows($result_ibb);
//ibb aufbauen
$rows_ibb = array();
while($r_ibb = mysqli_fetch_assoc($result_ibb)) {
	$IbbId = $r_ibb['IbbId'];
	settype($IbbId, "integer");
	//ibb setzen
	$attr_ibb = array("id" => $IbbId, "typ" => "ibb");
	$ibb = array("data" => $r_ibb['IbbName'], "attr" => $attr_ibb);
	//ibb-Array um ibb ergänzen
    $rows_ibb[] = $ibb;
}
mysqli_free_result($result_ibb);

//ibartenassoz dieses AP abfragen
$result_ibartenassoz = mysqli_query($link, "SELECT IbaassId, IbaassApArtId, Name FROM tblIbArtenAssoz LEFT JOIN ArtenDb_tblFloraSisf ON IbaassSisfNr = NR where IbaassApArtId = $ApArtId ORDER BY Name");
$anz_ibartenassoz = mysqli_num_rows($result_ibartenassoz);
//ibartenassoz aufbauen
$rows_ibartenassoz = array();
while($r_ibartenassoz = mysqli_fetch_assoc($result_ibartenassoz)) {
	$IbaassId = $r_ibartenassoz['IbaassId'];
	settype($IbaassId, "integer");
	if ($r_ibartenassoz['Name']) {
		$IbartenassozName = $r_ibartenassoz['Name'];
	} else {
		$IbartenassozName = "Assoziation ohne Art";
	}
	//ibartenassoz setzen
	$attr_ibartenassoz = array("id" => $IbaassId, "typ" => "ibartenassoz");
	$ibartenassoz = array("data" => $IbartenassozName, "attr" => $attr_ibartenassoz);
	//ibartenassoz-Array um ibartenassoz ergänzen
    $rows_ibartenassoz[] = $ibartenassoz;
}
mysqli_free_result($result_ibartenassoz);
	

//AP-Ordner setzen
//Populationen
$ap_ordner_pop_datatext = $anz_pop." Populationen";
if ($anz_pop === 1) {
	$ap_ordner_pop_datatext = $anz_pop." Population";
}
$ap_ordner_pop_attr = array("id" => $ApArtId, "typ" => "ap_ordner_pop");
$ap_ordner_pop = array("data" => $ap_ordner_pop_datatext, "attr" => $ap_ordner_pop_attr, "children" => $rows_pop);
//AP-Ziele
$ap_ordner_apziel_datatext = $anz_apzieljahr." AP-Ziele";
if ($anz_apzieljahr === 1) {
	$ap_ordner_apziel_datatext = $anz_apzieljahr." AP-Ziel";
}
$ap_ordner_apziel_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apziel");
$ap_ordner_apziel = array("data" => $ap_ordner_apziel_datatext, "attr" => $ap_ordner_apziel_attr, "children" => $rows_apzieljahr);
//Erfolgskriterien
$ap_ordner_erfkrit_datatext = $anz_erfkrit." Erfolgskriterien";
if ($anz_erfkrit === 1) {
	$ap_ordner_erfkrit_datatext = $anz_erfkrit." Erfolgskriterium";
}
$ap_ordner_erfkrit_attr = array("id" => $ApArtId, "typ" => "ap_ordner_erfkrit");
$ap_ordner_erfkrit = array("data" => $ap_ordner_erfkrit_datatext, "attr" => $ap_ordner_erfkrit_attr, "children" => $rows_erfkrit);
//AP-Berichte
$ap_ordner_apber_datatext = $anz_apber." AP-Berichte";
if ($anz_apber === 1) {
	$ap_ordner_apber_datatext = $anz_apber." AP-Bericht";
}
$ap_ordner_apber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apber");
$ap_ordner_apber = array("data" => $ap_ordner_apber_datatext, "attr" => $ap_ordner_apber_attr, "children" => $rows_apber);
//Berichte
$ap_ordner_ber_datatext = $anz_ber." Berichte";
if ($anz_ber === 1) {
	$ap_ordner_ber_datatext = $anz_ber." Bericht";
}
$ap_ordner_ber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_ber");
$ap_ordner_ber = array("data" => $ap_ordner_ber_datatext, "attr" => $ap_ordner_ber_attr, "children" => $rows_ber);
//Beobachtungen
$ap_ordner_beob_datatext = $anz_beob." nicht zugewiesene Beobachtungen";
if ($anz_beob === 1) {
	$ap_ordner_beob_datatext = $anz_beob." nicht zugewiesene Beobachtung";
}
$ap_ordner_beob_attr = array("id" => $ApArtId, "typ" => "ap_ordner_beob");
$ap_ordner_beob = array("data" => $ap_ordner_beob_datatext, "attr" => $ap_ordner_beob_attr, "children" => $rows_beob);
//Ideale Umweltfaktoren
$ap_ordner_iballg_attr = array("id" => $ApArtId, "typ" => "iballg");
$ap_ordner_iballg = array("data" => "ideale Umweltfaktoren", "attr" => $ap_ordner_iballg_attr);
//Ideale Biotoptypen
$ap_ordner_ibb_datatext = $anz_ibb." ideale Biotope";
if ($anz_ibb === 1) {
	$ap_ordner_ibb_datatext = $anz_ibb." ideales Biotop";
}
$ap_ordner_ibb_attr = array("id" => $ApArtId, "typ" => "ap_ordner_ibb");
$ap_ordner_ibb = array("data" => $ap_ordner_ibb_datatext, "attr" => $ap_ordner_ibb_attr, "children" => $rows_ibb);
//assoziierte Arten
$ap_ordner_ibartenassoz_datatext = $anz_ibartenassoz." assoziierte Arten";
if ($anz_ibartenassoz === 1) {
	$ap_ordner_ibartenassoz_datatext = $anz_ibartenassoz." assoziierte Art";
}
$ap_ordner_ibartenassoz_attr = array("id" => $ApArtId, "typ" => "ap_ordner_ibartenassoz");
$ap_ordner_ibartenassoz = array("data" => $ap_ordner_ibartenassoz_datatext, "attr" => $ap_ordner_ibartenassoz_attr, "children" => $rows_ibartenassoz);
//zusammensetzen
$ap_ordner = array(0 => $ap_ordner_pop, 1 => $ap_ordner_apziel, 2 => $ap_ordner_erfkrit, 3 => $ap_ordner_apber, 4 => $ap_ordner_ber, 5 => $ap_ordner_beob, 6 => $ap_ordner_iballg, 7 => $ap_ordner_ibb, 8 => $ap_ordner_ibartenassoz);

	
//in json verwandeln
$rows = json_encode($ap_ordner);

print($rows);

// Verbindung schliessen
mysqli_close($link);
mysqli_close($link_beob);
?>