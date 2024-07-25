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
?>