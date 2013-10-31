<?php
$dumpSettings = array(
    'compress' => 'GZIP',
    'no-data' => false,
    'add-drop-table' => false,
    'single-transaction' => true,
    'lock-tables' => false,
    'add-locks' => true,
    'extended-insert' => true
);

$dump = new Mysqldump('apflora', 'root', 'y3oYksFsQL49es9x', 'localhost', 'mysql', $dumpSettings);
$dump->start('dump.sql');

?>