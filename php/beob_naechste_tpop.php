<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

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
$result = mysqli_query($link, 'SELECT TPopId, TPopFlurname, SQRT(('.mysqli_real_escape_string($link, $X).'-TPopXKoord)*('.mysqli_real_escape_string($link, $X).'-TPopXKoord)+('.mysqli_real_escape_string($link, $Y).'-TPopYKoord)*('.mysqli_real_escape_string($link, $Y).'-TPopYKoord)) AS DistZuTPop FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId WHERE ApArtId = '.mysqli_real_escape_string($link, $ApArtId).' AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL ORDER BY DistzuTPop LIMIT 1');

// benötigte Datenstruktur aufbauen
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}

//$row = mysqli_fetch_assoc($result)

$return = json_encode($rows);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>