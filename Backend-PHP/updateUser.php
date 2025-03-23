<?php
include './CORSaccess/corsAccess.php';

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['session_id']) || !isset($_COOKIE['session_id']) || $_SESSION['session_id'] !== $_COOKIE['session_id']) {
    echo json_encode(["success" => false, "message" => "Session expired. Please log in again."]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "online_platform";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$email = $_SESSION['mail'] ?? null;
if (!$email) {
    echo json_encode(["success" => false, "message" => "User not authenticated."]);
    exit;
}

// Check if profile picture is uploaded
$profilePicData = null;
if (!empty($_FILES['pfp']['tmp_name'])) {
    $profilePicData = file_get_contents($_FILES['pfp']['tmp_name']);
}

// Get input data from request
$name = $_POST['name'] ?? null;
$mobile = $_POST['mobile'] ?? null;
$dob = $_POST['dob'] ?? null;
$gender = $_POST['gender'] ?? null;
$drno = $_POST['drno'] ?? null;
$street = $_POST['street'] ?? null;
$pincode = $_POST['pincode'] ?? null;
$city = $_POST['city'] ?? null;
$state = $_POST['state'] ?? null;

// Prepare SQL query
$sql = "UPDATE users SET name=?, mobile=?, dob=?, gender=?, drno=?, street=?, pincode=?, city=?, state=?";
$params = ["sssssssss", $name, $mobile, $dob, $gender, $drno, $street, $pincode, $city, $state];

if ($profilePicData) {
    $sql .= ", pfp=?";
    $params[0] .= "b";
    $params[] = $profilePicData;
}

$sql .= " WHERE email=?";
$params[0] .= "s";
$params[] = $email;

$stmt = $conn->prepare($sql);
$stmt->bind_param(...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating profile: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>