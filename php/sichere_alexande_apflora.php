<?php

$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'y3oYksFsQL49es9x';
$dbname = 'alexande_apflora';

//$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');
//mysql_select_db($dbname);

$link = new mysqli("apflora.ch", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

$backupFile = $dbname . date("Y-m-d-H-i-s") . '.gz';
//$command = "mysqldump --opt -h $dbhost -u$dbuser -p$dbpass $dbname | gzip > $backupFile";
exec("mysqldump --opt -h $dbhost -u$dbuser -p$dbpass $dbname | gzip > $backupFile");
//$command = "mysqldump --opt -u $dbuser -p$dbpass $dbname | gzip > $backupFile";
//$command = "mysqldump --opt -u $dbuser -p$dbpass $dbname > $backupFile";
//$command = "mysqldump --opt alexande_apflora > $backupFile";
print($backupFile);
//system($command);
//mysql_close($conn);
mysqli_close($link);

?>