<?php
header("Access-Control-Allow-Origin: *");

$esteet = file_get_contents('./esteet.json');
echo $esteet;
?>
