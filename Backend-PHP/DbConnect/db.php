<?php
// Database connection
$servername = "localhost";
$username = "root";  // Change if you have a different MySQL user
$password = "";      // Change if you have a password
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

?>