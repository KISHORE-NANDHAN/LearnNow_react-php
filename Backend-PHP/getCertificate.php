<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

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

// Fetch user certifications
$sql = "SELECT id, email, course_id, Course_Name, Certificate_Credential, issued_at FROM user_certifications where id = ?";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $certificates = [];

    while ($row = $result->fetch_assoc()) {
        $certificates[] = $row;
    }

    echo json_encode($certificates);
} else {
    echo json_encode(["message" => "No certifications found."]);
}

// Close connection
$conn->close();
?>
