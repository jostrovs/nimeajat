<?php

require_once('credentials.php');
require_once('./PHPMailer/PHPMailerAutoload.php');

function sendEmail($to, $token, $name){
    global $mailUsername, $mailPassword; // Nämä on pakko olla
    $subject = "Kirjautumislinkki tarkkailuraporttisivulle";
    $body = "Hei!\r\nTässä on kirjautumislinkkisi tarkkailuraporttisivulle:\r\nhttps://www.lentopalloerotuomarit.fi/tuomaritarkkailu/?token=" . $token . "\r\n\r\nÄlä vastaa tähän viestiin, vaan ongelmatapauksissa ota yhteyttä jostrovs@gmail.com.\r\n-Jori\r\n";
     
    $mail = new PHPMailer();
    
    $mail->IsSMTP();                       // telling the class to use SMTP
     
    $mail->SMTPDebug = 0;                  
    // 0 = no output, 1 = errors and messages, 2 = messages only.
     
    $mail->SMTPAuth = true;                // enable SMTP authentication 
    $mail->SMTPSecure = "tls";              // sets the prefix to the servier
    $mail->Host = "mail.zoner.fi";        // sets Gmail as the SMTP server
    $mail->Port = 587;                     // set the SMTP port for the GMAIL 
     
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
 
    $mail->CharSet = 'utf-8';
    $mail->SetFrom ('tarkkailu@lentopalloerotuomarit.fi', 'Jori');
    $mail->AddBCC ( 'jostrovs@gmail.com', 'Jori'); 
    $mail->Subject = $subject;
    $mail->ContentType = 'text/plain'; 
    $mail->IsHTML(false);
     
    $mail->Body = $body; 
    // you may also use $mail->Body = file_get_contents('your_mail_template.html');
     
    $mail->AddAddress ($to, $name);     
    // you may also use this format $mail->AddAddress ($recipient);
     
    if(!$mail->Send()) 
    {
        $error_message = "Mailer Error: " . $mail->ErrorInfo;
        echo $error_message;        
    } else 
    {
        $error_message = "Successfully sent!";
    } 
    return $error_message;
}

$email  = $_GET["email"];
$email = strtolower($email);

?>