<?php
// Database credentials
$host = "localhost"; // Replace with your host name
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$database = "bdl"; // Replace with your database name

// Create a database connection
$con = mysqli_connect($host, $username, $password, $database);

// Check connection
if (mysqli_connect_errno()) {
    die("Failed to connect to MySQL: " . mysqli_connect_error());
}
else{

    $a = $_POST['name'];
    $b = $_POST['mother'];
    $c = $_POST['father'];
    $d = $_POST['address'];
    $e = $_POST['mobile'];
    $f = $_POST['email'];
    $g = $_POST['college'];
    $h = $_POST['city'];
    $i = $_POST['degree'];
    $j = $_POST['branch'];
    $k = $_POST['semester'];
    $l = $_POST['id'];
    $m = $_POST['fee'];
    $n = $_POST['bank'];
    $o = $_POST['dd'];
    $p = $_POST['date'];
    $q = $_POST['ref'];
    
    $stmt = $con->prepare("INSERT INTO `students` (name, mother, father, address, mobile, email, college, city, degree, branch, semester, id, fee, bank, dd, date, ref)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("sssssssssssiisiss", $a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $o, $p, $q);
  $stmt->execute(); 
}
?>
