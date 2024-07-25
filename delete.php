<?php
include 'connect.php';

if (isset($_GET['deleteid'])) {
    $deleteid = $_GET['deleteid'];
    $stmt = $con->prepare("DELETE FROM `students` WHERE id=?");
    $stmt->bind_param("i", $deleteid);
    $stmt->execute();
    $stmt->close();
}

header("Location: display.php"); // Redirect to the main page after deleting
exit();
?>
