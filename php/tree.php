<?php

$ApArtId = $_GET["id"];
settype($id, "integer");

$child_dummy = array(0 => "dummy");
	
// pop dieses AP abfragen
$result_pop = mysqli_query($link, "SELECT PopNr, PopName, PopId, ApArtId FROM tblPopulation where ApArtId = $ApArtId ORDER BY PopNr, PopName");
//$PopNr_max0 = mysqli_query($link, "SELECT MAX(PopNr) as PopNr_max FROM tblPopulation where ApArtId = $ApArtId");
$PopNr_max00 = mysqli_query($link, "SELECT `PopNr` FROM tblPopulation where ApArtId = $ApArtId ORDER BY `PopNr` DESC LIMIT 1");
//$PopNr_max = strval($r_pop['PopNr_max']);
$PopNr_max0 = mysqli_fetch_assoc($PopNr_max00);
$PopNr_max = strval($PopNr_max0['PopNr']);
$anz_pop = mysqli_num_rows($result_pop);
// Datenstruktur für pop aufbauen
$rows_pop = array();
while($r_pop = mysqli_fetch_assoc($result_pop)) {
	$PopId = $r_pop['PopId'];
	settype($PopId, "integer");
	
	// TPop dieser Pop abfragen
	$result_tpop = mysqli_query($link, "SELECT TPopNr, TPopFlurname, TPopId, PopId FROM tblTeilpopulation where PopId = $PopId ORDER BY TPopNr, TPopFlurname");
	$anz_tpop = mysqli_num_rows($result_tpop);
	// Datenstruktur für tpop aufbauen
	$rows_tpop = array();
	while($r_tpop = mysqli_fetch_assoc($result_tpop)) {
		$TPopId = $r_tpop['TPopId'];
		settype($TPopId, "integer");
		// Massn dieser TPop abfragen
		$result_tpopmassn = mysqli_query($link, "SELECT TPopMassnId, TPopId, TPopMassnJahr, TPopMassnDatum, MassnTypTxt FROM tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON TPopMassnTyp = MassnTypCode where TPopId = $TPopId ORDER BY TPopMassnJahr, TPopMassnDatum, MassnTypTxt");
		$anz_tpopmassn = mysqli_num_rows($result_tpopmassn);
		// Datenstruktur für tpopmassn aufbauen
		$rows_tpopmassn = array();
		while($r_tpopmassn = mysqli_fetch_assoc($result_tpopmassn)) {
			$TPopMassnId = $r_tpopmassn['TPopMassnId'];
			settype($TPopMassnId, "integer");
			// TPopMassnJahr soll immer existieren
			if ($r_tpopmassn['TPopMassnJahr']) {
				$TPopMassnJahr = $r_tpopmassn['TPopMassnJahr'];
				settype($TPopMassnJahr, "integer");
			} else {
				$TPopMassnJahr = "(kein Jahr)";
			}
			// MassnTypTxt soll immer existieren
			if ($r_tpopmassn['MassnTypTxt']) {
				$MassnTypTxt = $r_tpopmassn['MassnTypTxt'];
			} else {
				$MassnTypTxt = "(kein Typ)";
			}
			// TPopMassn setzen
			$attr_tpopmassn = array("id" => $TPopMassnId, "typ" => "tpopmassn");
			$tpopmassn = array("data" => $TPopMassnJahr.": ".$MassnTypTxt, "attr" => $attr_tpopmassn);
			// tpopmassn-Array um tpopmassn ergänzen
		    $rows_tpopmassn[] = $tpopmassn;
		}
		mysqli_free_result($result_tpopmassn);

		// MassnBer dieser TPop abfragen
		$result_tpopmassnber = mysqli_query($link, "SELECT TPopMassnBerId, TPopId, TPopMassnBerJahr, BeurteilTxt FROM tblTeilPopMassnBericht LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON TPopMassnBerErfolgsbeurteilung = BeurteilId where TPopId = $TPopId ORDER BY TPopMassnBerJahr, BeurteilTxt");
		$anz_tpopmassnber = mysqli_num_rows($result_tpopmassnber);
		// Datenstruktur für tpopmassnber aufbauen
		$rows_tpopmassnber = array();
		while($r_tpopmassnber = mysqli_fetch_assoc($result_tpopmassnber)) {
			$TPopMassnBerId = $r_tpopmassnber['TPopMassnBerId'];
			settype($TPopMassnBerId, "integer");
			// TPopMassnBerJahr soll immer existieren
			if ($r_tpopmassnber['TPopMassnBerJahr']) {
				$TPopMassnBerJahr =  $r_tpopmassnber['TPopMassnBerJahr'];
				settype($TPopMassnBerJahr, "integer");
			} else {
				$TPopMassnBerJahr = "(kein Jahr)";
			}
			// BeurteilTxt soll immer existieren
			if ($r_tpopmassnber['BeurteilTxt']) {
				$BeurteilTxt = $r_tpopmassnber['BeurteilTxt'];
			} else {
				$BeurteilTxt = "(keine Beurteilung)";
			}
			// TPopMassn setzen
			$attr_tpopmassnber = array("id" => $TPopMassnBerId, "typ" => "tpopmassnber");
			$tpopmassnber = array("data" => $TPopMassnBerJahr.": ".$BeurteilTxt, "attr" => $attr_tpopmassnber);
			// tpopmassnber-Array um tpopmassnber ergänzen
		    $rows_tpopmassnber[] = $tpopmassnber;
		}
		mysqli_free_result($result_tpopmassnber);

		// Feldkontrollen dieser TPop abfragen
		$result_tpopfeldkontr = mysqli_query($link, "SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId = $TPopId) AND (TPopKontrTyp<>\"Freiwilligen-Erfolgskontrolle\" OR TPopKontrTyp IS NULL) ORDER BY TPopKontrJahr, TPopKontrTyp");
		$anz_tpopfeldkontr = mysqli_num_rows($result_tpopfeldkontr);
		// Datenstruktur für tpopfeldkontr aufbauen
		$rows_tpopfeldkontr = array();
		while($r_tpopfeldkontr = mysqli_fetch_assoc($result_tpopfeldkontr)) {
			$TPopKontrId = $r_tpopfeldkontr['TPopKontrId'];
			settype($TPopKontrId, "integer");
			// TPopKontrJahr soll immer existieren
			if ($r_tpopfeldkontr['TPopKontrJahr']) {
				$TPopKontrJahr = $r_tpopfeldkontr['TPopKontrJahr'];
				settype($TPopKontrJahr, "integer");
			} else {
				$TPopKontrJahr = "(kein Jahr)";
			}
			// TPopKontrTyp soll immer existieren
			if ($r_tpopfeldkontr['TPopKontrTyp']) {
				$TPopKontrTyp = $r_tpopfeldkontr['TPopKontrTyp'];
			} else {
				$TPopKontrTyp = "(kein Typ)";
			}
			// TPopFeldKontr setzen
			$attr_tpopfeldkontr = array("id" => $TPopKontrId, "typ" => "tpopfeldkontr");
			$tpopfeldkontr = array("data" => $TPopKontrJahr.": ".$TPopKontrTyp, "attr" => $attr_tpopfeldkontr);
			// tpopfeldkontr-Array um tpopfeldkontr ergänzen
		    $rows_tpopfeldkontr[] = $tpopfeldkontr;
		}
		mysqli_free_result($result_tpopfeldkontr);

		// Freiwilligen-kontrollen dieser TPop abfragen
		$result_tpopfreiwkontr = mysqli_query($link, "SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tblTeilPopFeldkontrolle where (TPopId = $TPopId) AND (TPopKontrTyp=\"Freiwilligen-Erfolgskontrolle\") ORDER BY TPopKontrJahr, TPopKontrTyp");
		$anz_tpopfreiwkontr = mysqli_num_rows($result_tpopfreiwkontr);
		// Datenstruktur für tpopfreiwkontr aufbauen
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
			// TPopFeldKontr setzen
			$attr_tpopfreiwkontr = array("id" => $TPopKontrId, "typ" => "tpopfreiwkontr");
			$tpopfreiwkontr = array("data" => $TPopKontrJahr, "attr" => $attr_tpopfreiwkontr);
			// tpopfreiwkontr-Array um tpopfreiwkontr ergänzen
		    $rows_tpopfreiwkontr[] = $tpopfreiwkontr;
		}
		mysqli_free_result($result_tpopfreiwkontr);

		// TPop-Berichte dieser TPop abfragen
		$result_tpopber = mysqli_query($link, "SELECT TPopBerId, TPopId, TPopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tblTeilPopBericht LEFT JOIN DomainTPopEntwicklung ON TPopBerEntwicklung = EntwicklungCode where TPopId = $TPopId ORDER BY TPopBerJahr, EntwicklungOrd");
		$anz_tpopber = mysqli_num_rows($result_tpopber);
		// Datenstruktur für tpopber aufbauen
		$rows_tpopber = array();
		while($r_tpopber = mysqli_fetch_assoc($result_tpopber)) {
			$TPopBerId = $r_tpopber['TPopBerId'];
			settype($TPopBerId, "integer");
			// TPopBerJahr soll immer existieren
			if ($r_tpopber['TPopBerJahr']) {
				$TPopBerJahr = $r_tpopber['TPopBerJahr'];
				settype($TPopBerJahr, "integer");
			} else {
				$TPopBerJahr = "(kein Jahr)";
			}
			// EntwicklungTxt soll immer existieren
			if ($r_tpopber['EntwicklungTxt']) {
				$EntwicklungTxt = $r_tpopber['EntwicklungTxt'];
			} else {
				$EntwicklungTxt = "(keine Beurteilung)";
			}
			// TPopFeldKontr setzen
			$attr_tpopber = array("id" => $TPopBerId, "typ" => "tpopber");
			$tpopber = array("data" => $TPopBerJahr.": ".$EntwicklungTxt, "attr" => $attr_tpopber);
			// tpopber-Array um tpopber ergänzen
		    $rows_tpopber[] = $tpopber;
		}
		mysqli_free_result($result_tpopber);

		// Beobachtungen dieser TPop abfragen
		$result_beob_zugeordnet = mysqli_query($link, "SELECT alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, 'evab' AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE_PROJET WHERE alexande_apflora.tblBeobZuordnung.TPopId=$TPopId AND (alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=0 OR alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen IS NULL) UNION SELECT alexande_apflora.tblBeobZuordnung.NO_NOTE, alexande_apflora.tblBeobZuordnung.TPopId, alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen, alexande_apflora.tblBeobZuordnung.BeobBemerkungen, alexande_apflora.tblBeobZuordnung.BeobMutWann, alexande_apflora.tblBeobZuordnung.BeobMutWer, alexande_beob.tblBeobBereitgestellt.Datum, alexande_beob.tblBeobBereitgestellt.Autor, 'infospezies' AS beobtyp FROM alexande_apflora.tblBeobZuordnung INNER JOIN alexande_beob.tblBeobBereitgestellt ON alexande_apflora.tblBeobZuordnung.NO_NOTE = alexande_beob.tblBeobBereitgestellt.NO_NOTE WHERE alexande_apflora.tblBeobZuordnung.TPopId=$TPopId AND (alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen=0 OR alexande_apflora.tblBeobZuordnung.BeobNichtZuordnen IS NULL) ORDER BY Datum");
		$anz_beob_zugeordnet = mysqli_num_rows($result_beob_zugeordnet);
		// Datenstruktur für beob_zugeordnet aufbauen
		$rows_beob_zugeordnet = array();
		while($r_beob_zugeordnet = mysqli_fetch_assoc($result_beob_zugeordnet)) {
			// beob voransetzen, damit die ID im ganzen Baum eindeutig ist
			$BeobId = 'beob'.$r_beob_zugeordnet['NO_NOTE'];
			$beobtyp = $r_beob_zugeordnet['beobtyp'];
			if ($r_beob_zugeordnet['Autor'] && $r_beob_zugeordnet['Autor'] <> " ") {
				$Autor = $r_beob_zugeordnet['Autor'];
			} else {
				$Autor = "(kein Autor)";
			}
			if ($r_beob_zugeordnet['Datum']) {
				$datum = $r_beob_zugeordnet['Datum'];
			} else {
				$datum = "(kein Datum)";
			}
			// TPopFeldKontr setzen
			$attr_beob_zugeordnet = array("id" => $BeobId, "typ" => "beob_zugeordnet", "beobtyp" => $beobtyp);
			$beob_zugeordnet = array("data" => $datum.": ".$Autor, "attr" => $attr_beob_zugeordnet);
			// beob_zugeordnet-Array um beob_zugeordnet ergänzen
		    $rows_beob_zugeordnet[] = $beob_zugeordnet;
		}
		mysqli_free_result($result_beob_zugeordnet);