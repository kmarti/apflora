<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("127.0.0.1", "root", "admin", "alexande_beob");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

mysqli_set_charset($link, "utf8");

$id = $_GET["id"];

// SQL-Anfrage ausführen
$result = mysqli_query($link, 'SELECT BeobId, Name, StatusText, NO_NOTE AS IdZdsf, IdEvab, TPopId, NO_ISFS AS NR, PROJET AS Projekt, NOM_COMMUNE AS RaumGde, DESC_LOCALITE AS Ort, xGIS AS X, yGIS AS Y, IF(M_NOTE>0, IF(M_NOTE>9, CONCAT(J_NOTE, ".", M_NOTE, ".", A_NOTE), CONCAT(J_NOTE, ".0", M_NOTE, ".", A_NOTE)), A_NOTE) AS Datum, A_NOTE AS Jahr, tblBeob.Autor FROM (ArtenDb_tblFloraSisf INNER JOIN tblBeob ON ArtenDb_tblFloraSisf.NR = tblBeob.NO_ISFS) LEFT JOIN DomainFloraStatus ON Status = StatusWert WHERE BeobId="'.$id.'"');
$row = mysqli_fetch_assoc($result);

//in json verwandeln
$return = json_encode($row);

print($return);

// Resultset freigeben
mysqli_free_result($result);

// Verbindung schliessen
mysqli_close($link);
?>