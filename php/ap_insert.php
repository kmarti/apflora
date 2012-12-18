<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");

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

$Querystring2 = 'SELECT AwArtwert FROM ArtenDb_tblFloraFnsArtwert WHERE SisfNr='.$id;
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
?>