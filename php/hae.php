<?php
    $token = "NULL";

    require_once('./tokenit.php');

    if(isset($_GET['token'])){
        $token = $_GET['token'];
    }

    $found = false;
 
    foreach($tokenit as $email => $token_value) {
        if($token_value == $token) $found = true;
    }

    if(!$found){
        die("{\"status\": \"Tuntematon tunniste\"}");
    }

    $filename = "./files/" . $token . ".txt";

    if($token != "NULL"){
        if(file_exists($filename)){
            $content = readfile($filename);
            echo $content[0];
        }
    } else {

        echo "{\"status\": \"file not found\"}";
    }
       

?>