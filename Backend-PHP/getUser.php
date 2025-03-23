<?php
include './CORSaccess/corsAccess.php';

session_start();
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

// Validate session
if (!isset($_SESSION['session_id']) || !isset($_COOKIE['session_id']) || $_SESSION['session_id'] !== $_COOKIE['session_id']) {
    echo json_encode(["success" => false, "message" => "Session expired. Please log in again."]);
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Get email from session
$userEmail = $_SESSION['mail'] ?? null;
if (!$userEmail) {
    echo json_encode(["success" => false, "message" => "User not authenticated."]);
    exit;
}

// Fetch user details
$sql = "SELECT id, name, email, mobile, dob, gender, drno, street, pincode, city, state, pfp FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>
