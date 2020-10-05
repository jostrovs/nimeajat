<?php

    require_once('./tokenit.php');
    $user_email = "NULL";
    $found = false;

    $token_keys = array_keys($tokenit);
    foreach($token_keys as $key) {
        $value = $tokenit[$key];
        if($value === $token){
            $found = true;
            $user_email = $key;
        }
    }

    if(!$found){
        die("{\"status\": \"Tuntematon tunniste\"}");
    }

    $filename_body = "./files/" . $user_email . "-" . $token;
    $filename = $filename_body . ".txt";
    
?>