<?php

include './CORSaccess/corsAccess.php';

$servername = "localhost"; // Replace with your server name
$username = "root"; // Replace with your DB username
$password = ""; // Replace with your DB password
$dbname = "online_platform"; // Replace with your DB name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["message" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT * FROM courses";
$result = $conn->query($sql);

$courses = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
}

echo json_encode($courses);

$conn->close();
?>