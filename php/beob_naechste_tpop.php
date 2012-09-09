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

$X = $_GET["X"];
settype($X, "integer");
$Y = $_GET["Y"];
settype($Y, "integer");
$ApArtId = $_GET["ApArtId"];
settype($ApArtId, "integer");

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT TPopId, TPopFlurname, SQRT(('.$X.'-TPopXKoord)*('.$X.'-TPopXKoord)+('.$Y.'-TPopYKoord)*('.$Y.'-TPopYKoord)) AS DistZuTPop FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId WHERE ApArtId = '.$ApArtId.' AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL ORDER BY DistzuTPop LIMIT 1');

//benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}

//$row = mysqli_fetch_assoc($result)

//in json verwandeln
$return = json_encode($rows);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>