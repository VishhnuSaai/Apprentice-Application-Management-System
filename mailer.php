<?php
require 'PHPMailerAutoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();

$mail = new PHPMailer;
$name = $_COOKIE['name'] ?? '';
$mom = $_COOKIE['mother'] ?? '';
$dad = $_COOKIE['father'] ?? '';
$address = $_COOKIE['address'] ?? '';
$mobile = $_COOKIE['mobile'] ?? '';
$eml = $_COOKIE['eml'] ?? '';
$college = $_COOKIE['college'] ?? '';
$city = $_COOKIE['city'] ?? '';
$degree = $_COOKIE['degree'] ?? '';
$branch = $_COOKIE['branch'] ?? '';
$semester = $_COOKIE['semester'] ?? '';
$id = $_COOKIE['id'] ?? '';
$fee = $_COOKIE['fee'] ?? '';
$bank = $_COOKIE['bank'] ?? '';
$dd = $_COOKIE['dd'] ?? '';
$date = $_COOKIE['date'] ?? '';
$ref = $_COOKIE['ref'] ?? '';

$message = '<b>Application Form of</b> ' . $name . ' :<br><br><br> 
<b>PERSONAL DETAILS:</b><br><br><br>
<b>Name:</b> ' . $name . '<br><b>Mother\'s Name:</b> ' . $mom . '<br><b>Father\'s Name:</b> ' . $dad . '<br><b>Address:</b> ' . $address . '<br><b>Mobile Number:</b> ' . $mobile . '<br><b>Email ID of Applicant:</b> ' . $eml . '<br><br><br>
<b>COLLEGE DETAILS:</b><BR><BR><BR>
<b>College:</b> ' . $college . '<br><b>City of college:</b> ' . $city . '<br><b>Degree:</b> ' . $degree . '<br><b>Branch:</b> ' . $branch . '<br><b>Semester:</b> ' . $semester . '<br><br><br>
<b>BANK AND DD DETAILS:</b><br><br><br>
<b>Fee:</b> ' . $fee . '<br><b>Bank:</b> ' . $bank . '<br><b>Dated:</b> ' . $date . '<br><b>DD No.:</b> ' . $dd . '<br><b>Reference:</b> ' . $ref;

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'vishhnusaai@gmail.com'; // your Gmail account username
$mail->Password = 'jugulykajpjaqajx'; // your Gmail password
$mail->SMTPSecure = 'tls';
$mail->Port = 587; // Gmail SMTP port

$mail->setFrom($mail->Username,'BHARATH DYNAMICS LIMITED' );
$mail->addAddress($eml, $name); // recipient email address and name
$mail->addReplyTo($mail->Username,'BHARATH DYNAMICS LIMITED');

$mail->isHTML(true);
$mail->Subject = 'Internship/Project work/Apprentice Application of ' . $name;
$mail->Body = $message;

if (!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
    exit;
}

echo '<b>You are welcome! I am glad to hear that your registration form has been sent to the executive. I hope you receive a positive response from BDL soon. If you have any more questions or need further assistance, feel free to ask. Good luck with your registration process!';
// header('location:reg.php'); 
?>
