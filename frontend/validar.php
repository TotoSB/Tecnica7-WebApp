<?php
    error_reporting(E_ALL);
    var_dump($_POST);
    $destino= "dominefolcomatiass@gmail.com";
    $email= $_POST["Email"];
    $nombre= $_POST["nombre"];
    $mensajes= $_POST["comentario"];
    $nombre2 = $_POST["nombre2"];

    
    $contenido = "Nombre: " . $nombre . "\nCorreo: " . $email . "\nMensaje: " . $mensajes;
    // mail($destino, "Contacto", $contenido);
    
    // $to = 'admin@herramientasamedida.ml'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
// $email_subject = "HERRAMIENTASAMEDIDA-Contacto WEB:  $name";
// $email_body = "Recibiste un mensaje desde la herramientasamedida.\n\n"."\n\nName: $nombre\n\nEmail: $email\n\nMessage:\n $mensaje";
$headers = "From: noreply@example.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: noreply@example.com\n";	
$headers .= "X-Mailer : PHP/". phpversion();

$mail = @mail($destino,$headers,$contenido);
if ($mail){
    echo "<h4> Joya </h4>";
}
// return true;
?>