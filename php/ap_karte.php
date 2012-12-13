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
$result = mysqli_query($link, "SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopId, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId WHERE tblTeilpopulation.TPopXKoord Is Not Null AND tblTeilpopulation.TPopYKoord Is Not Null AND tblAktionsplan.ApArtId = ".$id);

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}

//in json verwandeln
$rows = json_encode($rows);
$Object = "{\"rows\": $rows}";

print($Object);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>