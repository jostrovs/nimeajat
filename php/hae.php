<?php
    $token = "NULL";

    if(isset($_GET['token'])){
        $token = $_GET['token'];
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