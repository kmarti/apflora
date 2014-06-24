<?php

$dbhost = 'localhost';
$dbuser = getenv('MYSQL_USER');	// müsste root-user sein?
$dbpass = getenv('MYSQL_PASSWORD');
$dbname = 'alexande_apflora';
$MysqlUser = getenv('MYSQL_USER');
$MysqlPasswort = getenv('MYSQL_PASSWORD');
$link = new mysqli("localhost", $MysqlUser, $MysqlPasswort, "alexande_apflora");

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