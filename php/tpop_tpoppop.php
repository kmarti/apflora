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

$pop_id = $_GET["pop_id"];
settype($pop_id, "integer");
$tpop_id = $_GET["tpop_id"];
settype($tpop_id, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT TPopId FROM tblTeilpopulation WHERE TPopPop='1' AND PopId=".$pop_id." AND TPopId<>".$tpop_id);
while($r = mysqli_fetch_assoc($result)) {
	// bestehende TPopPop ausschalten
	$result2 = mysqli_query($link, 'UPDATE tblTeilpopulation SET TPopPop=0, MutWann="'.$time.'", MutWer="'.$user.'" WHERE TPopId='.$r['TPopId']);
}

// Resultset freigeben
mysqli_free_result($result);
mysqli_free_result($result2);

// Verbindung schliessen
mysqli_close($link);
?>