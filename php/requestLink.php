<?php

$email = "";
$token = "";
if(isset($_GET['email'])){
    $email = $_GET['email'];
} else {
    exit("{\"status\": \"Sähköposti puuttuu\"}");
}

require_once('credentials.php');
require_once('./PHPMailer/PHPMailerAutoload.php');
require_once('./tokenit.php');
$found = false;

$token_keys = array_keys($tokenit);
foreach($token_keys as $key) {
    $value = $tokenit[$key];
    if($key === $email){
        $found = true;
        $token = $value;
    }
}

if(!$found){
    exit("{\"status\": \"Tuntematon sähköpostiosoite\"}");
}

function sendEmail($to, $token){
    global $mailUsername, $mailPassword; // Nämä on pakko olla
    $subject = "Linkki nimeäjien työkaluun";
    $body = "Hei!\r\nTässä on linkki, jolla saat käyttöön asetusten talletuksen palvelimelle nimeäjien työkalusivulla:\r\n"
          . "https://www.lentopallotuomarit.fi/nimeajat/?token=" . $token . "\r\n"
          . "Linkissä oleva 'token' on tunniste, jonka perusteella tiedetään, mihin tiedostoon juuri sinun asetuksesi "
          . "kuuluu tallettaa.\r\n\r\n"
          . "Älä vastaa tähän viestiin, vaan ongelmatapauksissa ota yhteyttä jostrovs@gmail.com.\r\n-Jori\r\n";
     
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
    $mail->SetFrom ('tarkkailu@lentopallotuomarit.fi', 'Jori');
    $mail->AddBCC ( 'jostrovs@gmail.com', 'Jori'); 
    $mail->Subject = $subject;
    $mail->ContentType = 'text/plain'; 
    $mail->IsHTML(false);
     
    $mail->Body = $body; 
    // you may also use $mail->Body = file_get_contents('your_mail_template.html');
     
    $mail->AddAddress ($to, $to);     
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

sendEmail($email, $token);
exit("{\"status\": \"OK\"}");
?>