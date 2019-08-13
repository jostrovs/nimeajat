<?php
header("Access-Control-Allow-Origin: *");

$auto_referees = file_get_contents('./autoreferees.txt');
echo $auto_referees;
?>