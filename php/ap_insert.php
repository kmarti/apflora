<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link2 = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'INSERT INTO tblAktionsplan (ApArtId, MutWann, MutWer) VALUES ('.$id.', "'.$time.'", "'.$user.'")';
$result = mysqli_query($link, $Querystring);

$Querystring2 = 'SELECT Artwert FROM alexande_beob.ArtenDb_Arteigenschaften WHERE TaxonomieId='.$id;
$result2 = mysqli_query($link, $Querystring2);
$row = mysqli_fetch_assoc($result2);
$Artwert = $row["AwArtwert"];

$Querystring3 = 'UPDATE tblAktionsplan SET ApArtwert="'.$Artwert.'" WHERE ApArtId = '.$id;
$result3 = mysqli_query($link, $Querystring3);


if (!$result) {
	print "Fehler: Es wurde kein neues Programm gespeichert";
}

// Verbindung schliessen
mysqli_close($link);
mysqli_close($link2);
?>