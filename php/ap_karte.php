<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");
$link2 = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];
settype($id, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, "SELECT alexande_apflora.tblAktionsplan.ApArtId, alexande_beob.ArtenDb_Arteigenschaften.Artname, alexande_apflora.DomainApUmsetzung.DomainTxt AS ApUmsetzung, alexande_apflora.tblPopulation.PopId, alexande_apflora.tblPopulation.PopNr, alexande_apflora.tblPopulation.PopName, alexande_apflora.DomainPopHerkunft.HerkunftTxt AS PopHerkunft, alexande_apflora.tblPopulation.PopBekanntSeit, alexande_apflora.tblTeilpopulation.TPopId, alexande_apflora.tblTeilpopulation.TPopFlurname, alexande_apflora.tblTeilpopulation.TPopNr, alexande_apflora.tblTeilpopulation.TPopGemeinde, alexande_apflora.tblTeilpopulation.TPopXKoord, alexande_apflora.tblTeilpopulation.TPopYKoord, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft FROM (((((alexande_apflora.tblAktionsplan INNER JOIN alexande_apflora.tblPopulation ON alexande_apflora.tblAktionsplan.ApArtId = alexande_apflora.tblPopulation.ApArtId) INNER JOIN alexande_apflora.tblTeilpopulation ON alexande_apflora.tblPopulation.PopId = alexande_apflora.tblTeilpopulation.PopId) INNER JOIN alexande_beob.ArtenDb_Arteigenschaften ON alexande_apflora.tblAktionsplan.ApArtId = alexande_beob.ArtenDb_Arteigenschaften.TaxonomieId) LEFT JOIN alexande_apflora.DomainPopHerkunft ON alexande_apflora.tblPopulation.PopHerkunft = alexande_apflora.DomainPopHerkunft.HerkunftId) LEFT JOIN alexande_apflora.DomainApUmsetzung ON alexande_apflora.tblAktionsplan.ApUmsetzung = alexande_apflora.DomainApUmsetzung.DomainCode) LEFT JOIN alexande_apflora.DomainPopHerkunft AS DomainPopHerkunft_1 ON alexande_apflora.tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId WHERE alexande_apflora.tblTeilpopulation.TPopXKoord Is Not Null AND alexande_apflora.tblTeilpopulation.TPopYKoord Is Not Null AND alexande_apflora.tblAktionsplan.ApArtId = ".$id);

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
mysqli_close($link2);
?>