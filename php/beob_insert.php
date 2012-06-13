<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");
$tpop_id = $_GET["tpop_id"];
$dist_zu_tpop = $_GET['dist_zu_tpop'];
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

$beob_result = mysqli_query($link, 'SELECT NO_NOTE, Name, StatusText, NO_NOTE AS IdZdsf, NO_ISFS AS NR, PROJET AS Projekt, NOM_COMMUNE AS RaumGde, DESC_LOCALITE AS Ort, xGIS AS X, yGIS AS Y, IF(M_NOTE>0, IF(M_NOTE>9, CONCAT(J_NOTE, ".", M_NOTE, ".", A_NOTE), CONCAT(J_NOTE, ".0", M_NOTE, ".", A_NOTE)), A_NOTE) AS Datum, A_NOTE AS Jahr, CONCAT(NOM_PERSONNE_OBS, " ", PRENOM_PERSONNE_OBS) AS Autor, "Info Flora" AS Herkunft FROM (ArtenDb_tblFloraSisf INNER JOIN beob ON ArtenDb_tblFloraSisf.NR = beob.NO_ISFS) LEFT JOIN DomainFloraStatus ON Status = StatusWert WHERE NO_NOTE='.$id);
$beob_row = mysqli_fetch_assoc($beob_result);

$IdZdsf = $beob_row['IdZdsf'];
$NR = $beob_row['NR'];
$Projekt = $beob_row['Projekt'];
$RaumGde = $beob_row['RaumGde'];
$Ort = $beob_row['Ort'];
$X = $beob_row['X'];
$Y = $beob_row['Y'];
$Datum = $beob_row['Datum'];
$Jahr = $beob_row['Jahr'];
$Autor = $beob_row['Autor'];
$Herkunft = $beob_row['Herkunft'];

$Querystring = 'INSERT INTO tblBeobachtungen (TPopId, IdZdsf, NR, Projekt, RaumGde, Ort, X, Y, Datum, Jahr, Autor, Herkunft, DistZurTPop, MutWann, MutWer) VALUES ("'.$tpop_id.'", "'.$IdZdsf.'", "'.$NR.'", "'.$Projekt.'", "'.$RaumGde.'", "'.$Ort.'", "'.$X.'", "'.$Y.'", "'.$Datum.'", "'.$Jahr.'", "'.$Autor.'", "'.$Herkunft.'", "'.$dist_zu_tpop.'", "'.$time.'", "'.$user.'")';

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>