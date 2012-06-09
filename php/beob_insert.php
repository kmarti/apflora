<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

$id = $_GET["id"];
settype($id, "integer");
$tpop_id = $_GET["tpop_id"]
settype($tpop_id, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

$beob_result = mysqli_query($link, 'SELECT NO_NOTE, Name, StatusText, NO_NOTE AS IdZdsf, ISFS AS NR, PROJET AS Projekt, NOM_COMMUNE AS RaumGde, DESC_LOCALITE AS Ort, xGIS AS X, yGIS AS Y, IF(M_NOTE>0, IF(M_NOTE>9, CONCAT(J_NOTE, ".", M_NOTE, ".", A_NOTE), CONCAT(J_NOTE, ".0", M_NOTE, ".", A_NOTE)), A_NOTE) AS Datum, A_NOTE AS Jahr, CONCAT(NOM_PERSONNE_OBS, " ", PRENOM_PERSONNE_OBS) AS Autor, "Info Flora" AS Herkunft FROM (ArtenDb_tblFloraSisf INNER JOIN BeobachtungenZdsf_ZdsfBeob ON ArtenDb_tblFloraSisf.NR = BeobachtungenZdsf_ZdsfBeob.ISFS) LEFT JOIN DomainFloraStatus ON Status = StatusWert WHERE NO_NOTE='.$id);
$beob_row = mysqli_fetch_assoc($beob_result);

$Querystring = 'INSERT INTO tblBeobachtung (TPopId, IdZdsf, NR, Projekt, RaumGde, Ort, xGIS, yGIS, Datum, Jahr, Autor, Herkunft, MutWann, MutWer) VALUES ('.$tpop_id.', "'.$beob_row["IdZdsf"].', "'.$beob_row["ISFS"].', "'.$beob_row["Projekt"].', "'.$beob_row["RaumGde"].', "'.$beob_row["Ort"].', "'.$beob_row["xGIS"].', "'.$beob_row["yGIS"].', "'.$beob_row["Datum"].', "'.$beob_row["Jahr"].', "'.$beob_row["Autor"].', "'.$beob_row["Herkunft"].'", "'.$time.'", "'.$user.'")';	//muss die neue PopId erhalten!

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

/*if (!$result) {
	print "Fehler: Es wurde kein neues Programm gespeichert";
} else {*/
print mysqli_insert_id($link);
//}

// Verbindung schliessen
mysqli_close($link);
?>