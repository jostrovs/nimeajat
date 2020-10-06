<?php
    $token = "NULL";
    $json = "NULL";

    if(isset($_POST['token'])){
        $token = $_POST['token'];
    }
    if(isset($_POST['json'])){
        $json = $_POST['json'];
    }


    // $token täytyy olla asetettu!
    require_once('./findToken.php');
    // Nyt on asetettu muuttujat $found, $filename_body, $filename ja $user_email

    if($found && $token != "NULL" && $json != "NULL"){
        if(!file_exists($filename)){
            $myfile = fopen($filename, "w");
            fclose($myfile);
        } else {
            // Kirjoitetaan rolling file
            $deleted = false;
            $paikka = 0;
            $seuraava = 0;

            // Etsitään kohta, jossa ei ole tiedostoa
            for($i=1 ; $i<10 ; $i++){
                $ext = (string)$i;
                if(strlen($ext)<2) $ext = "0" . $ext;
                $testfile = $filename_body . "." . $ext;
                if(!file_exists($testfile)){
                    // Tässä on tyhjä kohta
                    $paikka = $i;
                    $seuraava = $i+1;
                    if($seuraava > 9) $seuraava = 1;
                }    
            }
            
            // Poistetaan seuraava tyhjä paikka
            $ext = (string)$seuraava;
            if(strlen($ext)<2) $ext = "0" . $ext;
            $fileToDelete = $filename_body . "." . $ext;
            
            if(file_exists($fileToDelete)){
                unlink($fileToDelete);
            }



            // Kopioidaan nykyiset asetukset rolling fileen
            $ext = (string)$paikka;
            if(strlen($ext)<2) $ext = "0" . $ext;
            $rollfile = $filename_body . "." . $ext;
            copy($filename, $rollfile);
        }

        file_put_contents($filename, $json);
        echo "{\"status\": \"OK\"}";
    } else {
        echo "{\"status\": \"file or data not set\"}";
    }
       

?>