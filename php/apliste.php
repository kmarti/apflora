<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

//ist ap_arten true, sollen nur ap_arten angezeigt werden
$programm = $_GET["programm"];

// SQL-Anfrage ausführen
if ($programm == "programm_ap") {
	$result = mysqli_query($link, "SELECT Name, ApArtId FROM qryAp1 WHERE ApStatus BETWEEN 1 AND 3");
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$ApArtId = $r['ApArtId'];
		settype($ApArtId, "integer");
		$ap_name = $r['Name'];
		$row = array("ap_name" => $ap_name, "id" => $ApArtId);
	    $rows[] = $row;
	}
} else if ($programm == "programm_alle") {
	$result = mysqli_query($link, "SELECT Name, ApArtId FROM qryAp1");
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$ApArtId = $r['ApArtId'];
		settype($ApArtId, "integer");
		$ap_name = $r['Name'];
		$row = array("ap_name" => $ap_name, "id" => $ApArtId);
	    $rows[] = $row;
	}
} else {
	$result = mysqli_query($link, "SELECT IF(Deutsch Is Not Null, CONCAT(Name, ' (', Deutsch, ')   ', StatusText), CONCAT(Name, '   ', StatusText)) AS ApName, NR FROM ArtenDb_tblFloraSisf LEFT JOIN DomainFloraStatus ON Status = StatusWert WHERE NR not in (SELECT ApArtId FROM qryAp1) ORDER BY Name");
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$ApArtId = $r['NR'];
		settype($ApArtId, "integer");
		$ap_name = $r['ApName'];
		$row = array("ap_name" => $ap_name, "id" => $ApArtId);
	    $rows[] = $row;
	}
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