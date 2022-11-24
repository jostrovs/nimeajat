<?php

    $token = "NULL";
    if(isset($_GET['token'])){
        $token = $_GET['token'];
    }

    $found = false;

    // $token täytyy olla asetettu!
    require_once('./findToken.php');
    // Nyt on asetettu muuttujat $found, $filename_body, $filename ja $user_email

    if($found){
        if(file_exists($filename)){
            $content = file_get_contents($filename);
            echo $content;
        }
    } else {
        echo "{\"status\": \"file not found\"}";
    }
       

?>