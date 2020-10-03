<?php
    $token = "NULL";
    $json = "NULL";

    if(isset($_POST['token'])){
        $token = $_POST['token'];
    }
    if(isset($_POST['json'])){
        $json = $_POST['json'];
    }

    $filename = "./files/" . $token . ".txt";

    if($token != "NULL" && $json != "NULL"){
        if(!file_exists($filename)){
            $myfile = fopen($filename, "w");
            fclose($myfile);
        }

        file_put_contents($filename, $json);
        echo "{\"status\": \"OK\"}";
    } else {
        echo "{\"status\": \"file or data not set\"}";
    }
       

?>