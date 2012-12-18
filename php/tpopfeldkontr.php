<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("127.0.0.1", "root", "admin", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT * FROM tblTeilPopFeldkontrolle WHERE TPopKontrId=".$id);

$row = mysqli_fetch_assoc($result);
$TPopKontrDatum = $row["TPopKontrDatum"];
//leerwerte nicht antasten - werden sonst zu 1.1.1970
if ($TPopKontrDatum) {
	$TPopKontrDatumFormatiert = date("d.m.Y", strtotime($TPopKontrDatum));
	$row["TPopKontrDatum"] = $TPopKontrDatumFormatiert;
}

//in json verwandeln
$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>